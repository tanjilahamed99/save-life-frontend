"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/components/admin/loading-spinner";

export default function AdminAuthCheck({ children }) {
	const router = useRouter();
	const [loading, setLoading] = useState(true);
	const [isAdmin, setIsAdmin] = useState(false);

	useEffect(() => {
		// In a real application, you would check if the current user has admin privileges
		// This is just a mock implementation for demonstration purposes
		const checkAdminStatus = async () => {
			try {
				// Simulate API call to check if user is an admin
				await new Promise((resolve) => setTimeout(resolve, 500));

				// For demo purposes, we'll assume the user is an admin
				setIsAdmin(true);
			} catch (error) {
				console.error("Error checking admin status:", error);
				setIsAdmin(false);
			} finally {
				setLoading(false);
			}
		};

		checkAdminStatus();
	}, []);

	if (loading) {
		return (
			<div className="flex items-center justify-center h-screen">
				<LoadingSpinner />
			</div>
		);
	}

	if (!isAdmin) {
		// Redirect to login or unauthorized page
		router.push("/login?redirect=/admin");
		return null;
	}

	return children;
}
