import React, { type ReactNode } from "react";
import { AppClasses } from "../../styles/appClasses";
import { AppRoutes } from "../../app.definitions";
import { Link } from "react-router";

export function NotFound(): ReactNode {
  return (
    <div className={AppClasses.App}>
      <h2>Page not found!</h2>
      <Link className={AppClasses.SecondaryButton} to={AppRoutes.Home}>
        Go home
      </Link>
    </div>
  );
}
