import { createGlobalStyle } from 'styled-components';
import { $mainBackgroundColor } from './veriables';

export const GlobalStyles = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: 'PT Sans', sans-serif;
    background-color: ${$mainBackgroundColor};
  }

  html, body, #root {
    scroll-behavior: smooth;
  }
  
  #root {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    margin: 0;
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  button {
    border: none;
    background: none;
    cursor: pointer;
    font-family: inherit;
  }
`;