import { Hono } from "hono"
import { handle } from "hono/vercel"
import { z } from 'zod'
import { prisma } from "@/lib/prisma"
import { userSchema,userDeleteSchema } from "@/lib/schema"

const app = new Hono().basePath('/api')

app.get('/users', async (c) => {
  const users = await prisma.user.findMany()
  
  return c.json({
    code: 0,
    msg: 'success',
    data: users,
  })
})

app.post('/user', async (c) => {
  const body = await c.req.json()
  try {
    const data = userSchema.parse(body)
    try {
      await prisma.user.create({
        data
      })
    } catch (err) {
      return c.json({
        code: 1,
        msg: err,
      })
    }

    return c.json({
      code: 0,
      msg: 'success',
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({
        code: 1,
        msg: error.message,
      })
    }
  }
})

app.delete('/user', async (c) => {
  const body = await c.req.json()
  const req = userDeleteSchema.parse(body)
  await prisma.user.delete({
    where: {
      email: req.email
    }
  })
  return c.json({
    code: 0,
    msg: 'success',
  })
})

app.put('/user', async (c) => {
  const body = await c.req.json()
  const data = userSchema.parse(body)
  await prisma.user.update({
    data,
    where: {
      email: data.email
    }
  })

  return c.json({
    code: 0,
    msg: 'success',
  })
})

export const POST = handle(app)
export const GET = handle(app)
export const DELETE = handle(app)
export const PUT = handle(app)