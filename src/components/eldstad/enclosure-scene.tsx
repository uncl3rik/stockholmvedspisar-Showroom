'use client';
import { Component, Suspense, useEffect, useMemo, useRef, useState, type ReactNode, type ComponentRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ContactShadows, Environment, Html, Lightformer, OrbitControls, useGLTF } from '@react-three/drei';
import { Box3, MathUtils, MeshStandardMaterial, PointLight, Vector3 } from 'three';
import type { KariConstruction } from '@/data/kari-construction';
import type { Placement } from '@/lib/fireplace-design';
import { roomLayout } from '@/lib/eldstad/room';
import { calculateGeometry, type BoxPart } from '@/lib/eldstad/geometry';
import { faceRepeats, splitShell, hollowInsert } from '@/lib/eldstad/surfaces';
import { colors, finishes, type EnclosureConfig } from '@/lib/eldstad/configuration';
import { useSurfaceTextures, type SurfaceTextures } from './surface-textures';

export type CameraView = 'front' | 'angle' | 'close';
export type RoomPreview = { area: number | null; placement?: Placement };
export type SceneOptions = { boards: boolean; fire: boolean; camera: CameraView; cameraRevision: number };

function Part({ part, config, textures, boards, tooSmall }: {part: BoxPart; config: EnclosureConfig; textures: SurfaceTextures | null; boards: boolean; tooSmall: boolean}) {
  const invalidate = useThree(s => s.invalidate);
  const shell = part.kind === 'shell';
  const materials = useMemo(() => {
    const finish = finishes[config.finish];
    const repeats = faceRepeats(part.size, textures?.meters ?? [1, 1]);
    return repeats.map(([u, v]) => {
      const material = new MeshStandardMaterial({
        color: shell ? colors[config.color].hex : part.kind === 'board' ? tooSmall ? '#c16f6b' : '#b5b0a6' : part.kind === 'glass' ? '#344445' : part.kind === 'wood' ? '#111312' : '#202221',
        roughness: shell ? finish.roughness : part.kind === 'glass' ? 0.12 : 0.85,
        metalness: shell ? finish.metalness : part.kind === 'glass' ? 0.55 : part.kind === 'insert' ? 0.5 : 0,
        emissive: part.kind === 'board' && tooSmall ? '#512222' : '#000000', emissiveIntensity: 0.25,
      });
      if (shell && textures) for (const key of ['map', 'normalMap', 'roughnessMap'] as const) {
        const source = textures[key];
        if (source) { const clone = source.clone(); clone.repeat.set(u, v); clone.needsUpdate = true; material[key] = clone; }
      }
      return material;
    });
  }, [part, config.finish, config.color, shell, textures, tooSmall]);
  useEffect(() => () => materials.forEach(m => { m.map?.dispose(); m.normalMap?.dispose(); m.roughnessMap?.dispose(); m.dispose(); }), [materials]);
  const target = part.kind === 'glass' ? 0.25 : boards && shell && part.position[0] < 0 ? 0.12 : 1;
  useEffect(() => { invalidate(); }, [target, invalidate]);
  useFrame((_, delta) => {
    for (const m of materials) {
      const opacity = MathUtils.damp(m.opacity, target, 9, Math.min(delta, 0.1));
      m.opacity = Math.abs(opacity - target) < 0.002 ? target : opacity;
      const transparent = m.opacity < 1;
      if (m.transparent !== transparent) { m.transparent = transparent; m.needsUpdate = true; }
      m.depthWrite = !transparent;
      if (m.opacity !== target) invalidate();
    }
  });
  return <mesh position={part.position} material={materials}><boxGeometry args={part.size}/></mesh>;
}

class ModelBoundary extends Component<{children: ReactNode; fallback: ReactNode}, {failed: boolean}> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? this.props.fallback : this.props.children; }
}
function KariModel({ path, body }: {path: string; body: BoxPart}) {
  // Drei's pinned public Draco decoder is fetched only for compressed models.
  const { scene } = useGLTF(path);
  const model = useMemo(() => {
    const clone = scene.clone(true);
    const center = new Box3().setFromObject(clone).getCenter(new Vector3());
    clone.position.sub(center);
    return clone;
  }, [scene]);
  return <group position={body.position}><primitive object={model} dispose={null}/></group>;
}

