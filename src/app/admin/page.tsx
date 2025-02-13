'use client';

import { GradientButton } from '@/components/component/Button';
import { cn } from '@/lib/utils';
import { Check, ChevronRight, Copy, Edit, Save, X } from 'lucide-react';
import { ChangeEvent, useState } from 'react';
import copy from 'clipboard-copy';

const Page = () => {
  const [password, setPassword] = useState<string>('');
  const [isPassed, setIsPassed] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [adminData, setAdminData] = useState<{ fee: number; publicKey: string }>({
    publicKey: '',
    fee: 0,
  });
  const [prev, setPrev] = useState<{ key: keyof { fee: number; publicKey: string }; value: string | number }>({
    key: 'publicKey',
    value: '',
  });

  const [isCopied, setIsCopied] = useState('');

  async function handleCopyClick(name: string, text: string) {
    try {
      await copy(text);
      setIsCopied(name);
      setTimeout(() => {
        setIsCopied('');
      }, 1000); // Reset "Copied!" state after 2 seconds
    } catch (error) {
      console.error('Failed to copy text to clipboard', error);
    }
  }

  async function handleSubmit() {
    if (password.trim() === '') {
      return;
    }
    try {
      setIsLoading(true);
      const response = await fetch('/api/auth/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });
      const data = await response.json();
      setIsPassed(data.success);
      if (data.success) {
        console.log(data.publicKey, data.fee);
        setAdminData({
          publicKey: data.publicKey,
          fee: data.fee,
        });
      }
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  }

  function handleEdit(text: string) {
    if (isEdit === text) {
      setIsEdit('');
    } else {
      setIsEdit(text);
      if (text === 'Fee') {
        setPrev({ key: 'fee', value: adminData.fee });
      } else {
        setPrev({ key: 'publicKey', value: adminData.publicKey });
      }
    }
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setAdminData({ ...adminData, [e.target.name]: e.target.value });
  }

  async function handleUpdateAdminData() {
    if (adminData[prev.key] === prev.value) {
      setIsEdit('');
      return;
    }
    const response = await fetch('/api/admin/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(adminData),
    });
    const data = await response.json();
    console.log(data);
    setAdminData({ publicKey: data.publicKey, fee: data.fee });
    setIsEdit('');
  }

  return (
    <section className='text-gray-300 min-h-[calc(100vh-300px)] flex justify-center items-center flex-col gap-4 md:gap-8 pt-[78px] md:pt-[93px]'>
      <h2
        className={cn(
          'text-center text-transparent text-3xl md:text-5xl mt-4 md:mt-6 font-medium',
          'bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text'
        )}
      >
        Admin Page
      </h2>
      {isPassed ? (
        <div className='flex flex-col justify-center items-center w-full px-4 md:px-8'>
          <div className='flex gap-4 md:gap-8 items-center justify-between border w-full max-w-full py-2 px-4 md:px-8 overflow-hidden'>
            <p className='text-xs md:text-base whitespace-nowrap md:w-20 w-16'>Public Key</p>
            <div className='flex items-center justify-center gap-2 py-1 md:gap-4 w-full text-left text-xs md:text-base max-w-[65%] overflow-x-auto no-scrollbar'>
              {isEdit === 'Public Key' ? (
                <input
                  className='text-gray-700 px-2 outline-none py-1 rounded-sm w-full'
                  name='publicKey'
                  value={adminData.publicKey}
                  onChange={handleChange}
                />
              ) : (
                <p className='py-1 text-xs md:text-base'>{adminData.publicKey}</p>
              )}
            </div>
            <div className='flex gap-2'>
              <button className='hover:text-gray-400 transition-colors'>
                {isEdit === 'Public Key' ? (
                  <X onClick={() => setIsEdit('')} />
                ) : isCopied === 'Public Key' ? (
                  <Check />
                ) : (
                  <Copy onClick={() => handleCopyClick('Public Key', adminData.publicKey)} />
                )}
              </button>
              <button className='hover:text-gray-400 transition-colors'>
                {isEdit === 'Public Key' ? (
                  <Save onClick={handleUpdateAdminData} />
                ) : (
                  <Edit onClick={() => handleEdit('Public Key')} />
                )}
              </button>
            </div>
          </div>
          <div className='flex gap-4 md:gap-8 items-center justify-between border w-full last:border-t-0 py-2 px-4 md:px-8'>
            <p className='md:w-20 w-16 text-xs md:text-base'>Fee</p>
            <div className='overflow-hidden text-left py-1 text-xs md:text-base'>
              {isEdit === 'Fee' ? (
                <input
                  className='text-gray-700 flex-1 py-1 px-2 outline-none rounded-sm'
                  name='fee'
                  value={adminData.fee}
                  onChange={handleChange}
                />
              ) : (
                <p className='py-1'>{adminData.fee}</p>
              )}
            </div>
            <div className='flex gap-2'>
              <button className='hover:text-gray-400 transition-colors'>
                {isEdit === 'Fee' ? (
                  <X onClick={() => setIsEdit('')} />
                ) : isCopied === 'Fee' ? (
                  <Check />
                ) : (
                  <Copy onClick={() => handleCopyClick('Fee', adminData.fee.toString())} />
                )}
              </button>
              <button className='hover:text-gray-400 transition-colors'>
                {isEdit === 'Fee' ? (
                  <Save onClick={handleUpdateAdminData} />
                ) : (
                  <Edit onClick={() => handleEdit('Fee')} />
                )}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className='flex items-center justify-center gap-4 md:gap-8 text-gray-800'>
          <input
            name='password'
            type='password'
            placeholder='Admin Password'
            className='h-12 rounded-xl px-3 py-0.5'
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                handleSubmit();
              }
            }}
          />

          <GradientButton disabled={isLoading} className='w-36 py-2' onClick={handleSubmit}>
            Submit
            {!isLoading ? (
              <ChevronRight />
            ) : (
              <div className='animate-spin w-4 h-4 bg-transparent rounded-full border-white border-t-4' />
            )}
          </GradientButton>
        </div>
      )}
    </section>
  );
};

export default Page;
