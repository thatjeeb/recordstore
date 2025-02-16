export const generateRandomString = (length = 128): string => {
  const possibleChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const values = crypto.getRandomValues(new Uint8Array(length));
  return values.reduce((acc, x) => acc + possibleChars[x % possibleChars.length], "");
};

const hasher = async (plain: string): Promise<ArrayBuffer> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  return window.crypto.subtle.digest("SHA-256", data);
};

const base64encode = (input: ArrayBuffer): string => {
  return btoa(String.fromCharCode(...new Uint8Array(input))).replace(/=|\+|\//g, (match) => {
    switch (match) {
      case "=":
        return "";
      case "+":
        return "-";
      case "/":
        return "_";
      default:
        return match;
    }
  });
};

export async function getCodeChallenge(codeVerifier: string): Promise<string> {
  const hashed = await hasher(codeVerifier);
  return base64encode(hashed);
}
