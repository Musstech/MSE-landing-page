export const solarRegions = [
  {
    id: 'global-average',
    label: 'Global average',
    psh: 5,
    note: 'Balanced planning value when site-specific solar data is not available.',
  },
  {
    id: 'high-sun',
    label: 'High sun area',
    psh: 5.8,
    note: 'Use for dry, clear, high-irradiance locations.',
  },
  {
    id: 'tropical-coastal',
    label: 'Tropical or coastal area',
    psh: 4.4,
    note: 'Use where cloud cover, humidity, and rainy seasons reduce daily output.',
  },
  {
    id: 'temperate',
    label: 'Temperate area',
    psh: 4,
    note: 'Use for moderate solar-resource locations.',
  },
  {
    id: 'low-sun',
    label: 'Low sun or cloudy area',
    psh: 3.2,
    note: 'Use conservative values for cloudy, shaded, or low-irradiance locations.',
  },
  {
    id: 'custom',
    label: 'Custom PSH',
    psh: 5,
    note: 'Use site-specific peak sun hours from a solar map, field survey, or client location data.',
  },
]
