import { Search, User } from "lucide-react";
import { Button } from "./ui/button.tsx";
import { Input } from "./ui/input.tsx";
import { MessageNotification } from "./MessageNotification.tsx";
import { useNavigate } from "react-router-dom";
import flashJobLogo from "../assets/logo.png"; 
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar.tsx";

export function Header() {
  const navigate = useNavigate();

  // Récupère l'utilisateur et le token depuis le localStorage
  const user = (() => {
    const u = localStorage.getItem("user");
    const t = localStorage.getItem("token");
    if (u && t) {
      try {
        return JSON.parse(u);
      } catch {
        return null;
      }
    }
    return null;
  })();

  console.log("Header user:", user);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <header className="w-full bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center cursor-pointer" onClick={() => navigate("/")}>
            <img src={flashJobLogo} alt="FlashJob" className="h-8 w-auto" />
          </div>

          {/* Barre de recherche centrale */}
          <div className="flex-1 max-w-lg mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Que cherchez-vous aujourd'hui ?"
                className="pl-10 bg-gray-50 border-gray-200 rounded-xl h-12 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Navigation et boutons */}
          <div className="flex items-center space-x-4 flex-nowrap overflow-visible">
            <Button 
              variant="ghost" 
              className="text-gray-600 hover:text-gray-900"
              onClick={() => navigate("/services")}
            >
              Parcourir
            </Button>
            {user ? (
              <>
                <MessageNotification 
                  unreadCount={3} 
                  onViewMessages={() => navigate("/dashboard")} 
                />
                <Button 
                  variant="outline" 
                  className="rounded-xl border-gray-200 hover:bg-gray-50 flex items-center"
                  onClick={() => navigate("/dashboard")}
                >
                  <Avatar className="w-6 h-6 mr-2">
                    {user.avatar ? (
                      <AvatarImage src={`data:image/png;base64,${user.avatar}`} alt="Avatar" />
                    ) : (
                      <AvatarFallback>
                        {`${user.firstname?.[0] || ""}${user.lastname?.[0] || ""}`.toUpperCase()}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  {`${user.firstname || ""} ${user.lastname || ""}`.trim()}
                </Button>
                <Button 
                  className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={handleLogout}
                >
                  Se déconnecter
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="outline" 
                  className="rounded-xl border-gray-200 hover:bg-gray-50"
                  onClick={() => navigate("/login")}
                >
                  <User className="h-4 w-4 mr-2" />
                  Se connecter
                </Button>
                <Button 
                  className="rounded-xl bg-blue-600 hover:bg-blue-700"
                  onClick={() => navigate("/signup")}
                >
                  S'inscrire
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}