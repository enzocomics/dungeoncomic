"use server"
/**----------------------------------- */
// LIBRARIES
import { updateTag } from "next/cache"
// VALIDATION
import { parseWithZod } from "@conform-to/zod/v4"
import { dashboardSchema } from "@/ui/dashboard/functions/schema"
// DATA
import { userClient } from "@/lib/directus/clients"
import { deleteFile, updateMe, uploadFiles } from "@directus/sdk"

/** ---
 * Handles & submits Dashboard Forms
 *
 * @param prevState
 * @param formData
 */
export async function saveDashboardForm(
	prevState: unknown,
	formData: FormData,
) {
	// Get the name of the schema
	const schema = formData.get("schema") as string

	// VALIDATION
	const submission = parseWithZod(formData, {
		schema: dashboardSchema({ name: schema }),
	})

	return submission.reply()
}
