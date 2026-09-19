"use client"
import { AuthLayout } from "@/app/(auth)/_ui"
import LoginPageUI from "@/app/(auth)/login/_ui"
import RegisterPageUI from "@/app/(auth)/register/_ui"
import ResetPasswordPageUI from "@/app/(auth)/reset-password/_ui"
import { useGlobalContext } from "@/app/_context"
import Icon from "@/styles/icons"
import clsx from "clsx"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { useEffect, useLayoutEffect, useRef, useState } from "react"


export default function AuthModal({
	public_registration = false
}: { public_registration?: Boolean }
) {
	const t = useTranslations()
	// Get the authModal context
	const { authModal, setOpenAuthModal } = useGlobalContext()
	const [clicked, setClicked] = useState<boolean>(false)
	const [clickTarget, setClickedTarget] = useState<EventTarget | null>(null)
	const [clickedClose, setClickedClose] = useState<boolean>(false)

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

	useEffect(() => {
		if (clicked == true) {

			// Check if the click target is NOT the modal OR a descendant of it
			if (
				clickTarget !== modalRef.current // if the click is NOT the modal
				&& !modalRef.current?.contains(clickTarget as Node) // if the click target is NOT a descendant of the modal ref
				&& !(clickTarget as HTMLElement)?.hasAttribute("data-authlink") // if the click target is NOT an auth link
			) {
				backgroundRef?.current?.classList.remove("animate-fade-in")
				backgroundRef?.current?.classList.add("animate-fade-out")
				backgroundRef?.current?.addEventListener("animationend", closeModal)

			}
			// Reset clicked & click target for the next event
			setClickedClose(false)
			setClickedTarget(null)
			setClicked(false)
		}
	}, [authModal, clicked])


	const ModalClose = () => {
		return <button
			onClick={() => setClickedClose(true)}
			className={clsx(
				"absolute",
				"cursor-pointer",
				// "top-[calc(50%-300px)]",
				"top-1",
				"right-1",
				"p-2",
				"rounded-lg",
				"bg-red-500",
				"dark:bg-red-700",
				"text-white",
				"hover:duration-0",
				"hover:bg-red-700",
				"dark:hover:bg-red-900",
				"active:translate-px",
				"ease-in-out",
				"transition-all",
				"duration-300",
			)}>
			<span className="sr-only">{t("navigation.close-modal-window")}</span>
			<Icon name="xmark" className={clsx(
				"size-5",
			)} />
		</button>
	}

	// RENDER
	if (authModal) {
		return <div
			ref={backgroundRef}
			onClick={(e) => {
				setClicked(true)
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
				}}
				className={clsx(
					"pointer-events-none",
					"absolute",
					"z-60",
					"overflow-auto",
					// "w-screen",
					// "h-screen",
					// "sm:w-auto",
					// "sm:h-auto",
				)}>
				<AuthLayout
					className={clsx(
						"pointer-events-auto",
						"relative",
						"mx-auto",
						// "max-w-125",
					)}
					ref={modalRef}
					isModal={true}
				>
					<ModalClose />
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