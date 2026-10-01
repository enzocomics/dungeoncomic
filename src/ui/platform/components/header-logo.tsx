/**----------------------------------- */
// LIBRARIES
import Image from "next/image"
import Link from "next/link"
// DATA
import { directusURL } from "@/data/env"
import { getSettings } from "@/lib/directus/get-settings"
// FUNCTIONS
import clsx from "clsx"

/**----------------------------------- */
export const PlatformHeaderLogo = async () => {
	const settings = await getSettings()
	const banner = settings.project_banner
	const logo = settings.project_logo
	return <>
		<Link href="/" className={clsx(
			"pointer-events-auto",
			"w-auto",
			"flex",
			"items-center",
			"group",
			"cursor-pointer",
			"h-full",
			"hover:scale-105",
			"hover:duration-0",
			// Transition
			"transition-all",
			"ease-in-out",
			"duration-300",
			"rounded",
			"data-open:bg-comic-accent-700/80",
			"data-open:outline-4",
			"data-open:outline-comic-accent-500",
			"data-open:outline-offset-2",
			"flex",
			"justify-center",
			"items-center",
		)}>
			{!logo &&
				<span className={clsx(
					"inline-block",
					"font-platform-display",
					"text-xl",
					"md:text-4xl",
					"text-center",
					"text-pretty",
					"font-bold",
					// "p-4",
					"w-full",
					"whitespace-nowrap",
					"overflow-x-hidden",
					"text-ellipsis",
					!!banner && [
						"text-white",
						"[text-stroke:8px_black",
						"[-webkit-text-stroke:8px_black]",
						"[paint-order:stroke_fill]",
						"drop-shadow-black/50",
						"drop-shadow-md",
					],
				)}>
					{settings.project_name}
				</span>
			}
			{logo &&
				<Image
					src={`${directusURL}/assets/${logo.filename_disk}`}
					alt={logo.description || ""}
					width={logo.width || "160"}
					height={logo.height || "120"}
					className={clsx(
						"drop-shadow-black/50",
						"drop-shadow-sm",
						"w-auto",
						"h-14",
						"md:h-19",
					)}
				/>
			}
		</Link>
	</>
}