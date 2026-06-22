'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { RotateCw } from 'lucide-react'

import { useMediaQuery } from '@/components/hooks/useMediaQuery'
import { useSpeech } from '@/components/hooks/useSpeech'
import { type CharState, useTyping } from '@/components/hooks/useTyping'
import { Loading } from '@/components/Loading'
import { Button } from '@/components/ui/button'
import { VoiceSetup } from '@/components/VoiceSetup'
import { TypingData } from '@/utils/typingData'

const STATE_CLASS: Record<CharState['state'], string> = {
	pending: 'text-muted-foreground/80',
	correct: 'text-foreground',
	incorrect: 'text-red-500 bg-red-500/15',
}

export default function TypingPage() {
	const [isLoading, setIsLoading] = useState(true)
	const [item, setItem] = useState<TypingData | null>(null)
	const [sourceEnabled, setSourceEnabled] = useState(true)
	const [targetEnabled, setTargetEnabled] = useState(true)
	const [voiceVolume, setVoiceVolume] = useState(100)
	const [sourceVoiceURI, setSourceVoiceURI] = useState<string>()
	const [targetVoiceURI, setTargetVoiceURI] = useState<string>()
	const inputRef = useRef<HTMLInputElement>(null)
	const seenRef = useRef<string[]>([])
	const scrollRef = useRef<HTMLDivElement>(null)

	const isMobile = useMediaQuery('(max-width: 768px)')

	const { speak, speakTranslation } = useSpeech({
		sourceLang: 'en',
		targetLang: 'pt-BR',
		sourceVoiceURI,
		targetVoiceURI,
		sourceEnabled,
		targetEnabled,
		volume: voiceVolume,
	})

	const fetchNext = useCallback(async () => {
		const res = await fetch('/api/typing', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ seen: seenRef.current }),
		})
		const next: TypingData = await res.json()
		setItem(next)
		if (inputRef.current) inputRef.current.value = ''
		inputRef.current?.focus()
	}, [])

	useEffect(() => {
		fetchNext().finally(() => setIsLoading(false))
	}, [fetchNext])

	const chunks = useMemo(() => item?.data.map(([en]) => en) ?? [], [item])

	const { chars, handleInput, reset } = useTyping(chunks, {
		onWordComplete: word => speak(word),
		onChunkComplete: i => item && speakTranslation(item.data[i][1]),
		onComplete: () => {
			if (item) seenRef.current = [...seenRef.current, item.id]
			setIsLoading(true)
			fetchNext().finally(() => setIsLoading(false))
		},
	})

	const caretRef = useRef<HTMLSpanElement>(null)
	const currentIndex = chars.findIndex(c => c.current)

	useEffect(() => {
		const container = scrollRef.current
		const caret = caretRef.current
		if (!container || !caret) return

		const caretTop =
			caret.getBoundingClientRect().top -
			container.getBoundingClientRect().top +
			container.scrollTop

		const top = isMobile
			? caretTop - container.clientHeight / 2 + caret.offsetHeight / 2 // center
			: caretTop // start

		container.scrollTo({ top, behavior: 'smooth' })
	}, [isMobile, currentIndex])

	const handleReset = () => {
		reset()
		if (inputRef.current) inputRef.current.value = ''
		inputRef.current?.focus()
	}

	return (
		<div className="w-full min-h-0 flex flex-col flex-1 items-end justify-center gap-2 mx-auto p-4">
			<div className="flex items-center gap-2">
				<Button onClick={handleReset} variant="outline">
					<RotateCw />
					Reiniciar
				</Button>

				<VoiceSetup
					enableSourceVoice={sourceEnabled}
					onCheckedEnableSourceVoice={setSourceEnabled}
					enableTargetVoice={targetEnabled}
					onCheckedEnableTargetVoice={setTargetEnabled}
					voiceVolume={voiceVolume}
					onVoiceVolumeChange={setVoiceVolume}
					sourceVoiceURI={sourceVoiceURI}
					onChangeSourceVoiceURI={setSourceVoiceURI}
					targetVoiceURI={targetVoiceURI}
					onChangeTargetVoiceURI={setTargetVoiceURI}
				/>
			</div>

			<div
				onClick={() => inputRef.current?.focus()}
				className="w-full min-h-28 flex flex-col border border-border rounded-md bg-card p-2"
			>
				{isLoading ? (
					<div className="w-full flex items-center justify-center flex-1">
						<Loading />
					</div>
				) : (
					<div
						ref={scrollRef}
						className="text-4xl leading-15 cursor-text select-none max-h-[50vh] overflow-hidden"
					>
						{chars.map(({ char, state, current }, i) => (
							<span
								key={i}
								ref={current ? caretRef : null}
								className={`relative ${STATE_CLASS[state]}`}
							>
								{current && (
									<span className="absolute left-0 top-0 bottom-0 w-0.5 bg-primary animate-caret-blink" />
								)}
								{char}
							</span>
						))}
					</div>
				)}
			</div>

			<input
				ref={inputRef}
				autoFocus
				onInput={e => handleInput(e.currentTarget.value)}
				onCompositionEnd={e => handleInput(e.currentTarget.value)}
				className="absolute opacity-0 w-px h-px"
				aria-label="Typing input"
			/>
		</div>
	)
}
