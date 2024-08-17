'use client'
import React from 'react'
import { TransactionParams } from '@/types'
import { CheckCircleIcon, XCircleIcon, ClockIcon } from '@heroicons/react/24/solid'
import { shortFormat } from '@/utils/format'
import dayjs from 'dayjs'
import { getBlockExplorerUrl } from '@/utils/getBlockExplorerUrl'
import Image from 'next/image'

interface ActivityItemProps {
  transaction: TransactionParams
}

export function ActivityItem({ transaction }: ActivityItemProps) {
  const formatRelativeTime = (timestamp: number) => {
    const now = dayjs()
    const transactionTime = dayjs(timestamp)

    if (now.diff(transactionTime, 'day') >= 7) {
      return transactionTime.format('MMM D')
    } else {
      return transactionTime.fromNow(true)
    }
  }

  const getStatusIcon = () => {
    switch (transaction.status) {
      case 'confirmed':
        return <CheckCircleIcon className='h-6 w-6 text-green-500' />
      case 'failed':
        return <XCircleIcon className='h-6 w-6 text-red-500' />
      case 'pending':
      default:
        return <ClockIcon className='h-6 w-6 text-yellow-500' />
    }
  }

  const getStatusText = () => {
    switch (transaction.status) {
      case 'confirmed':
        return transaction.routeType === 'approval' ? 'Approved' : 'Swapped'
      case 'failed':
        return 'Failed'
      case 'pending':
      default:
        return transaction.routeType === 'approval' ? 'Approving' : 'Swapping'
    }
  }

  const getTransactionUrl = () => {
    if (transaction.txHash && transaction.chainId) {
      const baseUrl = getBlockExplorerUrl(transaction.chainId)
      return `${baseUrl}tx/${transaction.txHash}`
    }
    return null
  }

  const transactionUrl = getTransactionUrl()

  return (
    <article
      className='flex items-center space-x-3 p-2 bg-[#0f0f0f] rounded-lg border border-gray-800 cursor-pointer hover:bg-gray-900 transition-colors'
      onClick={() => {
        if (transactionUrl) {
          window.open(transactionUrl, '_blank')
        }
      }}>
      <div className='flex-shrink-0'>
        {transaction.routeType === 'approval' ? (
          <img
            src={transaction.fromToken.logoURI}
            alt={transaction.fromToken.symbol}
            className='w-6 h-6 rounded-full'
          />
        ) : (
          <div className='relative w-6 h-6'>
            <img
              src={transaction.fromToken.logoURI}
              alt={transaction.fromToken.symbol}
              className='absolute top-0 left-0 w-4 h-4 rounded-full'
            />
            {transaction.toToken && (
              <img
                src={transaction.toToken.logoURI}
                alt={transaction.toToken.symbol}
                className='absolute bottom-0 right-0 w-4 h-4 rounded-full'
              />
            )}
          </div>
        )}
      </div>
      <div className='flex-1 min-w-0'>
        <div className='flex justify-between items-center'>
          <span className='text-sm font-medium text-gray-200'>{getStatusText()}</span>
          {transaction.boosted && transaction.toToken && (
            <div className='flex items-center space-x-1'>
              <span className='text-xs text-gray-400'>Boosted</span>
              <Image
                src='/rocketboost-logo-extracted.png'
                alt='Boosted'
                width={12}
                height={12}
                className='opacity-70'
              />
              <span className='text-xs text-gray-400'>
                {transaction.boostedAmount
                  ? shortFormat(BigInt(transaction.boostedAmount), transaction.toToken.decimals, 4)
                  : '0'}{' '}
                {transaction.toToken.symbol}
              </span>
            </div>
          )}
        </div>
        <p className='text-xs text-gray-400 mt-1'>
          {transaction.routeType === 'approval' ? (
            transaction.fromToken.symbol
          ) : (
            <>
              {shortFormat(BigInt(transaction.fromAmount), transaction.fromToken.decimals, 2)}{' '}
              {transaction.fromToken.symbol}
              {transaction.toToken && transaction.toAmount && (
                <>
                  {' to '}
                  {shortFormat(BigInt(transaction.toAmount), transaction.toToken.decimals, 2)}{' '}
                  {transaction.toToken.symbol}
                </>
              )}
            </>
          )}
        </p>
      </div>
      <div className='flex flex-col items-end'>
        <div className='flex-shrink-0 flex justify-end items-end'>{getStatusIcon()}</div>
        {transaction.timestamp && (
          <time className='text-xs text-gray-400' suppressHydrationWarning>
            {formatRelativeTime(transaction.timestamp)}
          </time>
        )}
      </div>
    </article>
  )
}
