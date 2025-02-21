import React from "react";
import type { ReactNode } from "react";
import { Link } from "react-router";
import { AppClasses } from "../styles/appClasses";
import { AppRoutes } from "../app.definitions";
import { useSpotifyAuth, useSpotifyData } from "../lib";

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
