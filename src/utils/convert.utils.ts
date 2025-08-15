import { AppLanguage } from "../app.language";
import { getArtistsNameString } from "../lib";
import type { PlaylistCore, AlbumCore, TrackCore } from "../lib/spotify/spotify.definition";

export const convertPlaylistsToDownloadString = (playlists: PlaylistCore[], header = "-- Playlists --"): string => {
  let str = header;

  if (!playlists.length) {
    str += "\nNo playlists found.";
  }

  for (const playlist of playlists) {
    str += `\n\n- ${playlist.name || AppLanguage.Untitled} -`;

    if (!playlist.tracks.length) {
      str += "\n(Empty playlist)";
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

export const escapeCSVInput = (input: string): string => {
  if (input === null || input === undefined || !input?.trim()) return "";

  const str = String(input);

  // Wrap in quotes if it contains a comma, quote, or newline
  if (/[",\n]/.test(str)) {
    // Escape double quotes
    const escaped = str.replace(/"/g, '""');
    return `"${escaped}"`;
  }

  return str;
};

export function convertTracksToCsv(tracks: TrackCore[]): string {
  let csv = "id,name,album,artists\n"; // header row

  for (const track of tracks) {
    const artistNames = (track.artists || []).map((a) => a?.name || "").join(" & ");

    csv += escapeCSVInput(track.id) + "," + escapeCSVInput(track.name) + "," + escapeCSVInput(track.album?.name) + "," + escapeCSVInput(artistNames) + "\n";
  }

  return csv;
}
