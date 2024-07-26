import React, { useEffect, useRef, useCallback, ReactNode } from 'react'

interface ModalWrapperProps {
  isVisible: boolean
  onClose: () => void
  children: ReactNode
}

const ModalWrapper: React.FC<ModalWrapperProps> = ({ isVisible, onClose, children }) => {
  const modalRef = useRef<HTMLDivElement>(null)

  const handleEscape = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    },
    [onClose]
  )

  useEffect(() => {
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [handleEscape])

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose()
      }
    },
    [onClose]
  )

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [handleClickOutside])

  if (!isVisible) return null

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
      <div ref={modalRef} className='modal-box relative bg-base-200 text-neutral-content rounded-xl w-96 p-4 shadow-lg'>
        <button className='btn absolute top-3 right-2 text-neutral-content' onClick={onClose}>
          <svg
            className='w-6 h-6'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
            xmlns='http://www.w3.org/2000/svg'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M6 18L18 6M6 6l12 12'></path>
          </svg>
        </button>
        {children}
      </div>
    </div>
  )
}

export default ModalWrapper
