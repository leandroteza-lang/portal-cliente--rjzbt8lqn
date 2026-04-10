import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from 'jsr:@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Server configuration error: missing env vars')
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

    const authHeader = req.headers.get('Authorization')
    if (!authHeader) throw new Error('Missing Authorization header')

    const token = authHeader.replace('Bearer ', '')
    const {
      data: { user },
      error: userError,
    } = await supabaseAdmin.auth.getUser(token)
    if (userError || !user) throw new Error('Unauthorized')

    const body = await req.json()
    const { action, userId, newPassword, oldPassword } = body

    if (!userId || !newPassword) {
      throw new Error('Missing required fields')
    }

    if (action === 'admin-update') {
      const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single()
      if (!profile?.is_admin) throw new Error('Forbidden')

      const { error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
        password: newPassword,
      })
      if (error) throw new Error(error.message)

      await supabaseAdmin.from('historico_clientes').insert({
        cliente_id: userId,
        dados_novos: {
          tipo: 'Senha Criada/Alterada',
          data: new Date().toISOString(),
          admin_id: user.id,
        },
      })

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (action === 'client-update') {
      if (userId !== user.id) throw new Error('Forbidden')

      const { error: signInError } = await supabaseAdmin.auth.signInWithPassword({
        email: user.email!,
        password: oldPassword,
      })

      if (signInError) throw new Error('Senha atual incorreta')

      const { error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
        password: newPassword,
      })
      if (error) throw new Error(error.message)

      await supabaseAdmin.from('historico_clientes').insert({
        cliente_id: userId,
        dados_novos: { tipo: 'Senha Alterada pelo Cliente', data: new Date().toISOString() },
      })

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    throw new Error('Invalid action')
  } catch (error: any) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
