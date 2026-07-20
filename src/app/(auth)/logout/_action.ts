"use server"
import { deleteUserCookie, getUserCookie } from "@/data/cookies"
import { userCookieName } from "@/data/env"
import { userClient } from "@/lib/directus/clients"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export async function logout() {
	const cookieStore = await cookies()
	const cookie = await getUserCookie()
	if (cookie) {
		const refresh_token = cookie.refresh_token as string
		await userClient.logout({ refresh_token: refresh_token })

		cookieStore.delete(userCookieName)
		// await deleteUserCookie(cookieStore)
		redirect("/")
	}
}
