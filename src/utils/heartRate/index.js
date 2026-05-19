/**
 * Maps a heart rate value to a specific zone type.
 * @param {number} hr - The current heart rate
 * @returns {number} - The heartRateType (0-5)
 */
export const getHeartRateType = (hr) => {
  if (hr <= 0) return 0;
  if (hr <= 108) return 1;    // Warm Up
  if (hr <= 126) return 2;    // Fat Burning
  if (hr <= 144) return 3;    // Aerobic
  if (hr <= 162) return 4;    // Anaerobic
  return 5;                   // Extreme
};