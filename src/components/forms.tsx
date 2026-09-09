import * as Headless from '@headlessui/react'
import clsx from 'clsx'
import type React from 'react'

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
					// "block",
					// "mt-1",
					// "py-2",
					// "px-2.5",
					// "w-full",
					// "w-full",
					// "rounded-sm",
					// "dark:border",
					// "dark:border-red-500/25",
					// "bg-red-50",
					// "dark:bg-red-500/15",
					// "text-red-800",
					// "dark:text-red-200",
					// "text-xs",
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