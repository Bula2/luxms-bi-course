//@ts-nocheck
import React, { useState, useEffect } from "react";

import { KoobFiltersService } from "bi-internal/services";

const useManagerService = (data: any = [], names: any = []) => {
  const [filters, setFilters] = useState<any>();
  const [items, setItems] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isResetNeeded, setIsResetNeeded] = useState(true);

  useEffect(() => {
    const keys = Object.keys({ ...data[0] });

    setItems(() =>
      keys.map((keyItem: string) => {
        const [placeholder] = names.filter(
          (nameItem: any) => nameItem.id === keyItem
        );

        const uniqueItems = Array.from(
          new Set(data.map((item: any) => item[keyItem]))
        );

        const selectItems = uniqueItems.map((dataItem: any, index: number) => {
          return {
            key: keyItem,
            label: dataItem,
            id: index,
          };
        });

        return {
          placeholder: placeholder?.name,
          selectItems,
        };
      })
    );
    setIsResetNeeded(false);
  }, [data, names, isResetNeeded]);

  const handleChangeFilters = (value: any) => {
    setFilters({ ...filters, [value.key]: ["=", value.label] });
  };

  const applyFilters = () => {
    KoobFiltersService.getInstance().setFilters("", filters);
  };

  const resetFilters = () => {
    setFilters({});
    setIsResetNeeded(true);
    KoobFiltersService.getInstance().setFilters("", {
      org_level2: ["!="],
      org_level1: ["!="],
    });
  };

  const handleStopLoading = () => {
    setIsLoading(false);
  };

  return {
    filters,
    items: items,
    handleChangeFilters,
    applyFilters,
    resetFilters,
    isLoading,
    handleStopLoading,
    isResetNeeded,
  };
};

export default useServiceItself;
