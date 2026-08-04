import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { AppShell } from './components/layout/AppShell'
import { HomePage } from './pages/HomePage'
import { CalculatorsPage } from './pages/CalculatorsPage'
import { TroubleshootingPage } from './pages/TroubleshootingPage'
import { BooksPage } from './pages/BooksPage'
import { QuotationPage } from './pages/QuotationPage'

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
  return <RouterProvider router={router} />
}

