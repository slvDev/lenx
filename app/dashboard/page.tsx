'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAccount, useDisconnect, useReadContract } from 'wagmi';
import { useXAuth } from '@/contexts/XAuthProvider';
import { ConnectWalletWrapper } from '@/components/auth/ConnectWalletWrapper';
import { XLoginButton } from '@/components/auth/XLoginButton';
import { LENS_GLOBAL_NAMESPACE_ADDRESS, LENS_GLOBAL_NAMESPACE_ABI } from '@/lib/constants';

export default function DashboardPage() {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { isXAuthenticated, xHandle, logoutFromX } = useXAuth();

  const {
    data: usernameExists,
    isLoading: isLoadingUsernameCheck,
    refetch,
  } = useReadContract({
    address: LENS_GLOBAL_NAMESPACE_ADDRESS,
    abi: LENS_GLOBAL_NAMESPACE_ABI,
    functionName: 'exists',
    args: xHandle ? [xHandle] : undefined,
    query: {
      enabled: false,
    },
  });

  useEffect(() => {
    if (!isLoadingUsernameCheck && xHandle) {
      refetch();
    }
  }, [isLoadingUsernameCheck, xHandle, refetch]);

  const handleLogoutWallet = () => {
    disconnect();
  };

  const handleLogoutX = () => {
    logoutFromX();
  };

  // Show nothing while checking auth state
  if (!isConnected && !isXAuthenticated) {
    return null;
  }

  return (
    <div className='min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
      <motion.div
        className='max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden'
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className='p-8'>
          {/* Header with Logout Buttons */}
          <div className='flex flex-col md:flex-row justify-between items-start md:items-center border-b pb-6 mb-6'>
            <div>
              <h1 className='text-3xl font-bold text-gray-900'>Dashboard</h1>
              <p className='text-gray-600 mt-2'>Manage your Lens profile and connections</p>
            </div>
            <div className='flex mt-4 md:mt-0 space-x-4'>
              {isXAuthenticated && (
                <button
                  onClick={handleLogoutX}
                  className='px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition-colors'
                >
                  Disconnect X
                </button>
              )}
              {isConnected && (
                <button
                  onClick={handleLogoutWallet}
                  className='px-4 py-2 bg-black hover:bg-gray-800 text-white rounded-lg transition-colors'
                >
                  Disconnect Wallet
                </button>
              )}
            </div>
          </div>

          {/* Main Content Grid */}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            {/* Connected Accounts Section */}
            <div className='bg-gray-50 p-6 rounded-xl'>
              <h2 className='text-xl font-semibold mb-4'>Connected Accounts</h2>

              <div className='space-y-4'>
                {/* Wallet Status */}
                <div className='flex items-center justify-between'>
                  <div className='flex items-center'>
                    <div className='bg-blue-100 p-2 rounded-full'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        className='h-5 w-5 text-blue-600'
                        viewBox='0 0 20 20'
                        fill='currentColor'
                      >
                        <path
                          fillRule='evenodd'
                          d='M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z'
                          clipRule='evenodd'
                        />
                      </svg>
                    </div>
                    <div className='ml-3'>
                      <p className='text-sm font-medium'>Wallet</p>
                      {isConnected ? (
                        <p className='text-xs text-gray-500 truncate max-w-[180px]'>{address}</p>
                      ) : (
                        <p className='text-xs text-gray-500'>Not connected</p>
                      )}
                    </div>
                  </div>
                  {isConnected ? (
                    <span className='bg-green-100 text-green-800 text-xs px-2.5 py-0.5 rounded-full'>Active</span>
                  ) : (
                    <span className='bg-gray-100 text-gray-800 text-xs px-2.5 py-0.5 rounded-full'>Inactive</span>
                  )}
                </div>

                {/* X Account Status */}
                <div className='flex items-center justify-between'>
                  <div className='flex items-center'>
                    <div className='bg-black p-2 rounded-full'>
                      <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5 text-white' viewBox='0 0 24 24'>
                        <path
                          fill='currentColor'
                          d='M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z'
                        />
                      </svg>
                    </div>
                    <div className='ml-3'>
                      <p className='text-sm font-medium'>X Account</p>
                      {isXAuthenticated ? (
                        <p className='text-xs text-gray-500'>@{xHandle}</p>
                      ) : (
                        <p className='text-xs text-gray-500'>Not connected</p>
                      )}
                    </div>
                  </div>
                  {isXAuthenticated ? (
                    <span className='bg-green-100 text-green-800 text-xs px-2.5 py-0.5 rounded-full'>Linked</span>
                  ) : (
                    <span className='bg-gray-100 text-gray-800 text-xs px-2.5 py-0.5 rounded-full'>Not Linked</span>
                  )}
                </div>
              </div>

              {/* Username availability checker */}
              <div className='mt-6 pt-6 border-t border-gray-200'>
                <h3 className='text-md font-medium mb-3'>Check Username Availability</h3>

                {xHandle && !isLoadingUsernameCheck && (
                  <div
                    className={`mt-3 p-3 rounded-md ${
                      isLoadingUsernameCheck
                        ? 'bg-blue-50 text-blue-700'
                        : !usernameExists
                        ? 'bg-green-50 text-green-700'
                        : 'bg-red-50 text-red-700'
                    }`}
                  >
                    {!usernameExists && `Username "${xHandle}" is available!`}
                    {usernameExists && `Username "${xHandle}" is already taken.`}
                    {isLoadingUsernameCheck && 'Checking username availability...'}
                  </div>
                )}
              </div>
            </div>

            {/* Main Action Section */}
            <div className='bg-gray-50 p-6 rounded-xl col-span-2'>
              <h2 className='text-xl font-semibold mb-4'>Next Steps</h2>

              {/* X First Path */}
              {isXAuthenticated && !isConnected && (
                <div className='space-y-6'>
                  <div className='bg-blue-50 border-l-4 border-blue-400 p-4'>
                    <div className='flex'>
                      <div className='flex-shrink-0'>
                        <svg
                          className='h-5 w-5 text-blue-400'
                          xmlns='http://www.w3.org/2000/svg'
                          viewBox='0 0 20 20'
                          fill='currentColor'
                        >
                          <path
                            fillRule='evenodd'
                            d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z'
                            clipRule='evenodd'
                          />
                        </svg>
                      </div>
                      <div className='ml-3'>
                        <p className='text-sm text-blue-700'>
                          Connect your wallet to mint a Lens Profile with your X handle
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className='bg-white p-6 rounded-lg border border-gray-200'>
                    <h3 className='text-lg font-medium mb-4'>Connect Wallet</h3>
                    <p className='text-gray-600 mb-4'>
                      Connect your wallet to mint a Lens Profile using your X handle: @{xHandle}
                    </p>
                    <div className='flex justify-center'>
                      <ConnectWalletWrapper />
                    </div>
                  </div>

                  {/* Placeholder for Future Mint Profile UI */}
                  <div className='bg-gray-100 p-6 rounded-lg border border-gray-200 opacity-50'>
                    <h3 className='text-lg font-medium mb-4'>Mint Lens Profile</h3>
                    <p className='text-gray-600 mb-4'>
                      Once your wallet is connected, you'll be able to mint a Lens Profile using your X handle.
                    </p>
                    <button
                      disabled
                      className='w-full px-4 py-2 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed'
                    >
                      Connect Wallet to Continue
                    </button>
                  </div>
                </div>
              )}

              {/* Wallet First Path */}
              {isConnected && !isXAuthenticated && (
                <div className='space-y-6'>
                  <div className='bg-blue-50 border-l-4 border-blue-400 p-4'>
                    <div className='flex'>
                      <div className='flex-shrink-0'>
                        <svg
                          className='h-5 w-5 text-blue-400'
                          xmlns='http://www.w3.org/2000/svg'
                          viewBox='0 0 20 20'
                          fill='currentColor'
                        >
                          <path
                            fillRule='evenodd'
                            d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z'
                            clipRule='evenodd'
                          />
                        </svg>
                      </div>
                      <div className='ml-3'>
                        <p className='text-sm text-blue-700'>
                          Link your X account to suggest a handle for your Lens Profile
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className='bg-white p-6 rounded-lg border border-gray-200'>
                    <h3 className='text-lg font-medium mb-4'>Link X Account</h3>
                    <p className='text-gray-600 mb-4'>
                      Connect your X account to use your X handle as a suggestion for your Lens Profile
                    </p>
                    <div className='flex justify-center'>
                      <XLoginButton />
                    </div>
                  </div>

                  {/* Placeholder for Future Profile Creation UI */}
                  <div className='bg-gray-100 p-6 rounded-lg border border-gray-200 opacity-50'>
                    <h3 className='text-lg font-medium mb-4'>Create Lens Profile</h3>
                    <p className='text-gray-600 mb-4'>
                      After linking your X account, you'll be able to create a Lens Profile with a suggested handle.
                    </p>
                    <button
                      disabled
                      className='w-full px-4 py-2 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed'
                    >
                      Link X Account to Continue
                    </button>
                  </div>
                </div>
              )}

              {/* Both Connected State */}
              {isConnected && isXAuthenticated && (
                <div className='space-y-6'>
                  <div className='bg-green-50 border-l-4 border-green-400 p-4'>
                    <div className='flex'>
                      <div className='flex-shrink-0'>
                        <svg
                          className='h-5 w-5 text-green-400'
                          xmlns='http://www.w3.org/2000/svg'
                          viewBox='0 0 20 20'
                          fill='currentColor'
                        >
                          <path
                            fillRule='evenodd'
                            d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                            clipRule='evenodd'
                          />
                        </svg>
                      </div>
                      <div className='ml-3'>
                        <p className='text-sm text-green-700'>
                          You're all set! Both your wallet and X account are connected.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Profile Management UI with suggested username from X */}
                  <div className='bg-white p-6 rounded-lg border border-gray-200'>
                    <h3 className='text-lg font-medium mb-4'>Ready to Mint</h3>
                    <p className='text-gray-600 mb-4'>
                      You can now mint a Lens Profile using your X handle: @{xHandle}
                    </p>

                    {/* Auto-check X handle availability */}
                    {xHandle && (
                      <div className='mb-4 p-4 rounded-lg bg-gray-50'>
                        <h4 className='text-sm font-medium mb-2'>Username Availability</h4>
                        <button
                          onClick={() => refetch()}
                          className='w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 mb-3'
                        >
                          Check if @{xHandle} is available on Lens
                        </button>
                      </div>
                    )}

                    <button
                      className='w-full px-4 py-2 bg-black hover:bg-gray-800 text-white rounded-lg transition-colors'
                      disabled={!xHandle || isLoadingUsernameCheck}
                    >
                      Mint Lens Profile
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
