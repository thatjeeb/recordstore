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

export function ViewLibraryButton(): ReactNode {
  const { dataCount } = useSpotifyData();

  if (!dataCount) return;

  return (
    <Link className={AppClasses.SecondaryButton} to={AppRoutes.Library}>
      View Library
    </Link>
  );
}

// export function DownloadDataButton(): ReactNode {
//   const { dataCount, downloadDataAsJson } = useSpotifyData();

//   if (!dataCount) return;

//   return (
//     <button className={AppClasses.PrimaryButton} onClick={downloadDataAsJson}>
//       Download Your Data
//     </button>
//   );
// }

export function DownloadDataButton(): ReactNode {
  const { spotifyUserId } = useSpotifyAuth();
  const { dataCount, downloadDataAsTxt } = useSpotifyData();

  if (!dataCount) return;

  return (
    <button className={AppClasses.PrimaryButton} onClick={() => downloadDataAsTxt(spotifyUserId)}>
      Download Your Data
    </button>
  );
}
