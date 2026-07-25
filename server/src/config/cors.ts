const localOrigins = ['http://localhost:3000', 'http://127.0.0.1:3000'];

const parseOrigins = (value?: string): string[] => {
  if (!value) {
    return [];
  }

  return value
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
};

export const getAllowedOrigins = (): string[] => [
  ...localOrigins,
  ...parseOrigins(process.env.CORS_ORIGIN),
  ...parseOrigins(process.env.SOCKET_CORS_ORIGIN),
];

export const isOriginAllowed = (origin?: string): boolean => {
  if (!origin) {
    return true;
  }

  const allowedOrigins = getAllowedOrigins();

  return allowedOrigins.includes(origin);
};

export const corsOrigin = (
  origin: string | undefined,
  callback: (error: Error | null, allow?: boolean) => void,
) => {
  if (isOriginAllowed(origin)) {
    callback(null, true);
    return;
  }

  callback(new Error(`Origin ${origin} is not allowed by CORS`), false);
};
