import type { CabecalhoTransacao, GuiaConsulta, LoteInfo } from "./types";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function tag(name: string, value: string, indent: number): string {
  const pad = "    ".repeat(indent);
  return `${pad}<ans:${name}>${escapeXml(value)}</ans:${name}>`;
}

function formatValor(valor: string): string {
  const n = Number(valor.replace(",", "."));
  return Number.isFinite(n) ? n.toFixed(2) : "0.00";
}

function buildGuiaConsulta(guia: GuiaConsulta): string {
  const l: string[] = [];
  l.push(`        <ans:guiaConsulta>`);

  l.push(`            <ans:identificacaoGuia>`);
  l.push(tag("registroANS", guia.registroANS, 4));
  l.push(tag("numeroGuiaPrestador", guia.numeroGuiaPrestador, 4));
  l.push(`            </ans:identificacaoGuia>`);

  l.push(`            <ans:dadosBeneficiario>`);
  l.push(tag("numeroCarteira", guia.numeroCarteira, 4));
  l.push(tag("atendimentoRecemNascido", guia.atendimentoRecemNascido, 4));
  l.push(`            </ans:dadosBeneficiario>`);

  l.push(`            <ans:dadosContratadoExecutante>`);
  l.push(tag("codigoPrestadorNaOperadora", guia.codigoPrestadorNaOperadora, 4));
  l.push(tag("nomeContratado", guia.nomeContratado, 4));
  l.push(tag("CNES", guia.CNES, 4));
  l.push(`            </ans:dadosContratadoExecutante>`);

  l.push(`            <ans:profissionalExecutante>`);
  l.push(tag("nomeProfissional", guia.nomeProfissional, 4));
  l.push(tag("conselhoProfissional", guia.conselhoProfissional, 4));
  l.push(tag("numeroConselho", guia.numeroConselho, 4));
  l.push(tag("UF", guia.UF, 4));
  l.push(tag("CBO", guia.CBO, 4));
  l.push(`            </ans:profissionalExecutante>`);

  l.push(`            <ans:dadosAtendimento>`);
  l.push(tag("tipoAtendimento", guia.tipoAtendimento, 4));
  l.push(tag("dataAtendimento", guia.dataAtendimento, 4));
  l.push(`                <ans:procedimento>`);
  l.push(tag("codigoTabela", guia.codigoTabela, 5));
  l.push(tag("codigoProcedimento", guia.codigoProcedimento, 5));
  l.push(tag("valorProcedimento", formatValor(guia.valorProcedimento), 5));
  l.push(`                </ans:procedimento>`);
  l.push(tag("tipoConsulta", guia.tipoConsulta, 4));
  l.push(`            </ans:dadosAtendimento>`);

  l.push(`        </ans:guiaConsulta>`);
  return l.join("\n");
}

export function buildSoapEnvelope(
  cabecalho: CabecalhoTransacao,
  lote: LoteInfo,
  guias: GuiaConsulta[],
): string {
  const guiasXml = guias.map(buildGuiaConsulta).join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:soapenv="http://xmlsoap.org" xmlns:ans="http://ans.gov.br">
    <soapenv:Header>
        <ans:cabecalhoTransacao>
            <ans:identificacaoTransacao>
${tag("tipoTransacao", cabecalho.tipoTransacao, 4)}
${tag("sequencialTransacao", cabecalho.sequencialTransacao, 4)}
${tag("dataRegistroTransacao", cabecalho.dataRegistroTransacao, 4)}
${tag("horaRegistroTransacao", cabecalho.horaRegistroTransacao, 4)}
            </ans:identificacaoTransacao>
            <ans:origem>
                <ans:identificacaoPrestador>
${tag("codigoPrestadorNaOperadora", cabecalho.codigoPrestadorNaOperadora, 5)}
                </ans:identificacaoPrestador>
            </ans:origem>
            <ans:destino>
${tag("registroANS", cabecalho.registroANS, 4)}
            </ans:destino>
${tag("versaoPadrao", cabecalho.versaoPadrao, 3)}
        </ans:cabecalhoTransacao>
    </soapenv:Header>
    <soapenv:Body>
        <ans:envioLoteGuiasWS>
            <ans:loteGuias>
${tag("numeroLote", lote.numeroLote, 4)}
                <ans:guiasTISS>
${guiasXml}
                </ans:guiasTISS>
            </ans:loteGuias>
        </ans:envioLoteGuiasWS>
    </soapenv:Body>
</soapenv:Envelope>
`;
}
