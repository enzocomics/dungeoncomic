import React from "react"
import ComicContextProvider from "@/ui/comic/context"

export default async function Layout({
	children
}: {
	children: React.ReactNode
}) {
	return <>
		<ComicContextProvider>
			{children}
		</ComicContextProvider>
	</>
}