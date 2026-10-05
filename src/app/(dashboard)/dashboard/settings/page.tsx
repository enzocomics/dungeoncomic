import { getSettings } from "@/lib/directus/get-settings"
import SettingsPageUI from "@/ui/dashboard/pages/settings"

export default async function Page() {
	const settings = await getSettings()

	return <SettingsPageUI settings={settings} />
}