import { directusURL } from "@/data/env"
import { verifySession } from "@/data/session"
import { getSettings } from "@/lib/directus/get-settings"
import clsx from "clsx"
import { ComponentPropsWithoutRef } from "react"

export async function PlatformLayoutWrapper({
	children,
	header,
}: {
	children: React.ReactNode
	header?: React.ReactNode
	session?: Awaited<ReturnType<typeof verifySession>>
}) {

	const settings = await getSettings()
	const banner = settings.project_banner
	const hasBanner = !!banner
	return <>
		<SiteLayoutWrapper className={clsx("font-platform-copy")}>
			{hasBanner &&
				<SiteLayoutBackdrop style={{
					backgroundImage: `url(${directusURL}/assets/${banner?.filename_disk})`,
				}} />
			}
			{header}
			{children}
		</SiteLayoutWrapper>
	</>
}

export const SiteLayoutWrapper = (
	props: ComponentPropsWithoutRef<"div">
) => (
	<div
		{...props}
		className={clsx(
			props.className,
			"relative",
			"bg-top",
			"bg-repeat-x",
			"bg-fixed",
		)}
	>
		{props.children}
	</div>
)

export const SiteLayoutBackdrop = (
	props: ComponentPropsWithoutRef<"div">
) => (
	<div
		{...props}
		className={clsx(
			// Position
			"-z-1",
			"fixed",
			"left-1/2 -translate-x-1/2 ",
			// Size
			"w-full",
			"max-w-[1600px]",
			"h-100",
			// Appearance
			"opacity-75",
			// Background
			"bg-cover",
			"bg-center",
			"bg-fixed",
			"bg-blend-saturation",
			// Background: Fade to bottom
			"mask-image:linear-gradient(to_bottom,black_0%,black_50%,transparent_100%)",
			"[-webkit-mask-image:linear-gradient(to_bottom,black_0%,black_50%,transparent_100%)]",
			// Background: Fade to left & right (desktop)
			"xl:mask-image:linear-gradient(to_bottom,black_0%,black_50%,transparent_100%),linear-gradient(to_right,transparent_0%,black_5%,black_95%,transparent_100%)",
			"xl:mask-composite:intersect",
			"xl:[-webkit-mask-image:linear-gradient(to_bottom,black_0%,black_50%,transparent_100%),linear-gradient(to_right,transparent_0%,black_5%,black_95%,transparent_100%)]",
			"xl:[-webkit-mask-composite:source-in]",
		)}
	>
		{props.children}
	</div>
)

export const SiteLayoutMain = (
	props: ComponentPropsWithoutRef<"main">
) => (
	<main
		{...props}
		className={clsx(
			props.className,
			"relative",
			"mx-auto",
			"max-w-6xl",
			"md:px-6",
		)}
	>
		{props.children}
	</main>
)