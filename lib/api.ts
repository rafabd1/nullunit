/**
 * A wrapper for the native fetch function that automatically includes
 * the API base URL and credentials for cross-origin requests.
 * This ensures all API calls to the backend are authenticated correctly.
 *
 * @param endpoint The API endpoint to call (e.g., '/courses').
 * @param options Optional fetch options (method, body, etc.).
 */
export async function apiFetch(endpoint: string, options: RequestInit = {}): Promise<Response> {
  const apiUrlBase = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';
  const url = `${apiUrlBase}/api${endpoint}`;

  const defaultOptions: RequestInit = {
    credentials: 'include', // Crucial for sending cookies
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  const finalOptions = {
    ...options,
    ...defaultOptions,
  };

  return fetch(url, finalOptions);
} 