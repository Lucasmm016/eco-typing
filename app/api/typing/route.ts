import { NextRequest, NextResponse } from 'next/server'

import { typingData } from '@/utils/typingData'

export async function POST(req: NextRequest) {
	const body = await req.json()
	const seen: string[] = Array.isArray(body?.seen) ? body.seen : []

	const remaining = typingData.filter(item => !seen.includes(item.id))
	const pool = remaining.length > 0 ? remaining : typingData
	const random = pool[Math.floor(Math.random() * pool.length)]

	return NextResponse.json({ id: random.id, title: random.title, data: random.data })
}
