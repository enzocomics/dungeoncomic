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
import { ComponentPropsWithoutRef, useEffect, useRef, useState } from "react"
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
	const containerRef = useRef<HTMLDivElement>(null)
	const setStatus = useChangeStatus("")

	const [closeClicked, setCloseClicked] = useState(false)

	const handleClose = () => {
		setCloseClicked(true)
	}

	useEffect(() => {

		// This function runs after the animation ends
		const hideStatus = () => {
			// Clear the search params from the url
			const queryString = params.toString()
			const updatedQueryString = new URLSearchParams(queryString)
			updatedQueryString.delete("status")
			router.push(`${pathname}${updatedQueryString && `?${updatedQueryString}`}`)
			containerRef?.current?.removeEventListener("animationend", hideStatus)
			containerRef.current = null
			setStatus("") // Clear the status message, which hides the message 
			setCloseClicked(false)
		}

		// If the close button was clicked and the status exists
		if (closeClicked && containerRef.current) {
			containerRef.current.classList.remove("animate-expand")
			containerRef.current.classList.add("[grid-template-rows-1]")
			containerRef.current.classList.add("animate-contract")
			containerRef.current.addEventListener("animationend", hideStatus)

		}
	}, [closeClicked])

	// OUTPUT
	// Only display the layout if a message exists
	if (statusMessage.message !== "")
		return <div
			id={`status-${statusMessage.type}`}
			ref={containerRef}
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
				"peer",
				"sticky",
				"top-0",
				"grid",
				"animate-expand",
				className
			)}>
			<div className={clsx(
				"min-h-0",
				"overflow-hidden",
				"bg-notification-800/50",
			)}>
				<div className={clsx(
					"md:p-1",
					"md:px-6",
					"max-w-6xl",
					"mx-auto",
					"transition-all",
					"ease-in-out",
					"duration-300",
				)}>
					<div className={clsx(
						"relative",
						"h-full",
						"mx-auto",
						"flex",
						"p-4",
						"pr-10",
						"bg-notification-700",
						"md:rounded",
						"md:justify-center",
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
							"max-w-prose",
						)}>
							<h3 className={clsx(
								"text-sm",
								"text-pretty",
								"font-platform-labels",
								"font-semibold",
								"text-notification-100",

							)}>
								{statusMessage.message}
							</h3>
							{statusMessage.description &&
								<div className={clsx(
									"mt-2",
									"text-sm",
									"text-balance",
									"font-platform-labels",
									"text-notification-300",
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
						<div className="absolute right-3 ">
							<div className="-mx-1.5 -my-1.5">
								<button
									data-statusmessage={true}
									type="button"
									onClick={handleClose}
									className={clsx(
										"inline-flex",
										"rounded-md",
										// bg-color
										"p-1.5",
										"text-notification-100",
										"cursor-pointer",
										"hover:bg-notification-100/20",
										"focus:outline-3",
										"focus:outline-notification-100",
										"ease-in-out",
										"transition-all",
										"duration-300",
										"hover:duration-0",
										"active:translate-px",
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