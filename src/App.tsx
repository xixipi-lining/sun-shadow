import { useState, useEffect, useCallback, useRef } from "react";
import "./App.css";
import Scene3D from "./components/Scene3D";
import TimeSpaceCoordinates from "./components/TimeSpaceCoordinates";
import ModelList from "./components/ModelList";
import type { Model } from "./utils/models";
import { calculateSunPosition } from "./utils/sunPosition";
import type { SunPosition } from "./utils/sunPosition";

function App() {
  // Time-space coordinates state
  const [latitude, setLatitude] = useState<number>(31.2304); // Shanghai
  const [longitude, setLongitude] = useState<number>(121.4737);
  const [date, setDate] = useState<Date>(new Date());

  // Sidebar width state
  const [sidebarWidth, setSidebarWidth] = useState(320); // 默认宽度 320px
  const [isDragging, setIsDragging] = useState(false);

  // Models state
  const [models, setModels] = useState<Model[]>([]);
  const [selectedModelId, setSelectedModelId] = useState<string | null>(null);

  // Sun position state
  const [sunPosition, setSunPosition] = useState<SunPosition>({
    azimuth: 0,
    altitude: Math.PI / 4, // Default 45 degrees above horizon
  });

  // Add ref for tracking initial drag position
  const dragStartRef = useRef({
    startX: 0,
    startWidth: 0,
  });

  // Update sun position when time-space coordinates change
  useEffect(() => {
    const newSunPosition = calculateSunPosition({
      date,
      latitude,
      longitude,
    });
    setSunPosition(newSunPosition);
  }, [date, latitude, longitude]);

  // Handle time-space coordinate changes
  const handleLatitudeChange = (newLatitude: number) => {
    setLatitude(newLatitude);
  };

  const handleLongitudeChange = (newLongitude: number) => {
    setLongitude(newLongitude);
  };

  const handleDateChange = (newDate: Date) => {
    setDate(newDate);
  };

  const handleTimeChange = (hours: number, minutes: number) => {
    const newDate = new Date(date);
    newDate.setHours(hours);
    newDate.setMinutes(minutes);
    setDate(newDate);
  };

  // Handle model operations
  const handleAddModel = (model: Model) => {
    setModels((prevModels) => [...prevModels, model]);
    setSelectedModelId(model.id);
  };

  const handleUpdateModel = (updatedModel: Model) => {
    setModels((prevModels) =>
      prevModels.map((model) =>
        model.id === updatedModel.id ? updatedModel : model
      )
    );
  };

  const handleDeleteModel = (id: string) => {
    setModels((prevModels) => prevModels.filter((model) => model.id !== id));
    if (selectedModelId === id) {
      setSelectedModelId(null);
    }
  };

  const handleSelectModel = (id: string) => {
    setSelectedModelId(id);
  };

  // Handle drag to resize
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      setIsDragging(true);
      dragStartRef.current = {
        startX: e.clientX,
        startWidth: sidebarWidth,
      };
    },
    [sidebarWidth]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isDragging) {
        const deltaX = e.clientX - dragStartRef.current.startX;
        const newWidth = dragStartRef.current.startWidth + deltaX;

        // 限制最小和最大宽度
        if (newWidth >= 200 && newWidth <= window.innerWidth * 0.8) {
          setSidebarWidth(newWidth);
        }
      }
    },
    [isDragging]
  );

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <div className="flex flex-col md:flex-row w-full h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className="w-full md:h-full overflow-y-auto p-4 bg-gray-50 shadow-md sidebar-scrollbar"
        style={{ width: `${sidebarWidth}px` }}
      >
        <h1 className="text-2xl font-bold mb-4">Sun Shadow Simulator</h1>

        <TimeSpaceCoordinates
          latitude={latitude}
          longitude={longitude}
          date={date}
          onLatitudeChange={handleLatitudeChange}
          onLongitudeChange={handleLongitudeChange}
          onDateChange={handleDateChange}
          onTimeChange={handleTimeChange}
        />

        <ModelList
          models={models}
          selectedModelId={selectedModelId}
          onAddModel={handleAddModel}
          onUpdateModel={handleUpdateModel}
          onDeleteModel={handleDeleteModel}
          onSelectModel={handleSelectModel}
        />
      </div>

      {/* Resize Handle */}
      <div
        className="w-1 cursor-col-resize bg-gray-300 hover:bg-blue-500 active:bg-blue-700 transition-colors"
        onMouseDown={handleMouseDown}
      />

      {/* 3D Scene */}
      <div className="flex-1 h-1/2 md:h-full">
        <Scene3D
          models={models}
          sunPosition={sunPosition}
          onModelSelect={handleSelectModel}
        />
      </div>
    </div>
  );
}

export default App;
