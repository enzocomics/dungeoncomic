import { ComponentPropsWithoutRef, RefObject, Suspense, useEffect, useRef, useState } from "react"
import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems, useClose } from '@headlessui/react'

/** ---
 * Closes the disclosure panel when the user clicks outside of it.
 * 
 * Requires two refs from each Disclosure Instance:
 * - `<Disclosure>`
 * - `<DisclosurePanel>`
 */
export const DisclosureCloseHandler = ({
	buttonRef,
	panelRef
}: {
	buttonRef: RefObject<HTMLButtonElement | null>
	panelRef: RefObject<HTMLDivElement | null>
}) => {
	// HeadlessUI's native close hook
	let close = useClose()

	// Register the click
	useEffect(() => {
		window.onclick = (e) => {
			const panel = panelRef.current
			const button = buttonRef.current
			const target = e.target as Node

			if ( // Close the panel only on the following conditions:
				!button?.contains(target) // if the click is NOT the button
				&& !panel?.contains(target) // if the click is NOT inside the panel
				&& button && button.hasAttribute("data-open") // if the panel is already open
			)
				close()

		}
	}, [])
	return null
}