import "./styles/app.scss";
import { AppClasses } from "./styles/appClasses";
import React, { useEffect, useRef, type ReactNode } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { AlbumList, Backup, Callback, Download, Home, NotFound, PlaylistDetail, PlaylistList } from "./views";
import { Header, Nav } from "./components";
import { DBLib, useSpotifyAuth } from "./lib";
import { AppRoutes } from "./app.definitions";

function App(): ReactNode {
  const dbInitialised = useRef(false);
  const { appAuthInit } = useSpotifyAuth();

  useEffect(() => {
    try {
      appAuthInit();
    } catch (error) {
      console.error(error);
    }
  }, [appAuthInit]);

  useEffect(() => {
    if (dbInitialised.current) return;
    (async function (): Promise<void> {
      try {
        await DBLib.initDb();
      } catch (error) {
        console.error(error);
      } finally {
        dbInitialised.current = true;
      }
    })();
  }, []);

  return (
    <div className={AppClasses.App}>
      <BrowserRouter basename={process.env.PUBLIC_PATH}>
        <Header />
        <Nav />
        <div className={AppClasses.Content}>
          <Routes>
            <Route path={AppRoutes.Home} element={<Home />} />
            <Route path={AppRoutes.Callback} element={<Callback />} />
            <Route path={AppRoutes.Backup} element={<Backup />} />
            <Route path={AppRoutes.Library}>
              <Route index element={<Navigate replace to={AppRoutes.PlaylistList} />} />
              <Route path={AppRoutes.PlaylistList} element={<PlaylistList />} />
              <Route path={AppRoutes.PlaylistsDetail} element={<PlaylistDetail />} />
              <Route path={AppRoutes.AlbumList} element={<AlbumList />} />
            </Route>
            <Route path={AppRoutes.Download} element={<Download />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
