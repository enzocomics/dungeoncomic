/**----------------------------------- */
// I18N
import { useTranslations } from "next-intl"
import { ListPageItem, ListPageItemLogo, ListPageList } from "../../list/_ui"
import { getTranslations } from "next-intl/server"
import { getComics } from "@/lib/directus/get-comics"
import clsx from "clsx"
import { verifySession } from "@/data/session"
/**-----------------------------------
 * Dasboard Page UI
 */
export default async function DashboardPageUI() {
	const t = await getTranslations("auth")
	const user = await verifySession()
	const comics = await getComics({
		user_created: {
			"id": {
				"_eq": user?.id
			}
		}
	})
	return <>
		<h1 className="font-platform-display text-3xl">
			Adventures ({comics.length})
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
						href={`/dashboard/comic/${c.id}/`}
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