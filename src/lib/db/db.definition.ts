export const dbConsts = {
  name: "recordStoreDb",
  version: 2,
};

// The advantage of having two DBs for playlists, is the PlaylistMeta DB will be much smaller than the Playlist DB,
// which enables the playlist list view to load much quicker.
export enum StoreName {
  PlaylistMeta = "playlistMeta",
  Playlist = "playlist",
  Album = "album"
}
