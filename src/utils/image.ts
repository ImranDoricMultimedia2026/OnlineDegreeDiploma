export const getAssetUrl = (value?: string) => {
  if (!value) return '';

  const trimmed = String(value).trim();
  if (!trimmed) return '';

  if (/^(https?:)?\/\//i.test(trimmed) || trimmed.startsWith('data:')) {
    return trimmed;
  }

  if (trimmed.startsWith('/')) {
    return trimmed;
  }

  if (trimmed.startsWith('uploads/')) {
    return `/${trimmed}`;
  }

  return `/uploads/${trimmed}`;
};
