"use client"
export type StatusMessageType = "alert" | "error" | "success" | "info"
import { useGlobalContext } from "@/app/(main)/_context"

export default function StatusMessage() {
	const { statusMessage, setStatusMessage } = useGlobalContext()
	return <div className="rounded-md bg-blue-50 p-4 dark:bg-blue-500/10 dark:outline dark:outline-blue-500/20">
		<div className="flex">
			<div className="shrink-0">
				{/* <InformationCircleIcon aria-hidden="true" className="size-5 text-blue-400" /> */}
			</div>
			<div className="ml-3 flex-1 md:flex md:justify-between">
				<p className="text-sm text-blue-700 dark:text-blue-300">
					{statusMessage.message}
				</p>
				<p className="mt-3 text-sm md:mt-0 md:ml-6">
					<a
						href="#"
						className="font-medium whitespace-nowrap text-blue-700 hover:text-blue-600 dark:text-blue-300 dark:hover:text-blue-200"
					>
						Details
						<span aria-hidden="true"> &rarr;</span>
					</a>
				</p>
			</div>
		</div>
	</div>
}

/**-----------------------------------
 * Custom Hook: `useChangeStatus()`
 * - Hooks MUST run while react is rendering a component (or inside another hook)
 * - Prefixing a function with `use` defines it as a custom hook in react
 * - `useGlobalContext()` is also a custom hook so it must be called inside another hook
 * - `useChangeStatus()` returns a plain function (a callback)
 */
export function useChangeStatus(
	message: string = "",
	type: StatusMessageType = "info"
) {
	// Get the setStatusMessage function from context
	const { setStatusMessage } = useGlobalContext()

	// Return a plain callback function
	return (message = "") => {
		setStatusMessage({ message: message, type: "info" })
	}

}