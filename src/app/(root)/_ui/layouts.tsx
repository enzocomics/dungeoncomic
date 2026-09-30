export async function ComicRootLayout({
	children,
	header,
}: {
	children: React.ReactNode
	header: React.ReactNode
}) {
	return <>
		AuthModal<br />
		ComicContext<br />
		ComicLayoutUI<br />
		SiteNav<br />
		<div className="border border-dashed border-purple-500">
			header: {header} <br /><br />
		</div>
		ComicPageHeader<br />
		SiteLayoutMain<br /><br />
		<div className="border border-dashed border-orange-500">
			{children}
		</div>
		<br /><br />SiteFooter
	</>
}