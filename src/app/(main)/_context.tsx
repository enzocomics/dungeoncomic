"use client"
/** ------------------------------------------------ **/
import { SetStateAction, PropsWithChildren, createContext, useContext, useState } from "react"

/** ------------------------------------------------ **
 * GLOBAL CONTEXT PROVIDER
 * - Status Messages
 ** ------------------------------------------------ **/
// STATE TYPES
type StatusMessageType = string

// CONTEXT TYPES
type ContextType = {
	// Status Messages
	statusMessage: StatusMessageType,
	setStatusMessage: (statusMessage: SetStateAction<StatusMessageType>) => void
}

// DEFAULT VARIABLES
const statusMessageDefault = ""

/** ------------------------------------------------ **/
// CONTEXT
export const GlobalContext = createContext<ContextType | undefined>({
	// Status Messages
	statusMessage: statusMessageDefault,
	setStatusMessage: (statusMessage) => { },
})

// CONTEXT PROVIDER
export default function GlobalContextProvider({ children }: PropsWithChildren<{}>) {
	const [statusMessage, setStatusMessage] = useState(statusMessageDefault)

	// OUTPUT
	return <GlobalContext.Provider value={{ statusMessage, setStatusMessage }} >
		{children}
	</GlobalContext.Provider>

}