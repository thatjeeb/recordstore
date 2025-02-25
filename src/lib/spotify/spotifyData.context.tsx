import React, { createContext, useCallback, useContext, useState, useEffect, type ReactNode } from "react";
import { convertAlbumsToDownloadString, convertPlaylistsToDownloadString, downloadJsonToFile, downloadTextToFile, getDayMonthYear } from "../../utils";
import { DBLib, StoreName } from "../db";
import { PlaylistMeta, SpotifyDataCtxStatus, type AlbumCore, type PlaylistCore, type SpotifyDataContextResponse } from "./spotify.definition";
import {
  fetchUsersPlaylists,
  convertPlaylistToCore,
  fetchPlaylistTracks,
  convertPlaylistTrackToTrackCore,
  fetchUsersAlbums,
  convertAlbumToCore,
  sortAlbumsByArtistsName,
  sortAndSplitPlaylists,
} from "./spotify.utils";

const SpotifyDataContext = createContext<SpotifyDataContextResponse | undefined>(undefined);

/**
 * This contains all the logic for data/backup handling, including doing, downloading, uploading and deleting the backup.
 * It exists as a context instead of a classic hook so that the performing the backup persists throughout the whole app whilst it's happening.
 **/
export const SpotifyDataProvider = ({ children }: { children: ReactNode }): ReactNode => {
  const [status, setStatus] = useState(SpotifyDataCtxStatus.Init);
  const [dataCount, setDataCount] = useState(0);

  // Hooks
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent): void => {
      event.preventDefault();
      event.returnValue = "";
    };

    if (status === SpotifyDataCtxStatus.DataLoading || status === SpotifyDataCtxStatus.DownloadLoading) {
      window.addEventListener("beforeunload", handleBeforeUnload);
    }

    return (): void => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [status]);

  const getDataCount = useCallback(async () => {
    const playlistCount = await DBLib.count(StoreName.Playlist);
    const albumCount = await DBLib.count(StoreName.Album);
    setDataCount(playlistCount + albumCount);
  }, []);

  useEffect(() => {
    getDataCount();
  }, [getDataCount]);

  // Methods
  const resetToInit = useCallback(() => {
    setStatus(SpotifyDataCtxStatus.Init);
  }, []);

  /// Backup Items
  const backupPlaylists = useCallback(async () => {
    try {
      const spotifyPlaylists = await fetchUsersPlaylists();
      const playlistCores = spotifyPlaylists.map(convertPlaylistToCore);

      await DBLib.updateMultipleItems<PlaylistMeta>(StoreName.PlaylistMeta, playlistCores);
      await DBLib.updateMultipleItems<PlaylistCore>(StoreName.Playlist, playlistCores);
    } catch (error) {
      console.error("BackupPlaylists error", error);
      throw error;
    }
  }, []);

  const backupPlaylistTracks = useCallback(async () => {
    let currentPlaylist: PlaylistCore | null = null;

    try {
      const playlists = await DBLib.getAllItems<PlaylistCore>(StoreName.Playlist);

      for (const playlist of playlists as PlaylistCore[]) {
        currentPlaylist = playlist;

        const playlistTracks = await fetchPlaylistTracks(playlist.id);
        const trackCores = playlistTracks.map(convertPlaylistTrackToTrackCore);

        const updatedPlaylist = { ...playlist, tracks: trackCores };

        await DBLib.updateItem<PlaylistCore>(StoreName.Playlist, updatedPlaylist);
      }
    } catch (error) {
      console.error("BackupPlaylistTracks error for currentPlaylist", currentPlaylist, error);
      throw error;
    }
  }, []);

  const backupAlbums = useCallback(async () => {
    try {
      const spotifyAlbums = await fetchUsersAlbums();
      const albumCores = spotifyAlbums.map(({ album }) => convertAlbumToCore(album));

      await DBLib.updateMultipleItems<AlbumCore>(StoreName.Album, albumCores);
    } catch (error) {
      console.error("BackupAlbums error", error);
      throw error;
    }
  }, []);

  const postBackupProcess = useCallback(async () => {
    await getDataCount();
    setStatus(SpotifyDataCtxStatus.BackupComplete);
  }, [getDataCount]);

  const performBackup = useCallback(async () => {
    setStatus(SpotifyDataCtxStatus.DataLoading);
    try {
      await backupPlaylists();
      await backupPlaylistTracks();
      await backupAlbums();
      await postBackupProcess();
    } catch {
      setStatus(SpotifyDataCtxStatus.BackupFailure);
    }
  }, [backupAlbums, backupPlaylistTracks, backupPlaylists, postBackupProcess]);

  /// Delete Items
  const askForDeleteConfirm = useCallback(async () => {
    setStatus(SpotifyDataCtxStatus.DeleteNeedsConfirmation);
  }, []);

  const deleteBackup = useCallback(async () => {
    setStatus(SpotifyDataCtxStatus.DataLoading);

    try {
      await DBLib.deleteAllItems(StoreName.PlaylistMeta);
      await DBLib.deleteAllItems(StoreName.Playlist);
      await DBLib.deleteAllItems(StoreName.Album);

      setDataCount(0);
      setStatus(SpotifyDataCtxStatus.DeleteComplete);
    } catch (error) {
      setStatus(SpotifyDataCtxStatus.DeleteFailure);
      console.error("DeleteBackup error", error);
    }
  }, []);

  const cancelDelete = useCallback(async () => {
    setStatus(SpotifyDataCtxStatus.Init);
  }, []);

  /// File Store
  const downloadDataAsJson = useCallback(async () => {
    setStatus(SpotifyDataCtxStatus.DownloadLoading);

    try {
      const playlists = await DBLib.getAllItems<PlaylistCore>(StoreName.Playlist);
      const albums = await DBLib.getAllItems<AlbumCore>(StoreName.Album);
      const allData = {
        playlists,
        albums,
      };

      const { day, month, year } = getDayMonthYear();

      downloadJsonToFile(allData, `spotify_data_${year}_${month}_${day}.json`);
    } catch (error) {
      console.error("DownloadData error", error);
    } finally {
      setStatus(SpotifyDataCtxStatus.Init);
    }
  }, []);

  const downloadDataAsTxt = useCallback(async (spotifyUserId: string) => {
    setStatus(SpotifyDataCtxStatus.DownloadLoading);

    try {
      const playlists = await DBLib.getAllItems<PlaylistCore>(StoreName.Playlist);
      const albums = await DBLib.getAllItems<AlbumCore>(StoreName.Album);

      const { usersPlaylists, followedPlaylists } = sortAndSplitPlaylists(playlists, spotifyUserId);
      const sortedAlbums = sortAlbumsByArtistsName(albums);

      let dataStr = "";

      dataStr += convertPlaylistsToDownloadString(usersPlaylists, "-- Your Playlists --");

      dataStr += convertPlaylistsToDownloadString(followedPlaylists, "-- Playlists You Follow --");

      dataStr += convertAlbumsToDownloadString(sortedAlbums, "-- Your Albums --");

      const { year, month, day } = getDayMonthYear();

      downloadTextToFile(dataStr, `spotify_data_${year}_${month}_${day}.txt`);
    } catch (error) {
      console.error("DownloadData error", error);
    } finally {
      setStatus(SpotifyDataCtxStatus.Init);
    }
  }, []);

  const uploadData = useCallback(async (file?: File) => {
    if (!file) {
      console.error("File needed to perform data upload");
      return;
    }

    const reader = new FileReader();

    reader.onload = async (e): Promise<void> => {
      setStatus(SpotifyDataCtxStatus.DataLoading);

      try {
        const jsonString = e.target?.result as string;

        const { playlists, albums } = JSON.parse(jsonString) as { playlists: PlaylistCore[]; albums: AlbumCore[] };

        if (!Array.isArray(playlists) || !Array.isArray(albums)) {
          throw new Error("Uploaded file contains invalid data");
        }

        const playlistMetas: PlaylistMeta[] = playlists.map(({ id, name, snapshot_id, owner }) => ({ id, name, snapshot_id, owner }));

        await DBLib.updateMultipleItems<PlaylistMeta>(StoreName.PlaylistMeta, playlistMetas);
        await DBLib.updateMultipleItems<PlaylistCore>(StoreName.Playlist, playlists);
        await DBLib.updateMultipleItems<AlbumCore>(StoreName.Album, albums);

        setDataCount(playlists.length + albums.length);
        setStatus(SpotifyDataCtxStatus.UploadComplete);
      } catch (error) {
        console.error("UploadData error", error);
        setStatus(SpotifyDataCtxStatus.UploadFailure);
      }
    };

    reader.readAsText(file);
  }, []);

  return (
    <SpotifyDataContext.Provider
      value={{
        status,
        dataCount,
        resetToInit,
        performBackup,
        askForDeleteConfirm,
        deleteBackup,
        cancelDelete,
        downloadDataAsJson,
        downloadDataAsTxt,
        uploadData,
      }}
    >
      {children}
    </SpotifyDataContext.Provider>
  );
};

export const useSpotifyData = (): SpotifyDataContextResponse => {
  const context = useContext(SpotifyDataContext);
  if (!context) throw new Error("useSpotifyData must be used within SpotifyDataProvider");
  return context;
};
