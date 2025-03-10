import React, { type ReactNode } from "react";
import type { PlaylistMeta } from "../lib";
import { LibraryItem } from "./libraryItem.component";
import { Link } from "react-router-dom";
import { AppRoutes } from "../app.definitions";
import { AppClasses } from "../styles/appClasses";
import { PlaylistIcon } from "./icons.component";
import { AppLanguage } from "../app.language";

interface PlaylistItemProps {
  playlistMeta: PlaylistMeta;
}

export function PlaylistItem(props: PlaylistItemProps): ReactNode {
  const { playlistMeta } = props;
  const { id, name } = playlistMeta;

  return (
    <Link className={AppClasses.PlaylistItem} to={`${AppRoutes.PlaylistList}/${id}`}>
      <LibraryItem icon={<PlaylistIcon />} title={name || AppLanguage.Untitled} />
    </Link>
  );
}
