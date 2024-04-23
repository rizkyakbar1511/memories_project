import axios from "axios";
import * as z from "zod";
import { SignUpSchema, PostSchema, SignInSchema } from "../schemas";
import Cookies from "js-cookie";

const baseURL = "http://localhost:5000";

const API = axios.create({
  baseURL,
});

API.interceptors.request.use((req) => {
  if (Cookies.get("token")) {
    req.headers.Authorization = `Bearer ${Cookies.get("token")}`;
  }
  return req;
});

const extendedPostSchema = PostSchema.extend({
  _id: z.string(),
  createdAt: z.date(),
  creator: z.string(),
  tags: z.array(z.string()),
  likes: z.string(),
});

type PostsResponse = {
  posts: z.infer<typeof extendedPostSchema>[];
  currentPage: number;
  numberOfPages: number;
};

export const getPosts = async (searchParams?: URLSearchParams): Promise<PostsResponse> => {
  const searchQuery = searchParams?.get("searchQuery");
  const tags = searchParams?.get("tags");
  const page = searchParams?.get("page");

  const response = await API.get(
    `/posts?searchQuery=${searchQuery || ""}&tags=${tags || ""}&page=${page || 1}`
  );
  return response.data;
};
export const createPost = (newPost: z.infer<typeof PostSchema>) => API.post("/posts", newPost);
export const updatePost = (id: string, updatedPost: z.infer<typeof PostSchema>) =>
  API.patch(`/posts/${id}`, updatedPost);

export const deletePost = (id: string) => API.delete(`/posts/${id}`);
export const likePost = (id: string) => API.patch(`/posts/${id}/likePost`);
export const getUser = async () => {
  const token = Cookies.get("token");
  const isOauthToken = token && token?.split(".").length < 3;

  const response = isOauthToken
    ? await axios.get(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${token}`)
    : await API.get("/user/info", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  return response.data;
};

export const auth = async (
  formData: z.infer<typeof SignUpSchema> | z.infer<typeof SignInSchema>,
  isSignup: boolean
) => {
  const response = await API.post(
    `/user/${isSignup ? "signup" : "signin"}`,
    isSignup ? formData : { email: formData.email, password: formData.password }
  );
  Cookies.set("token", response.data.token);
};
