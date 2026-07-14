"use client"
/**----------------------------------- */
// I18N
import { useTranslations } from "next-intl"
// AUTH + VALIDATION
import { useActionState } from "react"
import { useForm } from "@conform-to/react"
import { parseWithZod } from "@conform-to/zod/v4"
import { loginSchema } from "@/lib/zod/schemas/pages"
import { login } from "./_action"

/** ------------------------------------------------ **
 * LOGIN FORM
 */
export default function LoginPageUI() {
	// I18N
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
					id="email"
					type="email"
					key={fields.email.key}
					name={fields.email.name}
					// Retain the value of the previous submission
					defaultValue={lastResult?.initialValue?.email as string}
				/>
				<div>{fields.email.errors}</div>
			</div>
			<div>
				<label htmlFor="password">{t("fields.password")}</label>
				<input
					id="password"
					type="password"
					key={fields.password.key}
					name={fields.password.name}
				/>
				<div>{fields.password.errors}</div>
			</div>
			<button
				type="submit"
			>{t("pages.login.submit")}</button>
		</form>
	</>

}