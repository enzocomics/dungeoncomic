/**----------------------------------- */
import clsx from "clsx"
import * as Headless from "@headlessui/react"
import { forwardRef } from "react"


/**----------------------------------- 
 * A reusable styled textarea component
 */
export const Textarea = forwardRef(function Textarea({
	className,
	onChange,
	...props
}: {
	className?: string
}
	// & defines a union type: it must satisfy all conditions
	& Omit<Headless.TextareaProps, "className">, // Omit the classname from the headless component since we are using our own version
	ref: React.ForwardedRef<HTMLTextAreaElement> // Forwarded ref points to an HTMLTextarea Element
) {


	function handleTextarea(e: React.ChangeEvent<HTMLTextAreaElement>) {
		const textarea = e.target

		// Reset height first so it cqn shrink when text is deleted
		textarea.style.height = "auto"

		// Expand the height to fit the content
		textarea.style.height = `${textarea.scrollHeight + 4}px`
	}

	// RENDER
	return (
		<Headless.Textarea
			{...props}
			ref={ref}
			rows={1}
			className={clsx(
				className,
				// SPACING & SIZE
				"p-2",
				"w-full",
				// APPEARANCE
				"rounded",
				"border-2",
				"border-neutral-200",
				"dark:border-white",
				"bg-white",
				"text-black",
				// TEXT
				"font-platform-mono",
				"text-base",
				"resize-none",
				// Outline
				"outline-transparent",
				"focus:outline-4",
				"focus:-outline-offset-4",
				"focus:outline-comic-accent-500",
				props.disabled == true ? [
					"cursor-not-allowed",
				] : [

				]
			)}
			onChange={(e) => {
				handleTextarea(e)
				onChange?.(e)
			}}
		/>
	)
})