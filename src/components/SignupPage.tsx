import { useState } from "react";
import { Mail, Lock, User, ArrowLeft, Eye, EyeOff, CheckCircle } from "lucide-react";
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

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simuler une inscription
    setTimeout(() => {
      setUser({ 
        name: 'Jean Dupont', 
        email: 'jean.dupont@email.com',
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
                  required
                />
              </div>
              <div>
                <Label htmlFor="lastName">Nom</Label>
                <Input
                  id="lastName"
                  placeholder="Votre nom"
                  className="rounded-xl mt-1"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email">Adresse email</Label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="email"
                  type="email"
                  placeholder="votre@email.com"
                  className="pl-10 rounded-xl"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password">Mot de passe</Label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Au moins 8 caractères"
                  className="pl-10 pr-10 rounded-xl"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div>
              <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirmez votre mot de passe"
                  className="pl-10 pr-10 rounded-xl"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <label className="flex items-start space-x-3">
                <input type="checkbox" className="rounded mt-1" required />
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
              className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? "Création du compte..." : "Créer mon compte"}
            </Button>
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