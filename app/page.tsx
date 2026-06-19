import Link from 'next/link'
import { Play } from 'lucide-react'

import Logo from '@/components/icons/Logo'
import { Button } from '@/components/ui/button'

export default function Home() {
	return (
		<main className="w-full max-w-6xl flex flex-col flex-1 mx-auto p-4">
			<div className="w-full flex flex-col flex-1 items-center justify-center gap-2 mx-auto">
				<Logo className="w-52" />
				<div className="space-y-2 max-w-xl text-center text-muted-foreground">
					<p>Treine inglês digitando. Você digita um texto em inglês trecho a trecho</p>
					<p>
						a cada palavra concluída, uma voz fala a pronúncia em inglês e, ao terminar cada trecho,
						você ouve a tradução em português.
					</p>
				</div>
				<Link href="/typing" className="w-full max-w-sm">
					<Button size="lg" className="w-full">
						<Play className="fill-current" />
						Iniciar
					</Button>
				</Link>
			</div>
		</main>
	)
}
