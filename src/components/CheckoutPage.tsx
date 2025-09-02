import { Shield, CreditCard, Clock, User, ArrowLeft } from "lucide-react";
import { Button } from "./ui/button.tsx";
import { Card } from "./ui/card.tsx";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar.tsx";
import { Separator } from "./ui/separator.tsx";
import { Input } from "./ui/input.tsx";
import { Label } from "./ui/label.tsx";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group.tsx";
import { Checkbox } from "./ui/checkbox.tsx";
import { useRouter } from "./AppRouter.tsx";

// Mock data pour la commande
const orderData = {
  service: {
    title: "Création de logo professionnel + guide de marque",
    package: "Standard",
    price: 75,
    deliveryTime: "48h",
    image: "https://images.unsplash.com/photo-1740174459699-487aec1f7bc5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmFwaGljJTIwZGVzaWduJTIwY3JlYXRpdmV8ZW58MXx8fHwxNzU2NTkzMzQwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  },
  seller: {
    name: "Marie Laurent",
    username: "mariedesign",
    avatar: "https://images.unsplash.com/photo-1708195886023-3ecb00ac7a49?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHByb2Zlc3Npb25hbCUyMHBvcnRyYWl0fGVufDF8fHx8MTc1NjY1NTk5N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    level: "Expert"
  },
  addons: [
    { name: "Révisions supplémentaires (x3)", price: 15, selected: true },
    { name: "Livraison express (24h)", price: 20, selected: false }
  ],
  fees: {
    service: 75,
    addons: 15,
    platformFee: 5,
    total: 95
  }
};

export function CheckoutPage() {
  const { navigateTo, setUser } = useRouter();

  const handlePayment = () => {
    // Simuler un paiement réussi
    setUser({ name: 'Jean Dupont', email: 'jean.dupont@email.com' });
    navigateTo('dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-gray-600 hover:text-gray-900"
            onClick={() => navigateTo('service')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour au service
          </Button>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <span>Service</span>
            <span>→</span>
            <span className="text-blue-600 font-medium">Commande</span>
            <span>→</span>
            <span>Paiement</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulaire de commande */}
          <div className="lg:col-span-2 space-y-6">
            {/* Informations de contact */}
            <Card className="p-6 rounded-xl">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Informations de contact</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">Prénom</Label>
                  <Input id="firstName" placeholder="Votre prénom" className="rounded-xl" />
                </div>
                <div>
                  <Label htmlFor="lastName">Nom</Label>
                  <Input id="lastName" placeholder="Votre nom" className="rounded-xl" />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="votre@email.com" className="rounded-xl" />
                </div>
              </div>
            </Card>

            {/* Détails du projet */}
            <Card className="p-6 rounded-xl">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Détails de votre projet</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="projectDescription">Description du projet</Label>
                  <textarea
                    id="projectDescription"
                    rows={4}
                    placeholder="Décrivez votre projet, vos attentes, votre style préféré..."
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>
                <div>
                  <Label htmlFor="inspiration">Références ou inspiration (optionnel)</Label>
                  <Input 
                    id="inspiration" 
                    placeholder="Liens vers des exemples qui vous inspirent" 
                    className="rounded-xl" 
                  />
                </div>
              </div>
            </Card>

            {/* Mode de paiement */}
            <Card className="p-6 rounded-xl">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Mode de paiement</h2>
              <RadioGroup defaultValue="card" className="space-y-4">
                <div className="flex items-center space-x-3 p-4 border rounded-xl hover:bg-gray-50">
                  <RadioGroupItem value="card" id="card" />
                  <Label htmlFor="card" className="flex items-center space-x-3 cursor-pointer flex-1">
                    <CreditCard className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="font-medium">Carte bancaire</p>
                      <p className="text-sm text-gray-500">Visa, Mastercard, CB</p>
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-3 p-4 border rounded-xl hover:bg-gray-50">
                  <RadioGroupItem value="paypal" id="paypal" />
                  <Label htmlFor="paypal" className="flex items-center space-x-3 cursor-pointer flex-1">
                    <div className="w-5 h-5 bg-blue-600 rounded flex items-center justify-center">
                      <span className="text-white text-xs font-bold">P</span>
                    </div>
                    <div>
                      <p className="font-medium">PayPal</p>
                      <p className="text-sm text-gray-500">Paiement sécurisé via PayPal</p>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </Card>

            {/* Garanties */}
            <Card className="p-6 rounded-xl bg-green-50 border-green-200">
              <div className="flex items-start space-x-3">
                <Shield className="w-6 h-6 text-green-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-green-800 mb-2">Vos garanties FlashJob</h3>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Paiement sécurisé par Stripe</li>
                    <li>• Argent bloqué jusqu'à livraison</li>
                    <li>• Remboursement si non satisfait</li>
                    <li>• Support client 24/7</li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>

          {/* Récapitulatif de commande */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Card className="p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Récapitulatif</h3>
                
                {/* Service principal */}
                <div className="space-y-4 mb-6">
                  <div className="flex space-x-3">
                    <img 
                      src={orderData.service.image} 
                      alt={orderData.service.title}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 text-sm leading-tight">
                        {orderData.service.title}
                      </p>
                      <p className="text-sm text-gray-500">Package {orderData.service.package}</p>
                    </div>
                  </div>
                  
                  {/* Vendeur */}
                  <div className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={orderData.seller.avatar} />
                      <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">
                        {orderData.seller.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{orderData.seller.name}</p>
                      <p className="text-xs text-gray-500">{orderData.seller.level}</p>
                    </div>
                  </div>
                  
                  {/* Délai */}
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>Livraison en {orderData.service.deliveryTime}</span>
                  </div>
                </div>

                <Separator className="mb-4" />

                {/* Détail des prix */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Service {orderData.service.package}</span>
                    <span className="text-gray-900">€{orderData.fees.service}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Révisions supplémentaires</span>
                    <span className="text-gray-900">€{orderData.fees.addons}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Frais de service</span>
                    <span className="text-gray-900">€{orderData.fees.platformFee}</span>
                  </div>
                </div>

                <Separator className="mb-4" />

                {/* Total */}
                <div className="flex justify-between text-lg font-semibold text-gray-900 mb-6">
                  <span>Total</span>
                  <span>€{orderData.fees.total}</span>
                </div>

                {/* CGV */}
                <div className="flex items-start space-x-2 mb-6">
                  <Checkbox id="terms" className="mt-1" />
                  <Label htmlFor="terms" className="text-xs text-gray-600 leading-relaxed">
                    J'accepte les{' '}
                    <a href="#" className="text-blue-600 hover:underline">conditions générales</a>
                    {' '}et la{' '}
                    <a href="#" className="text-blue-600 hover:underline">politique de confidentialité</a>
                  </Label>
                </div>

                {/* Bouton paiement */}
                <Button 
                  className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium"
                  onClick={handlePayment}
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Payer et commander (€{orderData.fees.total})
                </Button>

                <p className="text-xs text-gray-500 text-center mt-3">
                  Paiement sécurisé par Stripe • Argent bloqué jusqu'à livraison
                </p>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}