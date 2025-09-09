import { Star, Clock, User, Zap } from "lucide-react";
import { Card } from "./ui/card.tsx";
import { Badge } from "./ui/badge.tsx";
import { Button } from "./ui/button.tsx";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar.tsx";
import { ImageWithFallback } from "./figma/ImageWithFallback.tsx";
import { useNavigate } from "react-router-dom";

const popularServices = [
  {
    id: 1,
    title: "Création de logo professionnel + guide de marque",
    description: "Logo unique avec déclinaisons et guide d'utilisation complet",
    price: 45,
    originalPrice: 65,
    rating: 4.9,
    reviewCount: 127,
    deliveryTime: "24h",
    isExpress: true,
    image: "https://images.unsplash.com/photo-1740174459699-487aec1f7bc5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmFwaGljJTIwZGVzaWduJTIwY3JlYXRpdmV8ZW58MXx8fHwxNzU2NTkzMzQwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    seller: {
      name: "Marie L.",
      avatar: "https://images.unsplash.com/photo-1708195886023-3ecb00ac7a49?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHByb2Zlc3Npb25hbCUyMHBvcnRyYWl0fGVufDF8fHx8MTc1NjY1NTk5N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      level: "Expert"
    }
  },
  {
    id: 2,
    title: "Site web vitrine responsive + hébergement 1 an",
    description: "Site professionnel clé en main avec nom de domaine inclus",
    price: 120,
    originalPrice: 180,
    rating: 4.8,
    reviewCount: 89,
    deliveryTime: "3 jours",
    isExpress: false,
    image: "https://images.unsplash.com/photo-1716703373020-17ff360924ee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwc2VydmljZXMlMjB3b3Jrc3BhY2V8ZW58MXx8fHwxNzU2NjczNDY4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    seller: {
      name: "Thomas D.",
      avatar: "",
      level: "Pro"
    }
  },
  {
    id: 3,
    title: "Cours d'anglais particulier - 5 séances",
    description: "Amélioration rapide avec professeur natif certifié",
    price: 85,
    originalPrice: 110,
    rating: 5.0,
    reviewCount: 203,
    deliveryTime: "Flexible",
    isExpress: true,
    image: "https://images.unsplash.com/photo-1673515335586-f9f662c01482?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvbmxpbmUlMjB0dXRvcmluZyUyMGVkdWNhdGlvbnxlbnwxfHx8fDE3NTY2NzM0Njl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    seller: {
      name: "Sarah M.",
      avatar: "",
      level: "Expert"
    }
  }
];

export function PopularServicesSection() {
  const navigate = useNavigate();
  
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Services les plus populaires
          </h2>
          <p className="text-lg text-gray-600">
            Découvrez les prestations préférées de nos clients
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {popularServices.map((service) => (
            <Card key={service.id} className="overflow-hidden hover:shadow-xl transition-shadow rounded-xl border-gray-100">
              <div className="relative">
                <ImageWithFallback
                  src={service.image}
                  alt={service.title}
                  className="w-full h-48 object-cover"
                />
                {service.isExpress && (
                  <Badge className="absolute top-3 left-3 bg-yellow-400 text-gray-900 hover:bg-yellow-500">
                    <Zap className="w-3 h-3 mr-1" />
                    Express
                  </Badge>
                )}
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1">
                  <div className="flex items-center space-x-1">
                    <Star className="w-3 h-3 text-yellow-400 fill-current" />
                    <span className="text-xs font-medium">{service.rating}</span>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center space-x-3 mb-3">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={service.seller.avatar} />
                    <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">
                      {service.seller.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{service.seller.name}</p>
                    <p className="text-xs text-gray-500">{service.seller.level}</p>
                  </div>
                </div>
                
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                  {service.title}
                </h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {service.description}
                </p>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{service.deliveryTime}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium">{service.rating}</span>
                    <span className="text-sm text-gray-500">({service.reviewCount})</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-baseline space-x-2">
                    <span className="text-lg font-bold text-gray-900">€{service.price}</span>
                    {service.originalPrice && (
                      <span className="text-sm text-gray-500 line-through">€{service.originalPrice}</span>
                    )}
                  </div>
                  <Button 
                    className="rounded-xl bg-blue-600 hover:bg-blue-700"
                    onClick={() => navigate('/service', { state: { serviceId: service.id } })}
                  >
                    Voir le service
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Button 
            variant="outline" 
            className="rounded-xl border-gray-200 hover:bg-gray-50 px-8 py-3"
            onClick={() => navigate('/service')}
          >
            Voir tous les services populaires
          </Button>
        </div>
      </div>
    </section>
  );
}