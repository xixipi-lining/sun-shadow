import SunCalc from "suncalc";

export interface SunPositionParams {
  date: Date;
  latitude: number;
  longitude: number;
}

export interface SunPosition {
  azimuth: number; // Horizontal angle (in radians)
  altitude: number; // Vertical angle (in radians)
}

export function calculateSunPosition({
  date,
  latitude,
  longitude,
}: SunPositionParams): SunPosition {
  const sunPosition = SunCalc.getPosition(date, latitude, longitude);

  return {
    azimuth: sunPosition.azimuth,
    altitude: sunPosition.altitude,
  };
}
