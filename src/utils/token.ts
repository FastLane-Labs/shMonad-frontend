import { Token } from '@/types'

export function tokenCmp(a: Token, b: Token): boolean {
  return a.address === b.address && a.chainId === b.chainId
}
