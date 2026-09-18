import { POST } from '@/app/api/documents/compare/route';
import { describe, it, expect, vi, afterEach } from 'vitest';

describe('Document Compare API', () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
    delete process.env.OPENROUTER_API_KEY;
  });

  it('returns 400 if documentAContext.pages is not an array', async () => {
    process.env.OPENROUTER_API_KEY = 'test-key';
    const req = new Request('http://localhost', { method: 'POST' });
    req.json = async () => ({
      documentAContext: { pages: 'not-an-array' },
      documentBContext: { pages: [] }
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it('returns 400 if documentBContext.pages is not an array', async () => {
    process.env.OPENROUTER_API_KEY = 'test-key';
    const req = new Request('http://localhost', { method: 'POST' });
    req.json = async () => ({
      documentAContext: { pages: [] },
      documentBContext: { pages: 'not-an-array' }
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it('rejects oversized comparison during construction with 413', async () => {
    process.env.OPENROUTER_API_KEY = 'test-key';
    const req = new Request('http://localhost', { method: 'POST' });
    
    // Create an array that throws if it iterates past the first element
    const oversizedPages: { pageNumber: number; text: string }[] = [];
    oversizedPages[0] = { pageNumber: 1, text: 'a'.repeat(400000) };
    Object.defineProperty(oversizedPages, '1', {
      get: () => { throw new Error('Iterated too far!'); }
    });
    // Set length so it thinks there are 2 elements
    oversizedPages.length = 2;

    req.json = async () => ({
      documentAContext: { filename: 'A.pdf', pages: oversizedPages },
      documentBContext: { filename: 'B.pdf', pages: [] }
    });

    const res = await POST(req);
    expect(res.status).toBe(413);
  });

  it('successfully processes a legitimate under-limit comparison', async () => {
    process.env.OPENROUTER_API_KEY = 'test-key';
    let capturedBody: { messages: { role: string; content: string }[] } | undefined;
    global.fetch = vi.fn().mockImplementation(async (url, options) => {
      capturedBody = JSON.parse(options.body);
      return {
        ok: true,
        json: async () => ({ choices: [{ message: { content: JSON.stringify({ changes: [] }) } }] })
      };
    });

    const req = new Request('http://localhost', { method: 'POST' });
    req.json = async () => ({
      documentAContext: { filename: 'A.pdf', pages: [{ pageNumber: 1, text: 'small A' }] },
      documentBContext: { filename: 'B.pdf', pages: [{ pageNumber: 1, text: 'small B' }] }
    });

    const res = await POST(req);
    const data = await res.json();
    
    expect(res.status).toBe(200);
    expect(data.changes).toBeDefined();
    
    // Ensure the external API was called with the assembled context
    expect(capturedBody).toBeDefined();
    expect(capturedBody!.messages[1].content).toContain('small A');
    expect(capturedBody!.messages[1].content).toContain('small B');
  });
});
