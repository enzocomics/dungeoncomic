import clsx from "clsx";
import { ComponentPropsWithoutRef } from "react";

export function Badge({
	className,
	...props
}: { className?: string } & ComponentPropsWithoutRef<"span">) {
	return <span
		{...props}
		className={clsx(
			className,
			"inline-flex",
			"items-center",
			"rounded-md",
			"bg-red-50",
			"px-2",
			"py-1",
			"text-xs",
			"font-medium",
			"text-red-600",
			"inset-ring",
			"inset-ring-red-500/10",
			"dark:bg-red-400/10",
			"dark:text-red-400",
			"dark:inset-ring-red-400/20"
		)}
	>
		{props.children}
	</span>
}