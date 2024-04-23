import axios from "axios";

export const convertFileToBase64 = (file: File) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      resolve(`data:image/jpeg;base64,${result.split(",")[1]}`);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const pluralize = (word: string, count: number) => (count < 2 ? word : `${word}s`);

// Function to check if the token is expired
export const isExpiredToken = async (token: string) => {
  // Implement your token expiration logic here
  // For example, you may parse the token and check the expiration date
  // Sample logic (assuming token contains expiration timestamp)
  const exp = (await parseToken(token)) as number; // Implement parseToken function
  const currentTimestamp = new Date().getTime(); // Get current timestamp in seconds
  return exp < currentTimestamp;
};

// Function to parse the token payload (example)
const parseToken = async (token: string) => {
  try {
    const isOauthToken = token && token?.split(".").length < 3;
    const base64Url = token?.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const payload =
      (isOauthToken
        ? await axios
            .get(`https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${token}`)
            .then((res) => res.data.exp)
        : JSON.parse(atob(base64))["exp"]) * 1000;
    return payload;
  } catch (error) {
    console.error("Error parsing token:", error);
    throw Error("Error parsing token");
  }
};
