export const submitRequest = async (
  organizationSlug: string,
  data: { 
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    company?: string;
    notes?: string;
    subject: string;
    description: string;
  }
) => {
  const response = await fetch(
    `/api/public/${organizationSlug}/submit`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }
  );
  
  if (!response.ok) {
    let errorMessage = 'Submission failed';
    try {
      const error = await response.json();
      errorMessage = error.message || errorMessage;
    } catch (e) {
      // If JSON parsing fails, use status text
      errorMessage = response.statusText || errorMessage;
    }
    throw new Error(errorMessage);
  }
  
  try {
    return await response.json();
  } catch (e) {
    throw new Error('Invalid response from server');
  }
};
