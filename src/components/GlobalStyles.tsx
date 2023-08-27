import { createGlobalStyle } from "styled-components";

export const GlobalStyles = createGlobalStyle`
    body {
        margin: 0;

        font-family: 'Roboto', sans-serif;
        font-size: 16px;
    }

    p {
        margin: 0;
    }

    * {
        box-sizing: border-box;
    }
`;
