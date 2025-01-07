import { useState } from 'react'

const BondUnbond: React.FC = () => {
  const [selected, setSelected] = useState<'wrap' | 'unwrap'>('wrap')

  return (
    <div className='flex w-full justify-center'>
      <div className='flex items-center justify-center w-fit p-1 bg-neutral/90 rounded-full'>
        <button
          className={`px-4 py-2 rounded-full transition-all duration-300 text-sm font-medium
            ${selected === 'wrap' ? 'bg-gray-700 text-white' : 'text-gray-400'}
            `}
          onClick={() => setSelected('wrap')}>
          Bond
        </button>
        <button
          className={`px-4 py-2 rounded-full transition-all duration-300 text-sm font-medium
            ${selected === 'unwrap' ? 'bg-gray-700 text-white' : 'text-gray-400'}
            `}
          onClick={() => setSelected('unwrap')}>
          Unbond
        </button>
      </div>
    </div>
  )
}

export default BondUnbond
