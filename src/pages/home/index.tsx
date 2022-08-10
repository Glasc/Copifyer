/* eslint-disable @next/next/no-img-element */

import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { getProviders, getSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/router'
import { userAgent } from 'next/server'
import { FC, useState } from 'react'
import {
  useDeleteCopyMutation,
  useGetUserCopiesQuery,
} from '../../services/copyApi'
import { useAutoAnimate } from '@formkit/auto-animate/react'

interface IndexProps {}

interface CopyProps {
  content: string
  date: string
  id: number
  title: string
  userId: string
}

const Copy: FC<CopyProps> = ({ content, date, id, title, userId }) => {
  const [deleteCopy, { isLoading: isDeleting }] = useDeleteCopyMutation()

  return (
    <div className='bg-base-200 p-3 max-w-4xl mx-auto rounded-lg flex justify-between items-center'>
      <section>
        <h1 className='text-xl'>{title}</h1>
        <p>{content}</p>
      </section>
      {isDeleting ? (
        <button className='btn btn-loading m-0'>Deleting...</button>
      ) : (
        <button className='btn btn-error m-0' onClick={() => deleteCopy(id)}>
          Delete
        </button>
      )}
    </div>
  )
}

const Index: FC<IndexProps> = ({
  data: session,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter()

  const [parent] = useAutoAnimate<any>(/* optional config */)

  const [inputSearch, setInputSearch] = useState('')

  const { id, image, name } = session.user

  const { data: copies, isLoading } = useGetUserCopiesQuery()

  const handleLogout = () => signOut()

  const handleCreateNewClick = () => router.push('/home/create')

  const copiesToShow =
    inputSearch === ''
      ? copies
      : copies?.filter((copy) => copy.title.includes(inputSearch))

  return (
    <div className='min-h-screen w-100'>
      <div className='navbar bg-base-100 w-100 max-w-4xl mx-auto pt-5'>
        <div className='flex-1'>
          <h2 className='text-2xl font-semibold'>{name}</h2>
        </div>

        <div className='flex-none gap-2'>
          <div className='form-control'>
            <button className='btn btn-accent' onClick={handleCreateNewClick}>
              Create new
            </button>
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
              <li onClick={handleLogout}>
                <a>Logout</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className='form-control max-w-4xl mx-auto mt-6 flex flex-row justify-end'>
        <input
          type='text'
          placeholder='Search'
          className='input input-bordered w-full max-w-xs'
          value={inputSearch}
          onChange={(e) => setInputSearch(e.target.value)}
        />
      </div>
      <main className='mt-6 space-y-4' ref={parent || ''}>
        {copiesToShow?.map((copy: CopyProps) => (
          <Copy key={copy.id} {...copy} />
        ))}
      </main>
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

export default Index
