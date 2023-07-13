import axios from "axios";
import { AppConfig } from "bi-internal/core";
import { IKoobFiltersModel } from "bi-internal/services/koob";

export const filtersConversion = (
  myFilters: object | any,
  filtersVizelCoobKontrol: IKoobFiltersModel | undefined
) => {
  const currentFilters: object | any = {};
  Object.keys(myFilters).forEach((key) => {
    myFilters[key] === true
      ? (currentFilters[key] = filtersVizelCoobKontrol?.filters[key])
      : (currentFilters[key] = myFilters[key]);
  });
  return currentFilters;
};

export const rangeFilterCondition = (
  cellValue: string,
  filterValue: {
    min: string;
    max: string;
  }
) => {
  const { min, max } = filterValue;

  if (!min && !max) {
    return true;
  }

  if (!min) {
    return cellValue <= max;
  } else if (!max) {
    return cellValue >= min;
  } else {
    return cellValue >= min && cellValue <= max;
  }
};

interface IData {
  filters: string[];
  columnsNew: string[];
  koob: string;
  distinct?: string[];
  sort?: any;
  limit?: number;
  offset?: any;
  options?: any;
  subtotals?: string;
}

interface IProps {
  cfg: any;
  data: IData;
  callback: () => void;
}

export const getKoobDataByCfg = async (
  cfg: any,
  data: any,
  callback: any
): Promise<IProps | undefined> => {
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
      cancelToken: cfg?.cancelToken,
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