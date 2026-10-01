function fact(question, alternate, answer, wrong, explanation) {
  return { question, alternate, answer, wrong, explanation }
}

const basic = [
  fact('What does a photovoltaic panel convert into electricity?', 'PV is the technology that converts which source directly into DC electricity?', 'Sunlight', ['Wind', 'Stored battery energy', 'Grid frequency'], 'PV technology converts sunlight directly into DC electricity.'),
  fact('What does watts (W) measure?', 'Which unit describes power at a moment in time?', 'Electrical power', ['Energy used over time', 'Battery capacity', 'Solar irradiation'], 'Watts measure power at a moment; watt-hours measure energy over time.'),
  fact('How is electrical energy in watt-hours calculated?', 'Which expression gives energy consumption in Wh?', 'Watts multiplied by hours', ['Watts divided by hours', 'Volts multiplied by amps only', 'Watts plus hours'], 'Energy (Wh) equals power (W) multiplied by time in hours.'),
  fact('What does 5 peak sun hours represent?', 'Peak sun hours express sunlight as the equivalent of what?', 'Five hours at full panel intensity', ['Five hours of daylight', 'Five sunny calendar days', 'Five hours of battery backup'], 'PSH is equivalent full-intensity sunlight, not the number of daylight hours.'),
  fact('What standard PSH value does the guide use for African locations without site data?', 'When site irradiance data is unavailable in Africa, which PSH planning value is used?', '5 PSH', ['2 PSH', '8 PSH', '12 PSH'], 'The guide uses 5 PSH as a conservative African design standard unless site data is available.'),
  fact('Which formula estimates real daily panel output?', 'What calculation includes the guide’s standard system-efficiency allowance?', 'Panel watts x PSH x 0.75', ['Panel watts x PSH', 'Panel watts x battery voltage', 'Panel watts x 1.25'], 'The guide uses a 75% system-efficiency factor for real daily panel output.'),
  fact('Why is a 0.75 factor used in panel calculations?', 'The 0.75 PV factor accounts for what?', 'Typical system losses', ['Extra battery capacity', 'A higher panel voltage', 'Grid export'], 'Temperature, dust, conversion, cable, tracking, and mismatch losses are covered by the standard allowance.'),
  fact('Why must day and night appliance use be separated?', 'Separating daytime from nighttime energy is essential primarily for sizing what?', 'The battery bank', ['Panel frame size', 'Client phone number', 'Book selection'], 'Nighttime energy is the basis for the battery calculation.'),
  fact('What duty-cycle factor does the guide use for refrigerators?', 'A refrigerator scheduled for 24 hours is normally counted at what run-time fraction?', '50%', ['10%', '75%', '100%'], 'Refrigerators are treated as cycling loads and use a 50% duty cycle in the guide.'),
  fact('What duty-cycle factor does the guide use for freezers?', 'A freezer scheduled for 24 hours is normally counted at what run-time fraction?', '40%', ['10%', '75%', '100%'], 'The calculation guide uses a 40% duty cycle for freezers.'),
  fact('What daily load should be used for PV panel sizing?', 'Panels must be sized from which energy total?', 'Total daytime plus nighttime design load', ['Daytime load only', 'Nighttime load only', 'The largest appliance only'], 'The PV array must power daytime loads and recharge the battery for the night.'),
  fact('What should happen when panel count calculates to 4.6 panels?', 'A PV calculation produces a fractional panel count. What is the safe selection?', 'Round up to 5 panels', ['Round down to 4 panels', 'Use half a panel', 'Ignore the decimal'], 'Panel count is always rounded up so the system is not undersized.'),
  fact('How is design load calculated from raw energy?', 'What allowance is applied after adding the appliance energy schedule?', 'Raw load multiplied by 1.25', ['Raw load multiplied by 0.75', 'Raw load divided by 1.25', 'Raw load plus battery voltage'], 'The guide applies a 25% design margin to the raw daily load.'),
  fact('What is the correct approximate conversion for 1 horsepower?', 'Which wattage is the correct guide value for 1 HP?', '746 W', ['500 W', '1,000 W', '1,500 W'], 'One horsepower is approximately 746 watts, not 1,000 watts.'),
  fact('What does depth of discharge describe?', 'DoD describes what part of a battery?', 'The portion of capacity used', ['The panel output voltage', 'Cable insulation thickness', 'The inverter surge limit'], 'Depth of discharge is the usable fraction removed from a battery before recharge.'),
  fact('What LiFePO4 DoD value is used by the sizing model?', 'For the standard lithium calculation, what usable depth of discharge is applied?', '80%', ['25%', '50%', '100%'], 'The app model uses an 80% DoD allowance for lithium batteries.'),
  fact('What lead-acid DoD value is used by the sizing model?', 'For the standard lead-acid calculation, what usable depth of discharge is applied?', '50%', ['20%', '80%', '100%'], 'Lead-acid batteries are limited to 50% DoD in the guide.'),
  fact('What is inverter continuous power?', 'A continuous inverter rating tells you what?', 'The power it can supply continuously', ['The colour of the inverter', 'The number of PV panels', 'The battery chemistry'], 'Continuous power is the normal load the inverter can provide without relying on surge capability.'),
  fact('What is motor surge power?', 'When a motor starts, surge power is best described as what?', 'A brief starting power demand', ['A permanent reduction in power', 'A type of panel loss', 'A battery state of charge'], 'Motors draw substantially higher power for a short period when they start.'),
  fact('What inverter waveform does the installation guide recommend?', 'Which inverter output type is recommended for professional solar systems?', 'Pure sine wave', ['Modified sine wave', 'Square wave only', 'No AC waveform'], 'The installation guide recommends pure sine wave hybrid inverters.'),
  fact('What changes when batteries are connected in series?', 'Series battery connection primarily adds what?', 'Voltage', ['Ah capacity only', 'Panel wattage', 'Cable length'], 'Series connection adds voltage while the Ah capacity remains the same.'),
  fact('What changes when batteries are connected in parallel?', 'Parallel battery connection primarily adds what?', 'Ah capacity', ['Voltage only', 'Panel Voc', 'Inverter frequency'], 'Parallel connection adds capacity while voltage remains the same.'),
  fact('What does Voc mean for a solar panel?', 'Which panel value is used to check string open-circuit voltage?', 'Open-circuit voltage', ['Operating cable size', 'Battery capacity', 'Inverter surge'], 'Voc is the panel open-circuit voltage used for MPPT string checks.'),
  fact('What does MPPT stand for?', 'MPPT is the abbreviation for which charge-controller function?', 'Maximum Power Point Tracking', ['Main Panel Protection Test', 'Maximum Parallel Power Transfer', 'Metered PV Protection Terminal'], 'MPPT controllers continuously seek the PV array maximum power point.'),
  fact('For a serious solar system above 200 W, which controller type does the guide recommend?', 'Which charge controller is preferred for systems above 200 W?', 'MPPT', ['PWM', 'Manual switch', 'No controller'], 'The installation guide recommends MPPT for systems above 200 W.'),
]

