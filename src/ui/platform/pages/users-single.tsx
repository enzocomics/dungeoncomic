import { directusURL } from "@/data/env"
import type { getSettings } from "@/lib/directus/get-settings"
import type { getUsers } from "@/lib/directus/get-users"
import Icon from "@/styles/icons"
import clsx from "clsx"
import Image from "next/image"
import Link from "next/link"

export default async function UserSinglePage({
	settings,
	user
}: {
	settings: Awaited<ReturnType<typeof getSettings>>
	user: Awaited<ReturnType<typeof getUsers>>[number]
}) {



	return <>
		<section className={clsx(
			"px-6",
			"w-full",
		)}>
			{/* <nav className={clsx(
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

			</nav> */}

			{/* Profile Columns */}
			<div className={clsx(
				"md:flex",
				"md:gap-6"
			)}>
				{/* Profile Sidebar */}
				<div className={clsx(
					"flex",
					"flex-col",
					"gap-3",
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

								// "h-32",
								"rounded-full",
								"object-cover",
								"bg-black/5"
							)}>
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
						{/* Edit Profile Button IF current user */}
						{/* Location */}
						{/* Join Date */}
						{/* Followers/Following Count Here */}
						{/* Social Links Here */}
					</div>
				</div>

				{/* Content Column */}
				<div>
					{/* User's Comic Series List */}
				</div>
			</div>
		</section >
	</>
}