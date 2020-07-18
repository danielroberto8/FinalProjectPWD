import React, { CSSProperties } from "react";
import "./Button.css";

type ButtonTypes = {
  type?: "contained" | "outlined" | "textual";
  children: any;
  style?: CSSProperties;
  className?: string;
  func?: any;
};

const ButtonUI = (props: ButtonTypes) => {
  let { type, children, style, className, func } = props;

  type = type || "contained";

  return (
    <div
      style={style}
      className={`custom-btn custom-btn-${type} ${className}`}
      onClick={func}
    >
      {children}
    </div>
  );
};

export default ButtonUI;
