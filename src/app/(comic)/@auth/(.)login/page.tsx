"use client"
import { Dialog, DialogPanel } from "@headlessui/react"
import clsx from "clsx"
import { useRouter } from "next/navigation"


export default function PageModal() {
	const router = useRouter()
	console.log("hi")
	return <div
		onClick={() => router.back()}
		className={clsx(
			"fixed",
			"top-0",
			"z-55",
			"w-screen",
			"h-screen",
			"bg-white/50",
			"pointer-events-auto",
			"flex",
			"place-content-center",
			"items-center",
		)}
	>
		<div className={clsx(
			"w-30",
			"h-30"
		)}>
			asdf
		</div>
	</div >
}