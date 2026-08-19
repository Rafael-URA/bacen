import type { CabecalhoTransacao, LoteInfo } from "../types";
import { Field } from "./Field";

interface Props {
  cabecalho: CabecalhoTransacao;
  lote: LoteInfo;
  onChangeCabecalho: (patch: Partial<CabecalhoTransacao>) => void;
  onChangeLote: (patch: Partial<LoteInfo>) => void;
  onGerarSequencial: () => void;
}

export function CabecalhoForm({
  cabecalho,
  lote,
  onChangeCabecalho,
  onChangeLote,
  onGerarSequencial,
}: Props) {
  return (
    <section className="card">
      <h2>Cabeçalho da transação (envelope SOAP)</h2>
      <p className="section-desc">
        Identificação e segurança da mensagem enviada ao BC Saúde.
      </p>
      <div className="grid-3">
        <Field label="Tipo de transação" htmlFor="tipoTransacao">
          <input
            id="tipoTransacao"
            value={cabecalho.tipoTransacao}
            onChange={(e) => onChangeCabecalho({ tipoTransacao: e.target.value })}
          />
        </Field>

        <Field
          label="Sequencial da transação"
          htmlFor="sequencialTransacao"
          hint="Número único gerado pelo seu sistema"
        >
          <div className="input-with-button">
            <input
              id="sequencialTransacao"
              value={cabecalho.sequencialTransacao}
              onChange={(e) =>
                onChangeCabecalho({ sequencialTransacao: e.target.value })
              }
            />
            <button type="button" className="btn-ghost" onClick={onGerarSequencial}>
              Gerar
            </button>
          </div>
        </Field>

        <Field label="Versão do padrão TISS" htmlFor="versaoPadrao">
          <input
            id="versaoPadrao"
            value={cabecalho.versaoPadrao}
            onChange={(e) => onChangeCabecalho({ versaoPadrao: e.target.value })}
          />
        </Field>

        <Field label="Data de registro" htmlFor="dataRegistroTransacao">
          <input
            id="dataRegistroTransacao"
            type="date"
            value={cabecalho.dataRegistroTransacao}
            onChange={(e) =>
              onChangeCabecalho({ dataRegistroTransacao: e.target.value })
            }
          />
        </Field>

        <Field label="Hora de registro" htmlFor="horaRegistroTransacao">
          <input
            id="horaRegistroTransacao"
            type="time"
            step={1}
            value={cabecalho.horaRegistroTransacao}
            onChange={(e) =>
              onChangeCabecalho({ horaRegistroTransacao: e.target.value })
            }
          />
        </Field>

        <Field
          label="Código do prestador no BC Saúde (origem)"
          htmlFor="codigoPrestadorNaOperadora"
        >
          <input
            id="codigoPrestadorNaOperadora"
            value={cabecalho.codigoPrestadorNaOperadora}
            onChange={(e) =>
              onChangeCabecalho({ codigoPrestadorNaOperadora: e.target.value })
            }
          />
        </Field>

        <Field
          label="Registro ANS (destino / BC Saúde)"
          htmlFor="registroANS"
        >
          <input
            id="registroANS"
            value={cabecalho.registroANS}
            onChange={(e) => onChangeCabecalho({ registroANS: e.target.value })}
          />
        </Field>

        <Field label="Número do lote" htmlFor="numeroLote">
          <input
            id="numeroLote"
            value={lote.numeroLote}
            onChange={(e) => onChangeLote({ numeroLote: e.target.value })}
          />
        </Field>
      </div>
    </section>
  );
}
