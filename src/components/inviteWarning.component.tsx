import React from "react";
import type { ReactNode } from "react";
import { isHostedOnThatjeebGithub } from "../utils";

// Note: this component is not integral to the app's functionality.
// It is only relevant whilst the original developer's Spotify app API is in limited usage quota.
export function InviteWarning(): ReactNode {
  if (isHostedOnThatjeebGithub()) {
    return (
      <p style={{ fontWeight: 600 }}>
        This app is currently in invite only mode.
        <br />
        The developer will need to add your spotify email address before you can begin using it. 
        You will be able to backup once your spotify email has been added.
      </p>
    );
  }
}
