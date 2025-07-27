import { User } from "@supabase/auth-helpers-nextjs"
import {
    useSessionContext,
    useUser as useSupaUser
} from "@supabase/auth-helpers-react";
import { Profile } from "@/types";
import { getUserProfile } from "@/lib/supabase";

import { useContext, createContext, useState, useEffect } from "react";

type UserContextType = {
    accessToken: string | null;
    user: User | null;
    userDetails: Profile | null;
    isLoading: boolean;
}

export const UserContext = createContext<UserContextType | undefined>(
    undefined
);

export interface Props {
    [propName: string]: any;
}

export const MyUserContextProvider = (props: Props) => {
    const {
        session,
        isLoading: isLoadingUser,
        supabaseClient: supabase
    } = useSessionContext()
    const user = useSupaUser()
    const accessToken = session?.access_token ?? null;
    const [isLoadingData, setIsLoadingData] = useState(false)
    const [userDetails, setUserDetails] = useState<Profile | null>(null)

    // Refresh session on mount to ensure we have the latest user data
    useEffect(() => {
        if (session && !user) {
            console.log('Session available but no user, refreshing...');
            supabase.auth.refreshSession();
        }
    }, [session, user, supabase.auth])

    useEffect(() => {
        if (user && !isLoadingData && !userDetails) {
            setIsLoadingData(true)
            console.log('Fetching user profile for:', user.id);

            getUserProfile(user.id).then(
                (data) => {
                    console.log('User profile fetched:', data);
                    setUserDetails(data as Profile);
                    setIsLoadingData(false)
                }
            ).catch((error) => {
                console.error('Error fetching user details:', error);
                // If it's a 406 error, try creating the profile
                if (error.message?.includes('406') || error.code === 'PGRST116') {
                    console.log('Attempting to create profile...');
                    import('@/lib/supabase').then(({ createOrUpdateProfile }) => {
                        createOrUpdateProfile(user.id, {
                            full_name: user.user_metadata?.full_name,
                            avatar_url: user.user_metadata?.avatar_url,
                            username: user.user_metadata?.email
                        }).then((profile) => {
                            console.log('Profile created:', profile);
                            setUserDetails(profile as Profile);
                            setIsLoadingData(false);
                        }).catch((createError) => {
                            console.error('Error creating profile:', createError);
                            setIsLoadingData(false);
                        });
                    });
                } else {
                    setIsLoadingData(false);
                }
            })
        } else if (!user && !isLoadingUser && !isLoadingData) {
            console.log('Clearing user details');
            setUserDetails(null);
        }
    }, [user, isLoadingUser])

    const value = {
        accessToken,
        user,
        userDetails,
        isLoading: isLoadingUser || isLoadingData,
    }

    return <UserContext.Provider value={value} {...props} />
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a MyUserContextProvider')
    }

    return context;
}