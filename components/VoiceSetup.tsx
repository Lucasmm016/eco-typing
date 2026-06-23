'use client'

import { useEffect, useState } from 'react'
import { AudioLines } from 'lucide-react'

import { deleteCookie, getCookie, setCookie } from '@/lib/cookies'

import { useDebounce } from './hooks/useDebounce'
import { Button } from './ui/button'
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuPortal,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { Slider } from './ui/slider'

interface Props {
	enableSourceVoice: boolean
	onCheckedEnableSourceVoice: (checked: boolean) => void
	enableTargetVoice: boolean
	onCheckedEnableTargetVoice: (checked: boolean) => void
	sourceVoiceVolume: number
	onChangeSourceVoiceVolume: (value: number) => void
	targetVoiceVolume: number
	onChangeTargetVoiceVolume: (value: number) => void
	sourceVoiceURI?: string
	onChangeSourceVoiceURI: (value: string) => void
	targetVoiceURI?: string
	onChangeTargetVoiceURI: (value: string) => void
	sourceRate?: number
	onChangeSourceRate: (value: number) => void
	targetRate?: number
	onChangeTargetRate: (value: number) => void
}

const COOKIE_NAME_SOURCE_VOICE_ENABLE = 'voice-source-enable'
const COOKIE_NAME_TARGET_VOICE_ENABLE = 'voice-target-enable'
const COOKIE_NAME_SOURCE_VOICE_VOLUME = 'voice-source-volume'
const COOKIE_NAME_TARGET_VOICE_VOLUME = 'voice-target-volume'
const COOKIE_NAME_SOURCE_VOICE_URI = 'voice-source-uri'
const COOKIE_NAME_TARGET_VOICE_URI = 'voice-target-uri'
const COOKIE_NAME_SOURCE_RATE = 'voice-source-rate'
const COOKIE_NAME_TARGET_RATE = 'voice-target-rate'
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30 // 30 dias

const SOURCE_LANGUAGE = 'en-US'
const TARGET_LANGUAGE = 'pt-BR'
const DEFAULT_VOICE_RATE = 1.25

const keepOpen = (event: Event) => event.preventDefault()

const RATES_MAP = [
	{ value: '1', label: '1.0x' },
	{ value: '1.25', label: '1.25x' },
	{ value: '1.5', label: '1.5x' },
	{ value: '2', label: '2.0x' },
]

