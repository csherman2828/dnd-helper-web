export async function sendRequest(url: string, options: RequestInit) {
  const response = await fetch(url, options);

  if (!response.ok) {
    console.error('Bad Response', {
      url,
      status: response.status,
      statusText: response.statusText,
    });
    throw new Error(
      `Bad Response: ${response.status}: ${response.statusText} on ${url}`,
    );
  }

  return response;
}
