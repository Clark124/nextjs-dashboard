import { NextAuthConfig } from "next-auth";

export const authConfig = {
    pages:{
        signIn:"/login"
    },
    callbacks:{
        authorized({auth,request:{nextUrl,}}){
            const isLogin = !!auth?.user
            const isOnDashBoard = nextUrl.pathname.startsWith("/dashboard")
            if(isOnDashBoard){
                return isLogin
            }else if(isLogin){
                return Response.redirect(new URL('/dashboard',nextUrl))
            }
            return true
        }
    },
    providers:[]

} as NextAuthConfig