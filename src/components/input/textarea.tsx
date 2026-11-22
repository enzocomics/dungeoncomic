"use client"
/**----------------------------------- */
import clsx from "clsx"
import * as Headless from "@headlessui/react"
import { forwardRef, useEffect, useLayoutEffect, useRef, useState } from "react"


/**----------------------------------- 
 * A reusable styled textarea component
 */
export const Textarea = forwardRef(function Textarea({
	className,
	lengthChecker,
	onChange,
	...props
}: {
	className?: string
	lengthChecker?: boolean
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

	const [inputLength, setInputLength] = useState((props.defaultValue as string | undefined)?.length ?? 0)

	const maxLength = props.maxLength || 64
	// RENDER
	return <>

		{/* Length Checker */}
		{lengthChecker &&
			<span className={clsx(
				"absolute",
				"top-2",
				"right-0",
				"ml-auto",
				"font-comic-labels",
				"font-normal",
				"text-xs",
				"text-current/50"
			)}>
				{`${inputLength}/${maxLength}`}{/* TODO: should this be hardcoded? */}
			</span>
		}
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
				"mt-3",
				"mb-3",
				"px-4",
				"py-2",
				"w-full",
				// APPEARANCE
				"rounded",
				"border-2",
				// Colors
				"bg-white",
				"border-neutral-200",
				"text-neutral-900",
				"dark:border-white/10",
				"dark:bg-white/5",
				"dark:text-white",
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
				setInputLength(e.target.value.length)
				handleTextarea(e.target)
				onChange?.(e)
			}}
		/>
	</>
})