function Fire({ glass, tunnel }: {glass: BoxPart; tunnel: boolean}) {
  const light = useRef<PointLight>(null);
  const material = useRef<MeshStandardMaterial>(null);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const flicker = 0.8 + Math.sin(t * 13) * 0.12 + Math.sin(t * 23.7) * 0.08;
    if (light.current) light.current.intensity = flicker * 3;
    if (material.current) material.current.emissiveIntensity = flicker * 2;
  });
  return <group position={[glass.position[0], glass.position[1] - glass.size[1] * 0.2, glass.position[2] + (tunnel ? 0.06 : -0.06)]}>
    <pointLight ref={light} color="#ff792c" distance={2.5} decay={2} position={[0, 0.1, tunnel ? -0.15 : 0.15]}/>
    <mesh rotation={[0, tunnel ? Math.PI : 0, 0]}><planeGeometry args={[glass.size[0] * 0.75, glass.size[1] * 0.4]}/><meshStandardMaterial ref={material} color="#ec5c16" emissive="#ff6c17" emissiveIntensity={2} roughness={1}/></mesh>
  </group>;
}

function CameraRig({ options, height, glass, inRoom }: {options: SceneOptions; height: number; glass?: BoxPart; inRoom: boolean}) {
  const ref = useRef<ComponentRef<typeof OrbitControls>>(null);
  const { camera, invalidate, size } = useThree();
  useEffect(() => {
    const controls = ref.current;
    if (!controls) return;
    const y = options.camera === 'close' && glass ? glass.position[1] : height / 2000;
    const distance = Math.max(3.8, height / 1000 * 1.9) * (size.width < 500 ? 1.2 : 1);
    controls.target.set(0, y, 0);
    camera.position.set(options.camera === 'angle' ? distance * 0.52 : 0, y + (options.camera === 'angle' ? 0.8 : 0.05), options.camera === 'close' ? 1.7 : distance);
    camera.lookAt(controls.target); controls.update(); invalidate();
  }, [options.camera, options.cameraRevision, height, glass, camera, invalidate, size.width]);
  return <OrbitControls ref={ref} makeDefault enablePan={false} minDistance={1.1} maxDistance={10} minPolarAngle={0.35} maxPolarAngle={Math.PI / 2 - 0.015} minAzimuthAngle={inRoom ? 0 : -Math.PI / 2.5} maxAzimuthAngle={Math.PI / 2.5}/>;
}

