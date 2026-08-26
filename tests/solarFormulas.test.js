import assert from 'node:assert/strict'
import {
  calculateBattery,
  calculateCable,
  calculateCost,
  calculateInverter,
  calculateLoad,
  calculatePanels,
  calculateQuote,
  nextBreaker,
} from '../src/utils/solarFormulas.js'

const load = calculateLoad([
  { watts: 100, qty: 2, dayH: 3, nightH: 4, duty: 'default' },
])

assert.equal(load.total, 1400)
assert.equal(load.design, 1750)

const panels = calculatePanels({ designLoad: 8000, panelW: 500, psh: 5, efficiency: 75 })
assert.equal(panels.count, 5)
assert.equal(panels.arrayWatts, 2500)

const battery = calculateBattery({ nightLoad: 4000, voltage: 48, battType: 'lithium', autonomy: 1, battAh: 200 })
assert.equal(battery.count, 1)

const inverter = calculateInverter([{ watts: 1100, qty: 1, surge: 'ac' }])
assert.equal(inverter.continuous, 1100)
assert.equal(inverter.maxSurge, 3300)
assert.equal(inverter.recommended, 6000)

assert.equal(nextBreaker(57), 63)

const cable = calculateCable({ power: 5000, voltage: 48, circuitType: 'dc', length: 3, cableSize: '35' })
assert.equal(Math.round(cable.current), 104)
assert.equal(cable.breaker, 175)

const cost = calculateCost({ systemCost: 1500000, dailyKwh: 8, years: 20, maintenance: 30000, genFuelPerL: 1200 })
assert.ok(Number.isFinite(cost.solarKwh))
assert.ok(Number.isFinite(cost.payback))

const quote = calculateQuote({ designLoad: 8000, nightLoad: 4000, voltage: 48, battType: 'lithium', autonomy: 1, panelW: 500, battAh: 200, panelPrice: 145000, battPrice: 480000, invPrice: 520000 }, 150000, 20)
assert.equal(quote.panels, 5)
assert.equal(quote.batteries, 1)
assert.ok(quote.totalCost > quote.equipCost)

const lowSunQuote = calculateQuote({ designLoad: 8000, nightLoad: 4000, voltage: 48, battType: 'lithium', autonomy: 1, panelW: 500, battAh: 200, panelPrice: 145000, battPrice: 480000, invPrice: 520000, psh: 4, efficiency: 75 }, 150000, 20)
assert.equal(lowSunQuote.panels, 6)

console.log('solar formula tests passed')
