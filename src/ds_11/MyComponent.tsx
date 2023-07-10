// @ts-nocheck
import React, { useEffect, useRef, useState } from "react";
import * as echarts from "echarts";
import { GeometryObserver } from "bi-internal/face";
import "./MyComponent.scss";

const MyComponent = (props) => {
  const { cfg, subspace, dp } = props;
  const [data, setData] = useState([]);
  const containerRef = useRef(null);
  let chart = null;
  let options = {};

  const onResize = () => {
    if (chart) {
      chart.resize();
    }
  };

  const onChartClick = (params) => {
    if (cfg.getRaw().hasOwnProperty("onClickDataPoint")) {
      const vcpv = {
        m: undefined,
        l: undefined,
        p: undefined,
        z: params.data.z,
        y: params.data.y,
        x: params.data.x,
        v: params.value,
      };
      cfg.controller.handleVCPClick(params.event, vcpv);
    }
  };

  const renderChart = (rawData) => {
    if (containerRef?.current && rawData?.length) {
      if (!chart) {
        chart = echarts.init(containerRef.current, null, { renderer: "svg" });
        GeometryObserver.getInstance().addSubscription(
          containerRef.current,
          onResize
        );
      }
      options = {
        title: {
          show: false,
        },
        xAxis: {
          type: "category",
          data: subspace.xs.map((x) => x.title),
        },
        yAxis: {
          type: "value",
        },
        legend: {
          show: true,
          data: subspace.ys.map((y, yIndex) => ({
            name: y.title,
            icon: "circle",
            itemStyle: {
              color: cfg.getColor(y, null, yIndex),
            },
          })),
        },
        tooltip: {
          show: true,
          appendToBody: true,
        },
        series: subspace.ys.map((y, yIndex) => ({
          name: y.title,
          type: "bar",
          data: subspace.xs.map((x, xIndex) => ({
            name: x.title,
            itemStyle: {
              color: cfg.getColor(y, null, yIndex),
            },
            x,
            y,
            z: subspace.zs[0],
            value: rawData[yIndex][xIndex],
          })),
        })),
      };
      chart.setOption(options);
      chart.resize();
      chart.on("click", "series", onChartClick);
    }
  };

  useEffect(() => {
    dp.getMatrixYX(subspace).then((rawData) => {
      renderChart(rawData);
    });
    return () => {
      GeometryObserver.getInstance().removeSubscription(
        containerRef.current,
        onResize
      );
    };
  }, []);

  return (
    <div className="MyComponent">
      <div className="MyComponent__graphic" ref={containerRef}></div>
    </div>
  );
};

export default MyComponent;
