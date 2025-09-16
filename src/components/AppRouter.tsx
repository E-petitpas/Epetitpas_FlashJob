import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Header } from './Header.tsx';
import { HeroSection } from './HeroSection.tsx';
import { CategoriesSection } from './CategoriesSection.tsx';
import { PopularServicesSection } from './PopularServicesSection.tsx';
import { TestimonialsSection } from './TestimonialsSection.tsx';
import { Footer } from './Footer.tsx';
import { ServiceDetailPage } from './ServiceDetailPage.tsx';
import { CheckoutPage } from './CheckoutPage.tsx';
import { ClientDashboard } from './ClientDashboard.tsx';
import { LoginPage } from './LoginPage.tsx';
import { SignupPage } from './SignupPage.tsx';
import { MessagingPage } from './MessagingPage.tsx';
import { ServiceListPage } from './ServiceListPage.tsx';
import { ServiceCreationPage } from './ServiceCreationPage.tsx';
import { MyServicesPage } from "./MyServicesPage.tsx";
import { EmailVerificationPage } from "./EmailVerificationPage";
import { Minimal } from "./Minimal.tsx";

export function AppRouter() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-white">
        
        {/* <Minimal /> */}
        <Header />
        <main>
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <HeroSection />
                  <CategoriesSection />
                  <PopularServicesSection />
                  <TestimonialsSection />
                </>
              }
            />
            <Route path="/service" element={<ServiceDetailPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/dashboard" element={<ClientDashboard />} />
            {/* <Route path="/messages" element={
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-6">
                  <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
                  <p className="text-gray-600">Communiquez avec vos prestataires</p>
                </div>
                <MessagingPage />
              </div>
            } /> */}
            <Route path="/services" element={<ServiceListPage />} />
            <Route path="/create-service/:serviceId?" element={<ServiceCreationPage />} />
            <Route path="/my-services" element={<MyServicesPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/email-verification" element={<EmailVerificationPage />} />
            <Route path="/service/" element={<ServiceCreationPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}