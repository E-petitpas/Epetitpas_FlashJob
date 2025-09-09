import { useState, useEffect } from "react";
import { Mail, CheckCircle, Clock, RefreshCw } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { useNavigate } from "react-router-dom";
import { Footer } from "./Footer";
import flashJobLogo from "../assets/logo.png"; 

export function EmailVerificationPage() {
  const navigate = useNavigate();
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendCooldown > 0) {
      interval = setInterval(() => {
        setResendCooldown(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendCooldown]);

  const handleResendEmail = async () => {
    setIsResending(true);
    
    // Simuler l'envoi d'email
    setTimeout(() => {
      setIsResending(false);
      setResendCooldown(60); // Cooldown de 60 secondes
    }, 2000);
  };

  // Récupère l'email utilisateur depuis le localStorage ou affiche un email par défaut
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Contenu principal */}
      <div className="flex items-center justify-center py-16 px-4">
        <div className="max-w-md w-full">
          <Card className="p-8 rounded-xl text-center">
            {/* Icône principale */}
            <div className="mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-blue-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Vérifiez votre email
              </h1>
              <p className="text-gray-600">
                Nous avons envoyé un lien de confirmation à
              </p>
              <p className="font-medium text-gray-900 mt-1">
                {user?.email || "votre@email.com"}
              </p>
            </div>

            {/* Messages d'accroche */}
            <div className="mb-8 space-y-4">
              <div className="bg-blue-50 rounded-xl p-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="text-left">
                    <p className="font-medium text-blue-900">Presque terminé !</p>
                    <p className="text-sm text-blue-700 mt-1">
                      Cliquez sur le lien dans votre email pour activer votre compte et commencer à utiliser FlashJob.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 rounded-xl p-4">
                <div className="flex items-start space-x-3">
                  <Clock className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div className="text-left">
                    <p className="font-medium text-yellow-900">Vérifiez vos spams</p>
                    <p className="text-sm text-yellow-700 mt-1">
                      Si vous ne voyez pas l'email, regardez dans votre dossier spam ou courrier indésirable.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bouton renvoyer */}
            <div className="space-y-4">
              <Button
                onClick={handleResendEmail}
                disabled={isResending || resendCooldown > 0}
                variant="outline"
                className="w-full rounded-xl"
              >
                {isResending ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Envoi en cours...
                  </>
                ) : resendCooldown > 0 ? (
                  `Renvoyer dans ${resendCooldown}s`
                ) : (
                  <>
                    <Mail className="w-4 h-4 mr-2" />
                    Renvoyer l'email
                  </>
                )}
              </Button>

              <p className="text-xs text-gray-500">
                Vous pouvez demander un nouvel email toutes les minutes
              </p>
            </div>
          </Card>

          {/* Messages d'encouragement */}
          <div className="mt-8 space-y-4">
            <div className="bg-white rounded-xl p-6 border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-3">
                🚀 Votre aventure FlashJob vous attend
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Accédez à des milliers de services de qualité</li>
                <li>• Connectez-vous avec des professionnels vérifiés</li>
                <li>• Bénéficiez de notre garantie satisfaction</li>
                <li>• Gérez tout depuis votre tableau de bord personnel</li>
              </ul>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-2">
                💡 Le saviez-vous ?
              </h3>
              <p className="text-sm text-gray-600">
                Plus de 95% de nos utilisateurs trouvent le service parfait en moins de 24h. 
                Rejoignez une communauté qui révolutionne les services à la demande !
              </p>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-500">
                Des questions ? Contactez notre{' '}
                <a href="#" className="text-blue-600 hover:underline">support client</a>
                {' '}disponible 24/7
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}