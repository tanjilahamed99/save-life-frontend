import axios from "axios";

const axiosInstance = axios.create({
	baseURL:
		process.env.NEXT_PUBLIC_APP_MODE == "production"
			? `https://api.zolpidem-kopen.net/api/v1`
			: "http://localhost:4000/api/v1",
});

axiosInstance.interceptors.request.use(
	(config) => {
		if (typeof window !== "undefined") {
			const token = JSON.parse(
				localStorage.getItem("benzo-auth-token") || "null"
			);
			if (token) {
				config.headers.Authorization = `Bearer ${token}`;
			}
		}
		return config;
	},
	(error) => Promise.reject(error)
);

export default axiosInstance;
