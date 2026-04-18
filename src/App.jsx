import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'

import Home from './pages/Home'
import Catalog from './pages/Catalog'
import CourseDetail from './pages/CourseDetail'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import VideoWatch from './pages/VideoWatch'
import PaymentReturn from './pages/PaymentReturn'

import AdminLayout from './pages/admin/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminCategories from './pages/admin/AdminCategories'
import AdminCourses from './pages/admin/AdminCourses'
import AdminVideos from './pages/admin/AdminVideos'
import AdminUpload from './pages/admin/AdminUpload'

function Layout({ children }) {
  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            style: { background: '#1a1a1a', color: '#f8f8f8', border: '1px solid #3d3d3d' },
            success: { iconTheme: { primary: '#f59e0b', secondary: '#0a0a0a' } },
          }}
        />
        <Routes>
          {/* Pages publiques */}
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/catalogue" element={<Layout><Catalog /></Layout>} />
          <Route path="/formation/:slug" element={<Layout><CourseDetail /></Layout>} />
          <Route path="/connexion" element={<Login />} />
          <Route path="/inscription" element={<Register />} />
          <Route path="/paiement/retour" element={<PaymentReturn />} />

          {/* Pages protégées */}
          <Route path="/tableau-de-bord" element={
            <ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>
          } />
          <Route path="/regarder/:courseId" element={
            <ProtectedRoute><VideoWatch /></ProtectedRoute>
          } />

          {/* Admin */}
          <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
            <Route index element={<AdminDashboard />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="formations" element={<AdminCourses />} />
            <Route path="videos" element={<AdminVideos />} />
            <Route path="upload" element={<AdminUpload />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
