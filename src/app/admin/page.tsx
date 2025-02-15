'use client';

import { GradientButton } from '@/components/component/Button';
import { cn } from '@/lib/utils';
import { Check, ChevronRight, Copy, Edit, Save, X } from 'lucide-react';
import { ChangeEvent, useState } from 'react';
import copy from 'clipboard-copy';
import { Configuration } from '@/lib/types';

const Page = () => {
  const [password, setPassword] = useState<string>('');
  const [isPassed, setIsPassed] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [adminData, setAdminData] = useState<Configuration>({
    pubKey: '',
    fee: 0,
    mintableFee: 0,
    freezeableFee: 0,
    updateableFee: 0,
    creatorFee: 0,
  });
  const [prev, setPrev] = useState<{ key: keyof Configuration; value: string | number }>({
    key: 'pubKey',
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
          pubKey: data.pubKey,
          fee: data.fee,
          updateableFee: data.updateableFee,
          freezeableFee: data.freezeableFee,
          mintableFee: data.mintableFee,
          creatorFee: data.creatorFee,
        });
      }
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  }

  function handleEdit(text: keyof Configuration) {
    if (isEdit === text) {
      setIsEdit('');
    } else {
      setIsEdit(text);
      setPrev({ key: text, value: adminData[text] || '' });
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
    setAdminData({
      pubKey: data.pubKey,
      fee: data.fee,
      updateableFee: data.updateableFee,
      freezeableFee: data.freezeableFee,
      mintableFee: data.mintableFee,
      creatorFee: data.creatorFee,
    });
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
          {/* Public Key */}
          <div className='flex gap-4 md:gap-8 items-center justify-between border w-full max-w-full py-2 px-4 md:px-8 overflow-hidden'>
            <p className='text-xs md:text-base whitespace-nowrap md:w-20 w-16'>Public Key</p>
            <div className='flex items-center justify-center gap-2 py-1 md:gap-4 w-full text-left text-xs md:text-base max-w-[65%] overflow-x-auto no-scrollbar'>
              {isEdit === 'Public Key' ? (
                <input
                  className='text-gray-700 px-2 outline-none py-1 rounded-sm w-full'
                  name='publicKey'
                  value={adminData.pubKey || ''}
                  onChange={handleChange}
                />
              ) : (
                <p className='py-1 text-xs md:text-base'>{adminData.pubKey}</p>
              )}
            </div>
            <div className='flex gap-2'>
              <button className='hover:text-gray-400 transition-colors'>
                {isEdit === 'Public Key' ? (
                  <X onClick={() => setIsEdit('')} />
                ) : isCopied === 'Public Key' ? (
                  <Check />
                ) : (
                  <Copy onClick={() => handleCopyClick('Public Key', adminData.pubKey || '')} />
                )}
              </button>
              <button className='hover:text-gray-400 transition-colors'>
                {isEdit === 'Public Key' ? (
                  <Save onClick={handleUpdateAdminData} />
                ) : (
                  <Edit onClick={() => handleEdit('pubKey')} />
                )}
              </button>
            </div>
          </div>

          {/* fee */}
          <div className='flex gap-4 md:gap-8 items-center justify-between border w-full last:border-t-0 py-2 px-4 md:px-8'>
            <p className='md:w-20 w-16 text-xs md:text-base'>Fee</p>
            <div className='overflow-hidden text-left py-1 text-xs md:text-base'>
              {isEdit === 'fee' ? (
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
                {isEdit === 'fee' ? (
                  <X onClick={() => setIsEdit('')} />
                ) : isCopied === 'fee' ? (
                  <Check />
                ) : (
                  <Copy onClick={() => handleCopyClick('fee', adminData.fee.toString())} />
                )}
              </button>
              <button className='hover:text-gray-400 transition-colors'>
                {isEdit === 'fee' ? (
                  <Save onClick={handleUpdateAdminData} />
                ) : (
                  <Edit onClick={() => handleEdit('fee')} />
                )}
              </button>
            </div>
          </div>

          {/* Creator Fee */}
          <div className='flex gap-4 md:gap-8 items-center justify-between border w-full last:border-t-0 py-2 px-4 md:px-8'>
            <p className='md:w-20 w-16 text-xs md:text-base'>Creator Fee</p>
            <div className='overflow-hidden text-left py-1 text-xs md:text-base'>
              {isEdit === 'creatorFee' ? (
                <input
                  className='text-gray-700 flex-1 py-1 px-2 outline-none rounded-sm'
                  name='creatorFee'
                  value={adminData.creatorFee}
                  onChange={handleChange}
                />
              ) : (
                <p className='py-1'>{adminData.creatorFee}</p>
              )}
            </div>
            <div className='flex gap-2'>
              <button className='hover:text-gray-400 transition-colors'>
                {isEdit === 'creatorFee' ? (
                  <X onClick={() => setIsEdit('')} />
                ) : isCopied === 'creatorFee' ? (
                  <Check />
                ) : (
                  <Copy onClick={() => handleCopyClick('creatorFee', adminData.creatorFee.toString())} />
                )}
              </button>
              <button className='hover:text-gray-400 transition-colors'>
                {isEdit === 'creatorFee' ? (
                  <Save onClick={handleUpdateAdminData} />
                ) : (
                  <Edit onClick={() => handleEdit('creatorFee')} />
                )}
              </button>
            </div>
          </div>

          {/* Updateable Fee */}
          <div className='flex gap-4 md:gap-8 items-center justify-between border w-full last:border-t-0 py-2 px-4 md:px-8'>
            <p className='md:w-20 w-16 text-xs md:text-base'>Updateable Fee</p>
            <div className='overflow-hidden text-left py-1 text-xs md:text-base'>
              {isEdit === 'updateableFee' ? (
                <input
                  className='text-gray-700 flex-1 py-1 px-2 outline-none rounded-sm'
                  name='updateableFee'
                  value={adminData.updateableFee}
                  onChange={handleChange}
                />
              ) : (
                <p className='py-1'>{adminData.updateableFee}</p>
              )}
            </div>
            <div className='flex gap-2'>
              <button className='hover:text-gray-400 transition-colors'>
                {isEdit === 'updateableFee' ? (
                  <X onClick={() => setIsEdit('')} />
                ) : isCopied === 'updateableFee' ? (
                  <Check />
                ) : (
                  <Copy onClick={() => handleCopyClick('updateableFee', adminData.updateableFee.toString())} />
                )}
              </button>
              <button className='hover:text-gray-400 transition-colors'>
                {isEdit === 'updateableFee' ? (
                  <Save onClick={handleUpdateAdminData} />
                ) : (
                  <Edit onClick={() => handleEdit('updateableFee')} />
                )}
              </button>
            </div>
          </div>

          {/* Mintable Fee */}
          <div className='flex gap-4 md:gap-8 items-center justify-between border w-full last:border-t-0 py-2 px-4 md:px-8'>
            <p className='md:w-20 w-16 text-xs md:text-base'>Mintalble Fee</p>
            <div className='overflow-hidden text-left py-1 text-xs md:text-base'>
              {isEdit === 'mintableFee' ? (
                <input
                  className='text-gray-700 flex-1 py-1 px-2 outline-none rounded-sm'
                  name='mintableFee'
                  value={adminData.mintableFee}
                  onChange={handleChange}
                />
              ) : (
                <p className='py-1'>{adminData.mintableFee}</p>
              )}
            </div>
            <div className='flex gap-2'>
              <button className='hover:text-gray-400 transition-colors'>
                {isEdit === 'mintableFee' ? (
                  <X onClick={() => setIsEdit('')} />
                ) : isCopied === 'mintableFee' ? (
                  <Check />
                ) : (
                  <Copy onClick={() => handleCopyClick('mintableFee', adminData.mintableFee.toString())} />
                )}
              </button>
              <button className='hover:text-gray-400 transition-colors'>
                {isEdit === 'mintableFee' ? (
                  <Save onClick={handleUpdateAdminData} />
                ) : (
                  <Edit onClick={() => handleEdit('mintableFee')} />
                )}
              </button>
            </div>
          </div>

          {/* Freezeable Fee */}
          <div className='flex gap-4 md:gap-8 items-center justify-between border w-full last:border-t-0 py-2 px-4 md:px-8'>
            <p className='md:w-20 w-16 text-xs md:text-base'>Freezeable Fee</p>
            <div className='overflow-hidden text-left py-1 text-xs md:text-base'>
              {isEdit === 'freezeableFee' ? (
                <input
                  className='text-gray-700 flex-1 py-1 px-2 outline-none rounded-sm'
                  name='freezeableFee'
                  value={adminData.freezeableFee}
                  onChange={handleChange}
                />
              ) : (
                <p className='py-1'>{adminData.freezeableFee}</p>
              )}
            </div>
            <div className='flex gap-2'>
              <button className='hover:text-gray-400 transition-colors'>
                {isEdit === 'freezeableFee' ? (
                  <X onClick={() => setIsEdit('')} />
                ) : isCopied === 'freezeableFee' ? (
                  <Check />
                ) : (
                  <Copy onClick={() => handleCopyClick('freezeableFee', adminData.freezeableFee.toString())} />
                )}
              </button>
              <button className='hover:text-gray-400 transition-colors'>
                {isEdit === 'freezeableFee' ? (
                  <Save onClick={handleUpdateAdminData} />
                ) : (
                  <Edit onClick={() => handleEdit('freezeableFee')} />
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
