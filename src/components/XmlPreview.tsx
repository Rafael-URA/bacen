import { useState } from "react";

interface Props {
  xml: string | null;
  errors: string[];
}

export function XmlPreview({ xml, errors }: Props) {
  const [copiado, setCopiado] = useState(false);
  const [endpoint, setEndpoint] = useState("");
  const [soapAction, setSoapAction] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [resultadoEnvio, setResultadoEnvio] = useState<string | null>(null);

  const copiar = async () => {
    if (!xml) return;
    await navigator.clipboard.writeText(xml);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  const baixar = () => {
    if (!xml) return;
    const blob = new Blob([xml], { type: "application/xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `guia-tiss-${Date.now()}.xml`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const enviar = async () => {
    if (!xml || !endpoint) return;
    setEnviando(true);
    setResultadoEnvio(null);
    try {
      const resp = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "text/xml; charset=utf-8",
          ...(soapAction ? { SOAPAction: soapAction } : {}),
        },
        body: xml,
      });
      const texto = await resp.text();
      setResultadoEnvio(`HTTP ${resp.status} ${resp.statusText}\n\n${texto}`);
    } catch (err) {
      setResultadoEnvio(
        `Falha ao enviar: ${err instanceof Error ? err.message : String(err)}\n\n` +
          "Isso costuma acontecer por bloqueio de CORS do navegador ao chamar o WSDL diretamente, " +
          "ou porque a URL de homologação ainda não foi obtida junto ao BC Saúde.",
      );
    } finally {
      setEnviando(false);
    }
  };

  return (
    <section className="card preview-card">
      <h2>Mensagem SOAP gerada</h2>

      {errors.length > 0 && (
        <div className="error-box">
          <strong>Corrija os itens abaixo antes de gerar o XML:</strong>
          <ul>
            {errors.map((e, i) => (
              <li key={i}>{e}</li>
            ))}
          </ul>
        </div>
      )}

      {xml ? (
        <>
          <div className="preview-actions">
            <button type="button" className="btn-primary" onClick={copiar}>
              {copiado ? "Copiado!" : "Copiar XML"}
            </button>
            <button type="button" className="btn-ghost" onClick={baixar}>
              Baixar .xml
            </button>
          </div>
          <pre className="xml-output">
            <code>{xml}</code>
          </pre>

          <details className="envio-avancado">
            <summary>Envio para o Web Service (opcional / homologação)</summary>
            <p className="section-desc">
              Preencha a URL do WSDL de homologação fornecida pelo BC Saúde para
              testar o envio real via HTTP POST. Chamadas diretas do navegador
              podem ser bloqueadas por CORS — nesse caso, use este XML a partir
              do backend do seu sistema.
            </p>
            <div className="grid-2">
              <label className="inline-field">
                <span>URL do endpoint SOAP</span>
                <input
                  placeholder="https://homolog.bcsaude.gov.br/tiss/ws"
                  value={endpoint}
                  onChange={(e) => setEndpoint(e.target.value)}
                />
              </label>
              <label className="inline-field">
                <span>Cabeçalho SOAPAction (se exigido)</span>
                <input
                  placeholder="envioLoteGuiasWS"
                  value={soapAction}
                  onChange={(e) => setSoapAction(e.target.value)}
                />
              </label>
            </div>
            <button
              type="button"
              className="btn-primary"
              onClick={enviar}
              disabled={!endpoint || enviando}
            >
              {enviando ? "Enviando..." : "Enviar via HTTP POST"}
            </button>
            {resultadoEnvio && <pre className="xml-output result-output">{resultadoEnvio}</pre>}
          </details>
        </>
      ) : (
        errors.length === 0 && (
          <p className="section-desc">
            Preencha o formulário e clique em "Validar e gerar XML" para ver a
            mensagem SOAP aqui.
          </p>
        )
      )}
    </section>
  );
}
