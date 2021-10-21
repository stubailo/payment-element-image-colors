import "./ButtonGroup.css";

export function RadioButtonGroup({ value, onChange, options }) {
  return (
    <div className="ButtonGroup">
      {options.map((option, i) => (
        <Button
          selected={value === option.value ? true : false}
          onClick={() => {
            onChange(option.value);
          }}
          style={{ marginLeft: i > 0 ? "8px" : "0" }}
        >
          {option.label}
        </Button>
      ))}
    </div>
  );
}

export function Button({ children, onClick, selected, style }) {
  let className = "pure-button";

  if (selected) {
    className += " button-selected";
  }
  return (
    <button className={className} onClick={onClick} style={style}>
      {children}
    </button>
  );
}
