import { useState } from "react";
import { Package, MessageCircle, Star, User, Settings, LogOut, Clock, CheckCircle, AlertCircle, Plus, Briefcase, Edit2, Camera, Mail, Phone, MapPin, Calendar, FileText, Eye, Trash2 } from "lucide-react";
import { Button } from "./ui/button.tsx";
import { Card } from "./ui/card.tsx";
import { Badge } from "./ui/badge.tsx";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar.tsx";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs.tsx";
import { Progress } from "./ui/progress.tsx";
import { Input } from "./ui/input.tsx";
import { Label } from "./ui/label.tsx";
import { Textarea } from "./ui/textarea.tsx";
import { Alert, AlertDescription } from "./ui/alert.tsx";
import { ImageWithFallback } from "./figma/ImageWithFallback.tsx";
import { useNavigate } from "react-router-dom";
import { MessagingPage } from "./MessagingPage.tsx";
import { projectId, publicAnonKey } from "../utils/supabase/info";

// Mock data pour les commandes
const orders = [
  {
    id: "#FJ-2024-001",
    title: "Création de logo professionnel",
    seller: "Marie Laurent",
    sellerAvatar: "https://images.unsplash.com/photo-1708195886023-3ecb00ac7a49?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHByb2Zlc3Npb25hbCUyMHBvcnRyYWl0fGVufDF8fHx8MTc1NjY1NTk5N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    status: "in_progress",
    price: 75,
    deliveryDate: "2024-09-02",
    progress: 60,
    image: "https://images.unsplash.com/photo-1740174459699-487aec1f7bc5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmFwaGljJTIwZGVzaWduJTIwY3JlYXRpdmV8ZW58MXx8fHwxNzU2NTkzMzQwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    lastMessage: "J'ai préparé 3 propositions pour votre logo"
  },
  {
    id: "#FJ-2024-002",
    title: "Site web vitrine responsive",
    seller: "Thomas Dubois",
    sellerAvatar: "",
    status: "completed",
    price: 120,
    deliveryDate: "2024-08-28",
    progress: 100,
    image: "https://images.unsplash.com/photo-1716703373020-17ff360924ee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwc2VydmljZXMlMjB3b3Jrc3BhY2V8ZW58MXx8fHwxNzU2NjczNDY4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    lastMessage: "Votre site est en ligne ! Voici les accès"
  },
  {
    id: "#FJ-2024-003",
    title: "Cours d'anglais - 5 séances",
    seller: "Sarah Martin",
    sellerAvatar: "",
    status: "pending",
    price: 85,
    deliveryDate: "2024-09-05",
    progress: 0,
    image: "https://images.unsplash.com/photo-1673515335586-f9f662c01482?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvbmxpbmUlMjB0dXRvcmluZyUyMGVkdWNhdGlvbnxlbnwxfHx8fDE3NTY2NzM0Njl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    lastMessage: "En attente de confirmation du créneau"
  }
];

const statusConfig = {
  pending: { label: "En attente", color: "bg-yellow-100 text-yellow-800", icon: Clock },
  in_progress: { label: "En cours", color: "bg-blue-100 text-blue-800", icon: AlertCircle },
  completed: { label: "Terminé", color: "bg-green-100 text-green-800", icon: CheckCircle }
};

