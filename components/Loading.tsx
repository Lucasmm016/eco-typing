import { cn } from '@/lib/utils'

import { Spinner } from './ui/spinner'

export function Loading({ className }: { className?: string }) {
	return <Spinner className={cn('size-5', className)} />
}
