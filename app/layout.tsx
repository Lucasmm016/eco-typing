import type { Metadata } from 'next'
import { Geist_Mono, Spline_Sans_Mono } from 'next/font/google'

import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { ThemeProvider } from '@/components/providers/ThemeProvider'

import './globals.css'

const splineSansMono = Spline_Sans_Mono({
	variable: '--font-spline-sans-mono',
	subsets: ['latin'],
})

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
})

export const metadata: Metadata = {
	title: 'Eco Typing',
	description: 'Eco Typing',
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html
			lang="en"
			className={`${splineSansMono.variable} ${geistMono.variable} ${splineSansMono.className} h-full antialiased`}
			suppressHydrationWarning
		>
			<body className="min-h-full flex flex-col">
				<ThemeProvider attribute="class" defaultTheme="light" enableSystem>
					<main className="w-full flex flex-col flex-1">
						<Header />
						<div className="w-full max-w-6xl flex flex-col flex-1 mx-auto">{children}</div>
						<Footer />
					</main>
				</ThemeProvider>
			</body>
		</html>
	)
}
