import React, { useState, useRef, useEffect } from 'react'
import ChevronDownIcon from '@heroicons/react/20/solid/ChevronDownIcon'

// Define a constant array for policies
const POLICIES = ['Task Scheduler', 'Atlas', '4337 Bundling', 'MEV Bundles'] as const
type Policy = (typeof POLICIES)[number]

interface PoliciesDropdownProps {
  selectedPolicy: Policy
  setSelectedPolicy: (policy: Policy) => void
}

const PoliciesDropdown: React.FC<PoliciesDropdownProps> = ({ selectedPolicy, setSelectedPolicy }) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close the dropdown if user clicks outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={dropdownRef} className='relative flex w-full justify-center mb-4 z-[1] font-medium text-sm'>
      {/* Dropdown Button */}
      <button
        className='flex items-center justify-between w-64 p-3 bg-neutral/60 text-white rounded-2xl transition-all duration-300 ease-in-out'
        onClick={() => setIsOpen((prev) => !prev)}>
        {selectedPolicy}
        <span className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`}>
          {' '}
          <ChevronDownIcon className='w-5 h-5' />
        </span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className='absolute mt-[50px] w-64 bg-neutral/95 rounded-xl shadow-lg transition-all duration-300 ease-in-out transform opacity-100 scale-100'>
          {POLICIES.map((policy) => (
            <button
              key={policy}
              className={`block w-full text-left px-4 py-3 hover:bg-gray-500/20 hover:text-gray-200 rounded-xl
              ${selectedPolicy === policy ? 'bg-gray-500/20 text-white' : 'text-gray-400'}`}
              onClick={() => {
                setSelectedPolicy(policy)
                setIsOpen(false)
              }}>
              {policy}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default PoliciesDropdown
