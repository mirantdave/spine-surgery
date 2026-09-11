import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Patient, SpineLevel } from '../types/spine';
import { 
  RotateCw, 
  Maximize2, 
  Eye,
  Layers,
  Sparkles,
  Info,
  CheckCircle2
} from 'lucide-react';

export interface SelectedPartInfo {
  name: string;
  category: 'implant' | 'bone' | 'neural' | 'decompression';
  level?: string;
  details: string;
  specs?: string;
  status?: string;
}

interface Surgery3DViewerProps {
  patient: Patient;
  height?: string | number;
  interactiveHUD?: boolean;
  variant?: 'inline' | 'full';
  onExpand?: () => void;
}

export const Surgery3DViewer: React.FC<Surgery3DViewerProps> = ({
  patient,
  height = '100%',
  interactiveHUD = true,
  variant = 'inline',
  onExpand,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [selectedPart, setSelectedPart] = useState<SelectedPartInfo | null>(null);
  const [isAutoRotate, setIsAutoRotate] = useState<boolean>(true);
  const [isXRayMode, setIsXRayMode] = useState<boolean>(false);
  const [showNeural, setShowNeural] = useState<boolean>(true);
  const [showImplants, setShowImplants] = useState<boolean>(true);
  const [showBone, setShowBone] = useState<boolean>(true);

  // References to mutable Three.js objects
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const boneGroupRef = useRef<THREE.Group | null>(null);
  const implantGroupRef = useRef<THREE.Group | null>(null);
  const neuralGroupRef = useRef<THREE.Group | null>(null);
  const decompressionGroupRef = useRef<THREE.Group | null>(null);
  const boneMaterialsRef = useRef<THREE.MeshStandardMaterial[]>([]);

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth || 360;
    const heightPx = container.clientHeight || (typeof height === 'number' ? height : 200);

    // 1. Clean Apple Clinical Studio Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0xfcfcfd);

    // 2. Camera setup - auto framed for spine geometry
    const camera = new THREE.PerspectiveCamera(42, width / heightPx, 0.1, 1000);
    cameraRef.current = camera;

    // 3. High precision WebGL renderer
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true, 
      powerPreference: 'high-performance' 
    });
    renderer.setSize(width, heightPx);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 4. Smooth Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controlsRef.current = controls;
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.85; // gentle, elegant presentation turntable
    controls.maxDistance = 80;
    controls.minDistance = 6;
    controls.target.set(0, 0, 0);

    // 5. Studio Lighting (Warm Key + Clean Fill + Surgical Rim)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.95);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.25);
    keyLight.position.set(16, 22, 18);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xf0f9ff, 0.65);
    fillLight.position.set(-16, 10, -14);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0x0071e3, 0.45); // Subtle surgical blue rim
    rimLight.position.set(0, -18, -16);
    scene.add(rimLight);

    // 6. Soft Circular Shadow Plate (Replaces cluttered wireframe grids)
    const shadowGeo = new THREE.CircleGeometry(16, 32);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x0f172a,
      transparent: true,
      opacity: 0.05,
      depthWrite: false
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = -10.5;
    scene.add(shadowMesh);

    // 7. Geometry Groups
    const boneGroup = new THREE.Group();
    const implantGroup = new THREE.Group();
    const neuralGroup = new THREE.Group();
    const decompressionGroup = new THREE.Group();

    boneGroupRef.current = boneGroup;
    implantGroupRef.current = implantGroup;
    neuralGroupRef.current = neuralGroup;
    decompressionGroupRef.current = decompressionGroup;

    scene.add(boneGroup);
    scene.add(implantGroup);
    scene.add(neuralGroup);
    scene.add(decompressionGroup);

    boneMaterialsRef.current = [];

    // 8. Build Spine Construct for Patient
    const region = patient.spineRegion || 'lumbar';
    const levels = patient.affectedLevels || ['L4', 'L5'];
    const procedure = patient.plannedProcedure || 'Spinal Instrumentation';

    const modelBounds = buildSpineModel(region, levels, procedure, {
      boneGroup,
      implantGroup,
      neuralGroup,
      decompressionGroup,
      boneMaterials: boneMaterialsRef.current
    });

    // Auto-adjust camera distance based on construct size
    const cameraDist = modelBounds.isLongConstruct ? 38 : (region === 'cervical' ? 22 : 26);
    camera.position.set(cameraDist * 0.55, 3.5, cameraDist * 0.85);
    controls.target.set(0, 0, 0);
    controls.update();

    // 9. Raycasting for Click Inspection
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePointerDown = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);

      if (intersects.length > 0) {
        for (const hit of intersects) {
          if (hit.object.userData && hit.object.userData.partInfo) {
            setSelectedPart(hit.object.userData.partInfo);
            break;
          }
        }
      }
    };

    renderer.domElement.addEventListener('pointerdown', handlePointerDown);

    // 10. Animation Loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // 11. Responsive resize
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w === 0 || h === 0) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('pointerdown', handlePointerDown);
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
    };
  }, [patient, height]);

  // Synchronize dynamic state
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.autoRotate = isAutoRotate;
    }
  }, [isAutoRotate]);

  useEffect(() => {
    if (boneGroupRef.current) boneGroupRef.current.visible = showBone;
  }, [showBone]);

  useEffect(() => {
    if (implantGroupRef.current) implantGroupRef.current.visible = showImplants;
  }, [showImplants]);

  useEffect(() => {
    if (neuralGroupRef.current) neuralGroupRef.current.visible = showNeural;
  }, [showNeural]);

  useEffect(() => {
    boneMaterialsRef.current.forEach(mat => {
      if (isXRayMode) {
        mat.transparent = true;
        mat.opacity = 0.32;
        mat.color.setHex(0x93c5fd);
      } else {
        mat.transparent = false;
        mat.opacity = 1.0;
        mat.color.setHex(0xf7f5ee);
      }
    });
  }, [isXRayMode]);

  const setCameraView = (view: 'AP' | 'LATERAL' | 'POSTERIOR' | 'AXIAL') => {
    if (!cameraRef.current || !controlsRef.current) return;
    setIsAutoRotate(false);
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    const dist = patient.plannedProcedure.includes('Scoliosis') ? 38 : 25;

    switch (view) {
      case 'AP':
        camera.position.set(0, 0, dist);
        controls.target.set(0, 0, 0);
        break;
      case 'LATERAL':
        camera.position.set(dist, 0, 0);
        controls.target.set(0, 0, 0);
        break;
      case 'POSTERIOR':
        camera.position.set(0, 3, -dist);
        controls.target.set(0, 0, 0);
        break;
      case 'AXIAL':
        camera.position.set(0, dist, 0);
        controls.target.set(0, 0, 0);
        break;
    }
    controls.update();
  };

  // Implant counts for quick summary
  const isCervical = patient.spineRegion === 'cervical';
  const isScoliosis = patient.plannedProcedure.includes('Scoliosis');
  const isDecompressionOnly = patient.plannedProcedure.toLowerCase().includes('microscopic') || patient.plannedProcedure.toLowerCase().includes('discectomy without fusion');
  
  const implantSummaryText = isDecompressionOnly
    ? 'Pure Decompression • No Hardware'
    : isCervical
    ? '1 Anterior Plate • 4 Screws • 1 PEEK Cage'
    : isScoliosis
    ? `${(patient.affectedLevels.length || 6) * 2} Pedicle Screws • 2 Long Rods • Crosslink`
    : `${(patient.affectedLevels.length || 2) * 2} Pedicle Screws • 2 Contoured Rods • 1 Cage`;

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: typeof height === 'number' ? `${height}px` : height,
      borderRadius: variant === 'inline' ? '12px' : '16px',
      overflow: 'hidden',
      background: 'linear-gradient(135deg, #fcfcfd 0%, #f4f6f9 100%)',
      border: '1px solid rgba(0, 113, 227, 0.15)',
      boxShadow: variant === 'inline' ? '0 2px 10px rgba(0, 0, 0, 0.03)' : '0 4px 24px rgba(0, 0, 0, 0.08)'
    }}>
      {/* 3D WebGL Canvas */}
      <div ref={mountRef} style={{ width: '100%', height: '100%' }} />

      {/* Top Header Pill - Clean Apple Minimalist Style */}
      <div style={{
        position: 'absolute',
        top: '10px',
        left: '12px',
        right: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        pointerEvents: 'none',
        zIndex: 10
      }}>
        {/* Construct Badge */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.94)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          border: '1px solid rgba(0, 113, 227, 0.2)',
          padding: variant === 'inline' ? '3px 9px' : '6px 12px',
          borderRadius: '999px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
          pointerEvents: 'auto',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <span style={{
            width: '7px',
            height: '7px',
            borderRadius: '50%',
            background: '#0071e3',
            boxShadow: '0 0 6px #0071e3'
          }} />
          <span style={{ fontSize: '11px', fontWeight: 700, color: '#1d1d1f' }}>
            3D Executed Spine
          </span>
          <span style={{
            background: 'rgba(0, 113, 227, 0.08)',
            color: '#0071e3',
            fontSize: '10px',
            fontWeight: 700,
            padding: '1px 6px',
            borderRadius: '999px'
          }}>
            {patient.affectedLevels.join('-') || patient.spineRegion}
          </span>
        </div>

        {/* Minimal Control Buttons */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          pointerEvents: 'auto'
        }}>
          <button
            onClick={() => setIsAutoRotate(!isAutoRotate)}
            style={{
              border: 'none',
              background: isAutoRotate ? 'rgba(0, 113, 227, 0.12)' : 'rgba(255, 255, 255, 0.92)',
              color: isAutoRotate ? '#0071e3' : '#6e6e73',
              padding: '4px 8px',
              borderRadius: '999px',
              fontSize: '10px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              borderWidth: '1px',
              borderStyle: 'solid',
              borderColor: isAutoRotate ? 'rgba(0, 113, 227, 0.3)' : 'rgba(0, 0, 0, 0.08)',
              backdropFilter: 'blur(8px)',
              transition: 'all 0.15s ease'
            }}
            title={isAutoRotate ? "Pause 360° rotation" : "Start 360° rotation"}
          >
            <RotateCw size={11} className={isAutoRotate ? 'spin-slow' : ''} />
            {variant !== 'inline' && <span>360°</span>}
          </button>

          {onExpand && (
            <button
              onClick={onExpand}
              style={{
                border: '1px solid rgba(0, 0, 0, 0.08)',
                background: 'rgba(255, 255, 255, 0.92)',
                color: '#1d1d1f',
                padding: '4px 8px',
                borderRadius: '999px',
                fontSize: '10px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                backdropFilter: 'blur(8px)',
                boxShadow: '0 1px 4px rgba(0,0,0,0.04)'
              }}
              title="Expand 3D Model to Full Screen"
            >
              <Maximize2 size={11} />
              <span>Full 3D</span>
            </button>
          )}
        </div>
      </div>

      {/* Fullscreen Variant: View Controls and Layer Toggles */}
      {variant === 'full' && (
        <div style={{
          position: 'absolute',
          top: '52px',
          left: '12px',
          display: 'flex',
          gap: '4px',
          background: 'rgba(255, 255, 255, 0.92)',
          backdropFilter: 'blur(10px)',
          padding: '3px',
          borderRadius: '10px',
          border: '1px solid #e2e8f0',
          zIndex: 10
        }}>
          {(['POSTERIOR', 'LATERAL', 'AP', 'AXIAL'] as const).map((view) => (
            <button
              key={view}
              onClick={() => setCameraView(view)}
              style={{
                border: 'none',
                background: 'transparent',
                padding: '3px 8px',
                borderRadius: '6px',
                fontSize: '10.5px',
                fontWeight: 600,
                color: '#1d1d1f',
                cursor: 'pointer'
              }}
            >
              {view === 'POSTERIOR' ? 'Surgical' : view}
            </button>
          ))}
          <button
            onClick={() => setIsXRayMode(!isXRayMode)}
            style={{
              border: 'none',
              background: isXRayMode ? '#0071e3' : 'transparent',
              color: isXRayMode ? '#ffffff' : '#6e6e73',
              padding: '3px 8px',
              borderRadius: '6px',
              fontSize: '10.5px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            X-Ray
          </button>
        </div>
      )}

      {/* Bottom Minimal Info Pill */}
      <div style={{
        position: 'absolute',
        bottom: '8px',
        left: '12px',
        right: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        pointerEvents: 'none',
        zIndex: 10
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.92)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(0, 0, 0, 0.08)',
          borderRadius: '999px',
          padding: '2px 10px',
          fontSize: '10px',
          fontWeight: 600,
          color: '#475569',
          boxShadow: '0 1px 4px rgba(0, 0, 0, 0.04)',
          pointerEvents: 'auto',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <span style={{ color: '#0071e3' }}>●</span>
          <span>{implantSummaryText}</span>
        </div>

        {variant === 'inline' && (
          <span style={{
            fontSize: '9.5px',
            color: '#94a3b8',
            pointerEvents: 'none'
          }}>
            Drag to rotate • Click parts
          </span>
        )}
      </div>

      {/* Selected 3D Anatomical / Implant Detail Card */}
      {interactiveHUD && selectedPart && (
        <div style={{
          position: 'absolute',
          bottom: variant === 'inline' ? '32px' : '14px',
          right: '12px',
          maxWidth: variant === 'inline' ? '260px' : '320px',
          background: 'rgba(255, 255, 255, 0.96)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(0, 113, 227, 0.25)',
          borderRadius: '12px',
          padding: '10px 12px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.12)',
          zIndex: 20
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
            <span style={{
              background: selectedPart.category === 'implant' ? '#0071e3' :
                          selectedPart.category === 'neural' ? '#d97706' :
                          selectedPart.category === 'decompression' ? '#059669' : '#64748b',
              color: '#ffffff',
              fontSize: '9px',
              fontWeight: 700,
              padding: '1px 6px',
              borderRadius: '999px',
              textTransform: 'uppercase'
            }}>
              {selectedPart.category}
            </span>
            <button
              onClick={() => setSelectedPart(null)}
              style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#86868b', fontSize: '14px', lineHeight: 1 }}
            >
              ×
            </button>
          </div>

          <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#1d1d1f', marginBottom: '2px' }}>
            {selectedPart.name}
          </div>
          <p style={{ fontSize: '10.5px', color: '#475569', lineHeight: '1.35', margin: '0 0 4px' }}>
            {selectedPart.details}
          </p>

          {selectedPart.specs && (
            <div style={{
              fontSize: '9.5px',
              color: '#0071e3',
              fontFamily: 'var(--font-mono)',
              borderTop: '1px solid #f1f5f9',
              paddingTop: '3px',
              marginTop: '3px'
            }}>
              {selectedPart.specs}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ============================================================================
// THREE.JS SPINE GEOMETRY GENERATOR (CLEAN, ANATOMICAL & MINIMAL)
// ============================================================================

interface BuildModelParams {
  boneGroup: THREE.Group;
  implantGroup: THREE.Group;
  neuralGroup: THREE.Group;
  decompressionGroup: THREE.Group;
  boneMaterials: THREE.MeshStandardMaterial[];
}

function buildSpineModel(
  region: string,
  levels: SpineLevel[],
  procedure: string,
  { boneGroup, implantGroup, neuralGroup, decompressionGroup, boneMaterials }: BuildModelParams
): { isLongConstruct: boolean } {
  // Surgical Sapphire Titanium PBR Material (Apple Metallic Blue)
  const titaniumMaterial = new THREE.MeshStandardMaterial({
    color: 0x2563eb,
    metalness: 0.88,
    roughness: 0.18,
  });

  // Polished Chromium-Cobalt Spinal Rods
  const chromeRodMaterial = new THREE.MeshStandardMaterial({
    color: 0xcfd8dc,
    metalness: 0.94,
    roughness: 0.12,
  });

  // PEEK Interbody Fusion Cage with Bone Graft Core
  const peekCageMaterial = new THREE.MeshStandardMaterial({
    color: 0xfef08a,
    roughness: 0.35,
    metalness: 0.08,
  });

  // Golden Amber Neural Thecal Sac / Spinal Cord
  const thecalSacMaterial = new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    roughness: 0.3,
    metalness: 0.05,
    transparent: true,
    opacity: 0.9,
  });

  // Fibrocartilaginous Intervertebral Disc
  const discMaterial = new THREE.MeshStandardMaterial({
    color: 0x94a3b8,
    roughness: 0.65,
    metalness: 0.05,
  });

  // Clean Decompression Corridor
  const decompressionMaterial = new THREE.MeshStandardMaterial({
    color: 0x10b981,
    transparent: true,
    opacity: 0.45,
    emissive: 0x059669,
    emissiveIntensity: 0.3
  });

  // Determine Levels Stack
  let displayLevels: SpineLevel[] = [];
  const isScoliosis = procedure.toLowerCase().includes('scoliosis') || region === 'thoracic';
  
  if (region === 'cervical') {
    displayLevels = ['C3', 'C4', 'C5', 'C6', 'C7'];
  } else if (isScoliosis) {
    displayLevels = ['T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12', 'L1'];
  } else {
    // Lumbar stack
    displayLevels = ['L2', 'L3', 'L4', 'L5', 'S1'];
  }

  const vertebraHeight = region === 'cervical' ? 2.0 : (isScoliosis ? 2.2 : 3.4);
  const vertebraRadius = region === 'cervical' ? 2.3 : (isScoliosis ? 2.6 : 3.8);
  const discHeight = region === 'cervical' ? 0.9 : 1.2;
  const totalStep = vertebraHeight + discHeight;

  // Center vertical alignment
  const yOffset = ((displayLevels.length - 1) * totalStep) / 2;
  const thecalPoints: THREE.Vector3[] = [];

  // Generate each Vertebra in stack
  displayLevels.forEach((levelName, idx) => {
    const yPos = yOffset - idx * totalStep;
    const isTargeted = levels.includes(levelName);

    thecalPoints.push(new THREE.Vector3(0, yPos, 0.2));

    // 1. Vertebral Body with Natural Ivory Tone
    const boneMaterial = new THREE.MeshStandardMaterial({
      color: 0xf7f5ee, // Clean ivory bone
      roughness: 0.5,
      metalness: 0.06,
    });
    boneMaterials.push(boneMaterial);

    // Sculpted kidney-oval vertebral body
    const bodyGeo = new THREE.CylinderGeometry(vertebraRadius, vertebraRadius * 1.04, vertebraHeight, 32);
    const bodyMesh = new THREE.Mesh(bodyGeo, boneMaterial);
    bodyMesh.scale.set(1.12, 1, 0.88); // Anatomical kidney-oval
    bodyMesh.position.set(0, yPos, 0.6);
    bodyMesh.castShadow = true;
    bodyMesh.receiveShadow = true;
    bodyMesh.userData = {
      partInfo: {
        name: `Vertebra ${levelName}`,
        category: 'bone',
        level: levelName,
        details: `${levelName} vertebral body with intact cortical endplates.`,
        status: isTargeted ? 'Operated Level' : 'Adjacent Segment'
      }
    };
    boneGroup.add(bodyMesh);

    // 2. Spinous Process (Posterior Projection)
    const spinousGeo = new THREE.ConeGeometry(region === 'cervical' ? 0.7 : 1.2, region === 'cervical' ? 2.2 : 3.8, 16);
    const spinousMesh = new THREE.Mesh(spinousGeo, boneMaterial);
    spinousMesh.rotation.x = -Math.PI / 2 + 0.22;
    spinousMesh.position.set(0, yPos - 0.2, -vertebraRadius * 0.9 - 0.8);
    spinousMesh.castShadow = true;
    spinousMesh.userData = {
      partInfo: {
        name: `Spinous Process ${levelName}`,
        category: 'bone',
        level: levelName,
        details: `Posterior midline spinous process.`
      }
    };
    boneGroup.add(spinousMesh);

    // 3. Bilateral Transverse Processes
    const tpGeo = new THREE.CylinderGeometry(0.35, 0.6, vertebraRadius * 1.3, 16);
    const tpLeft = new THREE.Mesh(tpGeo, boneMaterial);
    tpLeft.rotation.z = Math.PI / 2.2;
    tpLeft.position.set(-vertebraRadius * 1.2, yPos + 0.2, -0.4);
    boneGroup.add(tpLeft);

    const tpRight = new THREE.Mesh(tpGeo, boneMaterial);
    tpRight.rotation.z = -Math.PI / 2.2;
    tpRight.position.set(vertebraRadius * 1.2, yPos + 0.2, -0.4);
    boneGroup.add(tpRight);

    // 4. Intervertebral Disc
    if (idx < displayLevels.length - 1) {
      const nextLevel = displayLevels[idx + 1];
      const discY = yPos - (vertebraHeight / 2) - (discHeight / 2);
      const isOperatedDisc = levels.includes(levelName) && levels.includes(nextLevel);

      const discGeo = new THREE.CylinderGeometry(vertebraRadius * 0.95, vertebraRadius * 0.95, discHeight, 32);
      const discMesh = new THREE.Mesh(discGeo, discMaterial);
      discMesh.scale.set(1.1, 1, 0.88);
      discMesh.position.set(0, discY, 0.6);
      discMesh.userData = {
        partInfo: {
          name: `Disc ${levelName}-${nextLevel}`,
          category: 'bone',
          level: `${levelName}-${nextLevel}`,
          details: isOperatedDisc 
            ? `Operated disc space prepared for biological interbody fusion.`
            : `Intact natural intervertebral disc.`
        }
      };
      boneGroup.add(discMesh);

      // Insert Interbody Fusion Cage if operated level
      if (isOperatedDisc && (procedure.includes('TLIF') || procedure.includes('ACDF') || procedure.includes('Fusion') || procedure.includes('PLIF'))) {
        const cageWidth = region === 'cervical' ? 2.0 : 3.0;
        const cageGeo = new THREE.BoxGeometry(cageWidth, discHeight * 0.9, 1.8);
        const cageMesh = new THREE.Mesh(cageGeo, peekCageMaterial);
        cageMesh.position.set(0, discY, 0.6);
        cageMesh.castShadow = true;
        cageMesh.userData = {
          partInfo: {
            name: `${region === 'cervical' ? 'Cervical' : 'TLIF'} PEEK Interbody Cage`,
            category: 'implant',
            level: `${levelName}-${nextLevel}`,
            details: `Radiolucent PEEK cage packed with autologous local bone graft. Restores disc height.`,
            specs: region === 'cervical' ? '12x14mm, 6° Lordosis' : '10x28mm, 4° Lordosis'
          }
        };
        implantGroup.add(cageMesh);
      }
    }

    // 5. Executed Surgical Implants (Screws / Plates / Decompression)
    if (isTargeted) {
      if (region === 'cervical' && procedure.includes('ACDF')) {
        // Anterior Cervical Plate (ACDF)
        const plateGeo = new THREE.BoxGeometry(2.2, totalStep * 1.1, 0.35);
        const plateMesh = new THREE.Mesh(plateGeo, titaniumMaterial);
        plateMesh.position.set(0, yPos - totalStep * 0.35, vertebraRadius * 0.9 + 0.8);
        plateMesh.userData = {
          partInfo: {
            name: `Anterior Cervical Titanium Plate`,
            category: 'implant',
            level: levelName,
            details: `Low-profile anterior cervical titanium plate fixed with bicortical locking screws.`,
            specs: `Medtronic Atlantis Vision Elite`
          }
        };
        implantGroup.add(plateMesh);
      } else if (!procedure.toLowerCase().includes('microscopic') || procedure.toLowerCase().includes('fusion')) {
        // Posterior Pedicle Screws (TLIF / PSF / Lumbar Fusion)
        const pedicleSpacing = vertebraRadius * 0.68;

        // Left Screw
        const leftScrew = createPedicleScrew(titaniumMaterial, `${levelName} Left Pedicle Screw`, levelName, 'Left');
        leftScrew.position.set(-pedicleSpacing, yPos + 0.2, -vertebraRadius * 0.35);
        leftScrew.rotation.set(-0.18, -0.2, 0);
        implantGroup.add(leftScrew);

        // Right Screw
        const rightScrew = createPedicleScrew(titaniumMaterial, `${levelName} Right Pedicle Screw`, levelName, 'Right');
        rightScrew.position.set(pedicleSpacing, yPos + 0.2, -vertebraRadius * 0.35);
        rightScrew.rotation.set(-0.18, 0.2, 0);
        implantGroup.add(rightScrew);

        // Decompression Fenestration Window
        const decompressGeo = new THREE.BoxGeometry(2.0, vertebraHeight * 0.65, 1.4);
        const decompressMesh = new THREE.Mesh(decompressGeo, decompressionMaterial);
        decompressMesh.position.set(-0.6, yPos, -vertebraRadius * 0.65);
        decompressMesh.userData = {
          partInfo: {
            name: `Decompression Corridor (${levelName})`,
            category: 'decompression',
            level: levelName,
            details: `Transforaminal laminectomy and facetectomy window. Full nerve root decompression.`,
            specs: `Zeiss KINEVO 900 • Hemostasis complete`
          }
        };
        decompressionGroup.add(decompressMesh);
      } else {
        // Pure Microdiscectomy corridor
        const microGeo = new THREE.BoxGeometry(2.2, vertebraHeight * 0.7, 1.4);
        const microMesh = new THREE.Mesh(microGeo, decompressionMaterial);
        microMesh.position.set(-0.5, yPos, -vertebraRadius * 0.65);
        microMesh.userData = {
          partInfo: {
            name: `Microdiscectomy Window (${levelName})`,
            category: 'decompression',
            level: levelName,
            details: `Minimally invasive interlaminar window. Exiting and traversing nerve roots freed.`,
            specs: `Zeiss Pentero 900 • Tubular Retractor 18mm`
          }
        };
        decompressionGroup.add(microMesh);
      }
    }
  });

  // Connecting Longitudinal Rods (Lumbar & Thoracic)
  if (region !== 'cervical' && levels.length >= 2 && !procedure.toLowerCase().includes('microscopic discectomy without')) {
    const firstLvlIdx = displayLevels.indexOf(levels[0]);
    const lastLvlIdx = displayLevels.indexOf(levels[levels.length - 1]);

    if (firstLvlIdx !== -1 && lastLvlIdx !== -1) {
      const startY = yOffset - firstLvlIdx * totalStep + 0.2;
      const endY = yOffset - lastLvlIdx * totalStep + 0.2;
      const rodLength = Math.abs(startY - endY) + 2.4;
      const rodY = (startY + endY) / 2;
      const pedicleSpacing = vertebraRadius * 0.68;

      const rodGeo = new THREE.CylinderGeometry(0.36, 0.36, rodLength, 24);

      // Left Rod
      const leftRod = new THREE.Mesh(rodGeo, chromeRodMaterial);
      leftRod.position.set(-pedicleSpacing, rodY, -vertebraRadius * 0.78);
      leftRod.castShadow = true;
      leftRod.userData = {
        partInfo: {
          name: `Left Longitudinal Spinal Rod`,
          category: 'implant',
          level: `${levels[0]}-${levels[levels.length - 1]}`,
          details: `5.5 mm pre-contoured titanium rod providing rigid posterior stabilization.`,
          specs: `Diameter: 5.5mm • Ti6Al4V ELI`
        }
      };
      implantGroup.add(leftRod);

      // Right Rod
      const rightRod = new THREE.Mesh(rodGeo, chromeRodMaterial);
      rightRod.position.set(pedicleSpacing, rodY, -vertebraRadius * 0.78);
      rightRod.castShadow = true;
      rightRod.userData = {
        partInfo: {
          name: `Right Longitudinal Spinal Rod`,
          category: 'implant',
          level: `${levels[0]}-${levels[levels.length - 1]}`,
          details: `5.5 mm pre-contoured titanium rod locked at 12 Nm torque.`,
          specs: `Diameter: 5.5mm • Ti6Al4V ELI`
        }
      };
      implantGroup.add(rightRod);

      // Transverse Crosslink for Scoliosis / Multi-level
      if (isScoliosis || levels.length >= 3) {
        const crossLinkGeo = new THREE.CylinderGeometry(0.28, 0.28, pedicleSpacing * 2, 16);
        const crossLink = new THREE.Mesh(crossLinkGeo, titaniumMaterial);
        crossLink.rotation.z = Math.PI / 2;
        crossLink.position.set(0, rodY, -vertebraRadius * 0.78);
        crossLink.userData = {
          partInfo: {
            name: `Transverse Cross-Link`,
            category: 'implant',
            level: 'Mid-Construct',
            details: `Cross-link preventing rotational deformation.`,
            specs: `Medtronic CD Horizon`
          }
        };
        implantGroup.add(crossLink);
      }
    }
  }

  // Thecal Sac & Exiting Nerve Roots
  if (thecalPoints.length > 1) {
    const thecalCurve = new THREE.CatmullRomCurve3(thecalPoints);
    const thecalGeo = new THREE.TubeGeometry(thecalCurve, 48, 1.2, 16, false);
    const thecalMesh = new THREE.Mesh(thecalGeo, thecalSacMaterial);
    thecalMesh.userData = {
      partInfo: {
        name: `Thecal Sac (Dura Mater & Cauda Equina)`,
        category: 'neural',
        details: `Intact thecal sac encasing CSF and nerve roots. Baseline MEP/SSEP stable.`,
        specs: `Dural integrity verified watertight.`
      }
    };
    neuralGroup.add(thecalMesh);

    // Bilateral exiting roots
    displayLevels.forEach((levelName, idx) => {
      const yPos = yOffset - idx * totalStep;
      const rootLength = 3.0;
      const rootGeo = new THREE.CylinderGeometry(0.22, 0.16, rootLength, 12);

      const leftRoot = new THREE.Mesh(rootGeo, thecalSacMaterial);
      leftRoot.rotation.z = Math.PI / 3;
      leftRoot.position.set(-1.6, yPos - 0.4, 0.2);
      leftRoot.userData = {
        partInfo: {
          name: `${levelName} Left Exiting Nerve Root`,
          category: 'neural',
          level: levelName,
          details: `Left exiting ${levelName} nerve root visualized and protected.`
        }
      };
      neuralGroup.add(leftRoot);

      const rightRoot = new THREE.Mesh(rootGeo, thecalSacMaterial);
      rightRoot.rotation.z = -Math.PI / 3;
      rightRoot.position.set(1.6, yPos - 0.4, 0.2);
      rightRoot.userData = {
        partInfo: {
          name: `${levelName} Right Exiting Nerve Root`,
          category: 'neural',
          level: levelName,
          details: `Right exiting ${levelName} nerve root visualized and safeguarded.`
        }
      };
      neuralGroup.add(rightRoot);
    });
  }

  return { isLongConstruct: isScoliosis };
}

// Clean Pedicle Screw with Tulip Head
function createPedicleScrew(
  material: THREE.Material,
  name: string,
  level: string,
  side: 'Left' | 'Right'
): THREE.Group {
  const group = new THREE.Group();

  // Screw Shaft
  const shankLength = 4.2;
  const shankGeo = new THREE.CylinderGeometry(0.34, 0.24, shankLength, 20);
  const shankMesh = new THREE.Mesh(shankGeo, material);
  shankMesh.rotation.x = Math.PI / 2;
  shankMesh.position.z = shankLength / 2;
  shankMesh.castShadow = true;
  group.add(shankMesh);

  // Tulip Head
  const tulipGeo = new THREE.CylinderGeometry(0.62, 0.55, 1.0, 20);
  const tulipMesh = new THREE.Mesh(tulipGeo, material);
  tulipMesh.position.z = -0.4;
  tulipMesh.castShadow = true;
  group.add(tulipMesh);

  // Set Screw Cap
  const capGeo = new THREE.CylinderGeometry(0.42, 0.42, 0.35, 6);
  const capMesh = new THREE.Mesh(capGeo, material);
  capMesh.position.z = -0.8;
  group.add(capMesh);

  group.userData = {
    partInfo: {
      name,
      category: 'implant',
      level,
      details: `${side} transpedicular titanium screw placed with biplanar fluoroscopy guidance. Insertional torque > 3.5 Nm.`,
      specs: `6.5 x 45mm • Ti6Al4V ELI`
    }
  };

  return group;
}
