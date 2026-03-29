import { hasServerKey } from '@/lib/providers';

export async function GET() {
  return Response.json({
    providers: {
      google: hasServerKey('google'),
      openai: hasServerKey('openai'),
      anthropic: hasServerKey('anthropic'),
      groq: hasServerKey('groq'),
    },
  });
}
