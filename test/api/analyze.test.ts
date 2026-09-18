import { POST } from '@/app/api/documents/analyze/route';
import { describe, it, expect, vi, afterEach } from 'vitest';

describe('Document Analysis API Happy Path', () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
    delete process.env.OPENROUTER_API_KEY;
  });

  it('successfully analyzes a document and returns correctly shaped JSON', async () => {
    process.env.OPENROUTER_API_KEY = 'test-key';
    
    const mockAnalysisResponse = {
      documentType: "Non-Disclosure Agreement",
      summary: "This is a mutual NDA between two parties.",
      keyPoints: [
        {
          point: "Confidentiality lasts for 5 years",
          evidence: {
            text: "The obligations of confidentiality shall survive for five (5) years",
            pageNumber: 1,
            sourceExcerpt: "survive for five (5) years"
          }
        }
      ]
    };

    let capturedBody: { messages?: { role: string; content: string }[] } | undefined;
    global.fetch = vi.fn().mockImplementation(async (url, options) => {
      capturedBody = JSON.parse(options.body);
      return {
        ok: true,
        text: async () => JSON.stringify({ choices: [{ message: { content: JSON.stringify(mockAnalysisResponse) } }] }),
        json: async () => ({ choices: [{ message: { content: JSON.stringify(mockAnalysisResponse) } }] })
      };
    });

    const req = new Request('http://localhost/api/documents/analyze', { method: 'POST' });
    req.json = async () => ({
      documentContext: { 
        filename: 'test-nda.pdf', 
        pageCount: 1,
        pages: [{ pageNumber: 1, text: 'The obligations of confidentiality shall survive for five (5) years.' }] 
      }
    });

    const res = await POST(req);
    const data = await res.json();
    
    // Assert response success
    expect(res.status).toBe(200);
    expect(data.status).toBe('complete');
    
    // Assert returned data matches mock
    expect(data.analysis.documentType).toBe("Non-Disclosure Agreement");
    expect(data.analysis.keyPoints).toHaveLength(1);
    expect(data.analysis.keyPoints[0].point).toContain("5 years");

    // Assert that the proper request was constructed
    expect(capturedBody?.messages).toBeDefined();
    
    const sysMessage = capturedBody!.messages!.find((m) => m.role === 'system');
    const userMessage = capturedBody!.messages!.find((m) => m.role === 'user');
    
    expect(sysMessage?.content).toContain('Sightline Legal Advisor Document Intelligence system');
    expect(userMessage?.content).toContain('test-nda.pdf');
    expect(userMessage?.content).toContain('The obligations of confidentiality shall survive');
  });
});
