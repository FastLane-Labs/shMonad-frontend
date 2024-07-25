import React from 'react'
import clsx from 'clsx'
import type { ButtonHTMLAttributes } from 'react'
import type { IconType } from 'react-icons/lib'

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: IconType
  size?: number
  border?: boolean
  hoverEffect?: boolean
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon: Icon,
  size = 22,
  border = true,
  hoverEffect = true,
  ...props
}) => {
  return (
    <button
      id='atlas-icon-button'
      type='button'
      {...props}
      className={clsx(
        'transition-all tw-group tw-flex tw-items-center tw-justify-center tw-rounded-full',
        props.className,
        border && 'border tw-border-primary',
        hoverEffect && 'hover:tw-bg-primary'
      )}>
      <Icon className='transition-all' size={size} />
    </button>
  )
}
