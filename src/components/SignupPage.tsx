import { useState } from "react";
import { Mail, Lock, ArrowLeft, Eye, EyeOff, CheckCircle, AlertCircle, Camera } from "lucide-react";
import { Button } from "./ui/button.tsx";
import { Input } from "./ui/input.tsx";
import { Label } from "./ui/label.tsx";
import { Card } from "./ui/card.tsx";
import { Separator } from "./ui/separator.tsx";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group.tsx";
import { Textarea } from "./ui/textarea.tsx";
import { useNavigate } from "react-router-dom";
import flashJobLogo from "../assets/logo.png"; 
import { sha256 } from 'js-sha256';

const API_URL = import.meta.env.VITE_API_URL;

export function SignupPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [accountType, setAccountType] = useState("CLIENT");
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    avatar: "https://images.unsplash.com/photo-1750816204148-5d02aff367cb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZWZhdWx0JTIwYXZhdGFyJTIwcGxhY2Vob2xkZXJ8ZW58MXx8fHwxNzU3MDU4MjM4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    bio: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [firstnameError, setFirstnameError] = useState("");
  const [lastnameError, setLastnameError] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>("");

  // Fonction de validation de l'email
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Fonction de validation du mot de passe
  const validatePassword = (password: string) => {
    return password.length >= 8;
  };

  // Gestionnaire de changement pour les champs du formulaire
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (field === 'firstname') {
      setFirstnameError(value.trim() === "" ? "Veuillez saisir votre prénom" : "");
    }
    if (field === 'lastname') {
      setLastnameError(value.trim() === "" ? "Veuillez saisir votre nom" : "");
    }
    if (field === 'email') {
      if (value.trim() === "") {
        setEmailError("Veuillez saisir votre email");
      } else if (!validateEmail(value)) {
        setEmailError("Veuillez saisir une adresse email valide");
      } else {
        setEmailError("");
      }
    }
    if (field === 'password') {
      if (value && !validatePassword(value)) {
        setPasswordError("Le mot de passe doit contenir au moins 8 caractères");
      } else {
        setPasswordError("");
      }
    }
    if (field === 'confirmPassword' || field === 'password') {
      const password = field === 'password' ? value : formData.password;
      const confirmPassword = field === 'confirmPassword' ? value : formData.confirmPassword;
      if (confirmPassword && password !== confirmPassword) {
        setPasswordError("Les mots de passe ne correspondent pas");
      } else if (password && validatePassword(password)) {
        setPasswordError("");
      }
    }
  };

  // Gestionnaire pour l'upload de fichier avatar
  const handleAvatarFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Veuillez sélectionner un fichier image valide.');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert('La taille du fichier ne doit pas dépasser 5MB.');
        return;
      }
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setAvatarPreview(result);
        setFormData(prev => ({ ...prev, avatar: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Fonction pour déclencher l'upload de fichier
  const handleAvatarClick = () => {
    document.getElementById('avatar-file-input')?.click();
  };

  // Vérifier si le formulaire est valide
  const isFormValid = () => {
    return (
      formData.firstname.trim() !== "" &&
      formData.lastname.trim() !== "" &&
      formData.email.trim() !== "" &&
      validateEmail(formData.email) &&
      formData.password.trim() !== "" &&
      validatePassword(formData.password) &&
      formData.confirmPassword.trim() !== "" &&
      formData.password === formData.confirmPassword &&
      acceptedTerms &&
      !emailError &&
      !passwordError
    );
  };

  // Fonction utilitaire pour hasher le mot de passe
  function hashPassword(password: string): string {
    return sha256(password);
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid()) {
      return;
    }
    setLoading(true);
    const formDataToSend = new FormData();
    formDataToSend.append('firstname', formData.firstname);
    formDataToSend.append('lastname', formData.lastname);
    formDataToSend.append('email', formData.email);
    formDataToSend.append('password_hash', hashPassword(formData.password));
    formDataToSend.append('bio', formData.bio);
    formDataToSend.append('role', accountType);

    if (avatarFile) {
      formDataToSend.append('avatar', avatarFile);
    } else {
      formDataToSend.append('avatarUrl', formData.avatar);
    }

    try {
      const response = await fetch(`${API_URL}/users/signin`, {
        method: 'POST',
        body: formDataToSend
      });
      if (!response.ok) {
        // Récupère le message d'erreur du backend
        const errorData = await response.json();
        if (
          errorData.message &&
          errorData.message.includes('Cet email existe déjà')
        ) {
          setEmailError("Un compte est déjà enregistré avec cet email");
        } else {
          throw new Error(errorData.message || 'Erreur lors de la création du compte');
        }
        setLoading(false);
        return;
      }
      const data = await response.json();
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('token', data.token);
      navigate("/email-verification");
    } catch (error) {
      alert((error as Error).message || 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8">
      <div className="max-w-md w-full mx-4">
        {/* Bouton retour */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-gray-600 hover:text-gray-900"
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour à l'accueil
          </Button>
        </div>

        <Card className="p-8 rounded-xl">
          {/* Logo */}
          <div className="text-center mb-8">
            <img src={flashJobLogo} alt="FlashJob" className="h-10 w-auto mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Créer un compte</h1>
            <p className="text-gray-600">Rejoignez la communauté FlashJob</p>
          </div>

          {/* Photo de profil */}
          <div className="mb-6">
            <div className="text-center">
              <div className="relative inline-block">
                <div 
                  className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border-4 border-gray-200 bg-gray-100 cursor-pointer hover:border-blue-300 transition-colors"
                  onClick={handleAvatarClick}
                >
                  <img
                    src={avatarPreview || formData.avatar}
                    alt="Aperçu photo de profil"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "https://images.unsplash.com/photo-1750816204148-5d02aff367cb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZWZhdWx0JTIwYXZhdGFyJTIwcGxhY2Vob2xkZXJ8ZW58MXx8fHwxNzU3MDU4MjM4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";
                    }}
                  />
                </div>
                <button
                  type="button"
                  className="absolute bottom-0 -right-1 w-8 h-8 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center transition-colors shadow-md mt-0"
                  onClick={handleAvatarClick}
                >
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              {/* Input file caché */}
              <input
                id="avatar-file-input"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarFileChange}
              />
              <div className="mt-3 space-y-2">
                <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
                  <span>Cliquez sur la photo ou</span>
                </div>
                <Input
                  id="avatar-url-input"
                  type="url"
                  placeholder="Collez l'URL de votre photo ici"
                  className="rounded-xl text-center text-sm"
                  value={!avatarFile ? formData.avatar : ''}
                  onChange={(e) => {
                    if (!avatarFile) {
                      handleInputChange('avatar', e.target.value);
                      setAvatarPreview('');
                    }
                  }}
                  disabled={!!avatarFile}
                />
                {avatarFile && (
                  <div className="flex items-center justify-center">
                    <button
                      type="button"
                      className="text-xs text-blue-600 hover:text-blue-700 underline"
                      onClick={() => {
                        setAvatarFile(null);
                        setAvatarPreview('');
                        const fileInput = document.getElementById('avatar-file-input') as HTMLInputElement;
                        if (fileInput) fileInput.value = '';
                      }}
                    >
                      Utiliser une URL à la place
                    </button>
                  </div>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Optionnel - Formats acceptés: JPG, PNG, GIF (max 5MB)
                </p>
              </div>
            </div>
          </div>

          {/* Type de compte */}
          <div className="mb-6">
            <Label>Type de compte</Label>
            <RadioGroup value={accountType} onValueChange={setAccountType} className="mt-2">
              <div className="flex items-center space-x-2 p-3 border rounded-xl hover:bg-gray-50">
                <RadioGroupItem value="CLIENT" id="client" />
                <Label htmlFor="client" className="flex-1 cursor-pointer">
                  <div>
                    <p className="font-medium">Client</p>
                    <p className="text-sm text-gray-500">Je cherche des services</p>
                  </div>
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-3 border rounded-xl hover:bg-gray-50">
                <RadioGroupItem value="FREELANCER" id="freelancer" />
                <Label htmlFor="freelancer" className="flex-1 cursor-pointer">
                  <div>
                    <p className="font-medium">Prestataire</p>
                    <p className="text-sm text-gray-500">Je propose mes services</p>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Formulaire */}
          <form onSubmit={handleSignup} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstname">Prénom</Label>
                <Input
                  id="firstname"
                  placeholder="Votre prénom"
                  style={firstnameError ? { borderColor: 'red', borderWidth: 1 } : {}}
                  className={`rounded-xl mt-1 ${firstnameError ? "border-red-500 focus:border-red-500" : ""}`}
                  value={formData.firstname}
                  onChange={(e) => handleInputChange('firstname', e.target.value)}
                  required
                />
                {firstnameError && (
                  <div className="flex items-center mt-2 text-sm text-red-600">
                    <AlertCircle className="w-4 h-4 mr-1 flex-shrink-0" />
                    <span>{firstnameError}</span>
                  </div>
                )}
              </div>
              <div>
                <Label htmlFor="lastname">Nom</Label>
                <Input
                  id="lastname"
                  placeholder="Votre nom"
                  style={lastnameError ? { borderColor: 'red', borderWidth: 1 } : {}}
                  className={`rounded-xl mt-1 ${lastnameError ? "border-red-500 focus:border-red-500" : ""}`}
                  value={formData.lastname}
                  onChange={(e) => handleInputChange('lastname', e.target.value)}
                  required
                />
                {lastnameError && (
                  <div className="flex items-center mt-2 text-sm text-red-600">
                    <AlertCircle className="w-4 h-4 mr-1 flex-shrink-0" />
                    <span>{lastnameError}</span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="bio">Biographie</Label>
              <div className="mt-1">
                <Textarea
                  id="bio"
                  placeholder="Parlez-nous de vous... (optionnel)"
                  className="rounded-xl resize-none"
                  rows={3}
                  value={formData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Optionnel - Présentez-vous brièvement
                </p>
              </div>
            </div>

            <div>
              <Label htmlFor="email">Adresse email</Label>
              <div className="mt-1">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 z-10" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="votre@email.com"
                    style={emailError ? { borderColor: 'red', borderWidth: 1 } : {}}
                    className={`pl-10 rounded-xl border ${emailError ? "border-red-500 focus:border-red-500" : ""}`}
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                  />
                </div>
                {emailError && (
                  <div className="flex items-center mt-2 text-sm text-red-600">
                    <AlertCircle className="w-4 h-4 mr-1 flex-shrink-0" />
                    <span>{emailError}</span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="password">Mot de passe</Label>
              <div className="mt-1">
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 z-10" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Au moins 8 caractères"
                    className={`pl-10 pr-10 rounded-xl ${passwordError ? 'border-red-500 focus:border-red-500' : ''}`}
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 z-10"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {passwordError && (
                  <div className="flex items-center mt-2 text-sm text-red-600">
                    <AlertCircle className="w-4 h-4 mr-1 flex-shrink-0" />
                    <span>{passwordError}</span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
              <div className="mt-1">
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 z-10" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirmez votre mot de passe"
                    className={`pl-10 pr-10 rounded-xl ${passwordError && formData.confirmPassword ? 'border-red-500 focus:border-red-500' : ''}`}
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 z-10"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="flex items-start space-x-3">
                <input 
                  type="checkbox" 
                  className="rounded mt-1" 
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  required 
                />
                <span className="text-sm text-gray-600 leading-relaxed">
                  J'accepte les <a href="#" className="text-blue-600 hover:underline">conditions d'utilisation</a> et la <a href="#" className="text-blue-600 hover:underline">politique de confidentialité</a>
                </span>
              </label>
              <label className="flex items-start space-x-3">
                <input type="checkbox" className="rounded mt-1" />
                <span className="text-sm text-gray-600 leading-relaxed">
                  Je souhaite recevoir les actualités et offres spéciales par email
                </span>
              </label>
            </div>

            <Button
              type="submit"
              className={`w-full h-12 rounded-xl text-base font-medium transition-all duration-200
              ${!isFormValid() || loading
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"}
            `}
              disabled={!isFormValid() || loading}
            >
              {loading ? "Création du compte..." : "Créer mon compte"}
            </Button>
            
            {!isFormValid() && (formData.firstname || formData.lastname || formData.email || formData.password || formData.confirmPassword) && (
              <div className="text-sm text-gray-500 text-center mt-2">
                Veuillez remplir tous les champs correctement et accepter les conditions d'utilisation
              </div>
            )}
          </form>

          <div className="mt-6">
            <Separator />
            <div className="text-center mt-6">
              <p className="text-sm text-gray-600">
                Déjà un compte ?{' '}
                <button 
                  type="button"
                  onClick={() => navigate("/login")} 
                  className="text-blue-600 hover:underline font-medium"
                >
                  Se connecter
                </button>
              </p>
            </div>
          </div>
        </Card>

        {/* Avantages */}
        <div className="mt-6 bg-white rounded-xl p-6 border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
            <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
            Pourquoi rejoindre FlashJob ?
          </h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• Accès à des milliers de services de qualité</li>
            <li>• Paiement sécurisé avec garantie satisfaction</li>
            <li>• Support client 24/7</li>
            <li>• Livraison rapide sous 24-48h</li>
          </ul>
        </div>
      </div>
    </div>
  );
}