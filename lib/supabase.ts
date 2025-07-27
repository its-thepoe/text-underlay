import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/types_db'

export const supabase = createClientComponentClient<Database>()

// Function to create or update user profile
export const createOrUpdateProfile = async (userId: string, profileData: {
  full_name?: string
  avatar_url?: string
  username?: string
}) => {
  console.log('Creating profile with data:', { userId, profileData });
  
  const profileToInsert = {
    id: userId,
    full_name: profileData.full_name || null,
    avatar_url: profileData.avatar_url || null,
    username: profileData.username || null,
    images_generated: 0,
    paid: false,
    subscription_id: null
  };
  
  console.log('Profile to insert:', profileToInsert);
  
  const { data, error } = await supabase
    .from('profiles')
    .upsert(profileToInsert)
    .select()
    .single()

  if (error) {
    console.error('Error creating/updating profile:', error)
    console.error('Error details:', error.details, error.hint, error.message)
    throw error
  }

  console.log('Profile created/updated successfully:', data);
  return data
}

// Function to get user profile
export const getUserProfile = async (userId: string) => {
  console.log('getUserProfile called with userId:', userId);
  
  // First check if we have a valid session
  const { data: { session } } = await supabase.auth.getSession();
  console.log('Current session:', session?.user?.id);
  
  if (!session) {
    throw new Error('No active session');
  }
  
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) {
    console.error('Error fetching profile:', error)
    // If profile doesn't exist, create it
    if (error.code === 'PGRST116') {
      console.log('Profile not found, creating new profile...');
      return await createOrUpdateProfile(userId, {
        full_name: session.user.user_metadata?.full_name,
        avatar_url: session.user.user_metadata?.avatar_url,
        username: session.user.user_metadata?.email
      });
    }
    throw error
  }

  console.log('getUserProfile result:', data);
  return data
} 