export function VoiceSetup({
	enableSourceVoice,
	onCheckedEnableSourceVoice,
	enableTargetVoice,
	onCheckedEnableTargetVoice,
	sourceVoiceVolume,
	onChangeSourceVoiceVolume,
	targetVoiceVolume,
	onChangeTargetVoiceVolume,
	sourceVoiceURI,
	onChangeSourceVoiceURI,
	targetVoiceURI,
	onChangeTargetVoiceURI,
	sourceRate,
	onChangeSourceRate,
	targetRate,
	onChangeTargetRate,
}: Props) {
	const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])

	const debouncedSourceVoiceVolume = useDebounce(sourceVoiceVolume)
	const debouncedTargetVoiceVolume = useDebounce(targetVoiceVolume)

	useEffect(() => {
		const cookieSourceVoice = getCookie(COOKIE_NAME_SOURCE_VOICE_ENABLE)

		if (cookieSourceVoice === 'disabled') {
			onCheckedEnableSourceVoice(false)
		}

		const cookieTargetVoice = getCookie(COOKIE_NAME_TARGET_VOICE_ENABLE)

		if (cookieTargetVoice === 'disabled') {
			onCheckedEnableTargetVoice(false)
		}

		const cookieSourceVoiceVolume = getCookie(COOKIE_NAME_SOURCE_VOICE_VOLUME)
		const savedSourceVoiceVolume = cookieSourceVoiceVolume
			? Number(cookieSourceVoiceVolume)
			: undefined

		if (savedSourceVoiceVolume !== undefined) {
			onChangeSourceVoiceVolume(savedSourceVoiceVolume)
		}

		const cookieTargetVoiceVolume = getCookie(COOKIE_NAME_TARGET_VOICE_VOLUME)
		const savedTargetVoiceVolume = cookieTargetVoiceVolume
			? Number(cookieTargetVoiceVolume)
			: undefined

		if (savedTargetVoiceVolume !== undefined) {
			onChangeTargetVoiceVolume(savedTargetVoiceVolume)
		}

		const cookieSourceVoiceURI = getCookie(COOKIE_NAME_SOURCE_VOICE_URI)

		if (cookieSourceVoiceURI) {
			onChangeSourceVoiceURI(cookieSourceVoiceURI)
		}

		const cookieTargetVoiceURI = getCookie(COOKIE_NAME_TARGET_VOICE_URI)

		if (cookieTargetVoiceURI) {
			onChangeTargetVoiceURI(cookieTargetVoiceURI)
		}

		const cookieSourceRate = getCookie(COOKIE_NAME_SOURCE_RATE)
		if (cookieSourceRate) onChangeSourceRate(Number(cookieSourceRate))

		const cookieTargetRate = getCookie(COOKIE_NAME_TARGET_RATE)
		if (cookieTargetRate) onChangeTargetRate(Number(cookieTargetRate))

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	useEffect(() => {
		if (!('speechSynthesis' in window)) return

		const load = () =>
			setVoices(
				window.speechSynthesis
					.getVoices()
					.filter(
						v =>
							v.lang.toLowerCase().startsWith(SOURCE_LANGUAGE.toLowerCase()) ||
							v.lang.toLowerCase().startsWith(TARGET_LANGUAGE.toLowerCase()),
					),
			)

		load()
		// addEventListener (não onvoiceschanged=) para não conflitar com outras instâncias
		window.speechSynthesis.addEventListener('voiceschanged', load)
		return () => window.speechSynthesis.removeEventListener('voiceschanged', load)
	}, [])

	useEffect(() => {
		if (enableSourceVoice) {
			deleteCookie(COOKIE_NAME_SOURCE_VOICE_ENABLE)
		} else {
			setCookie(COOKIE_NAME_SOURCE_VOICE_ENABLE, 'disabled', { path: '/', maxAge: COOKIE_MAX_AGE })
		}
	}, [enableSourceVoice])

	useEffect(() => {
		if (enableTargetVoice) {
			deleteCookie(COOKIE_NAME_TARGET_VOICE_ENABLE)
		} else {
			setCookie(COOKIE_NAME_TARGET_VOICE_ENABLE, 'disabled', { path: '/', maxAge: COOKIE_MAX_AGE })
		}
	}, [enableTargetVoice])

	useEffect(() => {
		if (debouncedSourceVoiceVolume === 100) {
			deleteCookie(COOKIE_NAME_SOURCE_VOICE_VOLUME)
		} else {
			setCookie(COOKIE_NAME_SOURCE_VOICE_VOLUME, debouncedSourceVoiceVolume.toString(), {
				path: '/',
				maxAge: COOKIE_MAX_AGE,
			})
		}
	}, [debouncedSourceVoiceVolume])

	useEffect(() => {
		if (debouncedTargetVoiceVolume === 100) {
			deleteCookie(COOKIE_NAME_TARGET_VOICE_VOLUME)
		} else {
			setCookie(COOKIE_NAME_TARGET_VOICE_VOLUME, debouncedTargetVoiceVolume.toString(), {
				path: '/',
				maxAge: COOKIE_MAX_AGE,
			})
		}
	}, [debouncedTargetVoiceVolume])

	useEffect(() => {
		if (sourceVoiceURI) {
			setCookie(COOKIE_NAME_SOURCE_VOICE_URI, sourceVoiceURI, { path: '/', maxAge: COOKIE_MAX_AGE })
		} else {
			deleteCookie(COOKIE_NAME_SOURCE_VOICE_URI)
		}
	}, [sourceVoiceURI])

	useEffect(() => {
		if (targetVoiceURI) {
			setCookie(COOKIE_NAME_TARGET_VOICE_URI, targetVoiceURI, { path: '/', maxAge: COOKIE_MAX_AGE })
		} else {
			deleteCookie(COOKIE_NAME_TARGET_VOICE_URI)
		}
	}, [targetVoiceURI])

	useEffect(() => {
		if (!sourceRate || sourceRate === DEFAULT_VOICE_RATE) {
			deleteCookie(COOKIE_NAME_SOURCE_RATE)
		} else {
			setCookie(COOKIE_NAME_SOURCE_RATE, sourceRate.toString(), {
				path: '/',
				maxAge: COOKIE_MAX_AGE,
			})
		}
	}, [sourceRate])

	useEffect(() => {
		if (!targetRate || targetRate === DEFAULT_VOICE_RATE) {
			deleteCookie(COOKIE_NAME_TARGET_RATE)
		} else {
			setCookie(COOKIE_NAME_TARGET_RATE, targetRate.toString(), {
				path: '/',
				maxAge: COOKIE_MAX_AGE,
			})
		}
	}, [targetRate])

	const sourceVoices = voices.filter(i =>
		i.lang.toLowerCase().startsWith(SOURCE_LANGUAGE.toLowerCase()),
	)

	const targetVoices = voices.filter(i =>
		i.lang.toLowerCase().startsWith(TARGET_LANGUAGE.toLowerCase()),
	)

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline">
					<AudioLines />
					Vozes
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-48 max-w-full">
				<DropdownMenuGroup>
					<DropdownMenuSub>
						<DropdownMenuSubTrigger>Vozes ativas</DropdownMenuSubTrigger>
						<DropdownMenuPortal>
							<DropdownMenuSubContent>
								<DropdownMenuCheckboxItem
									checked={enableSourceVoice}
									onCheckedChange={onCheckedEnableSourceVoice}
									onSelect={keepOpen}
								>
									Voz nativa
								</DropdownMenuCheckboxItem>
								<DropdownMenuCheckboxItem
									checked={enableTargetVoice}
									onCheckedChange={onCheckedEnableTargetVoice}
									onSelect={keepOpen}
								>
									Voz de tradução
								</DropdownMenuCheckboxItem>
							</DropdownMenuSubContent>
						</DropdownMenuPortal>
					</DropdownMenuSub>

					<DropdownMenuSub>
						<DropdownMenuSubTrigger>Volume</DropdownMenuSubTrigger>
						<DropdownMenuPortal>
							<DropdownMenuSubContent className="w-48 max-w-full">
								<DropdownMenuLabel>Voz nativa: {sourceVoiceVolume}%</DropdownMenuLabel>
								<DropdownMenuItem className="p-4" onSelect={keepOpen}>
									<Slider
										value={[sourceVoiceVolume]}
										onValueChange={([value]) => onChangeSourceVoiceVolume(value)}
										max={100}
										step={1}
										className="mx-auto w-full"
									/>
								</DropdownMenuItem>
								<DropdownMenuLabel>Voz de tradução: {targetVoiceVolume}%</DropdownMenuLabel>
								<DropdownMenuItem className="p-4" onSelect={keepOpen}>
									<Slider
										value={[targetVoiceVolume]}
										onValueChange={([value]) => onChangeTargetVoiceVolume(value)}
										max={100}
										step={1}
										className="mx-auto w-full"
									/>
								</DropdownMenuItem>
							</DropdownMenuSubContent>
						</DropdownMenuPortal>
					</DropdownMenuSub>

					{sourceVoices.length > 0 && (
						<DropdownMenuSub>
							<DropdownMenuSubTrigger>Voz nativa</DropdownMenuSubTrigger>
							<DropdownMenuPortal>
								<DropdownMenuSubContent>
									<DropdownMenuLabel>Escolha uma voz</DropdownMenuLabel>
									<DropdownMenuRadioGroup
										value={sourceVoiceURI}
										onValueChange={onChangeSourceVoiceURI}
									>
										{sourceVoices.map(voice => (
											<DropdownMenuRadioItem
												key={voice.voiceURI}
												value={voice.voiceURI}
												onSelect={keepOpen}
											>
												{voice.name}
											</DropdownMenuRadioItem>
										))}
									</DropdownMenuRadioGroup>
								</DropdownMenuSubContent>
							</DropdownMenuPortal>
						</DropdownMenuSub>
					)}

					{targetVoices.length > 0 && (
						<DropdownMenuSub>
							<DropdownMenuSubTrigger>Voz de tradução</DropdownMenuSubTrigger>
							<DropdownMenuPortal>
								<DropdownMenuSubContent>
									<DropdownMenuLabel>Escolha uma voz</DropdownMenuLabel>
									<DropdownMenuRadioGroup
										value={targetVoiceURI}
										onValueChange={onChangeTargetVoiceURI}
									>
										{targetVoices.map(voice => (
											<DropdownMenuRadioItem
												key={voice.voiceURI}
												value={voice.voiceURI}
												onSelect={keepOpen}
											>
												{voice.name}
											</DropdownMenuRadioItem>
										))}
									</DropdownMenuRadioGroup>
								</DropdownMenuSubContent>
							</DropdownMenuPortal>
						</DropdownMenuSub>
					)}

					<DropdownMenuSub>
						<DropdownMenuSubTrigger>Velocidade</DropdownMenuSubTrigger>
						<DropdownMenuPortal>
							<DropdownMenuSubContent>
								<DropdownMenuLabel>Voz nativa</DropdownMenuLabel>
								<DropdownMenuRadioGroup
									value={String(sourceRate)}
									onValueChange={value => onChangeSourceRate(Number(value))}
								>
									{RATES_MAP.map(item => (
										<DropdownMenuRadioItem key={item.value} value={item.value} onSelect={keepOpen}>
											{item.label}
										</DropdownMenuRadioItem>
									))}
								</DropdownMenuRadioGroup>
								<DropdownMenuLabel>Voz de tradução</DropdownMenuLabel>
								<DropdownMenuRadioGroup
									value={String(targetRate)}
									onValueChange={value => onChangeTargetRate(Number(value))}
								>
									{RATES_MAP.map(item => (
										<DropdownMenuRadioItem key={item.value} value={item.value} onSelect={keepOpen}>
											{item.label}
										</DropdownMenuRadioItem>
									))}
								</DropdownMenuRadioGroup>
							</DropdownMenuSubContent>
						</DropdownMenuPortal>
					</DropdownMenuSub>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
