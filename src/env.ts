export function getEnvPath(): string {
  if (process.env.NODE_ENV === 'development') return '.env.development';
  if (process.env.NODE_ENV === 'test') return '.env.test';
  if (process.env.NODE_ENV === 'production') return '.env.production';
  return '.env';
}
