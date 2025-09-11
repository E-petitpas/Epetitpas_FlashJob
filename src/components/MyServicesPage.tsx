import { useState, useEffect } from "react";
import { ArrowLeft, Plus, Edit2, Eye, Trash2, Clock, CheckCircle, Star, Briefcase } from "lucide-react";
import { Button } from "./ui/button.tsx";
import { Card } from "./ui/card.tsx";
import { Badge } from "./ui/badge.tsx";
import { ImageWithFallback } from "./figma/ImageWithFallback.tsx";
import { useNavigate } from "react-router-dom";
import { projectId, publicAnonKey } from "../utils/supabase/info";

export function MyServicesPage() {
  const navigate = useNavigate();
  const [services, setServices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Load user's services
  useEffect(() => {
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
          if (data.services) {
            const userServices = data.services.map((service: any) => ({
              ...service,
              viewCount: Math.floor(Math.random() * 300) + 50,
              bookingCount: Math.floor(Math.random() * 20) + 1
            }));
            setServices(userServices);
          }
        } else {
          console.error('Failed to fetch user services');
        }
      } catch (error) {
        console.error('Error loading services:', error);
        setError("Erreur lors du chargement des services");
      } finally {
        setIsLoading(false);
      }
    };

    loadServices();
  }, []);

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
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-gray-600 hover:text-gray-900"
              onClick={() => navigate('/dashboard')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour au dashboard
            </Button>
          </div>
          
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Mes services</h1>
            <div className="text-center py-12">
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-500">Chargement de vos services...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-gray-600 hover:text-gray-900"
            onClick={() => navigate('/dashboard')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour au dashboard
          </Button>
        </div>

        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Mes services</h1>
              <p className="text-gray-600">Gérez vos offres de service sur FlashJob</p>
            </div>
            <Button
              onClick={() => navigate('/create-service')}
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
                    {services.reduce((sum, service) => sum + (service.bookingCount || 0), 0)}
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
                    {services.reduce((sum, service) => sum + (service.viewCount || 0), 0)}
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
                onClick={() => navigate('/create-service')}
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
                      src={service.photos?.[0] || "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZXJ2aWNlJTIwcGxhY2Vob2xkZXJ8ZW58MXx8fHwxNzU2NzU4MzAwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"}
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
                            <span>{service.viewCount || 0} vues</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <CheckCircle className="w-4 h-4" />
                            <span>{service.bookingCount || 0} vendus</span>
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
                            onClick={() => navigate(`/service/${service.id}`)}
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
      </div>
    </div>
  );
}