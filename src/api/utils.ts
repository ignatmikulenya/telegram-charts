import { ChartResponse, Chart } from "./types";

export const parseChartsResponse = (response: ChartResponse) => {
  const chart: Chart = {
    abscissa: {
      functionName: "",
      values: [],
    },
    axisOfOrdinates: [],
  };

  const { columns, types, names, colors } = response;

  for (let i = 0; i < columns.length; i++) {
    const [functionName, ...values] = columns[i];

    if (functionName === "x") {
      const formattedDates = values.map((date) =>
        new Date(date).toLocaleDateString("en", {
          month: "short",
          day: "numeric",
        })
      );

      chart.abscissa = {
        functionName,
        values: formattedDates,
      };
    } else {
      const type = types[functionName];
      const label = names[functionName];
      const color = colors[functionName];

      if (type && label && color) {
        chart.axisOfOrdinates.push({
          functionName,
          values,
          type,
          label,
          color,
        });
      }
    }
  }

  return chart;
};
