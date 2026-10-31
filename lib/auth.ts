import { supabase } from './supabase'
import type { User } from '@/types/app'

type SessionListener = (session: { user: User } | null) => void

const DEMO_USER_ID = 'demo-user-1'

let session: { user: User } | null = null
const listeners = new Set<SessionListener>()

const hasSupabase =
  Boolean(process.env.EXPO_PUBLIC_SUPABASE_URL) &&
  Boolean(process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY)

function notify() {
  listeners.forEach((listener) => listener(session))
}

export const auth = {
  getSession: (): { user: User } | null => session,

  onAuthStateChange: (listener: SessionListener) => {
    listeners.add(listener)
    // Fire once with current state so consumers can initialize synchronously.
    listener(session)
    return {
      dispose: () => listeners.delete(listener),
    }
  },

  async signIn(email: string, password: string): Promise<{ error: string | null }> {
    try {
      if (hasSupabase) {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) return { error: error.message }
        const user = (await supabase.auth.getUser()).data.user
        if (user) {
          session = {
            user: {
              id: user.id,
              email: user.email ?? email,
              fullName: (user.user_metadata as { full_name?: string } | undefined)?.full_name ??
                email.split('@')[0],
            },
          }
          notify()
        }
        return { error: null }
      }

      // Demo mode — any credentials work, so the prototype is fully functional offline.
      await new Promise((resolve) => setTimeout(resolve, 600))
      session = {
        user: {
          id: DEMO_USER_ID,
          email,
          fullName: email.split('@')[0],
        },
      }
      notify()
      return { error: null }
    } catch (e) {
      return { error: e instanceof Error ? e.message : 'Sign in failed' }
    }
  },

  async signUp(
    email: string,
    password: string,
    fullName: string,
  ): Promise<{ error: string | null }> {
    try {
      if (hasSupabase) {
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) return { error: error.message }
        return { error: null }
      }

      await new Promise((resolve) => setTimeout(resolve, 600))
      session = {
        user: { id: DEMO_USER_ID, email, fullName },
      }
      notify()
      return { error: null }
    } catch (e) {
      return { error: e instanceof Error ? e.message : 'Sign up failed' }
    }
  },

  async signOut(): Promise<void> {
    if (hasSupabase) {
      await supabase.auth.signOut()
    }
    session = null
    notify()
  },
}

export type { User }
export { DEMO_USER_ID }
