"use client"

import { useState, useEffect } from "react"
import { X, Bell, ExternalLink } from "lucide-react"
import { useNotifications } from "@/context/NotificationContext"

export default function SiteNotifications() {
	const { notifications, markAsRead } = useNotifications()
	const [currentNotification, setCurrentNotification] = useState(null)
	const [isVisible, setIsVisible] = useState(false)

	useEffect(() => {
		// If we have notifications and no current one is displayed, show the first one
		if (notifications.length > 0 && !currentNotification) {
			// Find payment notifications first
			const paymentNotification = notifications.find((n) => n.type === "payment")
			setCurrentNotification(paymentNotification || notifications[0])
			setIsVisible(true)
		} else if (notifications.length === 0) {
			setCurrentNotification(null)
			setIsVisible(false)
		}
	}, [notifications])

	const handleDismiss = async () => {
		if (currentNotification) {
			await markAsRead(currentNotification._id)
			setIsVisible(false)

			// After animation completes, check if there are more notifications
			setTimeout(() => {
				if (notifications.length > 1) {
					const nextNotification = notifications.find((n) => n._id !== currentNotification._id)
					setCurrentNotification(nextNotification)
					setIsVisible(true)
				} else {
					setCurrentNotification(null)
				}
			}, 300)
		}
	}

	const handleAction = () => {
		if (currentNotification?.actionUrl) {
			// Mark as read
			markAsRead(currentNotification._id)

			// Open the action URL
			window.open(currentNotification.actionUrl, "_blank")

			// Hide the notification
			setIsVisible(false)

			// Check for more notifications
			setTimeout(() => {
				if (notifications.length > 1) {
					const nextNotification = notifications.find((n) => n._id !== currentNotification._id)
					setCurrentNotification(nextNotification)
					setIsVisible(true)
				} else {
					setCurrentNotification(null)
				}
			}, 300)
		}
	}

	if (!currentNotification || !isVisible) return null

	return (
		<div className={`transition-all duration-300 ${isVisible ? "opacity-100" : "opacity-0 -translate-y-full"}`}>
			<div
				className={`w-full bg-teal-600 text-white py-3 px-4 shadow-md ${currentNotification.type === "payment" ? "bg-orange-500" : "bg-teal-600"}`}
			>
				<div className="container mx-auto flex items-center justify-between">
					<div className="flex items-center">
						<Bell size={20} className="mr-3 flex-shrink-0" />
						<div>
							<p className="font-medium">{currentNotification.title}</p>
							<p className="text-sm text-white/90">{currentNotification.message}</p>
						</div>
					</div>

					<div className="flex items-center space-x-3">
						{currentNotification.actionUrl && (
							<button
								onClick={handleAction}
								className="bg-white text-orange-600 px-4 py-1 rounded-md text-sm font-medium flex items-center hover:bg-orange-50 transition-colors"
							>
								{currentNotification.actionText || "Bekijken"}
								<ExternalLink size={14} className="ml-1" />
							</button>
						)}

						<button
							onClick={handleDismiss}
							className="text-white/80 hover:text-white"
							aria-label="Dismiss notification"
						>
							<X size={20} />
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}
