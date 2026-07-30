import { AuthLayout } from "./_ui"

export default async function AuthRootLayout(props: LayoutProps<"/">) {
	return <>
		<AuthLayout>
			{props.children}
		</AuthLayout>
	</>
}