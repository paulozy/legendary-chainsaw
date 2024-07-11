type ENV = {
  googleAuthPrivateKey: string;
  googleAuthClientEmail: string;
};

const env: ENV = {
  googleAuthPrivateKey: process.env.GOOGLE_AUTH_PRIVATE_KEY,
  googleAuthClientEmail: process.env.GOOGLE_AUTH_CLIENT_MAIL,
};

export function getEnv() {
  if (!env.googleAuthPrivateKey && !env.googleAuthClientEmail) {
    throw new Error("Enviroment variables not found");
  }

  if (typeof window === "undefined" && typeof process === "undefined") {
    throw new Error("Woops! You are not running this in a browser");
  }

  return env;
}
