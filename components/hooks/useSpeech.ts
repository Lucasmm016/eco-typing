'use client'

import { useCallback, useEffect, useState } from 'react'

interface Props {
	sourceLang: string
	targetLang: string
	sourceVoiceURI?: string
	targetVoiceURI?: string
}

const VOICE_VOLUME = 1 // 0 a 1 — volume da voz
const SOURCE_RATE = 1.5 // velocidade voz nativa
const TARGET_RATE = 1.5 // velocidade voz de tradução

export function useSpeech({ sourceLang, targetLang, sourceVoiceURI, targetVoiceURI }: Props) {
	const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])

	useEffect(() => {
		if (!('speechSynthesis' in window)) return
		const load = () => setVoices(window.speechSynthesis.getVoices())
		load()
		window.speechSynthesis.onvoiceschanged = load
		return () => {
			window.speechSynthesis.onvoiceschanged = null
		}
	}, [])

	const speakWith = useCallback(
		(text: string, lang: string, rate: number, voiceURI?: string) => {
			if (!('speechSynthesis' in window)) return

			const voice = voices.find(v => v.voiceURI === voiceURI)
			const utterance = new SpeechSynthesisUtterance(text)

			utterance.lang = voice?.lang ?? lang

			if (voice) utterance.voice = voice

			utterance.volume = VOICE_VOLUME
			utterance.rate = rate
			window.speechSynthesis.speak(utterance)
		},
		[voices],
	)

	const speak = useCallback(
		(text: string) => speakWith(text, sourceLang, SOURCE_RATE, sourceVoiceURI),
		[speakWith, sourceLang, sourceVoiceURI],
	)

	const speakTranslation = useCallback(
		(text: string) => speakWith(text, targetLang, TARGET_RATE, targetVoiceURI),
		[speakWith, targetLang, targetVoiceURI],
	)

	return { speak, speakTranslation }
}
