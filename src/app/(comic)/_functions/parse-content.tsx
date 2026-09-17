import { getComicVariables } from "@/lib/directus/get-comics"
import { sanitize } from "@/lib/sanitize"
import { marked } from "marked"

/**-----------------------------------
 * Replaces Comic Variables in a string with the User Variables
 * ---
 */
export function replaceComicVariables({
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
	if (variables) {
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
							? `<span class="comicVariable">${variable?.value_prefix ?? ""}${value}${variable?.value_suffix ?? ""}</span>`
							: value // TODO: markdown? classname? so we can target and style as needed
						: fullMatch
				},
			)
			: ""
	} else {
		return content
	}
}

export function prepareText({
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
	const sanitized = sanitize(content as string)
	const parsed = marked.parse(sanitized)
	const preppedText = replaceComicVariables({
		content: parsed as string,
		variables: variables,
		userVariables: userVariables,
		html: html
	})

	return preppedText as string
}