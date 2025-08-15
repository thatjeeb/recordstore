import React, { type ReactNode } from "react";
import { DownloadAllPlaylistsAsCSVsButton, DownloadDataAsJsonButton, DownloadDataAsTextButton } from "../../components";
import { AppClasses } from "../../styles/appClasses";

export function Download(): ReactNode {
  return (
    <div>
      <p>
        Download backup data as <b>.txt</b> file:
      </p>
      <p className={AppClasses.SmallPrint}>This is the version most users will find useful.</p>
      <div className={AppClasses.ButtonRow}>
        <DownloadDataAsTextButton>Download TXT File</DownloadDataAsTextButton>
      </div>

      <p>
        Download backup data as <b>.csv</b> file:
      </p>
      <p className={AppClasses.SmallPrint}>
        This will download <b>every</b> playlist as a CSV file one after the other. To cancel this action, refresh the page or close the browser tab.
        <br />
        You can also download each playlist as CSV, one at a time, by browsing to the playlist in the library.
      </p>
      <div className={AppClasses.ButtonRow}>
        <DownloadAllPlaylistsAsCSVsButton>Download CSV File</DownloadAllPlaylistsAsCSVsButton>
      </div>

      <p>
        Download backup data as <b>.json</b> file:
      </p>
      <div className={AppClasses.ButtonRow}>
        <DownloadDataAsJsonButton>Download JSON File</DownloadDataAsJsonButton>
      </div>
    </div>
  );
}
