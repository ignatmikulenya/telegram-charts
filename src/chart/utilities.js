const getMinValue = (values) => {
  return Math.min(...values);
};

const getMaxValue = (values) => {
  return Math.max(...values);
};

const getDelta = (min, max, barsCount) => {
  return (max + min) / barsCount;
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

export { getMinValue, getMaxValue, getDelta, getParsedInitialData };