const intermediate = [
  fact('What is the appliance-energy formula used in a load schedule?', 'Which calculation turns an appliance entry into daily energy?', 'Watts x quantity x hours x duty cycle', ['Watts + quantity + hours', 'Volts x cable size', 'Watts divided by PSH'], 'Each appliance row combines watts, quantity, operating hours, and duty cycle.'),
  fact('A 200 W refrigerator runs for 24 hours at a 50% duty cycle. What energy is counted?', 'Using the guide’s refrigerator duty cycle, how many Wh is 200 W for 24 hours?', '2,400 Wh', ['1,200 Wh', '4,800 Wh', '200 Wh'], '200 x 24 x 0.5 equals 2,400 Wh.'),
  fact('What is the general PV capacity formula?', 'Which formula sizes a PV array from energy demand?', 'Design load divided by PSH x efficiency', ['Design load multiplied by PSH', 'Battery Ah divided by volts', 'Inverter watts divided by cable length'], 'PV capacity equals total design load divided by PSH multiplied by system efficiency.'),
  fact('At 5 PSH and 75% efficiency, what divisor is used for panel capacity?', 'The simplified panel formula divides design load by which number?', '3.75', ['1.25', '5.00', '7.50'], 'Five PSH multiplied by 0.75 efficiency equals 3.75.'),
  fact('What is the battery-capacity formula in amp-hours?', 'Which formula is used for a battery bank?', 'Load x autonomy days divided by voltage x DoD', ['Load x PSH divided by panel watts', 'Watts x volts', 'Load divided by cable size'], 'Battery Ah equals energy demand times autonomy divided by system voltage and usable DoD.'),
  fact('What battery capacity is required for 4,000 Wh at 48 V and 80% DoD for one day?', 'Using the battery formula, 4,000 Wh at 48 V and 0.8 DoD gives approximately what?', '104 Ah', ['52 Ah', '200 Ah', '480 Ah'], '4,000 divided by 48 x 0.8 is approximately 104 Ah.'),
  fact('When is a busbar system needed for lithium batteries in parallel?', 'What is the guide’s parallel-battery limit before a busbar system is needed?', 'More than 4 batteries', ['More than 1 battery', 'More than 10 batteries', 'Never'], 'The guide warns against more than four lithium batteries in parallel without a busbar system.'),
  fact('What inverter sizing formula does the guide use?', 'Which expression accounts for continuous appliance load and motor startup?', 'Continuous load plus motor surge, then x 1.25', ['Continuous load divided by 1.25', 'Panel watts x PSH', 'Battery Ah x DoD'], 'The guide adds the largest motor surge to continuous load and applies a 25% margin.'),
  fact('What range of startup power can motors draw?', 'Motor startup surge is commonly in which range of rated power?', '3 to 6 times', ['Exactly 1 time', '10 to 20%', '100 times'], 'The installation guide describes motor starting surge as roughly three to six times rated power.'),
  fact('Which inverter rating must be confirmed for motor loads?', 'For a system with motors, which datasheet value matters beyond continuous kVA?', 'Surge rating', ['Colour rating', 'Book rating', 'Panel frame rating'], 'The inverter must support the calculated startup surge, not only its continuous rating.'),
  fact('What is the voltage of three 45 V panels in series?', 'A string has three panels, each with 45 V Voc. What is the string Voc?', '135 V', ['45 V', '90 V', '180 V'], 'Series string voltage is the number of panels multiplied by panel Voc.'),
  fact('What must always be true of panel string Voc and MPPT maximum input?', 'Which statement is essential before connecting a PV string?', 'String Voc must be below MPPT maximum input voltage', ['String Voc must equal battery voltage', 'String Voc must be zero', 'String Voc must exceed the MPPT maximum'], 'Exceeding maximum PV input voltage can permanently damage the controller.'),
  fact('What MPPT efficiency range is given in the installation guide?', 'Which range describes the guide’s MPPT controller efficiency?', '95 to 99%', ['40 to 50%', '70 to 80%', '100 to 120%'], 'MPPT controllers are described as 95 to 99% efficient.'),
  fact('What PWM efficiency range is compared with MPPT?', 'The guide lists PWM controller efficiency in which range?', '70 to 80%', ['95 to 99%', '10 to 20%', '100%'], 'PWM controllers are less efficient than MPPT controllers in the guide comparison.'),
  fact('Where should the main DC fuse be located?', 'How close should the DC fuse be to the battery positive terminal?', 'Within 30 cm', ['At the panel frame', 'At least 10 m away', 'Only at the AC board'], 'The installation guide places the DC fuse within 30 cm of battery positive.'),
  fact('How should the DC fuse be sized according to the guide?', 'The guide sets DC fuse sizing at what fraction of calculated DC current?', '110% of DC current', ['50% of DC current', 'Exactly 10% of DC current', '200% of DC current'], 'DC fuse guidance is 110% of the calculated DC current.'),
  fact('Where should an AC breaker be installed in a solar system?', 'The inverter AC output should reach the distribution board through what?', 'An AC circuit breaker', ['A DC fuse only', 'An MC4 connector', 'A battery BMS'], 'The guide routes inverter AC output through an AC circuit breaker.'),
  fact('What cable type is required from panels to an MPPT controller outdoors?', 'Which PV cable specification is called out in the guide?', 'UV-rated solar DC cable', ['Indoor speaker cable', 'Unrated extension cable', 'Bare copper wire'], 'Outdoor PV runs need UV-stabilised, double-insulated solar cable.'),
  fact('What typical cable size range does the guide give for PV DC runs?', 'Panels to MPPT normally use what minimum solar-cable range?', '4 to 6 mm2', ['0.5 to 1 mm2', '16 to 25 mm2 only', '70 mm2 only'], 'The guide lists 4 to 6 mm2 UV-rated cable for panel-to-MPPT connections.'),
  fact('What cable size range is listed for battery-to-inverter runs?', 'The installation guide identifies which range for high-current battery cable?', '35 to 70 mm2', ['0.5 to 1 mm2', '1.5 to 2.5 mm2', '4 to 6 mm2'], 'Battery-to-inverter cables carry high current and the guide lists 35 to 70 mm2.'),
  fact('What is the minimum earth cable size for frames to the ground rod?', 'The guide lists which minimum earth conductor size?', '6 mm2', ['0.5 mm2', '1 mm2', '2.5 mm2'], 'Panel frames and equipment should be earthed with at least 6 mm2 cable.'),
  fact('Why should DC and AC cables not share the same conduit?', 'The guide prohibits running DC beside AC in one conduit because of what?', 'Interference and installation risk', ['Extra panel output', 'Higher battery DoD', 'A lower PSH value'], 'The guide says DC and AC should be separated; shared routes can create interference and poor practice.'),
  fact('What information should be marked at both ends of a DC cable?', 'Which cable-labelling practice is required?', 'Polarity, voltage, and circuit name', ['Installer age and phone model', 'Only the cable colour', 'Nothing after commissioning'], 'The guide requires both ends of each DC cable to show polarity, voltage, and circuit name.'),
  fact('Why should PV DC cable runs be kept short?', 'Every additional metre of DC cable increases what?', 'Resistance and voltage drop', ['Peak sun hours', 'Battery chemistry', 'Panel wattage'], 'Long runs increase resistance, voltage drop, and lost energy.'),
  fact('What should be verified before final equipment connection?', 'What measurement confirms correct DC connection polarity?', 'Use a multimeter to verify polarity', ['Guess from cable shape', 'Use a panel label only', 'Wait for sunset'], 'The installer checklist requires polarity verification with a multimeter before final connection.'),
]

