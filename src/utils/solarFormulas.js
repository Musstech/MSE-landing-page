export const DESIGN_MARGIN = 1.25
export const DEFAULT_PSH = 5
export const DEFAULT_EFFICIENCY = 0.75
export const DEFAULT_FACTOR = DEFAULT_PSH * DEFAULT_EFFICIENCY

export const DUTY_FACTORS = {
  none: 0,
  fridge: 0.5,
  freezer: 0.4,
  default: 1,
}

export const SURGE_FACTORS = {
  none: 1,
  fridge: 3,
  freezer: 2.5,
  ac: 4,
  pump: 4,
  fan: 2.5,
  default: 1,
}

export const DOD_FACTORS = {
  lithium: 0.8,
  leadAcid: 0.5,
  agm: 0.6,
}

export const STANDARD_BREAKERS = [6, 10, 16, 20, 25, 32, 40, 50, 63, 80, 100, 125, 175, 200]
export const STANDARD_INVERTERS = [1000, 1500, 2000, 3000, 3500, 5000, 6000, 8000, 10000, 15000, 20000]
export const STANDARD_MPPT_CONTROLLERS = [20, 30, 40, 50, 60, 80, 100, 120, 150]

export function nextBreaker(amps) {
  const value = Math.max(0, Number(amps) || 0)
  return STANDARD_BREAKERS.find((size) => size >= value) || Math.ceil(value)
}

export function calculateLoad(rows) {
  let dayRaw = 0
  let nightRaw = 0

  rows.forEach((row) => {
    const duty = DUTY_FACTORS[row.duty] || DUTY_FACTORS.default
    const watts = Math.max(0, Number(row.watts) || 0)
    const qty = Math.max(0, Number(row.qty) || 0)
    dayRaw += watts * qty * Math.max(0, Number(row.dayH) || 0) * duty
    nightRaw += watts * qty * Math.max(0, Number(row.nightH) || 0) * duty
  })

  const total = dayRaw + nightRaw
  return {
    dayRaw,
    nightRaw,
    total,
    dayDesign: dayRaw * DESIGN_MARGIN,
    nightDesign: nightRaw * DESIGN_MARGIN,
    design: total * DESIGN_MARGIN,
  }
}

export function calculatePanels({ designLoad, panelW, psh = DEFAULT_PSH, efficiency = 75 }) {
  const factor = Math.max(0.01, Number(psh) * (Number(efficiency) / 100))
  const panelWatts = Math.max(1, Number(panelW) || 1)
  const capacity = Math.max(0, Number(designLoad) || 0) / factor
  const count = Math.ceil(capacity / panelWatts)
  const arrayWatts = count * panelWatts
  return {
    factor,
    capacity,
    count,
    arrayWatts,
    dailyOutput: arrayWatts * factor,
  }
}

export function calculateBattery({ nightLoad, voltage, battType, autonomy, battAh }) {
  const dod = DOD_FACTORS[battType] || DOD_FACTORS.lithium
  const safeVoltage = Math.max(1, Number(voltage) || 1)
  const safeAh = Math.max(1, Number(battAh) || 1)
  const requiredAh = (Math.max(0, Number(nightLoad) || 0) * Math.max(0.5, Number(autonomy) || 1)) / (safeVoltage * dod)
  const count = Math.ceil(requiredAh / safeAh)
  const totalAh = count * safeAh
  return {
    dod,
    requiredAh,
    count,
    totalAh,
    usableWh: totalAh * safeVoltage * dod,
  }
}

export function calculateInverter(loads) {
  let continuous = 0
  let maxSurge = 0

  loads.forEach((load) => {
    const cont = Math.max(0, Number(load.watts) || 0) * Math.max(0, Number(load.qty) || 0)
    continuous += cont
    const factor = SURGE_FACTORS[load.surge] || SURGE_FACTORS.default
    maxSurge = Math.max(maxSurge, cont * (factor - 1))
  })

  const required = (continuous + maxSurge) * DESIGN_MARGIN
  return {
    continuous,
    maxSurge,
    required,
    recommended: STANDARD_INVERTERS.find((size) => size >= required) || Math.ceil(required),
  }
}

export function calculateCable({ power, voltage, circuitType, length, cableSize }) {
  const safeVoltage = Math.max(1, Number(voltage) || 1)
  const safePower = Math.max(0, Number(power) || 0)
  const current = circuitType === 'dc' ? safePower / safeVoltage : safePower / (safeVoltage * 0.8)
  // The installation guide specifies a DC fuse at 110% of DC current and an AC breaker matched to output demand.
  const protectionCurrent = circuitType === 'dc' ? current * 1.1 : current
  const breaker = nextBreaker(protectionCurrent)
  const resistanceMap = { '1.5': 12.1, '2.5': 7.41, '4': 4.61, '6': 3.08, '10': 1.83, '16': 1.15, '25': 0.727, '35': 0.524, '50': 0.387, '70': 0.268 }
  const resistance = resistanceMap[cableSize] || 1.83
  const dropV = (2 * Math.max(0, Number(length) || 0) * current * resistance) / 1000
  const dropPct = (dropV / safeVoltage) * 100
  const recommendedCable = circuitType === 'dc'
    ? current <= 30
      ? 6
      : current <= 60
        ? 10
        : current <= 100
          ? 16
          : current <= 150
            ? 35
            : current <= 200
              ? 50
              : 70
    : current <= 10
      ? 1.5
      : current <= 20
        ? 2.5
        : current <= 30
          ? 4
          : current <= 60
            ? 10
            : current <= 100
              ? 16
              : current <= 200
                ? 35
                : 70
  return {
    current,
    breaker,
    dropV,
    dropPct,
    maxDrop: circuitType === 'dc' ? 3 : 2,
    protectionCurrent,
    recommendedCable,
    protectionLabel: circuitType === 'dc' ? 'DC fuse / breaker' : 'AC output breaker',
  }
}

