import React, { useState, type ReactNode } from "react";
import { NavLink, useLocation, useNavigate } from "react-router";
import { AppRoutes } from "../app.definitions";
import { useSpotifyAuth } from "../lib";
import { AppClasses } from "../styles/appClasses";

export function Nav(): ReactNode {
  const [mobileNavVisible, setMobileNavVisible] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { loggedIn, deleteAuthTokens: deleteTokens } = useSpotifyAuth();

  if (!loggedIn) return null;

  function logout(): void {
    deleteTokens();
    navigate(AppRoutes.Home);
    toggleShowMobileNav();
  }

  function toggleShowMobileNav(): void {
    setMobileNavVisible((x) => !x);
  }

  const isLibraryPath = pathname.includes(AppRoutes.Library);

  const navWrapperClassName = `${AppClasses.NavWrapper} ${mobileNavVisible ? AppClasses.NavWrapperOpen : ""}`;
  const navClassName = `${AppClasses.NavBar} ${mobileNavVisible ? AppClasses.NavBarOpen : ""}`;
  const secondaryNavClassName = `${AppClasses.NavBar} ${AppClasses.SecondaryNavBar} ${isLibraryPath ? AppClasses.SecondaryNavBarOpen : ""}`;
  const logoutBarName = `${AppClasses.NavBar} ${AppClasses.Logout}`;
  const navButtonClassName = `${AppClasses.NavMobileButton} ${mobileNavVisible ? AppClasses.NavMobileButtonOpen : ""}`;

  return (
    <div className={navWrapperClassName}>
      <nav className={navClassName}>
        <NavLink to={AppRoutes.Home} className={AppClasses.NavBarLink} onClick={toggleShowMobileNav}>
          Home
        </NavLink>
        <NavLink to={AppRoutes.Backup} className={AppClasses.NavBarLink} onClick={toggleShowMobileNav}>
          Backup
        </NavLink>
        <NavLink to={AppRoutes.Library} className={AppClasses.NavBarLink} onClick={toggleShowMobileNav}>
          Library
        </NavLink>
      </nav>

      <nav className={secondaryNavClassName}>
        <NavLink to={AppRoutes.PlaylistList} className={AppClasses.NavBarLink} onClick={toggleShowMobileNav}>
          Playlists
        </NavLink>
        <NavLink to={AppRoutes.AlbumList} className={AppClasses.NavBarLink} onClick={toggleShowMobileNav}>
          Albums
        </NavLink>
      </nav>

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
