/**----------------------------------- */
// LIBRARIES
import createNextIntlPlugin from "next-intl/plugin"
// TYPES
import type { NextConfig } from "next"
import { RemotePattern } from "next/dist/shared/lib/image-config"
// VARS - URL
import { directusURL } from "@/data/env"
const url = new URL(directusURL)

/**----------------------------------- */
// NEXT.JS CONFIGURATION
const nextConfig: NextConfig = {
	output: "standalone",
	staticPageGenerationTimeout: 1000,
	images: {
		remotePatterns: [
			{
				protocol: url.protocol.replace(":", ""),
				hostname: url.hostname,
				port: url.port,
				pathname: "/**",
			} as RemotePattern,
		],
	},
}

/**----------------------------------- */
// NEXT-INTL CONFIGURATION
const withNextIntl = createNextIntlPlugin("./src/lib/i18n/request.ts")

/**----------------------------------- */
// EXPORT
export default withNextIntl(nextConfig)