export function calculateMppt({ arrayWatts, batteryVoltage, controllerAmps, panelVoc, controllerMaxVoltage }) {
  const safeArrayWatts = Math.max(0, Number(arrayWatts) || 0)
  const safeBatteryVoltage = Math.max(1, Number(batteryVoltage) || 1)
  const requiredAmps = safeArrayWatts / safeBatteryVoltage
  const controllerRating = Math.max(1, Number(controllerAmps) || 1)
  const pvVoltage = Math.max(0, Number(panelVoc) || 0)
  const maxVoltage = Math.max(1, Number(controllerMaxVoltage) || 1)
  const recommendedAmps = STANDARD_MPPT_CONTROLLERS.find((size) => size >= requiredAmps) || Math.ceil(requiredAmps)

  return {
    requiredAmps,
    recommendedAmps,
    controllerRating,
    pvVoltage,
    maxVoltage,
    currentCompatible: controllerRating >= requiredAmps,
    voltageCompatible: pvVoltage > safeBatteryVoltage && pvVoltage < maxVoltage,
  }
}

export function calculateStringConfiguration({ panelW, panelVoc, panelIsc, panelsSeries, stringsParallel, requiredPanels, mpptMaxVoltage, mpptMaxCurrent, mpptInputs }) {
  const series = Math.max(1, Math.floor(Number(panelsSeries) || 1))
  const parallel = Math.max(1, Math.floor(Number(stringsParallel) || 1))
  const inputs = Math.max(1, Math.floor(Number(mpptInputs) || 1))
  const voc = Math.max(0, Number(panelVoc) || 0)
  const isc = Math.max(0, Number(panelIsc) || 0)
  const totalPanels = series * parallel
  const stringVoltage = series * voc
  const stringCurrent = isc
  const inputCurrent = parallel * isc
  const stringsPerInput = Math.ceil(parallel / inputs)
  const currentPerInput = inputCurrent / inputs
  const arrayWatts = totalPanels * Math.max(0, Number(panelW) || 0)
  const maxVoltage = Math.max(1, Number(mpptMaxVoltage) || 1)
  const maxCurrent = Math.max(1, Number(mpptMaxCurrent) || 1)

  return {
    series,
    parallel,
    totalPanels,
    stringVoltage,
    stringCurrent,
    inputCurrent,
    stringsPerInput,
    currentPerInput,
    arrayWatts,
    panelCountMatches: !requiredPanels || totalPanels === Number(requiredPanels),
    voltageCompatible: stringVoltage < maxVoltage,
    currentCompatible: currentPerInput <= maxCurrent,
  }
}

export function calculateCost({ systemCost, dailyKwh, years, maintenance, genFuelPerL }) {
  const safeDaily = Math.max(0.1, Number(dailyKwh) || 0.1)
  const safeYears = Math.max(1, Number(years) || 1)
  const totalCost = Math.max(0, Number(systemCost) || 0) + Math.max(0, Number(maintenance) || 0) * safeYears
  const totalKwh = safeDaily * 365 * safeYears
  const solarKwh = totalCost / totalKwh
  const genKwh = (Math.max(0, Number(genFuelPerL) || 0) * 0.8) / 2
  const annualSaving = Math.max(0, (genKwh - solarKwh) * safeDaily * 365)
  return {
    totalCost,
    totalKwh,
    solarKwh,
    genKwh,
    annualSaving,
    payback: annualSaving > 0 ? Math.max(0, Number(systemCost) || 0) / annualSaving : 0,
  }
}

export function calculateQuote(system, extras, margin, options = {}) {
  const connectedLoad = Array.isArray(options.loads) ? calculateLoad(options.loads) : null
  const designLoad = options.designLoad ?? connectedLoad?.design ?? system.designLoad
  const nightLoad = options.nightLoad ?? connectedLoad?.nightDesign ?? system.nightLoad
  const inverterResult = Array.isArray(options.loads) ? calculateInverter(options.loads) : null
  const panelResult = calculatePanels({
    designLoad,
    panelW: system.panelW,
    psh: options.psh ?? system.psh ?? DEFAULT_PSH,
    efficiency: options.efficiency ?? system.efficiency ?? DEFAULT_EFFICIENCY * 100,
  })
  const batteryResult = calculateBattery({ ...system, nightLoad })
  const inverterWatts = inverterResult?.recommended ?? Math.ceil((((Number(designLoad) || 0) / 24) * 1.5 * DESIGN_MARGIN) / 1000) * 1000
  const panels = panelResult.count
  const batteries = batteryResult.count
  const equipCost =
    panels * Math.max(0, Number(system.panelPrice) || 0) +
    batteries * Math.max(0, Number(system.battPrice) || 0) +
    Math.max(0, Number(system.invPrice) || 0) +
    Math.max(0, Number(extras) || 0)

  return {
    panels,
    batteries,
    inverterWatts,
    designLoad,
    nightLoad,
    panelResult,
    batteryResult,
    inverterResult,
    loadResult: connectedLoad,
    equipCost,
    totalCost: equipCost * (1 + Math.max(0, Number(margin) || 0) / 100),
  }
}
