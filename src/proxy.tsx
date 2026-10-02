import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getSettings } from "@/lib/directus/get-settings"
import { resolveRoute } from "@/lib/resolver"

const excludedPaths = [
	// "/main",
	"/login",
	"/logout",
	"/register",
	"/reset-password"
]

function isExcludedPath(pathname: string) {
	return (
		// pathname.startsWith("/main") ||
		excludedPaths.some(
			(path) =>
				pathname === path ||
				pathname.startsWith(`${path}/`)
		)
	)
}

export async function proxy(request: NextRequest) {
	const pathname = request.nextUrl.pathname

	// Do not resolve excluded paths
	if (isExcludedPath(pathname)) {
		return NextResponse.next()
	}

	// Get the routing mode
	const routingMode = (await getSettings()).routing_mode
	const internalPath = resolveRoute(pathname, routingMode)

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
		 */
		"/((?!api|img|_next/static|_next/image|manifest\\.webmanifest|favicon\\.ico).*)",
	],
}