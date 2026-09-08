const API_URL = 'https://api.mysabala.com';
export const getImageUrl = (image?: string | null): string => {
  if (!image) {
    return '';
  }
  if (image.startsWith('http://') || image.startsWith('https://')) {
    return image;
  }
  return `${API_URL}/${image.replace(/^\/+/, '')}`;
};
