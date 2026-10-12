"use client"
import * as Headless from "@headlessui/react"
import clsx from "clsx"
import Icon from "@/styles/icons"
import { Fragment } from "react"
import { FieldMetadata, useInputControl } from "@conform-to/react"
import { usePathname } from "next/navigation"

export function Listbox({
	className,
	children: options,
	conformField,
	loadedValue,
	...props
}: {
	className?: string
	children?: React.ReactNode
	conformField?: FieldMetadata<unknown, Record<
		string, Record<string, unknown>
	>, string[]>
	loadedValue?: string
} & Omit<Headless.ListboxProps<typeof Fragment>, 'as' | 'multiple'>) {

	/**
	 * useInputControl
	 * - Conform's adapter for a custom React control
	 * - Gives the listbox a value & change handler that stays connected to Conform's form state
	 */
	let thisField
	thisField = conformField && useInputControl({
		name: conformField.name,
		formId: conformField.formId,
		initialValue:
			typeof conformField.initialValue === "string"
				? conformField.initialValue
				: loadedValue
	})


	const pathname = usePathname()


	return <>
		<div className={clsx(
			"grid",
			"grid-cols-1",
		)}>
			<Headless.Listbox
				// as="div"
				key={pathname}
				{...props}
				multiple={false}
				// Makes conform control this value
				value={thisField?.value}
				// Report changes back to conform 
				// onChange={thisField?.change}
				onChange={(value) => {
					thisField?.change(value)
				}}
			// Associate with the correct form
			// form={conformField?.id}
			>
				<Headless.ListboxButton
					data-slot="control"
					className={clsx(
						className,
						"cursor-pointer",
						"appearance-none",
						// Grid
						"col-start-1",
						"row-start-1",
						// Size
						"w-full",
						"py-2",
						"px-4",
						"pr-8",
						"my-3",
						// Appearance
						"border-2",
						"text-left",
						"font-platform-mono",
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
						"focus:outline-platform-accent-500",
					)}
				>
					<Headless.ListboxSelectedOption options={options} />
				</Headless.ListboxButton>
				<Headless.ListboxOptions
					anchor="bottom start"
					transition
					className={clsx(
						"bg-base-1",
						"w-(--button-width)",
						"[--anchor-padding:40px]",
						"rounded",
						"z-100",
						"data-open:outline-4",
						"data-open:-outline-offset-2",
						"data-open:outline-platform-accent-500"
					)}>
					{options}
				</Headless.ListboxOptions>
			</Headless.Listbox>

			<Icon name="caretDown" className={clsx(
				"pointer-events-none",
				"mr-2",
				"relative",
				"top-1/2",
				"-translate-y-1/2",
				"size-5",
				"col-start-1",
				"row-start-1",
				"justify-self-end",
				"text-platform-accent-500",
			)} />
		</div>
	</>
}



export function ListboxOption<T>({
	children,
	className,
	...props
}: { className?: string; children?: React.ReactNode } & Omit<
	Headless.ListboxOptionProps<'div', T>,
	'as' | 'className'
>) {

	return <Headless.ListboxOption as={Fragment} {...props}
	>
		{({ selectedOption }) => {
			if (selectedOption) {
				return <div className={clsx(className)}>{children}</div>
			}

			return (
				<div className={clsx(
					// className,
					"group",
					"z-100",
					"cursor-pointer",
					"px-3",
					"py-1.5",
					"text-lg",
					"hover:text-white",
					"hover:bg-platform-accent-500/50",
					"data-focus:text-white",
					"data-focus:bg-platform-accent-500",
					"flex",
					"items-center",
					"gap-x-2",
					// COLORS LISTBOX
					"data-[select=color]:hover:text-black!",
					"data-[select=color]:hover:bg-white!",
					"data-[select=color]:data-focus:text-black!",
					"data-[select=color]:data-focus:bg-white!",
				)}
				>
					{children}
				</div>
			)
		}}
	</Headless.ListboxOption>
}