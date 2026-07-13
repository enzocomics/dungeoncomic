"use client"
/**----------------------------------- */
// I18N
import { useTranslations } from "next-intl"
// AUTH + VALIDATION
import { useActionState } from "react"
import { useForm } from "@conform-to/react"
import { parseWithZod } from "@conform-to/zod/v4"
import { registerSchema } from "@/lib/zod/schemas"
import { register } from "./_action"

/** ------------------------------------------------ **
 * REGISTER FORM
 */
export default function RegisterPageUI() {
	// I18N
	const t = useTranslations("auth")

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
		},
	})

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
				<label htmlFor="username">{t("fields.username")}</label>
				<input
					id="username"
					type="username"
					key={fields.username.key}
					name={fields.username.name}
					// Retain the value of the previous submission
					defaultValue={lastResult?.initialValue?.username as string}
				/>
				<div>{fields.username.errors}</div>
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

			<div>
				<label htmlFor="passwordConfirm">{t("fields.password-confirm")}</label>
				<input
					id="passwordConfirm"
					type="password"
					key={fields.passwordConfirm.key}
					name={fields.passwordConfirm.name}
				/>
				<div>{fields.passwordConfirm.errors}</div>
			</div>
			<button
				type="submit"
			>{t("pages.register.submit")}</button>
		</form>
	</>

}