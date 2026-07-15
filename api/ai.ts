import { analyzeApplication } from '../src/domain/scoring';
import { enforceFactuality } from '../server/ai/factuality';
import { GeminiProvider } from '../server/ai/gemini-provider';
import { ApiRequestSchema } from '../server/ai/schemas';
import { allowRequest } from '../server/security/rate-limit';

export default {
  async fetch(request: Request): Promise<Response> {
    if (request.method !== 'POST') return Response.json({ error: 'Method not allowed' }, { status: 405 });
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'anonymous';
    if (!allowRequest(ip)) return Response.json({ error: 'Too many requests' }, { status: 429 });

    try {
      const input = ApiRequestSchema.parse(await request.json());
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) return Response.json(analyzeApplication(input.profile, input.job));

      const provider = new GeminiProvider(apiKey);
      const result = await provider.analyzeApplication(input);
      return Response.json(enforceFactuality(input, result.analysis), {
        headers: { 'Cache-Control': 'no-store', 'X-Prompt-Version': result.metadata.promptVersion },
      });
    } catch (error) {
      const message = error instanceof Error && error.name === 'ZodError' ? 'Invalid request' : 'Analysis unavailable';
      return Response.json({ error: message }, { status: message === 'Invalid request' ? 400 : 503 });
    }
  },
};
