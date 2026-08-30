# Solar Hub - AI Agent Execution Prompt

Use this prompt when running GitHub Copilot Workspace, OpenAI Codex, Claude Code, or another AI coding agent to extend or modify this application.

## Project Context

- React 18 + Vite + Tailwind CSS web application
- Product name: Solar Hub
- Owner: Imam Musa
- Visual direction: iOS-inspired glass UI with white surfaces, sky-blue accents, and light/dark mode
- Formulas live in `src/utils/solarFormulas.js`
- Data lives in `src/data/`
- Shared UI components live in `src/components/ui/`
- Feature modules live in `src/features/`
- Pages live in `src/pages/`
- Book cover images live in `public/image/`
- Premium PIN is configured with `VITE_ACCESS_PIN`
- Theme is controlled by `src/contexts/ThemeContext.jsx`
- PSH region presets live in `src/data/solarRegions.js`

## To Add A New Calculator

1. Create a component in `src/features/calculators/`.
2. Add pure formula logic to `src/utils/solarFormulas.js`.
3. Add the calculator tab in `src/pages/CalculatorsPage.jsx`.
4. Use existing shared components: `NumberInput`, `SelectInput`, `ResultBanner`, `StatCard`, `Card`, and `Callout`.
5. Add or update formula tests in `tests/solarFormulas.test.js`.

## To Add A New Fault Code Brand

1. Add the brand to `faultCodes` in `src/data/faultCodes.js`.
2. The brand button is generated automatically by `FaultCodeSearch.jsx`.

## To Update Book Or Equipment Pricing

- Book data lives in `src/data/books.js`.
- Quotation default pricing lives in `src/pages/QuotationPage.jsx`.
- Book cards should not show prices unless the product owner explicitly asks for prices to return.

## Solar Formulas

- Design Load = Sum(W x Qty x Hrs x Duty) x 1.25
- Panel Capacity = Design Load / (Peak Sun Hours x Efficiency)
- Battery Ah = (Night Load x Days) / (Voltage x DoD)
- Inverter W = (Continuous + Surge) x 1.25
- DC Current = P / V
- AC Current = P / (V x 0.8)
- Breaker = ceil((I / 0.8) x 1.25), then next standard size
