import { Canvas } from "@react-three/fiber";
import { OrbitControls, Grid, Text } from "@react-three/drei";
import type {
  Model,
  BoxModel,
  SphereModel,
  CylinderModel,
} from "../utils/models";
import type { SunPosition } from "../utils/sunPosition";

interface SceneProps {
  models: Model[];
  sunPosition: SunPosition;
  onModelSelect?: (id: string) => void;
}

// Model Component factory
const ModelComponent = ({
  model,
  onSelect,
}: {
  model: Model;
  onSelect?: () => void;
}) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onSelect) onSelect();
  };

  switch (model.type) {
    case "box":
      return <Box model={model} onClick={handleClick} />;
    case "sphere":
      return <Sphere model={model} onClick={handleClick} />;
    case "cylinder":
      return <Cylinder model={model} onClick={handleClick} />;
    default:
      return null;
  }
};

// Box Component
const Box = ({
  model,
  onClick,
}: {
  model: BoxModel;
  onClick: (e: React.MouseEvent) => void;
}) => {
  const {
    width,
    height,
    depth,
    position,
    rotation,
    castShadow,
    receiveShadow,
  } = model;

  // Ensure the box is positioned correctly on the Z=0 plane
  const adjustedZ = height / 2;

  return (
    <mesh
      position={[position.x, position.y, adjustedZ]}
      rotation={[rotation.x, rotation.y, rotation.z]}
      castShadow={castShadow}
      receiveShadow={receiveShadow}
      onClick={onClick}
    >
      <boxGeometry args={[width, depth, height]} />
      <meshStandardMaterial color="#B0B0B0" roughness={0.7} metalness={0.1} />
    </mesh>
  );
};

// Sphere Component
const Sphere = ({
  model,
  onClick,
}: {
  model: SphereModel;
  onClick: (e: React.MouseEvent) => void;
}) => {
  const {
    radius,
    widthSegments,
    heightSegments,
    position,
    rotation,
    castShadow,
    receiveShadow,
  } = model;

  const minZ = radius;
  const adjustedZ = Math.max(position.z, minZ);

  return (
    <mesh
      position={[position.x, position.y, adjustedZ]}
      rotation={[rotation.x, rotation.y, rotation.z]}
      castShadow={castShadow}
      receiveShadow={receiveShadow}
      onClick={onClick}
    >
      <sphereGeometry args={[radius, widthSegments, heightSegments]} />
      <meshStandardMaterial color="#B0B0B0" roughness={0.7} metalness={0.1} />
    </mesh>
  );
};

// Cylinder Component
const Cylinder = ({
  model,
  onClick,
}: {
  model: CylinderModel;
  onClick: (e: React.MouseEvent) => void;
}) => {
  const {
    radiusTop,
    radiusBottom,
    height,
    radialSegments,
    position,
    rotation,
    castShadow,
    receiveShadow,
  } = model;

  const minZ = height / 2;
  const adjustedZ = Math.max(position.z, minZ);

  return (
    <mesh
      position={[position.x, position.y, adjustedZ]}
      rotation={[rotation.x, rotation.y, rotation.z]}
      castShadow={castShadow}
      receiveShadow={receiveShadow}
      onClick={onClick}
    >
      <cylinderGeometry
        args={[radiusTop, radiusBottom, height, radialSegments]}
      />
      <meshStandardMaterial color="#B0B0B0" roughness={0.7} metalness={0.1} />
    </mesh>
  );
};

// Sunlight Component
const Sunlight = ({ sunPosition }: { sunPosition: SunPosition }) => {
  const { azimuth, altitude } = sunPosition;

  const r = 10;
  const horizontalRadius = r * Math.cos(altitude);

  const x = -horizontalRadius * Math.sin(azimuth);
  const y = -horizontalRadius * Math.cos(azimuth);
  const z = r * Math.sin(altitude);

  return (
    <>
      <directionalLight
        position={[x, y, z]}
        intensity={2.5}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
        shadow-bias={0}
      >
        <orthographicCamera attach="shadow-camera" args={[-10, 10, 10, -10]} />
      </directionalLight>
      <ambientLight intensity={0.2} />
      {/* Add a visible sphere to show sun position */}
      <mesh position={[x, y, z]}>
        <sphereGeometry args={[0.3]} />
        <meshBasicMaterial color="yellow" />
      </mesh>
      {/* Debug text to show sun position */}
      <group position={[0, 0, 0.01]}>
        <Text position={[0, 2, 0]} color="black" fontSize={0.5}>
          {`Sun Position: ${Math.round(x * 100) / 100}, ${
            Math.round(y * 100) / 100
          }, ${Math.round(z * 100) / 100}`}
        </Text>
        <Text position={[0, 1, 0]} color="black" fontSize={0.5}>
          {`Azimuth: ${Math.round(
            (azimuth * 180) / Math.PI
          )}°, Altitude: ${Math.round((altitude * 180) / Math.PI)}°`}
        </Text>
      </group>
    </>
  );
};

