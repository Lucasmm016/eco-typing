'use client'

import { useTheme } from 'next-themes'
import { Moon, Sun } from 'lucide-react'

export function ThemeToggle() {
	const { setTheme, theme } = useTheme()

	function handleClick() {
		if (theme === 'light') {
			setTheme('dark')
		} else {
			setTheme('light')
		}
	}

	return (
		<button onClick={handleClick} className="cursor-pointer">
			<Sun className="size-5 min-w-5 min-h-5 block dark:hidden transition-all rotate-0 dark:-rotate-90" />
			<Moon className="size-5 min-w-5 min-h-5 hidden dark:block transition-all rotate-90 dark:rotate-0" />
		</button>
	)
}
