import { POST } from '@/app/api/chat/route';
import { describe, it, expect, vi, afterEach } from 'vitest';

describe('Chat Grounding Boundary', () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
    delete process.env.OPENROUTER_API_KEY;
  });

  it('injects document context and legal disclaimer boundary', async () => {
    process.env.OPENROUTER_API_KEY = 'test-key';
    
    let capturedBody: { messages: { role: string; content: string }[] };
    global.fetch = vi.fn().mockImplementation(async (url, options) => {
      capturedBody = JSON.parse(options.body);
      return {
        ok: true,
        json: async () => ({ choices: [{ message: { content: 'test reply' } }] })
      };
    });

    const req = new Request('http://localhost', { method: 'POST' });
    req.json = async () => ({
        messages: [{ role: 'user', content: 'hello' }],
        documentContext: { filename: 'test.pdf', pages: [{ pageNumber: 1, text: 'Document body text' }] }
    });

    await POST(req);
    
    const sysMessages = capturedBody!.messages.filter((m: { role: string; content: string }) => m.role === 'system');
    
    // Core boundary instruction check
    expect(sysMessages[0].content).toContain('Sightline provides information, not legal advice.');
    expect(sysMessages[0].content).toContain('Never claim that information came from a document unless');
    expect(sysMessages[0].content).toContain('Never fabricate clauses');
    
    // Document context injection check
    expect(sysMessages[1].content).toContain('test.pdf');
    expect(sysMessages[1].content).toContain('Document body text');
  });

  it('protects against large documents by dropping context and replacing with boundary notice', async () => {
    process.env.OPENROUTER_API_KEY = 'test-key';
    
    let capturedBody: { messages: { role: string; content: string }[] };
    global.fetch = vi.fn().mockImplementation(async (url, options) => {
      capturedBody = JSON.parse(options.body);
      return {
        ok: true,
        json: async () => ({ choices: [{ message: { content: 'test reply' } }] })
      };
    });

    const hugeText = 'a'.repeat(40000);

    const req = new Request('http://localhost', { method: 'POST' });
    req.json = async () => ({
        messages: [{ role: 'user', content: 'hello' }],
        documentContext: { filename: 'huge.pdf', pages: [{ pageNumber: 1, text: hugeText }] }
    });

    await POST(req);
    
    const sysMessages = capturedBody!.messages.filter((m: { role: string; content: string }) => m.role === 'system');
    
    // Second system message should be the fallback notice, not the huge text
    expect(sysMessages[1].content).toContain('too large for the current direct-analysis mode');
    expect(sysMessages[1].content).not.toContain(hugeText);
  });
});
