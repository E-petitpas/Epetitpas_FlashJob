import { useState } from "react";
import { Mail, Lock, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { Button } from "./ui/button.tsx";
import { Input } from "./ui/input.tsx";
import { Label } from "./ui/label.tsx";
import { Card } from "./ui/card.tsx";
import { Separator } from "./ui/separator.tsx";
import { useRouter } from "./AppRouter.tsx";
import flashJobLogo from "figma:asset/9bea5e19d46269495bd69a4780fc19a67320cedb.png";

export function LoginPage() {
  const { navigateTo, setUser } = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simuler une connexion
    setTimeout(() => {
      setUser({ 
        name: 'Jean Dupont', 
        email: 'jean.dupont@email.com',
        avatar: ''
      });
      setLoading(false);
      navigateTo('dashboard');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
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
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Connexion</h1>
            <p className="text-gray-600">Accédez à votre compte FlashJob</p>
          </div>

          {/* Formulaire */}
          <form onSubmit={handleLogin} className="space-y-6">
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
                  placeholder="Votre mot de passe"
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

            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="rounded" />
                <span className="text-sm text-gray-600">Se souvenir de moi</span>
              </label>
              <a href="#" className="text-sm text-blue-600 hover:underline">
                Mot de passe oublié ?
              </a>
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? "Connexion..." : "Se connecter"}
            </Button>
          </form>

          <div className="mt-6">
            <Separator />
            <div className="text-center mt-6">
              <p className="text-sm text-gray-600">
                Pas encore de compte ?{' '}
                <button 
                  onClick={() => navigateTo('signup')} 
                  className="text-blue-600 hover:underline font-medium"
                >
                  Créer un compte
                </button>
              </p>
            </div>
          </div>
        </Card>

        {/* Info sécurité */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            En vous connectant, vous acceptez nos conditions d'utilisation et notre politique de confidentialité.
          </p>
        </div>
      </div>
    </div>
  );
}