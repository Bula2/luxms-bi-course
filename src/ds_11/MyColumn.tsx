// @ts-nocheck
import React, { useState, useEffect } from "react";
import { Column } from "@consta/charts/Column";
import {
  useService,
  KoobFiltersService,
  KoobDataService,
} from "bi-internal/services";
import { ConstaThemeService } from "../services/ConstaThemeService";
import { Theme } from "@consta/uikit/Theme";

const { koobDataRequest3 } = KoobDataService;

const MyColumn = (props) => {
  const { cfg, subspace, dp } = props;
  const [data, setData] = useState([]);
  const constaThemeServiceModel =
    useService<ConstaThemeService>(ConstaThemeService);
  const KoobFiltersServiceModel =
    useService<KoobFiltersService>(KoobFiltersService);

  useEffect(() => {
    dp.getMatrixYX(subspace).then((rawData) => {
      const newData = subspace.xs.map((x, xIdx) => ({
        category: x.id,
        x,
        y: subspace.ys[0],
        value: rawData[0][xIdx],
      }));
      setData(newData);
    });
  }, []);

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

  return (
    <Theme preset={constaThemeServiceModel.currentTheme.preset}>
      <div></div>
      <Column
        data={data}
        xField={"category"}
        yField={"value"}
        onEvent={onEvent}
        renderer={"svg"}
      />
    </Theme>
  );
};

export default MyColumn;
