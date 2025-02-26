import { AppLanguage } from "../app.language";
import { getArtistsNameString } from "../lib";
import type { PlaylistCore, AlbumCore } from "../lib";

export const convertPlaylistsToDownloadString = (playlists: PlaylistCore[], header = "-- Playlists --"): string => {
  let str = header;

  if (!playlists.length) {
    str += "\nNo playlists found.";
  }

  for (const playlist of playlists) {
    str += `\n\n- ${playlist.name || AppLanguage.Untitled} -`;

    if (!playlist.tracks.length) {
      str+= "\n(Empty playlist)"
    }

    for (const tracks of playlist.tracks) {
      str += `\n${tracks.name || AppLanguage.Untitled} - ${getArtistsNameString(tracks.artists) || AppLanguage.Untitled}`;
    }
  }

  str += "\n\n";

  return str;
};

export const convertAlbumsToDownloadString = (albums: AlbumCore[], header = "-- Albums --"): string => {
  let str = header;

  if (!albums.length) {
    str += "\nNo albums found.";
  }

  for (const album of albums) {
    str += `\n\n${album.name || AppLanguage.Untitled} - ${getArtistsNameString(album.artists) || AppLanguage.Untitled}`;
  }

  str += "\n\n";

  return str;
};
