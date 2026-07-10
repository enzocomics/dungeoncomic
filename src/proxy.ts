// Libraries
import { NextRequest, NextResponse } from "next/server"

/**-----------------------------------
 * proxy.ts
 * - used to run code on the server before a request is completed
 *
 * `NextResponse` API allows you to:
 * - redirect the incoming request to a different URL
 * - rewrite the response by displaying a given URL
 * - set request headers for API routes, `getServerSideProps`, and `rewrite` destinations
 * - set response cookies
 * - set response headers
 */
export default async function proxy(request: NextRequest) {
	const response = NextResponse.next()

	return response
}
