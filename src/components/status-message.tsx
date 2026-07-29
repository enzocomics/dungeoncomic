"use client"
/**----------------------------------- */
// TYPES
export type StatusMessageType = "alert" | "error" | "success" | "info" | ""
// LIBRARIES
import { CheckCircleIcon, ExclamationTriangleIcon, InformationCircleIcon, XCircleIcon, XMarkIcon } from "@heroicons/react/20/solid"
// FUNCTIONS
import clsx from "clsx"
// UI
import { useGlobalContext } from "@/app/(main)/_context"

/**-----------------------------------
 * Status Message UI
 */
export default function StatusMessage() {
	// STATUS MESSAGE CONTEXT
	const { statusMessage } = useGlobalContext()
	switch (statusMessage.type) {
		case "alert":
			break
		case "error":
			break
		case "info":
			break
		case "success":
			break
	}

	// OUTPUT
	if (statusMessage.message !== "")
		return <div className={clsx(
			"m-4",
			"p-4",
			"rounded-md",
			"dark:outline",
			// background-color
			(statusMessage.type == "alert" ? "bg-yellow-50" : ""),
			(statusMessage.type == "error" ? "bg-red-50" : ""),
			(statusMessage.type == "success" ? "bg-green-50" : ""),
			(statusMessage.type == "info" ? "bg-blue-50" : ""),
			// dark: background-color
			(statusMessage.type == "alert" ? "dark:bg-yellow-500/10" : ""),
			(statusMessage.type == "error" ? "dark:bg-red-500/15" : ""),
			(statusMessage.type == "success" ? "dark:bg-green-500/10" : ""),
			(statusMessage.type == "info" ? "dark:bg-blue-500/10" : ""),
			// dark: outline-color
			(statusMessage.type == "alert" ? "dark:outline-yellow-500/15" : ""),
			(statusMessage.type == "error" ? "dark:outline-red-500/25" : ""),
			(statusMessage.type == "success" ? "dark:outline-green-500/20" : ""),
			(statusMessage.type == "info" ? "dark:outline-blue-500/20" : ""),
		)}>
			<div className="flex">
				<div className="shrink-0">
					{statusMessage.type == "alert" &&
						<ExclamationTriangleIcon aria-hidden="true" className="size-5 text-yellow-400 dark:text-yellow-300" />
					}
					{statusMessage.type == "error" &&
						<XCircleIcon aria-hidden="true" className="size-5 text-red-400" />
					}
					{statusMessage.type == "success" &&
						<CheckCircleIcon aria-hidden="true" className="size-5 text-green-400" />
					}
					{statusMessage.type == "info" &&
						<InformationCircleIcon aria-hidden="true" className="size-5 text-blue-400" />
					}
				</div>
				<div className={clsx(
					"ml-3",
					"flex-1",
					"md:flex",
					"md:justify-between"
				)}>
					<p className={clsx(
						"text-sm",
						"font-medium",
						// text-color
						(statusMessage.type == "alert" ? "text-yellow-700" : ""),
						(statusMessage.type == "error" ? "text-red-700" : ""),
						(statusMessage.type == "success" ? "text-green-700" : ""),
						(statusMessage.type == "info" ? "text-blue-700" : ""),
						// dark: text-color
						(statusMessage.type == "alert" ? "dark:text-yellow-100/80" : ""),
						(statusMessage.type == "error" ? "dark:text-red-200/80" : ""),
						(statusMessage.type == "success" ? "dark:text-green-200/85" : ""),
						(statusMessage.type == "info" ? "dark:text-blue-300" : ""),
					)}>
						{statusMessage.message}
					</p>
				</div>
				<div className="ml-auto pl-3">
					<div className="-mx-1.5 -my-1.5">
						<button
							type="button"
							className={clsx(
								"inline-flex",
								"rounded-md",
								"bg-green-50",
								// bg-color
								(statusMessage.type == "alert" ? "bg-yellow-50" : ""),
								(statusMessage.type == "error" ? "bg-red-50" : ""),
								(statusMessage.type == "success" ? "bg-green-50" : ""),
								(statusMessage.type == "info" ? "bg-blue-50" : ""),
								"p-1.5",
								// text-color
								(statusMessage.type == "alert" ? "text-yellow-500" : ""),
								(statusMessage.type == "error" ? "text-red-500" : ""),
								(statusMessage.type == "success" ? "text-green-500" : ""),
								(statusMessage.type == "info" ? "text-blue-500" : ""),
								// hover:bg-color
								(statusMessage.type == "alert" ? "hover:bg-yellow-100" : ""),
								(statusMessage.type == "error" ? "hover:bg-red-100" : ""),
								(statusMessage.type == "success" ? "hover:bg-green-100" : ""),
								(statusMessage.type == "info" ? "hover:bg-blue-100" : ""),
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
							<XMarkIcon aria-hidden="true" className="size-5" />
						</button>
					</div>
				</div>
			</div>
		</div >
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
	message: string,
	type: StatusMessageType
) {
	// Get the setStatusMessage function from context
	const { setStatusMessage } = useGlobalContext()

	// Return a plain callback function
	return (
		message = "",
		type: StatusMessageType = "info"
	) => {
		setStatusMessage({ message: message, type: type })
	}

}