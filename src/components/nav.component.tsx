import React, { useState, type ReactNode } from "react";
import { NavLink, useLocation, useNavigate } from "react-router";
import { AppRoutes } from "../app.definitions";
import { SpotifyDataCtxStatus, useSpotifyAuth, useSpotifyData } from "../lib";
import { AppClasses } from "../styles/appClasses";

export function Nav(): ReactNode {
  const [mobileNavVisible, setMobileNavVisible] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { loggedIn, deleteAuthTokens: deleteTokens } = useSpotifyAuth();
  const { status, dataCount } = useSpotifyData();

  if (!loggedIn || status === SpotifyDataCtxStatus.DataLoading) return null;

  function logout(): void {
    deleteTokens();
    navigate(AppRoutes.Home);
    hideMobileNav();
  }

  function toggleShowMobileNav(): void {
    setMobileNavVisible((x) => !x);
  }

  function hideMobileNav(): void {
    setMobileNavVisible(false);
  }

  const isLibraryPath = pathname.includes(AppRoutes.Library);

  const navWrapperClassName = `${AppClasses.NavWrapper} ${mobileNavVisible ? AppClasses.NavWrapperOpen : ""}`;
  const navClassName = AppClasses.NavBar;
  const secondaryNavClassName = `${AppClasses.NavBar} ${AppClasses.SecondaryNavBar} ${isLibraryPath ? AppClasses.SecondaryNavBarOpen : ""}`;
  const logoutBarName = `${AppClasses.NavBar} ${AppClasses.Logout}`;
  const navButtonClassName = `${AppClasses.NavMobileButton} ${mobileNavVisible ? AppClasses.NavMobileButtonOpen : ""}`;

  return (
    <div className={navWrapperClassName}>
      <nav className={navClassName} onClick={hideMobileNav}>
        <NavLink to={AppRoutes.Home} className={AppClasses.NavBarLink}>
          Home
        </NavLink>
        <NavLink to={AppRoutes.Backup} className={AppClasses.NavBarLink}>
          Backup
        </NavLink>
        {!!dataCount && (
          <NavLink to={AppRoutes.Library} className={AppClasses.NavBarLink}>
            Library
          </NavLink>
        )}
      </nav>

      {!!dataCount && (
        <nav className={secondaryNavClassName} onClick={hideMobileNav}>
          <NavLink to={AppRoutes.PlaylistList} className={AppClasses.NavBarLink}>
            Playlists
          </NavLink>
          <NavLink to={AppRoutes.AlbumList} className={AppClasses.NavBarLink}>
            Albums
          </NavLink>
        </nav>
      )}

      {!!dataCount && (
        <nav className={navClassName} onClick={hideMobileNav}>
          <NavLink to={AppRoutes.Download} className={AppClasses.NavBarLink}>
            Download
          </NavLink>
        </nav>
      )}

      <nav className={logoutBarName}>
        <button onClick={logout} className={AppClasses.NavBarLink}>
          Logout
        </button>
      </nav>

      <div onClick={toggleShowMobileNav} className={navButtonClassName}>
        <label>
          <div />
          <div />
          <div />
        </label>
      </div>
    </div>
  );
}
