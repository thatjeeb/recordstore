import React, { useEffect, useState, type ReactNode } from "react";
import { useParams } from "react-router";
import { PlaylistCore, DBLib, StoreName, getArtistsNameString, spotifyUrls } from "../../../lib";
import { DownloadPlaylistAsCSVButton, LibraryItem, Loader, SongIcon, ViewOnSpotify } from "../../../components";
import { AppClasses } from "../../../styles/appClasses";
import { AppLanguage } from "../../../app.language";

export function PlaylistDetail(): ReactNode {
  const [loading, setLoading] = useState(false);
  const [playlist, setPlaylist] = useState<PlaylistCore | undefined>();
  const { playlistId } = useParams();

  useEffect(() => {
    (async (): Promise<void> => {
      setLoading(true);

      try {
        const dbPlaylist = await DBLib.getItem<PlaylistCore>(StoreName.Playlist, playlistId || "");
        setPlaylist(dbPlaylist);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    })();
  }, [playlistId, setPlaylist]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className={AppClasses.PlaylistDetailView}>
      <div className={AppClasses.PlaylistDetailViewTitleBar}>
        <h2>{playlist?.name || AppLanguage.Untitled}</h2>
        <ViewOnSpotify href={spotifyUrls.playlistBase + playlist?.id} />

        {!!playlist?.id && <DownloadPlaylistAsCSVButton playlistId={playlist?.id || ""} >Download Playlist as CSV</DownloadPlaylistAsCSVButton>}
      </div>

      {!playlist?.tracks?.length && <p>No songs found.</p>}

      {playlist?.tracks?.map((t) => {
        if (!t.name) return;

        return (
          <LibraryItem
            key={"playlist-track-" + t.id}
            icon={<SongIcon />}
            title={t.name}
            subtitle={getArtistsNameString(t.artists)}
            link={spotifyUrls.trackBase + t.id}
          />
        );
      })}
    </div>
  );
}
