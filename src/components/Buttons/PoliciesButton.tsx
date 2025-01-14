/////////////////////////////
// NOT USED IN THE PROJECT //
/////////////////////////////

import React from 'react'

// Define policy names
const POLICIES = ['Task Scheduler', 'Atlas', '4337 Bundling', 'MEV Bundles'] as const
type Policy = (typeof POLICIES)[number]

interface PoliciesButtonProps {
  selectedPolicy: Policy
  setSelectedPolicy: (policy: Policy) => void
}

const PoliciesButton: React.FC<PoliciesButtonProps> = ({ selectedPolicy, setSelectedPolicy }) => {
  // Calculate the sliding background position based on the policy index
  const slidePositionMap = POLICIES.reduce(
    (acc, policy, index) => {
      acc[policy] = `${(index - (POLICIES.length / 2 - 0.5)) * 95}%`
      return acc
    },
    {} as Record<Policy, string>
  )

  return (
    <div className='flex w-full justify-center mb-4 -mt-2 z-[1] relative font-medium text-sm'>
      <div className='flex items-center justify-center w-fit px-0.5 bg-neutral/60 rounded-2xl relative overflow-hidden'>
        {/* Sliding Background with Centered Positioning */}
        <div
          className='absolute w-[25%] h-[calc(100%-0.5rem)] bg-gray-400/10 rounded-xl transition-all duration-300 ease-in-out'
          style={{ transform: `translateX(${slidePositionMap[selectedPolicy]})` }}
        />

        {POLICIES.map((policy) => (
          <button
            key={policy}
            className={`relative w-20 text-center transition-all duration-300 py-3 ease-in-out
            ${selectedPolicy === policy ? 'text-white' : 'text-gray-400'}`}
            onClick={() => setSelectedPolicy(policy)}>
            {policy}
          </button>
        ))}
      </div>
    </div>
  )
}

export default PoliciesButton
