import React, { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { SpotifyAuthContextReponse, spotifyConsts, SpotifyTokenResponse, spotifyUrls } from "./spotify.definition";
import { generateRandomString, getCodeChallenge } from "../../utils";
import { fetchUserProfile, hasAccessTokenExpired, saveTokensToLocalStorage } from "./spotify.utils";

const SpotifyAuthContext = createContext<SpotifyAuthContextReponse | undefined>(undefined);

export const SpotifyAuthProvider = ({ children }: { children: ReactNode }): ReactNode => {
  const [hasAccessToken, setHasAccessToken] = useState(false);
  const [spotifyUserId, setSpotifyUserId] = useState("");

  useEffect(() => {
    if (localStorage.getItem(spotifyConsts.accessTokenStorageKey) !== null) {
      setHasAccessToken(true);
    }
  }, []);

  const goToSpotifyAuth = useCallback(async () => {
    const codeVerifier = generateRandomString();
    const codeChallenge = await getCodeChallenge(codeVerifier);

    localStorage.setItem(spotifyConsts.codeVerifierStorageKey, codeVerifier);

    const params = {
      response_type: "code",
      client_id: spotifyConsts.clientId,
      scope: spotifyConsts.scope,
      code_challenge_method: "S256",
      code_challenge: codeChallenge,
      redirect_uri: spotifyConsts.redirectUri,
    };

    const authUrl = new URL(spotifyUrls.auth);
    authUrl.search = new URLSearchParams(params).toString();
    window.location.href = authUrl.toString();
  }, []);

  const fetchAccessToken = useCallback(async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const codeParam = urlParams.get("code");
    const errorParam = urlParams.get("error");

    if (errorParam) {
      throw new Error(`Error during Spotify auth. Error query param: ${errorParam}`);
    }

    if (!codeParam) {
      throw new Error("Error during Spotify auth. No code query param.");
    }

    const codeVerifier = localStorage.getItem(spotifyConsts.codeVerifierStorageKey);

    if (!codeVerifier) {
      throw new Error("Error during Spotify auth. No code verifier.");
    }

    const payload = {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: spotifyConsts.clientId,
        grant_type: "authorization_code",
        code: codeParam,
        redirect_uri: spotifyConsts.redirectUri,
        code_verifier: codeVerifier,
      }),
    };

    const response = await fetch(spotifyUrls.token, payload);

    if (!response.ok) {
      throw new Error("Error during Spotify auth. Access token request failed");
    }

    const responseJson: SpotifyTokenResponse = await response.json();
    setHasAccessToken(true);
    saveTokensToLocalStorage(responseJson);
  }, []);

  const refreshAccessToken = useCallback(async () => {
    const refreshToken = localStorage.getItem(spotifyConsts.refreshTokenStorageKey);

    if (!refreshToken) {
      throw new Error("Error during Spotify auth. No code verifier.");
    }

    const payload = {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
        client_id: spotifyConsts.clientId,
      }),
    };

    const response = await fetch(spotifyUrls.token, payload);

    if (!response.ok) {
      throw new Error("Error during Spotify auth. Access token request failed");
    }

    const responseJson: SpotifyTokenResponse = await response.json();
    saveTokensToLocalStorage(responseJson);
    setHasAccessToken(true);
  }, []);

  const deleteAuthTokens = useCallback(() => {
    localStorage.removeItem(spotifyConsts.accessTokenStorageKey);
    localStorage.removeItem(spotifyConsts.refreshTokenStorageKey);
    localStorage.removeItem(spotifyConsts.expiresInStorageKey);
    localStorage.removeItem(spotifyConsts.expiryDateStorageKey);
    setHasAccessToken(false);
  }, []);

  const performTokenRefresh = useCallback(async () => {
    if (hasAccessToken && hasAccessTokenExpired()) {
      await refreshAccessToken();
    }
  }, [hasAccessToken, refreshAccessToken]);

  const getUserId = useCallback(async () => {
    if (!hasAccessToken || hasAccessTokenExpired()) return;

    const { id } = await fetchUserProfile();

    setSpotifyUserId(id);
  }, [hasAccessToken]);

  const appAuthInit = useCallback(async () => {
    await performTokenRefresh();
    await getUserId();
  }, [performTokenRefresh, getUserId]);

  return (
    <SpotifyAuthContext.Provider value={{ loggedIn: hasAccessToken, spotifyUserId, goToSpotifyAuth, fetchAccessToken, deleteAuthTokens, appAuthInit }}>
      {children}
    </SpotifyAuthContext.Provider>
  );
};

export const useSpotifyAuth = (): SpotifyAuthContextReponse => {
  const context = useContext(SpotifyAuthContext);
  if (!context) throw new Error("useSpotifyAuth must be used within SpotifyAuthProvider");
  return context;
};
