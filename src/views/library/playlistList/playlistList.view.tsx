import React, { useEffect, useState, type ReactNode } from "react";
import { PlaylistCore, DBLib, StoreName, useSpotifyAuth } from "../../../lib";
import { Loader, PlaylistItem } from "../../../components";
import { sortPlaylistsByName } from "../../../lib";
import { AppClasses } from "../../../styles/appClasses";

export function PlaylistList(): ReactNode {
  const { spotifyUserId } = useSpotifyAuth();
  const [loading, setLoading] = useState(false);
  const [usersPlaylists, setUsersPlaylists] = useState<PlaylistCore[]>([]);
  const [followedPlaylists, setFollowedPlaylists] = useState<PlaylistCore[]>([]);

  useEffect(() => {
    (async (): Promise<void> => {
      setLoading(true);

      try {
        const playlists = (await DBLib.getAllItems<PlaylistCore>(StoreName.Playlist)) as PlaylistCore[];
        const sortedPlaylists = sortPlaylistsByName(playlists);

        const dbUsersPlaylists: PlaylistCore[] = [];
        const dbFollowedPlaylists: PlaylistCore[] = [];

        sortedPlaylists.forEach((p) => {
          if (p.owner.id === spotifyUserId) {
            dbUsersPlaylists.push(p);
          } else {
            dbFollowedPlaylists.push(p);
          }
        });

        setUsersPlaylists(dbUsersPlaylists);
        setFollowedPlaylists(dbFollowedPlaylists);
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
        <PlaylistItem playlist={p} key={"playlist_" + p.id} />
      ))}

      {!usersPlaylists.length && <p>No playlists found.</p>}

      <h2>Playlists You Follow</h2>

      {followedPlaylists.map((p) => (
        <PlaylistItem playlist={p} key={"playlist_" + p.id} />
      ))}

      {!followedPlaylists.length && <p>No playlists found.</p>}
    </div>
  );
}
