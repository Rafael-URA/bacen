export interface CabecalhoTransacao {
  tipoTransacao: string;
  sequencialTransacao: string;
  dataRegistroTransacao: string;
  horaRegistroTransacao: string;
  codigoPrestadorNaOperadora: string;
  registroANS: string;
  versaoPadrao: string;
}

export interface LoteInfo {
  numeroLote: string;
}

export interface GuiaConsulta {
  id: string;
  registroANS: string;
  numeroGuiaPrestador: string;
  numeroCarteira: string;
  atendimentoRecemNascido: "S" | "N";
  codigoPrestadorNaOperadora: string;
  nomeContratado: string;
  CNES: string;
  nomeProfissional: string;
  conselhoProfissional: string;
  numeroConselho: string;
  UF: string;
  CBO: string;
  tipoAtendimento: string;
  dataAtendimento: string;
  codigoTabela: string;
  codigoProcedimento: string;
  valorProcedimento: string;
  tipoConsulta: string;
}

export const CONSELHOS_PROFISSIONAIS = [
  { codigo: "1", label: "1 - CRM (Medicina)" },
  { codigo: "2", label: "2 - CRO (Odontologia)" },
  { codigo: "3", label: "3 - CREFONO (Fonoaudiologia)" },
  { codigo: "4", label: "4 - CRF (Farmácia)" },
  { codigo: "5", label: "5 - COREN (Enfermagem)" },
  { codigo: "6", label: "6 - CREFITO (Fisioterapia)" },
  { codigo: "7", label: "7 - CRP (Psicologia)" },
  { codigo: "8", label: "8 - CRN (Nutrição)" },
];

export const TIPOS_ATENDIMENTO = [
  { codigo: "01", label: "01 - Remoção" },
  { codigo: "02", label: "02 - Pequena cirurgia" },
  { codigo: "03", label: "03 - Terapias" },
  { codigo: "04", label: "04 - Consulta" },
  { codigo: "05", label: "05 - Exames" },
  { codigo: "06", label: "06 - Atendimento domiciliar" },
  { codigo: "07", label: "07 - Ocupacional" },
  { codigo: "08", label: "08 - Urgência/Emergência" },
  { codigo: "09", label: "09 - Internação" },
  { codigo: "10", label: "10 - Quimioterapia" },
  { codigo: "11", label: "11 - Radioterapia" },
  { codigo: "12", label: "12 - Órtese/Prótese" },
  { codigo: "13", label: "13 - Home care" },
  { codigo: "14", label: "14 - Psicoterapia" },
];

export const TIPOS_CONSULTA = [
  { codigo: "1", label: "1 - Primeira consulta" },
  { codigo: "2", label: "2 - Consulta em retorno" },
  { codigo: "3", label: "3 - Segunda opinião" },
  { codigo: "4", label: "4 - Pré-natal" },
];

export const CODIGOS_TABELA = [
  { codigo: "00", label: "00 - Tabela própria" },
  { codigo: "18", label: "18 - Tabela AMB 90" },
  { codigo: "19", label: "19 - Tabela CBHPM" },
  { codigo: "20", label: "20 - Tabela própria (Odonto)" },
  { codigo: "22", label: "22 - Tabela TUSS (procedimentos médicos)" },
];

export const UFS = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS",
  "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC",
  "SP", "SE", "TO",
];

export function novoGuiaVazia(base: {
  registroANS: string;
  codigoPrestadorNaOperadora: string;
  dataAtendimento: string;
}): GuiaConsulta {
  return {
    id: crypto.randomUUID(),
    registroANS: base.registroANS,
    numeroGuiaPrestador: "",
    numeroCarteira: "",
    atendimentoRecemNascido: "N",
    codigoPrestadorNaOperadora: base.codigoPrestadorNaOperadora,
    nomeContratado: "",
    CNES: "",
    nomeProfissional: "",
    conselhoProfissional: "1",
    numeroConselho: "",
    UF: "",
    CBO: "",
    tipoAtendimento: "04",
    dataAtendimento: base.dataAtendimento,
    codigoTabela: "22",
    codigoProcedimento: "10101012",
    valorProcedimento: "",
    tipoConsulta: "1",
  };
}
