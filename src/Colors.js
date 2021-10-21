import Color from "color";

export function Colors({ colors }) {
  return (
    <div className="colors-container">
      {colors.map((color, i) => (
        <div
          key={i}
          style={{
            width: "200px",
            height: "30px",
            padding: "4px",
            backgroundColor: color,
            color: Color(color).isDark() ? "white" : "black",
            fontSize: "12px",
          }}
        >
          {color}
        </div>
      ))}
    </div>
  );
}
