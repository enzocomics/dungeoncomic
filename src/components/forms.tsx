import * as Headless from '@headlessui/react'
import clsx from 'clsx'
import type React from 'react'

export function Input({
	className,
	...props
}: { className?: string } & Omit<Headless.InputProps, "className">) {
	return <>
		<Headless.Input
			{...props}
			className={clsx(
				className,
				"mb-2",
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