import { PageTitleH1 } from "@/components/page"
import { getSettings } from "@/lib/directus/get-settings"
import Icon from "@/styles/icons"
import clsx from "clsx"
import Link from "next/link"

export default async function CreateComicPageUI() {
	const settings = await getSettings()
	return <>

		<PageTitleH1>
			<span className={clsx(
				"flex",
				"items-center",
				"space-x-2",
			)}>
				<Link href="/dashboard" className={clsx(
					"flex",
					"items-center",
					"text-base-content/50",
				)}>
					<Icon name="house" className={clsx("size-5")} />
					<span className="sr-only">Dashboard Home</span>
				</Link>
				<Icon name="chevronRight" className={clsx(
					"size-4",
					"mr-2",
					"text-base-content/50",
				)} />
				<span>Create New {settings.comic_type_name}</span>
			</span>

		</PageTitleH1>

	</>
}