"use client"

import { createContext, useContext, useEffect, useState } from "react"
import axiosInstance from "@/utils/axios"
import { useAuth } from "./AuthContext"

const NotificationContext = createContext()

export const NotificationProvider = ({ children }) => {
	const [notifications, setNotifications] = useState([])
	const [loading, setLoading] = useState(true)
	const { user } = useAuth()

	// Fetch notifications for the current user
	const fetchNotifications = async () => {
		if (!user || !user.email) return

		try {
			const response = await axiosInstance.get(`/notifications/user/${user.email}`)
			if (response.data.success) {
				setNotifications(response.data.data)
			}
		} catch (error) {
			console.error("Error fetching notifications:", error)
		} finally {
			setLoading(false)
		}
	}

	// Mark a notification as read
	const markAsRead = async (notificationId) => {
		try {
			await axiosInstance.put(`/notifications/${notificationId}/read`)
			setNotifications((prevNotifications) =>
				prevNotifications.filter((notification) => notification._id !== notificationId),
			)
		} catch (error) {
			console.error("Error marking notification as read:", error)
		}
	}

	// Dismiss a notification without following its action
	const dismissNotification = async (notificationId) => {
		try {
			await axiosInstance.put(`/notifications/${notificationId}/read`)
			setNotifications((prevNotifications) =>
				prevNotifications.filter((notification) => notification._id !== notificationId),
			)
		} catch (error) {
			console.error("Error dismissing notification:", error)
		}
	}

	// Initial fetch and set up polling
	useEffect(() => {
		if (user && user.email) {
			fetchNotifications()

			// Poll for new notifications every minute
			const intervalId = setInterval(fetchNotifications, 60000)

			return () => clearInterval(intervalId)
		} else {
			setLoading(false)
		}
	}, [user])

	return (
		<NotificationContext.Provider
			value={{
				notifications,
				loading,
				markAsRead,
				dismissNotification,
				refreshNotifications: fetchNotifications,
			}}
		>
			{children}
		</NotificationContext.Provider>
	)
}

export const useNotifications = () => useContext(NotificationContext)

export default NotificationContext
