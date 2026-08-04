import { BookOpen, Calculator, Home, Search, FileText } from 'lucide-react'

export const navigation = [
  { id: 'home', label: 'Home', path: '/', icon: Home },
  { id: 'calculators', label: 'Calculate', path: '/calculators', icon: Calculator },
  { id: 'troubleshooting', label: 'Diagnose', path: '/troubleshooting', icon: Search },
  { id: 'books', label: 'Books', path: '/books', icon: BookOpen },
  { id: 'quotation', label: 'Quote', path: '/quotation', icon: FileText },
]

