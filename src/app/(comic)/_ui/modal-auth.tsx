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

	// Close the modal if user clicks anywhere outside of it
	const handleClick = (target: EventTarget) => {
		// Check if the click target is NOT the modal OR a descendant of it
		if (target !== modalRef.current && !modalRef.current?.contains(target as Node)) {
			setOpenAuthModal(null)
		}
	}

	// RENDER
	if (authModal) {
		return <div
			onClick={(e) => handleClick(e.target)}
			className={clsx(
				"fixed",
				"top-0",
				"z-55",
				"w-screen",
				"h-screen",
				"bg-neutral-100/50",
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