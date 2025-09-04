import { useState } from "react";
import { Mail, Lock, User, ArrowLeft, Eye, EyeOff, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "./ui/button.tsx";
import { Input } from "./ui/input.tsx";
import { Label } from "./ui/label.tsx";
import { Card } from "./ui/card.tsx";
import { Separator } from "./ui/separator.tsx";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group.tsx";
import { useRouter } from "./AppRouter.tsx";
import flashJobLogo from "figma:asset/9bea5e19d46269495bd69a4780fc19a67320cedb.png"; 

export function SignupPage() {
  const { navigateTo, setUser } = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [accountType, setAccountType] = useState("client");
  
  // États pour la validation du formulaire
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

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
    
    // Validation en temps réel pour l'email
    if (field === 'email') {
      if (value && !validateEmail(value)) {
        setEmailError("Veuillez saisir une adresse email valide");
      } else {
        setEmailError("");
      }
    }
    
    // Validation en temps réel pour le mot de passe
    if (field === 'password') {
      if (value && !validatePassword(value)) {
        setPasswordError("Le mot de passe doit contenir au moins 8 caractères");
      } else {
        setPasswordError("");
      }
    }
    
    // Vérification de la correspondance des mots de passe
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

  // Vérifier si le formulaire est valide
  const isFormValid = () => {
    return (
      formData.firstName.trim() !== "" &&
      formData.lastName.trim() !== "" &&
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

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid()) {
      return;
    }
    
    setLoading(true);
    
    // Simuler une inscription
    setTimeout(() => {
      setUser({ 
        name: `${formData.firstName} ${formData.lastName}`, 
        email: formData.email,
        avatar: '',
        type: accountType
      });
      setLoading(false);
      navigateTo('dashboard');
    }, 1500);
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
            onClick={() => navigateTo('home')}
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

          {/* Type de compte */}
          <div className="mb-6">
            <Label>Type de compte</Label>
            <RadioGroup value={accountType} onValueChange={setAccountType} className="mt-2">
              <div className="flex items-center space-x-2 p-3 border rounded-xl hover:bg-gray-50">
                <RadioGroupItem value="client" id="client" />
                <Label htmlFor="client" className="flex-1 cursor-pointer">
                  <div>
                    <p className="font-medium">Client</p>
                    <p className="text-sm text-gray-500">Je cherche des services</p>
                  </div>
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-3 border rounded-xl hover:bg-gray-50">
                <RadioGroupItem value="freelancer" id="freelancer" />
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
                <Label htmlFor="firstName">Prénom</Label>
                <Input
                  id="firstName"
                  placeholder="Votre prénom"
                  className="rounded-xl mt-1"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="lastName">Nom</Label>
                <Input
                  id="lastName"
                  placeholder="Votre nom"
                  className="rounded-xl mt-1"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  required
                />
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
                    className={`pl-10 rounded-xl ${emailError ? 'border-red-500 focus:border-red-500' : ''}`}
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
                  J'accepte les{' '}
                  <a href="#" className="text-blue-600 hover:underline">conditions d'utilisation</a>
                  {' '}et la{' '}
                  <a href="#" className="text-blue-600 hover:underline">politique de confidentialité</a>
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
              className={`w-full h-12 rounded-xl transition-all duration-200 ${
                isFormValid() && !loading 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed hover:bg-gray-300'
              }`}
              disabled={loading || !isFormValid()}
            >
              {loading ? "Création du compte..." : "Créer mon compte"}
            </Button>
            
            {!isFormValid() && (formData.firstName || formData.lastName || formData.email || formData.password || formData.confirmPassword) && (
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
                  onClick={() => navigateTo('login')} 
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