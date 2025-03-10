import React from "react";
import type { ReactNode } from "react";
import { AppClasses } from "../styles/appClasses";
import { SpotifyLogo } from "./icons.component";

export function AttributionBar(): ReactNode {
  return (
    <div className={AppClasses.AttributionBar}>
      Powered by <SpotifyLogo />
    </div>
  );
}
