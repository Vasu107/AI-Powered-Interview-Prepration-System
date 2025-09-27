"use client"
import { UserDetailContext } from '@/context/UserDetailContext'
import { supabase } from '@/services/supabaseClient'
import React, { useContext, useEffect, useState } from 'react'

function Provider({ children }) {

    const [user, setUser]=useState()
    useEffect(() => {
        CreateNewUser();
    }, []);

    const CreateNewUser = async () => {
        try {
            const { data: { user: authUser } } = await supabase.auth.getUser();
            
            if (!authUser) {
                setUser(null);
                return;
            }

            // Check if user already exists in the database
            let { data: Users, error } = await supabase
                .from('Users')
                .select("*")
                .eq('email', authUser?.email);

            console.log('Existing users:', Users);
            
            // If not, create a new user in the database
            if (Users?.length === 0) {
                const { data, error } = await supabase.from("Users")
                    .insert([
                        {
                            name: authUser?.user_metadata?.name || authUser?.user_metadata?.full_name,
                            email: authUser?.email, 
                            picture: authUser?.user_metadata?.picture || authUser?.user_metadata?.avatar_url
                        }
                    ])
                    .select();
                
                console.log('New user created:', data);
                setUser(data?.[0] || {
                    name: authUser?.user_metadata?.name || authUser?.user_metadata?.full_name,
                    email: authUser?.email,
                    picture: authUser?.user_metadata?.picture || authUser?.user_metadata?.avatar_url
                });
                return;
            }
            setUser(Users?.[0] || null);
        } catch (error) {
            console.error('Error creating user:', error);
        }
    }
    return(
        <UserDetailContext.Provider value={{user, setUser}}>
        <div>{children}</div>
        </UserDetailContext.Provider>
    )
}

export default Provider

export const useUser=()=>{
    const context=useContext(UserDetailContext);
    return context;
}