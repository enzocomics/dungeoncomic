"use client"

import { Button } from "@/components/button"
import { Field } from "@/components/fieldset"
import { Textarea } from "@/components/textarea"
import { verifySession } from "@/data/session"
import { getComicPage } from "@/lib/directus/get-comics"
import { getComments } from "@/lib/directus/get-comments"
import clsx from "clsx"


export function CommentsSection({
	page,
	comments,
	session
}: {
	page: Awaited<ReturnType<typeof getComicPage>>
	comments: Awaited<ReturnType<typeof getComments>>
	session: Awaited<ReturnType<typeof verifySession>>
}) {
	console.log(comments)
	return <>
		{page.allow_user_comments &&
			<section className={clsx(
				"mt-8",
				"bg-base-1",
				"p-2",
			)}>
				{!session &&
					<h4>You must be logged in to make a comment!</h4>
				}
				<Field disabled={session ? false : true}>
					<label className={clsx(
						"text-xl"
					)}>Make a Comment</label>
					<Textarea />
				</Field>
				<Button>Submit</Button>
			</section>
		}
		{comments && comments.length > 0 &&
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