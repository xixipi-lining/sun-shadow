import { useState } from "react";
import type { Model, ModelType } from "../utils/models";
import { createModel } from "../utils/models";
import { v4 as uuidv4 } from "uuid";

interface ModelListProps {
  models: Model[];
  selectedModelId: string | null;
  onAddModel: (model: Model) => void;
  onUpdateModel: (model: Model) => void;
  onDeleteModel: (id: string) => void;
  onSelectModel: (id: string) => void;
}

const ModelList = ({
  models,
  selectedModelId,
  onAddModel,
  onUpdateModel,
  onDeleteModel,
  onSelectModel,
}: ModelListProps) => {
  const [newModelType, setNewModelType] = useState<ModelType>("box");

  const handleAddModel = () => {
    const newModel = createModel(newModelType, uuidv4());
    onAddModel(newModel);
  };

  const handleUpdateVector3 = (
    model: Model,
    property: "position" | "rotation",
    axis: "x" | "y" | "z",
    value: number
  ) => {
    const updatedModel = {
      ...model,
      [property]: {
        ...model[property],
        [axis]: value,
      },
    };
    onUpdateModel(updatedModel);
  };

  const renderModelSpecificProperties = (model: Model) => {
    switch (model.type) {
      case "box":
        return (
          <>
            <div className="grid grid-cols-3 gap-2 mb-2">
              <div>
                <label className="block text-xs text-gray-500">Width (X)</label>
                <input
                  type="number"
                  step="0.1"
                  value={model.width}
                  onChange={(e) =>
                    onUpdateModel({
                      ...model,
                      width: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full p-1 text-sm border rounded"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500">Depth (Y)</label>
                <input
                  type="number"
                  step="0.1"
                  value={model.depth}
                  onChange={(e) =>
                    onUpdateModel({
                      ...model,
                      depth: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full p-1 text-sm border rounded"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500">
                  Height (Z)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={model.height}
                  onChange={(e) =>
                    onUpdateModel({
                      ...model,
                      height: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full p-1 text-sm border rounded"
                />
              </div>
            </div>
          </>
        );
      case "sphere":
        return (
          <div className="mb-2">
            <label className="block text-xs text-gray-500">Radius</label>
            <input
              type="number"
              step="0.1"
              value={model.radius}
              onChange={(e) =>
                onUpdateModel({
                  ...model,
                  radius: parseFloat(e.target.value) || 0,
                })
              }
              className="w-full p-1 text-sm border rounded"
            />
          </div>
        );
      case "cylinder":
        return (
          <>
            <div className="grid grid-cols-3 gap-2 mb-2">
              <div>
                <label className="block text-xs text-gray-500">
                  Top Radius
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={model.radiusTop}
                  onChange={(e) =>
                    onUpdateModel({
                      ...model,
                      radiusTop: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full p-1 text-sm border rounded"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500">
                  Bottom Radius
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={model.radiusBottom}
                  onChange={(e) =>
                    onUpdateModel({
                      ...model,
                      radiusBottom: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full p-1 text-sm border rounded"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500">Height</label>
                <input
                  type="number"
                  step="0.1"
                  value={model.height}
                  onChange={(e) =>
                    onUpdateModel({
                      ...model,
                      height: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full p-1 text-sm border rounded"
                />
              </div>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4">Models</h2>

      {/* Add new model */}
      <div className="flex items-center mb-4 gap-2">
        <select
          value={newModelType}
          onChange={(e) => setNewModelType(e.target.value as ModelType)}
          className="flex-grow p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="box">Box</option>
          <option value="sphere">Sphere</option>
          <option value="cylinder">Cylinder</option>
        </select>
        <button
          onClick={handleAddModel}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Add
        </button>
      </div>

      {/* Model list */}
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {models.map((model) => (
          <div
            key={model.id}
            className={`p-3 border rounded-md ${
              selectedModelId === model.id ? "border-blue-500 bg-blue-50" : ""
            }`}
            onClick={() => onSelectModel(model.id)}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium capitalize">{model.type}</h3>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteModel(model.id);
                }}
                className="text-red-500 hover:text-red-600 focus:outline-none"
              >
                Delete
              </button>
            </div>

            {/* Model specific properties */}
            {renderModelSpecificProperties(model)}

            {/* Position */}
            <div className="mb-2">
              <h4 className="text-sm font-medium mb-1">Position</h4>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs text-gray-500">X</label>
                  <input
                    type="number"
                    step="0.1"
                    value={model.position.x}
                    onChange={(e) =>
                      handleUpdateVector3(
                        model,
                        "position",
                        "x",
                        parseFloat(e.target.value) || 0
                      )
                    }
                    className="w-full p-1 text-sm border rounded"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500">Y</label>
                  <input
                    type="number"
                    step="0.1"
                    value={model.position.y}
                    onChange={(e) =>
                      handleUpdateVector3(
                        model,
                        "position",
                        "y",
                        parseFloat(e.target.value) || 0
                      )
                    }
                    className="w-full p-1 text-sm border rounded"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500">Z</label>
                  <input
                    type="number"
                    step="0.1"
                    value={model.position.z}
                    onChange={(e) =>
                      handleUpdateVector3(
                        model,
                        "position",
                        "z",
                        parseFloat(e.target.value) || 0
                      )
                    }
                    className="w-full p-1 text-sm border rounded"
                  />
                </div>
              </div>
            </div>

            {/* Rotation */}
            <div className="mb-2">
              <h4 className="text-sm font-medium mb-1">Rotation (rad)</h4>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs text-gray-500">X</label>
                  <input
                    type="number"
                    step="0.1"
                    value={model.rotation.x}
                    onChange={(e) =>
                      handleUpdateVector3(
                        model,
                        "rotation",
                        "x",
                        parseFloat(e.target.value) || 0
                      )
                    }
                    className="w-full p-1 text-sm border rounded"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500">Y</label>
                  <input
                    type="number"
                    step="0.1"
                    value={model.rotation.y}
                    onChange={(e) =>
                      handleUpdateVector3(
                        model,
                        "rotation",
                        "y",
                        parseFloat(e.target.value) || 0
                      )
                    }
                    className="w-full p-1 text-sm border rounded"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500">Z</label>
                  <input
                    type="number"
                    step="0.1"
                    value={model.rotation.z}
                    onChange={(e) =>
                      handleUpdateVector3(
                        model,
                        "rotation",
                        "z",
                        parseFloat(e.target.value) || 0
                      )
                    }
                    className="w-full p-1 text-sm border rounded"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}

        {models.length === 0 && (
          <div className="text-center text-gray-500 py-6">
            No models added yet. Add a model to get started.
          </div>
        )}
      </div>
    </div>
  );
};

export default ModelList;
