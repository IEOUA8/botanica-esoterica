import { Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Header from './Header'
import Footer from './Footer'
import AnnouncementBar from '../ui/AnnouncementBar'
import ToastContainer from '../ui/Toast'
import SearchOverlay from '../ui/SearchOverlay'
import QuickViewModal from '../ui/QuickViewModal'

export default function PublicLayout() {
  const location = useLocation()
  return (
    <div className="min-h-screen bg-warm text-deep">
      <AnnouncementBar />
      <Header />
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
        >
          <Outlet />
        </motion.div>
      </AnimatePresence>
      <Footer />
      <SearchOverlay />
      <QuickViewModal />
      <ToastContainer />
    </div>
  )
}
