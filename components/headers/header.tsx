"use client"
import React, { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { signOut } from 'next-auth/react'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useEmailStore } from '@/store/store'

const Header = () => {
  const {clearUser,clearAnswers} = useEmailStore()
    const path = usePathname()
    const handleSignOut = () => {
        // Logic to handle sign out
        clearUser(),
        clearAnswers(0,""),
        signOut({
          callbackUrl: '/signin',
        })
      }
    const listItems =[{
        name: 'dashboard',
    },{
        name:"questions"
    },{
        name:"profile"
    },{
        name:"help"
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
        <Button onClick={handleSignOut} variant="destructive">
          Sign Out
        </Button>
    </div>
  )
}

export default Header