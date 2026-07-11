/** ------------------------------------------------ **/
// LIBRARIES
import {
	authentication,
	createDirectus,
	rest,
	staticToken,
} from "@directus/sdk"

// VARIABLES
import { adminToken, directusURL } from "@/lib/env"

// CMS
import { DirectusSchema } from "@/lib/directus/schema"

/** ------------------------------------------------ **/
// Directus client for making public API queries
export const publicClient =
	createDirectus<DirectusSchema>(directusURL).with(rest())

/** ------------------------------------------------ **/
// Directus client for making user API queries
export const userClient = createDirectus<DirectusSchema>(directusURL)
	.with(authentication())
	.with(rest())

/** ------------------------------------------------ **/
// Directus client for making admin API queries
export const adminClient = createDirectus<DirectusSchema>(directusURL)
	.with(staticToken(adminToken))
	.with(rest())
