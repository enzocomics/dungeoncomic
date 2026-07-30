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
import { AuthBody, AuthHeader, AuthHeaderDescription, AuthHeaderTitle, AuthNav } from "@/app/(auth)/_ui"
import StatusMessage from "@/components/status-message"
import { useChangeStatus } from "@/components/status-message"
import { ErrorMessage, Field, Fieldset, Label } from "@/components/fieldset"
import { Button } from "@/components/button"
import { Input } from "@/components/input"
import { Link } from "@/components/link"

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

	// EFFECT: Display error
	useEffect(() => {
		console.log(lastResult?.status)
		if (lastResult?.status == "error" && form.errors) {
			const messages = Object.values(form.errors).flat()
			setStatus("error", `${s("types.error").toUpperCase()}: ${messages[0]}`)
		}
	}, [lastResult])



	// OUTPUT
	return <>
		<AuthBody>
			{/* HEADER */}
			<AuthHeader>
				<AuthHeaderTitle>{t("pages.login.title")}</AuthHeaderTitle>
				<AuthHeaderDescription>
					<p dangerouslySetInnerHTML={{
						__html: t.rich("pages.register.acknowledgement", {
							a1: (chunks) => `<a class="text-primary-500" href="/terms">${chunks}</a>`,
							a2: (chunks) => `<a class="text-primary-500" href="/privacy">${chunks}</a>`
						}) as string
					}}
					/>
				</AuthHeaderDescription>
			</AuthHeader>

			{/* STATUS MESSAGE */}
			<StatusMessage className="mb-6" />

			{/* FORM */}
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
					<Field>
						<Label required htmlFor={fields.email.name}>{t("fields.email")}</Label>
						<Input
							id={fields.email.name}
							name={fields.email.name}
							key={fields.email.key}
							// Retain the value of the previous submission
							defaultValue={lastResult?.initialValue?.email as string}
							type="email"
							autoComplete="current-email"
							// errors={fields.email.errors}
							aria-required
						/>
						<ErrorMessage>{fields.email.errors}</ErrorMessage>
					</Field>
					<Field>
						<Label required htmlFor={fields.password.name}>{t("fields.password")}</Label>
						<Input
							id={fields.password.name}
							name={fields.password.name}
							key={fields.password.key}
							// Retain the value of the previous submission
							defaultValue={lastResult?.initialValue?.password as string}
							type="password"
							autoComplete="current-password"
							aria-required
						/>
						<ErrorMessage>{fields.password.errors}</ErrorMessage>
					</Field>
					<Button
						type="submit"
						color="primary"
						className={clsx(
							"w-full",
							"mt-6",
						)}
					>{t("pages.login.submit")}</Button>
				</Fieldset>
			</form>

			{/* NAVIGATION */}
			<AuthNav>
				<Link
					className={clsx(
						"text-primary-500",
					)}
					href="/reset-password">{t("pages.login.reset-password-link")} &raquo;</Link>
				<div className={clsx(

				)}
					dangerouslySetInnerHTML={{
						__html: t.rich("pages.login.register-link", {
							a: (chunks) => `<a class="text-primary-500" href="/register">${chunks} &raquo;</a>`
						}) as string
					}} />
			</AuthNav>
		</AuthBody>
	</>

}