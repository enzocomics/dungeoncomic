import { LandingPageBody, LandingPageContent } from "@/app/_ui/page-landing"
import { getSettings } from "@/lib/directus/get-settings"
import { notFound } from "next/navigation"
import { ListPageItem, ListPageItemDescription, ListPageItemDetails, ListPageItemLogo, ListPageItemThumb, ListPageItemTitle, ListPageList, ListPageTitle } from "./_ui"
import { getComic, getComics } from "@/lib/directus/get-comics"
import { directusURL } from "@/data/env"
import Icon from "@/styles/icons"
import clsx from "clsx"

export default async function List() {
	const settings = await getSettings()
	const singleComic = !!settings.single_comic_site

	// Don't show this route on single-comic sites
	if (singleComic) notFound()

	const comics = await getComics()

	return <>
		<ListPageTitle />
		<ListPageList>
			{comics?.map((c, index) => (
				<ListPageItem
					key={index}
					href={`/${c.slug}`}
					accentColor={c.accent_color}
					banner={c.banner}
					title={c.title}
				>
					<ListPageItemLogo comic={c} />
					{/* <ListPageItemThumb thumbnail={c.thumbnail} /> */}
					{/* <ListPageItemDetails> */}
					{/* <ListPageItemTitle title={c.title} /> */}
					{/* </ListPageItemDetails> */}
				</ListPageItem>
			))}
		</ListPageList>
	</>
}