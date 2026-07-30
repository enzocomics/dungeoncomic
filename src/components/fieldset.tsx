import * as Headless from '@headlessui/react'
import clsx from 'clsx'
import type React from 'react'

export function Fieldset({
	className,
	...props
}: { className?: string } & Omit<Headless.FieldsetProps, 'as' | 'className'>) {
	return (
		<Headless.Fieldset
			{...props}
			className={clsx(className, '*:data-[slot=text]:mt-1 [&>*+[data-slot=control]]:mt-6')}
		/>
	)
}

export function Legend({
	className,
	...props
}: { className?: string } & Omit<Headless.LegendProps, 'as' | 'className'>) {
	return (
		<Headless.Legend
			data-slot="legend"
			{...props}
			className={clsx(
				className,
				'text-base/6 font-semibold text-zinc-950 data-disabled:opacity-50 sm:text-sm/6 dark:text-white'
			)}
		/>
	)
}

export function FieldGroup({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
	return <div data-slot="control" {...props} className={clsx(className, 'space-y-8')} />
}

export function Field({ className, ...props }: { className?: string } & Omit<Headless.FieldProps, 'as' | 'className'>) {
	return (
		<Headless.Field
			{...props}
			className={clsx(
				className,
				"group/field",
				// '[&>[data-slot=label]+[data-slot=control]]:mt-3',
				// '[&>[data-slot=label]+[data-slot=description]]:mt-1',
				// '[&>[data-slot=description]+[data-slot=control]]:mt-3',
				// '[&>[data-slot=control]+[data-slot=description]]:mt-3',
				// '[&>[data-slot=control]+[data-slot=error]]:mt-3',
				// '*:data-[slot=label]:font-medium'
			)}
		/>
	)
}

export function Label({ required = false, className, ...props }: { required?: boolean, className?: string } & Omit<Headless.LabelProps, 'as' | 'className'>) {
	return (
		<Headless.Label
			data-slot="label"
			{...props}
			className={clsx(
				className,
				"text-base/6",
				"text-gray-900",
				"font-medium",
				"select-none",
				"data-disabled:opacity-50",
				"sm:text-sm/6",
				"dark:text-white",
				required ? "after:content-['*'] after:ml-1 after:text-red-500 after:text-bold" : ""
			)}
		/>
	)
}

export function Description({
	className,
	...props
}: { className?: string } & Omit<Headless.DescriptionProps, 'as' | 'className'>) {
	return (
		<Headless.Description
			data-slot="description"
			{...props}
			className={clsx(className, 'text-base/6 text-zinc-500 data-disabled:opacity-50 sm:text-sm/6 dark:text-zinc-400')}
		/>
	)
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
					"mt-1",
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
