import { parseWithZod } from "@conform-to/zod/v4"
import { settingsSchema } from "../pages/settings"

export async function saveSettings(prevState: unknown, formData: FormData) {
	// VALIDATION
	const submission = parseWithZod(formData, { schema: settingsSchema })

	// RETURN REPLY so that its last value may be used
	return submission.reply()
}
