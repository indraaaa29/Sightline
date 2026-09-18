import { POST } from '@/app/api/documents/extract/route';
import { describe, it, expect, vi } from 'vitest';

vi.mock('pdf-parse/lib/pdf-parse.js', () => {
  return {
    default: async () => ({ numpages: 1, text: 'Mock PDF Content' })
  };
});

describe('Document Extraction API', () => {
  it('rejects missing file', async () => {
    const formData = new FormData();
    const req = new Request('http://localhost/api/documents/extract', {
      method: 'POST',
    });
    req.formData = async () => formData;
    
    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe('No file provided');
  });

  it('rejects invalid file type', async () => {
    const formData = new FormData();
    const file = new File(['dummy content'], 'test.txt', { type: 'text/plain' });
    formData.append('file', file);
    
    const req = new Request('http://localhost/api/documents/extract', {
      method: 'POST',
    });
    req.formData = async () => formData;
    
    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe('Only PDF files are supported');
  });

  it('rejects oversized files', async () => {
    const formData = new FormData();
    const file = new File(['a'.repeat(21 * 1024 * 1024)], 'test.pdf', { type: 'application/pdf' });
    formData.append('file', file);
    
    const req = new Request('http://localhost/api/documents/extract', {
      method: 'POST',
    });
    req.formData = async () => formData;
    
    const res = await POST(req);
    expect(res.status).toBe(413);
    const data = await res.json();
    expect(data.error).toBe('File size exceeds the 20MB limit');
  });

  it('handles extraction failure safely', async () => {
    // Simulating a failed buffer read
    const formData = new FormData();
    const file = new File(['dummy content'], 'test.pdf', { type: 'application/pdf' });
    file.arrayBuffer = async () => { throw new Error('Simulated read error'); };
    formData.append('file', file);
    
    const req = new Request('http://localhost/api/documents/extract', {
      method: 'POST',
    });
    req.formData = async () => formData;
    
    const res = await POST(req);
    expect(res.status).toBe(500);
    const data = await res.json();
    expect(data.error).toBe('Failed to extract text from PDF.');
  });
});
