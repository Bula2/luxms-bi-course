// @ts-nocheck
import React, { useState } from "react";
import {
  Theme,
  presetGpnDefault,
  presetGpnDark,
  presetGpnDisplay,
} from "@consta/uikit/Theme";
import { IconSun } from "@consta/uikit/IconSun";
import { IconMoon } from "@consta/uikit/IconMoon";
import { IconLightningBolt } from "@consta/uikit/IconLightningBolt";
import "./DsShellHeader.scss";
import { Breadcrumbs } from "@consta/uikit/Breadcrumbs";
import { L10n, MainToolbarVC, MainToolbar, Profile } from "bi-internal/ui";
import {
  DsStateService,
  useService,
  useServiceItself,
} from "bi-internal/services";
import { UrlState } from "bi-internal/core";
import { ThemeToggler } from "@consta/uikit/ThemeToggler";
import { ConstaThemeService } from "../services/ConstaThemeService";

interface IDsShellHeaderProps {
  schema_name: string;
  dsTitle: string;
  dsDescription: string;
  dsUrl: string;
}

const CBreadCrumbs = () => {
  const dsStateService = useService<DsStateService>(
    DsStateService,
    UrlState.getModel().segmentId
  );
  const url = UrlState.getModel();

  const pages = [
    {
      label: <L10n>datasets</L10n>,
      href: "/#/ds",
    },
    {
      label: dsStateService.datasetTitle,
      href: `/#/${url.segment}/${url.segmentId}`,
    },
    {
      label: dsStateService.dboard.title,
      href: `/#/${url.segment}/${url.segmentId}/${url.route?.replace("#", "")}`,
    },
  ];

  return (
    <div className="CBreadCrumbs">
      <Breadcrumbs items={pages} fitMode="scroll" />
    </div>
  );
};
type Item = "Default" | "Dark" | "Display";

const items: Item[] = ["Default", "Dark", "Display"];

const getItemIcon = (item: Item) => {
  if (item === "Default") {
    return IconSun;
  }
  if (item === "Dark") {
    return IconMoon;
  }
  return IconLightningBolt;
};

const getTheme = (item: Item) => {
  if (item === "Default") {
    return presetGpnDefault;
  }
  if (item === "Dark") {
    return presetGpnDark;
  }
  return presetGpnDisplay;
};
const ThemeTogglerExampleGetters = () => {
  const constaThemeService =
    useServiceItself<ConstaThemeService>(ConstaThemeService);
  const themeModel = constaThemeService.getModel();
  return (
    <Theme preset={themeModel.currentTheme.preset}>
      <ThemeToggler
        className="ThemeToggler"
        items={themeModel.themes}
        value={themeModel.currentTheme}
        getItemKey={(item) => item.key}
        getItemLabel={(item) => item.label}
        getItemIcon={(item) => item.icon}
        onChange={(item) => constaThemeService.setTheme(item.value)}
        direction="downStartLeft"
      />
    </Theme>
  );
};

const DsShellHeader = React.memo(({ schema_name }) => {
  const mainToolbar = useService<MainToolbarVC>(MainToolbarVC, schema_name);
  const constaThemeService =
    useServiceItself<ConstaThemeService>(ConstaThemeService);
  const themeModel = constaThemeService.getModel();
  return (
    <Theme preset={themeModel.currentTheme.preset}>
      <div className="ConstaHeader">
        <CBreadCrumbs />
        <section className="toolbar">
          {!mainToolbar.loading && !mainToolbar.error && (
            <MainToolbar {...mainToolbar} />
          )}
        </section>
        <ThemeTogglerExampleGetters />
        <Profile />
      </div>
    </Theme>
  );
});

export default DsShellHeader;
