import Link from 'next/link'

import { Button } from '@/components/ui/button'

export default function Home() {
	return (
		<main className="w-full max-w-6xl flex flex-col flex-1 mx-auto p-4">
			<div className="w-full flex flex-col flex-1 items-center justify-center mx-auto">
				<Link href="/typing" className="w-full max-w-sm">
					<Button className="w-full">Iniciar</Button>
				</Link>
			</div>
		</main>
	)
}
