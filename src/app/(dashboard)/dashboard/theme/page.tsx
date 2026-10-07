import { getSettings } from "@/lib/directus/get-settings"
import ThemePageUI from "@/ui/dashboard/pages/theme"

export default async function Page() {
	const settings = await getSettings()

	return <ThemePageUI settings={settings} />
}