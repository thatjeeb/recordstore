import React from "react";
import type { ReactNode } from "react";
import { AppClasses } from "../styles/appClasses";

interface LibraryItemProps {
  icon: ReactNode;
  title: string;
  subtitle?: string;
}

export function LibraryItem(props: LibraryItemProps): ReactNode {
  const { icon, title, subtitle } = props;

  return (
    <div className={AppClasses.LibraryItem}>
      <div className={AppClasses.LibraryItemIcon}>{icon}</div>
      <p className={AppClasses.LibraryItemTitle}>{title}</p>
      {!!subtitle && <p className={AppClasses.LibraryItemSubtitle}>{subtitle}</p>}
    </div>
  );
}
