import { Monitor, Wrench, GraduationCap, Palette, MessageSquare, Camera, Code, BookOpen, Headphones } from "lucide-react";
import { Card } from "./ui/card.tsx";
import { useNavigate } from "react-router-dom";

const categories = [
	{
		id: 1,
		title: "Design Graphique",
		icon: Palette,
		description: "Logos, flyers, identité visuelle",
		count: "450+ services",
		color: "bg-purple-100 text-purple-600",
	},
	{
		id: 2,
		title: "Développement Web",
		icon: Code,
		description: "Sites web, applications, e-commerce",
		count: "380+ services",
		color: "bg-blue-100 text-blue-600",
	},
	{
		id: 3,
		title: "Rédaction & Traduction",
		icon: MessageSquare,
		description: "Articles, contenu, traductions",
		count: "320+ services",
		color: "bg-green-100 text-green-600",
	},
	{
		id: 4,
		title: "Marketing Digital",
		icon: Monitor,
		description: "SEO, réseaux sociaux, publicité",
		count: "280+ services",
		color: "bg-orange-100 text-orange-600",
	},
	{
		id: 5,
		title: "Cours & Formation",
		icon: GraduationCap,
		description: "Langues, informatique, musique",
		count: "210+ services",
		color: "bg-indigo-100 text-indigo-600",
	},
	{
		id: 6,
		title: "Photo & Vidéo",
		icon: Camera,
		description: "Montage, retouche, animation",
		count: "190+ services",
		color: "bg-pink-100 text-pink-600",
	},
	{
		id: 7,
		title: "Services Pratiques",
		icon: Wrench,
		description: "Assistance admin, démarches",
		count: "150+ services",
		color: "bg-gray-100 text-gray-600",
	},
	{
		id: 8,
		title: "Audio & Musique",
		icon: Headphones,
		description: "Composition, mixage, podcast",
		count: "120+ services",
		color: "bg-yellow-100 text-yellow-600",
	},
];

export function CategoriesSection() {
	const navigate = useNavigate();

	return (
		<section className="py-16 bg-white">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="text-center mb-12">
					<h2 className="text-3xl font-bold text-gray-900 mb-4">
						Explorez nos catégories
					</h2>
					<p className="text-lg text-gray-600">
						Des experts dans tous les domaines, prêts à vous accompagner
					</p>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
					{categories.map((category) => {
						const IconComponent = category.icon;
						return (
							<Card
								key={category.id}
								className="p-6 hover:shadow-lg transition-shadow cursor-pointer rounded-xl border-gray-100"
								onClick={() =>
									navigate("/service", {
										state: { category: category.title },
									})
								}
							>
								<div
									className={`w-12 h-12 rounded-xl ${category.color} flex items-center justify-center mb-4`}
								>
									<IconComponent className="h-6 w-6" />
								</div>
								<h3 className="font-semibold text-gray-900 mb-2">
									{category.title}
								</h3>
								<p className="text-sm text-gray-600 mb-3">
									{category.description}
								</p>
								<p className="text-xs text-gray-500 font-medium">
									{category.count}
								</p>
							</Card>
						);
					})}
				</div>
			</div>
		</section>
	);
}