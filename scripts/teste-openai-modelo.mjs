// Script temporário só pra descobrir o erro exato da OpenAI.
// Rodar com: node --env-file=.env.local scripts/teste-openai-modelo.mjs
import OpenAI from 'openai';

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY, timeout: 30_000 });

const MODELOS = ['gpt-5-mini', 'gpt-5-nano', 'gpt-5', 'gpt-4o-mini', 'gpt-4o', 'gpt-4.1-mini'];

for (const modelo of MODELOS) {
  process.stdout.write(`[${modelo}] testando... `);
  try {
    const r = await client.chat.completions.create({
      model: modelo,
      messages: [{ role: 'user', content: 'diga apenas "ok" em uma palavra' }],
      max_completion_tokens: 5,
    });
    console.log('OK ✓ — resposta:', r.choices[0].message.content);
  } catch (e) {
    console.log('FALHOU ✗');
    console.log('   status:', e.status);
    console.log('   code:', e.code);
    console.log('   message:', e.message?.slice(0, 200));
  }
}
