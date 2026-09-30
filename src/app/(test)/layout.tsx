import { getSettings } from "@/lib/directus/get-settings"
import { PropsWithChildren } from "react"

export default async function ComicRootLayout(props: PropsWithChildren) {
	const settings = await getSettings()
	const routingMode = settings.routing_mode

	switch (routingMode) {
		/* ----------------------------------- */
		// Single Creator, Single Comic
		// - Comic lives at root: `dungeoncomic.com`
		// - Pages live at first-level route: `dungeoncomic.com/1`, `dungeoncomic.com/settings`
		case "single/single":
			return <>
				"mode: single/single"
				{props.children}
			</>
		/* ----------------------------------- */
		// Single Creator, Multiple Comics
		// - Comics live at first-level route: `dungeoncomic.com/comicname`
		// - Pages live at second-level nested route: `dungeoncomic.com/comicname/1`, `dungeoncomic.com/comicname/settings`
		case "single/multiple":
			return <>
				"mode: single/multiple"
				{props.children}
			</>
		/* ----------------------------------- */
		// Multiple Creators, Multiple Comics
		// - Comics live in a nested route with type prefix: `dungeoncomic.com/d/comicname`
		// - Pages live in a nested route with type & comic prefix: 
		//   `dungeoncomic.com/d/comicname/1`, `dungeoncomic.com/d/comicname/settings`
		// - Users live in a nested route with type prefix: `dungeoncomic.com/u/username`
		case "multiple/multiple":
			return <>
				"mode: multiple/multiple"
				{props.children}
			</>
	}
}