import React, { type ReactNode } from "react";
import { DownloadDataAsJsonButton, DownloadDataAsTextButton } from "../../components";
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
        Download backup data as <b>.json</b> file:
      </p>
      <div className={AppClasses.ButtonRow}>
        <DownloadDataAsJsonButton>Download JSON File</DownloadDataAsJsonButton>
      </div>
    </div>
  );
}
