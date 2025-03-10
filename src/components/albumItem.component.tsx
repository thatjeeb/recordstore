import React, { type ReactNode } from "react";
import { AlbumCore, spotifyUrls } from "../lib";
import { LibraryItem } from "./libraryItem.component";
import { AlbumIcon } from "./icons.component";
import { getArtistsNameString } from "../lib/spotify/spotify.utils";

interface AlbumItemProps {
  album: AlbumCore;
}

export function AlbumItem(props: AlbumItemProps): ReactNode {
  const { album } = props;
  const title = album.name;
  const subtitle = getArtistsNameString(album.artists);

  if (!title) return;

  return <LibraryItem icon={<AlbumIcon />} title={title} subtitle={subtitle} link={spotifyUrls.albumBase + album.id} />;
}
