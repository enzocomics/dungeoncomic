/**----------------------------------- */
// I18N
import { useTranslations } from "next-intl"
import { ListPageItem, ListPageItemLogo, ListPageList } from "../../list/_ui"
import { getTranslations } from "next-intl/server"
import { getComics } from "@/lib/directus/get-comics"
/**-----------------------------------
 * Dasboard Page UI
 */
export default async function DashboardPageUI() {
	const t = await getTranslations("auth")
	const comics = await getComics()
	return <>
		<h1 className="font-platform-display text-3xl">Dungeons</h1 >
		{/* <ListPageList> */}
		{
			comics?.map((c, index) => (
				<ListPageItem
					key={index}
					href={`/dashboard/edit/${c.id}`}
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
		{/* </ListPageList> */}
	</>
}