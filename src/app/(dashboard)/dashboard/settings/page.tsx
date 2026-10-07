import { verifySession } from "@/data/session"
import { getSettings } from "@/lib/directus/get-settings"
import SettingsPageUI from "@/ui/dashboard/pages/settings"
import { notFound } from "next/navigation"

export default async function Page() {
	const settings = await getSettings()
	const session = await verifySession()
	const userCanUpdateSettings = session?.permissions?.settings?.update?.access === "full"
	if (userCanUpdateSettings)
		return <SettingsPageUI settings={settings} />
	else
		notFound()
}