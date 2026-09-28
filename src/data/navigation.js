import { BookOpen, Calculator, ClipboardCheck, FileText, Home, Search } from 'lucide-react'

export const navigation = [
  { id: 'home', label: 'Home', path: '/', icon: Home },
  { id: 'calculators', label: 'Design', path: '/calculators', icon: Calculator },
  { id: 'troubleshooting', label: 'Diagnose', path: '/troubleshooting', icon: Search },
  { id: 'books', label: 'Books', path: '/books', icon: BookOpen },
  { id: 'codes', label: 'Codes', path: '/codes', icon: FileText },
  { id: 'quiz', label: 'Quiz', path: '/quiz', icon: ClipboardCheck },
]
