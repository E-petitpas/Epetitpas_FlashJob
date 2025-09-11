import { Star, Camera, Heart, MapPin, Clock, Euro, ArrowRight, User, Verified } from "lucide-react";
import { Button } from "./ui/button.tsx";
import { Card } from "./ui/card.tsx";
import { Badge } from "./ui/badge.tsx";
import { ImageWithFallback } from "./figma/ImageWithFallback.tsx";

export function PreviewPage() {
  const services = [
    {
      id: 1,
      title: "Design de logo professionnel moderne",
      description: "Création de logo unique et moderne pour votre entreprise avec plusieurs propositions et révisions incluses.",
      image: "https://images.unsplash.com/photo-1510832758362-af875829efcf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcmVhdGl2ZSUyMGRlc2lnbiUyMHdvcmtzcGFjZXxlbnwxfHx8fDE3NTc1ODEwNzV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      price: "150",
      duration: "48h",
      rating: 4.9,
      reviews: 127,
      provider: {
        name: "Sophie Martin",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b2e0d1c4?w=40&h=40&fit=crop&crop=face",
        verified: true
      },
      category: "Design & Créatif",
      location: "Paris"
    },
    {
      id: 2,
      title: "Développement site web responsive",
      description: "Création d'un site web moderne, responsive et optimisé SEO avec interface d'administration.",
      image: "https://images.unsplash.com/photo-1593720213681-e9a8778330a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWIlMjBkZXZlbG9wbWVudCUyMGNvZGV8ZW58MXx8fHwxNzU3NDc5NDEwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      price: "1 200",
      duration: "5-7 jours",
      rating: 5.0,
      reviews: 89,
      provider: {
        name: "Alexandre Durand",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
        verified: true
      },
      category: "Développement Web",
      location: "Lyon"
    },
    {
      id: 3,
      title: "Stratégie marketing digital complète",
      description: "Audit complet, stratégie réseaux sociaux, campagnes publicitaires et suivi des performances.",
      image: "https://images.unsplash.com/photo-1612952020509-359f309bd102?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXJrZXRpbmclMjBkaWdpdGFsJTIwbGFwdG9wfGVufDF8fHx8MTc1NzU4NTkwOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      price: "800",
      duration: "2-3 jours",
      rating: 4.8,
      reviews: 156,
      provider: {
        name: "Camille Bernard",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face",
        verified: true
      },
      category: "Marketing Digital",
      location: "Marseille"
    },
    {
      id: 4,
      title: "Séance photo professionnelle",
      description: "Shooting photo professionnel en studio ou extérieur avec retouches incluses et galerie en ligne.",
      image: "https://images.unsplash.com/photo-1624981015149-e01395f1d774?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBwaG90b2dyYXBoeXxlbnwxfHx8fDE3NTc1NDg5MzF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      price: "300",
      duration: "24h",
      rating: 4.9,
      reviews: 203,
      provider: {
        name: "Thomas Moreau",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
        verified: true
      },
      category: "Photographie",
      location: "Nice"
    },
    {
      id: 5,
      title: "Service de ménage premium",
      description: "Nettoyage complet et approfondi de votre domicile ou bureau avec produits écologiques inclus.",
      image: "https://images.unsplash.com/photo-1742483359033-13315b247c74?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbGVhbmluZyUyMHNlcnZpY2UlMjBwcm9mZXNzaW9uYWx8ZW58MXx8fHwxNzU3NTg1OTE0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      price: "85",
      duration: "2-3h",
      rating: 4.7,
      reviews: 342,
      provider: {
        name: "Marie Dubois",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=40&h=40&fit=crop&crop=face",
        verified: true
      },
      category: "Services à domicile",
      location: "Toulouse"
    },
    {
      id: 6,
      title: "Livraison express documents",
      description: "Service de coursier professionnel pour livraisons urgentes dans toute la ville en moins de 2h.",
      image: "https://images.unsplash.com/photo-1646920912229-bc0d5d94e68b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZWxpdmVyeSUyMHNlcnZpY2UlMjBjb3VyaWVyfGVufDF8fHx8MTc1NzU4NTkxOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      price: "25",
      duration: "2h",
      rating: 4.8,
      reviews: 89,
      provider: {
        name: "Lucas Petit",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face",
        verified: true
      },
      category: "Livraison",
      location: "Bordeaux"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with preview badge */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center space-x-2">
            <Camera className="w-4 h-4" />
            <span className="text-sm font-medium">Aperçu de FlashJob - Plateforme de services à la demande</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Trouvez le service parfait pour
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent block">
                vos besoins
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              FlashJob connecte les clients avec des prestataires qualifiés pour des services rapides et professionnels.
              Design, développement, marketing, ménage, livraison et bien plus !
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl">
                Explorer les services
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button variant="outline" className="px-8 py-3 rounded-xl">
                Devenir prestataire
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Services populaires</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Découvrez notre sélection de services de qualité proposés par des professionnels vérifiés
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <Card key={service.id} className="rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-300 group">
              {/* Image du service */}
              <div className="relative overflow-hidden">
                <ImageWithFallback
                  src={service.image}
                  alt={service.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 right-3">
                  <Badge className="bg-white/90 text-gray-700 hover:bg-white">
                    {service.category}
                  </Badge>
                </div>
                <button className="absolute top-3 left-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors">
                  <Heart className="w-4 h-4 text-gray-600" />
                </button>
              </div>

              {/* Contenu */}
              <div className="p-6">
                {/* Provider info */}
                <div className="flex items-center space-x-3 mb-4">
                  <ImageWithFallback
                    src={service.provider.avatar}
                    alt={service.provider.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-1">
                      <span className="font-medium text-gray-900">{service.provider.name}</span>
                      {service.provider.verified && (
                        <Verified className="w-4 h-4 text-blue-600" />
                      )}
                    </div>
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <MapPin className="w-3 h-3" />
                      <span>{service.location}</span>
                    </div>
                  </div>
                </div>

                {/* Service title */}
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {service.description}
                </p>

                {/* Rating */}
                <div className="flex items-center space-x-2 mb-4">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium text-gray-900">{service.rating}</span>
                  </div>
                  <span className="text-gray-500 text-sm">({service.reviews} avis)</span>
                </div>

                {/* Prix et durée */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1 text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">{service.duration}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="text-2xl font-bold text-gray-900">{service.price}</span>
                    <Euro className="w-5 h-5 text-gray-600" />
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Prêt à commencer ?</h2>
            <p className="text-xl mb-8 text-blue-100">
              Rejoignez des milliers d'utilisateurs qui font confiance à FlashJob
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-white text-blue-600 hover:bg-gray-50 px-8 py-3 rounded-xl font-medium">
                Créer un compte gratuit
              </Button>
              <Button variant="outline" className="border-white text-white hover:bg-white/10 px-8 py-3 rounded-xl">
                Explorer sans compte
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">10 000+</div>
              <div className="text-gray-600">Services réalisés</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">5 000+</div>
              <div className="text-gray-600">Prestataires actifs</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">98%</div>
              <div className="text-gray-600">Clients satisfaits</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">24h</div>
              <div className="text-gray-600">Temps de réponse moyen</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}