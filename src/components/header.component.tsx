import React, { type ReactNode } from "react";
import { AppClasses } from "../styles/appClasses";
import { Link } from "react-router";
import { AppRoutes } from "../app.definitions";

export function Header(): ReactNode {
  return (
    <div className={AppClasses.Header}>
      <Link to={AppRoutes.Home}>Record Store</Link>
    </div>
  );
}
