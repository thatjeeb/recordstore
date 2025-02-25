export const spotifyConsts = {
  clientId: process.env.CLIENT_ID || "",
  redirectUri: process.env.REDIRECT_URI_BASE + "/callback",
  scope: "user-read-private user-read-email user-library-read playlist-read-private",
  codeVerifierStorageKey: "recordStoreSpotifyCodeVerifier",
  accessTokenStorageKey: "recordStoreSpotifyAccessToken",
  refreshTokenStorageKey: "recordStoreSpotifyRefreshToken",
  expiresInStorageKey: "recordStoreSpotifyExpiresIn",
  expiryDateStorageKey: "recordStoreSpotifyExpiryDate",
};

export const spotifyUrls = {
  auth: "https://accounts.spotify.com/authorize",
  token: "https://accounts.spotify.com/api/token",
  apiBase: "https://api.spotify.com/v1",
  firstPageQueryString: "offset=0&limit=50", // note: this does not include starting '?'
  currentUser: "/me",
  currentUsersPlaylists: "/me/playlists",
  currentUsersAlbums: "/me/albums",
};

export enum SpotifyDataCtxStatus {
  Init,
  DataLoading,
  DownloadLoading,
  BackupComplete,
  BackupFailure,
  UploadComplete,
  UploadFailure,
  DeleteNeedsConfirmation,
  DeleteComplete,
  DeleteFailure,
}

export interface SpotifyDataContextResponse {
  status: SpotifyDataCtxStatus;
  dataCount: number;
  resetToInit: () => void;
  performBackup: () => Promise<void>;
  askForDeleteConfirm: () => Promise<void>;
  deleteBackup: () => Promise<void>;
  cancelDelete: () => Promise<void>;
  downloadDataAsJson: () => Promise<void>;
  downloadDataAsTxt: (spotifyUserId: string) => Promise<void>;
  uploadData: (file?: File) => Promise<void>;
}

export interface SpotifyAuthContextReponse {
  loggedIn: boolean;
  spotifyUserId: string;
  goToSpotifyAuth: () => Promise<void>;
  fetchAccessToken: () => Promise<void>;
  deleteAuthTokens: () => void;
  appAuthInit: () => Promise<void>;
}

export interface SpotifyTokenResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
  refresh_token?: string;
}

export interface SpotifyItemFetchResponse<T> {
  items: T[];
  next: string;
}

export interface UserProfile {
  country: string;
  display_name: string;
  email: string;
  explicit_content: {
    filter_enabled: boolean;
    filter_locked: boolean;
  };
  external_urls: {
    spotify: string;
  };
  followers: {
    href: null;
    total: number;
  };
  href: string;
  id: string;
  images: Image[];
  product: string;
  type: string;
  uri: string;
}

export interface ExternalUrls {
  spotify: string;
}

export interface Image {
  height: number;
  url: string;
  width: number;
}

export interface Owner {
  display_name: string;
  external_urls: ExternalUrls;
  href: string;
  id: string;
  type: string;
  uri: string;
}

export interface Tracks {
  href: string;
  total: number;
}

export interface Playlist {
  collaborative: boolean;
  description: string;
  external_urls: ExternalUrls;
  href: string;
  id: string;
  images: Image[];
  name: string;
  owner: Owner;
  primary_color: string | null;
  public: boolean;
  snapshot_id: string;
  tracks: Tracks;
  type: string;
  uri: string;
}

export interface PlaylistCore extends Pick<Playlist, "id" | "name" | "snapshot_id" | "owner"> {
  tracks: TrackCore[];
}

export type PlaylistMeta = Pick<PlaylistCore, "id" | "name" | "snapshot_id" | "owner">

export interface Artist {
  external_urls: ExternalUrls;
  href: string;
  id: string;
  name: string;
  type: string;
  uri: string;
}

export type ArtistCore = Pick<Artist, "name" | "id">;

export interface Album {
  available_markets: string[];
  type: string;
  album_type: string;
  href: string;
  id: string;
  images: Image[];
  name: string;
  release_date: string;
  release_date_precision: string;
  uri: string;
  artists?: Artist[];
  external_urls: ExternalUrls;
  total_tracks: number;
}

export interface AlbumCore extends Pick<Album, "name" | "id"> {
  artists: ArtistCore[];
}

export interface SavedAlbum {
  added_at: string;
  album: Album;
}

export interface ExternalIds {
  isrc: string;
}

export interface Track {
  preview_url: string | null;
  available_markets: string[];
  explicit: boolean;
  type: string;
  episode: boolean;
  track: boolean;
  album: Album;
  artists: Artist[];
  disc_number: number;
  track_number: number;
  duration_ms: number;
  external_ids: ExternalIds;
  external_urls: ExternalUrls;
  href: string;
  id: string;
  name: string;
  popularity: number;
  uri: string;
  is_local: boolean;
}

export interface TrackCore extends Pick<Track, "name" | "id"> {
  album: AlbumCore;
  artists: ArtistCore[];
}

export interface VideoThumbnail {
  url: string | null;
}

export interface PlaylistTrack {
  added_at: string;
  added_by: Owner;
  is_local: boolean;
  primary_color: string | null;
  track: Track | null; // this can be null
  video_thumbnail: VideoThumbnail;
}
