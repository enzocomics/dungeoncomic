"use client"
/**----------------------------------- */
// NEXT
import { useSearchParams } from "next/navigation"
// I18N
import { useTranslations } from "next-intl"
// AUTH + VALIDATION
import { useActionState } from "react"
import { useForm } from "@conform-to/react"
import { parseWithZod } from "@conform-to/zod/v4"
import { resetPasswordRequestSchema, resetPasswordSubmitSchema } from "@/lib/zod/schemas/pages"

/** ------------------------------------------------ **
 * RESET PASSWORD PAGE
 */

export default function ResetPasswordPageUI() {
	// I18N
	const t = useTranslations("auth")
	// TOKEN
	const resetTokenParam = useSearchParams()
	const resetToken = resetTokenParam.get("token")
	// OUTPUT
	return resetToken ? <ResetPasswordForm /> : <RequestResetForm />
}

function RequestResetForm() {
	return <>
		Request the password
	</>
}

function ResetPasswordForm() {
	return <>
		Reset the password
	</>
}