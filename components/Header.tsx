import Link from 'next/link'

import Github from './icons/Github'
import Logo from './icons/Logo'
import { Button } from './ui/button'
import { ThemeToggle } from './ThemeToggle'

export function Header() {
	return (
		<header className="w-full max-w-6xl flex items-center justify-between p-4 mx-auto">
			<Link href="/">
				<Logo className="w-32" />
			</Link>

			<div className="flex items-center gap-2">
				<Link href="https://github.com/Lucasmm016/eco-typing.git">
					<Button variant="ghost">
						<Github className="size-5" />
					</Button>
				</Link>
				<ThemeToggle />
			</div>
		</header>
	)
}
