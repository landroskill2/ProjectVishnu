
import IFolhaDePontoInput from "./Interfaces/FolhaDePonto/IFolhaDePontoInput";
import IFuncionarioInput from "./Interfaces/Funcionario/IFuncionarioInput";
import IObraOutput from "./Interfaces/Obra/IObraOutput";

// Tipos de documento
export async function fetchTiposDocumento(){
  var path = "/api/tiposdoc"
  return fetch(path)
}
// Mercados
export async function fetchMercados() {
  var path = "/api/mercados";
  return fetch(path);
}
// Categorias Profissionais
export async function fetchCategoriasProfissionais() {
  var path = "/api/categorias-profissionais";
  return fetch(path);
}
// Funcionario
export async function fetchFuncionarios(filters: Record<string, string>) {
  var path = "/api/funcionarios";
  path = addFiltersToQuery(path, filters);
  return fetch(path);
}
export async function fetchFuncionario(id: string) {
  const path = `/api/funcionarios/${id}`;
  return fetch(path);
}

export async function CreateFuncionario(funcionario: IFuncionarioInput) {
  const path = "/api/funcionarios";
  return fetch(path, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(funcionario),
  });
}

export async function AddFuncionarioToObra(funcID : number, codigoInterno : string, date: string){
  const path = `/api/funcionarios/${funcID}`;
  return fetch(path, {
    method: 'POST',
    headers: {
      "Content-Type" : "application/json"
    },
    body: JSON.stringify({
      codigoInterno : codigoInterno,
      date : date
    })
  })
}

export async function GetFuncionariosValidityWarningCount(){
  const path = "/api/funcionarios/validity/count"
  return fetch(path);
}

export async function GetFuncionariosValidityWarningList(){
  const path = "/api/funcionarios/validity/list"
  return fetch(path)
}

// Obra
export async function CreateObra(obra: IObraOutput) {
  const path = "/api/obras";
  return fetch(path, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(obra),
  });
}
export async function fetchObras(filters: Record<string, string>) {
  var path = "/api/obras";
  path = addFiltersToQuery(path, filters);
  return fetch(path);
}
export async function fetchObra(codigo: string) {
  const path = `/api/obras/${codigo}`;
  return fetch(path);
}
// Folha de ponto
export async function createFolhaDePonto(
  mes: string,
  ano: string,
  codigo: string
) {
  const path = `/api/obras/${codigo}/folha-de-ponto`;
  return fetch(path, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      mes: mes,
      ano: ano,
    }),
  });
}
export async function fetchFolhaDePontoByObra(
  codigo: string,
  mes: string,
  ano: string
) {
  const path = `/api/obras/${codigo}/folha-de-ponto/${ano}-${mes}`;
  return fetch(path);
}
export async function fetchFolhaDePontoByMercado(
  mercado: string,
  mes: string,
  ano: string
) {
  const path = `/api/folha-de-ponto/${mercado}/${ano}-${mes}`;
  return fetch(path);
}
export async function submitFolhaDePontoValues(
  codigo: string,
  mes: string,
  ano: string,
  values: IFolhaDePontoInput
) {
  const path = `/api/obras/${codigo}/folha-de-ponto/${ano}-${mes}`;

  console.log(values);
  return fetch(path, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      values : values.values,
    }),
  });
}

export async function fetchFolhaDePontoAllByobra(codigo: string) {
  const path = `/api/obras/${codigo}/folha-de-ponto`;
  return fetch(path);
}

export async function fetchFolhaDePontoAllByMercado(mercado: string) {
  const path = `/api/folha-de-ponto/${mercado ?? ''}`;
  console.log("pa: " + path);
  return fetch(path);
}

// Filtes
function addFiltersToQuery(path: string, filters: Record<string, String>) {
  var size = Object.keys(filters).length;
  if (size > 0) {
    var i = 1;
    path = path.concat("?");
    Object.keys(filters).forEach((key) => {
      var hasPrev = false;
      if (filters[key] != null) {
        path = path.concat(`${key}=${filters[key]}`);
        hasPrev = true;
      }
      if (i < size) path = path.concat("&");
      i++;
    });
  }
  return path;
}
