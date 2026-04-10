import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/use-auth'

export function useNotificationsCount() {
  const { user } = useAuth()
  const [count, setCount] = useState(0)

  useEffect(() => {
    const fetchCount = async () => {
      if (!user) return
      const { count, error } = await supabase
        .from('notificacoes')
        .select('*', { count: 'exact', head: true })
        .eq('cliente_id', user.id)
        .eq('lido', false)

      if (!error && count !== null) {
        setCount(count)
      }
    }

    fetchCount()

    const handleUpdate = () => fetchCount()
    window.addEventListener('notifications-updated', handleUpdate)
    return () => window.removeEventListener('notifications-updated', handleUpdate)
  }, [user])

  return count
}
