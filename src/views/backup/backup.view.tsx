import React, { useEffect, type ReactNode, type ChangeEvent } from "react";
import { AppClasses } from "../../styles/appClasses";
import { useSpotifyData, SpotifyDataCtxStatus } from "../../lib";
import { GoToDownloadButton, GoHomeButton, Loader, GoToLibraryButton } from "../../components";
import { AppLanguage } from "../../app.language";
import { isLocalHost } from "../../utils";

function BackupWrapper({ children }: { children: ReactNode }): ReactNode {
  return <div className={AppClasses.BackupDetailView}>{children}</div>;
}

export function Backup(): ReactNode {
  const { status, dataCount, resetToInit, performBackup, refreshBackup, askForDeleteConfirm, deleteBackup, cancelDelete, uploadData } = useSpotifyData();

  useEffect(() => {
    return (): void => resetToInit();
  }, [resetToInit]);

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>): Promise<void> {
    const file = event.target.files?.[0];
    uploadData(file);
  }

  if (status === SpotifyDataCtxStatus.DataLoading) {
    return (
      <BackupWrapper>
        <Loader />

        <p className={AppClasses.BackupCompletionWarning}>Please don&apos;t leave this page or close the tab whilst action is taking place.</p>
      </BackupWrapper>
    );
  }

  if (status === SpotifyDataCtxStatus.DeleteNeedsConfirmation) {
    return (
      <BackupWrapper>
        <p>Are you sure you want to delete your backup data? This action cannot be undone.</p>

        <p className={AppClasses.SmallPrint}>{AppLanguage.RemovalWarning}</p>

        <div className={AppClasses.ButtonRow}>
          {/* Keys have been added to these buttons so React knows that the buttons are actually different.
              i.e., this button is different from other .ButtonRow > button:first-child elements found in the other if blocks. */}
          <button key="perform-delete-button" className={AppClasses.DangerButton} onClick={deleteBackup}>
            Delete Your Data
          </button>

          <button key="cancel-delete-button" className={AppClasses.SecondaryButton} onClick={cancelDelete}>
            Cancel
          </button>
        </div>
      </BackupWrapper>
    );
  }

  if (status === SpotifyDataCtxStatus.UploadFailure) {
    return (
      <BackupWrapper>
        <p>Upload failed</p>

        <p>Please ensure your file is the correct format and try again.</p>
      </BackupWrapper>
    );
  }

  if (status === SpotifyDataCtxStatus.BackupFailure) {
    return (
      <BackupWrapper>
        <p>Backup failed</p>

        <p>Please refresh the page and try again.</p>
      </BackupWrapper>
    );
  }

  if (status === SpotifyDataCtxStatus.DeleteFailure) {
    return (
      <BackupWrapper>
        <p>Delete failed</p>

        <p>Please refresh the page and try again.</p>
      </BackupWrapper>
    );
  }

  if (status === SpotifyDataCtxStatus.BackupComplete || status === SpotifyDataCtxStatus.UploadComplete) {
    const actionWord = status === SpotifyDataCtxStatus.BackupComplete ? "Backup" : "Upload";

    return (
      <BackupWrapper>
        <p>{actionWord} complete!</p>

        <p className={AppClasses.SmallPrint}>{AppLanguage.StorageWarning}</p>

        <div className={AppClasses.ButtonRow}>
          <GoToLibraryButton />

          <GoToDownloadButton />
        </div>
      </BackupWrapper>
    );
  }

  if (status === SpotifyDataCtxStatus.DeleteComplete) {
    return (
      <BackupWrapper>
        <p>Data deleted</p>

        <p className={AppClasses.SmallPrint}>{AppLanguage.RemovedWarning}</p>

        <div className={AppClasses.ButtonRow}>
          <GoHomeButton />
        </div>
      </BackupWrapper>
    );
  }

  if (dataCount > 0) {
    return (
      <BackupWrapper>
        <p>You previously performed a backup. Press the button below to refresh your backup with the latest data from your Spotify account.</p>

        <p>{AppLanguage.StorageWarning}</p>

        <div className={AppClasses.ButtonRow}>
          <button key="refresh-button" className={AppClasses.PrimaryButton} onClick={refreshBackup}>
            Refresh Your Data
          </button>

          <GoToDownloadButton />

          <button key="start-delete-button" className={AppClasses.SecondaryButton} onClick={askForDeleteConfirm}>
            Delete Your Data
          </button>
        </div>
      </BackupWrapper>
    );
  }

  return (
    <BackupWrapper>
      <p>Press the button below to start the process of backing up your spotify data!</p>

      <p>{AppLanguage.StorageWarning}</p>

      <div className={AppClasses.ButtonRow}>
        <button key="backup-button" className={AppClasses.PrimaryButton} onClick={performBackup}>
          Backup Your Data
        </button>

        {/**
         * This button is only available on localhost for now because it likely won't provide much value to non technical users,
         * i.e. users who are just interested in using this app online and not deploying it themselves.
         **/}
        {isLocalHost() && (
          <label className={AppClasses.SecondaryButton}>
            Upload Your Backup From JSON File
            <input className={AppClasses.BackupFileInput} type="file" accept=".json" onChange={handleFileChange} />
          </label>
        )}
      </div>
    </BackupWrapper>
  );
}
