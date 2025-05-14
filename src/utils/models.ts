export type ModelType = "box" | "sphere" | "cylinder";

export interface Vector3 {
  x: number;
  y: number;
  z: number;
}

export interface ModelBase {
  id: string;
  type: ModelType;
  position: Vector3;
  rotation: Vector3;
  castShadow: boolean;
  receiveShadow: boolean;
}

export interface BoxModel extends ModelBase {
  type: "box";
  width: number; // x轴方向（东西）
  depth: number; // y轴方向（南北）
  height: number; // z轴方向（垂直）
}

export interface SphereModel extends ModelBase {
  type: "sphere";
  radius: number;
  widthSegments?: number;
  heightSegments?: number;
}

export interface CylinderModel extends ModelBase {
  type: "cylinder";
  radiusTop: number;
  radiusBottom: number;
  height: number;
  radialSegments?: number;
}

export type Model = BoxModel | SphereModel | CylinderModel;

// Create a new model with default values
export function createModel(type: ModelType, id: string): Model {
  const baseModel: ModelBase = {
    id,
    type,
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    castShadow: true,
    receiveShadow: true,
  };

  switch (type) {
    case "box":
      return {
        ...baseModel,
        type: "box",
        width: 1, // x轴方向（东西）
        depth: 1, // y轴方向（南北）
        height: 1, // z轴方向（垂直）
      };
    case "sphere":
      return {
        ...baseModel,
        type: "sphere",
        radius: 0.5,
        widthSegments: 16,
        heightSegments: 16,
      };
    case "cylinder":
      return {
        ...baseModel,
        type: "cylinder",
        radiusTop: 0.5,
        radiusBottom: 0.5,
        height: 1,
        radialSegments: 16,
      };
  }
}
