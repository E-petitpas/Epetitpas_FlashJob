import { Star, Quote } from "lucide-react";
import { Card } from "./ui/card.tsx";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar.tsx";

const testimonials = [
  {
    id: 1,
    name: "Julie Mercier",
    role: "Directrice Marketing",
    company: "StartupTech",
    content: "FlashJob m'a permis de trouver un designer graphique en moins d'une heure. Le logo livré en 24h était parfait et respectait exactement mon brief. Service rapide et efficace !",
    rating: 5,
    avatar: ""
  },
  {
    id: 2,
    name: "Pierre Dubois",
    role: "Entrepreneur",
    company: "E-commerce Plus",
    content: "J'ai fait appel à FlashJob pour créer mon site e-commerce. L'expert choisi était très professionnel et le résultat dépasse mes attentes. Je recommande vivement !",
    rating: 5,
    avatar: ""
  },
  {
    id: 3,
    name: "Emma Laurent",
    role: "Étudiante",
    company: "Université Paris",
    content: "Les cours d'anglais sur FlashJob sont top ! Mon professeur s'adapte à mon rythme et mes progrès sont visibles. Plateforme simple et prix abordables.",
    rating: 5,
    avatar: ""
  }
];

export function TestimonialsSection() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ce que disent nos clients
          </h2>
          <p className="text-lg text-gray-600">
            Plus de 10,000 clients satisfaits nous font confiance
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="p-6 rounded-xl border-gray-100 relative">
              <Quote className="absolute top-4 right-4 w-8 h-8 text-blue-100" />
              
              <div className="flex items-center space-x-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
              </div>
              
              <p className="text-gray-700 mb-6 leading-relaxed">
                "{testimonial.content}"
              </p>
              
              <div className="flex items-center space-x-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={testimonial.avatar} />
                  <AvatarFallback className="bg-blue-100 text-blue-600">
                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                  <p className="text-xs text-gray-500">{testimonial.company}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <div className="flex items-center justify-center space-x-8 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>98% de satisfaction client</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span>Délai moyen: 18h</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
              <span>Support 24/7</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}