import { PageTitleH1 } from "@/components/page"
import type { getSettings } from "@/lib/directus/get-settings"
import type { getUsers } from "@/lib/directus/get-users"
import { DirectusUser } from "@/lib/directus/schema"
import Icon from "@/styles/icons"
import clsx from "clsx"
import Link from "next/link"

export default async function UserSinglePage({
	settings,
	user
}: {
	settings: Awaited<ReturnType<typeof getSettings>>
	user: Awaited<ReturnType<typeof getUsers>>[number]
}) {
	console.log(user.avatar)
	return <>

		<section className={clsx(
			"px-6",
		)}>
			<nav className={clsx(
				"flex",
				"items-center",
				// "space-x-2",
				// "font-bold",
				"text-base-content/50",
				"mb-6",
				"list-none"
			)}>
				<li>
					<Link href="/" className={clsx(
						"flex",
						"items-center",
					)}>
						<Icon name="house" className={clsx("size-5")} />
						<span className="sr-only">Home</span>
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
						{settings.user_type_name_plural}
					</span>
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
						{user.username}
					</span>
				</li>

			</nav>

			{/* <PageTitleH1>{user.username}</PageTitleH1> */}
		</section>
	</>
}