// Parameter and Organ Registry
// System is structured for easy addition of future vitals, thresholds, and organ mappings.

export const ORGANS = [
  { id: "brain", name: "Brain" },
  { id: "lungs", name: "Lungs" },
  { id: "heart", name: "Heart" },
  { id: "liver", name: "Liver" },
  { id: "stomach", name: "Stomach" },
  { id: "kidneys", name: "Kidneys" }
];

export const VITAL_PARAMETERS = [
  {
    id: "heart_rate",
    name: "Heart Rate",
    unit: "bpm",
    organ: "heart",
    hasGraph: true,
    description: "Cardiac beats per minute",
    thresholds: {
      lowCritical: 40,
      lowWarning: 55,
      highWarning: 100,
      highCritical: 130
    }
  },
  {
    id: "breathing_rate",
    name: "Breathing Rate",
    unit: "breaths/min",
    organ: "lungs",
    hasGraph: true,
    description: "Respiratory cycles per minute",
    thresholds: {
      lowCritical: 8,
      lowWarning: 12,
      highWarning: 20,
      highCritical: 28
    }
  }
];

export const ENVIRONMENTAL_PARAMETERS = [
  { id: "co2", name: "Carbon Dioxide (CO₂)", unit: "ppm" },
  { id: "co", name: "Carbon Monoxide (CO)", unit: "ppm" },
  { id: "o2_concentration", name: "Oxygen Concentration (O₂)", unit: "%" },
  { id: "methane", name: "Methane (CH₄)", unit: "% / ppm" },
  { id: "h2s", name: "Hydrogen Sulfide (H₂S)", unit: "ppm" },
  { id: "nox", name: "Nitrous Gases (NOx)", unit: "ppm" },
  { id: "combustible_gases_lel", name: "Combustible Gases / Lower Explosive Limit (LEL)", unit: "% LEL" },
  { id: "radon_gas", name: "Radon Gas", unit: "Bq/m³" },
  { id: "diesel_particulate_matter", name: "Diesel Particulate Matter (DPM)", unit: "µg/m³" },
  { id: "silica_dust", name: "Silica Dust", unit: "mg/m³" },
  { id: "coal_dust", name: "Coal Dust", unit: "mg/m³" },
  { id: "mercury_vapor", name: "Mercury Vapor", unit: "mg/m³" },
  { id: "ambient_pressure", name: "Ambient Pressure (Hyperbaric / Hypobaric)", unit: "kPa / mmHg" },
  { id: "partial_pressure_o2", name: "Partial Pressure of Oxygen (ppO₂)", unit: "kPa" },
  { id: "partial_pressure_n2", name: "Partial Pressure of Nitrogen (ppN₂)", unit: "kPa" },
  { id: "ambient_temperature", name: "Ambient Temperature", unit: "°C" },
  { id: "relative_humidity", name: "Relative Humidity", unit: "%" },
  { id: "vapor_pressure_deficit", name: "Vapor Pressure Deficit (VPD)", unit: "kPa" },
  { id: "acoustic_noise", name: "Acoustic Noise Pollution", unit: "dBA" },
  { id: "infrasound_vibrations", name: "Infrasound Vibrations", unit: "Hz / dB" },
  { id: "whole_body_vibrations", name: "Whole-Body Mechanical Vibrations", unit: "m/s²" },
  { id: "air_ionization", name: "Air Ionization", unit: "ions/cm³" },
  { id: "gamma_cosmic_radiation", name: "Gamma and Cosmic Radiation", unit: "µSv/h" },
  { id: "emf", name: "Electromagnetic Fields (EMF)", unit: "µT / V/m" },
  { id: "blue_light_radiance", name: "Blue Light Radiance", unit: "W/(m²·sr)" },
  { id: "complete_darkness_circadian", name: "Complete Darkness / Circadian Disruption", unit: "lux" },
  { id: "waterborne_pathogens", name: "Waterborne Pathogens", unit: "CFU/100mL" },
  { id: "water_salinity_minerals", name: "Water Salinity and Mineral Loading", unit: "mg/L (TDS)" }
];

// Threshold Evaluation Helper
export function evaluateVitalStatus(value, thresholds) {
  if (value === null || value === undefined || isNaN(value)) {
    return "NO_DATA";
  }
  if (!thresholds) {
    return "NORMAL";
  }
  if (value < thresholds.lowCritical) {
    return "CRITICAL"; // LOW CRITICAL
  }
  if (value < thresholds.lowWarning) {
    return "WARNING"; // LOW WARNING
  }
  if (value > thresholds.highCritical) {
    return "CRITICAL"; // HIGH CRITICAL
  }
  if (value > thresholds.highWarning) {
    return "WARNING"; // HIGH WARNING
  }
  return "NORMAL";
}
