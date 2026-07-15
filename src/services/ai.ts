import type { ApplicationAnalysis, JobPosting, Profile } from '../domain/application';
import { analyzeApplication } from '../domain/scoring';

type ApiPayload = { profile: Profile; job: JobPosting };

export async function requestAnalysis(payload: ApiPayload): Promise<ApplicationAnalysis> {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 18_000);

  try {
    const response = await fetch('/api/ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'analyze', ...payload }),
      signal: controller.signal,
    });
    if (!response.ok) throw new Error(`API unavailable (${response.status})`);
    return (await response.json()) as ApplicationAnalysis;
  } catch {
    return analyzeApplication(payload.profile, payload.job);
  } finally {
    window.clearTimeout(timeout);
  }
}
