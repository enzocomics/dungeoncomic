import { verifySession } from "@/data/session"
import { getSettings } from "@/lib/directus/get-settings"
import SettingsPageUI from "@/ui/dashboard/pages/settings"
import { notFound } from "next/navigation"
import { connection } from "next/server"

export const instant = false

export default async function Page() {
	await connection()
	const session = await verifySession()
	const userCanUpdateSettings = session?.permissions?.settings?.update?.access === "full"
	if (userCanUpdateSettings)
		return <SettingsPageUI />
	else
		notFound()
}