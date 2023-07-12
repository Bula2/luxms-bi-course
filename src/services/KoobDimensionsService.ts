// @ts-nocheck
import { BaseService } from "bi-internal/core";
import { KoobFiltersService, KoobDataService } from "bi-internal/services";
const { koobDataRequest3 } = KoobDataService;

export interface IMyDimension {
  id: string | number;
  title: string;
  type: string;
  values: string[] | number[];
}

export interface IKoobDimensionsModel {
  loading: boolean;
  error: string;
  dimensions: IMyDimension[];
  filters: {};
}

export class KoobDimensionsService extends BaseService<IKoobDimensionsModel> {
  private koobId: string;
  private koobDimensions: string[];
  constructor(id: string, dimensions: string[]) {
    super({
      loading: true,
      error: "",
      dimensions: [],
      filters: {},
    });
    this.koobId = id;
    this.koobDimensions = dimensions;
    const koobIdSplitted = id.split(".");
    fetch(
      `/api/db/koob.dimensions/.filter(source_ident='${koobIdSplitted[0]}'&&cube_name='${koobIdSplitted[1]}')`
    )
      .then((res) => res.json())
      .then((dimensionsList) => {
        console.log(dimensionsList);
        const selectedDimensions = dimensionsList?.filter((dimensionCfg) =>
          dimensions.includes(dimensionCfg.sql_query)
        );
        Promise.all(
          selectedDimensions.map((dimensionCfg) =>
            koobDataRequest3(
              this.koobId,
              [`${dimensionCfg.sql_query}:value`],
              [],
              {},
              {},
              `values_for_${dimensionCfg.sql_query}`
            )
          )
        ).then((dimensionsValues) => {
          let dimensionsWithValues: IMyDimension[] = [];
          selectedDimensions.map((dimCfg, dimIndex) => {
            dimensionsWithValues = [
              ...dimensionsWithValues,
              {
                id: dimCfg.sql_query,
                title: dimCfg.name,
                type: dimCfg.type,
                values: dimensionsValues[dimIndex].map((el) => el.value),
              },
            ];
          });
          console.log(dimensionsValues, dimensionsWithValues);
          this._updateWithData({
            loading: false,
            dimensions: dimensionsWithValues,
          });
        });
      });
  }
  public setFilters = (filters) => {
    KoobFiltersService.getInstance().setFilters("", filters);
    this._updateWithData({ filters: { ...this._model.filters, filters } });
  };
  protected _dispose() {
    super._dispose();
  }
  public static createInstance(
    id: string,
    dimensions: string[]
  ): KoobDimensionsService {
    if (!window["__koobDimensionsService"]) {
      window["__koobDimensionsService"] = {};
    }
    if (!window["__koobDimensionsService"].hasOwnProperty(id)) {
      window["__koobDimensionsService"][id] = new KoobDimensionsService(
        id,
        dimensions
      );
    }
    return window["__koobDimensionsService"][String(id)];
  }
}
