import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import AboutPage from './pages/AboutPage'
import ProgramsPage from './pages/ProgramsPage'
import ProgramDetailPage from './pages/ProgramDetailPage'
import BookshopPage from './pages/BookshopPage'
import AromaPage from './pages/AromaPage'
import TeamPage from './pages/TeamPage'
import BlogPage from './pages/BlogPage'
import BlogPostPage from './pages/BlogPostPage'
import ContactPage from './pages/ContactPage'
import ClassApplyPage from './pages/ClassApplyPage'
import SurveyPage from './pages/SurveyPage'
import NotFound from './pages/NotFound'

// 코칭 예약 시스템(booking) — 자체 레이아웃(PublicLayout)을 쓰는 독립 페이지들
import BookingHome from './booking/pages/BookingHome'
import Apply from './booking/pages/Apply'
import Booking from './booking/pages/Booking'
import Payment from './booking/pages/Payment'
import PaymentSuccess from './booking/pages/PaymentSuccess'
import PaymentFail from './booking/pages/PaymentFail'
import Complete from './booking/pages/Complete'
import MyReservation from './booking/pages/MyReservation'
import Privacy from './booking/pages/Privacy'
import AdminApp from './booking/pages/admin/AdminApp'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/programs" element={<ProgramsPage />} />
        <Route path="/programs/:id" element={<ProgramDetailPage />} />
        <Route path="/bookshop" element={<BookshopPage />} />
        <Route path="/aroma" element={<AromaPage />} />
        <Route path="/team" element={<TeamPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:slug" element={<BlogPostPage />} />
        <Route path="/class" element={<ClassApplyPage />} />
        <Route path="/survey" element={<SurveyPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* 코칭 예약 시스템 (독립 레이아웃) */}
      <Route path="/coaching" element={<BookingHome />} />
      <Route path="/apply" element={<Apply />} />
      <Route path="/booking" element={<Booking />} />
      <Route path="/payment" element={<Payment />} />
      <Route path="/payment/success" element={<PaymentSuccess />} />
      <Route path="/payment/fail" element={<PaymentFail />} />
      <Route path="/complete" element={<Complete />} />
      <Route path="/my" element={<MyReservation />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/admin/*" element={<AdminApp />} />
    </Routes>
  )
}

export default App
