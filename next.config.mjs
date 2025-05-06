/** @type {import('next').NextConfig} */
const nextConfig = {
	// allow all domain images
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "**",
			},
		],
	},
};

export default nextConfig;
