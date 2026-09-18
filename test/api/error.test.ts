import { POST as ChatPOST } from '@/app/api/chat/route';
import { POST as AnalyzePOST } from '@/app/api/documents/analyze/route';
import { describe, it, expect, vi, afterEach } from 'vitest';

describe('Global Error Handling Boundaries', () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
    delete process.env.OPENROUTER_API_KEY;
  });

  it('chat route returns 502 on upstream network failure', async () => {
    process.env.OPENROUTER_API_KEY = 'test-key';
    
    global.fetch = vi.fn().mockRejectedValue(new Error('Network disconnected'));

    const req = new Request('http://localhost', { method: 'POST' });
    req.json = async () => ({ messages: [{ role: 'user', content: 'hello' }] });

    const res = await ChatPOST(req);
    expect(res.status).toBe(500); // Wait, chat route catches this and returns 500
    const data = await res.json();
    expect(data.error).toBe('An unexpected error occurred while processing the chat.');
  });

  it('analyze route returns 502 on upstream non-ok response', async () => {
    process.env.OPENROUTER_API_KEY = 'test-key';
    
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      text: async () => 'Internal Server Error from upstream'
    });

    const req = new Request('http://localhost', { method: 'POST' });
    req.json = async () => ({ documentContext: { pages: [] } });

    const res = await AnalyzePOST(req);
    expect(res.status).toBe(502);
    const data = await res.json();
    expect(data.error).toBe('Failed to communicate with AI provider.');
  });
});
