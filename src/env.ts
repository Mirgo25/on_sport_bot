export function getEnvPath(): string {
  console.log({ env: process.env.NODE_ENV });
  if (process.env.NODE_ENV === 'development') return '.env.development';
  if (process.env.NODE_ENV === 'test') return '.env.test';
  if (process.env.NODE_ENV === 'production') return '.env.production';
  return '.env';
}
