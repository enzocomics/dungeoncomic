import DOMPurify from "isomorphic-dompurify"

export function sanitize(string: string) {
	const cleanString = DOMPurify.sanitize(string, {
		USE_PROFILES: { html: false },
	})

	return cleanString
}
