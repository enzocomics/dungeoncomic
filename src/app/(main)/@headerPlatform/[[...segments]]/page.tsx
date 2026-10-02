import { getSettings } from "@/lib/directus/get-settings"
import ClientLandingPageHeader from "@/ui/comic/components/@header/effects"

export default async function PlatformHeader() {
	const settings = await getSettings()
	return <ClientLandingPageHeader settings={settings} />
}