"use client"
/**----------------------------------- */
import clsx from "clsx"
import * as Headless from "@headlessui/react"
import { forwardRef, useEffect, useLayoutEffect, useRef } from "react"


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
	// Create an internal ref that is separate from the forwarded ref
	const internalRef = useRef<HTMLTextAreaElement>(null)

	function handleTextarea(textarea: HTMLTextAreaElement) {

		// Reset height first so it cqn shrink when text is deleted
		textarea.style.height = "auto"

		// Expand the height to fit the content
		textarea.style.height = `${textarea.scrollHeight + 4}px`
	}

	// We want to call the handleTextArea function once when the component is mounted
	useLayoutEffect(() => {
		if (internalRef.current) handleTextarea(internalRef.current)
	}, [props.value, props.defaultValue])

	// RENDER
	return (
		<Headless.Textarea
			{...props}
			ref={
				// Give the textarea a callback ref. React calls the function when this element is mounted, passing the DOM element as `node`
				(node) => {
					// Tell typescript to treat the node as an HTMLTextAreaElement, or null. This is necessary because HeadlessUI types the node as HTMLElement and we need more specificity
					const textarea = node as HTMLTextAreaElement | null

					// Store the textarea in the component's internalref
					internalRef.current = textarea

					// If the ref is a forwarded ref as noted by its callback function, pass the textarea (or null)
					if (typeof ref === "function") {
						ref(textarea)
						// If the ref is just a refobject, assign the textarea to current
					} else if (ref) {
						ref.current = textarea
					}
				}}
			rows={props.rows || 1}
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
				"focus:outline-platform-accent-500",
				props.disabled == true ? [
					"cursor-not-allowed",
				] : [

				]
			)}
			onChange={(e) => {
				handleTextarea(e.target)
				onChange?.(e)
			}}
		/>
	)
})