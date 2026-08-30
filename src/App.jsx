import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { AppShell } from './components/layout/AppShell'
import { HomePage } from './pages/HomePage'
import { CalculatorsPage } from './pages/CalculatorsPage'
import { TroubleshootingPage } from './pages/TroubleshootingPage'
import { BooksPage } from './pages/BooksPage'
import { QuotationPage } from './pages/QuotationPage'
import { PremiumAccessProvider } from './components/auth/PremiumAccess'
import { ThemeProvider } from './contexts/ThemeContext'
import { Analytics } from '@vercel/analytics/react'

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'calculators', element: <CalculatorsPage /> },
      { path: 'troubleshooting', element: <TroubleshootingPage /> },
      { path: 'books', element: <BooksPage /> },
      { path: 'quotation', element: <QuotationPage /> },
    ],
  },
])

export default function App() {
  return (
    <ThemeProvider>
      <PremiumAccessProvider>
        <RouterProvider router={router} />
      </PremiumAccessProvider>
      <Analytics />
    </ThemeProvider>
  )
}
