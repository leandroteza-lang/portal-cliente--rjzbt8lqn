import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/use-auth'

export function useNotificationsCount() {
  const { session } = useAuth()
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!session?.user?.id) return

    const fetchCount = async () => {
      const { count } = await supabase
        .from('notificacoes')
        .select('*', { count: 'exact', head: true })
        .eq('cliente_id', session.user.id)
        .eq('lido', false)

      setCount(count || 0)
    }

    fetchCount()

    const channel = supabase
      .channel('notificacoes_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notificacoes',
          filter: `cliente_id=eq.${session.user.id}`,
        },
        () => {
          fetchCount()
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [session])

  return count
}
