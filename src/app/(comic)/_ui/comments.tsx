"use client"

import { getComments } from "@/lib/directus/get-comments"
import clsx from "clsx"


export function CommentsSection({
	comments
}: {
	comments: Awaited<ReturnType<typeof getComments>>
}) {
	console.log(comments)
	return <>
		{comments &&
			<section className={clsx(
				"mt-8"
			)}>
				<h4 className={clsx(
					"text-xl"
				)}>Comments</h4>
				<ul className={clsx(
					"flex",
					"flex-col",
					"gap-2",
				)}>
					{comments.map((c, index) => (
						<li key={index} className={clsx(
							"bg-base-1"
						)}>
							<p>{c.user_created.username} commented on {c.date_created}:</p>
							{c.content}


							{/* Only allow 1 level of replies */}
							{c.children_comments &&
								<ul className={clsx(
									"ml-4",
									"flex",
									"flex-col",
									"gap-2",
								)}>
									{c.children_comments.map((cc, cindex) => (
										<li key={cindex}>
											<p>{cc.user_created.username} commented on {cc.date_created}:</p>
											{cc.content}
										</li>
									))}
								</ul>
							}

						</li>
					))}
				</ul>
			</section>
		}
	</>
}