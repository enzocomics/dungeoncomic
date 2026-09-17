
import Link from "next/link"
import { ComponentPropsWithoutRef } from "react"
import { AuthModalSchema, useGlobalContext } from "@/app/_context"

/** ---
 * A reusable link to the login/register/reset-password pages.
 * - If a modal is currently active, it navigates within the modal
 * - If the modal is not currently active, it opens it up
 *
 */
export function AuthLink({
	isModal = false,
	modal,
	href = `/${modal}`,
	...props
}: Omit<ComponentPropsWithoutRef<typeof Link>, "href"> & {
	href?: string
	isModal?: boolean
	modal: AuthModalSchema
}) {

	// Get the authModal context
	const { authModal, setOpenAuthModal } = useGlobalContext()

	// Render
	return <Link
		{...props}
		href={href}
		onClick={(e) => {
			if (isModal) {
				e.preventDefault()
				setOpenAuthModal(modal)
			}
			props.onClick?.(e)
		}}
	>
		{props.children}
	</Link>
}