import React, { useEffect, useState, type ReactNode } from "react";
import { AlbumCore, DBLib, StoreName } from "../../../lib";
import { AlbumItem, Loader } from "../../../components";
import { sortAlbumsByArtistsName } from "../../../lib";

export function AlbumList(): ReactNode {
  const [loading, setLoading] = useState(false);
  const [albums, setAlbums] = useState<AlbumCore[]>([]);

  useEffect(() => {
    (async (): Promise<void> => {
      setLoading(true);

      try {
        const dbAlbums = (await DBLib.getAllItems<AlbumCore>(StoreName.Album)) as AlbumCore[];
        const sortedAlbums = sortAlbumsByArtistsName(dbAlbums);
        setAlbums(sortedAlbums);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    })();
  }, [setAlbums]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div>
      <h2>Albums</h2>

      {!albums.length && <p>No albums found.</p>}

      {albums.map((a) => (
        <AlbumItem album={a} key={"album_" + a.id} />
      ))}
    </div>
  );
}
