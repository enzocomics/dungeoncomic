"use client"
/**----------------------------------- */
// FUNCTIONS
import clsx from "clsx"
// I18N
import { useTranslations } from "next-intl"
// NEXT.JS
import { useRouter } from "next/navigation"
import { useSearchParams } from "next/navigation"
// AUTH + VALIDATION
import { useActionState, useEffect } from "react"
import { useForm } from "@conform-to/react"
import { parseWithZod } from "@conform-to/zod/v4"
import { registerSchema } from "@/lib/zod/schemas/pages"
import { register, verify } from "./_action"
// DATA
import { adminContactEmail } from "@/data/env"
// UI
import StatusMessage from "@/components/status-message"
import { useChangeStatus } from "@/components/status-message"
import { AuthBody, AuthHeader, AuthHeaderTitle, AuthHeaderDescription, AuthNav } from "@/app/(auth)/_ui"
import { ErrorMessage, Field, Fieldset, Label } from "@/components/fieldset"
import { Button } from "@/components/button"
import { Input } from "@/components/input"

/** ------------------------------------------------ **
 * REGISTER FORM
 */
export default function RegisterPageUI() {
	// I18N
	const s = useTranslations("status-messages")
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
			setStatus("success", t("pages.register.verify-account"))
			// Redirect
			router.push("/login")
		}
	}, [lastResult])

	// Get the url search param
	const params = useSearchParams()

	// EFFECT: Verify user's account via urlParam
	const urlVerifyToken = params.get("verify")
	useEffect(() => {
		const verifyRegistration = async () => {
			if (urlVerifyToken) {
				// SERVER ACTION: Send token to CMS
				const response = await verify(urlVerifyToken)
				if (response?.status == "success") {
					// SUCCESS MESSAGE
					setStatus("success", s("account-verified"))
				} else {
					// ERROR MESSAGE
					setStatus(
						"error",
						`${s("types.error").toUpperCase()}: ${response?.reason}`,
						// Description Message with Rich Text & Link
						// Reference: `https://next-intl.dev/docs/usage/translations#rich-text`
						JSON.stringify( // stringify, because we're passing it as a parameter
							s.rich("account-verify-error.message", {
								// map custom Rich Text tag to React Components
								mailtoAdmin: (chunks) => <a href={
									// include custom attribute (that's just another translation)
									s("account-verify-error.mailto", {
										adminEmail: adminContactEmail
									})
								}>
									{chunks}
								</a>
							})
						)
					)
				}
			}
		}
		verifyRegistration()
	},
		[] // Run this effect only one time
	)

	// EXPORT
	return <>
		<AuthBody>
			{/* HEADER */}
			<AuthHeader>
				<AuthHeaderTitle>{t("pages.register.title-verbose")}</AuthHeaderTitle>
				<AuthHeaderDescription>
					<p dangerouslySetInnerHTML={{
						__html: t.rich("pages.register.acknowledgement", {
							a1: (chunks) => `<a class="text-primary-800 dark:text-primary-300" href="/terms">${chunks}</a>`,
							a2: (chunks) => `<a class="text-primary-800 dark:text-primary-300" href="/privacy">${chunks}</a>`
						}) as string
					}}
					/>
				</AuthHeaderDescription>
			</AuthHeader>

			{/* STATUS MESSAGES */}
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
							type="email"
							// Retain the value of the previous submission
							defaultValue={lastResult?.initialValue?.email as string}
							errors={fields.email.errors}
							aria-required
						/>
						<ErrorMessage>{fields.email.errors}</ErrorMessage>
					</Field>
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

					<Field>
						<Label required htmlFor={fields.password.name}>{t("fields.password")}</Label>
						<Input
							id={fields.password.name}
							name={fields.password.name}
							key={fields.password.key}
							type="password"
							// Retain the value of the previous submission
							defaultValue={lastResult?.initialValue?.password as string}

							errors={fields.password.errors}
							aria-required
						/>
						<ErrorMessage>{fields.password.errors}</ErrorMessage>
					</Field>


					<Field>
						<Label required htmlFor="passwordConfirm">{t("fields.password-confirm")}</Label>
						<Input
							id={fields.passwordConfirm.name}
							type="password"
							key={fields.passwordConfirm.key}
							name={fields.passwordConfirm.name}
							// Retain the value of the previous submission
							defaultValue={lastResult?.initialValue?.passwordConfirm as string}
							errors={fields.passwordConfirm.errors}
							aria-required
						/>
						<ErrorMessage>{fields.passwordConfirm.errors}</ErrorMessage>
					</Field>
					<Button
						type="submit"
						color="primary"
						className={clsx(
							"w-full",
							"mt-6",
						)}
					>{t("pages.register.submit")}</Button>
				</Fieldset>
			</form>
			{/* NAVIGATION */}
			<AuthNav>
				<p className="grow text-center" dangerouslySetInnerHTML={{
					__html: t.rich("pages.register.login-link", {
						a: (chunks) => `<a class="text-primary-800 dark:text-primary-300" href="/login">${chunks} &raquo;</a>`
					}) as string
				}}
				/>
			</AuthNav>
		</AuthBody >
	</>

}