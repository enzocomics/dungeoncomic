import { directusURL } from "@/data/env"
import { getComics } from "@/lib/directus/get-comics"
import type { getSettings } from "@/lib/directus/get-settings"
import type { getUsers } from "@/lib/directus/get-users"

import Icon from "@/styles/icons"
import clsx from "clsx"
import Image from "next/image"

import { ListPageItem, ListPageItemLogo } from "./comics-list"
import { ComicButton } from "@/components/input/button"
import type { verifySession } from "@/data/session"
import Link from "next/link"
import { cacheTag } from "next/cache"

export default async function UserSinglePage({
	settings,
	session,
	user
}: {
	settings: Awaited<ReturnType<typeof getSettings>>
	session: Awaited<ReturnType<typeof verifySession>>
	user: Awaited<ReturnType<typeof getUsers>>[number]
}) {
	"use cache"
	cacheTag(`userpage-${user.username}`)

	// Fetch this user's comics
	const userComics = await getComics({
		user_created: {
			"id": {
				"_eq": user.id
			}
		}
	})

	return <>
		<section className={clsx(
			"px-6",
			"w-full",
		)}>
			<nav className={clsx(
				"flex",
				"items-center",
				// "space-x-2",
				"text-base-content/50",
				"pb-6",
				"list-none",
				"mb-6",
				"border-b",
				"border-dashed",
				"border-base-5/20",
				"dark:border-base-5",
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
					<Link
						href={`/${settings.user_type_name_plural_slug}`}
					>
						{settings.user_type_name_plural}
					</Link>
				</li>
				<li className={clsx(
					"flex",
					"items-center",
					"font-bold",
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

			{/* Profile Columns */}
			<div className={clsx(
				"md:flex",
				"md:gap-6",
			)}>
				{/* Profile Sidebar */}
				<div className={clsx(
					"flex",
					"flex-col",
					"gap-3",
					"md:min-w-70",
					"md:w-70",
				)}>
					{/* Avatar + Name/Username */}
					<div className={clsx(
						"flex",
						"md:block",
					)}>
						{user.avatar &&
							<Image
								src={`${directusURL}/assets/${user.avatar.filename_disk}`}
								alt={user.avatar.description || ""}
								width={user.avatar.width || "300"}
								height={user.avatar.height || "300"}
								className={clsx(
									"w-16",
									"md:w-70",
									"aspect-square",
									// "h-32",
									"rounded-full",
									"object-cover"
								)}
							/>
						}
						{!user.avatar &&
							<div className={clsx(
								"w-16",
								"h-16",
								"md:w-70",
								"md:h-70",
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
									"md:size-14",
									"p-1",
									"rounded-sm",
									"text-white",
								)} />
							</div>
						}
						<div className={clsx(
							"grid",
							"items-center",
							"ml-3",
							"md:ml-0",
							"font-platform-labels",
						)}>
							<h1 className={clsx(
								"md:pt-6",
							)}>
								{user.name &&
									<span className={clsx(
										"block",
										"text-xl",
										"md:text-2xl",
										"font-bold"
									)}>{user.name}</span>
								}
								<span className={clsx(
									"block",
									"text-lg",
									"md:text-xl",
									"text-current/50",
								)}>@{user.username}</span>
							</h1>
						</div>

					</div>
					<div className={clsx(
					)}>
						{/* Bio */}
						{user.description &&
							<div className={clsx(
							)}>
								{user.description}
							</div>
						}
						{(session?.id === user.id /*|| session?.permissions?.directus_users?.update?.access === "full"*/) &&
							<ComicButton
								as="link"
								href="/dashboard/profile"
								className={clsx(
									"mt-3"
								)}
							>
								Edit Profile
							</ComicButton>
						}
						{/* Edit Profile Button IF current user */}
						{/* Location */}
						{/* Join Date */}
						{/* Followers/Following Count Here */}
						{/* Social Links Here */}
					</div>
				</div>

				{/* Content Column */}
				<div className={clsx(
					"mt-6",
					"md:mt-0",
					"md:w-full",
					// "md:grow"
				)}>

					{/* User's Comic Series List */}
					{userComics.length > 0 ?
						<div className={clsx(
							"border-4",
							"rounded",
							"border-neutral-200 dark:border-neutral-800",
							"px-4",
							"pt-3",
							"pb-4",
						)}>
							<h2 className={clsx(
								"font-platform-labels",
								"font-bold",
								"mb-3",
							)}>{settings.comic_type_name_plural} ({userComics.length})</h2>
							<div
								className={clsx(
									"gap-2",
									"grid",
									"grid-cols-1",
									"lg:grid-cols-2",
									// "lg:grid-cols-3",
								)}>
								{userComics?.map((c, index) => (
									<ListPageItem
										key={index}
										href={`/${settings.comic_type_name_slug}/${c.slug}`}
										accentColor={c.accent_color}
										banner={c.banner}
										title={c.title}
									>
										<ListPageItemLogo comic={c} />
									</ListPageItem>
								))}
							</div>
						</div>
						:
						<div></div>
					}
				</div>
			</div>
		</section >
	</>
}