"use client"
/**----------------------------------- */
// FUNCTIONS
import clsx from "clsx"
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
import { AuthBody, AuthHeader } from "@/components/auth-layout"
import { Fieldset, Label } from "@/components/fieldset"
import { Button } from "@/components/button"
import { Input } from "@/components/input"

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
		}
	}, [urlStatus])


	// OUTPUT
	return <>
		<AuthHeader>{t("pages.login.title")}</AuthHeader>
		<AuthBody>
			<h1 className="text-3xl"></h1>
			<form
				id={form.id}
				onSubmit={form.onSubmit}
				action={action}
				noValidate
			>
				<Fieldset
					className={clsx(
						"space-y-6"
					)}>
					<div>
						<Label htmlFor={fields.email.name}>{t("fields.email")}</Label>
						<Input
							id={fields.email.name}
							name={fields.email.name}
							key={fields.email.key}
							// Retain the value of the previous submission
							defaultValue={lastResult?.initialValue?.email as string}
							type="email"
							autoComplete="current-email"
						/>
						<Label htmlFor={fields.email.name} className="font-normal text-red-500">{fields.email.errors}</Label>
					</div>
					<div>
						<Label htmlFor={fields.password.name}>{t("fields.password")}</Label>
						<Input
							id={fields.password.name}
							name={fields.password.name}
							key={fields.password.key}
							// Retain the value of the previous submission
							defaultValue={lastResult?.initialValue?.password as string}
							type="password"
							autoComplete="current-password"
						/>
						<Label htmlFor={fields.password.name} className="font-normal text-red-500">{fields.password.errors}</Label>
					</div>
					<Button
						type="submit"
						color="sky"
						className={clsx(
							"w-full",

						)}
					>{t("pages.login.submit")}</Button>
				</Fieldset>
			</form>
		</AuthBody>
	</>

}