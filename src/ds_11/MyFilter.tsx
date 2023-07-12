// @ts-nocheck
import React, { useState, useEffect } from "react";
import {
  useService,
  useServiceItself,
  KoobFiltersService,
} from "bi-internal/services";
import { ConstaThemeService } from "../services/ConstaThemeService";
import { KoobDimensionsService } from "../services/KoobDimensionsService";
import { Theme } from "@consta/uikit/Theme";
import { Select } from "@consta/uikit/Select";

const MyFilter = (props) => {
  const { cfg, subspace, dp } = props;
  const dataSource = cfg.dataSource;
  const [selectedOptions, setSelectedoptions] = useState({});
  const constaThemeServiceModel =
    useService<ConstaThemeService>(ConstaThemeService);
  const koobDimensionsService = useServiceItself<KoobDimensionsService>(
    KoobDimensionsService,
    dataSource.koob,
    dataSource.dimensions
  );
  const kdsModel = koobDimensionsService?.getModel();

  console.log(kdsModel);

  const onClick = () => {
    //const filters = {};
    // ...
    koobDimensionsService.setFilters(selectedOptions);
  };

  const onEvent = (chart, event) => {
    switch (event.type) {
      case "element:click":
        if (cfg.getRaw().hasOwnProperty("onClickDataPoint")) {
          const vcpv = {
            m: undefined,
            l: undefined,
            p: undefined,
            z: subspace.zs[0],
            y: subspace.ys[0],
            x: subspace.xs.find((el) => el.id === event.data.data.category),
            v: event.data.data.value,
          };
          cfg.controller.handleVCPClick(event.event, vcpv);
        } else {
          KoobFiltersService.getInstance().setFilters("", {
            [event.data.data.x.axisIds[0]]: ["=", event.data.data.category],
          });
        }
        console.log(event.data);
        break;
    }
  };

  if (kdsModel?.loading) return <div>Loading...</div>;
  if (kdsModel?.error)
    return <div>{koobDimensionsService?.getModel()?.error}</div>;

  return (
    <Theme preset={constaThemeServiceModel.currentTheme.preset}>
      {kdsModel?.dimensions.map((dim) => (
        <div key={dim.id}>
          <div>{dim.title}</div>
          <Select
            items={dim.values.map((d) => ({ id: d, label: d }))}
            value={dim.values.map((d) => ({ id: d, label: d }))[0]}
            onChange={({ value }) => console.log(dim, value)}
          />
        </div>
      ))}
    </Theme>
  );
};

export default MyFilter;
