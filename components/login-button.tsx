import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { FcGoogle } from "react-icons/fc"
import { useSupabaseClient } from "@supabase/auth-helpers-react"

const LoginButton = () => {
  const supabase = useSupabaseClient()
  const { toast } = useToast()
  
  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            queryParams: {
                access_type: 'offline',
                prompt: 'consent',
            },
            redirectTo: 'https://textbehindimage.rexanwong.xyz/app'
        },
    })

    if (error) {
        toast({
            title: "🔴 Something went wrong",
            description: "Please try again.",
        })
    }
  }

  return (
    <Button variant="outline" className="gap-2" onClick={() => signInWithGoogle()}>
      <FcGoogle />
      Log in
    </Button>
  )
}

export default LoginButton 