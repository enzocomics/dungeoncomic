"use server"
/**----------------------------------- */
// TYPES
import { Metadata } from "next"
// I18N
import { getTranslations } from "next-intl/server"
// DATA
// UI
import ComicLandingPageUI from "./_page-ui"
import { getComic } from "@/lib/directus/get-comics"

/** ------------------------------------------------ **
 *  COMIC ROUTE PAGE
 */
export default async function ComicLandingPage() {
	// Get the comic slug parameter
	return <ComicLandingPageUI />
}