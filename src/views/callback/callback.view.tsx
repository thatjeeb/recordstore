import React, { useEffect, useRef, useState, type ReactNode } from "react";
import { useNavigate } from "react-router";
import { AppRoutes } from "../../app.definitions";
import { useSpotifyAuth } from "../../lib";
import { AppLanguage } from "../../app.language";
import { GoHomeButton } from "../../components";

export function Callback(): ReactNode {
  const [error, setError] = useState(false);
  const getAccessTokenRan = useRef(false);
  const { fetchAccessToken } = useSpotifyAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (getAccessTokenRan.current) return;

    (async function (): Promise<void> {
      getAccessTokenRan.current = true;

      try {
        await fetchAccessToken();
        navigate(AppRoutes.Home);
      } catch (error) {
        console.error(error);
        setError(true);
      }
    })();
  }, [fetchAccessToken, navigate]);

  if (error) {
    return (
      <div>
        <h2>{AppLanguage.Error}</h2>
        <GoHomeButton />
      </div>
    );
  }

  return (
    <div>
      <h2>{AppLanguage.LoggingIn}</h2>
    </div>
  );
}
