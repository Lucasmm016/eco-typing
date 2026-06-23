'use client'

import { useCallback, useEffect, useState } from 'react'

interface Props {
	sourceLang: string
	targetLang: string
	sourceEnabled?: boolean
	targetEnabled?: boolean
	sourceVolume?: number
	targetVolume?: number
	sourceVoiceURI?: string
	targetVoiceURI?: string
	sourceRate?: number
	targetRate?: number
}

const DEFAULT_VOLUME = 100 // 0 a 100 — volume da voz
const DEFAULT_RATE = 1.25 // velocidade voz nativa

export function useSpeech({
	sourceLang,
	targetLang,
	sourceEnabled = true,
	targetEnabled = true,
	sourceVolume = DEFAULT_VOLUME,
	targetVolume = DEFAULT_VOLUME,
	sourceVoiceURI,
	targetVoiceURI,
	sourceRate = DEFAULT_RATE,
	targetRate = DEFAULT_RATE,
}: Props) {
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
		(text: string, lang: string, rate: number, volume: number, voiceURI?: string) => {
			if (!('speechSynthesis' in window)) return

			const voice = voices.find(v => v.voiceURI === voiceURI)
			const utterance = new SpeechSynthesisUtterance(text)

			utterance.lang = voice?.lang ?? lang
			if (voice) utterance.voice = voice

			utterance.volume = volume / 100
			utterance.rate = rate
			window.speechSynthesis.speak(utterance)
		},
		[voices],
	)

	const speak = useCallback(
		(text: string) => {
			if (!sourceEnabled) return
			speakWith(text, sourceLang, sourceRate, sourceVolume, sourceVoiceURI)
		},
		[speakWith, sourceLang, sourceVoiceURI, sourceEnabled, sourceRate, sourceVolume],
	)

	const speakTranslation = useCallback(
		(text: string) => {
			if (!targetEnabled) return
			speakWith(text, targetLang, targetRate, targetVolume, targetVoiceURI)
		},
		[speakWith, targetLang, targetVoiceURI, targetEnabled, targetRate, targetVolume],
	)

	return { speak, speakTranslation }
}
