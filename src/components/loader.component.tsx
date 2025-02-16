import React, { type ReactNode } from "react";
import { AppClasses } from "../styles/appClasses";

export function Loader(): ReactNode {
  return (
    <div className={AppClasses.LoaderContainer}>
      <div className={AppClasses.Loader}></div>
      <p>Loading...</p>
    </div>
  );
}
