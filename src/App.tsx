import { useState } from "react";
import "./App.css";
import { CabecalhoForm } from "./components/CabecalhoForm";
import { GuiaConsultaCard } from "./components/GuiaConsultaCard";
import { XmlPreview } from "./components/XmlPreview";
import { buildSoapEnvelope } from "./xmlBuilder";
import { novoGuiaVazia, type CabecalhoTransacao, type GuiaConsulta, type LoteInfo } from "./types";
import { mapaErrosGuia, validarTudo } from "./validation";

function hojeISO(): string {
  return new Date().toISOString().slice(0, 10);
}

function agoraISO(): string {
  return new Date().toTimeString().slice(0, 8);
}

function gerarSequencial(): string {
  const now = new Date();
  const carimbo = now.toISOString().replace(/[-:TZ.]/g, "").slice(0, 14);
  const aleatorio = Math.floor(Math.random() * 90 + 10);
  return `${carimbo}${aleatorio}`;
}

function cabecalhoInicial(): CabecalhoTransacao {
  return {
    tipoTransacao: "ENVIO_LOTE_GUIAS",
    sequencialTransacao: gerarSequencial(),
    dataRegistroTransacao: hojeISO(),
    horaRegistroTransacao: agoraISO(),
    codigoPrestadorNaOperadora: "",
    registroANS: "417386",
    versaoPadrao: "4.01.00",
  };
}

function App() {
  const [cabecalho, setCabecalho] = useState<CabecalhoTransacao>(cabecalhoInicial);
  const [lote, setLote] = useState<LoteInfo>({ numeroLote: "" });
  const [guias, setGuias] = useState<GuiaConsulta[]>(() => [
    novoGuiaVazia({
      registroANS: "417386",
      codigoPrestadorNaOperadora: "",
      dataAtendimento: hojeISO(),
    }),
  ]);
  const [xmlGerado, setXmlGerado] = useState<string | null>(null);
  const [errosGerais, setErrosGerais] = useState<string[]>([]);
  const [validado, setValidado] = useState(false);

  const patchCabecalho = (patch: Partial<CabecalhoTransacao>) =>
    setCabecalho((prev) => ({ ...prev, ...patch }));

  const patchLote = (patch: Partial<LoteInfo>) =>
    setLote((prev) => ({ ...prev, ...patch }));

  const patchGuia = (id: string, patch: Partial<GuiaConsulta>) =>
    setGuias((prev) => prev.map((g) => (g.id === id ? { ...g, ...patch } : g)));

  const adicionarGuia = () =>
    setGuias((prev) => [
      ...prev,
      novoGuiaVazia({
        registroANS: cabecalho.registroANS,
        codigoPrestadorNaOperadora: cabecalho.codigoPrestadorNaOperadora,
        dataAtendimento: hojeISO(),
      }),
    ]);

  const removerGuia = (id: string) =>
    setGuias((prev) => (prev.length > 1 ? prev.filter((g) => g.id !== id) : prev));

  const validarEGerar = () => {
    setValidado(true);
    const erros = validarTudo(cabecalho, lote, guias);
    if (erros.length > 0) {
      setErrosGerais(erros.map((e) => e.mensagem));
      setXmlGerado(null);
      return;
    }
    setErrosGerais([]);
    setXmlGerado(buildSoapEnvelope(cabecalho, lote, guias));
  };

  return (
    <div className="page">
      <header className="page-header">
        <span className="page-eyebrow">Protótipo navegável</span>
        <h1>Guias TISS — Envio de Lote (SOAP / BC Saúde)</h1>
        <p>
          Preencha os dados abaixo para gerar a mensagem SOAP de envio de lote
          de guias no padrão TISS, pronta para ser enviada ao Web Service do
          BC Saúde.
        </p>
      </header>

      <main className="page-content">
        <div className="form-column">
          <CabecalhoForm
            cabecalho={cabecalho}
            lote={lote}
            onChangeCabecalho={patchCabecalho}
            onChangeLote={patchLote}
            onGerarSequencial={() =>
              patchCabecalho({ sequencialTransacao: gerarSequencial() })
            }
          />

          <div className="guias-header">
            <h2>Guias de consulta do lote</h2>
            <button type="button" className="btn-secondary" onClick={adicionarGuia}>
              + Adicionar guia
            </button>
          </div>

          {guias.map((guia, i) => (
            <GuiaConsultaCard
              key={guia.id}
              guia={guia}
              indice={i}
              totalGuias={guias.length}
              onChange={(patch) => patchGuia(guia.id, patch)}
              onRemover={() => removerGuia(guia.id)}
              errosPorCampo={validado ? mapaErrosGuia(guia) : {}}
            />
          ))}

          <button type="button" className="btn-primary btn-generate" onClick={validarEGerar}>
            Validar e gerar XML
          </button>
        </div>

        <div className="preview-column">
          <XmlPreview xml={xmlGerado} errors={errosGerais} />
        </div>
      </main>
    </div>
  );
}

export default App;
