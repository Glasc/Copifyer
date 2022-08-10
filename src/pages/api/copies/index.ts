// src/pages/api/examples.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../server/db/client'
import { unstable_getServerSession as getServerSession } from 'next-auth'
import { authOptions as nextAuthOptions } from '../auth/[...nextauth]'

interface CopyProps {
  date: string
  content: string
  title: string
  userId: string
}

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

  if (req.method === 'POST') {
    const currentDate = new Date().toISOString()
    const userId = session.user?.id
    const { content, title } = req.body

    if (!userId || !currentDate || !userId) {
      return res.status(404)
    }

    const newCopy: CopyProps = {
      date: currentDate,
      content,
      title,
      userId,
    }

    try {
      const copy = await prisma.copy.create({ data: newCopy })
      res.status(201).json(copy)
      return
    } catch (e) {
      return res.status(500)
    }
  }

  if (req.method === 'DELETE') {
    const id = req.body
    if (!id) {
      return res.status(404)
    }

    try {
      await prisma.copy.delete({
        where: {
          id: Number(id),
        },
      })
      return res.status(200).json({ success: true })
    } catch (e) {
      return res.status(500).json({ success: false })
    }
  }
}

export default copies
