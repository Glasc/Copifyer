import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { FC, useRef } from 'react'
import { useAddNewCopyMutation } from '../../services/copyApi'

interface CreateProps {}

const Create: FC<CreateProps> = ({}) => {
  const [addNew, { isLoading: isUpdating }] = useAddNewCopyMutation()

  const inputTitle = useRef<HTMLInputElement>(null)
  const inputContent = useRef<HTMLTextAreaElement>(null)

  const router = useRouter()

  const handleCreateNewCopyClick = (e: any) => {
    e.preventDefault()
    const title = inputTitle.current?.value.toString()
    const content = inputContent.current?.value.toString()

    if (!title || !content) return

    try {
      addNew({ title, content })
      router.push('/home')
    } catch (e) {
      console.log('Error attempting to create new copy: ', e)
    }
  }

  return (
    <div className='min-h-screen'>
      <section className='bg-base-200 mt-8 p-8 rounded-lg w-100 max-w-xl mx-auto'>
        <h2 className='text-xl font-bold pb-2'>Create new copypaste</h2>
        <hr className='border-accent' />
        <form onSubmit={handleCreateNewCopyClick}>
          <div className='form-control mt-3'>
            <label className='label'>
              <span className='label-text'>Title</span>
            </label>
            <input
              type='text'
              className='input input-bordered'
              ref={inputTitle}
            />
          </div>
          <div className='form-control'>
            <label className='label'>
              <span className='label-text'>Content</span>
            </label>
            <textarea
              className='textarea textarea-bordered'
              rows={15}
              ref={inputContent}
            ></textarea>
          </div>
          <div className='form-control mt-6'>
            {isUpdating ? (
              <button className='btn btn-loading' type='submit'>
                Loading
              </button>
            ) : (
              <button className='btn btn-accent' type='submit'>
                Create new
              </button>
            )}
          </div>
        </form>
      </section>
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

export default Create
