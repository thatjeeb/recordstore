const appRootClass = "record-store-app";
// const homeViewClass = "record-store-home";
const backupViewClass = "record-store-backup";
const playlistListViewClass = "record-store-playlist-list";
const playlistDetailViewClass = "record-store-playlist-detail";

export enum AppClasses {
  App = appRootClass,
  Header = `${appRootClass}_header`,
  Content = `${appRootClass}_content`,

  // Components
  SmallPrint = `${appRootClass}_small-print`,

  /// Buttons
  ButtonRow = `${appRootClass}_button-row`,
  PrimaryButton = `${appRootClass}_primary-button`,
  SecondaryButton = `${appRootClass}_secondary-button`,
  DangerButton = `${appRootClass}_danger-button`,

  /// Loader
  LoaderContainer = `${appRootClass}_loader-container`,
  Loader = `${appRootClass}_loader`,

  /// Nav
  NavWrapper = `${appRootClass}_nav-wrapper`,
  NavWrapperOpen = `${appRootClass}_nav-wrapper--open`,
  NavWrapperShowSecondary = `${appRootClass}_nav-wrapper--show-secondary`,
  NavBar = `${appRootClass}_nav-bar`,
  NavBarOpen = `${appRootClass}_nav-bar--open`,
  SecondaryNavBar = `${appRootClass}_secondary-nav-bar`,
  SecondaryNavBarOpen = `${appRootClass}_secondary-nav-bar--open`,
  NavBarLink = `${appRootClass}_nav-bar-link`,
  NavMobileButton = `${appRootClass}_nav-mobile-button`,
  NavMobileButtonOpen = `${appRootClass}_nav-mobile-button--open`,
  Logout = `${appRootClass}_logout`,

  /// Library List Item
  LibraryItem = `${appRootClass}_library-item`,
  LibraryItemIcon = `${appRootClass}_library-item-icon`,
  LibraryItemTitle = `${appRootClass}_library-item-title`,
  LibraryItemSubtitle = `${appRootClass}_library-item-subtitle`,

  /// Playlist Item
  PlaylistItem = `${appRootClass}_playlist-item`,

  /// Icons
  PlaylistIcon = `${appRootClass}_playlist-icon`,
  AlbumIcon = `${appRootClass}_album-icon`,
  SongIcon = `${appRootClass}_song-icon`,

  // Views
  /// Home

  /// Backup
  BackupDetailView = backupViewClass,
  BackupCompletionWarning = `${backupViewClass}_completion-warning`,
  BackupFileInput = `${backupViewClass}_file-input`,

  /// Playlist List
  PlaylistListView = playlistListViewClass,

  /// Playlist Detail
  PlaylistDetailView = playlistDetailViewClass,
}
