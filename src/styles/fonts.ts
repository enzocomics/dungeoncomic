/** ------------------------------------------------ **/
import {
	Atkinson_Hyperlegible,
	Bebas_Neue,
	Chicle,
	Caesar_Dressing,
	Comic_Neue,
	Germania_One,
	Google_Sans_Code,
	Great_Vibes,
	Inter,
	Lexend,
	Lora,
	Manufacturing_Consent,
	Montserrat,
	Press_Start_2P,
	Roboto_Mono,
	Sancreek,
	Uncial_Antiqua,
} from "next/font/google"

/** ------------------------------------------------ **/

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

export const googleSansCode = Google_Sans_Code({
	subsets: ["latin", "latin-ext"],
	weight: "400",
	style: ["normal"],
	display: "swap",
	variable: "--font-google-sans-code",
	fallback: ["mono"],
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

export const robotoMono = Roboto_Mono({
	subsets: ["latin", "latin-ext"],
	weight: ["400"],
	style: ["normal"],
	display: "swap",
	variable: "--font-roboto-mono",
	fallback: ["mono"],
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

export const fonts = {
	Atkinson_Hyperlegible: {
		name: "Atkinson Hyperlegible",
		slug: "atkinson-hyperlegible",
		font: atkinsonHyperlegible,
		copy: true,
		display: true,
		mono: false,
	},
	Bebas_Neue: {
		name: "Bebas Neue",
		slug: "bebas-neue",
		font: bebasNeue,
		copy: false,
		display: true,
		mono: false,
	},
	Chicle: {
		name: "Chicle",
		slug: "chicle",
		font: chicle,
		copy: false,
		display: true,
		mono: false,
	},
	Caesar_Dressing: {
		name: "Caesar Dressing",
		slug: "caesar-dressing",
		font: caesarDressing,
		copy: false,
		display: true,
		mono: false,
	},
	Comic_Neue: {
		name: "Comic Neue",
		slug: "comic-neue",
		font: comicNeue,
		copy: true,
		display: true,
		mono: false,
	},
	Germania_One: {
		name: "Germania One",
		slug: "germania-one",
		font: germaniaOne,
		copy: false,
		display: true,
		mono: false,
	},
	Google_Sans_Code: {
		name: "Google Sans Code",
		slug: "google-sans-code",
		font: googleSansCode,
		copy: true,
		display: false,
		mono: true,
	},
	Great_Vibes: {
		name: "Great Vibes",
		slug: "great-vibes",
		font: greatVibes,
		copy: false,
		display: true,
		mono: false,
	},
	Inter: {
		name: "Inter",
		slug: "inter",
		font: inter,
		copy: true,
		display: true,
		mono: false,
	},
	Lexend: {
		name: "Lexend",
		slug: "lexend",
		font: lexend,
		copy: true,
		display: true,
		mono: false,
	},
	Lora: {
		name: "Lora",
		slug: "lora",
		font: lora,
		copy: true,
		display: true,
		mono: false,
	},
	Manufacturing_Consent: {
		name: "Manufacturing Consent",
		slug: "manufacturing-consent",
		font: manufacturingConsent,
		copy: false,
		display: true,
		mono: false,
	},
	Montserrat: {
		name: "Montserrat",
		slug: "montserrat",
		font: montserrat,
		copy: true,
		display: true,
		mono: false,
	},
	Press_Start_2P: {
		name: "Press Start 2P",
		slug: "press-start-2p",
		font: pressStart2P,
		copy: true,
		display: true,
		mono: false,
	},
	Roboto_Mono: {
		name: "Roboto Mono",
		slug: "roboto-mono",
		font: robotoMono,
		copy: true,
		display: false,
		mono: true,
	},
	Sancreek: {
		name: "Sancreek",
		slug: "sancreek",
		font: sancreek,
		copy: false,
		display: true,
		mono: false,
	},
	Uncial_Antiqua: {
		name: "Uncial Antiqua",
		slug: "uncial-antiqua",
		font: uncialAntiqua,
		copy: false,
		display: true,
		mono: false,
	},
}

/** ------------------------------------------------ **
 * Make lists of the copy fonts and display fonts
 ** ------------------------------------------------ **/
export const copyFonts = Object.fromEntries(
	Object.entries(fonts).filter(([key, font]) => font.copy === true),
)

export const displayFonts = Object.fromEntries(
	Object.entries(fonts).filter(([key, font]) => font.display === true),
)

export const monoFonts = Object.fromEntries(
	Object.entries(fonts).filter(([key, font]) => font.mono === true),
)
