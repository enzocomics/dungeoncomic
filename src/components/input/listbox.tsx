"use client"
import * as Headless from "@headlessui/react"
import clsx from "clsx"
import Icon from "@/styles/icons"
import { Fragment } from "react"
import { FieldMetadata, useInputControl } from "@conform-to/react"

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
	const thisField = useInputControl({
		name: conformField?.name || "",
		formId: conformField?.formId || "",
		initialValue:
			typeof conformField?.initialValue === "string"
				? conformField.initialValue
				: loadedValue
	})

	return <>
		<div className={clsx(
			"grid",
			"grid-cols-1",
		)}>
			<Headless.Listbox
				{...props}
				multiple={false}
				// Makes conform control this value
				value={thisField.value}
				// Report changes back to conform 
				onChange={thisField.change}
				// Associate with the correct form
				form={conformField?.id}
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
						"focus:outline-comic-accent-500",
					)}
				>
					<Headless.ListboxSelectedOption options={options}>
						<div>hi</div>
					</Headless.ListboxSelectedOption>
				</Headless.ListboxButton>
				<Headless.ListboxOptions anchor="bottom" transition>
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
				"text-comic-accent-500",
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
	return <Headless.ListboxOption as={Fragment} {...props}>
		{({ selectedOption }) => {
			if (selectedOption) {
				return <div className={clsx(className,)}>{children}</div>
			}

			return (
				<div className={clsx(

				)}>
					{children}
				</div>
			)
		}}
	</Headless.ListboxOption>
}