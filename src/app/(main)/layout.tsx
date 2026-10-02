import { getSettings } from "@/lib/directus/get-settings"
import { ComicRootLayout } from "@/ui/comic/layout"
import PlatformRootLayout from "@/ui/platform/layout"
import { PropsWithChildren } from "react"

export default async function MainLayout({
	headerComic,
	headerPlatform,
	...props
}: {
	headerComic: React.ReactNode
	headerPlatform: React.ReactNode
} & PropsWithChildren
) {
	const settings = await getSettings()
	const routingMode = settings.routing_mode
	switch (routingMode) {
		case "single/single":
			return <>
				<ComicRootLayout header={headerComic}>
					{props.children}
				</ComicRootLayout>
			</>
		case "single/multiple":
		case "multiple/multiple":
			return <>
				<PlatformRootLayout header={headerPlatform}>
					{props.children}
				</PlatformRootLayout>
			</>
	}
}	