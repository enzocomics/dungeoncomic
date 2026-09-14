"use client"
import { AuthLayout } from "@/app/(auth)/_ui"
import LoginPageUI from "@/app/(auth)/login/_ui"
import RegisterPageUI from "@/app/(auth)/register/_ui"
import ResetPasswordPageUI from "@/app/(auth)/reset-password/_ui"
import { useGlobalContext } from "@/app/_context"
import { Dialog, DialogPanel } from "@headlessui/react"
import clsx from "clsx"
import { useRouter } from "next/navigation"
import { useRef } from "react"


export default function AuthModal() {
	// Get the authModal context
	const { authModal, setOpenAuthModal } = useGlobalContext()

	const router = useRouter()
	const modalRef = useRef<HTMLDivElement>(null)
	const backgroundRef = useRef<HTMLDivElement>(null)

	// Close the modal if user clicks anywhere outside of it
	const handleClick = (target: EventTarget) => {
		// Wait for the Animation to end before unmounting the modal
		const closeModal = (e: AnimationEvent) => {
			if (e.animationName !== "fade-out") return
			backgroundRef?.current?.removeEventListener("animationend", closeModal)
			backgroundRef?.current?.classList.add("hidden")
			// Unmount
			setOpenAuthModal(null)
		}

		// Check if the click target is NOT the modal OR a descendant of it
		if (target !== modalRef.current && !modalRef.current?.contains(target as Node)) {
			backgroundRef?.current?.classList.remove("animate-fade-in")
			backgroundRef?.current?.classList.add("animate-fade-out")
			backgroundRef?.current?.addEventListener("animationend", closeModal)

			// setOpenAuthModal(null)
		}
	}

	// RENDER
	if (authModal) {
		return <div
			ref={backgroundRef}
			onClick={(e) => handleClick(e.target)}
			className={clsx(
				"fixed",
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
				ref={modalRef}
				onClick={(e) => handleClick(e.target)}
				className={clsx(
					"pointer-events-auto",
					"absolute",
					"z-60",
				)}>
				<AuthLayout>
					{authModal == "login" &&
						<LoginPageUI />
					}
					{authModal == "register" &&
						<RegisterPageUI />
					}

					{authModal == "reset-password" &&
						<ResetPasswordPageUI />
					}
				</AuthLayout>
			</div>
		</div >
	}
}