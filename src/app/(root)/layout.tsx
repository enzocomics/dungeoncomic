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
		// Structure:
		// - `root`: comic homepage
		// - `root/[level1]`: comic single page / comic content page
		// - `root/[level1]/[level2]`: 404
		// - `root/[level1]/[level2]/[level3]`: 404
		case "single/single":
			return <>
				"mode: single/single"
				{props.children}
			</>
		/* ----------------------------------- */
		// Single Creator, Multiple Comics
		// - Comics live at first-level route: `dungeoncomic.com/comicname`
		// - Pages live at second-level nested route: `dungeoncomic.com/comicname/1`, `dungeoncomic.com/comicname/settings`
		// Structure:
		// - `root`: platform homepage
		// - `root/[level1]`: comic homepage / platform page
		// - `root/[level1]/[level2]`: comic single page / comic content page
		// - `root/[level1]/[level2]/[level3]`: 404
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
		// Structure:
		// - `root`: platform homepage
		// - `root/[level1]`: comic type prefix / platform page
		// - `root/[level1]/[level2]`: comic homepage
		// - `root/[level1]/[level2]/[level3]`: comic single page / comic content page
		case "multiple/multiple":
			return <>
				"mode: multiple/multiple"
				{props.children}
			</>
	}
}