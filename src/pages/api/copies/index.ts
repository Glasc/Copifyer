// src/pages/api/examples.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../server/db/client'
import { unstable_getServerSession as getServerSession } from 'next-auth'
import { authOptions as nextAuthOptions } from '../auth/[...nextauth]'

const copies = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerSession(req, res, nextAuthOptions)

  if (!session) {
    return res.status(404)
  }

  if (req.method === 'GET') {
    const result = await prisma.copy.findMany({
      where: {
        userId: session.user?.id,
      },
    })
    return res.status(200).json(result)
  }
}

export default copies
