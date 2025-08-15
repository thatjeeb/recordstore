import React from "react";
import type { AnchorHTMLAttributes, ReactNode } from "react";
import { Link } from "react-router";
import { AppClasses } from "../styles/appClasses";
import { AppRoutes } from "../app.definitions";
import { useSpotifyAuth, useSpotifyData } from "../lib";
import { ExternalLink } from "./icons.component";

export function GoHomeButton(): ReactNode {
  return (
    <Link className={AppClasses.SecondaryButton} to={AppRoutes.Home}>
      Back to Home
    </Link>
  );
}

export function GoToLibraryButton(): ReactNode {
  const { dataCount } = useSpotifyData();

  if (!dataCount) return;

  return (
    <Link className={AppClasses.SecondaryButton} to={AppRoutes.Library}>
      View Library
    </Link>
  );
}

export function GoToDownloadButton(): ReactNode {
  const { dataCount } = useSpotifyData();

  if (!dataCount) return;

  return (
    <Link className={AppClasses.SecondaryButton} to={AppRoutes.Download}>
      Download Your Data
    </Link>
  );
}

export function DownloadDataAsJsonButton({ children }: { children?: ReactNode }): ReactNode {
  const { dataCount, downloadDataAsJson } = useSpotifyData();

  if (!dataCount) return;

  return (
    <button className={AppClasses.PrimaryButton} onClick={downloadDataAsJson}>
      {children || "Download Your Data as JSON"}
    </button>
  );
}

export function DownloadPlaylistAsCSVButton({ children, playlistId }: { playlistId: string; children?: ReactNode }): ReactNode {
  const { dataCount, downloadPlaylistAsCSV } = useSpotifyData();

  if (!dataCount) return;

  return (
    <button className={AppClasses.PrimaryButton} onClick={() => downloadPlaylistAsCSV(playlistId)}>
      {children || "Download Your Playlist as CSV"}
    </button>
  );
}

export function DownloadAllPlaylistsAsCSVsButton({ children }: { children?: ReactNode }): ReactNode {
  const { dataCount, downloadAllPlaylistsAsCSVs } = useSpotifyData();

  if (!dataCount) return;

  return (
    <button className={AppClasses.PrimaryButton} onClick={downloadAllPlaylistsAsCSVs}>
      {children || "Download All Your Playlists as CSVs"}
    </button>
  );
}

export function DownloadDataAsTextButton({ children }: { children?: ReactNode }): ReactNode {
  const { spotifyUserId } = useSpotifyAuth();
  const { dataCount, downloadDataAsTxt } = useSpotifyData();

  if (!dataCount) return;

  return (
    <button className={AppClasses.PrimaryButton} onClick={() => downloadDataAsTxt(spotifyUserId)}>
      {children || "Download Your Data"}
    </button>
  );
}

export function ViewOnSpotify(props: AnchorHTMLAttributes<HTMLAnchorElement>): ReactNode {
  return (
    <a className={AppClasses.ViewOnSpotify} title="View item on Spotify" target="_blank" rel="noreferrer" {...props}>
      <ExternalLink />
    </a>
  );
}
