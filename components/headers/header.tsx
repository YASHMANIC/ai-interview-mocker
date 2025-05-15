"use client"
import React, { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { signOut } from 'next-auth/react'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useEmailStore } from '@/store/store'

const Header = () => {
  const {clearUser,clearAnswers} = useEmailStore()
    const path = usePathname()
    const router = useRouter()
    const handleSignOut = () => {
        // Logic to handle sign out
        clearUser(),
        clearAnswers(0,""),
        signOut({
          callbackUrl: 'https://ai-interview-mocker-w2lr.onrender.com/sign-in',
        })
      }
    const listItems =[{
        name: 'dashboard',
        link: "/dashboard"
    },{
        name:"questions",
        link:"/"
    },{
        name:"profile",
        link:'/'
    },{
        name:"help",
        link:"/"
    }
    ]
  return (
    <div className='flex p-2 items-center justify-between bg-secondary shadow-gray-200'>
        <Image src={'/logo.svg'} width={70} height={70} alt='logo'/>
        <ul className='hidden md:flex gap-6'>
            {listItems.map((item) => (
                <li key={item.name} className={`hover:text-font hover:font-bold transition-all cursor-pointer 
                ${path === `/${item.name}` ? 'text-font font-bold' : ''}`}>
                    {item.name.toUpperCase()}
                </li>
            ))}
        </ul>
        {path === "dashboard" ? (
          <Button onClick={handleSignOut} variant="destructive">
          Sign Out
        </Button>
        ) :
          <Button onClick={() => router.push("/dashboard")} variant="destructive">
          Go Home
        </Button> 
        }
    </div>
  )
}

export default Header