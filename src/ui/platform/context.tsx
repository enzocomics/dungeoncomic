"use client"
/** ------------------------------------------------ **/
// TYPES
import { StatusMessageType } from "@/components/status-message"
// LIBRARIES
import { SetStateAction, PropsWithChildren, createContext, useContext, useState } from "react"

/** ------------------------------------------------ **
 * GLOBAL CONTEXT PROVIDER
 * - Status Messages
 * - Auth Modals
 ** ------------------------------------------------ **/
// STATE TYPES
type StatusMessageSchema = { type: StatusMessageType, message: string, description: string }
export type AuthModalSchema = "login" | "register" | "reset-password" | null

// CONTEXT TYPES
type ContextType = {
	// Status Messages
	statusMessage: StatusMessageSchema,
	setStatusMessage: (statusMessage: SetStateAction<StatusMessageSchema>) => void
	authModal: AuthModalSchema,
	setOpenAuthModal: (authModal: SetStateAction<AuthModalSchema>) => void
}

// DEFAULT VARIABLES
const statusMessageDefault: StatusMessageSchema = { type: "info", message: "", description: "" }
const authModalDefault: AuthModalSchema = null

/** ------------------------------------------------ **/
// CONTEXT
export const GlobalContext = createContext<ContextType | undefined>({
	// Status Messages
	statusMessage: statusMessageDefault,
	setStatusMessage: (statusMessage) => { },
	// Auth Modal
	authModal: authModalDefault,
	setOpenAuthModal: (authModal) => { },
})

// CONTEXT PROVIDER
export default function GlobalContextProvider({ children }: PropsWithChildren<{}>) {
	const [statusMessage, setStatusMessage] = useState(statusMessageDefault)
	const [authModal, setOpenAuthModal] = useState(authModalDefault)

	// OUTPUT
	return <GlobalContext.Provider value={{
		statusMessage, setStatusMessage,
		authModal, setOpenAuthModal
	}} >
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