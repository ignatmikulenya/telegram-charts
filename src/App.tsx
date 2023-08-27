import { linearCharts } from "api/constants";
import { LinearChart } from "components/LinearChart/LinearChart";
import { styled } from "styled-components";

const firstChart = linearCharts[0];

const StyledLayout = styled.div`
  padding: 24px 16px;
`;

export const App = () => {
  return (
    <StyledLayout>
      <LinearChart title="Followers" chart={firstChart} />
    </StyledLayout>
  );
};
