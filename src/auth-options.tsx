import NextAuth, {NextAuthOptions} from "next-auth"
import bcrypt from "bcryptjs"
import {PrismaAdapter} from "@next-auth/prisma-adapter";
import {db} from "@/lib/db";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions:NextAuthOptions = {
    adapter:PrismaAdapter(db),
    providers:[
        CredentialsProvider({
            name:'credentials',
            credentials:{
                email:{label:"email", type:"string"},
                password:{label:"password", type:"password"},
            },
            async authorize(credentials){
                if(!credentials?.email || !credentials?.password){
                    throw new Error("Invalid Credentials.")
                }
                const user = await db.users.findUnique({
                    where:{email:credentials.email}
                })
                if(!user){
                    throw new Error("No User Found.")
                }
                const isCorrectPassword = await bcrypt.compare(credentials.password,user.password)

                if(!isCorrectPassword){
                    throw new Error("Invalid Credentials.")
                }

                if(!user.verified){
                    throw new Error("Please verify your email.")
                }
                return user
            }
        }),

    ],
    debug : process.env.NODE_ENV === "development",
    session:{
        strategy:'jwt',
        maxAge : 7 * 24 * 60 * 60, // 30 days
    },

    callbacks: {
        async session({ session, token }) {
            return {
                ...session,
                user: {
                    ...session.user,
                    id: token.id
                }
            }
        },
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
            }
            return token
        }
    },
    secret:process.env.NEXTAUTH_SECRET,
};
const handler = NextAuth(authOptions);

export {handler as GET, handler as POST};