// Profile Tab Component
function ProfileTab() {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "Jean Dupont",
    email: "jean.dupont@email.com",
    phone: "+33 6 12 34 56 78",
    location: "Paris, France",
    bio: "Passionné par le digital et toujours à la recherche de nouveaux projets créatifs.",
    joinDate: "Mars 2024"
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [message, setMessage] = useState("");

  // Load profile data on component mount
  useState(() => {
    const loadProfile = async () => {
      try {
        const userId = 'current_user'; // In real app, get from auth
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-6e866e97/profile/${userId}`,
          {
            headers: {
              'Authorization': `Bearer ${publicAnonKey}`
            }
          }
        );

        if (response.ok) {
          const data = await response.json();
          if (data.profile) {
            setProfileData({
              name: data.profile.name || "Jean Dupont",
              email: data.profile.email || "jean.dupont@email.com",
              phone: data.profile.phone || "+33 6 12 34 56 78",
              location: data.profile.location || "Paris, France",
              bio: data.profile.bio || "Passionné par le digital et toujours à la recherche de nouveaux projets créatifs.",
              joinDate: data.profile.joinDate ? new Date(data.profile.joinDate).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' }) : "Mars 2024"
            });
          }
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setIsLoadingProfile(false);
      }
    };

    loadProfile();
  });

  const handleSave = async () => {
    setIsLoading(true);
    setMessage("");
    
    try {
      const userId = 'current_user'; // In real app, get from auth
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-6e866e97/profile/${userId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`
          },
          body: JSON.stringify(profileData)
        }
      );

      const result = await response.json();
      if (result.success) {
        setIsEditing(false);
        setMessage("Profil mis à jour avec succès !");
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage(result.error || "Erreur lors de la mise à jour");
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage("Erreur lors de la mise à jour");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  if (isLoadingProfile) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Mon profil</h1>
        <Card className="p-6 rounded-xl">
          <div className="animate-pulse space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-24 h-24 bg-gray-200 rounded-full"></div>
              <div className="space-y-2">
                <div className="h-6 bg-gray-200 rounded w-48"></div>
                <div className="h-4 bg-gray-200 rounded w-32"></div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Mon profil</h1>
        {!isEditing && (
          <Button
            onClick={() => setIsEditing(true)}
            variant="outline"
            className="rounded-xl"
          >
            <Edit2 className="w-4 h-4 mr-2" />
            Modifier
          </Button>
        )}
      </div>

      {message && (
        <Alert className={`border-${message.includes('succès') ? 'green' : 'red'}-200 bg-${message.includes('succès') ? 'green' : 'red'}-50`}>
          <AlertDescription className={`text-${message.includes('succès') ? 'green' : 'red'}-700`}>
            {message}
          </AlertDescription>
        </Alert>
      )}

      <Card className="p-6 rounded-xl">
        <div className="space-y-6">
          {/* Photo de profil */}
          <div className="flex items-center space-x-6">
            <div className="relative">
              <Avatar className="w-24 h-24">
                <AvatarFallback className="bg-blue-100 text-blue-600 text-2xl">
                  {profileData.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              {isEditing && (
                <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors">
                  <Camera className="w-4 h-4" />
                </button>
              )}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{profileData.name}</h2>
              <p className="text-gray-500">Client depuis {profileData.joinDate}</p>
              {!isEditing && (
                <p className="text-sm text-gray-600 mt-1">{profileData.email}</p>
              )}
            </div>
          </div>

          {/* Informations personnelles */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nom complet</Label>
                {isEditing ? (
                  <Input
                    id="name"
                    value={profileData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="rounded-xl mt-1"
                  />
                ) : (
                  <p className="mt-1 text-gray-900">{profileData.name}</p>
                )}
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                {isEditing ? (
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="rounded-xl mt-1"
                  />
                ) : (
                  <div className="flex items-center space-x-2 mt-1">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <p className="text-gray-900">{profileData.email}</p>
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="phone">Téléphone</Label>
                {isEditing ? (
                  <Input
                    id="phone"
                    value={profileData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="rounded-xl mt-1"
                  />
                ) : (
                  <div className="flex items-center space-x-2 mt-1">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <p className="text-gray-900">{profileData.phone}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="location">Localisation</Label>
                {isEditing ? (
                  <Input
                    id="location"
                    value={profileData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className="rounded-xl mt-1"
                  />
                ) : (
                  <div className="flex items-center space-x-2 mt-1">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <p className="text-gray-900">{profileData.location}</p>
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="bio">Bio</Label>
                {isEditing ? (
                  <Textarea
                    id="bio"
                    rows={3}
                    value={profileData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    className="rounded-xl mt-1 resize-none"
                  />
                ) : (
                  <p className="mt-1 text-gray-900">{profileData.bio}</p>
                )}
              </div>
            </div>
          </div>

          {/* Boutons d'action */}
          {isEditing && (
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <Button
                variant="outline"
                onClick={() => setIsEditing(false)}
                className="rounded-xl"
                disabled={isLoading}
              >
                Annuler
              </Button>
              <Button
                onClick={handleSave}
                className="rounded-xl bg-blue-600 hover:bg-blue-700"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Enregistrement...
                  </>
                ) : (
                  "Enregistrer"
                )}
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

// Services Tab Component
function ServicesTab({ navigate }: { navigate: (route: string, params?: any) => void }) {
  const [services, setServices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Mock services data
  const mockServices = [
    {
      id: "service_1",
      title: "Création de logo professionnel",
      description: "Je crée des logos uniques et professionnels pour votre entreprise...",
      price: 75,
      category: "Design & Créatif",
      photos: ["https://images.unsplash.com/photo-1740174459699-487aec1f7bc5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmFwaGljJTIwZGVzaWduJTIwY3JlYXRpdmV8ZW58MXx8fHwxNzU2NTkzMzQwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"],
      status: "active",
      deliveryTime: "48h",
      createdAt: "2024-08-29T10:00:00.000Z",
      viewCount: 234,
      bookingCount: 12
    },
    {
      id: "service_2", 
      title: "Cours d'anglais personnalisés",
      description: "Améliorer votre anglais avec des cours sur mesure adaptés à vos besoins...",
      price: 25,
      category: "Cours & Formations",
      photos: ["https://images.unsplash.com/photo-1673515335586-f9f662c01482?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvbmxpbmUlMjB0dXRvcmluZyUyMGVkdWNhdGlvbnxlbnwxfHx8fDE3NTY2NzM0Njl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"],
      status: "active",
      deliveryTime: "24h",
      createdAt: "2024-08-27T14:30:00.000Z",
      viewCount: 156,
      bookingCount: 8
    }
  ];

  // Load user's services
  useState(() => {
    const loadServices = async () => {
      try {
        const userId = 'current_user'; // In real app, get from auth
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-6e866e97/services?userId=${userId}`,
          {
            headers: {
              'Authorization': `Bearer ${publicAnonKey}`
            }
          }
        );

        if (response.ok) {
          const data = await response.json();
          if (data.services && data.services.length > 0) {
            const userServices = data.services.map((service: any) => ({
              ...service,
              viewCount: Math.floor(Math.random() * 300) + 50,
              bookingCount: Math.floor(Math.random() * 20) + 1
            }));
            setServices([...mockServices, ...userServices]);
          } else {
            setServices(mockServices);
          }
        } else {
          console.error('Failed to fetch user services');
          setServices(mockServices);
        }
      } catch (error) {
        console.error('Error loading services:', error);
        setServices(mockServices);
      } finally {
        setIsLoading(false);
      }
    };

    loadServices();
  });

  const handleDeleteService = async (serviceId: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce service ?")) {
      try {
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-6e866e97/services/${serviceId}`,
          {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${publicAnonKey}`
            }
          }
        );

        if (response.ok) {
          setServices(prev => prev.filter(service => service.id !== serviceId));
        } else {
          const result = await response.json();
          alert(result.error || "Erreur lors de la suppression");
        }
      } catch (error) {
        console.error('Error deleting service:', error);
        alert("Erreur lors de la suppression");
      }
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Actif</Badge>;
      case 'pending_payment':
        return <Badge className="bg-yellow-100 text-yellow-800">En attente de paiement</Badge>;
      case 'paused':
        return <Badge className="bg-gray-100 text-gray-800">En pause</Badge>;
      default:
        return <Badge variant="outline">Inconnu</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Mes services</h1>
        <div className="text-center py-12">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Chargement de vos services...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Mes services</h1>
        <Button
          onClick={() => navigate('create-service')}
          className="rounded-xl bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Créer un service
        </Button>
      </div>

      {/* Service stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 rounded-xl">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{services.length}</p>
              <p className="text-sm text-gray-500">Services actifs</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 rounded-xl">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {services.reduce((sum, service) => sum + service.bookingCount, 0)}
              </p>
              <p className="text-sm text-gray-500">Vendus ce mois</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 rounded-xl">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Eye className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {services.reduce((sum, service) => sum + service.viewCount, 0)}
              </p>
              <p className="text-sm text-gray-500">Vues totales</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 rounded-xl">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Star className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">4.8</p>
              <p className="text-sm text-gray-500">Note moyenne</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Services list */}
      {services.length === 0 ? (
        <Card className="p-12 rounded-xl text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Briefcase className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="font-medium text-gray-900 mb-2">Aucun service créé</h3>
          <p className="text-gray-600 mb-6">
            Commencez à proposer vos services à la communauté FlashJob.
          </p>
          <Button
            onClick={() => navigate('create-service')}
            className="rounded-xl bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Créer mon premier service
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {services.map((service) => (
            <Card key={service.id} className="p-6 rounded-xl hover:shadow-lg transition-shadow">
              <div className="flex items-start space-x-4">
                <ImageWithFallback
                  src={service.photos[0]}
                  alt={service.title}
                  className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-900">{service.title}</h3>
                      <p className="text-sm text-gray-500">{service.category}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(service.status)}
                      <span className="text-lg font-bold text-blue-600">€{service.price}</span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{service.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Eye className="w-4 h-4" />
                        <span>{service.viewCount} vues</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <CheckCircle className="w-4 h-4" />
                        <span>{service.bookingCount} vendus</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>Livraison: {service.deliveryTime}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="outline" className="rounded-xl">
                        <Edit2 className="w-3 h-3 mr-1" />
                        Modifier
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="rounded-xl"
                        onClick={() => navigate('service', { serviceId: service.id })}
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        Voir
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-xl text-red-600 hover:text-red-700 hover:border-red-300"
                        onClick={() => handleDeleteService(service.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export function ClientDashboard() {
  const [activeTab, setActiveTab] = useState("orders");
  const { navigate, setUser } = useRouter();

  const handleLogout = () => {
    setUser(null);
    navigate('home');
  };

  const sidebarItems = [
    { id: "orders", label: "Mes commandes", icon: Package },
    { id: "services", label: "Mes services", icon: Briefcase },
    { id: "messages", label: "Messages", icon: MessageCircle },
    { id: "reviews", label: "Mes avis", icon: Star },
    { id: "profile", label: "Profil", icon: User },
    { id: "settings", label: "Paramètres", icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-6 rounded-xl">
              {/* Profil utilisateur */}
              <div className="text-center mb-6">
                <Avatar className="w-16 h-16 mx-auto mb-3">
                  <AvatarFallback className="bg-blue-100 text-blue-600 text-lg">
                    JD
                  </AvatarFallback>
                </Avatar>
                <h2 className="font-semibold text-gray-900">Jean Dupont</h2>
                <p className="text-sm text-gray-500">Client depuis Mars 2024</p>
              </div>

              {/* Menu */}
              <nav className="space-y-2">
                {sidebarItems.map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                        activeTab === item.id
                          ? "bg-blue-100 text-blue-600"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      <IconComponent className="w-4 h-4" />
                      <span className="text-sm font-medium">{item.label}</span>
                    </button>
                  );
                })}
              </nav>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-gray-600 hover:text-gray-900"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4 mr-3" />
                  Se déconnecter
                </Button>
              </div>
            </Card>
          </div>

          {/* Contenu principal */}
          <div className="lg:col-span-3">
            {activeTab === "orders" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h1 className="text-2xl font-bold text-gray-900">Mes commandes</h1>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="rounded-xl">
                      Tous
                    </Button>
                    <Button variant="outline" size="sm" className="rounded-xl">
                      En cours
                    </Button>
                    <Button variant="outline" size="sm" className="rounded-xl">
                      Terminées
                    </Button>
                  </div>
                </div>

                {/* Statistiques rapides */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="p-4 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Package className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gray-900">3</p>
                        <p className="text-sm text-gray-500">Commandes totales</p>
                      </div>
                    </div>
                  </Card>
                  <Card className="p-4 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gray-900">1</p>
                        <p className="text-sm text-gray-500">Terminées</p>
                      </div>
                    </div>
                  </Card>
                  <Card className="p-4 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                        <Clock className="w-5 h-5 text-yellow-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gray-900">2</p>
                        <p className="text-sm text-gray-500">En cours</p>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Liste des commandes */}
                <div className="space-y-4">
                  {orders.map((order) => {
                    const statusInfo = statusConfig[order.status];
                    const StatusIcon = statusInfo.icon;
                    
                    return (
                      <Card key={order.id} className="p-6 rounded-xl hover:shadow-lg transition-shadow">
                        <div className="flex items-start space-x-4">
                          <img 
                            src={order.image} 
                            alt={order.title}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="font-semibold text-gray-900">{order.title}</h3>
                                <p className="text-sm text-gray-500">Commande {order.id}</p>
                              </div>
                              <Badge className={statusInfo.color}>
                                <StatusIcon className="w-3 h-3 mr-1" />
                                {statusInfo.label}
                              </Badge>
                            </div>
                            
                            <div className="flex items-center space-x-3 mb-3">
                              <Avatar className="w-6 h-6">
                                <AvatarImage src={order.sellerAvatar} />
                                <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">
                                  {order.seller.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-sm text-gray-600">{order.seller}</span>
                              <span className="text-sm text-gray-400">•</span>
                              <span className="text-sm text-gray-600">€{order.price}</span>
                              <span className="text-sm text-gray-400">•</span>
                              <span className="text-sm text-gray-600">Livraison: {order.deliveryDate}</span>
                            </div>
                            
                            {order.status === "in_progress" && (
                              <div className="mb-3">
                                <div className="flex justify-between items-center mb-1">
                                  <span className="text-sm text-gray-600">Progression</span>
                                  <span className="text-sm font-medium text-gray-900">{order.progress}%</span>
                                </div>
                                <Progress value={order.progress} className="h-2" />
                              </div>
                            )}
                            
                            <p className="text-sm text-gray-600 mb-4">{order.lastMessage}</p>
                            
                            <div className="flex space-x-3">
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="rounded-xl"
                                onClick={() => setActiveTab("messages")}
                              >
                                <MessageCircle className="w-3 h-3 mr-1" />
                                Chat
                              </Button>
                              {order.status === "completed" && (
                                <Button size="sm" variant="outline" className="rounded-xl">
                                  <Star className="w-3 h-3 mr-1" />
                                  Laisser un avis
                                </Button>
                              )}
                              <Button 
                                size="sm" 
                                className="rounded-xl"
                                onClick={() => navigate('service', { serviceId: order.id })}
                              >
                                Voir détails
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === "messages" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">En ligne</span>
                  </div>
                </div>
                <MessagingPage />
              </div>
            )}

            {activeTab === "services" && (
              <ServicesTab navigate={navigate} />
            )}

            {activeTab === "reviews" && (
              <div className="space-y-6">
                <h1 className="text-2xl font-bold text-gray-900">Mes avis</h1>
                <Card className="p-8 rounded-xl text-center">
                  <Star className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="font-medium text-gray-900 mb-2">Aucun avis donné</h3>
                  <p className="text-gray-500">Laissez des avis pour aider la communauté FlashJob.</p>
                </Card>
              </div>
            )}

            {activeTab === "profile" && (
              <ProfileTab />
            )}

            {activeTab === "settings" && (
              <div className="space-y-6">
                <h1 className="text-2xl font-bold text-gray-900">Paramètres</h1>
                <Card className="p-6 rounded-xl">
                  <h3 className="font-semibold text-gray-900 mb-4">Notifications</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">Notifications par email</p>
                        <p className="text-sm text-gray-500">Recevoir les mises à jour de commandes</p>
                      </div>
                      <Button variant="outline" size="sm" className="rounded-xl">
                        Activé
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}