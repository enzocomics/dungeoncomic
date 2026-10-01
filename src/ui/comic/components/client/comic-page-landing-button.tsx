"use client"

import { ComicButton } from "@/components/button"
import clsx from "clsx"
import { usePathname } from "next/navigation"
import { ComponentPropsWithoutRef } from "react"

export const ClientComicPageLandingButton = (
	props: ComponentPropsWithoutRef<typeof ComicButton>
) => {
	// HOOKS
	const pathname = usePathname()
	const path = pathname.endsWith("/") ? pathname : `${pathname}/`


	return <div className={clsx(
		"px-6",
		"mx-auto",
		"w-full",
		"max-w-2xl"
	)}>
		<ComicButton as="link" href={`${path}1`}>
			{props.children}
		</ComicButton>
	</div>
}