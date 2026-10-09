"use server"
import { parseWithZod } from "@conform-to/zod/v4"
import { settingsSchema } from "../functions/settings-schema"
import { userClient } from "@/lib/directus/clients"
import { updateSingleton } from "@directus/sdk"
import { updateTag } from "next/cache"

export async function saveSettings(prevState: unknown, formData: FormData) {
	// VALIDATION
	const submission = parseWithZod(formData, { schema: settingsSchema() })

	const projectName = formData.get("settings.project_name")
	const projectUrl = formData.get("settings.project_url")
	const routingMode = formData.get("settings.routing_mode")

	// console.log(projectName, projectUrl, routingMode)
	try {
		const updateSettings = await userClient.request(
			updateSingleton("settings", {
				project_name: projectName,
				project_url: projectUrl,
				routing_mode: routingMode,
			}),
		)
		updateTag("settings")
		// console.log(updateSettings)
	} catch (err: any) {
		// RETURN ERROR IF UNSUCCESFUL
		const error = err.errors?.[0]
		const code = error?.extensions?.code
		const reason = error?.message
		return submission.reply({
			formErrors: [reason],
		})
	}
	// RETURN REPLY so that its last value may be used
	return submission.reply()
}
