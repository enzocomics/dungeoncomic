import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getSettings } from "@/lib/directus/get-settings"
import { resolveRoute } from "@/lib/resolver"

const excludedPaths = [
	"/login",
	"/logout",
	"/register",
	"/reset-password"
]

export async function proxy(request: NextRequest) {
	const pathname = request.nextUrl.pathname
	const settings = await getSettings()
	const routingMode = settings.routing_mode

	// Do not resolve excluded paths
	if (excludedPaths.includes(pathname))
		return NextResponse.next()

	// Skip descendants, such as /login/reset, etc
	if (excludedPaths.some(
		(path) => pathname.startsWith(`${path}/`)
	))
		return NextResponse.next()

	// Check if the routing mode requires an internal path
	const internalPath = resolveRoute(pathname, routingMode)

	// console.log(internalPath)
	if (!internalPath)
		return NextResponse.next()

	return NextResponse.rewrite(
		new URL(internalPath, request.url)
	)

}


export const config = {
	matcher: [
		/*
		 * Run Proxy everywhere except:
		 * - /api/*
		 * - /img/*
		 * - /_next/static/*
		 * - /_next/image/*
		 * - /favicon.ico
		 * - /manifest.webmanifest
		 * - /login and its descendants
		 * - /logout and its descendants
		 * - /register and its descendants
		 * - /reset-password and its descendants
		 */
		"/((?!api|img|_next/static|_next/image|manifest.webmanifest|favicon\\.ico|login(?:/|$)|register(?:/|$)|logout(?:/|$)|reset-password(?:/|$)).*)",
	],
}