"use client"
import * as Headless from "@headlessui/react"
import clsx from "clsx"
import Icon from "@/styles/icons"
import { Fragment } from "react"

export function Listbox<T>({
	className,
	children: options,
	...props
}: {
	className?: string
	children?: React.ReactNode
} & Omit<Headless.ListboxProps<typeof Fragment, T>, 'as' | 'multiple'>) {
	return <>
		<div className={clsx(
			"grid",
			"grid-cols-1",
		)}>
			<Headless.Listbox	{...props} multiple={false} >
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
						"border-neutral-200",
						"dark:border-white",
						"bg-white",
						"text-black",
						"text-left",
						"font-platform-mono",
						"rounded",
						//
						"focus:outline-4",
						"focus:outline-offset-4",
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
				"text-red-500",
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