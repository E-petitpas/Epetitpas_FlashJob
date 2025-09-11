import { useState } from "react";
import { Camera, Upload, X, ArrowLeft, Euro, Clock, Plus, Trash2, Image as ImageIcon } from "lucide-react";
import { Button } from "./ui/button.tsx";
import { Card } from "./ui/card.tsx";
import { Input } from "./ui/input.tsx";
import { Label } from "./ui/label.tsx";
import { Textarea } from "./ui/textarea.tsx";
import { Alert, AlertDescription } from "./ui/alert.tsx";
import { CategoryCombobox } from "./CategoryCombobox.tsx";
// Ajout de l'import pour navigateTo
import { useNavigate } from "react-router-dom";

const initialCategories = [
  "Design & Créatif",
  "Développement Web",
  "Marketing Digital",
  "Rédaction & Traduction",
  "Cours & Formations",
  "Services Administratifs",
  "Photographie",
  "Autres"
];

interface ServiceOffer {
  id: string;
  nom_offre: string;
  prix: string;
  delai_livraison_offre: string;
  caracteristiques: string[];
}

export function ServiceCreationPage() {
  // Ajout du hook useNavigate
  const navigate = useNavigate();

  // États pour les informations du service
  const [serviceData, setServiceData] = useState({
    nom_presentation: "",
    description: "",
    categoryId: "",
    presentation_image: null as File | string | null
  });
  
  const [categories, setCategories] = useState(initialCategories);
  
  // États pour les offres
  const [offers, setOffers] = useState<ServiceOffer[]>([
    {
      id: "1",
      nom_offre: "",
      prix: "",
      delai_livraison_offre: "",
      caracteristiques: [""]
    }
  ]);
  
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Ajoutez cet état pour les erreurs de champs du service
  const [fieldErrors, setFieldErrors] = useState({
    nom_presentation: "",
    description: "",
    categoryId: ""
  });

  // Ajoutez cet état pour suivre l'offre incomplète
  const [offerErrorIndex, setOfferErrorIndex] = useState<number | null>(null);

  // Ajoutez un état pour savoir si l'utilisateur a touché chaque champ
  const [touchedFields, setTouchedFields] = useState({
    nom_presentation: false,
    description: false,
    categoryId: false
  });

  // Gestion des données du service
  const handleServiceDataChange = (field: string, value: string) => {
    setServiceData(prev => ({ ...prev, [field]: value }));
    // Met à jour l'erreur en temps réel
    setFieldErrors(prev => ({
      ...prev,
      [field]: !value.trim() ? "Ce champ est requis." : ""
    }));
  };

  const handleBlur = (field: string, value: string) => {
    setTouchedFields(prev => ({ ...prev, [field]: true }));
    setFieldErrors(prev => ({
      ...prev,
      [field]: !value.trim() ? "Ce champ est requis." : ""
    }));
  };

  // Gestion de l'ajout de nouvelles catégories
  const handleAddCategory = (newCategory: string) => {
    if (newCategory && !categories.includes(newCategory)) {
      setCategories(prev => [...prev.slice(0, -1), newCategory, "Autres"]);
      setServiceData(prev => ({ ...prev, categoryId: newCategory }));
    }
  };

  // Gestion de l'upload d'image (fichier)
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Vérification du type de fichier
      if (!file.type.startsWith('image/')) {
        setError('Veuillez sélectionner un fichier image valide.');
        return;
      }
      
      // Vérification de la taille (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('La taille du fichier ne doit pas dépasser 5MB.');
        return;
      }
      
      setImageFile(file);
      setServiceData(prev => ({ ...prev, presentation_image: file }));
      
      // Créer un aperçu
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImagePreview(result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Fonction pour déclencher l'upload de fichier
  const handleImageClick = () => {
    document.getElementById('service-image')?.click();
  };

  // Gestion des offres
  const addNewOffer = () => {
    const newOffer: ServiceOffer = {
      id: Date.now().toString(),
      nom_offre: "",
      prix: "",
      delai_livraison_offre: "",
      caracteristiques: [""]
    };
    setOffers(prev => [...prev, newOffer]);
  };

  const removeOffer = (offerId: string) => {
    if (offers.length > 1) {
      setOffers(prev => prev.filter(offer => offer.id !== offerId));
    }
  };

  // Fonction pour formater le prix avec séparateur de milliers
  const formatPrice = (value: string): string => {
    // Supprimer tous les caractères non numériques
    const numericValue = value.replace(/[^\d]/g, '');
    if (!numericValue) return '';
    
    // Ajouter des espaces comme séparateurs de milliers
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  };

  // Fonction pour récupérer la valeur numérique pure
  const parsePrice = (formattedValue: string): string => {
    return formattedValue.replace(/\s/g, '');
  };

  const updateOffer = (offerId: string, field: string, value: string) => {
    setOffers(prev => prev.map(offer => 
      offer.id === offerId ? { ...offer, [field]: value } : offer
    ));
  };

  const addCaracteristique = (offerId: string) => {
    setOffers(prev => prev.map(offer => 
      offer.id === offerId 
        ? { ...offer, caracteristiques: [...offer.caracteristiques, ""] }
        : offer
    ));
  };

  const updateCaracteristique = (offerId: string, index: number, value: string) => {
    setOffers(prev => prev.map(offer => 
      offer.id === offerId 
        ? { 
            ...offer, 
            caracteristiques: offer.caracteristiques.map((car, i) => 
              i === index ? value : car
            ) 
          }
        : offer
    ));
  };

  const removeCaracteristique = (offerId: string, index: number) => {
    setOffers(prev => prev.map(offer => 
      offer.id === offerId 
        ? { 
            ...offer, 
            caracteristiques: offer.caracteristiques.filter((_, i) => i !== index)
          }
        : offer
    ));
  };

  // Soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setOfferErrorIndex(null);

    // Validation des champs du service
    const newFieldErrors = {
      nom_presentation: !serviceData.nom_presentation.trim() ? "Ce champ est requis." : "",
      description: !serviceData.description.trim() ? "Ce champ est requis." : "",
      categoryId: !serviceData.categoryId.trim() ? "Ce champ est requis." : ""
    };
    setFieldErrors(newFieldErrors);

    if (
      newFieldErrors.nom_presentation ||
      newFieldErrors.description ||
      newFieldErrors.categoryId
    ) {
      setError("Veuillez remplir tous les champs obligatoires du service");
      // Focus sur le premier champ vide
      if (newFieldErrors.nom_presentation) {
        document.getElementById("title")?.focus();
      } else if (newFieldErrors.description) {
        document.getElementById("description")?.focus();
      } else if (newFieldErrors.categoryId) {
        document.getElementById("category-combobox")?.focus();
      }
      return;
    }

    // Validation des offres
    for (const [i, offer] of offers.entries()) {
      if (!offer.nom_offre.trim()) {
        setError(`Veuillez remplir votre offre ${i + 1} : Titre de l'offre, prix et délai de livraison sont requis`);
        setOfferErrorIndex(i);
        document.getElementById(`offer-title-${offer.id}`)?.focus();
        return;
      }
      if (!offer.prix.trim()) {
        setError(`Veuillez remplir votre offre ${i + 1} : Titre de l'offre, prix et délai de livraison sont requis`);
        setOfferErrorIndex(i);
        document.getElementById(`offer-price-${offer.id}`)?.focus();
        return;
      }
      if (!offer.delai_livraison_offre.trim()) {
        setError(`Veuillez remplir votre offre ${i + 1} : Titre de l'offre, prix et délai de livraison sont requis`);
        setOfferErrorIndex(i);
        document.getElementById(`offer-delai-${offer.id}`)?.focus();
        return;
      }
    }

    setIsLoading(true);
    setError("");
    setOfferErrorIndex(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log("Service créé:", { service: serviceData, offers });
      navigate('/dashboard');
    } catch (error) {
      setError("Erreur lors de la création du service");
    } finally {
      setIsLoading(false);
    }
  };

  // Ajoutez cette fonction utilitaire pour vérifier la validité du formulaire
  const isFormValid = () => {
    if (
      !serviceData.nom_presentation.trim() ||
      !serviceData.description.trim() ||
      !serviceData.categoryId.trim()
    ) {
      return false;
    }
    for (const offer of offers) {
      if (
        !offer.nom_offre.trim() ||
        !offer.prix.trim() ||
        !offer.delai_livraison_offre.trim()
      ) {
        return false;
      }
    }
    return true;
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
            onClick={() => navigate('/dashboard')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour au dashboard
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Créer un nouveau service</h1>
            <p className="text-gray-600">Remplissez les informations de votre service pour commencer à vendre</p>
          </div>
        </div>

        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertDescription className="text-red-700">{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section 1: Détails du service */}
          <Card className="p-8 rounded-xl">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Détails du service</h2>
              <p className="text-gray-600">Informations principales de votre service</p>
            </div>

            <div className="space-y-6">
              {/* Photo du service */}
              <div className="space-y-3">
                <Label htmlFor="service-image" className="text-gray-900">
                  Photo du service *
                </Label>
                <div className="relative">
                  {!imagePreview && (typeof serviceData.presentation_image !== 'string' || !serviceData.presentation_image) ? (
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-gray-400 transition-colors">
                      <input
                        id="service-image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <label htmlFor="service-image" className="cursor-pointer">
                        <div className="flex flex-col items-center space-y-2">
                          {/* L'icône photo déclenche l'input file */}
                          <button
                            type="button"
                            onClick={() => document.getElementById('service-image')?.click()}
                            className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors"
                            title="Parcourir et choisir une photo"
                          >
                            <ImageIcon className="w-6 h-6 text-gray-400" />
                          </button>
                          <div>
                            <p className="text-gray-900 font-medium">Télécharger une photo</p>
                            <p className="text-sm text-gray-500">PNG, JPG jusqu'à 5MB</p>
                          </div>
                        </div>
                      </label>
                    </div>
                  ) : (
                    <div className="relative rounded-xl overflow-hidden group">
                      <img
                        src={imagePreview || (typeof serviceData.presentation_image === 'string' ? serviceData.presentation_image : '')}
                        alt="Aperçu du service"
                        className="w-full h-48 object-cover block"
                        onError={(e) => {
                          e.currentTarget.src = "https://images.unsplash.com/photo-1556745753-b2904692b3cd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBzZXJ2aWNlJTIwYnVzaW5lc3N8ZW58MXx8fHwxNzU3NTg3MTAyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";
                        }}
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 pointer-events-none group-hover:pointer-events-auto">
                        <div className="absolute top-3 right-3 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          {/* Bouton remplacer (icône photo) */}
                          <button
                            type="button"
                            onClick={() => document.getElementById('service-image-replace')?.click()}
                            className="w-8 h-8 bg-white text-gray-700 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors shadow-md pointer-events-auto"
                            title="Changer la photo"
                          >
                            <ImageIcon className="w-4 h-4" />
                          </button>
                          {/* Bouton supprimer */}
                          <button
                            type="button"
                            onClick={() => {
                              setImagePreview(null);
                              setImageFile(null);
                              setServiceData(prev => ({ ...prev, presentation_image: null }));
                              // Réinitialiser les inputs file
                              const fileInput = document.getElementById('service-image') as HTMLInputElement;
                              if (fileInput) fileInput.value = '';
                              const replaceInput = document.getElementById('service-image-replace') as HTMLInputElement;
                              if (replaceInput) replaceInput.value = '';
                            }}
                            className="w-8 h-8 bg-white text-red-600 rounded-full flex items-center justify-center hover:bg-red-50 transition-colors shadow-md pointer-events-auto"
                            title="Supprimer l'image"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      {/* Input caché pour remplacer */}
                      <input
                        id="service-image-replace"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </div>
                  )}
                </div>
                
                {/* Section URL alternative - identique au SignupPage */}
                <div className="space-y-2">
                  <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
                    <span>Ou collez une URL d'image</span>
                  </div>
                  <Input
                    type="url"
                    placeholder="Collez l'URL de votre image ici"
                    className="rounded-xl text-sm"
                    value={!imageFile ? (typeof serviceData.presentation_image === 'string' ? serviceData.presentation_image : '') : ''}
                    onChange={(e) => {
                      if (!imageFile) {
                        const url = e.target.value;
                        setServiceData(prev => ({ ...prev, presentation_image: url }));
                        setImagePreview('');
                      }
                    }}
                    disabled={!!imageFile}
                  />
                  {imageFile && (
                    <div className="flex items-center justify-center">
                      <button
                        type="button"
                        className="text-xs text-blue-600 hover:text-blue-700 underline"
                        onClick={() => {
                          setImageFile(null);
                          setImagePreview('');
                          const fileInput = document.getElementById('service-image') as HTMLInputElement;
                          if (fileInput) fileInput.value = '';
                          const replaceInput = document.getElementById('service-image-replace') as HTMLInputElement;
                          if (replaceInput) replaceInput.value = '';
                        }}
                      >
                        Utiliser une URL à la place
                      </button>
                    </div>
                  )}
                  <p className="text-xs text-gray-500">
                    {imageFile 
                      ? 'Fichier sélectionné - cliquez sur "Utiliser une URL à la place" pour saisir une URL' 
                      : 'Formats acceptés: JPG, PNG, GIF (max 5MB)'
                    }
                  </p>
                </div>
              </div>

              {/* Titre du service */}
              <div className="space-y-3">
                <Label htmlFor="title" className="text-gray-900">
                  Titre du service <span className="text-red-600">*</span>
                </Label>
                <Input
                  id="title"
                  placeholder="Ex: Création de logo professionnel"
                  value={serviceData.nom_presentation}
                  onChange={(e) => handleServiceDataChange('nom_presentation', e.target.value)}
                  onBlur={(e) => handleBlur('nom_presentation', e.target.value)}
                  className="rounded-xl"
                />
                {(fieldErrors.nom_presentation && touchedFields.nom_presentation) && (
                  <p className="text-xs text-red-600 mt-1">{fieldErrors.nom_presentation}</p>
                )}
              </div>

              {/* Description du service */}
              <div className="space-y-3">
                <Label htmlFor="description" className="text-gray-900">
                  Description du service <span className="text-red-600">*</span>
                </Label>
                <Textarea
                  id="description"
                  placeholder="Décrivez en détail ce que vous proposez..."
                  rows={4}
                  value={serviceData.description}
                  onChange={(e) => handleServiceDataChange('description', e.target.value)}
                  onBlur={(e) => handleBlur('description', e.target.value)}
                  className="rounded-xl resize-none"
                />
                {(fieldErrors.description && touchedFields.description) && (
                  <p className="text-xs text-red-600 mt-1">{fieldErrors.description}</p>
                )}
              </div>

              {/* Catégorie */}
              <div className="space-y-3">
                <Label htmlFor="category-combobox" className="text-gray-900">
                  Catégorie <span className="text-red-600">*</span>
                </Label>
                <CategoryCombobox
                  value={serviceData.categoryId}
                  onChange={(value) => {
                    handleServiceDataChange('categoryId', value);
                    setTouchedFields(prev => ({ ...prev, categoryId: true }));
                  }}
                  categories={categories}
                  onAddCategory={handleAddCategory}
                  placeholder="Sélectionner ou ajouter une catégorie"
                  label=""
                  required={true}
                  id="category-combobox"
                  onBlur={() => handleBlur('categoryId', serviceData.categoryId)}
                />
                {(fieldErrors.categoryId && touchedFields.categoryId) && (
                  <p className="text-xs text-red-600 mt-1">{fieldErrors.categoryId}</p>
                )}
              </div>
            </div>
          </Card>

          {/* Section 2: Tarification et offres */}
          <Card className="p-8 rounded-xl">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Tarification et offres</h2>
              <p className="text-gray-600">Créez différentes offres pour votre service</p>
            </div>

            <div className="space-y-6">
              {offers.map((offer, index) => (
                <div key={offer.id}>
                  {/* Affiche l'erreur au-dessus de l'offre concernée */}
                  {offerErrorIndex === index && error && (
                    <Alert className="mb-4 border-red-200 bg-red-50">
                      <AlertDescription className="text-red-700">{error}</AlertDescription>
                    </Alert>
                  )}
                  <Card className="p-6 rounded-xl border-2 border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-gray-900">
                        Offre {index + 1}
                      </h3>
                      {offers.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeOffer(offer.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                      {/* Titre de l'offre */}
                      <div className="space-y-2">
                        <Label className="text-gray-900">
                          Titre de l'offre <span className="text-red-600">*</span>
                        </Label>
                        <Input
                          id={`offer-title-${offer.id}`}
                          placeholder="Ex: Basique, Standard, Premium"
                          value={offer.nom_offre}
                          onChange={(e) => updateOffer(offer.id, 'nom_offre', e.target.value)}
                          className="rounded-xl"
                        />
                        {offerErrorIndex === index && !offer.nom_offre.trim() && (
                          <p className="text-xs text-red-600 mt-1">Ce champ est requis.</p>
                        )}
                      </div>

                      {/* Prix */}
                      <div className="space-y-2">
                        <Label className="text-gray-900">
                          Prix <span className="text-red-600">*</span>
                        </Label>
                        <div className="relative">
                          <Input
                            id={`offer-price-${offer.id}`}
                            type="text"
                            placeholder="0"
                            value={formatPrice(offer.prix)}
                            onChange={(e) => {
                              const formattedValue = formatPrice(e.target.value);
                              const numericValue = parsePrice(formattedValue);
                              updateOffer(offer.id, 'prix', numericValue);
                            }}
                            className="rounded-xl pr-8"
                          />
                          <Euro className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2" />
                        </div>
                        {offerErrorIndex === index && !offer.prix.trim() && (
                          <p className="text-xs text-red-600 mt-1">Ce champ est requis.</p>
                        )}
                      </div>

                      {/* Délai de livraison */}
                      <div className="space-y-2">
                        <Label className="text-gray-900">
                          Délai de livraison <span className="text-red-600">*</span>
                        </Label>
                        <Input
                          id={`offer-delai-${offer.id}`}
                          placeholder="Ex: 24h, 48h"
                          value={offer.delai_livraison_offre}
                          onChange={(e) => updateOffer(offer.id, 'delai_livraison_offre', e.target.value)}
                          className="rounded-xl"
                        />
                        {offerErrorIndex === index && !offer.delai_livraison_offre.trim() && (
                          <p className="text-xs text-red-600 mt-1">Ce champ est requis.</p>
                        )}
                      </div>
                    </div>

                    {/* Caractéristiques de l'offre */}
                    <div className="space-y-3">
                      <Label className="text-gray-900">Ce que vous offrez</Label>
                      <div className="space-y-2">
                        {offer.caracteristiques.map((caracteristique, carIndex) => (
                          <div key={carIndex} className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></div>
                            <Input
                              placeholder="Décrivez une caractéristique de cette offre"
                              value={caracteristique}
                              onChange={(e) => updateCaracteristique(offer.id, carIndex, e.target.value)}
                              className="flex-1 rounded-xl"
                            />
                            {offer.caracteristiques.length > 1 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeCaracteristique(offer.id, carIndex)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50 px-2"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => addCaracteristique(offer.id)}
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Ajouter une autre caractéristique
                        </Button>
                      </div>
                    </div>
                  </Card>
                </div>
              ))}

              {/* Bouton Ajouter une nouvelle offre */}
              <Button
                type="button"
                variant="outline"
                onClick={addNewOffer}
                className="w-full rounded-xl border-dashed border-2 border-gray-300 py-8 text-gray-600 hover:border-gray-400 hover:text-gray-700"
              >
                <Plus className="w-5 h-5 mr-2" />
                Ajouter une nouvelle offre
              </Button>
            </div>
          </Card>

          {/* Boutons d'action */}
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/dashboard')}
              disabled={isLoading}
              className="rounded-xl px-8"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !isFormValid()}
              className="rounded-xl bg-blue-600 hover:bg-blue-700 px-8"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Création en cours...
                </>
              ) : (
                "Créer le service"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}