export enum AppRoutes {
  Home = "/",
  Backup = "/backup",
  Callback = "/callback",
  Library = "/library",
  AlbumList = AppRoutes.Library + "/albums",
  PlaylistList = AppRoutes.Library + "/playlists",
  PlaylistsDetail = AppRoutes.PlaylistList + "/:playlistId",
  Download = "/download",
}
