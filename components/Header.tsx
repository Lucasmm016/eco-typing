import { ThemeToggle } from './ModeToggle'

export function Header() {
	return (
		<header className="w-full flex items-center justify-end p-4">
			<ThemeToggle />
		</header>
	)
}
