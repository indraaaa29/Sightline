import '@testing-library/react';

// Node 18+ has global Request and Response.
// We only need to mock matchMedia if components use it, but keeping it empty is fine if they don't.
