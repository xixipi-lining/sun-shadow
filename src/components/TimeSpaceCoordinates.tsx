import { useState, useEffect } from "react";
import { format } from "date-fns";

interface TimeSpaceCoordinatesProps {
  latitude: number;
  longitude: number;
  date: Date;
  onLatitudeChange: (latitude: number) => void;
  onLongitudeChange: (longitude: number) => void;
  onDateChange: (date: Date) => void;
  onTimeChange: (hours: number, minutes: number) => void;
}

const TimeSpaceCoordinates = ({
  latitude,
  longitude,
  date,
  onLatitudeChange,
  onLongitudeChange,
  onDateChange,
  onTimeChange,
}: TimeSpaceCoordinatesProps) => {
  const [hours, setHours] = useState<number>(date.getHours());
  const [minutes, setMinutes] = useState<number>(date.getMinutes());
  const [isInternalUpdate, setIsInternalUpdate] = useState(false);

  // Update hours and minutes when date changes (but not from internal updates)
  useEffect(() => {
    if (!isInternalUpdate) {
      setHours(date.getHours());
      setMinutes(date.getMinutes());
    }
    setIsInternalUpdate(false);
  }, [date, isInternalUpdate]);

  const handleLatitudeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value >= -90 && value <= 90) {
      onLatitudeChange(value);
    }
  };

  const handleLongitudeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value >= -180 && value <= 180) {
      onLongitudeChange(value);
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = new Date(e.target.value);
    if (!isNaN(newDate.getTime())) {
      // Preserve the time when changing date
      newDate.setHours(hours);
      newDate.setMinutes(minutes);
      onDateChange(newDate);
    }
  };

  const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 0 && value <= 23) {
      setHours(value);
      setIsInternalUpdate(true);
      onTimeChange(value, minutes);
    }
  };

  const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 0 && value <= 59) {
      setMinutes(value);
      setIsInternalUpdate(true);
      onTimeChange(hours, value);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-4">
      <h2 className="text-lg font-semibold mb-4">Time & Space Coordinates</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Latitude (-90 to 90)
          </label>
          <input
            type="number"
            min="-90"
            max="90"
            step="0.000001"
            value={latitude}
            onChange={handleLatitudeChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Longitude (-180 to 180)
          </label>
          <input
            type="number"
            min="-180"
            max="180"
            step="0.000001"
            value={longitude}
            onChange={handleLongitudeChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date
          </label>
          <input
            type="date"
            value={format(date, "yyyy-MM-dd")}
            onChange={handleDateChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hours (0-23)
            </label>
            <input
              type="number"
              min="0"
              max="23"
              value={hours}
              onChange={handleHoursChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Minutes (0-59)
            </label>
            <input
              type="number"
              min="0"
              max="59"
              value={minutes}
              onChange={handleMinutesChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeSpaceCoordinates;
