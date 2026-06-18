const BASE_URL = import.meta.env.VITE_PHP_API_BASE || '';

export async function submitBusiness(fields, imageFiles = []) {
  const body = new FormData();
  Object.entries(fields).forEach(([key, value]) => {
    body.append(key, value ?? '');
  });
  const baseName = (fields.business_name || 'business').replace(/[^a-z0-9]+/gi, '_').replace(/^_|_$/g, '');
  imageFiles.forEach((file, i) => {
    const ext = file.name.split('.').pop();
    const renamed = new File([file], `${baseName}_${i + 1}.${ext}`, { type: file.type });
    body.append('images[]', renamed);
  });

  const res = await fetch(`${BASE_URL}/submit.php`, {
    method: 'POST',
    body,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Server error' }));
    throw new Error(err.message || `HTTP ${res.status}`);
  }

  return res.json();
}
