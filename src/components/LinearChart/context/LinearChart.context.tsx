import {
  FC,
  PropsWithChildren,
  createContext,
  useContext,
  useState,
} from "react";

const LinearChartContext = createContext(null);

export const useLinearChartContext = () => {
  const context = useContext(LinearChartContext);

  if (!context) {
    throw new Error("Контекст LinearChartContext не найден");
  }

  return context;
};

export const LinearChartContextProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const [leftBlurWidth, setLeftBlurWidth] = useState(0);
  const [windowWidth, setWindowWidth] = useState(0);

  return (
    <LinearChartContext.Provider value={null}>
      {children}
    </LinearChartContext.Provider>
  );
};
