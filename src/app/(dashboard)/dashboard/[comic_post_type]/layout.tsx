import { getSettings } from "@/lib/directus/get-settings"
import Icon from "@/styles/icons"
import clsx from "clsx"
import Link from "next/link"
import { notFound } from "next/navigation"
import { PropsWithChildren } from "react"

export const instant = false

export default async function DashboardComicLayout({
	params,
	...props
}: {
	params: Promise<{
		comic_post_type: string,
	}>
} & PropsWithChildren) {

	const { comic_post_type } = await params
	const settings = await getSettings()

	// Make sure the url route matches the post type definition in the project settings
	if (settings.comic_type_name_slug == comic_post_type)
		return <>
			{props.children}
		</>
	else
		notFound()
}