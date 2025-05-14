"use client"

import {SessionProvider} from "next-auth/react";

interface AuthcontextProps{
    children : React.ReactNode
}
export default function Authcontext ({
    children
                                     }:AuthcontextProps){
    return <SessionProvider>{children}</SessionProvider>
}