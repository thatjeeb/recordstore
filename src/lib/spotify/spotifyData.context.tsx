import React, { createContext, useCallback, useContext, useState, useEffect, type ReactNode } from "react";
import { downloadJsonToFile } from "../../utils";
import { DBLib, StoreName } from "../db";
import type { AlbumCore, PlaylistCore, SpotifyDataContextResponse } from "./spotify.definition";
import {
  fetchUsersPlaylists,
  convertPlaylistToCore,
  fetchPlaylistTracks,
  convertPlaylistTrackToTrackCore,
  fetchUsersAlbums,
  convertAlbumToCore,
} from "./spotify.utils";

const SpotifyDataContext = createContext<SpotifyDataContextResponse | undefined>(undefined);

/**
 * This contains all the logic for data/backup handling, including doing, downloading, uploading and deleting the backup.
 * It exists as a context instead of a classic hook so that the performing the backup persists throughout the whole app whilst it's happening.
 **/
export const SpotifyDataProvider = ({ children }: { children: ReactNode }): ReactNode => {
  const [loading, setLoading] = useState(false);
  const [backupComplete, setBackupComplete] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [uploadFailure, setUploadFailure] = useState(false);
  const [deleteComplete, setDeleteComplete] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [dataCount, setDataCount] = useState(0);

  // Hooks
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent): void => {
      event.preventDefault();
      event.returnValue = "";
    };

    if (loading) {
      window.addEventListener("beforeunload", handleBeforeUnload);
    }

    return (): void => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [loading]);

  const getDataCount = useCallback(async () => {
    const playlistCount = await DBLib.count(StoreName.Playlist);
    const albumCount = await DBLib.count(StoreName.Album);
    setDataCount(playlistCount + albumCount);
  }, []);

  useEffect(() => {
    getDataCount();
  }, [getDataCount]);

  // Methods
  const clearCompletes = useCallback(() => {
    setUploadComplete(false);
    setDeleteComplete(false);
    setBackupComplete(false);
    setUploadFailure(false);
  }, []);

  /// Backup Items
  const backupPlaylists = useCallback(async () => {
    setLoading(true);

    try {
      const spotifyPlaylists = await fetchUsersPlaylists();
      const playlistCores = spotifyPlaylists.map(convertPlaylistToCore);

      DBLib.addMultipleItems<PlaylistCore>(StoreName.Playlist, playlistCores);
    } catch (error) {
      console.error("BackupPlaylists error", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const backupPlaylistTracks = useCallback(async () => {
    setLoading(true);

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
    } finally {
      setLoading(false);
    }
  }, []);

  const backupAlbums = useCallback(async () => {
    setLoading(true);

    try {
      const spotifyAlbums = await fetchUsersAlbums();
      const albumCores = spotifyAlbums.map(({ album }) => convertAlbumToCore(album));

      DBLib.addMultipleItems<AlbumCore>(StoreName.Album, albumCores);
    } catch (error) {
      console.error("BackupAlbums error", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const performBackup = useCallback(async () => {
    await backupPlaylists();
    await backupPlaylistTracks();
    await backupAlbums();
    await getDataCount();
    setBackupComplete(true);
  }, [backupAlbums, backupPlaylistTracks, backupPlaylists, getDataCount]);

  const refreshBackup = useCallback(async () => {
    setLoading(true);
    setBackupComplete(false);

    try {
      const dbAlbums = await DBLib.getAllItems<AlbumCore>(StoreName.Album);
      const dbAlbumIds = new Set(dbAlbums.map((album) => album.id));

      const spotifyAlbums = await fetchUsersAlbums();

      for (const { album } of spotifyAlbums) {
        if (!dbAlbumIds.has(album.id)) {
          const albumCore = convertAlbumToCore(album);
          await DBLib.addItem<AlbumCore>(StoreName.Album, albumCore);
        }
      }

      const spotifyPlaylists = await fetchUsersPlaylists();

      for (const playlist of spotifyPlaylists) {
        try {
          const dbPlaylist = await DBLib.getItem<PlaylistCore>(StoreName.Playlist, playlist.id);
          if (!dbPlaylist || dbPlaylist.snapshot_id !== playlist.snapshot_id) {
            const playlistCore = convertPlaylistToCore(playlist);
            await DBLib.updateItem<PlaylistCore>(StoreName.Playlist, playlistCore);
          }
        } catch (error) {
          console.error("RefreshBackup playlist getItem error", error);
        }
      }

      await backupPlaylistTracks();

      setBackupComplete(true);
    } catch (error) {
      console.error("RefreshBackup error", error);
    } finally {
      setLoading(false);
    }
  }, [backupPlaylistTracks]);

  /// Delete Items
  const askForDeleteConfirm = useCallback(async () => {
    setShowDeleteConfirm(true);
  }, []);

  const deleteBackup = useCallback(async () => {
    setLoading(false);
    try {
      await DBLib.deleteAllItems(StoreName.Playlist);
      await DBLib.deleteAllItems(StoreName.Album);

      setDataCount(0);
      setShowDeleteConfirm(false);
      setDeleteComplete(true);
    } catch (error) {
      console.error("DeleteBackup error", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const cancelDelete = useCallback(async () => {
    setShowDeleteConfirm(false);
  }, []);

  /// File Store
  const downloadData = useCallback(async () => {
    setLoading(true);
    try {
      const playlists = await DBLib.getAllItems<PlaylistCore>(StoreName.Playlist);
      const albums = await DBLib.getAllItems<AlbumCore>(StoreName.Album);
      const allData = {
        playlists,
        albums,
      };

      const date = new Date();
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();

      downloadJsonToFile(allData, `spotify_data_${year}_${month}_${day}.json`);
    } catch (error) {
      console.error("DownloadData error", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const uploadData = useCallback(async (file?: File) => {
    if (!file) {
      console.error("File needed to perform data upload");
      return;
    }

    const reader = new FileReader();

    reader.onload = async (e): Promise<void> => {
      setLoading(true);
      try {
        const jsonString = e.target?.result as string;

        const { playlists, albums } = JSON.parse(jsonString) as { playlists: PlaylistCore[]; albums: AlbumCore[] };

        if (!Array.isArray(playlists) || !Array.isArray(albums)) {
          throw new Error("Uploaded file contains invalid data");
        }

        await DBLib.addMultipleItems<PlaylistCore>(StoreName.Playlist, playlists);
        await DBLib.addMultipleItems<AlbumCore>(StoreName.Album, albums);

        setDataCount(playlists.length + albums.length);
        setUploadComplete(true);
      } catch (error) {
        console.error("UploadData error", error);
        setUploadFailure(true);
      } finally {
        setLoading(false);
      }
    };

    reader.readAsText(file);
  }, []);

  return (
    <SpotifyDataContext.Provider
      value={{
        loading,
        dataCount,
        backupComplete,
        uploadComplete,
        uploadFailure,
        deleteComplete,
        showDeleteConfirm,
        clearCompletes,
        performBackup,
        refreshBackup,
        askForDeleteConfirm,
        deleteBackup,
        cancelDelete,
        downloadData,
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
