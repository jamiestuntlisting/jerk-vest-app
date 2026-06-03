// Token-gated analytics summary for the /admin dashboard.
//
// The public app only ever holds the anon key (insert-only). This function runs
// with the service role and returns aggregated stats, but ONLY when the caller
// presents the correct admin token (set as the ADMIN_TOKEN secret). That token
// is what you type on /admin.
import { createClient } from 'jsr:@supabase/supabase-js@2';

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-admin-token, content-type, apikey',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: cors });
  }

  const expected = Deno.env.get('ADMIN_TOKEN') ?? '';
  const token = req.headers.get('x-admin-token') ?? '';
  if (!expected || token !== expected) {
    return new Response(JSON.stringify({ error: 'unauthorized' }), {
      status: 401,
      headers: { ...cors, 'content-type': 'application/json' },
    });
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );

  const { data, error } = await supabase.rpc('analytics_summary');
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...cors, 'content-type': 'application/json' },
    });
  }

  return new Response(JSON.stringify(data), {
    headers: { ...cors, 'content-type': 'application/json' },
  });
});
