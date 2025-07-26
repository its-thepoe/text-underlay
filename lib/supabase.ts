import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/types_db'

export const supabase = createClientComponentClient<Database>()

// Function to create or update user profile
export const createOrUpdateProfile = async (userId: string, profileData: {
  full_name?: string
  avatar_url?: string
  username?: string
}) => {
  const { data, error } = await supabase
    .from('profiles')
    .upsert({
      id: userId,
      full_name: profileData.full_name || null,
      avatar_url: profileData.avatar_url || null,
      username: profileData.username || null,
      images_generated: 0,
      paid: false,
      subscription_id: null
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating/updating profile:', error)
    throw error
  }

  return data
}

// Function to get user profile
export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) {
    console.error('Error fetching profile:', error)
    throw error
  }

  return data
} 