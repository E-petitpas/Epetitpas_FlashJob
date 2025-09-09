import { Search, Zap } from "lucide-react";
import { Button } from "./ui/button.tsx";
import { Input } from "./ui/input.tsx";
import { useNavigate } from "react-router-dom";
import React from "react";

export function HeroSection() {
  const navigate = useNavigate();
  return (
    <section className="bg-gradient-to-br from-blue-50 to-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="flex items-center justify-center mb-6">
            <Zap className="h-8 w-8 text-yellow-400 mr-2" />
            <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
              Services express disponibles 24h/24
            </span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Vos besoins,{' '}
            <span className="text-blue-600">une solution</span>{' '}
            en un clic
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Trouvez des experts qualifiés pour tous vos projets numériques et pratiques. 
            Rapide, simple et accessible.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-lg mx-auto">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Ex: création logo, cours anglais..."
                className="pl-12 h-14 rounded-xl border-gray-200 bg-white shadow-sm"
              />
            </div>
            <Button 
              type="button"
              className="h-14 px-8 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium"
              onClick={() => navigate('/services')}
            >
              Trouver un service
            </Button>
          </div>
          
          <div className="mt-8 flex items-center justify-center space-x-8 text-sm text-gray-500">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
              +2,500 services disponibles
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
              Livraison sous 24h
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></div>
              Paiement sécurisé
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}