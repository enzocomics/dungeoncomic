/**----------------------------------- */
// FUNCTIONS
import clsx from "clsx"
// UI
import Icon from "@/styles/icons"
import { useGlobalContext } from "@/app/_context"
import { ComponentPropsWithoutRef } from "react"

type NoticeType = "alert" | "error" | "success" | "info" | ""

type NoticeProps =
	// Union Type - Allows <Notice> to accept at least ONE of `title` or `description`
	| {
		title: string
		description?: string
		type: NoticeType
	}
	| {
		title?: string
		description: string
		type: NoticeType
	}
/**-----------------------------------
 * Notice Message
 */
export default function Notice({
	type,
	title,
	description,
}: NoticeProps) {


	// OUTPUT
	// Only display the layout if a message exists
	return <div
		className={clsx(
			"p-4",
			"rounded-md",
			"dark:outline",
			// background-color
			(type == "alert" ? "bg-yellow-50" : ""),
			(type == "error" ? "bg-red-50" : ""),
			(type == "success" ? "bg-green-50" : ""),
			(type == "info" ? "bg-blue-50" : ""),
			// dark: background-color
			(type == "alert" ? "dark:bg-yellow-500/10" : ""),
			(type == "error" ? "dark:bg-red-500/15" : ""),
			(type == "success" ? "dark:bg-green-500/10" : ""),
			(type == "info" ? "dark:bg-blue-500/10" : ""),
			// dark: outline-color
			(type == "alert" ? "dark:outline-yellow-500/15" : ""),
			(type == "error" ? "dark:outline-red-500/25" : ""),
			(type == "success" ? "dark:outline-green-500/20" : ""),
			(type == "info" ? "dark:outline-blue-500/20" : ""),
		)}>
		<div className="flex">
			{/* ICON */}
			<div className="shrink-0">
				{type == "alert" &&
					<Icon name="triangleExclamation" aria-hidden="true" className="size-6 text-yellow-400 dark:text-yellow-300" />
				}
				{type == "error" &&
					<Icon name="circleXmark" aria-hidden="true" className="size-6 text-red-400" />
				}
				{type == "success" &&
					<Icon name="circleCheck" aria-hidden="true" className="size-6 text-green-400" />
				}
				{type == "info" &&
					<Icon name="circleInfo" aria-hidden="true" className="size-6 text-blue-400" />
				}
			</div>
			{/* TEXT */}
			<div className={clsx(
				"ml-3",
			)}>
				{title &&
					<h3 className={clsx(
						"text-base",
						"text-pretty",
						"font-medium",
						// text-color
						(type == "alert" ? "text-yellow-800" : ""),
						(type == "error" ? "text-red-800" : ""),
						(type == "success" ? "text-green-800" : ""),
						(type == "info" ? "text-blue-800" : ""),
						// dark: text-color
						(type == "alert" ? "dark:text-yellow-400" : ""),
						(type == "error" ? "dark:text-red-200" : ""),
						(type == "success" ? "dark:text-green-200" : ""),
						(type == "info" ? "dark:text-blue-300" : ""),
					)}>
						{title}
					</h3>
				}
				<div className={clsx(
					title && "mt-1",
					"text-base",
					// text-color
					(type == "alert" ? "text-yellow-700" : ""),
					(type == "error" ? "text-red-700" : ""),
					(type == "success" ? "text-green-700" : ""),
					(type == "info" ? "text-blue-700" : ""),
					// dark: text-color
					(type == "alert" ? "dark:text-yellow-100/80" : ""),
					(type == "error" ? "dark:text-red-100/80" : ""),
					(type == "success" ? "dark:text-green-100/80" : ""),
					(type == "info" ? "dark:text-blue-100/80" : ""),

				)}>
					{description}
				</div>
			</div>
			{/* CLOSE BUTTON */}
			<div className="ml-auto pl-3">
				<div className="-mx-1.5 -my-1.5">
					<button
						type="button"
						onClick={() => {

						}}
						className={clsx(
							"inline-flex",
							"rounded-md",
							// bg-color
							(type == "alert" ? "bg-yellow-50" : ""),
							(type == "error" ? "bg-red-50" : ""),
							(type == "success" ? "bg-green-50" : ""),
							(type == "info" ? "bg-blue-50" : ""),
							"p-1.5",
							// text-color
							(type == "alert" ? "text-yellow-500" : ""),
							(type == "error" ? "text-red-500" : ""),
							(type == "success" ? "text-green-500" : ""),
							(type == "info" ? "text-blue-500" : ""),
							// hover:bg-color
							(type == "alert" ? "hover:bg-yellow-100" : ""),
							(type == "error" ? "hover:bg-red-100" : ""),
							(type == "success" ? "hover:bg-green-100" : ""),
							(type == "info" ? "hover:bg-blue-100" : ""),
							"focus-visible:ring-2",
							// focus-visible:ring-color
							(type == "alert" ? "focus-visible:ring-yellow-600" : ""),
							(type == "error" ? "focus-visible:ring-red-600" : ""),
							(type == "success" ? "focus-visible:ring-green-600" : ""),
							(type == "info" ? "focus-visible:ring-blue-600" : ""),
							"focus-visible:ring-offset-2",
							// focus-visible:ring-offset-color
							(type == "alert" ? "focus-visible:ring-offset-yellow-50" : ""),
							(type == "error" ? "focus-visible:ring-offset-red-50" : ""),
							(type == "success" ? "focus-visible:ring-offset-green-50" : ""),
							(type == "info" ? "focus-visible:ring-offset-blue-50" : ""),
							"focus-visible:outline-hidden",
							"dark:bg-transparent",
							// dark:text-color
							(type == "alert" ? "text-yellow-400" : ""),
							(type == "error" ? "text-red-400" : ""),
							(type == "success" ? "text-green-400" : ""),
							(type == "info" ? "text-blue-400" : ""),
							// dark:hover:bg-color
							(type == "alert" ? "dark:hover:bg-yellow-500/10" : ""),
							(type == "error" ? "dark:hover:bg-red-500/10" : ""),
							(type == "success" ? "dark:hover:bg-green-500/10" : ""),
							(type == "info" ? "dark:hover:bg-blue-500/10" : ""),
							// dark:focus-visible:ring-color
							(type == "alert" ? "dark:focus-visible:ring-yellow-500" : ""),
							(type == "error" ? "dark:focus-visible:ring-red-500" : ""),
							(type == "success" ? "dark:focus-visible:ring-green-500" : ""),
							(type == "info" ? "dark:focus-visible:ring-blue-500" : ""),
							"dark:focus-visible:ring-offset-1",
							// dark:focus-visible:ring-offset-color
							(type == "alert" ? "dark:focus-visible:ring-offset-yellow-900" : ""),
							(type == "error" ? "dark:focus-visible:ring-offset-red-900" : ""),
							(type == "success" ? "dark:focus-visible:ring-offset-green-900" : ""),
							(type == "info" ? "dark:focus-visible:ring-offset-blue-900" : ""),
						)}
					>
						<span className="sr-only">Dismiss</span>
						<Icon name="xmark" aria-hidden="true" className="size-5" />
					</button>
				</div>
			</div>
		</div>
	</div >

}
