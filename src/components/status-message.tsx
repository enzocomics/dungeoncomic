"use client"
/**----------------------------------- */
// TYPES
export type StatusMessageType = keyof typeof notificationColors

// FUNCTIONS
import clsx from "clsx"
// UI
import Icon from "@/styles/icons"
import { useGlobalContext } from "@/app/_context"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { ComponentPropsWithoutRef } from "react"
import { notificationColors } from "@/styles/colors"

/**-----------------------------------
 * Status Message UI
 */
export default function StatusMessage({
	className = ""
}: {
	className?: string
} & ComponentPropsWithoutRef<"div">) {
	// NAVIGATION HOOKS
	const router = useRouter()
	const pathname = usePathname()
	const params = useSearchParams()
	// STATUS MESSAGE HOOKS
	const { statusMessage } = useGlobalContext()
	const setStatus = useChangeStatus("")

	// OUTPUT
	// Only display the layout if a message exists
	if (statusMessage.message !== "")
		return <div
			id={`status-${statusMessage.type}`}
			aria-live="polite"
			style={
				{
					"--color-notification-50": `var(${notificationColors[statusMessage.type]["50"]})`,
					"--color-notification-100": `var(${notificationColors[statusMessage.type]["100"]})`,
					"--color-notification-200": `var(${notificationColors[statusMessage.type]["200"]})`,
					"--color-notification-300": `var(${notificationColors[statusMessage.type]["300"]})`,
					"--color-notification-400": `var(${notificationColors[statusMessage.type]["400"]})`,
					"--color-notification-500": `var(${notificationColors[statusMessage.type]["500"]})`,
					"--color-notification-600": `var(${notificationColors[statusMessage.type]["600"]})`,
					"--color-notification-700": `var(${notificationColors[statusMessage.type]["700"]})`,
					"--color-notification-800": `var(${notificationColors[statusMessage.type]["800"]})`,
					"--color-notification-900": `var(${notificationColors[statusMessage.type]["900"]})`,
					"--color-notification-950": `var(${notificationColors[statusMessage.type]["950"]})`,
				} as React.CSSProperties}
			className={clsx(
				"sticky",
				"top-0",
				"grid",
				"animate-expand",
				className
			)}>
			<div className={clsx(
				"min-h-0",
				"overflow-hidden",
			)}>
				<div className={clsx(
					"md:rounded",
					"bg-black/20",
					"p-2",
				)}>
					<div className={clsx(
						"h-full",
						"max-w-2xl",
						"mx-auto",
						"flex",
						"p-4",
						"rounded",
						"bg-notification-50",
						"dark:bg-notification-600",
						"outline-2",
						"outline-notification-400/10",
						"md:rounded",
						"dark:outline-notification-700/20",
						"drop-shadow-black/10",
						"dark:drop-shadow-black/20",
						"drop-shadow-xl",
					)}>
						{/* ICON */}
						<div className="shrink-0">
							{statusMessage.type == "alert" &&
								<Icon name="triangleExclamation" aria-hidden="true" className="size-5 text-yellow-400 dark:text-yellow-300" />
							}
							{statusMessage.type == "error" &&
								<Icon name="circleXmark" aria-hidden="true" className="size-5 text-red-400" />
							}
							{statusMessage.type == "success" &&
								<Icon name="circleCheck" aria-hidden="true" className="size-5 text-green-400" />
							}
							{statusMessage.type == "info" &&
								<Icon name="circleInfo" aria-hidden="true" className="size-5 text-blue-400" />
							}
						</div>
						{/* TEXT */}
						<div className={clsx(
							"ml-3",
						)}>
							<h3 className={clsx(
								"text-sm",
								"text-pretty",
								"font-platform-labels",
								"font-semibold",
								"text-notification-800",
								"dark:text-notification-100",
							)}>
								{statusMessage.message}
							</h3>
							{statusMessage.description &&
								<div className={clsx(
									"mt-2",
									"text-sm",
									"text-balance",
									"font-platform-labels",
									"text-notification-700",
									"dark:text-notification-300",
								)}>
									<p dangerouslySetInnerHTML={{
										__html: JSON.parse(statusMessage.description).map((
											part: {
												type: string
												props: {
													children: string[]
													href: string
												}
											}) => {
											if (typeof part === "string") return part
											if (part?.type === "a") {
												const text = Array.isArray(part.props?.children)
													? part.props.children.join("")
													: part.props?.children
												return `<a class="${clsx(
													"underline",
													// text-color
													(statusMessage.type == "alert" ? "text-yellow-800" : ""),
													(statusMessage.type == "error" ? "text-red-800" : ""),
													(statusMessage.type == "success" ? "text-green-800" : ""),
													(statusMessage.type == "info" ? "text-blue-800" : ""),
													// dark: text-color
													(statusMessage.type == "alert" ? "dark:text-yellow-400" : ""),
													(statusMessage.type == "error" ? "dark:text-red-200" : ""),
													(statusMessage.type == "success" ? "dark:text-green-200" : ""),
													(statusMessage.type == "info" ? "dark:text-blue-300" : ""),
												)}" 
										href="${part.props.href}">${text}</a>`
											}
											return "";
										}).join("")
									}}></p>
								</div>
							}
						</div>
						{/* CLOSE BUTTON */}
						<div className="ml-auto pl-3">
							<div className="-mx-1.5 -my-1.5">
								<button
									data-statusmessage={true}
									type="button"
									onClick={() => {
										// Clear the search params from the url
										const queryString = params.toString()
										const updatedQueryString = new URLSearchParams(queryString)
										updatedQueryString.delete("status")
										router.push(`${pathname}${updatedQueryString && `?${updatedQueryString}`}`)
										setStatus("") // Clear the status message, which hides the message uI
									}}
									className={clsx(
										"inline-flex",
										"rounded-md",
										"bg-notification-50",
										"text-notification-500",
										"hover:text-notification-100",
										// bg-color
										// (statusMessage.type == "alert" ? "bg-yellow-50" : ""),
										// (statusMessage.type == "error" ? "bg-red-50" : ""),
										// (statusMessage.type == "success" ? "bg-green-50" : ""),
										// (statusMessage.type == "info" ? "bg-blue-50" : ""),
										"p-1.5",
										// text-color
										// (statusMessage.type == "alert" ? "text-yellow-500" : ""),
										// (statusMessage.type == "error" ? "text-red-500" : ""),
										// (statusMessage.type == "success" ? "text-green-500" : ""),
										// (statusMessage.type == "info" ? "text-blue-500" : ""),
										// hover:bg-color
										// (statusMessage.type == "alert" ? "hover:bg-yellow-100" : ""),
										// (statusMessage.type == "error" ? "hover:bg-red-100" : ""),
										// (statusMessage.type == "success" ? "hover:bg-green-100" : ""),
										// (statusMessage.type == "info" ? "hover:bg-blue-100" : ""),
										"focus-visible:ring-2",
										// focus-visible:ring-color
										(statusMessage.type == "alert" ? "focus-visible:ring-yellow-600" : ""),
										(statusMessage.type == "error" ? "focus-visible:ring-red-600" : ""),
										(statusMessage.type == "success" ? "focus-visible:ring-green-600" : ""),
										(statusMessage.type == "info" ? "focus-visible:ring-blue-600" : ""),
										"focus-visible:ring-offset-2",
										// focus-visible:ring-offset-color
										(statusMessage.type == "alert" ? "focus-visible:ring-offset-yellow-50" : ""),
										(statusMessage.type == "error" ? "focus-visible:ring-offset-red-50" : ""),
										(statusMessage.type == "success" ? "focus-visible:ring-offset-green-50" : ""),
										(statusMessage.type == "info" ? "focus-visible:ring-offset-blue-50" : ""),
										"focus-visible:outline-hidden",
										"dark:bg-transparent",
										// dark:text-color
										(statusMessage.type == "alert" ? "text-yellow-400" : ""),
										(statusMessage.type == "error" ? "text-red-400" : ""),
										(statusMessage.type == "success" ? "text-green-400" : ""),
										(statusMessage.type == "info" ? "text-blue-400" : ""),
										// dark:hover:bg-color
										(statusMessage.type == "alert" ? "dark:hover:bg-yellow-500/10" : ""),
										(statusMessage.type == "error" ? "dark:hover:bg-red-500/10" : ""),
										(statusMessage.type == "success" ? "dark:hover:bg-green-500/10" : ""),
										(statusMessage.type == "info" ? "dark:hover:bg-blue-500/10" : ""),
										// dark:focus-visible:ring-color
										(statusMessage.type == "alert" ? "dark:focus-visible:ring-yellow-500" : ""),
										(statusMessage.type == "error" ? "dark:focus-visible:ring-red-500" : ""),
										(statusMessage.type == "success" ? "dark:focus-visible:ring-green-500" : ""),
										(statusMessage.type == "info" ? "dark:focus-visible:ring-blue-500" : ""),
										"dark:focus-visible:ring-offset-1",
										// dark:focus-visible:ring-offset-color
										(statusMessage.type == "alert" ? "dark:focus-visible:ring-offset-yellow-900" : ""),
										(statusMessage.type == "error" ? "dark:focus-visible:ring-offset-red-900" : ""),
										(statusMessage.type == "success" ? "dark:focus-visible:ring-offset-green-900" : ""),
										(statusMessage.type == "info" ? "dark:focus-visible:ring-offset-blue-900" : ""),
									)}
								>
									<span className="sr-only">Dismiss</span>
									<Icon name="xmark" aria-hidden="true" className="size-5 pointer-events-none" />
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div >
	// Return empty layout if no message exists
	else return false
}

/**-----------------------------------
 * Custom Hook: `useChangeStatus()`
 * - Hooks MUST run while react is rendering a component (or inside another hook)
 * - Prefixing a function with `use` defines it as a custom hook in react
 * - `useGlobalContext()` is also a custom hook so it must be called inside another hook
 * - `useChangeStatus()` returns a plain function (a callback)
 */
export function useChangeStatus(
	type: keyof typeof notificationColors | "",
	message?: string,
	description?: string | React.ReactNode
) {
	// Get the setStatusMessage function from context
	const { setStatusMessage } = useGlobalContext()

	// Return a plain callback function
	return (
		type: StatusMessageType,
		message = "",
		description = ""
	) => {
		setStatusMessage({
			message: message,
			type: type,
			description: description
		})
	}

}