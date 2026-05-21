const BASE_URL = import.meta.env.VITE_PHP_API_BASE || '';

export async function submitBusiness(formData) {
  const res = await fetch(`${BASE_URL}/submit.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Server error' }));
    throw new Error(err.message || `HTTP ${res.status}`);
  }

  return res.json();
}

export async function getMySubmissions(shopifyCustomerId) {
  const res = await fetch(`${BASE_URL}/submissions.php?customer_id=${encodeURIComponent(shopifyCustomerId)}`);

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }

  return res.json();
}
