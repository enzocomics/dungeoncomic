/**----------------------------------- */
import clsx from "clsx"
import * as Headless from "@headlessui/react"
import { forwardRef } from "react"

/**
 * A reusable styled textarea component
 */
export const Textarea = forwardRef(function Textarea({
	className,
	...props
}: {
	className?: string
}
	// & defines a union type: it must satisfy all conditions
	& Omit<Headless.TextareaProps, "className">, // Omit the classname from the headless component since we are using our own version
	ref: React.ForwardedRef<HTMLTextAreaElement> // Forwarded ref points to an HTMLTextarea Element
) {

	// RENDER
	return (
		<Headless.Textarea
			ref={ref}
			{...props}
			className={clsx(
				className,
				"bg-white",
				"text-black",
				"border-2",
				"border-neutral-200",
				"dark:border-white",
				"rounded",
				"w-full",
				"p-2",
				"font-mono",
				"font-base",
				"resize-none",
				"outline-none",

			)}
		/>
	)
})