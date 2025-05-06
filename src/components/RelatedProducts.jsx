"use client"

import { useState, useEffect, useRef } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { getRelatedProducts } from "@/lib/products"
import ProductCard from "./ProductCard"

export default function RelatedProducts({ categoryId, currentProductId }) {
	const [products, setProducts] = useState([])
	const [loading, setLoading] = useState(true)
	const scrollRef = useRef(null)
	const [canScrollLeft, setCanScrollLeft] = useState(false)
	const [canScrollRight, setCanScrollRight] = useState(true)

	useEffect(() => {
		const fetchRelatedProducts = async () => {
			setLoading(true)
			try {
				const relatedProducts = await getRelatedProducts(categoryId, currentProductId)
				setProducts(relatedProducts)
			} catch (error) {
				console.error("Error fetching related products:", error)
			} finally {
				setLoading(false)
			}
		}

		fetchRelatedProducts()
	}, [categoryId, currentProductId])

	const checkScrollButtons = () => {
		if (scrollRef.current) {
			const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
			setCanScrollLeft(scrollLeft > 0)
			setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
		}
	}

	const scroll = (direction) => {
		if (scrollRef.current) {
			const { clientWidth } = scrollRef.current
			const scrollAmount = direction === "left" ? -clientWidth / 2 : clientWidth / 2
			scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" })
			setTimeout(checkScrollButtons, 300)
		}
	}

	useEffect(() => {
		checkScrollButtons()
		window.addEventListener("resize", checkScrollButtons)
		return () => window.removeEventListener("resize", checkScrollButtons)
	}, [products])

	if (loading) {
		return (
			<div className="py-8">
				<div className="animate-pulse flex space-x-4">
					<div className="flex-1 space-y-4">
						<div className="h-4 bg-gray-200 rounded w-1/4"></div>
						<div className="grid grid-cols-4 gap-4">
							<div className="h-48 bg-gray-200 rounded"></div>
							<div className="h-48 bg-gray-200 rounded"></div>
							<div className="h-48 bg-gray-200 rounded"></div>
							<div className="h-48 bg-gray-200 rounded"></div>
						</div>
					</div>
				</div>
			</div>
		)
	}

	if (products.length === 0) {
		return null
	}

	return (
		<section className="mt-12 mb-8">
			<div className="flex justify-between items-center mb-6">
				<h2 className="text-lg md:text-2xl font-bold">Gerelateerde Producten</h2>

				<div className="flex space-x-2">
					<button
						onClick={() => scroll("left")}
						disabled={!canScrollLeft}
						className={` p-1 md:p-2 rounded-full border ${canScrollLeft
							? "border-gray-300 hover:bg-gray-100 text-gray-700"
							: "border-gray-200 text-gray-300 cursor-not-allowed"
							}`}
					>
						<ChevronLeft size={20} />
					</button>
					<button
						onClick={() => scroll("right")}
						disabled={!canScrollRight}
						className={`p-1 md:p-2 rounded-full border ${canScrollRight
							? "border-gray-300 hover:bg-gray-100 text-gray-700"
							: "border-gray-200 text-gray-300 cursor-not-allowed"
							}`}
					>
						<ChevronRight size={20} />
					</button>
				</div>
			</div>

			<div ref={scrollRef} className="flex overflow-x-auto space-x-4 pb-4 scrollbar-hide" onScroll={checkScrollButtons}>
				{products.map((product) => (
					<div key={product.id} className="flex-none w-[250px]">
						<ProductCard product={product} />
					</div>
				))}
			</div>
		</section>
	)
}

