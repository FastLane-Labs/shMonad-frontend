import React, { useState } from 'react'
import ModalWrapper from '@/components/Wrappers/ModalWrapper'
import { Settings } from '@/types'
interface SettingsModalProps {
  isVisible: boolean
  onClose: () => void
  onSave: (settings: Settings) => void
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isVisible, onClose, onSave }) => {
  const [slippageTolerance, setSlippageTolerance] = useState<number>(0.5)
  const [transactionDeadline, setTransactionDeadline] = useState<number>(20)

  const handleSave = () => {
    if (slippageTolerance > 100) {
      alert('Slippage tolerance cannot be more than 100%')
      return
    }
    onSave({ slippageTolerance, transactionDeadline })
    onClose()
  }

  return (
    <ModalWrapper isVisible={isVisible} onClose={onClose} style={{ paddingBottom: '28px' }}>
      <h3 className='label text-lg my-4'>Transaction Settings</h3>
      <div className='mb-4'>
        <label className='label block mb-2 text-sm'>Slippage tolerance</label>
        <div className='flex space-x-2'>
          {[0.1, 0.5, 1].map((tolerance) => (
            <button
              key={tolerance}
              onClick={() => setSlippageTolerance(tolerance)}
              className={`btn btn-settings ${slippageTolerance === tolerance ? 'bg-secondary' : 'bg-gray-700'}`}>
              {tolerance}%
            </button>
          ))}
          <div className='relative flex items-center'>
            <input
              type='number'
              placeholder='0.50'
              value={slippageTolerance}
              onChange={(e) => setSlippageTolerance(parseFloat(e.target.value))}
              className={`input !outline-none bg-neutral text-neutral-content px-3 py-1 rounded-md w-20 pr-6 ${
                slippageTolerance > 100 ? 'text-red-500' : ''
              }`}
            />
            <span className='absolute right-2 text-neutral-content'>%</span>
          </div>
        </div>
      </div>
      <div className='mb-4'>
        <label className='label block mb-2 text-sm'>Transaction deadline</label>
        <div className='flex items-center'>
          <input
            type='number'
            value={transactionDeadline}
            placeholder='20'
            onChange={(e) => setTransactionDeadline(parseInt(e.target.value))}
            className='input bg-neutral !outline-none px-3 py-1 rounded-md w-20'
          />
          <span className='ml-2'>minutes</span>
        </div>
      </div>
      <button onClick={handleSave} className='btn'>
        Save
      </button>
    </ModalWrapper>
  )
}

export default SettingsModal
