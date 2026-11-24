import { getSettings } from "@/lib/directus/get-settings"
import { ListPageList, ListPageTitle } from "./comics-list"
import { getUsers } from "@/lib/directus/get-users"
import clsx from "clsx"
import Image from "next/image"
import { directusURL } from "@/data/env"
import Icon from "@/styles/icons"
import Link from "next/link"

export default async function UsersListPage() {
	const settings = await getSettings()
	const users = await getUsers()
	return <>
		<ListPageTitle>
			Viewing: <strong>All</strong> {settings.user_type_name_plural}
		</ListPageTitle>
		<div className={clsx(
			"px-6",
			"gap-2",
			"grid",
			"grid-cols-2",
			"sm:grid-cols-3",
			"md:grid-cols-5",
		)}>
			{users?.map((u, index) => (
				<Link
					href={`/${settings.user_type_name_slug}/${u.username}`}
					key={index}
					className={clsx(
						"flex",
						"flex-col",
						"items-center",
						"p-6",
						"border-4",
						"rounded",
						"border-neutral-200",
						"dark:border-neutral-800",
						"grayscale-100",
						"hover:grayscale-0",
						"focus:grayscale-0",
						"hover:border-platform-accent-500",
						"hover:opacity-75",
						"hover:duration-0",
						"focus:outline-4",
						"focus:-outline-offset-4",
						"focus:outline-platform-accent-500",
						// Transition
						"transition-all",
						"ease-in-out",
						"duration-300",
					)}>
					{u.avatar ?
						<Image
							src={`${directusURL}/assets/${u.avatar.filename_disk}`}
							alt={u.avatar.description || ""}
							width={u.avatar.width || "300"}
							height={u.avatar.height || "300"}
							className={clsx(
								"w-16",
								"aspect-square",
								// "h-32",
								"rounded-full",
								"object-cover"
							)}
						/>
						:
						<div className={clsx(
							"w-16",
							"h-16",
							"aspect-square",

							// "h-32",
							"rounded-full",
							"object-cover",
							"bg-neutral-400",
							"dark:bg-neutral-800",
							"grid",
							"place-content-center",
						)}>
							<Icon name="skull" className={clsx(
								"size-8",
								"p-1",
								"rounded-sm",
								"text-white",
							)} />
						</div>
					}
					<div className={clsx(
						"mt-3",
						"text-center",

						"font-platform-labels",
					)}>
						{u.username}
					</div>
				</Link>
			))}
		</div>
	</>
}