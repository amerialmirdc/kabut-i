'use client'
import { useEffect } from "react"
import { useRouter } from 'next/navigation'

export default function Dashboard(){
  const router = useRouter()

  useEffect(()=>{
    router.push('dashboard/fogger')
  }, [])

  return(
    <>
      <h1>Dashboard</h1>
    </>
  )
}