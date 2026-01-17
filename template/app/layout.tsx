import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
	title: "Landing Page",
	description: "Landing page gerada dinamicamente",
	robots: "index, follow",
	openGraph: {
		type: "website",
	},
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="pt-BR" suppressHydrationWarning>
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link rel="icon" href="/favicon.ico" />
			</head>
			<body suppressHydrationWarning>
				{children}
				<Toaster />
			</body>
		</html>
	);
}
