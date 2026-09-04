"use client"

import { createContext, PropsWithChildren, SetStateAction, useContext, useState } from "react"

/** ------------------------------------------------ **
 * COMIC CONTEXT PROVIDER
 * - Previous Comic Page
 ** ------------------------------------------------ **/
// STATE TYPES
type ComicPreviousPageSchema = {
	pagenum?: number,
	params?: string,
}

type ComicPageHistorySchema = string[]

// CONTEXT TYPE
type ContextType = {
	comicPreviousPage: ComicPreviousPageSchema,
	setComicPreviousPage: (comicPreviousPage: SetStateAction<ComicPreviousPageSchema>) => void,
	comicPageHistory: ComicPageHistorySchema,
	setComicPageHistory: (comicPageHistory: SetStateAction<ComicPageHistorySchema>) => void
}

// Default Variables
const comicPreviousPageDefault: ComicPreviousPageSchema = {
	pagenum: undefined,
	params: undefined
}

const comicPageHistoryDefault: ComicPageHistorySchema = []


/** ------------------------------------------------ **/
// CONTEXT
export const ComicContext = createContext<ContextType | undefined>({
	comicPreviousPage: comicPreviousPageDefault,
	setComicPreviousPage: (comicPreviousPage) => { },
	comicPageHistory: comicPageHistoryDefault,
	setComicPageHistory: (comicPageHistory) => { }
})

// CONTEXT PROVIDER
export default function ComicContextProvider({ children }:
	PropsWithChildren<{}>) {
	const [comicPreviousPage, setComicPreviousPage] = useState(comicPreviousPageDefault)
	const [comicPageHistory, setComicPageHistory] = useState(comicPageHistoryDefault)

	// OUTPUT
	return <ComicContext.Provider value={{
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