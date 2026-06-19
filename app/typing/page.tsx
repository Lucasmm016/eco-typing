'use client'

import { useRef, useState } from 'react'

import { useSpeech } from '@/components/hooks/useSpeech'
import { type CharState, useTyping } from '@/components/hooks/useTyping'
import { VoiceSelect } from '@/components/VoiceSelect'

// const data = `When you're on the highway, use cruise control, which helps maintain a constant speed. Use the highest gear possible and overdrive gears if you have them. The faster an engine is turning, the more gas you're using. Pay attention to your tachometer. Plus, a slower turning engine means less friction and engine wear. Avoid excessive idling.`

const data = [
	["When you're on the highway,", 'Quando você está na rodovia,'],
	['use cruise control,', 'use o piloto automático,'],
	['which helps maintain', 'que ajuda a manter'],
	['a constant speed.', 'uma velocidade constante.'],
	['Use the highest gear possible', 'Use a marcha mais alta possível'],
	['and overdrive gears', 'e as marchas overdrive'],
	['if you have them.', 'se você as tiver.'],
	['The faster an engine is turning,', 'Quanto mais rápido o motor gira,'],
	["the more gas you're using.", 'mais gasolina você gasta.'],
	['Pay attention to', 'Preste atenção ao'],
	['your tachometer.', 'seu tacômetro.'],
	['Plus,', 'Além disso,'],
	['a slower turning engine', 'um motor que gira mais devagar'],
	['means less friction', 'significa menos atrito'],
	['and engine wear.', 'e menos desgaste do motor.'],
	['Avoid excessive idling.', 'Evite a marcha lenta excessiva.'],
]

const chunks = data.map(([en]) => en)

const STATE_CLASS: Record<CharState['state'], string> = {
	pending: 'text-muted-foreground/80',
	correct: 'text-foreground',
	incorrect: 'text-red-500 bg-red-500/15',
}

export default function TypingPage() {
	const [sourceVoiceURI, setSourceVoiceURI] = useState<string>()
	const [targetVoiceURI, setTargetVoiceURI] = useState<string>()

	const { speak, speakTranslation } = useSpeech({
		sourceLang: 'en',
		targetLang: 'pt-BR',
		sourceVoiceURI,
		targetVoiceURI,
	})

	const { chars, handleInput } = useTyping(chunks, {
		onWordComplete: word => speak(word),
		onChunkComplete: i => speakTranslation(data[i][1]),
	})

	const inputRef = useRef<HTMLInputElement>(null)

	return (
		<div
			className="w-full flex flex-col flex-1 items-end justify-center gap-2 mx-auto p-4"
			onClick={() => inputRef.current?.focus()}
		>
			<div className="flex items-center gap-2">
				<VoiceSelect
					language="en"
					value={sourceVoiceURI}
					onChange={setSourceVoiceURI}
					label="Voz nativa"
					cookieName="voice-native"
				/>
				<VoiceSelect
					language="pt-BR"
					value={targetVoiceURI}
					onChange={setTargetVoiceURI}
					label="Voz de tradução"
					cookieName="voice-translate"
				/>
			</div>

			<div className="w-full mx-auto bg-card border border-border p-2 rounded-md">
				<div className="text-4xl leading-15 cursor-text select-none">
					{chars.map(({ char, state, current }, i) => (
						<span key={i} className={`relative ${STATE_CLASS[state]}`}>
							{current && (
								<span className="absolute left-0 top-0 bottom-0 w-0.5 bg-primary animate-caret-blink" />
							)}
							{char}
						</span>
					))}
				</div>
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
