import { spotifyConsts, spotifyUrls } from "./spotify.definition";
import type {
  Album,
  AlbumCore,
  Artist,
  ArtistCore,
  Playlist,
  PlaylistCore,
  PlaylistTrack,
  SavedAlbum,
  SpotifyItemFetchResponse,
  SpotifyTokenResponse,
  TrackCore,
  UserProfile,
} from "./spotify.definition";

// #region Token Utils
export const saveTokensToLocalStorage = (tokenResponse: SpotifyTokenResponse): void => {
  const { accessTokenStorageKey, refreshTokenStorageKey, expiresInStorageKey, expiryDateStorageKey } = spotifyConsts;
  const { access_token, refresh_token, expires_in } = tokenResponse;

  localStorage.setItem(accessTokenStorageKey, access_token);
  localStorage.setItem(expiresInStorageKey, `${expires_in}`);

  if (refresh_token) {
    localStorage.setItem(refreshTokenStorageKey, refresh_token);
  }

  const expiryDateTime = Date.now() + expires_in * 1000;
  localStorage.setItem(expiryDateStorageKey, `${expiryDateTime}`);
};

export const hasAccessTokenExpired = (): boolean => {
  const expiryDateTimeItem = localStorage.getItem(spotifyConsts.expiryDateStorageKey);

  if (!expiryDateTimeItem) {
    // Technically the token hasn't expired if there's no expiry date
    // but for the purposes of this function, no expiry date means the token has expired
    return true;
  }
  const expiryDateTime = parseInt(expiryDateTimeItem, 10);
  return Date.now() > expiryDateTime;
};
// #endregion

// #region Fetch Utils
const spotifyItemsFetchHelper = async <T>(url: string): Promise<T[]> => {
  const accessToken = localStorage.getItem(spotifyConsts.accessTokenStorageKey);

  if (!accessToken) {
    throw new Error("No access token found when fetching items. URL was: " + url);
  }

  const headers = {
    Authorization: `Bearer ${accessToken}`,
  };

  const items: T[] = [];
  let nextUrl: string | null = url;

  while (nextUrl) {
    const url = new URL(nextUrl);
    url.searchParams.delete("locale");

    const response: Response = await fetch(url, { headers });

    if (!response.ok) {
      throw new Error("Failed to fetch items. nextUrl was: " + nextUrl);
    }

    const data: SpotifyItemFetchResponse<T> = await response.json();
    items.push(...data.items);
    nextUrl = data.next;
  }

  return items;
};

export const fetchUserProfile = async (): Promise<UserProfile> => {
  const { apiBase, currentUser } = spotifyUrls;
  const url = `${apiBase}${currentUser}`;

  const accessToken = localStorage.getItem(spotifyConsts.accessTokenStorageKey);

  if (!accessToken) {
    throw new Error("No access token found when fetching spotify user profile");
  }

  const headers = {
    Authorization: `Bearer ${accessToken}`,
  };

  const response: Response = await fetch(url, { headers });

  if (!response.ok) {
    throw new Error("Failed to fetch user profile");
  }

  const data: UserProfile = await response.json();
  return data;
};

export const fetchUsersPlaylists = async (): Promise<Playlist[]> => {
  const { apiBase, currentUsersPlaylists, firstPageQueryString } = spotifyUrls;
  const url = `${apiBase}${currentUsersPlaylists}?${firstPageQueryString}`;

  return spotifyItemsFetchHelper<Playlist>(url);
};

export const fetchPlaylistTracks = async (playlistId: string): Promise<PlaylistTrack[]> => {
  const { apiBase, firstPageQueryString } = spotifyUrls;
  const url = `${apiBase}/playlists/${playlistId}/tracks?${firstPageQueryString}&fields=next,items(track(id,name,album(id,name),artists(id,name)))`;

  return spotifyItemsFetchHelper<PlaylistTrack>(url);
};

export const fetchUsersAlbums = async (): Promise<SavedAlbum[]> => {
  const { apiBase, currentUsersAlbums, firstPageQueryString } = spotifyUrls;
  const url = `${apiBase}${currentUsersAlbums}?${firstPageQueryString}`;

  return spotifyItemsFetchHelper<SavedAlbum>(url);
};
// #endregion

// #region Convert/Map Utils
export const convertPlaylistToCore = (playlist: Playlist): PlaylistCore => {
  const { id, name, snapshot_id, owner } = playlist;
  return { id, name, snapshot_id, owner, tracks: [] };
};

export const convertAlbumToCore = (album: Album): AlbumCore => {
  const { id, name, artists } = album;
  const artistsCore = artists?.map(convertArtistToCore) || [];

  return { id, name, artists: artistsCore };
};

export const convertArtistToCore = (artist: Artist): ArtistCore => {
  const { id, name } = artist;
  return { id, name };
};

export const convertPlaylistTrackToTrackCore = (playlistTrack: PlaylistTrack): TrackCore => {
  if (!playlistTrack?.track) return {} as TrackCore;

  const { id, name, album, artists } = playlistTrack.track;
  const albumCore = convertAlbumToCore(album);
  const artistsCore = artists.map(convertArtistToCore);

  return {
    id,
    name,
    album: albumCore,
    artists: artistsCore,
  };
};
// #endregion

// #region Data Handling Utils
export const getArtistsNameString = (artists?: ArtistCore[]): string => {
  return (artists || []).map((a) => a.name).join(", ");
};

export const sortPlaylistsByName = (playlists: PlaylistCore[]): PlaylistCore[] => {
  return playlists.sort((a, b) => a.name.localeCompare(b.name));
};

export const sortAlbumsByArtistsName = (albums: AlbumCore[]): AlbumCore[] => {
  return albums.sort((a, b) => {
    const artistsA = getArtistsNameString(a.artists);
    const artistsB = getArtistsNameString(b.artists);
    return artistsA.localeCompare(artistsB);
  });
};

export const sortAndSplitPlaylists = (playlists: PlaylistCore[], spotifyUserId: string): { usersPlaylists: PlaylistCore[]; followedPlaylists: PlaylistCore[] } => {
  const sortedPlaylists = sortPlaylistsByName(playlists);

  const usersPlaylists: PlaylistCore[] = [];
  const followedPlaylists: PlaylistCore[] = [];

  sortedPlaylists.forEach((p) => {
    if (p.owner.id === spotifyUserId) {
      usersPlaylists.push(p);
    } else {
      followedPlaylists.push(p);
    }
  });

  return { usersPlaylists, followedPlaylists };
};
// #endregion
