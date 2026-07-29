"use client"
/**----------------------------------- */
// I18N
import { useTranslations } from "next-intl"
// LIBRARIES
import { useSearchParams } from "next/navigation"
// AUTH + VALIDATION
import { useActionState, useEffect } from "react"
import { useForm } from "@conform-to/react"
import { parseWithZod } from "@conform-to/zod/v4"
import { loginSchema } from "@/lib/zod/schemas/pages"
import { login } from "./_action"
// UI
import { useChangeStatus } from "@/components/status-message"

/** ------------------------------------------------ **
 * LOGIN FORM
 */
export default function LoginPageUI() {
	// I18N
	const s = useTranslations("status-messages")
	const t = useTranslations("auth")

	// VALIDATION
	const [lastResult, action] = useActionState(login, undefined)
	const [form, fields] = useForm({
		// Sync the result with the last submission
		lastResult,

		// Reuse the validation logic on the client
		onValidate({ formData }) {
			return parseWithZod(formData, { schema: loginSchema(t) })
		},

		// Validate the form on blur event triggered
		shouldValidate: "onBlur",
		shouldRevalidate: "onInput",
	})

	// Get the url search param
	const params = useSearchParams()
	const urlStatus = params.get("status")
	const setStatus = useChangeStatus("")

	// EFFECT: Display the status notification
	useEffect(() => {
		switch (urlStatus) {
			case "verify-success":
				setStatus("success", s("account-verify-success"))
				break
			case "verify-error":
				setStatus("error", s("account-verify-error"))
				break
		}
	}, [urlStatus])


	// OUTPUT
	return <>
		<h1 className="text-3xl">{t("pages.login.title")}</h1>
		<form
			id={form.id}
			onSubmit={form.onSubmit}
			action={action}
			noValidate
		>
			<div>
				<label htmlFor="email">{t("fields.email")}</label>
				<input
					id={fields.email.name}
					name={fields.email.name}
					key={fields.email.key}
					// Retain the value of the previous submission
					defaultValue={lastResult?.initialValue?.email as string}
					type="email"
					autoComplete="current-email"
				/>
				<div>{fields.email.errors}</div>
			</div>
			<div>
				<label htmlFor="password">{t("fields.password")}</label>
				<input
					id={fields.password.name}
					name={fields.password.name}
					key={fields.password.key}
					// Retain the value of the previous submission
					defaultValue={lastResult?.initialValue?.password as string}
					type="password"
					autoComplete="current-password"
				/>
				<div>{fields.password.errors}</div>
			</div>
			<button
				type="submit"
			>{t("pages.login.submit")}</button>
		</form>
	</>

}