import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { AppShell } from './components/layout/AppShell'
import { HomePage } from './pages/HomePage'
import { CalculatorsPage } from './pages/CalculatorsPage'
import { TroubleshootingPage } from './pages/TroubleshootingPage'
import { BooksPage } from './pages/BooksPage'
import { QuotationPage } from './pages/QuotationPage'
import { QuotePreviewPage } from './pages/QuotePreviewPage'
import { SolarNavigatorPage } from './pages/SolarNavigatorPage'
import { SettingsPage } from './pages/SettingsPage'
import { AuthPage } from './pages/AuthPage'
import { ResetPasswordPage } from './pages/ResetPasswordPage'
import { PricingPage } from './pages/PricingPage'
import { CodesPage } from './pages/CodesPage'
import { QuizPage } from './pages/QuizPage'
import { ThemeProvider } from './contexts/ThemeContext'
import { AuthProvider } from './contexts/AuthContext'
import { SubscriptionProvider } from './contexts/SubscriptionContext'
import { Analytics } from '@vercel/analytics/react'

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'calculators', element: <CalculatorsPage /> },
      { path: 'troubleshooting', element: <TroubleshootingPage /> },
      { path: 'codes', element: <CodesPage /> },
      { path: 'quiz', element: <QuizPage /> },
      { path: 'books', element: <BooksPage /> },
      { path: 'quotation', element: <QuotationPage /> },
      { path: 'quotation/preview', element: <QuotePreviewPage /> },
      { path: 'navigator', element: <SolarNavigatorPage /> },
      { path: 'settings', element: <SettingsPage /> },
      { path: 'auth', element: <AuthPage /> },
      { path: 'reset-password', element: <ResetPasswordPage /> },
      { path: 'pricing', element: <PricingPage /> },
    ],
  },
])

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SubscriptionProvider>
          <RouterProvider router={router} />
        </SubscriptionProvider>
      </AuthProvider>
      <Analytics />
    </ThemeProvider>
  )
}
