import { getSettings } from "@/lib/directus/get-settings"
import Icon from "@/styles/icons"
import clsx from "clsx"
import Link from "next/link"
import { PropsWithChildren } from "react"

export default async function DashboardComicLayout({
	params,
	...props
}: {
	params: Promise<{
		comic_post_type: string,
	}>
} & PropsWithChildren) {
	const settings = await getSettings()

	return <>
		<nav>
			<ul className={clsx(
				"flex",
				"items-center",
				"space-x-2",
				"font-bold",
				"text-base-content/50",
				"mb-6",
			)}>
				<li>
					<Link href="/dashboard" className={clsx(
						"flex",
						"items-center",
					)}>
						<Icon name="house" className={clsx("size-5")} />
						<span className="sr-only">Dashboard Home</span>
					</Link>
				</li>
				<li className={clsx(
					"flex",
					"items-center",
				)}>
					<Icon name="chevronRight" className={clsx(
						"size-4",
						"mr-2",
					)} />
					<span>
						{settings.post_type_name_plural}
					</span>
				</li>
			</ul>
		</nav>
		{props.children}
	</>
}