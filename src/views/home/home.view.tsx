import React, { type ReactNode } from "react";
import { AppClasses } from "../../styles/appClasses";
import { Link } from "react-router";
import { AppRoutes } from "../../app.definitions";
import { AppLanguage } from "../../app.language";
import { useSpotifyAuth } from "../../lib";
import { GoToDownloadButton, InviteWarning, GoToLibraryButton } from "../../components";

export const Home = (): ReactNode => {
  const { loggedIn, goToSpotifyAuth } = useSpotifyAuth();

  return (
    <div>
      <InviteWarning />

      {/* <p>
        You&apos;ve spent lots of time curating your playlists and saving albums on Spotify. But what if Spotify
        goes down, or you lose access to your account?
      </p>

      <p>Enter: Record Store.</p> */}

      <p>{loggedIn ? "With Record Store you can:" : <span>Begin by logging in to your spotify account, and then with Record Store you can:</span>}</p>

      <ul>
        <li>Get a text backup of your Spotify data: the names of your albums, playlists and all the songs in all your playlists.</li>
        <li>View a library of your backed up data</li>
        <li>Download a text file with all your data</li>
      </ul>

      <p>{AppLanguage.StorageWarning}</p>

      <div className={AppClasses.ButtonRow}>
        {!loggedIn ? (
          <button className={AppClasses.PrimaryButton} onClick={goToSpotifyAuth}>
            Login to Spotify
          </button>
        ) : (
          <>
            <Link className={AppClasses.SecondaryButton} to={AppRoutes.Backup}>
              Go To Backup
            </Link>

            <GoToLibraryButton />

            <GoToDownloadButton />
          </>
        )}
      </div>

      <p className={AppClasses.SmallPrint}>
        Please note, that this app only provides text based information of all your playslists and albums. It does not obtain, play or store any actual music.
        <br />
        This app is not affiliated with or endorsed by Spotify in any way.
      </p>
    </div>
  );
};
