import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import HorizontalMenu from './components/HorizontalMenu'
import EmployeeGrid from './components/EmployeeGrid'
import Login from './components/Login'
import Home from './pages/Home'
import Products from './pages/Products'
import Product1 from './pages/Product1'
import Product2 from './pages/Product2'
import Product3 from './pages/Product3'
import Services from './pages/Services'
import Service1 from './pages/Service1'
import Service2 from './pages/Service2'
import About from './pages/About'
import Contact from './pages/Contact'
import Email from './pages/Email'
import Phone from './pages/Phone'
import Location from './pages/Location'
import './App.css'

const ProtectedRoute = ({ children, requireAuth = true }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="loading-container">Loading...</div>;
  }

  if (requireAuth && !isAuthenticated()) {
    return <Login />;
  }

  return children;
};

function AppContent() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated()) {
    return <Login />;
  }

  return (
    <>
      <HorizontalMenu />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<EmployeeGrid />} />
          <Route path="/home" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/product1" element={<Product1 />} />
          <Route path="/products/product2" element={<Product2 />} />
          <Route path="/products/product3" element={<Product3 />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/service1" element={<Service1 />} />
          <Route path="/services/service2" element={<Service2 />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/contact/email" element={<Email />} />
          <Route path="/contact/phone" element={<Phone />} />
          <Route path="/contact/location" element={<Location />} />
          <Route path="/employees" element={<EmployeeGrid />} />
        </Routes>
      </main>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <AppContent />
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
