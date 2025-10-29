"use client"

import { useState } from "react";
import Login from "@/app/auth/login/page";
import Register from "@/app/auth/register/page";

export default function Auth(){
    const [isLogin, setIsLogin] = useState(false)

    return (
        <div>
            {isLogin ? (
                <Login />
            ) : (
                <Register />
            )}
        </div>
    )
}