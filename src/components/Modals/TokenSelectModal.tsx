import React, { useState, useEffect } from 'react'
import ModalWrapper from '../Wrappers/ModalWrapper'
import { useTokenList } from '@/hooks/useTokenList'
import { useChainId } from 'wagmi'
import { Token } from '@/types'
import { TokenBalance } from '../TokenBalance/TokenBalance'
import { useAccount } from 'wagmi'

interface TokenSelectModalProps {
  selectedToken: Token | null
  onSelectToken: (token: Token) => void
  defaultLabel: string
}

const TokenSelectModal: React.FC<TokenSelectModalProps> = ({ selectedToken, onSelectToken, defaultLabel }) => {
  const chainId = useChainId()
  const [isOpen, setIsOpen] = useState(false)
  const { tokens, loading, error } = useTokenList(chainId)
  const [searchTerm, setSearchTerm] = useState('')

  const { address } = useAccount()

  useEffect(() => {
    if (!isOpen) {
      setSearchTerm('')
    }
  }, [isOpen])

  const handleSelect = (token: Token) => {
    onSelectToken(token)
    setIsOpen(false)
  }

  const filteredTokens = tokens.filter(
    (token) =>
      token.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      token.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <>
      <button
        className='h-12 bg-base-200 hover:bg-base-100 text-primary p-2 rounded-xl focus:outline-none appearance-none flex items-center text-nowrap w-max'
        onClick={() => setIsOpen(true)}>
        {selectedToken && (
          <img src={selectedToken.logoURI} alt={selectedToken.symbol} className='w-6 h-6 mr-2 rounded-full' />
        )}
        <span>{selectedToken ? selectedToken.symbol : defaultLabel}</span>
        <svg
          className='w-4 h-4 fill-current text-neutral-content ml-2'
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 20 20'>
          <path d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z' />
        </svg>
      </button>
      <ModalWrapper isVisible={isOpen} onClose={() => setIsOpen(false)}>
        <div className='p-4 max-w-lg mx-auto min-h-[300px] flex flex-col justify-between'>
          <h2 className='text-2xl font-bold mb-4 text-center'>Select a token</h2>
          <input
            type='text'
            placeholder='Search tokens'
            className='w-full p-2 mb-4 border rounded'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {loading && <div className='text-center'>Loading tokens...</div>}
          {error && <div className='text-center text-red-500'>Error loading tokens: {error.message}</div>}
          {!loading && !error && (
            <ul className='space-y-2'>
              {filteredTokens.map((token) => (
                <li
                  key={token.address}
                  className={`flex items-center p-2 cursor-pointer hover:bg-gray-700 rounded-xl ${
                    token.address.toLowerCase() === selectedToken?.address.toLowerCase() ? 'bg-gray-600' : ''
                  }`}
                  onClick={() => handleSelect(token)}>
                  <img src={token.logoURI} alt={token.symbol} className='w-6 h-6 mr-2 rounded-full' />
                  <div className='flex flex-col'>
                    <span>{token.symbol}</span>
                    <span className='text-gray-500 text-sm'>{token.name}</span>
                  </div>
                  <span className='ml-auto'>
                    <TokenBalance address={address} tokenAddress={token.address as `0x${string}`} toFixed={2} />
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </ModalWrapper>
    </>
  )
}

export default TokenSelectModal
