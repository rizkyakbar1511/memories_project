import TextField from "@mui/material/TextField";
import Autocomplete, {
  AutocompleteChangeDetails,
  AutocompleteChangeReason,
} from "@mui/material/Autocomplete";
import Chip from "@mui/material/Chip";

interface ChipInputProps {
  onChange: (
    event: React.SyntheticEvent<Element, Event>,
    value: string[],
    reason: AutocompleteChangeReason,
    details?: AutocompleteChangeDetails<string> | undefined
  ) => void;
  label: string;
  placeholder: string;
  error?: boolean | undefined;
  helperText?: React.ReactNode;
  value?: string[];
}

function ChipInput({ onChange, label, placeholder, error, helperText, value }: ChipInputProps) {
  return (
    <Autocomplete
      multiple
      id="tags-filled"
      options={[]}
      value={value}
      freeSolo
      onChange={onChange}
      renderTags={(value: readonly string[], getTagProps) =>
        value.map((option: string, index: number) => (
          <Chip variant="outlined" label={option} {...getTagProps({ index })} />
        ))
      }
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          placeholder={placeholder}
          error={error}
          helperText={helperText}
          fullWidth
        />
      )}
    />
  );
}

export default ChipInput;
