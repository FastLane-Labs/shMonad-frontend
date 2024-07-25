import React from 'react'
import clsx from 'clsx'
import { FaChevronLeft } from 'react-icons/fa'
import { useAppRouter } from '../../hooks/useAppRouter'
import { IconButton } from './IconButton'

interface BackButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const BackButton: React.FC<BackButtonProps> = ({ ...props }) => {
  const { previousRoute } = useAppRouter()

  return (
    <IconButton
      className={clsx(props.className, 'tw-rounded-full tw-text-neutral-content')}
      size={20}
      border={false}
      hoverEffect={false}
      onClick={() => previousRoute()}
      icon={FaChevronLeft}
    />
  )
}
