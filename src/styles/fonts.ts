/** ------------------------------------------------ **/
import { NextFontWithVariable } from "next/dist/compiled/@next/font"
import { Germania_One, Noto_Sans, Inter } from "next/font/google"

/** ------------------------------------------------ **
 * Webfont Variables
 ** ------------------------------------------------ **/

const display: NextFontWithVariable = Germania_One({
	weight: "400",
	style: "normal",
	display: "swap",
	variable: "--font-display",
})

const copy: NextFontWithVariable = Inter({
	style: ["normal"],
	subsets: ["latin", "latin-ext"],
	display: "swap",
	variable: "--font-copy",
})

/** ------------------------------------------------ **/
export { copy, display }
