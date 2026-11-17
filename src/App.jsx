import { Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence, MotionConfig } from 'framer-motion';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import PageTransition from './components/layout/PageTransition';
import GrainOverlay from './components/shared/GrainOverlay';
import Home from './pages/Home';
import About from './pages/About';
import Events from './pages/Events';
import Restaurant from './pages/Restaurant';
import Upcoming from './pages/Upcoming';
import Login from './pages/Login';
import AdminBanner from './components/admin/AdminBanner';

export default function App() {
  const location = useLocation();
  return (
    <MotionConfig reducedMotion="user">
      <a href="#main" className="skip">Saltar al contenido</a>
      <GrainOverlay fixed />
      <Navbar />
      <AnimatePresence mode="wait">
        <PageTransition key={location.pathname.split('/').slice(0, 2).join('/')}>
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/nosotros" element={<About />} />
            <Route path="/eventos" element={<Events />} />
            <Route path="/eventos/:slug" element={<Events />} />
            <Route path="/resto" element={<Restaurant />} />
            <Route path="/proximamente" element={<Upcoming />} />
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </PageTransition>
      </AnimatePresence>
      <Footer />
      <AdminBanner />
    </MotionConfig>
  );
}
