'use client'

import { type RefObject, useEffect, useMemo, useRef, useState } from 'react'

interface Props {
	onWordComplete?: (word: string) => void
	onChunkComplete?: (index: number) => void
	onComplete?: () => void
}

export type CharState = {
	char: string
	state: 'pending' | 'correct' | 'incorrect'
	current: boolean
}

const KEY_SPRITE = [
	0.04, 0.8, 1.61, 2.43, 3.23, 4.05, 4.84, 5.66, 6.47, 7.26, 8.08, 8.92, 9.73, 10.56, 11.29, 12.1,
]
const KEY_CLIP = 0.2
const VOLUME = 0.1

// ´ ` e aspas tipográficas → apóstrofo/aspas retos
const normalize = (ch: string) =>
	ch.replace(/[\u00B4\u0060\u2018\u2019\u02BC]/g, "'").replace(/[\u201C\u201D]/g, '"')

export function useTyping(
	chunks: string[],
	{ onWordComplete, onChunkComplete, onComplete }: Props = {},
) {
	const [typed, setTyped] = useState('')
	const [maxLen, setMaxLen] = useState(0)

	const ctxRef = useRef<AudioContext | null>(null)
	const gainRef = useRef<GainNode | null>(null)
	const keyBufferRef = useRef<AudioBuffer | null>(null)
	const errorBufferRef = useRef<AudioBuffer | null>(null)

	const text = useMemo(() => chunks.join(' '), [chunks])

	// reset ao trocar de passagem (ajuste de estado no render, sem efeito)
	const [prevText, setPrevText] = useState(text)
	if (text !== prevText) {
		setPrevText(text)
		setTyped('')
		setMaxLen(0)
	}

	// palavras com a posição onde terminam (ignora pontuação colada)
	const words = useMemo(() => {
		const result: { text: string; end: number }[] = []
		for (const m of text.matchAll(/[\p{L}\p{N}']+/gu)) {
			result.push({ text: m[0], end: (m.index ?? 0) + m[0].length })
		}
		return result
	}, [text])

	// posição onde cada trecho termina
	const chunkEnds = useMemo(() => {
		const ends: number[] = []
		let pos = 0
		for (const chunk of chunks) {
			pos += chunk.length
			ends.push(pos)
			pos += 1
		}
		return ends
	}, [chunks])

	useEffect(() => {
		const ctx = new AudioContext()
		ctxRef.current = ctx

		const gain = ctx.createGain()
		gain.gain.value = VOLUME
		gain.connect(ctx.destination)
		gainRef.current = gain

		const load = (url: string, ref: RefObject<AudioBuffer | null>) =>
			fetch(url)
				.then(r => r.arrayBuffer())
				.then(buf => ctx.decodeAudioData(buf))
				.then(b => {
					ref.current = b
				})
				.catch(() => {})

		load('/keysprite.mp3', keyBufferRef)
		load('/error.mp3', errorBufferRef)

		return () => {
			ctx.close()
		}
	}, [])

	const play = (buffer: AudioBuffer | null, offset = 0, duration?: number) => {
		const ctx = ctxRef.current
		if (!ctx || !buffer || !gainRef.current) return
		if (ctx.state === 'suspended') ctx.resume()
		const src = ctx.createBufferSource()
		src.buffer = buffer
		src.connect(gainRef.current)
		src.start(0, offset, duration)
	}

	const handleInput = (value: string) => {
		const next = value.slice(0, text.length)

		if (next.length > typed.length) {
			const i = next.length - 1
			const offset = KEY_SPRITE[Math.floor(Math.random() * KEY_SPRITE.length)]
			play(keyBufferRef.current, offset, KEY_CLIP)
			if (normalize(next[i]) !== normalize(text[i])) play(errorBufferRef.current)

			// dispara só ao alcançar terreno novo (além do já digitado antes)
			for (const word of words) {
				if (word.end > maxLen && word.end <= next.length) onWordComplete?.(word.text)
			}
			chunkEnds.forEach((end, index) => {
				if (end > maxLen && end <= next.length) onChunkComplete?.(index)
			})

			if (maxLen < text.length && next.length === text.length) onComplete?.()
		}

		if (next.length > maxLen) setMaxLen(next.length)
		setTyped(next)
	}

	const chars = useMemo<CharState[]>(
		() =>
			text.split('').map((char, i) => ({
				char,
				state:
					typed[i] == null
						? 'pending'
						: normalize(typed[i]) === normalize(char)
							? 'correct'
							: 'incorrect',
				current: i === typed.length,
			})),
		[text, typed],
	)

	return { chars, handleInput }
}
