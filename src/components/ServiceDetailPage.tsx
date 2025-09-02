import { useState, useEffect } from "react";
import { Star, Clock, Shield, MessageCircle, Heart, Share2, Zap, ArrowLeft, AlertCircle } from "lucide-react";
import { Button } from "./ui/button.tsx";
import { Badge } from "./ui/badge.tsx";
import { Card } from "./ui/card.tsx";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar.tsx";
import { Separator } from "./ui/separator.tsx";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs.tsx";
import { Alert, AlertDescription } from "./ui/alert.tsx";
import { ImageWithFallback } from "./figma/ImageWithFallback.tsx";
import { useRouter } from "./AppRouter.tsx";
import { projectId, publicAnonKey } from "../utils/supabase/info";

// Mock data pour un service
const serviceData = {
  id: 1,
  title: "Création de logo professionnel + guide de marque complet",
  images: [
    "https://images.unsplash.com/photo-1740174459699-487aec1f7bc5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmFwaGljJTIwZGVzaWduJTIwY3JlYXRpdmV8ZW58MXx8fHwxNzU2NTkzMzQwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  ],
  rating: 4.9,
  reviewCount: 127,
  price: 45,
  originalPrice: 65,
  deliveryTime: "24h",
  isExpress: true,
  description: "Créez une identité visuelle forte avec un logo professionnel unique. Je vous accompagne dans la création de votre logo avec plusieurs propositions, révisions illimitées et un guide de marque complet pour utiliser votre logo dans toutes les situations.",
  seller: {
    name: "Marie Laurent",
    username: "mariedesign",
    avatar: "https://images.unsplash.com/photo-1708195886023-3ecb00ac7a49?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHByb2Zlc3Npb25hbCUyMHBvcnRyYWl0fGVufDF8fHx8MTc1NjY1NTk5N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    level: "Expert",
    memberSince: "2022",
    totalOrders: 340,
    responseTime: "< 1h",
    rating: 4.9,
    badges: ["Expert certifié", "Livraison rapide", "Top vendeur"]
  },
  packages: [
    {
      name: "Basique",
      price: 45,
      deliveryTime: "24h",
      features: [
        "1 proposition de logo",
        "3 révisions incluses",
        "Fichiers PNG/JPG haute résolution",
        "Logo en couleur et noir & blanc"
      ]
    },
    {
      name: "Standard",
      price: 75,
      deliveryTime: "48h",
      features: [
        "3 propositions de logo",
        "Révisions illimitées",
        "Fichiers PNG/JPG/SVG/AI",
        "Guide de marque (8 pages)",
        "Déclinaisons couleurs"
      ],
      popular: true
    },
    {
      name: "Premium",
      price: 120,
      deliveryTime: "72h",
      features: [
        "5 propositions de logo",
        "Révisions illimitées",  
        "Tous formats professionnels",
        "Guide de marque complet (15 pages)",
        "Déclinaisons + animations",
        "Support prioritaire 6 mois"
      ]
    }
  ]
};

const reviews = [
  {
    id: 1,
    author: "Pierre D.",
    rating: 5,
    date: "Il y a 2 jours",
    comment: "Excellent travail ! Marie a parfaitement compris mes attentes et le logo livré dépasse mes espérances. Communication fluide et respect des délais.",
    helpful: 8
  },
  {
    id: 2,
    author: "Sophie M.",
    rating: 5,
    date: "Il y a 1 semaine",
    comment: "Très professionnelle, créative et à l'écoute. Le guide de marque est très détaillé. Je recommande vivement !",
    helpful: 12
  }
];

export function ServiceDetailPage() {
  const { navigateTo, routeParams } = useRouter();
  const [service, setService] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchService = async () => {
      const DEBUG = false; // Set to true for debugging

      if (DEBUG) console.log('Fetching service with params:', routeParams);

      if (!routeParams?.serviceId) {
        if (DEBUG) console.log('No serviceId provided, using mock data');
        // Use mock data if no service ID
        setService(serviceData);
        setIsLoading(false);
        return;
      }

      try {
        if (DEBUG) console.log('Fetching service from API:', routeParams.serviceId);
        
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-6e866e97/services/${routeParams.serviceId}`,
          {
            headers: {
              'Authorization': `Bearer ${publicAnonKey}`
            }
          }
        );

        if (DEBUG) console.log('API Response status:', response.status);

        if (response.ok) {
          const data = await response.json();
          if (DEBUG) console.log('API Response data:', data);
          
          if (data.service) {
            // Transform API data to match UI expectations
            const transformedService = {
              ...data.service,
              images: data.service.photos || [serviceData.images[0]],
              seller: {
                name: "Prestataire FlashJob",
                username: "provider",
                avatar: "",
                level: "Standard",
                memberSince: "2024",
                totalOrders: Math.floor(Math.random() * 100) + 20,
                responseTime: "< 2h",
                rating: 4.5,
                badges: ["Prestataire vérifié"]
              },
              packages: [
                {
                  name: "Standard",
                  price: data.service.price,
                  deliveryTime: data.service.deliveryTime || "48h",
                  features: [
                    "Service professionnel",
                    "Livraison dans les délais",
                    "Support inclus",
                    "Révisions possibles"
                  ],
                  popular: true
                }
              ],
              rating: 4.5,
              reviewCount: Math.floor(Math.random() * 50) + 10,
              isExpress: data.service.deliveryTime === "24h"
            };
            setService(transformedService);
          } else {
            if (DEBUG) console.log('No service found in response');
            setError("Service non trouvé");
          }
        } else if (response.status === 404) {
          if (DEBUG) console.log('Service not found (404)');
          // Try to use mock data as fallback for existing mock services
          if (routeParams.serviceId === "1" || routeParams.serviceId === "2" || routeParams.serviceId === "3") {
            if (DEBUG) console.log('Using mock data as fallback for mock service');
            setService(serviceData);
          } else {
            setError("Service non trouvé ou non disponible");
          }
        } else {
          if (DEBUG) console.log('API Error:', response.status, response.statusText);
          // Try to use mock data as fallback for existing services
          if (routeParams.serviceId === "1" || routeParams.serviceId === "2" || routeParams.serviceId === "3") {
            if (DEBUG) console.log('Using mock data as fallback');
            setService(serviceData);
          } else {
            setError("Erreur lors du chargement du service");
          }
        }
      } catch (error) {
        console.error('Error fetching service:', error);
        // Try to use mock data as fallback for existing services
        if (routeParams.serviceId === "1" || routeParams.serviceId === "2" || routeParams.serviceId === "3") {
          if (DEBUG) console.log('Using mock data as fallback after error');
          setService(serviceData);
        } else {
          setError("Erreur de connexion");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchService();
  }, [routeParams]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <div className="h-96 bg-gray-200 rounded-xl"></div>
                <div className="space-y-4">
                  <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
              <div className="lg:col-span-1">
                <div className="h-64 bg-gray-200 rounded-xl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-gray-600 hover:text-gray-900"
              onClick={() => navigateTo('services')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour aux services
            </Button>
          </div>
          
          <Card className="p-12 rounded-xl text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Service non trouvé</h1>
            <p className="text-gray-600 mb-6">
              Le service que vous recherchez n'existe plus ou a été supprimé.
            </p>
            <div className="flex justify-center space-x-3">
              <Button
                variant="outline"
                onClick={() => navigateTo('services')}
                className="rounded-xl"
              >
                Voir tous les services
              </Button>
              <Button
                onClick={() => navigateTo('home')}
                className="rounded-xl bg-blue-600 hover:bg-blue-700"
              >
                Retour à l'accueil
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (!service) {
    return null;
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Bouton retour */}
        <div className="mb-6">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-gray-600 hover:text-gray-900"
            onClick={() => navigateTo('services')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour aux services
          </Button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonne principale */}
          <div className="lg:col-span-2 space-y-8">
            {/* Images du service */}
            <Card className="overflow-hidden rounded-xl">
              <div className="relative">
                <ImageWithFallback
                  src={service.images[0]}
                  alt={service.title}
                  className="w-full h-96 object-cover"
                />
                {service.isExpress && (
                  <Badge className="absolute top-4 left-4 bg-yellow-400 text-gray-900 hover:bg-yellow-500">
                    <Zap className="w-3 h-3 mr-1" />
                    Express 24h
                  </Badge>
                )}
                <div className="absolute top-4 right-4 flex space-x-2">
                  <Button variant="ghost" size="sm" className="bg-white/90 backdrop-blur-sm hover:bg-white">
                    <Heart className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="bg-white/90 backdrop-blur-sm hover:bg-white">
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>

            {/* Titre et informations principales */}
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-4">{service.title}</h1>
              <div className="flex items-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="font-medium">{service.rating}</span>
                  <span>({service.reviewCount} avis)</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>Livraison en {service.deliveryTime || service.packages[0]?.deliveryTime}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Shield className="w-4 h-4" />
                  <span>Paiement sécurisé</span>
                </div>
              </div>
            </div>

            {/* Tabs de contenu */}
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="seller">Vendeur</TabsTrigger>
                <TabsTrigger value="reviews">Avis ({service.reviewCount})</TabsTrigger>
              </TabsList>
              
              <TabsContent value="description" className="mt-6">
                <Card className="p-6 rounded-xl">
                  <p className="text-gray-700 leading-relaxed">
                    {service.description || serviceData.description}
                  </p>
                </Card>
              </TabsContent>
              
              <TabsContent value="seller" className="mt-6">
                <Card className="p-6 rounded-xl">
                  <div className="flex items-start space-x-4">
                    <Avatar className="w-16 h-16">
                      <AvatarImage src={service.seller.avatar} />
                      <AvatarFallback className="bg-blue-100 text-blue-600">
                        {service.seller.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold text-gray-900">{service.seller.name}</h3>
                        <Badge variant="secondary">{service.seller.level}</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">@{service.seller.username}</p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Membre depuis</p>
                          <p className="font-medium">{service.seller.memberSince}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Commandes</p>
                          <p className="font-medium">{service.seller.totalOrders}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Temps de réponse</p>
                          <p className="font-medium">{service.seller.responseTime}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Note moyenne</p>
                          <p className="font-medium">{service.seller.rating}/5</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mt-4">
                        {service.seller.badges.map((badge, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {badge}
                          </Badge>
                        ))}
                      </div>
                      
                      <Button 
                        className="mt-4 rounded-xl"
                        onClick={() => navigateTo('messages')}
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Contacter le vendeur
                      </Button>
                    </div>
                  </div>
                </Card>
              </TabsContent>
              
              <TabsContent value="reviews" className="mt-6">
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <Card key={review.id} className="p-6 rounded-xl">
                      <div className="flex items-start space-x-4">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback className="bg-blue-100 text-blue-600">
                            {review.author.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className="font-medium text-gray-900">{review.author}</h4>
                            <div className="flex items-center space-x-1">
                              {[...Array(review.rating)].map((_, i) => (
                                <Star key={i} className="w-3 h-3 text-yellow-400 fill-current" />
                              ))}
                            </div>
                            <span className="text-sm text-gray-500">{review.date}</span>
                          </div>
                          <p className="text-gray-700 mb-2">{review.comment}</p>
                          <p className="text-xs text-gray-500">{review.helpful} personnes ont trouvé cet avis utile</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar commande */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Card className="p-6 rounded-xl">
                <div className="space-y-6">
                  {service.packages.map((pkg, index) => (
                    <div key={index} className={`relative border rounded-xl p-4 ${pkg.popular ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
                      {pkg.popular && (
                        <Badge className="absolute -top-2 left-4 bg-blue-600 text-white">
                          Le plus populaire
                        </Badge>
                      )}
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-semibold text-gray-900">{pkg.name}</h3>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-gray-900">€{pkg.price}</p>
                          <p className="text-sm text-gray-500">Livraison {pkg.deliveryTime}</p>
                        </div>
                      </div>
                      <ul className="space-y-2 mb-4">
                        {pkg.features.map((feature, i) => (
                          <li key={i} className="text-sm text-gray-600 flex items-start">
                            <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 mr-2 flex-shrink-0"></div>
                            {feature}
                          </li>
                        ))}
                      </ul>
                      <Button 
                        className={`w-full rounded-xl ${pkg.popular ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
                        onClick={() => navigateTo('checkout', { 
                          serviceId: service.id,
                          package: pkg.name, 
                          price: pkg.price,
                          title: service.title 
                        })}
                      >
                        Commander maintenant
                      </Button>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}