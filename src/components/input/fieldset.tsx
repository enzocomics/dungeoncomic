import Icon from "@/styles/icons"
import * as Headless from "@headlessui/react"
import clsx from "clsx"
import { marked } from "marked"
import { ComponentPropsWithoutRef, forwardRef } from "react"


export function Fieldset({
	className,
	...props
}: { className?: string } & Omit<Headless.DescriptionProps, "className">) {
	return <>
		<Headless.Fieldset
			{...props}
			className={clsx(
				className,
			)}
		>
			{props.children}
		</Headless.Fieldset>
	</>
}

export function FieldsetSection({
	className,
	...props
}: { className?: string } & Omit<Headless.DescriptionProps, "className">) {
	return <>
		<Headless.Fieldset
			{...props}
			className={clsx(
				className,
				"mb-6",
				"bg-neutral-100",
				"dark:bg-neutral-950",
				"p-4",
				"rounded",
			)}
		>
			{props.children}
		</Headless.Fieldset>
	</>
}

export function FieldGroup({
	className,
	...props
}: { classsName?: string } & ComponentPropsWithoutRef<"div">) {
	return <>
		<div {...props} className={clsx(
			className,
			"py-8",
			"space-y-8",
		)}>
			{props.children}
		</div>
	</>
}


export function FieldGroup2Columns({
	className,
	...props
}: { classsName?: string } & ComponentPropsWithoutRef<"div">) {
	return <>
		<div {...props} className={clsx(
			className,
			"py-8",
			"space-y-8",
			"grid",
			"gap-y-6",
			"md:grid",
			"md:grid-cols-2",
			"md:gap-x-12",
		)}>
			{props.children}
		</div>
	</>
}


export function Field({
	className,
	...props
}: { className?: string } & Omit<Headless.FieldProps, "className">) {
	return <>
		<Headless.Field
			{...props}
			className={clsx(
				className,
				"data-disabled:opacity-25",
				"data-disabled:pointer-events-none",
			)}
		>
			{props.children}
		</Headless.Field>
	</>
}




export const Input = forwardRef(function Input({
	className,
	...props
}: {
	className?: string,
} & Omit<Headless.InputProps, "className">,
	ref: React.ForwardedRef<HTMLInputElement>) {
	return <>
		<Headless.Input
			ref={ref}
			{...props}
			className={clsx(
				className,
				"mt-3",
				"mb-3",
				"py-2",
				"px-4",
				"w-full",
				"border-2",
				"text-left",
				"font-platform-copy",
				"rounded",
				// Colors
				"bg-white",
				"border-neutral-200",
				"text-neutral-900",
				"dark:border-white/10",
				"dark:bg-white/5",
				"dark:text-white",
				//
				"focus:outline-4",
				"focus:-outline-offset-2",
				"focus:outline-comic-accent-500",
			)}
		/>
	</>
})

export function Label({
	className,
	...props
}: { className?: string } & Omit<Headless.LabelProps, "className">) {
	return <>
		<Headless.Label
			{...props}
			className={clsx(
				className,
				"cursor-pointer",
				"font-platform-headers",
				"font-semibold",
			)}
		>
			{props.children}
		</Headless.Label>
	</>
}

export function Description({
	className,
	...props
}: { className?: string } & Omit<Headless.DescriptionProps, "className">) {
	return <>
		<Headless.Description
			{...props}
			className={clsx(
				className,
				"font-platform-copy",
				"font-normal",
				"text-sm",
				"text-base-content/60",
				"dark:text-white/50",
			)}
		>
			{props.children}
		</Headless.Description>
	</>
}


export function Legend({
	className,
	...props
}: { className?: string } & Omit<Headless.LegendProps, "className">) {
	return <>
		<Headless.Legend
			{...props} className={clsx(
				className,
				"w-full",
				"font-platform-headers",
				"font-bold",
				"text-2xl",
				"flex",
				"items-center",
				"pr-3",
			)}
		>
			{props.children}
		</Headless.Legend>
	</>
}


export function FieldsetDescription({
	className,
	...props
}: { className?: string } & ComponentPropsWithoutRef<"div">) {
	return <>
		<div
			{...props}
			className={clsx(
				className,
				"mt-1",
				"mb-2",
				"font-platform-copy",
				"font-normal",
				"text-base",
				"text-base-content/60",
				"dark:text-white/50",
				"max-w-prose",
				"text-balance",
			)}
		>
			{props.children}
		</div>
	</>
}


export function ErrorMessage({
	className,
	...props
}: { className?: string } & Omit<Headless.DescriptionProps, 'as' | 'className'>) {
	const errors = props.children as string[]
	return <>
		{props.children &&
			<Headless.Description
				data-slot="error"
				{...props}
				className={clsx(className, clsx(
					"block",
					"mb-2",
					"py-2",
					"px-2.5",
					"w-full",
					"rounded-sm",
					"dark:border",
					"dark:border-red-500/25",
					"bg-red-50",
					"dark:bg-red-500/15",
					"text-red-800",
					"dark:text-red-200",
					"text-xs",
					"text-center",
				))}
			>
				{errors.map((error, i) => {
					return <span className="block" key={i}>
						{/* Only show bullet point if there's more than one error */}
						{errors.length > 1 &&
							<>
								-&nbsp;
							</>
						}
						{error}
					</span>
				})}
			</Headless.Description>
		}
	</>
}

export const MarkedText = ({
	children
}: {
	children?: string
}) => {
	return <span dangerouslySetInnerHTML={{
		__html: String(children && marked.parse(children))
	}} />
}
