const getXRatio = (width, count) => {
  return (width / count).toFixed(1);
};

const getYRatio = (height, min, max) => {
  return (height / (max - min)).toFixed(1);
};

const getChartMin = (values) => {
  return Math.min(...values);
};

const getChartMax = (values) => {
  return Math.max(...values);
};

const getChartsMin = (charts) => {
  return Math.min(...charts.map((chart) => getChartMin(chart.values)));
};

const getChartsMax = (charts) => {
  return Math.max(...charts.map((chart) => getChartMax(chart.values)));
};

const getBarDivision = (height, barsCount) => {
  return (height / barsCount).toFixed(1);
};

const getBarDivisionLabel = (min, max, barsCount) => {
  return ((max - min) / barsCount).toFixed();
};

const getParsedInitialData = (initialData) => {
  const parsedData = {
    abscissa: {},
    axisOfOrdinates: [],
  };

  const { columns, types, names, colors } = initialData;
  for (let i = 0; i < columns.length; i += 1) {
    const [functionName, ...values] = columns[i];
    if (functionName === "x") {
      const mappedValues = values.map((date) =>
        new Date(date).toLocaleDateString("en", {
          month: "short",
          day: "numeric",
        })
      );

      parsedData.abscissa = {
        functionName,
        values: mappedValues,
      };
    } else {
      const type = types[functionName];
      const label = names[functionName];
      const color = colors[functionName];

      parsedData.axisOfOrdinates.push({
        functionName,
        values,
        type,
        label,
        color,
      });
    }
  }

  return parsedData;
};

export {
  getXRatio,
  getYRatio,
  getChartMin,
  getChartMax,
  getChartsMin,
  getChartsMax,
  getBarDivision,
  getBarDivisionLabel,
  getParsedInitialData,
};
