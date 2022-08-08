/* eslint-disable @next/next/no-img-element */

import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { getProviders, getSession, signOut } from 'next-auth/react'
import { userAgent } from 'next/server'
import type { FC } from 'react'
import { useGetUserCopiesQuery } from '../services/copyApi'

interface HomeProps {}

const Home: FC<HomeProps> = ({
  data: session,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { id, image, name } = session.user

  const { data, isLoading } = useGetUserCopiesQuery('XL2')

  console.log(data)

  const handleLogout = () => signOut()


  return (
    <div className='navbar bg-base-100 w-100 max-w-7xl mx-auto'>
      <div className='flex-1'>
        <a className='btn btn-ghost normal-case text-xl'>{name}</a>
      </div>
      <div className='flex-none gap-2'>
        <div className='form-control'>
          <button className='btn btn-accent'>Create new</button>
        </div>
        <div className='dropdown dropdown-end'>
          <label tabIndex={0} className='btn btn-ghost btn-circle avatar'>
            <div className='w-10 rounded-full'>
              <img src={image} alt='your profile picture' />
            </div>
          </label>
          <ul
            tabIndex={0}
            className='mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52'
          >
            <li>
              <a className='justify-between'>
                Profile
                <span className='badge'>New</span>
              </a>
            </li>
            <li>
              <a>Settings</a>
            </li>
            <li onClick={handleLogout}>
              <a>Logout</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const data = await getSession({ req })

  // if there is no data, redirect to the login page
  if (!data) {
    return {
      redirect: {
        permanent: false,
        destination: '/auth/login',
      },
    }
  }

  return {
    props: { data },
  }
}

export default Home
