import { POST } from '@/app/api/documents/analyze/route';
import { describe, it, expect, vi, afterEach } from 'vitest';

describe('AI Response Parsing (analyze/route.ts)', () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
    delete process.env.OPENROUTER_API_KEY;
  });

  it('parses valid JSON successfully', async () => {
    process.env.OPENROUTER_API_KEY = 'test-key';
    const mockJson = { summary: 'test summary', documentType: 'Contract' };
    
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        choices: [{ message: { content: JSON.stringify(mockJson) } }]
      })
    });

    const req = new Request('http://localhost', { method: 'POST' });
    req.json = async () => ({ documentContext: { pages: [{ pageNumber: 1, text: 'text' }] } });

    const res = await POST(req);
    const data = await res.json();
    expect(data.analysis).toEqual(mockJson);
    expect(data.status).toBe('complete');
  });

  it('strips fenced JSON markdown successfully', async () => {
    process.env.OPENROUTER_API_KEY = 'test-key';
    const mockContent = '```json\n{"summary": "test summary"}\n```';
    
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        choices: [{ message: { content: mockContent } }]
      })
    });

    const req = new Request('http://localhost', { method: 'POST' });
    req.json = async () => ({ documentContext: { pages: [{ pageNumber: 1, text: 'text' }] } });

    const res = await POST(req);
    const data = await res.json();
    expect(data.analysis).toEqual({ summary: 'test summary' });
  });

  it('handles malformed JSON failure gracefully', async () => {
    process.env.OPENROUTER_API_KEY = 'test-key';
    const mockContent = '{ malformed: true ';
    
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        choices: [{ message: { content: mockContent } }]
      })
    });

    const req = new Request('http://localhost', { method: 'POST' });
    req.json = async () => ({ documentContext: { pages: [{ pageNumber: 1, text: 'text' }] } });

    const res = await POST(req);
    expect(res.status).toBe(502);
    const data = await res.json();
    expect(data.error).toBe('Failed to parse AI JSON response.');
  });
});
