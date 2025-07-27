import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/types_db'

export const supabase = createClientComponentClient<Database>()

// Function to create or update user profile
export const createOrUpdateProfile = async (userId: string, profileData: {
  full_name?: string
  avatar_url?: string
}) => {
  console.log('Creating profile with data:', { userId, profileData });
  console.log('ProfileData details:', {
    full_name: profileData.full_name,
    avatar_url: profileData.avatar_url,
    full_name_type: typeof profileData.full_name,
    avatar_url_type: typeof profileData.avatar_url
  });
  
  const profileToInsert = {
    id: userId,
    full_name: profileData.full_name || 'User',
    avatar_url: profileData.avatar_url || null,
    images_generated: 0,
    paid: false,
    subscription_id: null
  };
  
  console.log('Profile to insert:', profileToInsert);
  
  // First try to insert/update
  const { data: insertData, error: insertError } = await supabase
    .from('profiles')
    .upsert(profileToInsert)

  if (insertError) {
    console.error('Error creating/updating profile:', insertError)
    console.error('Error details:', insertError.details, insertError.hint, insertError.message)
    console.error('Full error object:', JSON.stringify(insertError, null, 2))
    throw insertError
  }

  console.log('Profile inserted successfully, now fetching...');

  // Then fetch the created profile
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) {
    console.error('Error fetching created profile:', error)
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
        avatar_url: session.user.user_metadata?.avatar_url
      });
    }
    throw error
  }

  console.log('getUserProfile result:', data);
  return data
} 