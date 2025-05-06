import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"

export default function Breadcrumb({ items }) {
	return (
		<nav className="flex" aria-label="Breadcrumb">
			<ol className="inline-flex items-center space-x-1 md:space-x-3">
				<li className="inline-flex items-center">
					<Link href="/" className="inline-flex items-center text-sm text-gray-600 hover:text-teal-600">
						<Home size={16} className="mr-2" />
						Home
					</Link>
				</li>
				{items.map((item, index) => (
					<li key={index}>
						<div className="flex items-center">
							<ChevronRight size={16} className="text-gray-400" />
							<Link href={item.href} className="ml-1 md:ml-2 sm:text-sm text-[11px] text-gray-600 hover:text-teal-600">
								{item.label}
							</Link>
						</div>
					</li>
				))}
			</ol>
		</nav>
	)
}

