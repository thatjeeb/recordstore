import React from "react";
import type { ReactNode } from "react";

// Note this component is not integral to the app's functionality.
export function InviteWarning(): ReactNode {
  if (window.location.href.toLowerCase().includes("thatjeeb.github.io/recordstore")) {
    return (
      <p style={{ fontWeight: 600 }}>
        This app is currently in invite only mode. 
        <br />
        The developer will need to add your spotify email address before you can begin using it.
        You can login, but trying to backup won&apos;t work unless you&apos;ve been given access. Please contact the developer to be invited.
      </p>
    );
  }
}
