import Link from 'next/link'

import Github from './icons/Github'
import { Button } from './ui/button'

export function Footer() {
	return (
		<footer className="w-full border-t border-border">
			<div className="w-full max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center px-2 py-4">
				<span className="text-muted-foreground text-xs">2026 Lucas Matos Developer</span>

				<div className="flex items-center flex-wrap gap-2">
					<Link
						href="https://github.com/Lucasmm016/eco-typing.git"
						rel="noopener noreferrer"
						target="_blank"
					>
						<Button size="sm" variant="ghost">
							<Github />
							Github
						</Button>
					</Link>
				</div>
			</div>
		</footer>
	)
}
