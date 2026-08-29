import { getComicVariables } from "@/lib/directus/get-comics"

/**-----------------------------------
 * Replaces Comic Variables in a string with the User Variables
 * ---
 */
export default function replaceComicVariables({
	content,
	variables,
	userVariables,
	html,
}: {
	content: string | null
	variables: Awaited<ReturnType<typeof getComicVariables>>
	userVariables?: Record<string, string> | undefined
	html?: boolean
}) {
	// Remap the variables array so the slug is the key and the variable object is the value, so we can retrieve a variable by its slug
	const variablesBySlug = new Map(variables.map((v) => [v.slug, v]))

	// Search through the conte t string for every instance of `[var:some-slug]`
	return content
		? content.replace(
				/\[var:([a-zA-Z0-9_-]+)\]/g,
				// Run every time there is a full match
				(fullMatch, slug: string) => {
					const variable = variablesBySlug.get(slug)

					// Fallback to default value
					const value =
						(userVariables && userVariables[slug]) ?? variable?.default_value

					// Keep unknown tags unchanged, or return "" if preferred
					return value !== undefined
						? html
							? `<strong>${value}</strong>`
							: value // TODO: markdown? classname? so we can target and style as needed
						: fullMatch
				},
			)
		: ""
}
