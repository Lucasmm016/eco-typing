import Link from 'next/link'

import Logo from './icons/Logo'
import { ThemeToggle } from './ModeToggle'

export function Header() {
	return (
		<header className="w-full max-w-6xl flex items-center justify-between p-4 mx-auto">
			<Link href="/">
				<Logo className="w-32" />
			</Link>
			<ThemeToggle />
		</header>
	)
}
