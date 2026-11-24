import { PageTitleH1 } from "@/components/page"
import { getComics } from "@/lib/directus/get-comics"
import { getSettings } from "@/lib/directus/get-settings"
import Icon from "@/styles/icons"
import clsx from "clsx"
import Link from "next/link"

export default async function EditComicPageUI({
	comicId
}: {
	comicId: string
}) {
	const settings = await getSettings()
	const [comic] = await getComics({
		id: {
			_eq: parseInt(comicId)
		}
	})

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
				<span>Edit: {comic.title}</span>
			</span>
		</PageTitleH1>

	</>
}