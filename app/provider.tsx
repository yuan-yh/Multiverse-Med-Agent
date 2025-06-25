'use client'
import React, { useEffect } from 'react'
import axios from 'axios'
import { useUser } from '@clerk/nextjs';

export default function provider({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    // fetch the user object based on the Clerk's authentication state
    const { user } = useUser();

    // execute when the user object changes
    useEffect(() => {
        user && CreateNewUser();
    }, [user])

    // create a user record in the database
    const CreateNewUser = async () => {
        const result = await axios.post('/api/users');
        console.log(result.data);
    }
    return (
        <div>{children}</div>
    )
}