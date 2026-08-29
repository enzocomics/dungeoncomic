/**
 * Slugifies a string, with an optional separator param.
 * @param {Object} params
 * @param {string} params.string - the string to be slugified, i.e. `Title Page`
 * @param {string} [params.separator] - separator character/string (Optional)
 * @returns {string} `Title Page` becomes `title-page`
 *
 */
export default function slugify({
	string,
	separator = "-",
}: {
	string: string
	separator?: string
}): string {
	return string
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9 -]/g, "")
		.replace(/\s+/g, separator)
}
