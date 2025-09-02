import { createContext, useContext, useState, ReactNode } from 'react';
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

export type Route = 'home' | 'service' | 'checkout' | 'dashboard' | 'login' | 'signup' | 'messages' | 'services' | 'create-service' | 'my-services';

interface RouterContextType {
  currentRoute: Route;
  navigateTo: (route: Route, params?: any) => void;
  routeParams: any;
  user: any;
  setUser: (user: any) => void;
}

const RouterContext = createContext<RouterContextType | null>(null);

export function useRouter() {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error('useRouter must be used within RouterProvider');
  }
  return context;
}

interface RouterProviderProps {
  children: ReactNode;
}

export function RouterProvider({ children }: RouterProviderProps) {
  const [currentRoute, setCurrentRoute] = useState<Route>('home');
  const [routeParams, setRouteParams] = useState<any>(null);
  const [user, setUser] = useState<any>(null);

  const navigateTo = (route: Route, params?: any) => {
    setCurrentRoute(route);
    setRouteParams(params || null);
  };

  return (
    <RouterContext.Provider value={{ 
      currentRoute, 
      navigateTo, 
      routeParams, 
      user, 
      setUser 
    }}>
      {children}
    </RouterContext.Provider>
  );
}

export function AppRouter() {
  const { currentRoute } = useRouter();

  return (
    <div className="min-h-screen bg-white">
      {currentRoute !== 'login' && currentRoute !== 'signup' && <Header />}
      
      <main>
        {currentRoute === 'home' && (
          <>
            <HeroSection />
            <CategoriesSection />
            <PopularServicesSection />
            <TestimonialsSection />
          </>
        )}
        {currentRoute === 'service' && <ServiceDetailPage />}
        {currentRoute === 'checkout' && <CheckoutPage />}
        {currentRoute === 'dashboard' && <ClientDashboard />}
        {currentRoute === 'messages' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
              <p className="text-gray-600">Communiquez avec vos prestataires</p>
            </div>
            <MessagingPage />
          </div>
        )}
        {currentRoute === 'services' && <ServiceListPage />}
        {currentRoute === 'create-service' && <ServiceCreationPage />}
        {currentRoute === 'my-services' && <MyServicesPage />}
        {currentRoute === 'login' && <LoginPage />}
        {currentRoute === 'signup' && <SignupPage />}
      </main>
      
      {currentRoute !== 'login' && currentRoute !== 'signup' && <Footer />}
    </div>
  );
}