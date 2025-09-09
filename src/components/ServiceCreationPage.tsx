import { useState } from "react";
import { Camera, Upload, X, ArrowLeft, Euro, Clock, Tag } from "lucide-react";
import { Button } from "./ui/button.tsx";
import { Card } from "./ui/card.tsx";
import { Input } from "./ui/input.tsx";
import { Label } from "./ui/label.tsx";
import { Textarea } from "./ui/textarea.tsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select.tsx";
import { Badge } from "./ui/badge.tsx";
import { Alert, AlertDescription } from "./ui/alert.tsx";
import { ImageWithFallback } from "./figma/ImageWithFallback.tsx";
import { useNavigate } from "react-router-dom";
import { projectId, publicAnonKey } from "../utils/supabase/info";

const categories = [
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

export function ServiceCreationPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    deliveryTime: "24h"
  });
  const [photos, setPhotos] = useState<string[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    setIsUploading(true);
    setError("");

    try {
      for (const file of files) {
        if (file.size > 5 * 1024 * 1024) {
          setError("Les fichiers doivent faire moins de 5MB");
          continue;
        }

        const formData = new FormData();
        formData.append('photo', file);
        formData.append('serviceId', `temp_${Date.now()}`);

        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-6e866e97/upload-service-photo`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${publicAnonKey}`
            },
            body: formData
          }
        );

        const result = await response.json();
        if (result.success && result.url) {
          setPhotos(prev => [...prev, result.url]);
          setUploadedFiles(prev => [...prev, result.fileName]);
        } else {
          setError(result.error || "Erreur lors de l'upload");
        }
      }
    } catch (error) {
      setError("Erreur lors de l'upload des photos");
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    setError("");

    try {
      // First create the service
      const serviceResponse = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-6e866e97/services`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`
          },
          body: JSON.stringify({
            ...formData,
            photos: photos.length > 0 ? photos : [defaultServiceImage],
            userId: 'current_user', // In real app, get from auth
          })
        }
      );

      const serviceResult = await serviceResponse.json();
      if (!serviceResult.success) {
        setError(serviceResult.error || "Erreur lors de la création du service");
        return;
      }

      // Process payment for service listing
      const paymentResponse = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-6e866e97/process-service-payment`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`
          },
          body: JSON.stringify({
            serviceId: serviceResult.service.id,
            paymentMethod: 'card',
            amount: parseFloat(formData.price) * 0.05 // 5% platform fee
          })
        }
      );

      const paymentResult = await paymentResponse.json();
      if (paymentResult.success) {
        navigate('dashboard');
      } else {
        setError(paymentResult.error || "Erreur lors du paiement");
      }
    } catch (error) {
      setError("Erreur lors de la création du service");
      console.error('Service creation error:', error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-gray-600 hover:text-gray-900"
            onClick={() => navigate('dashboard')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour au dashboard
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Proposer un service</h1>
            <p className="text-gray-600">Créez votre offre de service sur FlashJob</p>
          </div>
        </div>

        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertDescription className="text-red-700">{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Service Photos */}
          <Card className="p-6 rounded-xl">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Photos du service</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {photos.map((photo, index) => (
                  <div key={index} className="relative group">
                    <ImageWithFallback
                      src={photo}
                      alt={`Service photo ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removePhoto(index)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                
                {/* Upload button */}
                <label className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors">
                  <div className="text-center">
                    {isUploading ? (
                      <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                    ) : (
                      <Camera className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                    )}
                    <p className="text-sm text-gray-500">
                      {isUploading ? 'Upload...' : 'Ajouter photo'}
                    </p>
                  </div>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                    disabled={isUploading}
                  />
                </label>
              </div>
              
              <p className="text-sm text-gray-500">
                {photos.length === 0 ? 
                  "Aucune photo ajoutée. Une photo par défaut sera utilisée." :
                  `${photos.length} photo(s) ajoutée(s)`
                }
              </p>
            </div>
          </Card>

          {/* Service Details */}
          <Card className="p-6 rounded-xl">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Détails du service</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Titre du service *</Label>
                <Input
                  id="title"
                  placeholder="Ex: Création de logo professionnel"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="rounded-xl"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  rows={4}
                  placeholder="Décrivez votre service, ce que vous proposez, votre expertise..."
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="rounded-xl resize-none"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="price">Prix (€) *</Label>
                  <div className="relative">
                    <Euro className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                    <Input
                      id="price"
                      type="number"
                      min="1"
                      step="0.01"
                      placeholder="45"
                      value={formData.price}
                      onChange={(e) => handleInputChange('price', e.target.value)}
                      className="pl-10 rounded-xl"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="category">Catégorie *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => handleInputChange('category', value)}
                    required
                  >
                    <SelectTrigger className="rounded-xl">
                      <SelectValue placeholder="Choisir une catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="deliveryTime">Délai de livraison</Label>
                  <Select
                    value={formData.deliveryTime}
                    onValueChange={(value) => handleInputChange('deliveryTime', value)}
                  >
                    <SelectTrigger className="rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="24h">24 heures</SelectItem>
                      <SelectItem value="48h">2 jours</SelectItem>
                      <SelectItem value="3j">3 jours</SelectItem>
                      <SelectItem value="1s">1 semaine</SelectItem>
                      <SelectItem value="2s">2 semaines</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </Card>

          {/* Payment Information */}
          <Card className="p-6 rounded-xl bg-blue-50 border-blue-200">
            <h2 className="text-xl font-semibold text-blue-900 mb-4">Information sur les frais</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-blue-800">Prix de votre service:</span>
                <span className="font-semibold text-blue-900">
                  €{formData.price || '0'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-blue-800">Frais de plateforme (5%):</span>
                <span className="font-semibold text-blue-900">
                  €{formData.price ? (parseFloat(formData.price) * 0.05).toFixed(2) : '0.00'}
                </span>
              </div>
              <div className="border-t border-blue-300 pt-2">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-blue-900">À payer maintenant:</span>
                  <span className="font-bold text-lg text-blue-900">
                    €{formData.price ? (parseFloat(formData.price) * 0.05).toFixed(2) : '0.00'}
                  </span>
                </div>
              </div>
              <div className="text-sm text-blue-700 bg-blue-100 p-3 rounded-lg">
                <p>• Vous payez uniquement les frais de service maintenant</p>
                <p>• Si personne ne prend votre service sous 7 jours, vous êtes remboursé à 100%</p>
                <p>• Une fois votre service réservé, vous recevez le paiement complet</p>
              </div>
            </div>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('dashboard')}
              className="rounded-xl"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={isCreating || !formData.title || !formData.description || !formData.price || !formData.category}
              className="rounded-xl bg-blue-600 hover:bg-blue-700"
            >
              {isCreating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Création en cours...
                </>
              ) : (
                `Payer et publier (€${formData.price ? (parseFloat(formData.price) * 0.05).toFixed(2) : '0.00'})`
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}