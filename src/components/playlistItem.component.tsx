import React, { type ReactNode } from "react";
import { PlaylistCore } from "../lib";
import { LibraryItem } from "./libraryItem.component";
import { Link } from "react-router-dom";
import { AppRoutes } from "../app.definitions";
import { AppClasses } from "../styles/appClasses";
import { PlaylistIcon } from "./icons.component";
import { AppLanguage } from "../app.language";

interface PlaylistItemProps {
  playlist: PlaylistCore;
}

export function PlaylistItem(props: PlaylistItemProps): ReactNode {
  const { playlist } = props;
  const { id, name } = playlist;

  return (
    <Link className={AppClasses.PlaylistItem} to={`${AppRoutes.PlaylistList}/${id}`}>
      <LibraryItem icon={<PlaylistIcon />} title={name || AppLanguage.Untitled} />
      {">"}
    </Link>
  );
}