const advanced = [
  fact('An 8,000 Wh design load uses 5 PSH and 75% efficiency. What PV capacity is required before panel rounding?', 'Calculate 8,000 divided by 5 x 0.75. What PV capacity is required?', 'About 2,134 W', ['1,600 W', '2,500 W', '8,000 W'], '8,000 divided by 3.75 is approximately 2,134 W.'),
  fact('Using 500 W panels, how many panels are needed for a 2,134 W PV requirement?', 'A PV requirement is 2,134 W with 500 W modules. What panel count is safe?', '5 panels', ['4 panels', '4.3 panels', '6,000 panels'], '2,134 divided by 500 is 4.27, and panel count must be rounded up to five.'),
  fact('A 10,000 Wh design load at 5 PSH and 75% efficiency needs how many 500 W panels?', 'For 10,000 Wh per day, how many 500 W panels meet the guide formula?', '6 panels', ['4 panels', '5 panels', '10 panels'], '10,000 divided by 3.75 is 2,667 W; rounding gives six 500 W panels.'),
  fact('How much real daily energy can one 500 W panel produce at 5 PSH and 75% efficiency?', 'Calculate 500 W x 5 PSH x 0.75. What is the expected daily energy?', '1,875 Wh', ['2,500 Wh', '500 Wh', '3,750 Wh'], 'A 500 W panel gives 1,875 Wh/day using the guide’s loss allowance.'),
  fact('Four 12 V, 200 Ah batteries in series produce what bank?', 'What is the result of four 12 V, 200 Ah batteries in series?', '48 V, 200 Ah', ['12 V, 800 Ah', '48 V, 800 Ah', '24 V, 400 Ah'], 'Series adds voltage: four 12 V batteries make 48 V while capacity stays 200 Ah.'),
  fact('Two strings of four 12 V, 200 Ah batteries in parallel produce what bank?', 'Two 48 V, 200 Ah strings are paralleled. What is the final bank?', '48 V, 400 Ah', ['96 V, 200 Ah', '12 V, 1,600 Ah', '48 V, 200 Ah'], 'Parallel strings add Ah capacity while holding the same 48 V voltage.'),
  fact('What is the battery requirement for 4,000 Wh, 2 autonomy days, 48 V, and 80% DoD?', 'Calculate 4,000 Wh x 2 divided by 48 V x 0.8. What is required?', 'About 208 Ah', ['104 Ah', '48 Ah', '400 Ah'], '8,000 divided by 38.4 is approximately 208 Ah.'),
  fact('What is the string Voc of four 45 V panels in series?', 'A four-panel string uses modules with 45 V Voc. What is the result?', '180 V', ['45 V', '90 V', '135 V'], 'String Voc equals the number of panels in series multiplied by panel Voc.'),
  fact('Can four 45 V panels in series be connected to a 150 V MPPT input?', 'A 180 V string is proposed for an MPPT with 150 V maximum. Is it compatible?', 'No, it exceeds the MPPT limit', ['Yes, voltage is exactly matched', 'Yes, because panels are in series', 'Only at night'], 'A 180 V string is above 150 V maximum input and must not be connected.'),
  fact('What panel string arrangement gives 135 V using 45 V Voc panels?', 'How many 45 V panels are required in series to make a 135 V string?', '3 panels in series', ['2 panels in series', '4 panels in series', '5 panels in series'], 'Three multiplied by 45 V equals 135 V.'),
  fact('A 5,000 W load on a 48 V DC battery side draws approximately what current?', 'Use DC current equals power divided by voltage for 5,000 W at 48 V.', '104 A', ['48 A', '240 A', '5 A'], '5,000 divided by 48 equals approximately 104 A.'),
  fact('Using 110% DC protection guidance, what is the minimum protection target for 104 A?', 'A DC circuit carries 104 A. What current does the 110% fuse rule produce?', 'About 115 A', ['52 A', '104 A exactly', '208 A'], '104 A multiplied by 1.10 is approximately 115 A; select the next suitable DC-rated device.'),
  fact('What cable guide applies to a battery-to-inverter circuit carrying 150 A?', 'The quick-reference table assigns which cable range to 100 to 200 A battery circuits?', '35 to 50 mm2', ['1.5 mm2', '4 mm2', '10 mm2'], 'The guide lists 35 to 50 mm2 for battery-to-inverter circuits in the 100 to 200 A range.'),
  fact('What cable guide applies to a 25 A inverter AC output?', 'The quick-reference table assigns 20 to 30 A inverter AC output to which cable size?', '4 mm2', ['1.5 mm2', '10 mm2', '70 mm2'], 'The cable reference lists 4 mm2 for 20 to 30 A inverter AC output.'),
  fact('What cable guide applies to an 8 A lighting circuit?', 'The quick-reference table assigns up to 10 A lighting circuits to which cable size?', '1.5 mm2', ['4 mm2', '16 mm2', '35 mm2'], 'The guide lists 1.5 mm2 for lighting circuits up to 10 A.'),
  fact('What cable guide applies to a 15 A general AC circuit?', 'The quick-reference table assigns 10 to 20 A general AC circuits to which cable size?', '2.5 mm2', ['1.5 mm2', '10 mm2', '50 mm2'], 'The guide lists 2.5 mm2 for general AC circuits from 10 to 20 A.'),
  fact('A 1.5 HP air conditioner is rated at 1,100 W with a 4x surge factor. What extra surge is added by the sizing model?', 'For a 1,100 W AC with a 4x start factor, what additional startup load is counted?', '3,300 W', ['1,100 W', '2,200 W', '4,400 W'], 'The model adds the amount above continuous power: 1,100 multiplied by 3 equals 3,300 W.'),
  fact('For that 1,100 W AC alone, what inverter minimum results after surge and 25% margin?', 'A 1,100 W AC has 3,300 W added surge. What sizing result follows before choosing a standard inverter?', '5,500 W', ['1,100 W', '4,400 W', '8,800 W'], 'Continuous plus added surge is 4,400 W; multiplying by 1.25 gives 5,500 W.'),
  fact('Why is cold-weather Voc important when checking an MPPT limit?', 'Why must a design leave margin below maximum MPPT PV voltage?', 'Cold conditions can raise string voltage', ['Cold conditions remove all voltage', 'It changes battery chemistry only', 'It lowers panel count'], 'The guide warns that exceeding the maximum, even briefly on a cold morning, can destroy the controller.'),
  fact('What happens if one panel in a series string is shaded?', 'According to the guide, partial shade on one cell can have what effect?', 'It can sharply reduce string output', ['It always increases output', 'It only affects the battery label', 'It has no effect'], 'Partial shading and mismatch can substantially reduce production in a string.'),
  fact('Why is theoretical panel output unsuitable for final system design?', 'What is missing from panel watts multiplied by PSH alone?', 'System losses', ['Panel voltage', 'Client address', 'Battery brand'], 'The guide says omitting the 0.75 efficiency factor creates an undersized design.'),
  fact('What is the correct final check for an inverter selection with motor loads?', 'After calculating a recommended kVA, what should an installer verify?', 'The manufacturer surge rating', ['The front-panel colour', 'The panel tilt only', 'The battery sticker'], 'The guide requires checking the inverter’s datasheet surge rating for motor-start loads.'),
  fact('What should happen when a proposed string uses a different number of panels than the PV sizing result?', 'A string layout totals fewer panels than the PV calculation. What should the designer do?', 'Adjust the configuration before finalising', ['Ignore the PV result', 'Round down again', 'Remove the MPPT limit'], 'The physical string arrangement must still deliver the required rounded-up PV panel count.'),
  fact('What installation sequence is specified in the installer checklist?', 'Which connection order is used during installation?', 'Battery, then inverter, then solar', ['Solar, then inverter, then battery', 'AC grid, then panels only', 'Panels, then battery, then inverter'], 'The checklist specifies battery to inverter to solar connection order.'),
  fact('What should be verified after the full cable route is planned?', 'Before installation, what route detail must be measured for cable sizing?', 'All cable lengths', ['Only the panel colour', 'The book cover', 'The client email'], 'Cable routes and lengths must be measured because length changes resistance and voltage drop.'),
]

