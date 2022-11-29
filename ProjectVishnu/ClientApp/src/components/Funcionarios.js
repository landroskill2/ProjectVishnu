import React, {useEffect, useState } from 'react';
import { FilterBar } from './FilterBar';
import { Layout } from './Layout';

export function Funcionarios(){
    const [funcionarios, setFuncionarios] = useState(null)
    
    async function searchBarSubmit(searchString){
        const response = await fetch(`api/funcionarios?nome=${searchString}`)
          const data = await response.json()
          setFuncionarios(data)
    }

    async function searchByMercado(mercado){
        const response = await fetch(`api/funcionarios?mercado=${mercado}`)
        const data = await response.json()
        setFuncionarios(data)
    }

    let contents = funcionarios === null
        ? <p><em>Loading...</em></p>
        : renderFuncionariosTable(funcionarios);

    useEffect(() => {
        const populateFuncionariosData = async ()=> {
            const response = await fetch('api/funcionarios');
            const data = await response.json();
            setFuncionarios(data)
        }
        populateFuncionariosData()
        
    }, [])

    return (
      <Layout>
        <div>
          <h1 id="tabelLabel" >Funcionarios</h1>
          <p>This component demonstrates fetching data from the server.</p>
          {contents}
        </div>
      </Layout>
    );


    function renderFuncionariosTable(funcionarios) {
      return (
        <div>
          <FilterBar searchByMercado={searchByMercado} searchBarSubmit={searchBarSubmit}/>
          <table className='table table-striped' aria-labelledby="tabelLabel">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Nif</th>
                <th>Niss</th>
                <th>Mercado</th>
              </tr>
            </thead>
            <tbody>
              {funcionarios.map(funcionario =>
                <tr key={funcionario.nome}>
                  <td>{funcionario.nome}</td>
                  <td>{funcionario.nif}</td>
                  <td>{funcionario.niss}</td>
                  <td>{funcionario.mercado}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      );
    }
    

}

