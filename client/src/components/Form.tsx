import { TextField, Button, Typography, Paper } from "@mui/material";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import Cookies from "js-cookie";

import { PostSchema } from "../schemas";
import { convertFileToBase64 } from "../helpers";
import { getPosts, createPost, updatePost, getUser } from "../api";
import useStore from "../state/store";
import ChipInput from "./ChipInput";

function Form() {
  const queryClient = useQueryClient();
  const { postId, setPostId } = useStore((state) => state);

  const generalMutateOption = {
    onSuccess: () => {
      setPostId(null);
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  };

  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: getUser,
    enabled: !!Cookies.get("token"),
  });

  const { mutate: createPostMutation, isPending: isPendingCreate } = useMutation({
    mutationFn: (newData: z.infer<typeof PostSchema>) =>
      createPost({ ...newData, name: user.name }),
    ...generalMutateOption,
  });

  const { mutate: updatePostMutation, isPending: isPendingUpdate } = useMutation({
    mutationFn: (newData: z.infer<typeof PostSchema>) =>
      updatePost(postId!, { ...newData, name: user.name }),
    ...generalMutateOption,
  });

  const {
    reset,
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<z.infer<typeof PostSchema>>({
    resolver: zodResolver(PostSchema),
  });

  useQuery({
    queryKey: ["posts", postId],
    queryFn: async () => {
      const res = await getPosts();
      const post = res.posts.find((item) => item._id === postId);
      Object.keys(post!).forEach((key) => {
        const formKey = key as keyof z.infer<typeof PostSchema>;
        const formValue = post?.[formKey];
        setValue(formKey, formValue);
      });
      return res.posts;
    },
    enabled: !!postId && !isPendingUpdate,
  });

  const onSubmit: SubmitHandler<z.infer<typeof PostSchema>> = (data) => {
    postId ? updatePostMutation(data) : createPostMutation(data);
    reset();
  };

  return (
    <Paper
      sx={[
        { padding: 2 },
        (theme) => ({
          "& .MuiTextField-root": {
            marginBlock: theme.spacing(1),
          },
        }),
      ]}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Typography variant="h6" align="center">
          {postId ? "Editing" : "Create"} a Memory
        </Typography>
        <Controller
          name="title"
          defaultValue=""
          control={control}
          render={({ field }) => (
            <TextField
              error={!!errors.title}
              helperText={errors.title?.message}
              {...field}
              label="Title"
              variant="outlined"
              fullWidth
            />
          )}
        />
        <Controller
          name="message"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField
              error={!!errors.message}
              helperText={errors.message?.message}
              {...field}
              label="Message"
              variant="outlined"
              fullWidth
            />
          )}
        />
        <Controller
          name="tags"
          control={control}
          defaultValue={[]}
          render={({ field }) => (
            <ChipInput
              value={field.value}
              onChange={(_, option) => field.onChange(option)}
              label="Tags"
              placeholder="Tags"
              error={!!errors.tags}
              helperText={errors.tags?.message}
            />
          )}
        />
        <Controller
          name="selectedFile"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField
              error={!!errors.selectedFile}
              helperText={errors.selectedFile?.message}
              type="file"
              onChange={async (e: React.ChangeEvent<HTMLInputElement>) =>
                field.onChange(await convertFileToBase64(e.target.files![0]))
              }
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
            />
          )}
        />
        <Button
          disabled={postId ? isPendingUpdate : isPendingCreate}
          sx={{ marginBottom: 1 }}
          variant="contained"
          color="primary"
          size="small"
          type="submit"
          fullWidth
        >
          Submit
        </Button>
        <Button
          disabled={postId ? isPendingUpdate : isPendingCreate}
          variant="contained"
          color="secondary"
          size="small"
          fullWidth
          onClick={() => {
            reset();
            setPostId(null);
          }}
        >
          Clear
        </Button>
      </form>
    </Paper>
  );
}

export default Form;
