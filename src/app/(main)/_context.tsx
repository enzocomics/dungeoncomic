"use client"
/** ------------------------------------------------ **/
// TYPES
import { StatusMessageType } from "@/components/status-message"
// LIBRARIES
import { SetStateAction, PropsWithChildren, createContext, useContext, useState } from "react"

/** ------------------------------------------------ **
 * GLOBAL CONTEXT PROVIDER
 * - Status Messages
 ** ------------------------------------------------ **/
// STATE TYPES
type StatusMessageSchema = { type: StatusMessageType, message: string, description: string }

// CONTEXT TYPES
type ContextType = {
	// Status Messages
	statusMessage: StatusMessageSchema,
	setStatusMessage: (statusMessage: SetStateAction<StatusMessageSchema>) => void
}

// DEFAULT VARIABLES
const statusMessageDefault: StatusMessageSchema = { type: "info", message: "", description: "" }

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

/** ------------------------------------------------ **/
// Function that returns the current context
export function useGlobalContext() {
	const context = useContext(GlobalContext)

	// Output only if the context is used within the provider
	if (!context) throw new Error("useGlobalContext must be used within GlobalContextProvider")
	return context
}