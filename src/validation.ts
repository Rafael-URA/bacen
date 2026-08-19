import type { CabecalhoTransacao, GuiaConsulta, LoteInfo } from "./types";

export interface ValidationError {
  campo: string;
  mensagem: string;
}

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const TIME_RE = /^\d{2}:\d{2}:\d{2}$/;

function required(
  value: string,
  campo: string,
  errors: ValidationError[],
): void {
  if (!value || !value.trim()) {
    errors.push({ campo, mensagem: `${campo} é obrigatório.` });
  }
}

export function validarCabecalho(
  cabecalho: CabecalhoTransacao,
  lote: LoteInfo,
): ValidationError[] {
  const errors: ValidationError[] = [];
  required(cabecalho.sequencialTransacao, "Sequencial da transação", errors);
  required(cabecalho.codigoPrestadorNaOperadora, "Código do prestador (origem)", errors);
  required(cabecalho.registroANS, "Registro ANS (destino)", errors);
  required(cabecalho.versaoPadrao, "Versão do padrão TISS", errors);
  required(lote.numeroLote, "Número do lote", errors);

  if (cabecalho.dataRegistroTransacao && !DATE_RE.test(cabecalho.dataRegistroTransacao)) {
    errors.push({ campo: "Data de registro", mensagem: "Data de registro deve estar no formato AAAA-MM-DD." });
  }
  if (cabecalho.horaRegistroTransacao && !TIME_RE.test(cabecalho.horaRegistroTransacao)) {
    errors.push({ campo: "Hora de registro", mensagem: "Hora de registro deve estar no formato HH:MM:SS." });
  }
  return errors;
}

export function validarCamposGuia(guia: GuiaConsulta): ValidationError[] {
  const errors: ValidationError[] = [];

  required(guia.numeroGuiaPrestador, "Número da guia (prestador)", errors);
  required(guia.numeroCarteira, "Número da carteira do beneficiário", errors);
  required(guia.codigoPrestadorNaOperadora, "Código do prestador executante", errors);
  required(guia.nomeContratado, "Nome do contratado", errors);
  required(guia.CNES, "CNES", errors);
  required(guia.nomeProfissional, "Nome do profissional", errors);
  required(guia.numeroConselho, "Número do conselho", errors);
  required(guia.UF, "UF do conselho", errors);
  required(guia.CBO, "CBO", errors);
  required(guia.codigoProcedimento, "Código do procedimento (TUSS)", errors);
  required(guia.valorProcedimento, "Valor do procedimento", errors);

  if (guia.dataAtendimento && !DATE_RE.test(guia.dataAtendimento)) {
    errors.push({ campo: "Data do atendimento", mensagem: "Data do atendimento deve estar no formato AAAA-MM-DD." });
  }
  if (guia.valorProcedimento) {
    const n = Number(guia.valorProcedimento.replace(",", "."));
    if (!Number.isFinite(n) || n <= 0) {
      errors.push({ campo: "Valor do procedimento", mensagem: "Valor do procedimento deve ser um número maior que zero." });
    }
  }
  if (guia.CNES && !/^\d{7}$/.test(guia.CNES)) {
    errors.push({ campo: "CNES", mensagem: "CNES deve conter 7 dígitos numéricos." });
  }

  return errors;
}

export function validarGuia(guia: GuiaConsulta, indice: number): ValidationError[] {
  const prefixo = `Guia ${indice + 1}`;
  return validarCamposGuia(guia).map((e) => ({
    campo: `${prefixo} — ${e.campo}`,
    mensagem: `${prefixo} — ${e.mensagem}`,
  }));
}

export function mapaErrosGuia(guia: GuiaConsulta): Record<string, string> {
  const mapa: Record<string, string> = {};
  for (const e of validarCamposGuia(guia)) {
    mapa[e.campo] = e.mensagem;
  }
  return mapa;
}

export function validarTudo(
  cabecalho: CabecalhoTransacao,
  lote: LoteInfo,
  guias: GuiaConsulta[],
): ValidationError[] {
  const errors = [...validarCabecalho(cabecalho, lote)];
  if (guias.length === 0) {
    errors.push({ campo: "Guias", mensagem: "Adicione ao menos uma guia de consulta ao lote." });
  }
  guias.forEach((guia, i) => errors.push(...validarGuia(guia, i)));
  return errors;
}
