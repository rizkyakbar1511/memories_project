import { Pagination as MUIPagination, PaginationItem } from "@mui/material";
import { Link, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import * as z from "zod";

import { PostSchema } from "../schemas";

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

export default function Pagination() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { data, isPending } = useQuery<PostsResponse>({
    queryKey: ["posts"],
  });

  return (
    <MUIPagination
      sx={{ marginInline: "auto" }}
      count={data?.numberOfPages}
      page={Number(searchParams.get("page")) || 1}
      variant="outlined"
      shape="rounded"
      renderItem={(item) => (
        <PaginationItem
          {...item}
          onClick={() =>
            setSearchParams((prev) => {
              prev.set("page", String(item.page));
              return prev;
            })
          }
        />
      )}
    />
  );
}
