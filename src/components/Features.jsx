import { Truck, Clock, HeartHandshake, Euro } from "lucide-react"

export default function Features() {
	const features = [
		{
			icon: <Truck className="h-6 w-6 text-teal-600" />,
			title: "Snelle & Anonieme verzending",
			description: "Discrete levering binnen 1-2 werkdagen",
		},
		{
			icon: <Euro className="h-6 w-6 text-teal-600" />,
			title: "Beste prijs/kwaliteit",
			description: "Hoogwaardige producten voor een eerlijke prijs",
		},
		{
			icon: <Clock className="h-6 w-6 text-teal-600" />,
			title: "Op werkdagen voor 16:00 uur besteld, direct verzonden",
			description: "Snelle verwerking van je bestelling",
		},
		{
			icon: <HeartHandshake className="h-6 w-6 text-teal-600" />,
			title: "Uitstekende klantenservice",
			description: "Persoonlijke ondersteuning bij al je vragen",
		},
	]

	return (
		<section className="py-12 bg-white">
			<div className="container mx-auto px-4">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
					{features.map((feature, index) => (
						<div
							key={index}
							className="flex items-start p-6 lg:p-3 xl:p-6 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
						>
							<div className="mr-4 mt-1">{feature.icon}</div>
							<div>
								<h3 className="font-medium text-gray-900">{feature.title}</h3>
								<p className="text-sm text-gray-600 mt-1">{feature.description}</p>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	)
}

