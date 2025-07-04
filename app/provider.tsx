// Share user information globally after the app starts

'use client'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useUser } from '@clerk/nextjs';
import { UserDetailContext } from '@/context/UserDetailContext';

export type UsersDetail = {
    name: string,
    email: string,
    credits: number,
}

export default function provider({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    // fetch the user object based on the Clerk's authentication state
    const { user } = useUser();
    // const [userDetail, setUserDetail] = useState<UsersDetail | undefined>();
    const [userDetail, setUserDetail] = useState<any>();

    // execute when the user object changes
    useEffect(() => {
        user && CreateNewUser();
    }, [user])

    // create a user record in the database
    const CreateNewUser = async () => {
        const result = await axios.post('/api/users');
        console.log(result.data);
        setUserDetail(result.data);
    }
    return (
        <div>
            <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
                {children}
            </UserDetailContext.Provider>
        </div>
    )
}