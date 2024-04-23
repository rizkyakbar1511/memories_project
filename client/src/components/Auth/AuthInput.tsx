import { Grid, IconButton, InputAdornment, TextField } from "@mui/material";
import { Control, Controller, FieldErrors } from "react-hook-form";
import { z } from "zod";

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { SignUpSchema, SignInSchema } from "../../schemas";

type AuthInputProps = {
  half?: boolean;
  control: Control<z.infer<typeof SignUpSchema> | z.infer<typeof SignInSchema>>;
  errors: FieldErrors;
  name: keyof z.infer<typeof SignUpSchema>;
  label: string;
  type: React.HTMLInputTypeAttribute | undefined;
  autoFocus?: boolean;
  handleShowPassword?: () => void;
};

export default function AuthInput({
  half,
  control,
  errors,
  name,
  label,
  type,
  autoFocus,
  handleShowPassword,
}: AuthInputProps) {
  return (
    <Grid item xs={12} sm={half ? 6 : 12}>
      <Controller
        name={name}
        defaultValue=""
        shouldUnregister={true}
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            type={type}
            autoFocus={autoFocus}
            error={!!errors[name]}
            helperText={errors[name]?.message as string}
            label={label}
            variant="outlined"
            fullWidth
            InputProps={
              name === "password"
                ? {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={handleShowPassword}>
                          {type === "password" ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }
                : undefined
            }
          />
        )}
      />
    </Grid>
  );
}
