import DOMPurify from "isomorphic-dompurify"

export function sanitize(
	string: string,
	options: object = {
		ALLOWED_TAGS: [],
		ALLOWED_ATTR: [],
		ALLOW_DATA_ATTR: false,
		ALLOW_ARIA_ATTR: false,
	},
) {
	const cleanString = DOMPurify.sanitize(string, options)

	return cleanString
}
