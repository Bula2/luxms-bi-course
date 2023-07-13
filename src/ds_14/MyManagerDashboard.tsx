//@ts-nocheck
import React, { useEffect, useState } from "react";

import { Theme, presetGpnDefault } from "@consta/uikit/Theme";
import { Combobox } from "@consta/uikit/Combobox";
import { Button } from "@consta/uikit/Button";
import { Layout } from "@consta/uikit/Layout";
import { IconForward } from "@consta/icons/IconForward";
import { IconClose } from "@consta/icons/IconClose";
import { getKoobDataByCfg } from "../utils/requests";
import { KoobFiltersService } from "bi-internal/services";

import "./MyManagerDashboard.scss";

const MyManagerDashboard = () => {
  const [organizationList, setOrganizationList] = useState<Object[]>([]);
  const [objectList, setObjectList] = useState<Object[]>([]);
  const [organization, setOrganization] = useState<any[] | null>();
  const [object, setObject] = useState<any[] | null>();
  const [filters, setFilters] = useState<any>();

  useEffect(() => {
    getKoobDataByCfg(
      {},
      {
        koob: "luxmsbi.electricity_payments",
        distinct: [],
        columns: ["org_level1", "object_name"],
        sort: ["+org_level1"],
      },
      (response: any[]) => {
        const uniqOrganizationList = Array.from(
          new Set(response.map((item) => item.org_level1))
        );
        setOrganizationList(
          uniqOrganizationList.map((item: any, index: number) => {
            return { label: item, id: index, key: "org_level1" };
          })
        );
        const uniqObjectsListList = Array.from(
          new Set(response.map((item) => item.object_name))
        );
        setObjectList(
          uniqObjectsListList.map((item: any, index: number) => {
            return { label: item, id: index, key: "object_name" };
          })
        );
      }
    );
  }, []);

  const onOrganizationClick = (currentOrganization: any) => {
    setOrganization(currentOrganization);
    const organizationFiters = currentOrganization.map((item) => item.label);
    setFilters(() => {
      return {
        ...filters,
        org_level1: ["=", ...organizationFiters!],
      };
    });
  };

  const onObjectClick = (currentObject: any) => {
    setObject(currentObject);
    const objectFilters = currentObject.map((item) => item.label);
    setFilters(() => {
      return {
        ...filters,
        object_name: ["=", ...objectFilters!],
      };
    });
  };

  const onClick = () => {
    KoobFiltersService.getInstance().setFilters("", filters);
  };

  const onResetClick = () => {
    setOrganization([]);
    setObject([]);
    const resetFilters = {
      org_level1: ["!="],
      object_name: ["!="],
    };
    KoobFiltersService.getInstance().setFilters("", resetFilters);
  };

  return (
    <Theme preset={presetGpnDefault} className="MyManagerLayout">
      <Combobox
        placeholder="Организация"
        items={organizationList}
        value={organization}
        onChange={({ value }) => onOrganizationClick(value)}
        multiple
        style={{ zIndex: 1000 }}
      />
      <Combobox
        placeholder="Тип объекта"
        items={objectList}
        value={object}
        onChange={({ value }) => onObjectClick(value)}
        multiple
        style={{ zIndex: 1000 }}
      />
      <Layout className="MyManagerButtons">
        <Button
          label="Применить фильтры"
          iconRight={IconForward}
          onClick={onClick}
        />
        <Button
          view="secondary"
          label="Сбросить фильтры"
          iconRight={IconClose}
          onClick={onResetClick}
        />
      </Layout>
    </Theme>
  );
};

export default MyManagerDashboard;
