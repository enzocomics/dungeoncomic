"use client"
/**----------------------------------- */
import { useSearchParams } from "next/navigation"
import { getComicPage } from "@/lib/directus/get-comics"

/**
 * Checks if variables exist
 */
export const doVarsExist = (
	comicPanels: Awaited<ReturnType<typeof getComicPage>>["comic_panels"]
) => {
	return comicPanels?.flatMap(p => p.variables && p.variables.length > 0).some(Boolean)
}

/**
 * Checks if every variable on a specific comic page has been submitted
 */
export const haveVarsBeenSubmitted = (
	comicPanels: Awaited<ReturnType<typeof getComicPage>>["comic_panels"]
) => {
	const searchParams = useSearchParams()
	// Get a flat map of all the variables for this specific page's comic panels
	const varParams = comicPanels?.flatMap(p =>
		p.variables && p.variables.length > 0 ?
			p.variables.map(v => v.slug) : []
	)

	// Check the url search params if _every_ variable has been submitted 
	return varParams && varParams.length > 0
		? varParams.every((param) => param ? searchParams.has(param)
			: false)
		: false

}