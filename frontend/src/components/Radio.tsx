interface RadioProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  name?: string;
}

const Radio = ({ checked, onChange, ...props }: RadioProps) => {
  return (
    <div
      className="relative w-4 h-4 flex items-center justify-center cursor-pointer"
      onClick={() => !props.disabled && onChange(!checked)}
    >
      <div
        className={`w-4 h-4 rounded-full border transition-colors ${
          checked ? "border-primary-light" : "border-text-light"
        } ${props.disabled ? "opacity-50" : ""}`}
      />
      {checked && (
        <div
          className={`absolute w-2 h-2 rounded-full bg-primary-light ${props.disabled ? "opacity-50" : ""}`}
        />
      )}
      <input
        type="radio"
        className="absolute opacity-0 w-full h-full cursor-pointer"
        checked={checked}
        onChange={(e) => !props.disabled && onChange(e.target.checked)}
        {...props}
      />
    </div>
  );
};

export default Radio;
