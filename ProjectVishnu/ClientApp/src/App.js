import React, { Component } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './custom.css';
import { Funcionarios } from "./pages/Funcionarios";
import { Funcionario } from "./pages/Funcionario";
import { Obras } from "./pages/Obras";
import { Obra } from "./pages/Obra";
import { Home } from "./pages/Home";
import { FolhaDePonto } from './pages/FolhaDePonto';
import { FuncionarioCreation } from './pages/FuncionarioCreation';

const router = createBrowserRouter([
    {
      path: '/',
      element: <Home />
    },
    {
      path: '/funcionarios',
      element: <Funcionarios />
      },
    {
      path: '/obras',
      element: <Obras />
    },
    {
      path: '/funcionarios/:id',
      element: <Funcionario />
    },
    {
      path: '/funcionarios/create',
      element: <FuncionarioCreation/>
    },
    {
      path: '/obras/:codigo',
      element: <Obra />
    },
    {
      path: '/obras/:codigo/folha-de-ponto/:data',
      element: <FolhaDePonto />
    },
    {
      path: '/folha-de-ponto/:mercado/:data'
    }
])

export function App() {

  return(
    <RouterProvider router = {router}>
      
    </RouterProvider>
  )
}

