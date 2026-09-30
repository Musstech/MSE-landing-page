import { books } from './books'

const workspaceEntries = [
  { id: 'design', title: 'Solar Design', description: 'Start with loads and size a complete system.', to: '/calculators?tab=load', keywords: 'design load calculator sizing appliances' },
  { id: 'panel', title: 'Panel Sizing', description: 'Estimate the PV array from your design load and peak sun hours.', to: '/calculators?tab=panel', keywords: 'panel pv solar sizing psh' },
  { id: 'battery', title: 'Battery Sizing', description: 'Review battery capacity for night-time demand.', to: '/calculators?tab=battery', keywords: 'battery autonomy night bank sizing' },
  { id: 'inverter', title: 'Inverter Sizing', description: 'Check running load and starting surge requirements.', to: '/calculators?tab=inverter', keywords: 'inverter surge watt load sizing' },
  { id: 'cable', title: 'Cable Sizing', description: 'Check cable size and voltage drop.', to: '/calculators?tab=cable', keywords: 'cable wire voltage drop dc ac' },
  { id: 'mppt', title: 'MPPT Calculator', description: 'Evaluate an MPPT charge controller configuration.', to: '/calculators?tab=mppt', keywords: 'mppt controller panel current voltage' },
  { id: 'diagnose', title: 'Diagnose', description: 'Work through practical solar fault checks.', to: '/troubleshooting', keywords: 'diagnose troubleshooting faults' },
  { id: 'codes', title: 'Fault Codes', description: 'Look up common inverter and system codes.', to: '/codes', keywords: 'codes inverter error fault' },
  { id: 'quote', title: 'Quotation', description: 'Prepare a professional client quotation.', to: '/quotation', keywords: 'quotation quote proposal customer price' },
  { id: 'navigator', title: 'Solar Navigator', description: 'Check the panel-facing direction with your phone.', to: '/navigator', keywords: 'navigator compass panel direction facing' },
  { id: 'quiz', title: 'Solar Quiz', description: 'Build practical solar engineering knowledge.', to: '/quiz', keywords: 'quiz training learning questions' },
  { id: 'settings', title: 'Settings', description: 'Manage workspace appearance and account settings.', to: '/settings', keywords: 'settings account appearance theme' },
]

const bookEntries = books.map((book) => ({
  id: `book-${book.id}`,
  title: book.title,
  description: book.subtitle,
  to: '/books',
  keywords: `${book.title} ${book.subtitle} ${book.topics.join(' ')}`.toLowerCase(),
}))

export const searchIndex = [...workspaceEntries, ...bookEntries]
