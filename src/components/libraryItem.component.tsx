import React from "react";
import type { ReactNode } from "react";
import { AppClasses } from "../styles/appClasses";
import { ViewOnSpotify } from "./actionButtons.component";

interface LibraryItemProps {
  icon: ReactNode;
  title: string;
  link?: string;
  subtitle?: string;
}

export function LibraryItem(props: LibraryItemProps): ReactNode {
  const { icon, title, link, subtitle } = props;

  return (
    <div className={AppClasses.LibraryItem}>
      <div className={AppClasses.LibraryItemIcon}>{icon}</div>
      <p className={AppClasses.LibraryItemTitle}>
        {title}
        {!!link && <ViewOnSpotify href={link} />}
      </p>
      {!!subtitle && <p className={AppClasses.LibraryItemSubtitle}>{subtitle}</p>}
    </div>
  );
}
