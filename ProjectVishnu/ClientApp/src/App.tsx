import { BrowserRouter, Outlet } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Layout from "./components/Layout";
import AppRoutes from "./common/AppRoutes";
import { ChakraProvider } from "@chakra-ui/react";
import ThemeContextProvider from "./components/contexts/Theme/ThemeContextProvider";
import { ContaContextProvider } from "./components/contexts/Conta/ContaContextProvider";

function App() {
  const routes = AppRoutes()

  return (
    <BrowserRouter>
      <ThemeContextProvider>
        <ChakraProvider>
          <AnimatePresence exitBeforeEnter>
            <ContaContextProvider>
              <AppRoutes/>
            </ContaContextProvider> 
          </AnimatePresence>
        </ChakraProvider>
      </ThemeContextProvider>
    </BrowserRouter>
    
  );
}

export default App;
