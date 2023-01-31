import {
  Button,
  Spinner,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { fetchFuncionarios } from "../../common/APICalls";
import IFuncionarioOutput from "../../common/Interfaces/Funcionario/IFuncionarioOutput";
import FilterBar from "../../components/FilterBar";

export default function Funcionarios() {
  const [funcionarios, setFuncionarios] = useState([]);
  const [mercado, setMercado] = useState(null);
  const [searchString, setSearchString] = useState(null);
  const router = useRouter();

  async function redirectToFuncionario(id: number) {
    router.push(`/funcionarios/${id}`);
  }

  async function redirectToFuncionarioCreation() {
    router.push("/funcionarios/create");
  }

  let contents = !funcionarios ? (
    <Spinner />
  ) : (
    renderFuncionariosTable(funcionarios)
  );

  useEffect(() => {
    const filters = Object.assign(
      {},
      mercado === null ? null : { mercado: mercado },
      searchString === null ? null : { nome: searchString }
    );

    const populateFuncionariosData = async () => {
      const response = await fetchFuncionarios(filters);
      const data = await response.json();
      setFuncionarios(data);
    };
    populateFuncionariosData();
  }, [mercado, searchString]);

  return (
    <div className="flex flex-col flex-1 h-full">
      <h1 className="text-center text-4xl mb-5">Funcionarios</h1>
      <FilterBar
        setMercado={setMercado}
        setSearchString={setSearchString}
        searchBar
      />
      {contents}
      <div id="button-container" className="flex justify-end mt-3">
        <Button
          onClick={() => redirectToFuncionarioCreation()}
          colorScheme="blue"
        >
          Criar
        </Button>
      </div>
    </div>
  );

  function renderFuncionariosTable(funcionarios: IFuncionarioOutput[]) {
    return (
      <div id="table-container" className="overflow-x-scroll flex-1">
        <Table className="table table-striped" aria-labelledby="tabelLabel">
          <Thead>
            <Tr className="data-table-header">
              <Th>Nome</Th>
              <Th>Nif</Th>
              <Th>Niss</Th>
              <Th>Mercado</Th>
            </Tr>
          </Thead>
          <Tbody>
            {funcionarios &&
              funcionarios.map((funcionario) => (
                <Tr
                  className="data-table-row"
                  onClick={() => redirectToFuncionario(funcionario.id)}
                  key={funcionario.nif}
                >
                  <Td>{funcionario.nome}</Td>
                  <Td>{funcionario.nif}</Td>
                  <Td>{funcionario.niss}</Td>
                  <Td className="capitalize">{funcionario.mercado}</Td>
                </Tr>
              ))}
          </Tbody>
        </Table>
      </div>
    );
  }
}
