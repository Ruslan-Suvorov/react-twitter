import "./index.css";

export default function Box({ children, className = "", style = {} }) {
  return (
    <div className={`box ${className}`} style={style}>
      {children}
    </div>
  );
}
