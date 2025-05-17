"use client"
import React, { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { signOut } from 'next-auth/react'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useEmailStore } from '@/store/store'
import Link from 'next/link'

const Header = () => {
  const {clearUser,clearAnswers} = useEmailStore()
    const path = usePathname()
    const router = useRouter()
    const handleSignOut = () => {
        // Logic to handle sign out
        clearUser(),
        clearAnswers(0,""),
        signOut({
          callbackUrl: '/sign-in',
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
              <Link key={item.name} href={item.link}>
                <li key={item.name} className={`hover:text-font hover:font-bold transition-all cursor-pointer 
                ${path === `/${item.name}` ? 'text-font font-bold' : ''}`}>
                    {item.name.toUpperCase()}
                </li>
              </Link>
            ))}
        </ul>
        {path === '/dashboard' ? (
            <Button onClick={handleSignOut} className='cursor-pointer' variant="destructive">
                Sign Out
            </Button>
        ) : 
        <Button onClick={() => router.push("/dashboard")} variant="outline" className='bg-blue-600 cursor-pointer' 
        disabled={path.includes('/dashboard/interview/') && path.includes('/start')}
        >
          Go Home
        </Button>
        }
    </div>
  )
}

export default Header