// Ground plane for shadows
const Ground = () => {
  return (
    <mesh position={[0, 0, 0]} rotation={[0, 0, 0]} receiveShadow>
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial
        transparent={false}
        opacity={1}
        depthWrite={true}
        side={2}
      />
    </mesh>
  );
};

// Add AxesHelper component
const AxesHelper = () => {
  return (
    <group>
      {/* X axis - red */}
      <mesh position={[5, 0, 0]}>
        <boxGeometry args={[10, 0.1, 0.1]} />
        <meshBasicMaterial color="red" />
      </mesh>
      {/* Y axis - green */}
      <mesh position={[0, 5, 0]}>
        <boxGeometry args={[0.1, 10, 0.1]} />
        <meshBasicMaterial color="green" />
      </mesh>
      {/* Z axis - blue */}
      <mesh position={[0, 0, 5]}>
        <boxGeometry args={[0.1, 0.1, 10]} />
        <meshBasicMaterial color="blue" />
      </mesh>
      {/* Labels */}
      <Text position={[10.5, 0, 0]} color="red" fontSize={1}>
        X
      </Text>
      <Text position={[0, 10.5, 0]} color="green" fontSize={1}>
        Y
      </Text>
      <Text position={[0, 0, 10.5]} color="blue" fontSize={1}>
        Z
      </Text>
    </group>
  );
};

// Cardinal Directions Helper
const CardinalDirections = () => {
  return (
    <group position={[0, 0, 0.01]}>
      {" "}
      {/* Slightly above ground to avoid z-fighting */}
      {/* North */}
      <Text position={[0, 8, 0]} color="black" fontSize={1}>
        N
      </Text>
      {/* South */}
      <Text position={[0, -8, 0]} color="black" fontSize={1}>
        S
      </Text>
      {/* East */}
      <Text position={[8, 0, 0]} color="black" fontSize={1}>
        E
      </Text>
      {/* West */}
      <Text position={[-8, 0, 0]} color="black" fontSize={1}>
        W
      </Text>
      {/* Direction lines */}
      <group>
        {/* North-South line */}
        <mesh position={[0, 0, 0]}>
          <planeGeometry args={[0.1, 16]} />
          <meshBasicMaterial color="black" side={2} />
        </mesh>
        {/* East-West line */}
        <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <planeGeometry args={[0.1, 16]} />
          <meshBasicMaterial color="black" side={2} />
        </mesh>
      </group>
    </group>
  );
};

const Scene3D = ({ models, sunPosition, onModelSelect }: SceneProps) => {
  return (
    <Canvas
      shadows
      camera={{ position: [10, -10, 10], up: [0, 0, 1], fov: 50 }}
      onCreated={({ camera }) => camera.up.set(0, 0, 1)}
    >
      <color attach="background" args={["#ffffff"]} />
      <Sunlight sunPosition={sunPosition} />
      <AxesHelper />
      <CardinalDirections />
      <Grid
        infiniteGrid
        fadeDistance={30}
        fadeStrength={1}
        cellSize={1}
        sectionSize={2}
        cellThickness={0.5}
        sectionThickness={1}
        cellColor="#000000"
        sectionColor="#000000"
        rotation={[Math.PI / 2, 0, 0]}
      />
      {models.map((model) => (
        <ModelComponent
          key={model.id}
          model={model}
          onSelect={() => onModelSelect && onModelSelect(model.id)}
        />
      ))}
      <Ground />
      <OrbitControls
        minPolarAngle={0}
        maxPolarAngle={Math.PI / 2}
        enableDamping={false}
        target={[0, 0, 0]}
        makeDefault
      />
    </Canvas>
  );
};

export default Scene3D;
