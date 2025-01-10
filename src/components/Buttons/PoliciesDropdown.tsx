import React, { useState, useRef, useEffect } from 'react'
import ChevronDownIcon from '@heroicons/react/20/solid/ChevronDownIcon'

// Define a constant array for policies
const POLICIES = ['Task Scheduler', 'Atlas', '4337 Bundling', 'MEV Bundles'] as const
type Policy = (typeof POLICIES)[number] | '' // Added empty string for placeholder support

interface PoliciesDropdownProps {
  selectedPolicy: Policy
  setSelectedPolicy: (policy: Policy) => void
}

const PoliciesDropdown: React.FC<PoliciesDropdownProps> = ({ selectedPolicy, setSelectedPolicy }) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  // Close dropdown if the user clicks outside or presses "Esc"
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    const handleEscKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
        buttonRef.current?.blur() // Remove focus from the button to prevent highlighting on "esc"
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscKeyPress)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscKeyPress)
    }
  }, [])

  return (
    <div ref={dropdownRef} className='relative flex w-full justify-center mb-6 z-[1] font-medium text-sm'>
      {/* Dropdown Button */}
      <button
        ref={buttonRef}
        className='flex items-center justify-between w-64 p-3 bg-neutral/60 text-white rounded-2xl transition-all duration-300 ease-in-out'
        onClick={() => setIsOpen((prev) => !prev)}>
        {/* Conditional Rendering for Placeholder */}
        {selectedPolicy === '' ? <span className='text-gray-400'>Select Policy</span> : selectedPolicy}
        <span className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`}>
          <ChevronDownIcon className='w-5 h-5' />
        </span>
      </button>

      {/* Dropdown Menu */}
      <div
        className={`absolute mt-[52px] w-64 bg-neutral/95 rounded-xl shadow-lg p-1 
        transition-transform duration-300 ease-[cubic-bezier(0.34, 1.56, 0.64, 1)] transform 
        ${isOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-5 pointer-events-none'}
        space-y-1`}>
        {POLICIES.map((policy) => (
          <button
            key={policy}
            className={`block w-full text-left px-4 py-3 hover:bg-gray-400/10 hover:text-gray-200 rounded-xl
            ${selectedPolicy === policy ? 'bg-gray-400/10 text-white' : 'text-gray-400'}`}
            onClick={() => {
              setSelectedPolicy(policy)
              setIsOpen(false)
            }}>
            {policy}
          </button>
        ))}
      </div>
    </div>
  )
}

export default PoliciesDropdown
