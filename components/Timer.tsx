'use client'

import { useEffect, useState } from 'react'
import { Clock } from 'lucide-react'

interface Props {
	startedAt: number | null
}

function format(ms: number) {
	const total = Math.floor(ms / 1000)
	const h = Math.floor(total / 3600)
	const m = Math.floor((total % 3600) / 60)
	const s = total % 60
	const pad = (n: number) => n.toString().padStart(2, '0')
	return h > 0 ? `${pad(h)}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`
}

export function Timer({ startedAt }: Props) {
	const [now, setNow] = useState(() => Date.now())

	useEffect(() => {
		if (startedAt === null) return
		const id = setInterval(() => setNow(Date.now()), 1000)
		return () => clearInterval(id)
	}, [startedAt])

	const elapsed = startedAt === null ? 0 : Math.max(0, now - startedAt)

	return (
		<div className="flex items-center gap-2">
			<Clock className="size-4" />
			<span>{format(elapsed)}</span>
		</div>
	)
}
