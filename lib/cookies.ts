'use client'

export function getCookie(name: string) {
	if (typeof document === 'undefined') return undefined

	const cookieStr = document.cookie.split('; ').find(row => row.startsWith(`${name}=`))

	return cookieStr ? decodeURIComponent(cookieStr.split('=')[1]) : undefined
}

export function setCookie(
	name: string,
	value: string,
	options?: {
		path?: string
		maxAge?: number // em segundos
		domain?: string
		secure?: boolean
		sameSite?: 'Strict' | 'Lax' | 'None'
	},
): void {
	if (typeof document === 'undefined') return

	let cookie = `${name}=${encodeURIComponent(value)}`

	if (options?.path) cookie += `; path=${options.path}`
	if (options?.maxAge) cookie += `; max-age=${options.maxAge}`
	if (options?.domain) cookie += `; domain=${options.domain}`
	if (options?.secure) cookie += `; secure`
	if (options?.sameSite) cookie += `; samesite=${options.sameSite}`

	document.cookie = cookie
}

export function deleteCookie(name: string | string[], path: string = '/') {
	if (typeof document === 'undefined') return

	if (typeof name === 'string') {
		document.cookie = `${name}=; path=${path}; max-age=0`
	} else {
		name.map(i => {
			document.cookie = `${i}=; path=${path}; max-age=0`
		})
	}
}

export function hasCookie(name: string): boolean {
	if (typeof document === 'undefined') return false

	return document.cookie.split('; ').some(row => row.startsWith(`${name}=`))
}

export function getAllCookies(): Record<string, string> {
	if (typeof document === 'undefined') return {}

	return document.cookie.split('; ').reduce(
		(acc, cookieStr) => {
			const [key, value] = cookieStr.split('=')
			acc[key] = decodeURIComponent(value)
			return acc
		},
		{} as Record<string, string>,
	)
}

export function cookiesToString(): string {
	if (typeof document === 'undefined') return ''

	return document.cookie
}
