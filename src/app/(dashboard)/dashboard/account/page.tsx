import { verifySession } from "@/data/session"
import AccountPageUI from "@/ui/dashboard/pages/account"
import { connection } from "next/server"

export const instant = false

export default async function Page() {
	await connection()
	const session = await verifySession()
	return <AccountPageUI />
}