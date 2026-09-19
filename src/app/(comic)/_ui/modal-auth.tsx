"use client"
import { AuthLayout } from "@/app/(auth)/_ui"
import LoginPageUI from "@/app/(auth)/login/_ui"
import RegisterPageUI from "@/app/(auth)/register/_ui"
import ResetPasswordPageUI from "@/app/(auth)/reset-password/_ui"
import { useGlobalContext } from "@/app/_context"
import clsx from "clsx"
import { useRouter } from "next/navigation"
import { useEffect, useLayoutEffect, useRef, useState } from "react"


export default function AuthModal({
	public_registration = false
}: { public_registration?: Boolean }
) {
	// Get the authModal context
	const { authModal, setOpenAuthModal } = useGlobalContext()
	const [clicked, setClicked] = useState<boolean>(false)
	const [clickTarget, setClickedTarget] = useState<EventTarget | null>(null)

	const router = useRouter()
	const modalRef = useRef<HTMLDivElement>(null)
	const backgroundRef = useRef<HTMLDivElement>(null)

	// Wait for the Animation to end before unmounting the modal
	const closeModal = (e: AnimationEvent) => {
		if (e.animationName !== "fade-out") return
		backgroundRef?.current?.removeEventListener("animationend", closeModal)
		backgroundRef?.current?.classList.add("hidden")
		// Unmount
		setOpenAuthModal(null)
	}

	// TODO: The ref is not loaded on render. it takes TWO clicks to close
	// TODO: Make sure it's click-closable and also the modal is scrollable if it is too tall
	// TODO: Closebutton
	// Close the modal if user clicks anywhere outside of it
	const handleClick = (target: EventTarget) => {
		// if (clicked == true) {
		// 	// Check if the click target is NOT the modal OR a descendant of it
		// 	if (
		// 		target !== modalRef.current // if the click is outside
		// 		&& !modalRef.current?.contains(target as Node)
		// 	) {
		// 		// console.log(modalRef.current)
		// 		backgroundRef?.current?.classList.remove("animate-fade-in")
		// 		backgroundRef?.current?.classList.add("animate-fade-out")
		// 		backgroundRef?.current?.addEventListener("animationend", closeModal)

		// 	}
		// 	// setClicked(false)
		// }
		// setClicked(false)
	}

	// Close the modal if the escape key is pressed
	const handleKeyDown = (event: KeyboardEvent) => {
		if (event.key === "Escape") {
			backgroundRef?.current?.classList.remove("animate-fade-in")
			backgroundRef?.current?.classList.add("animate-fade-out")
			backgroundRef?.current?.addEventListener("animationend", closeModal)
		}
	}

	useEffect(() => {
		// Add a listener for keypresses
		document.addEventListener("keydown", handleKeyDown)
	}, [])

	useLayoutEffect(() => {
		if (clicked == true) {
			// Check if the click target is NOT the modal OR a descendant of it
			if (
				clickTarget !== modalRef.current // if the click is outside
				&& !modalRef.current?.contains(clickTarget as Node)
			) {
				// console.log(modalRef.current)
				backgroundRef?.current?.classList.remove("animate-fade-in")
				backgroundRef?.current?.classList.add("animate-fade-out")
				backgroundRef?.current?.addEventListener("animationend", closeModal)

			}
			// Reset clicked & click target for the next event
			setClickedTarget(null)
			setClicked(false)
		}
	}, [authModal, clicked])


	// RENDER
	if (authModal) {
		return <div
			ref={backgroundRef}
			onClick={(e) => {
				setClicked(true)
				handleClick(e.target)
			}}
			className={clsx(
				"fixed",
				"left-0",
				"top-0",
				"z-55",
				"w-screen",
				"h-screen",
				"bg-neutral-100/50",
				"dark:bg-neutral-900/80",
				"backdrop-blur-sm",
				"pointer-events-auto",
				"flex",
				"place-content-center",
				"items-center",
				"animate-fade-in",
			)}
		>
			<div
				role="dialog"
				aria-modal="true"
				onClick={(e) => {
					setClickedTarget(e.target)
					handleClick(e.target)
				}}
				className={clsx(
					"pointer-events-none",
					"absolute",
					"z-60",
					"overflow-auto",
					"w-screen",
					"h-screen",
					"sm:w-auto",
					"sm:h-auto",
				)}>
				<AuthLayout
					className={clsx(
						"pointer-events-auto",
					)}
					ref={modalRef}
					isModal={true}>
					{authModal == "login" &&
						<LoginPageUI isModal={true} />
					}
					{authModal == "register" &&
						<RegisterPageUI
							isModal={true}
							public_registration={public_registration}
						/>
					}

					{authModal == "reset-password" &&
						<ResetPasswordPageUI isModal={true} />
					}
				</AuthLayout>
			</div>
		</div >
	} else {
		return null
	}
}