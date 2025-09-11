import { useState, useEffect } from "react";
import { Search, Filter, Star, Clock, MapPin, Euro, Plus } from "lucide-react";
import { Button } from "./ui/button.tsx";
import { Card } from "./ui/card.tsx";
import { Input } from "./ui/input.tsx";
import { Badge } from "./ui/badge.tsx";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar.tsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select.tsx";
import { ImageWithFallback } from "./figma/ImageWithFallback.tsx";
import { useNavigate } from "react-router-dom";
import { projectId, publicAnonKey } from "../utils/supabase/info";

const categories = [
  "Tous",
  "Design & Créatif",
  "Développement Web",
  "Marketing Digital",
  "Rédaction & Traduction",
  "Cours & Formations",
  "Services Administratifs",
  "Photographie",
  "Autres"
];

const defaultServiceImage = "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZXJ2aWNlJTIwcGxhY2Vob2xkZXJ8ZW58MXx8fHwxNzU2NzU4MzAwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";

// Mock data for services
const mockServices = [
  {
    id: "1",
    title: "Création de logo professionnel + guide de marque",
    description: "Je crée votre identité visuelle complète avec logo unique et guide de marque professionnel.",
    price: 75,
    category: "Design & Créatif",
    deliveryTime: "48h",
    photos: ["https://images.unsplash.com/photo-1740174459699-487aec1f7bc5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmFwaGljJTIwZGVzaWduJTIwY3JlYXRpdmV8ZW58MXx8fHwxNzU2NTkzMzQwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"],
    seller: {
      name: "Marie Laurent",
      avatar: "https://images.unsplash.com/photo-1708195886023-3ecb00ac7a49?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHByb2Zlc3Npb25hbCUyMHBvcnRyYWl0fGVufDF8fHx8MTc1NjY1NTk5N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      rating: 4.9,
      reviewCount: 127
    }
  },
  {
    id: "2",
    title: "Site web responsive - Landing page moderne",
    description: "Développement de landing page moderne et responsive avec optimisation SEO incluse.",
    price: 250,
    category: "Développement Web",
    deliveryTime: "5j",
    photos: ["https://images.unsplash.com/photo-1716703373020-17ff360924ee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwc2VydmljZXMlMjB3b3Jrc3BhY2V8ZW58MXx8fHwxNzU2NjczNDY4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"],
    seller: {
      name: "Thomas Dubois",
      avatar: "",
      rating: 4.8,
      reviewCount: 89
    }
  },
  {
    id: "3",
    title: "Cours d'anglais particuliers - Conversation",
    description: "Cours d'anglais personnalisés axés sur la conversation et l'expression orale.",
    price: 45,
    category: "Cours & Formations",
    deliveryTime: "24h",
    photos: ["https://images.unsplash.com/photo-1673515335586-f9f662c01482?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvbmxpbmUlMjB0dXRvcmluZyUyMGVkdWNhdGlvbnxlbnwxfHx8fDE3NTY2NzM0Njl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"],
    seller: {
      name: "Sarah Martin",
      avatar: "",
      rating: 5.0,
      reviewCount: 45
    }
  }
];

