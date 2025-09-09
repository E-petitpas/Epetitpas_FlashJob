import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { Button } from "./ui/button.tsx";
import { Separator } from "./ui/separator.tsx";
import { useNavigate } from "react-router-dom";
import flashJobLogo from "../assets/logo.png"; 

export function Footer() {
  const navigate = useNavigate();
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo et description */}
          <div className="space-y-4">
            <img src={flashJobLogo} alt="FlashJob" className="h-8 w-auto brightness-0 invert" />
            <p className="text-gray-400 text-sm leading-relaxed">
              La marketplace française qui connecte vos besoins avec les meilleurs experts. 
              Rapide, simple et sécurisé.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white p-2">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white p-2">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white p-2">
                <Instagram className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white p-2">
                <Linkedin className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><button onClick={() => navigate('/service')} className="hover:text-white transition-colors text-left">Design Graphique</button></li>
              <li><button onClick={() => navigate('/service')} className="hover:text-white transition-colors text-left">Développement Web</button></li>
              <li><button onClick={() => navigate('/service')} className="hover:text-white transition-colors text-left">Marketing Digital</button></li>
              <li><button onClick={() => navigate('/service')} className="hover:text-white transition-colors text-left">Rédaction</button></li>
              <li><button onClick={() => navigate('/service')} className="hover:text-white transition-colors text-left">Formation</button></li>
              <li><button onClick={() => navigate('/service')} className="hover:text-white transition-colors text-left">Services Pratiques</button></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Centre d'aide</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Comment ça marche</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Devenir prestataire</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Garanties</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Signaler un problème</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <div className="space-y-3 text-sm text-gray-400">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>support@flashjob.fr</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>01 23 45 67 89</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>Paris, France</span>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8 bg-gray-800" />

        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex flex-wrap items-center space-x-6 text-sm text-gray-400">
            <a href="#" className="hover:text-white transition-colors">Conditions d'utilisation</a>
            <a href="#" className="hover:text-white transition-colors">Politique de confidentialité</a>
            <a href="#" className="hover:text-white transition-colors">Mentions légales</a>
            <a href="#" className="hover:text-white transition-colors">Cookies</a>
          </div>
          <p className="text-sm text-gray-400">
            © 2024 FlashJob. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}