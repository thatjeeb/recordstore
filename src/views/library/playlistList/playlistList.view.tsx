import React, { useEffect, useState, type ReactNode } from "react";
import { DBLib, StoreName, useSpotifyAuth, sortAndSplitPlaylists, type PlaylistMeta } from "../../../lib";
import { Loader, PlaylistItem } from "../../../components";
import { AppClasses } from "../../../styles/appClasses";

export function PlaylistList(): ReactNode {
  const { spotifyUserId } = useSpotifyAuth();
  const [loading, setLoading] = useState(false);
  const [usersPlaylists, setUsersPlaylists] = useState<PlaylistMeta[]>([]);
  const [followedPlaylists, setFollowedPlaylists] = useState<PlaylistMeta[]>([]);

  useEffect(() => {
    (async (): Promise<void> => {
      setLoading(true);

      try {
        const playlists = (await DBLib.getAllItems<PlaylistMeta>(StoreName.PlaylistMeta)) as PlaylistMeta[];
        const { usersPlaylists, followedPlaylists } = sortAndSplitPlaylists(playlists, spotifyUserId);

        setUsersPlaylists(usersPlaylists);
        setFollowedPlaylists(followedPlaylists);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    })();
  }, [spotifyUserId]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className={AppClasses.PlaylistListView}>
      <h2>Your Playlists</h2>

      {usersPlaylists.map((p) => (
        <PlaylistItem playlistMeta={p} key={"playlist_" + p.id} />
      ))}

      {!usersPlaylists.length && <p>No playlists found.</p>}

      <h2>Playlists You Follow</h2>

      {followedPlaylists.map((p) => (
        <PlaylistItem playlistMeta={p} key={"playlist_" + p.id} />
      ))}

      {!followedPlaylists.length && <p>No playlists found.</p>}
    </div>
  );
}
