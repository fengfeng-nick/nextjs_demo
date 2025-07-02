'use client'

import { useEffect, useState } from "react"

interface User {
  name: string
  age: number
  email: string
}

interface Response {
  code: number
  msg: string
  data?: any
}

export default function Home() {
  const [name, setName] = useState<string>()
  const [age, setAge] = useState<number>()
  const [email, setEmail] = useState<string>()

  const [users, setUsers] = useState<User[]>([])
  const [mode, setMode] = useState<'add' | 'update' | 'close'>('close')

  async function add() {
    await fetch('/api/user', {
      method: 'POST', body: JSON.stringify({
        name,
        age,
        email
      })
    })

    getUsers()
  }

  async function getUsers() {
    const res = await fetch('/api/users', { method: 'GET' })
    const data: Response = await res.json()
    if (data.code === 0) {
      setUsers(data.data)
    }
  }

  async function handleDelete(email: string) {
    await fetch('/api/user', {
      method: 'DELETE', body: JSON.stringify({
        email
      })
    })

    getUsers()
  }

  function handleUpdate(user: User) {
    setMode('update')
    setName(user.name)
    setAge(user.age)
    setEmail(user.email)
  }

  async function handleUpdateSubmit() {
    await fetch('/api/user', {
      method: 'PUT', body: JSON.stringify({
        name,
        age,
        email
      })
    })

    getUsers()
  }

  useEffect(() => {
    getUsers()
  }, [])

  return (<div className="flex flex-col justify-center items-center mt-20">
    <div onClick={() => setMode('add')}>
      新增
    </div>

    {
      mode === 'add' ? (
        <div className="flex flex-col" onSubmit={add}>
          <input value={name} onChange={e => setName(e.target.value)} type="text" name="name" placeholder="请输入用户名" />
          <input value={age} onChange={e => setAge(Number(e.target.value))} type="number" name="age" placeholder="请输入年龄" />
          <input value={email} onChange={e => setEmail(e.target.value)} type="text" name="email" placeholder="请输入邮箱" />
          <button onClick={add}>新增</button>
        </div>
      ) : mode === 'update' ? (
        <div className="flex flex-col" onSubmit={add}>
          <input value={name} onChange={e => setName(e.target.value)} type="text" name="name" placeholder="请输入用户名" />
          <input value={age} onChange={e => setAge(Number(e.target.value))} type="number" name="age" placeholder="请输入年龄" />
          <input value={email} onChange={e => setEmail(e.target.value)} type="text" name="email" placeholder="请输入邮箱" />
          <button onClick={handleUpdateSubmit}>修改</button>
        </div>
      ) : ''
    }

    {/* 列表 */}
    <div className="flex flex-col mt-30">
      {
        users.map((user) => (
          <div key={user.email} className="flex gap-5">
            <div>{user.name}</div>
            <div>{user.age}</div>
            <div>{user.email}</div>
            <div onClick={() => handleUpdate(user)}>修改</div>
            <div onClick={() => handleDelete(user.email)}>删除</div>
          </div>
        ))
      }
    </div>
  </div>)
}
