import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './auth/AuthContext'
import { RequireAuth } from './auth/RequireAuth'
import DashboardLayout from './layout/DashboardLayout'
import CategoriesPage from './pages/CategoriesPage'
import LoginPage from './pages/LoginPage'
import NotFoundPage from './pages/NotFoundPage'
import OverviewPage from './pages/OverviewPage'
import PaymentsPage from './pages/PaymentsPage'
import ProfilePage from './pages/ProfilePage'
import RegistrationsPage from './pages/RegistrationsPage'
import UsersPage from './pages/UsersPage'
import VendorCategoriesPage from './pages/VendorCategoriesPage'
import VendorsPage from './pages/VendorsPage'
import AppTheme from './theme/AppTheme'

export default function App() {
  return (
    <AppTheme>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route element={<RequireAuth />}>
              <Route element={<DashboardLayout />}>
                <Route index element={<OverviewPage />} />
                <Route path="registrations" element={<RegistrationsPage />} />
                <Route path="payments" element={<PaymentsPage />} />
                <Route path="categories" element={<CategoriesPage />} />
                <Route path="vendors" element={<VendorsPage />} />
                <Route path="vendor-categories" element={<VendorCategoriesPage />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="users" element={<UsersPage />} />
              </Route>
            </Route>
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </AppTheme>
  )
}
