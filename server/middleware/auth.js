import jwt from "jsonwebtoken";
import axios from "axios";

const auth = async (req, _, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const isOauthToken = token && token?.split(".").length > 2;

    if (token && !isOauthToken) {
      const decodedData = await axios.get(
        `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${token}`
      );
      req.userId = decodedData?.data.sub;
    } else {
      const decodedData = jwt.verify(token, "test");
      req.userId = decodedData?.id;
    }
    next();
  } catch (error) {
    console.log(error);
  }
};

export default auth;
