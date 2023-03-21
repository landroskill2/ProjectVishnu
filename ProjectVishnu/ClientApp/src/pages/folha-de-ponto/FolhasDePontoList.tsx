import { Spinner, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";

import { useEffect, useState } from "react";
import { fetchFolhaDePontoAllByMercado } from "../../common/APICalls";
import FilterBar from "../../components/FilterBar";
import IFolhaDePontoOutput from "../../common/Interfaces/FolhaDePonto/IFolhaDePontoOutput";
import IFolhaDePontoInfoModel from "../../common/Interfaces/FolhaDePonto/IFolhaDePontoInfoModel";
import { useNavigate } from "react-router-dom";
import SemDadosRow from "../../components/SemDadosRow";

export default function FolhasDePonto() {
  const [folhasDePonto, setFolhasDePonto] = useState();
  const [mercado, setMercado] = useState<string | null>("portugal");
  const navigate = useNavigate();

  async function redirectToFolhaDePonto(
    mes: string,
    ano: string,
    mercado: string
  ) {
    navigate(`/folha-de-ponto/${mercado}/${ano}-${mes}`);
  }

  let contents =
    !folhasDePonto ? (
      <Spinner size="xl" className="m-auto"/>
    ) : (
      renderFolhasDePontoTable(folhasDePonto)
    );

  useEffect(() => {
    const populateFolhasDePontoData = async () => {
      const response = await fetchFolhaDePontoAllByMercado(mercado!);
      const data = await response.json();
      setFolhasDePonto(data);
    };
    populateFolhasDePontoData();
  }, [mercado]);

  return (
    <div className="flex flex-col flex-1 h-full">
      <h1 className="text-center text-4xl mb-5">Folhas De Ponto</h1>
      <FilterBar
        searchBar
        setMercado={setMercado}
        setSearchString={undefined}
      />
      {contents}
    </div>
  );

  // TODO: folhasDePonto type
  function renderFolhasDePontoTable(folhasDePonto: IFolhaDePontoInfoModel[]) {
    return (
      <div id="table-container" className="overflow-x-scroll flex-1">
        <Table className="" aria-labelledby="tabelLabel">
          <Thead>
            <Tr className="data-table-header">
              <Th>Mes</Th>
              <Th>Ano</Th>
              <Th>Mercado</Th>
            </Tr>
          </Thead>
          <Tbody>
            {folhasDePonto && folhasDePonto.length > 0 ?
              folhasDePonto.map((folhaDePonto, index) => (
              <Tr
                className="data-table-row"
                key={index}
                onClick={() =>
                  redirectToFolhaDePonto(
                    folhaDePonto.mes,
                    folhaDePonto.ano,
                    mercado!
                  )
                }
              >
                <Td>{folhaDePonto.mes}</Td>
                <Td>{folhaDePonto.ano}</Td>
                <Td className="capitalize">{mercado}</Td>
              </Tr>
            )): <SemDadosRow />}
          </Tbody>
        </Table>
      </div>
    );
  }
}