// From: https://codesandbox.io/p/sandbox/re-using-gltfs-dix1y?file=%2Fpackage.json%3A10%2C3-10%2C23
// via DRCMDA!
"use dom";

import { Canvas } from "@react-three/fiber";
import {
  useGLTF,
  AccumulativeShadows,
  RandomizedLight,
  Environment,
  CameraControls,
} from "@react-three/drei";
import { CSSProperties } from "react";

export default function App({
  style,
}: {
  style?: CSSProperties;
  dom?: import("expo/dom").DOMProps;
}) {
  return (
    <Canvas style={style} shadows camera={{ position: [5, 0, 5], fov: 35 }}>
      <ambientLight intensity={Math.PI} />
      <Shoe position={[0, 0, 0.85]} />
      <Shoe position={[0, 0, -0.85]} rotation={[0, 0.5, Math.PI]} scale={-1} />
      <AccumulativeShadows
        position={[0, -0.5, 0]}
        temporal
        frames={100}
        alphaTest={0.75}
        opacity={0.9}
      >
        <RandomizedLight radius={6} position={[5, 5, -10]} bias={0.001} />
      </AccumulativeShadows>
      <CameraControls />
      <Environment preset="city" />
    </Canvas>
  );
}

function Shoe(props) {
  const { nodes, materials } = useGLTF("/shoe.gltf");
  return (
    <group {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.shoe.geometry}
        material={materials.laces}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.shoe_1.geometry}
        material={materials.mesh}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.shoe_2.geometry}
        material={materials.caps}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.shoe_3.geometry}
        material={materials.inner}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.shoe_4.geometry}
        material={materials.sole}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.shoe_5.geometry}
        material={materials.stripes}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.shoe_6.geometry}
        material={materials.band}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.shoe_7.geometry}
        material={materials.patch}
      />
    </group>
  );
}
