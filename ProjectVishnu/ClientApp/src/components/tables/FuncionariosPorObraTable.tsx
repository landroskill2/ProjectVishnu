import { Table, Thead, Tr, Th, Tbody, Td } from "@chakra-ui/react";
import IFuncionarioObraOutputModel from "../../common/Interfaces/Funcionario/IFuncionarioObraOutputModel";
import RemoverFuncionariosDeObraModal from "../modals/RemoverFuncionariosDeObraModal";
import SemDadosPlaceHolder from "../SemDadosPlaceHolder";

interface Props {
  funcionarios: IFuncionarioObraOutputModel[];
  callback: () => void;
}

export default function FuncionariosPorObraTable({
  funcionarios,
  callback,
}: Props) {
  return (
    <div id="table-container" className="overflow-x-scroll flex-1">
      {funcionarios && funcionarios.length > 0 ? (
        <Table className="table table-striped" aria-labelledby="tabelLabel">
          <Thead>
            <Tr className="data-table-header">
              <Th>Nome</Th>
              <Th>Nif</Th>
              <Th>Categoria profissional</Th>
              <Th>Data de começo</Th>
              <Th>Data de fim</Th>
              <Th>Remover</Th>
            </Tr>
          </Thead>
          <Tbody>
            {funcionarios.map((funcionario) => (
              <Tr className="data-table-row" key={funcionario.funcionario.nif}>
                <Td>{funcionario.funcionario.nome}</Td>

                <Td>{funcionario.funcionario.nif}</Td>

                <Td>{funcionario.funcionario.catprof}</Td>

                <Td>{funcionario.dataInicio}</Td>

                <Td>{funcionario.dataFim ?? "N/A"}</Td>
                <Td>
                  <RemoverFuncionariosDeObraModal
                    funcionario={funcionario.funcionario}
                    callback={callback}
                  />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      ) : (
        <SemDadosPlaceHolder />
      )}
    </div>
  );
}
