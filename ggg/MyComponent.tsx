import React, { useEffect, useState } from "react";

import axios from "axios";
import { AppConfig } from "bi-internal/core";
import { Layout } from "@consta/uikit/Layout";
import { Theme, presetGpnDefault } from "@consta/uikit/Theme";
import { Button } from "@consta/uikit/Button";
import { Loader } from '@consta/uikit/Loader';

import MySelect from "./MySelect";
import useServiceItself from "./MyService";

const getKoobDataByCfg = async (data: any, callback: any): Promise<any> => {
  const {
    koob,
    distinct,
    columns,
    filters,
    sort,
    limit,
    offset,
    options,
    subtotals,
  } = data;
  const url: string = AppConfig.fixRequestUrl(`/api/v3/koob/data`);

  const body: any = {
    with: koob,
    columns,
    filters,
  };

  body.offset = offset ?? undefined;
  body.limit = limit ?? undefined;
  body.sort = sort ?? undefined;
  body.options = options ?? undefined;
  body.subtotals = subtotals ?? undefined;
  body.distinct = distinct ?? undefined;

  try {
    const response = await axios({
      url,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/stream+json",
      },
      data: body,
    });

    let data = response.data;

    if (
      String(response.headers["content-type"]).startsWith(
        "application/stream+json"
      )
    ) {
      if (typeof data === "string") {
        data = data
          .split("\n")
          .filter((line: string) => !!line)
          .map((line: string) => JSON.parse(line));
      } else if (data && typeof data === "object" && !Array.isArray(data)) {
        data = [data];
      }
      callback(data);
    }
  } catch (e) {
    console.log(e);
    return;
  }
};

const MyComponent = () => {
  const [data, setData] = useState<any>([]);
  const [names, setNames] = useState([]);

  useEffect(() => {
    const url: string = AppConfig.fixRequestUrl(
      `/api/v3/koob/luxmsbi.electricity_payments`
    );
    axios
      .get(url)
      .then((response) => {
        const names: any = [];
        response.data.dimensions.map((item: { title: string; id: string }) =>
          names.push({
            id: item.id,
            name: item.title,
          })
        );
        setNames(names);
      })
      .catch((error) => console.log(error));

    getKoobDataByCfg(
      {
        koob: "luxmsbi.electricity_payments",
        distinct: [],
        filters: { org_level2: ["!=", null] },
        columns: ["org_level1", "org_level2"],
        sort: ["+org_level2"],
      },
      (resp: any[]) => {
        setData(resp);
      }
    );
  }, []);

  const MyServiceExample = useServiceItself(data, names);

  return (
    <Theme
      className="dashlet-header__modal_layout"
      preset={presetGpnDefault}
      style={{
        height: "100%",
        zIndex: 1,
        paddingTop: "20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {MyServiceExample.isLoading && <Loader/>}
      <Layout
        style={{
          height: "100%",
          width: "100%",
          zIndex: 1,
          paddingTop: "20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          opacity: MyServiceExample.isLoading ? "0" : "1",
        }}
      >
        {MyServiceExample.items.length > 0 &&
          MyServiceExample.items.map((item: any) => {
            return <MySelect MyServiceExample={MyServiceExample} item={item} />;
          })}
        <Button
          label={"Применить :)"}
          onClick={MyServiceExample.applyFilters}
          style={{ marginBottom: "20px" }}
        />
        <Button
          label={"Сбросить :("}
          onClick={MyServiceExample.resetFilters}
          view="ghost"
        />
      </Layout>
    </Theme>
  );
};

export default MyComponent;
