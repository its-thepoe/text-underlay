"use client"

import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useSupabaseClient } from "@supabase/auth-helpers-react"
import { Logout } from "iconsax-react"
import { useRouter } from "next/navigation"

interface LogoutButtonProps {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
}

const LogoutButton = ({ 
  variant = "outline", 
  size = "default", 
  className = "" 
}: LogoutButtonProps) => {
  const supabase = useSupabaseClient()
  const { toast } = useToast()
  const router = useRouter()
  
  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        toast({
          title: "🔴 Something went wrong",
          description: "Failed to sign out. Please try again.",
        })
        return
      }
      
      toast({
        title: "👋 Signed out successfully",
        description: "You have been signed out of your account.",
      })
      
      // Redirect to home page after successful logout
      router.push('/')
    } catch (err) {
      console.error('Error signing out:', err)
      toast({
        title: "🔴 Something went wrong",
        description: "Failed to sign out. Please try again.",
      })
    }
  }

  return (
    <Button 
      variant={variant} 
      size={size} 
      className={`gap-2 ${className}`} 
      onClick={handleSignOut}
    >
      <Logout size="16" />
      Logout
    </Button>
  )
}

export default LogoutButton
