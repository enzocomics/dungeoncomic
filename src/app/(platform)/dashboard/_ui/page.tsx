/**----------------------------------- */
// I18N
import { useTranslations } from "next-intl"
import { ListPageItem, ListPageItemLogo, ListPageList } from "../../list/_ui"
import { getTranslations } from "next-intl/server"
import { getComics } from "@/lib/directus/get-comics"
import clsx from "clsx"
import { verifySession } from "@/data/session"
import { getSettings } from "@/lib/directus/get-settings"
/**-----------------------------------
 * Dasboard Page UI
 */
export default async function DashboardPageUI() {
	const t = await getTranslations("auth")
	const user = await verifySession()
	const settings = await getSettings()
	const comics = await getComics({
		user_created: {
			"id": {
				"_eq": user?.id
			}
		}
	})
	return <>
		<h1 className="font-platform-display text-3xl">
			{settings.post_type_name_plural} ({comics.length})
		</h1 >
		<div
			className={clsx(
				"gap-2",
				"grid",
				"grid-cols-1",
				"sm:grid-cols-2",
				"lg:grid-cols-3",
			)}>
			{
				comics?.map((c, index) => (
					<ListPageItem
						key={index}
						href={`/dashboard/${settings.post_type_name_slug}/${c.id}/`}
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
				))
			}
		</div>
	</>
}