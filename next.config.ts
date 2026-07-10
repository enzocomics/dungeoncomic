/**----------------------------------- */
// LIBRARIES
import createNextIntlPlugin from "next-intl/plugin"

// TYPES
import type { NextConfig } from "next"

/**----------------------------------- */
// NEXT.JS CONFIGURATION
const nextConfig: NextConfig = {
	output: "standalone",
}

/**----------------------------------- */
// NEXT-INTL CONFIGURATION
const withNextIntl = createNextIntlPlugin("./src/lib/i18n/request.ts")

/**----------------------------------- */
// EXPORT
export default withNextIntl(nextConfig)
