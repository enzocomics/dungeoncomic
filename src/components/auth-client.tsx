"use client"
import Link from "next/link"
import { ComponentPropsWithoutRef } from "react"
import { AuthModalSchema, useGlobalContext } from "@/app/_context"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

export function LogoutButton({
	...props
}: ComponentPropsWithoutRef<"button">) {
	const router = useRouter()
	const pathname = usePathname()
	const searchParams = useSearchParams()

	function handleLogout() {
		const queryString = searchParams.toString()

		const referralPath = queryString
			? `${pathname}?${queryString}`
			: pathname

		const logoutParams = new URLSearchParams({
			r: referralPath
		})

		router.push(`/logout?${logoutParams.toString()}`)
	}

	return <button
		{...props}
		onClick={(e) => {
			handleLogout()
			props.onClick?.(e)
		}}
	>
		{props.children}
	</button>
}
