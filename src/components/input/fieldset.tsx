import Icon from "@/styles/icons"
import * as Headless from "@headlessui/react"
import clsx from "clsx"


export function Fieldset({
	className,
	...props
}: { className?: string } & Omit<Headless.DescriptionProps, "className">) {
	return <>
		<Headless.Fieldset
			{...props}
			className={clsx(
				className,
				"space-y-8",
			)}
		>
			{props.children}
		</Headless.Fieldset>
	</>
}

export function Field({
	className,
	...props
}: { className?: string } & Omit<Headless.DescriptionProps, "className">) {
	return <>
		<Headless.Field
			{...props}
			className={clsx(
				className,

			)}
		>
			{props.children}
		</Headless.Field>
	</>
}




export function Input({
	className,
	...props
}: { className?: string } & Omit<Headless.InputProps, "className">) {
	return <>
		<Headless.Input
			{...props}
			className={clsx(
				className,
				"mt-3",
				"mb-3",
				"py-2",
				"px-4",
				"w-full",
				"bg-white",
				"border-2",
				"border-neutral-200",
				"dark:border-white",
				"text-black",
				"text-left",
				"font-platform-mono",
				"rounded",
			)}
		/>
	</>
}

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
				"font-platform-header",
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
			{...props}
			className={clsx(
				className,
				"font-header",
			)}
		>
			{props.children}
		</Headless.Legend>
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
