import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { Resend } from 'npm:resend@3.2.0';
import { corsHeaders } from '../_shared/cors.ts';

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { cliente_email, assunto, mensagem } = await req.json();

    if (!cliente_email || !assunto || !mensagem) {
      throw new Error('Parâmetros cliente_email, assunto e mensagem são obrigatórios.');
    }

    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
    if (!RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY não configurada no Supabase Secrets.');
    }

    const resend = new Resend(RESEND_API_KEY);

    const { data, error } = await resend.emails.send({
      from: 'Portal do Cliente <onboarding@resend.dev>',
      to: cliente_email,
      subject: assunto,
      html: `<p>${mensagem}</p>`,
    });

    if (error) {
      throw new Error(error.message);
    }

    return new Response(
      JSON.stringify({ success: true, data }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    );
  }
});
