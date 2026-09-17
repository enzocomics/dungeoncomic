"use client"

// FUNCTION TYPES
import { verifySession } from "@/data/session"
import { getComic, getComicPage, getComicVariables } from "@/lib/directus/get-comics"
import { getSettings } from "@/lib/directus/get-settings"
import { createContext, PropsWithChildren, SetStateAction, useContext, useState } from "react"

/** ------------------------------------------------ **
 * COMIC CONTEXT PROVIDER
 * - Previous Comic Page
 ** ------------------------------------------------ **/
// STATE TYPES
type sessionSchema = Awaited<ReturnType<typeof verifySession>> | null
type projectSettingsSchema = Awaited<ReturnType<typeof getSettings>> | null
type comicSchema = Awaited<ReturnType<typeof getComic>> | null
type comicPageSchema = Awaited<ReturnType<typeof getComicPage>> | null
type comicVarsSchema = Awaited<ReturnType<typeof getComicVariables>> | null
type userVarsSchema = Record<string, string> | null

type ComicPreviousPageSchema = {
	pagenum?: number,
	params?: string,
}
type ComicPageHistorySchema = string[]

// CONTEXT TYPE
type ContextType = {

	session: sessionSchema,
	setSession: (session: SetStateAction<sessionSchema>) => void,
	projectSettings: projectSettingsSchema,
	setProjectSettings: (projectSettings: SetStateAction<projectSettingsSchema>) => void,
	comic: comicSchema,
	setComic: (comic: SetStateAction<comicSchema>) => void,
	comicPage: comicPageSchema,
	setComicPage: (comicPage: SetStateAction<comicPageSchema>) => void,
	comicVars: comicVarsSchema,
	setComicVars: (comicVars: SetStateAction<comicVarsSchema>) => void,
	userVars: userVarsSchema,
	setUserVars: (userVars: SetStateAction<userVarsSchema>) => void,

	comicPreviousPage: ComicPreviousPageSchema,
	setComicPreviousPage: (comicPreviousPage: SetStateAction<ComicPreviousPageSchema>) => void,
	comicPageHistory: ComicPageHistorySchema,
	setComicPageHistory: (comicPageHistory: SetStateAction<ComicPageHistorySchema>) => void
}

// Default Variables
const sessionDefault: sessionSchema = null
const projectSettingsDefault: projectSettingsSchema = null
const comicDefault: comicSchema = null
const comicPageDefault: comicPageSchema = null
const comicVarsDefault: comicVarsSchema = null
const userVarsDefault: userVarsSchema = null

const comicPreviousPageDefault: ComicPreviousPageSchema = {
	pagenum: undefined,
	params: undefined
}

const comicPageHistoryDefault: ComicPageHistorySchema = []


/** ------------------------------------------------ **/
// CONTEXT
export const ComicContext = createContext<ContextType | undefined>({
	session: sessionDefault,
	setSession: () => { },
	projectSettings: projectSettingsDefault,
	setProjectSettings: (projectSettings) => { },
	comic: comicDefault,
	setComic: (comic) => { },
	comicPage: comicPageDefault,
	setComicPage: (comicPage) => { },
	comicVars: comicVarsDefault,
	setComicVars: (comicVars) => { },
	userVars: userVarsDefault,
	setUserVars: (userVars) => { },

	comicPreviousPage: comicPreviousPageDefault,
	setComicPreviousPage: (comicPreviousPage) => { },
	comicPageHistory: comicPageHistoryDefault,
	setComicPageHistory: (comicPageHistory) => { },
})

// CONTEXT PROVIDER
export default function ComicContextProvider({
	getSession,
	getSettings,
	getComic,
	children
}: {
	getSession?: sessionSchema
	getSettings?: projectSettingsSchema
	getComic?: comicSchema
} & PropsWithChildren<{}>) {
	const [session, setSession] = useState(getSession || sessionDefault)
	const [projectSettings, setProjectSettings] = useState(getSettings || projectSettingsDefault)
	const [comic, setComic] = useState(getComic || comicDefault)
	const [comicPage, setComicPage] = useState(comicPageDefault)
	const [comicVars, setComicVars] = useState(comicVarsDefault)
	const [userVars, setUserVars] = useState(userVarsDefault)
	const [comicPreviousPage, setComicPreviousPage] = useState(comicPreviousPageDefault)
	const [comicPageHistory, setComicPageHistory] = useState(comicPageHistoryDefault)

	// OUTPUT
	return <ComicContext.Provider value={{
		session, setSession,
		projectSettings, setProjectSettings,
		comic, setComic,
		comicPage, setComicPage,
		comicVars, setComicVars,
		userVars, setUserVars,
		comicPreviousPage, setComicPreviousPage,
		comicPageHistory, setComicPageHistory,
	}}>
		{children}
	</ComicContext.Provider>
}

/** ------------------------------------------------ **/
// Function that returns the current context
export function useComicContext() {
	const context = useContext(ComicContext)

	// Output only if the context is used within the provider
	if (!context) throw new Error("useComicContext must be used within ComicContextProvider")
	return context
}