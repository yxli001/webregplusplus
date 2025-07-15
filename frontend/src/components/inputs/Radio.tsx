type RadioProps = {
  checked: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  name?: string;
};

const Radio = ({ checked, onChange, ...props }: RadioProps) => {
  return (
    <div
      className="relative flex h-4 w-4 cursor-pointer items-center justify-center"
      onClick={() => {
        if (!props.disabled && onChange) onChange(!checked);
      }}
    >
      <div
        className={`h-4 w-4 rounded-full border transition-colors ${
          checked ? "border-primary-light" : "border-text-light"
        } ${props.disabled ? "opacity-50" : ""}`}
      />
      {checked && (
        <div
          className={`absolute h-2 w-2 rounded-full bg-primary-light ${props.disabled ? "opacity-50" : ""}`}
        />
      )}
      <input
        type="radio"
        className="absolute h-full w-full cursor-pointer opacity-0"
        checked={checked}
        onChange={(e) => {
          if (!props.disabled && onChange) onChange(e.target.checked);
        }}
        {...props}
      />
    </div>
  );
};

export default Radio;
