import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { getProviders, getSession, signIn } from 'next-auth/react'
import type { FC } from 'react'

interface LoginProps {}

const Login: FC<LoginProps> = ({
  providers,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <div className='hero min-h-screen bg-base-200'>
      <div className='hero-content flex-col lg:flex-row-reverse'>
        <div className='text-center lg:text-left'>
          <h1 className='text-5xl font-bold'>TestL</h1>
          <p className='py-6'>
            Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda
            excepturi exercitationem quasi. In deleniti eaque aut repudiandae et
            a id nisi.
          </p>
        </div>
        <div className='card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100'>
          <div className='card-body'>
            <div className='form-control'>
              {providers &&
                Object?.values(providers)?.map((provider: any) => (
                  <div key={provider?.name}>
                    <button
                      className='btn btn-primary btn-lg w-full'
                      onClick={() => signIn(provider?.id)}
                    >
                      Sign in with {provider?.name}
                    </button>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const providers = await getProviders()
  const data = await getSession({ req })

  if (data) {
    return {
      redirect: {
        permanent: false,
        destination: '/home',
      },
    }
  }

  return {
    props: { providers },
  }
}

export default Login