function SceneContent({ data, config, options, room }: {data: KariConstruction; config: EnclosureConfig; options: SceneOptions; room?: RoomPreview}) {
  const layout = room ? roomLayout(room.area, room.placement, config.width, config.depth) : null;
  const geometry = useMemo(() => calculateGeometry(data, config), [data, config]);
  const textures = useSurfaceTextures(config.finish);
  const parts = useMemo(() => geometry.parts.flatMap(splitShell), [geometry]);
  const body = geometry.parts.find(p => p.id === 'insert');
  const glass = geometry.parts.find(p => p.id === 'glass-front');
  const rearGlass = geometry.parts.find(p => p.id === 'glass-back');
  const applianceParts = useMemo(() => parts.filter(p => p.kind === 'insert' || p.kind === 'glass' || p.id === 'integrated-wood'), [parts]);
  const placeholderParts = useMemo(() => applianceParts.flatMap(part => part.id === 'insert' && glass ? hollowInsert(part, glass, data.tunnel) : [part]), [applianceParts, glass, data.tunnel]);
  const placeholder = placeholderParts.map(part => <Part key={part.id} part={part} config={config} textures={null} boards={false} tooSmall={false}/>);
  const board = parts.find(p => p.id === 'board-left');
  return <>
    <color attach="background" args={['#222422']}/>
    <ambientLight intensity={0.6}/><directionalLight position={[3, 6, 4]} intensity={2.2}/>
    <Environment resolution={128} frames={1}><Lightformer intensity={3} position={[0, 5, 3]} rotation={[Math.PI / 2, 0, 0]} scale={[5, 5, 1]}/><Lightformer intensity={2} position={[-4, 2, 2]} rotation={[0, Math.PI / 2, 0]} scale={[3, 4, 1]}/></Environment>
    <group rotation={[0, layout?.rotation ?? 0, 0]}>
    {parts.filter(p => !applianceParts.includes(p)).map(part => <Part key={part.id} part={part} config={config} textures={textures} boards={options.boards} tooSmall={geometry.tooSmall}/>)}
    {data.glbPath && body ? <ModelBoundary key={data.glbPath} fallback={placeholder}><Suspense fallback={placeholder}><KariModel path={data.glbPath} body={body}/></Suspense></ModelBoundary> : placeholder}
    {options.fire && glass && <Fire glass={glass} tunnel={false}/>}
    {options.fire && rearGlass && <Fire glass={rearGlass} tunnel/>}
    {options.boards && <>
      {board && <Html position={[board.position[0], board.position[1], config.depth / 2000 + 0.06]} center className="construction-label">Brandskiva</Html>}
      <Html position={[-config.width / 4000, config.height / 1000 - 0.15, config.depth / 2000 + 0.06]} center className="construction-label">Stomme / omramning</Html>
      {glass && <Html position={[glass.position[0], glass.position[1], glass.position[2] + 0.04]} center className="construction-label">Insats</Html>}
    </>}
    </group>
    {layout ? <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[layout.left + layout.side / 2, -0.015, layout.rear + layout.side / 2]}><planeGeometry args={[layout.side,layout.side]}/><meshStandardMaterial color="#73746e" roughness={1}/></mesh>
      <mesh position={[layout.left + layout.side / 2, 1.5, layout.rear]}><boxGeometry args={[layout.side,3,0.05]}/><meshStandardMaterial color="#93948c" roughness={1}/></mesh>
      <mesh position={[layout.left, 1.5, layout.rear + layout.side / 2]}><boxGeometry args={[0.05,3,layout.side]}/><meshStandardMaterial color="#85877f" roughness={1}/></mesh>
      {layout.illustrationTooSmall && <Html position={[0,3,0]} center className="construction-label">Rumsytan är liten för skissen</Html>}
    </> : <><mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.015, 0]}><planeGeometry args={[20, 20]}/><meshStandardMaterial color="#73746e" roughness={1}/></mesh>
    <mesh position={[0, 3, -1.5]}><boxGeometry args={[20, 6, 0.05]}/><meshStandardMaterial color="#93948c" roughness={1}/></mesh></>}
    <ContactShadows key={JSON.stringify(config)} position={[0, -0.005, 0]} opacity={0.5} scale={10} blur={2.5} far={4} resolution={256} frames={1}/>
    <CameraRig options={options} height={config.height} glass={glass} inRoom={Boolean(room)}/>
  </>;
}
export default function EnclosureScene({ data, config, options, room }: {data: KariConstruction; config: EnclosureConfig; options: SceneOptions; room?: RoomPreview}) {
  const [lost, setLost] = useState(false);
  if (lost) return <div className="scene-loading" role="status">3D-vyn pausades. Ladda om sidan för att försöka igen. Dina val finns kvar.</div>;
  return <Canvas frameloop={options.fire ? 'always' : 'demand'} dpr={[1, 1.5]} camera={{ position: [3.3, 2.3, 4.8], fov: 42 }} gl={{ antialias: true }} fallback={<div className="scene-loading">WebGL saknas i webbläsaren. Du kan fortfarande ändra och spara alla val.</div>} onCreated={({ gl }) => { gl.domElement.addEventListener('webglcontextlost', () => setLost(true), { once: true }); }}>
    <SceneContent data={data} config={config} options={options} room={room}/>
  </Canvas>;
}
