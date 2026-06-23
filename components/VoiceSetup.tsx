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
	voiceVolume: number
	onVoiceVolumeChange: (value: number) => void
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
const COOKIE_NAME_VOICE_VOLUME = 'voice-volume'
const COOKIE_NAME_SOURCE_VOICE_URI = 'voice-source'
const COOKIE_NAME_TARGET_VOICE_URI = 'voice-target'
const COOKIE_NAME_SOURCE_RATE = 'voice-source-rate'
const COOKIE_NAME_TARGET_RATE = 'voice-target-rate'
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30 // 30 dias

const SOURCE_LANGUAGE = 'en-US'
const TARGET_LANGUAGE = 'pt-BR'
const DEFAULT_VOICE_RATE = 1.25

export function VoiceSetup({
	enableSourceVoice,
	onCheckedEnableSourceVoice,
	enableTargetVoice,
	onCheckedEnableTargetVoice,
	voiceVolume,
	onVoiceVolumeChange,
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
	const debouncedVoiceVolume = useDebounce(voiceVolume)

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
		const cookieSourceVoice = getCookie(COOKIE_NAME_SOURCE_VOICE_ENABLE)

		if (cookieSourceVoice === 'disabled') {
			onCheckedEnableSourceVoice(false)
		}

		const cookieTargetVoice = getCookie(COOKIE_NAME_TARGET_VOICE_ENABLE)

		if (cookieTargetVoice === 'disabled') {
			onCheckedEnableTargetVoice(false)
		}

		const cookieVoiceVolume = getCookie(COOKIE_NAME_VOICE_VOLUME)
		const savedVoiceVolume = cookieVoiceVolume ? Number(cookieVoiceVolume) : undefined

		if (savedVoiceVolume !== undefined) {
			onVoiceVolumeChange(savedVoiceVolume)
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
		if (debouncedVoiceVolume === 100) {
			deleteCookie(COOKIE_NAME_VOICE_VOLUME)
		} else {
			setCookie(COOKIE_NAME_VOICE_VOLUME, debouncedVoiceVolume.toString(), {
				path: '/',
				maxAge: COOKIE_MAX_AGE,
			})
		}
	}, [debouncedVoiceVolume])

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
								>
									Voz nativa
								</DropdownMenuCheckboxItem>
								<DropdownMenuCheckboxItem
									checked={enableTargetVoice}
									onCheckedChange={onCheckedEnableTargetVoice}
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
								<DropdownMenuLabel>Volume geral {voiceVolume}%</DropdownMenuLabel>
								<DropdownMenuItem className="p-4">
									<Slider
										value={[voiceVolume]}
										onValueChange={([value]) => onVoiceVolumeChange(value)}
										max={100}
										step={1}
										className="mx-auto w-full"
									/>
								</DropdownMenuItem>
							</DropdownMenuSubContent>
						</DropdownMenuPortal>
					</DropdownMenuSub>

					<DropdownMenuSub>
						<DropdownMenuSubTrigger>Voz nativa</DropdownMenuSubTrigger>
						<DropdownMenuPortal>
							<DropdownMenuSubContent>
								<DropdownMenuLabel>Escolha uma voz</DropdownMenuLabel>
								<DropdownMenuRadioGroup
									value={sourceVoiceURI}
									onValueChange={onChangeSourceVoiceURI}
								>
									{voices
										.filter(i => i.lang.toLowerCase().startsWith(SOURCE_LANGUAGE.toLowerCase()))
										.map(voice => (
											<DropdownMenuRadioItem key={voice.voiceURI} value={voice.voiceURI}>
												{voice.name}
											</DropdownMenuRadioItem>
										))}
								</DropdownMenuRadioGroup>
							</DropdownMenuSubContent>
						</DropdownMenuPortal>
					</DropdownMenuSub>

					<DropdownMenuSub>
						<DropdownMenuSubTrigger>Voz de tradução</DropdownMenuSubTrigger>
						<DropdownMenuPortal>
							<DropdownMenuSubContent>
								<DropdownMenuLabel>Escolha uma voz</DropdownMenuLabel>
								<DropdownMenuRadioGroup
									value={targetVoiceURI}
									onValueChange={onChangeTargetVoiceURI}
								>
									{voices
										.filter(i => i.lang.toLowerCase().startsWith(TARGET_LANGUAGE.toLowerCase()))
										.map(voice => (
											<DropdownMenuRadioItem key={voice.voiceURI} value={voice.voiceURI}>
												{voice.name}
											</DropdownMenuRadioItem>
										))}
								</DropdownMenuRadioGroup>
							</DropdownMenuSubContent>
						</DropdownMenuPortal>
					</DropdownMenuSub>

					<DropdownMenuSub>
						<DropdownMenuSubTrigger>Velocidade</DropdownMenuSubTrigger>
						<DropdownMenuPortal>
							<DropdownMenuSubContent>
								<DropdownMenuLabel>Voz nativa</DropdownMenuLabel>
								<DropdownMenuRadioGroup
									value={String(sourceRate)}
									onValueChange={value => onChangeSourceRate(Number(value))}
								>
									<DropdownMenuRadioItem value="1">1.0x</DropdownMenuRadioItem>
									<DropdownMenuRadioItem value="1.25">1.25x</DropdownMenuRadioItem>
									<DropdownMenuRadioItem value="1.5">1.5x</DropdownMenuRadioItem>
									<DropdownMenuRadioItem value="2">2.0x</DropdownMenuRadioItem>
								</DropdownMenuRadioGroup>
								<DropdownMenuLabel>Voz de tradução</DropdownMenuLabel>
								<DropdownMenuRadioGroup
									value={String(targetRate)}
									onValueChange={value => onChangeTargetRate(Number(value))}
								>
									<DropdownMenuRadioItem value="1">1.0x</DropdownMenuRadioItem>
									<DropdownMenuRadioItem value="1.25">1.25x</DropdownMenuRadioItem>
									<DropdownMenuRadioItem value="1.5">1.5x</DropdownMenuRadioItem>
									<DropdownMenuRadioItem value="2">2.0x</DropdownMenuRadioItem>
								</DropdownMenuRadioGroup>
							</DropdownMenuSubContent>
						</DropdownMenuPortal>
					</DropdownMenuSub>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
