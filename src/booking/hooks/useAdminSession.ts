import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Session } from '@supabase/supabase-js'

// 관리자 세션 + rf_admins 화이트리스트 여부
export function useAdminSession() {
  const [session, setSession] = useState<Session | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let alive = true

    const check = async (sess: Session | null) => {
      if (!sess) {
        if (alive) {
          setSession(null)
          setIsAdmin(false)
          setLoading(false)
        }
        return
      }
      const { data } = await supabase.rpc('rf_is_admin')
      if (!alive) return
      setSession(sess)
      setIsAdmin(Boolean(data))
      setLoading(false)
    }

    supabase.auth.getSession().then(({ data }) => check(data.session))
    const { data: sub } = supabase.auth.onAuthStateChange((_e, sess) => {
      setLoading(true)
      check(sess)
    })
    return () => {
      alive = false
      sub.subscription.unsubscribe()
    }
  }, [])

  const signOut = () => supabase.auth.signOut()

  return { session, isAdmin, loading, signOut }
}