const sessionBanks = {
  basic: [...basic, ...intermediate],
  intermediate: [...intermediate, ...advanced],
  advanced: [...advanced, ...intermediate],
}

function shuffle(items) {
  const result = [...items]
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1))
    ;[result[index], result[swapIndex]] = [result[swapIndex], result[index]]
  }
  return result
}

function keepAnswersApart(items) {
  const remaining = shuffle(items)
  const ordered = []

  while (remaining.length) {
    const previousAnswer = ordered.at(-1)?.answer
    const nextIndex = remaining.findIndex((item) => item.answer !== previousAnswer)
    ordered.push(remaining.splice(nextIndex === -1 ? 0 : nextIndex, 1)[0])
  }

  return ordered
}

export const quizLevels = [
  { id: 'basic', label: 'Basic', description: 'Solar fundamentals, components, everyday calculations, and core safety.' },
  { id: 'intermediate', label: 'Intermediate', description: 'Practical sizing, controller selection, cabling, and installation checks.' },
  { id: 'advanced', label: 'Advanced', description: 'Detailed design calculations, strings, protection, and engineering decisions.' },
]

export function getQuizQuestions(level) {
  const facts = sessionBanks[level] || sessionBanks.basic
  return keepAnswersApart(facts).slice(0, 50).map((item, index) => ({
    id: `${level}-${index + 1}`,
    prompt: item.question,
    options: shuffle([item.answer, ...item.wrong]),
    answer: item.answer,
    explanation: item.explanation,
  }))
}
