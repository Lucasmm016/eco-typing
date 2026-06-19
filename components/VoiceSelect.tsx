'use client'

import { useEffect, useState } from 'react'

import { deleteCookie, getCookie, setCookie } from '@/lib/cookies'

import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from './ui/select'

interface Props {
	language: string
	value?: string
	onChange: (voiceURI: string) => void
	label?: string
	cookieName?: string
}

const COOKIE_MAX_AGE = 60 * 60 * 24 * 30 // 30 dias

export function VoiceSelect({ language, value, onChange, label, cookieName = 'voice' }: Props) {
	const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])

	useEffect(() => {
		if (!('speechSynthesis' in window)) return

		const prefix = language.slice(0, 2).toLowerCase()

		const load = () =>
			setVoices(
				window.speechSynthesis.getVoices().filter(v => v.lang.toLowerCase().startsWith(prefix)),
			)

		load()
		// addEventListener (não onvoiceschanged=) para não conflitar com outras instâncias
		window.speechSynthesis.addEventListener('voiceschanged', load)
		return () => window.speechSynthesis.removeEventListener('voiceschanged', load)
	}, [language])

	useEffect(() => {
		const cookie = getCookie(cookieName)
		if (!cookie) return
		onChange(cookie)
	}, [onChange, cookieName])

	useEffect(() => {
		if (value) {
			setCookie(cookieName, value, { path: '/', maxAge: COOKIE_MAX_AGE })
		} else {
			deleteCookie(cookieName)
		}
	}, [cookieName, value])

	return (
		<Select value={value ?? ''} onValueChange={onChange}>
			<SelectTrigger>
				<SelectValue placeholder={label || 'Selecione uma voz'} />
			</SelectTrigger>
			<SelectContent align="end" side="top">
				<SelectGroup>
					{voices.map(voice => (
						<SelectItem key={voice.voiceURI} value={voice.voiceURI}>
							{voice.name} · {voice.lang}
						</SelectItem>
					))}
				</SelectGroup>
			</SelectContent>
		</Select>
	)
}
