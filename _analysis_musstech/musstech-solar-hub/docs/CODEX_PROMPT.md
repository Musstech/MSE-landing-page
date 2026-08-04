# Musstech Solar Hub — AI Agent Execution Prompt

Use this prompt when running GitHub Copilot Workspace, OpenAI Codex, Claude Code, or any AI coding agent to extend or modify this application.

## PROJECT CONTEXT
React 18 + Vite + Tailwind CSS web application
Brand: Musstech Solar Energy | Owner: Imam Musa
Colors: Navy #1A2E4A | Gold #F5A623 | Orange #E8722A | Green #276749
All solar formulas are in src/utils/solarFormulas.js
All data is in src/data/ folder

## TO ADD A NEW CALCULATOR
1. Create new component in src/components/calculators/
2. Import formulas from src/utils/solarFormulas.js
3. Add tab entry to CalculatorsPage in src/App.jsx
4. Use existing NumInput, SelectInput, ResultBanner, InfoCard components

## TO ADD A NEW FAULT CODE BRAND
1. Add brand to FAULT_DB object in src/data/faultCodes.js
2. Add brand button to the fault codes tab in TroubleshootingPage

## TO UPDATE EQUIPMENT PRICING
Edit DEFAULT_EQUIPMENT_PRICES in src/data/books.js

## SOLAR FORMULAS (DO NOT CHANGE)
- Design Load = Sum(W × Qty × Hrs × Duty) × 1.25
- Panel Capacity = Design Load ÷ 3.75 (5 PSH × 0.75 efficiency)
- Battery Ah = (Night Load × Days) ÷ (Voltage × DoD)
- Inverter W = (Continuous + Surge) × 1.25
- DC Current = P ÷ V | AC Current = P ÷ (V × 0.8)
- Breaker = ceil((I ÷ 0.8) × 1.25) → next standard size