export function ServiceListPage() {
  const navigate = useNavigate();
  const [services, setServices] = useState(mockServices);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [sortBy, setSortBy] = useState("recent");
  const [isLoading, setIsLoading] = useState(false);

  const fetchServices = async () => {
    setIsLoading(true);
    try {
      const categoryParam = selectedCategory !== "Tous" ? `?category=${encodeURIComponent(selectedCategory)}` : '';
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-6e866e97/services${categoryParam}`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`
          }
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        if (data.services) {
          // Merge with mock data for now, in production use only API data
          const apiServices = data.services.map((service: any) => ({
            ...service,
            seller: {
              name: "Prestataire FlashJob",
              avatar: "",
              rating: 4.5,
              reviewCount: Math.floor(Math.random() * 100) + 10
            }
          }));
          setServices([...mockServices, ...apiServices]);
        } else {
          setServices(mockServices);
        }
      } else {
        console.error('Failed to fetch services:', response.statusText);
        setServices(mockServices);
      }
    } catch (error) {
      console.error('Error fetching services:', error);
      setServices(mockServices);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, [selectedCategory]);

  const filteredServices = services.filter(service => {
    const matchesSearch = service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "Tous" || service.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedServices = [...filteredServices].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "rating":
        return b.seller.rating - a.seller.rating;
      default:
        return 0; // Keep original order for "recent"
    }
  });

  const handleBookService = async (serviceId: string) => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-6e866e97/book-service`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`
          },
          body: JSON.stringify({
            serviceId,
            buyerId: 'current_user', // In real app, get from auth
            buyerName: 'Jean Dupont',
            buyerEmail: 'jean.dupont@email.com'
          })
        }
      );

      const result = await response.json();
      if (result.success) {
        navigate('/checkout');
      } else {
        alert(result.error || "Erreur lors de la réservation");
      }
    } catch (error) {
      console.error('Booking error:', error);
      alert("Erreur lors de la réservation");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Services disponibles</h1>
            <p className="text-gray-600">Découvrez tous les services proposés par notre communauté</p>
          </div>
          <Button
            onClick={() => navigate('/create-service')}
            className="rounded-xl bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Proposer un service
          </Button>
        </div>

        {/* Filters */}
        <Card className="p-6 rounded-xl mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                <Input
                  placeholder="Rechercher un service..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 rounded-xl"
                />
              </div>
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full lg:w-48 rounded-xl">
                <SelectValue placeholder="Catégorie" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full lg:w-48 rounded-xl">
                <SelectValue placeholder="Trier par" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Plus récents</SelectItem>
                <SelectItem value="price-low">Prix croissant</SelectItem>
                <SelectItem value="price-high">Prix décroissant</SelectItem>
                <SelectItem value="rating">Mieux notés</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Results count */}
        <div className="mb-6">
          <p className="text-gray-600">
            {sortedServices.length} service{sortedServices.length > 1 ? 's' : ''} trouvé{sortedServices.length > 1 ? 's' : ''}
          </p>
        </div>

        {/* Services Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="p-6 rounded-xl animate-pulse">
                <div className="w-full h-48 bg-gray-200 rounded-lg mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedServices.map((service) => (
              <Card key={service.id} className="rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <ImageWithFallback
                    src={service.photos[0] || defaultServiceImage}
                    alt={service.title}
                    className="w-full h-48 object-cover"
                  />
                  <Badge className="absolute top-3 left-3 bg-white text-gray-700">
                    {service.category}
                  </Badge>
                </div>
                
                <div className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    {service.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {service.description}
                  </p>
                  
                  {/* Seller info */}
                  <div className="flex items-center space-x-2 mb-4">
                    <Avatar className="w-6 h-6">
                      <AvatarImage src={service.seller.avatar} />
                      <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">
                        {service.seller.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-gray-700">{service.seller.name}</span>
                    <div className="flex items-center space-x-1">
                      <Star className="w-3 h-3 text-yellow-400 fill-current" />
                      <span className="text-xs text-gray-600">
                        {service.seller.rating} ({service.seller.reviewCount})
                      </span>
                    </div>
                  </div>
                  
                  {/* Service details */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-1 text-sm text-gray-600">
                      <Clock className="w-3 h-3" />
                      <span>{service.deliveryTime}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Euro className="w-4 h-4 text-green-600" />
                      <span className="text-lg font-bold text-green-600">€{service.price}</span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 rounded-xl"
                      onClick={() => navigate(`/service/${service.id}`)}
                    >
                      Voir détails
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1 rounded-xl bg-blue-600 hover:bg-blue-700"
                      onClick={() => handleBookService(service.id)}
                    >
                      Réserver
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {sortedServices.length === 0 && !isLoading && (
          <Card className="p-12 rounded-xl text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun service trouvé</h3>
            <p className="text-gray-600 mb-6">
              Essayez de modifier vos critères de recherche ou parcourez toutes les catégories.
            </p>
            <Button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("Tous");
              }}
              variant="outline"
              className="rounded-xl"
            >
              Réinitialiser les filtres
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}