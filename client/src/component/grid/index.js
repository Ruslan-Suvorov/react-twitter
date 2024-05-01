import "./index.css";

export default function Grid({ children, style = {} }) {
  return (
    <div className="grid" style={style}>
      {children}
    </div>
  );
}
