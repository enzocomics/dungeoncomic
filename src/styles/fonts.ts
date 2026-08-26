/** ------------------------------------------------ **/
import { NextFontWithVariable } from "next/dist/compiled/@next/font"
import {
	Atkinson_Hyperlegible,
	Bebas_Neue,
	Chicle,
	Caesar_Dressing,
	Comic_Neue,
	Germania_One,
	Great_Vibes,
	Inter,
	Lexend,
	Lora,
	Manufacturing_Consent,
	Montserrat,
	Press_Start_2P,
	Sancreek,
	Uncial_Antiqua,
} from "next/font/google"

/** ------------------------------------------------ **/

const copyFonts = [
	// sans serif
	"Inter",
	// serif
	"Lora",
	// comic sans
	"Comic_Neue",
	// accessible
	// "Atkinson_Hyperlegible",
	"Lexend",
]

const displayFonts = [
	// same as copy
	"Inter",
	"Lexend",
	"Lora",
	"Comic_Neue",
	// sans serif
	"Montserrat",
	"Bebas_Neue",
	// theme-specific
	// "Chicle", // Fun
	"Great_Vibes", // Calligraphic
	"Uncial_Antiqua", // Medieval
	"Sancreek", // Western
	"Caesar_Dressing", // Greek
	"Press_Start_2P", // Video game
	"Manufacturing_Consent", // Blackletter
	// accessible
	// "Atkinson_Hyperlegible",
	"Lexend",
]

export const atkinsonHyperlegible = Atkinson_Hyperlegible({
	subsets: ["latin", "latin-ext"],
	weight: ["400", "700"],
	style: ["normal", "italic"],
	display: "swap",
	variable: "--font-atkinson-hyperlegible",
	fallback: ["sans-serif"],
})

export const bebasNeue = Bebas_Neue({
	subsets: ["latin", "latin-ext"],
	weight: ["400"],
	style: ["normal"],
	display: "swap",
	variable: "--font-bebas-neue",
	fallback: ["sans-serif"],
})

export const chicle = Chicle({
	subsets: ["latin", "latin-ext"],
	weight: ["400"],
	style: ["normal"],
	display: "swap",
	variable: "--font-chicle",
	fallback: ["fantasy"],
})

export const caesarDressing = Caesar_Dressing({
	subsets: ["latin"],
	weight: ["400"],
	style: ["normal"],
	display: "swap",
	variable: "--font-caesar-dressing",
	fallback: ["fantasy"],
})

export const comicNeue = Comic_Neue({
	subsets: ["latin"],
	weight: ["400", "700"],
	style: ["normal", "italic"],
	display: "swap",
	variable: "--font-comic-neue",
	fallback: ["sans-serif"],
})

export const germaniaOne = Germania_One({
	subsets: ["latin"],
	weight: "400",
	style: ["normal"],
	display: "swap",
	variable: "--font-germania-one",
	fallback: ["fantasy"],
})

export const greatVibes = Great_Vibes({
	subsets: ["latin", "latin-ext"],
	weight: "400",
	style: ["normal"],
	display: "swap",
	variable: "--font-great-vibes",
	fallback: ["cursive"],
})

export const inter = Inter({
	subsets: ["latin", "latin-ext"],
	weight: "variable",
	style: ["normal"],
	display: "swap",
	variable: "--font-inter",
	fallback: ["sans-serif"],
})

export const lexend = Lexend({
	subsets: ["latin", "latin-ext"],
	weight: "variable",
	style: ["normal"],
	display: "swap",
	variable: "--font-lexend",
	fallback: ["sans-serif"],
})

export const lora = Lora({
	subsets: ["latin", "latin-ext"],
	weight: "variable",
	style: ["normal", "italic"],
	display: "swap",
	variable: "--font-lora",
	fallback: ["serif"],
})

export const manufacturingConsent = Manufacturing_Consent({
	subsets: ["latin", "latin-ext"],
	weight: ["400"],
	style: ["normal"],
	display: "swap",
	variable: "--font-manufacturing-consent",
	fallback: ["cursive"],
})

export const montserrat = Montserrat({
	subsets: ["latin", "latin-ext"],
	weight: "variable",
	style: ["normal", "italic"],
	display: "swap",
	variable: "--font-montserrat",
	fallback: ["sans-serif"],
})

export const pressStart2P = Press_Start_2P({
	subsets: ["latin", "latin-ext"],
	weight: ["400"],
	style: ["normal"],
	display: "swap",
	variable: "--font-press-start-2p",
	fallback: ["sans-serif"],
})

export const sancreek = Sancreek({
	subsets: ["latin", "latin-ext"],
	weight: ["400"],
	style: ["normal"],
	display: "swap",
	variable: "--font-sancreek",
	fallback: ["serif"],
})

export const uncialAntiqua = Uncial_Antiqua({
	subsets: ["latin", "latin-ext"],
	weight: ["400"],
	style: ["normal"],
	display: "swap",
	variable: "--font-uncial-antiqua",
	fallback: ["serif"],
})

export const fonts = [
	{
		name: "Atkinson Hyperlegible",
		key: "Atkinson_Hyperlegible",
		font: atkinsonHyperlegible,
		copy: true,
		display: true,
	},
	{
		name: "Bebas Neue",
		key: "Bebas_Neue",
		font: bebasNeue,
		copy: false,
		display: true,
	},
	{
		name: "Chicle",
		key: "Chicle",
		font: chicle,
		copy: false,
		display: true,
	},
	{
		name: "Caesar Dressing",
		key: "Caesar_Dressing",
		font: caesarDressing,
		copy: false,
		display: true,
	},
	{
		name: "Comic Neue",
		key: "Comic_Neue",
		font: comicNeue,
		copy: false,
		display: true,
	},
	{
		name: "Germania One",
		key: "Germania_One",
		font: germaniaOne,
		copy: false,
		display: true,
	},
	{
		name: "Great Vibes",
		key: "Great_Vibes",
		font: greatVibes,
		copy: false,
		display: true,
	},
	{
		name: "Inter",
		key: "Inter",
		font: inter,
		copy: false,
		display: true,
	},
	{
		name: "Lexend",
		key: "Lexend",
		font: lexend,
		copy: false,
		display: true,
	},
	{
		name: "Lora",
		key: "Lora",
		font: lora,
		copy: false,
		display: true,
	},
	{
		name: "Manufacturing Consent",
		key: "Manufacturing_Consent",
		font: manufacturingConsent,
		copy: false,
		display: true,
	},
	{
		name: "Montserrat",
		key: "Montserrat",
		font: montserrat,
		copy: false,
		display: true,
	},
	{
		name: "Press Start 2P",
		key: "Press_Start_2P",
		font: pressStart2P,
		copy: false,
		display: true,
	},
	{
		name: "Sancreek",
		key: "Sancreek",
		font: sancreek,
		copy: false,
		display: true,
	},
	{
		name: "Uncial Antiqua",
		key: "Uncial_Antiqua",
		font: uncialAntiqua,
		copy: false,
		display: true,
	},
]
/** ------------------------------------------------ **
 * Webfont Variables
 ** ------------------------------------------------ **/

// const display: NextFontWithVariable = Germania_One({
// 	weight: "400",
// 	style: "normal",
// 	display: "swap",
// 	variable: "--font-display",
// })

// const copy: NextFontWithVariable = Inter({
// 	style: ["normal"],
// 	subsets: ["latin", "latin-ext"],
// 	display: "swap",
// 	variable: "--font-copy",
// })

// export { copy, display }
