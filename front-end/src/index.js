import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { ChakraProvider, extendTheme } from '@chakra-ui/react'

const rootElement = document.getElementById("root");
const darkMode = {
  config: {
    initialColorMode: "dark"
  }
}

ReactDOM.render(
  <ChakraProvider>
    <App />
  </ChakraProvider>,
  rootElement
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals  