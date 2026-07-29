"use client"
/**----------------------------------- */
// I18N
import { useTranslations } from "next-intl"
// NEXT.JS
import { useRouter } from "next/navigation"
// AUTH + VALIDATION
import { useActionState, useEffect } from "react"
import { useForm } from "@conform-to/react"
import { parseWithZod } from "@conform-to/zod/v4"
import { registerSchema } from "@/lib/zod/schemas/pages"
import { register } from "./_action"
// UI
import { useChangeStatus } from "@/components/status-message"

/** ------------------------------------------------ **
 * REGISTER FORM
 */
export default function RegisterPageUI() {
	// I18N
	const t = useTranslations("auth")
	// STATUS MESSAGES
	const setStatus = useChangeStatus("")
	// NEXTJS
	const router = useRouter()
	// VALIDATION
	const [lastResult, action] = useActionState(register, null)

	// CONFORM
	const [form, fields] = useForm({
		// Sync the result with the last submission
		lastResult,
		onValidate({ formData }) {
			return parseWithZod(formData, {
				// intent provided by `parseWithZod`
				schema: (intent) => registerSchema(t, intent)
			})
		}
	})

	// EFFECT: Run after form submission
	useEffect(() => {
		if (lastResult?.status === "success") {
			// STATUS MESSAGE
			setStatus(t("pages.register.verify-account"), "success")
			// Redirect
			router.push("/login")
		}
	}, [lastResult])

	// EXPORT
	return <>
		<h1 className="text-3xl">{t("pages.register.title")}</h1>
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
					type="email"
					// Retain the value of the previous submission
					defaultValue={lastResult?.initialValue?.email as string}
				/>
				<div>{fields.email.errors}</div>
			</div>
			{/* <div>
				<label htmlFor="username">{t("fields.username")}</label>
				<input
					id={fields.username.name}
					name={fields.username.name}
					key={fields.username.key}
					type="username"
					// Retain the value of the previous submission
					defaultValue={lastResult?.initialValue?.username as string}
				/>
				<div>{fields.username.errors}</div>
			</div> */}
			<div>
				<label htmlFor="password">{t("fields.password")}</label>
				<input
					id={fields.password.name}
					name={fields.password.name}
					key={fields.password.key}
					type="password"
					// Retain the value of the previous submission
					defaultValue={lastResult?.initialValue?.password as string}
				/>
				<div>{fields.password.errors}</div>
			</div>

			<div>
				<label htmlFor="passwordConfirm">{t("fields.password-confirm")}</label>
				<input
					id={fields.passwordConfirm.name}
					type="password"
					key={fields.passwordConfirm.key}
					name={fields.passwordConfirm.name}
					// Retain the value of the previous submission
					defaultValue={lastResult?.initialValue?.passwordConfirm as string}
				/>
				<div>{fields.passwordConfirm.errors}</div>
			</div>
			<button
				type="submit"
			>{t("pages.register.submit")}</button>
		</form>
	</>

}