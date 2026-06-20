import { NextRequest, NextResponse } from 'next/server'

import { typingData } from '@/utils/typingData'

export async function GET(req: NextRequest) {
	const randomData = typingData[Math.floor(Math.random() * typingData.length)]
	return NextResponse.json({ data: randomData })
}
