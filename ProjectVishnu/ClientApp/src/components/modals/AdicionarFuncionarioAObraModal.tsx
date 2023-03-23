import { useEffect, useState } from "react";
import { AiOutlineUserAdd } from "react-icons/ai";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Spinner,
  Tooltip,
  useToast,
} from "@chakra-ui/react";
import FilterBar from "../FilterBar";
import IObraOutput from "../../common/Interfaces/Obra/IObraOutput";
import { AddFuncionarioToObra, fetchFuncionarios } from "../../common/APICalls";
import FuncionariosTable from "../tables/FuncionariosTable";

//TODO: tornar todo o código da tabela das obras universal de maneira a que isto não se repita aqui (e no index das obras)

export default function AdicionarFuncionarioAObraModal({
  obra,
}: {
  obra: IObraOutput;
}) {
  // State
  const [funcionarios, setFuncionarios] = useState(null);
  const [mercado, setMercado] = useState(obra.mercado);
  const [searchString, setSearchString] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [funcionariosIdList, setFuncionariosIdList] = useState<number[]>([]);
  const toast = useToast();
  // Effect
  useEffect(() => {
    const filters = Object.assign(
      {},
      { estado: "em-curso" },
      mercado === null ? null : { mercado: mercado },
      searchString === null ? null : { valor: searchString }
    );
    // Misc
    const populateFuncioariosData = async () => {
      const response = await fetchFuncionarios(filters);
      const data = await response.json();
      setFuncionarios(data);
    };
    populateFuncioariosData();
  }, [mercado, searchString]);
  function addObraToFunc() {
    const date = new Date();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    let today = `${year}-${month}-${day}`;
    console.log(obra);
    console.log(obra.codigoInterno);
    // TODO make this batch(able) or something
      funcionariosIdList.map((funcionarioId) => {
        AddFuncionarioToObra(funcionarioId, obra.codigoInterno, today).then((resp) => {
          if (!resp.ok) throw new Error("error");
          toast({
            title: 'Sucesso.',
            description: `Funcionario(s) adicionado(s) a obra com sucesso.`,
            status: 'success',
            duration: 3000,
            isClosable: true,
            position: "top"
          })
          setFuncionariosIdList([]);
          // close modal.
          onClose();
        }).catch(() => {
          toast({
            title: "Erro ao adicionar funcionarios.",
            description:
              "Ocorreu um erro ao adicionar funcionario(s). \n Por favor tente novamente.",
            status: "error",
            duration: 3000,
            isClosable: true,
            position: "top"
          });
        });
      });
  }
  const contents = !funcionarios ? (
    <Spinner />
  ) : (
    <FuncionariosTable
      funcionarios={funcionarios}
      selectable
      funcionariosIdList={funcionariosIdList}
      funcionariosIdListSetter={setFuncionariosIdList}
    />
  );
  return (
    <>
      <Tooltip label="Adicionar funcionario a obra" placement="top">
        <Button
          onClick={onOpen}
          colorScheme="blue"
          className="w-fit [&>*]:text-xl"
        >
          <AiOutlineUserAdd />
        </Button>
      </Tooltip>
      <Modal
        closeOnOverlayClick={false}
        isOpen={isOpen}
        size={"full"}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent className="dark:!bg-slate-800 dark:text-white">
          <ModalHeader>Escolha o/os funcionarios</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FilterBar
              mercado={mercado}
              setMercado={setMercado}
              setSearchString={setSearchString}
              searchBar
            />
            {contents}
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              isDisabled={funcionariosIdList.length < 1}
              onClick={addObraToFunc}
            >
              Guardar
            </Button>
            <Button onClick={onClose} className="text-slate-800">
              Cancelar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
