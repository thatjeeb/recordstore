import React, { type ReactNode } from "react";
import { AppClasses } from "../styles/appClasses";

export function PlaylistIcon(): ReactNode {
  return (
    <div className={AppClasses.PlaylistIcon}>
      <div />
      <div />
      <div />
    </div>
  );
}

export function AlbumIcon(): ReactNode {
  return <div className={AppClasses.AlbumIcon} />;
}

export function SongIcon(): ReactNode {
  return (
    <div className={AppClasses.SongIcon}>
      <div />
    </div>
  );
}
