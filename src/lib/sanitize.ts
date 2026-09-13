import DOMPurify from "isomorphic-dompurify"

export function sanitize(string: string) {
	const cleanString = DOMPurify.sanitize(string, {
		ALLOWED_TAGS: [],
		ALLOWED_ATTR: [],
		ALLOW_DATA_ATTR: false,
		ALLOW_ARIA_ATTR: false,
	})

	return cleanString
}
