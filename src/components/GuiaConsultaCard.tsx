import {
  CODIGOS_TABELA,
  CONSELHOS_PROFISSIONAIS,
  TIPOS_ATENDIMENTO,
  TIPOS_CONSULTA,
  UFS,
  type GuiaConsulta,
} from "../types";
import { Field } from "./Field";

interface Props {
  guia: GuiaConsulta;
  indice: number;
  totalGuias: number;
  onChange: (patch: Partial<GuiaConsulta>) => void;
  onRemover: () => void;
  errosPorCampo: Record<string, string>;
}

export function GuiaConsultaCard({
  guia,
  indice,
  totalGuias,
  onChange,
  onRemover,
  errosPorCampo,
}: Props) {
  const erro = (campo: string) => errosPorCampo[campo];

  return (
    <section className="card guia-card">
      <div className="guia-card-header">
        <h3>
          Guia de consulta {indice + 1}
          {guia.numeroGuiaPrestador ? ` — nº ${guia.numeroGuiaPrestador}` : ""}
        </h3>
        <button
          type="button"
          className="btn-danger"
          onClick={onRemover}
          disabled={totalGuias <= 1}
          title={
            totalGuias <= 1
              ? "O lote precisa conter ao menos uma guia"
              : "Remover esta guia"
          }
        >
          Remover
        </button>
      </div>

      <h4>Identificação da guia</h4>
      <div className="grid-3">
        <Field
          label="Registro ANS"
          htmlFor={`registroANS-${guia.id}`}
        >
          <input
            id={`registroANS-${guia.id}`}
            className="mono-field"
            value={guia.registroANS}
            onChange={(e) => onChange({ registroANS: e.target.value })}
          />
        </Field>
        <Field
          label="Número da guia (prestador)"
          htmlFor={`numeroGuiaPrestador-${guia.id}`}
          error={erro("Número da guia (prestador)")}
        >
          <input
            id={`numeroGuiaPrestador-${guia.id}`}
            className="mono-field"
            value={guia.numeroGuiaPrestador}
            onChange={(e) => onChange({ numeroGuiaPrestador: e.target.value })}
          />
        </Field>
      </div>

      <h4>Beneficiário</h4>
      <div className="grid-3">
        <Field
          label="Número da carteira (matrícula BC Saúde)"
          htmlFor={`numeroCarteira-${guia.id}`}
          error={erro("Número da carteira do beneficiário")}
        >
          <input
            id={`numeroCarteira-${guia.id}`}
            className="mono-field"
            value={guia.numeroCarteira}
            onChange={(e) => onChange({ numeroCarteira: e.target.value })}
          />
        </Field>
        <Field label="Atendimento a recém-nascido" htmlFor={`recemNascido-${guia.id}`}>
          <select
            id={`recemNascido-${guia.id}`}
            value={guia.atendimentoRecemNascido}
            onChange={(e) =>
              onChange({
                atendimentoRecemNascido: e.target.value as "S" | "N",
              })
            }
          >
            <option value="N">Não</option>
            <option value="S">Sim</option>
          </select>
        </Field>
      </div>

      <h4>Contratado executante</h4>
      <div className="grid-3">
        <Field
          label="Código do prestador no BC Saúde"
          htmlFor={`codPrestExec-${guia.id}`}
          error={erro("Código do prestador executante")}
        >
          <input
            id={`codPrestExec-${guia.id}`}
            value={guia.codigoPrestadorNaOperadora}
            onChange={(e) =>
              onChange({ codigoPrestadorNaOperadora: e.target.value })
            }
          />
        </Field>
        <Field
          label="Nome do contratado (clínica)"
          htmlFor={`nomeContratado-${guia.id}`}
          error={erro("Nome do contratado")}
        >
          <input
            id={`nomeContratado-${guia.id}`}
            value={guia.nomeContratado}
            onChange={(e) => onChange({ nomeContratado: e.target.value })}
          />
        </Field>
        <Field
          label="CNES"
          htmlFor={`cnes-${guia.id}`}
          hint="7 dígitos"
          error={erro("CNES")}
        >
          <input
            id={`cnes-${guia.id}`}
            className="mono-field"
            value={guia.CNES}
            maxLength={7}
            onChange={(e) => onChange({ CNES: e.target.value.replace(/\D/g, "") })}
          />
        </Field>
      </div>

      <h4>Profissional executante</h4>
      <div className="grid-3">
        <Field
          label="Nome do profissional"
          htmlFor={`nomeProf-${guia.id}`}
          error={erro("Nome do profissional")}
        >
          <input
            id={`nomeProf-${guia.id}`}
            value={guia.nomeProfissional}
            onChange={(e) => onChange({ nomeProfissional: e.target.value })}
          />
        </Field>
        <Field label="Conselho profissional" htmlFor={`conselho-${guia.id}`}>
          <select
            id={`conselho-${guia.id}`}
            value={guia.conselhoProfissional}
            onChange={(e) => onChange({ conselhoProfissional: e.target.value })}
          >
            {CONSELHOS_PROFISSIONAIS.map((c) => (
              <option key={c.codigo} value={c.codigo}>
                {c.label}
              </option>
            ))}
          </select>
        </Field>
        <Field
          label="Número do conselho"
          htmlFor={`numConselho-${guia.id}`}
          error={erro("Número do conselho")}
        >
          <input
            id={`numConselho-${guia.id}`}
            className="mono-field"
            value={guia.numeroConselho}
            onChange={(e) => onChange({ numeroConselho: e.target.value })}
          />
        </Field>
        <Field label="UF" htmlFor={`uf-${guia.id}`} error={erro("UF do conselho")}>
          <select
            id={`uf-${guia.id}`}
            value={guia.UF}
            onChange={(e) => onChange({ UF: e.target.value })}
          >
            <option value="">Selecione</option>
            {UFS.map((uf) => (
              <option key={uf} value={uf}>
                {uf}
              </option>
            ))}
          </select>
        </Field>
        <Field
          label="CBO"
          htmlFor={`cbo-${guia.id}`}
          hint="Código Brasileiro de Ocupações"
          error={erro("CBO")}
        >
          <input
            id={`cbo-${guia.id}`}
            className="mono-field"
            value={guia.CBO}
            onChange={(e) => onChange({ CBO: e.target.value })}
          />
        </Field>
      </div>

      <h4>Atendimento</h4>
      <div className="grid-3">
        <Field label="Tipo de atendimento" htmlFor={`tipoAtend-${guia.id}`}>
          <select
            id={`tipoAtend-${guia.id}`}
            value={guia.tipoAtendimento}
            onChange={(e) => onChange({ tipoAtendimento: e.target.value })}
          >
            {TIPOS_ATENDIMENTO.map((t) => (
              <option key={t.codigo} value={t.codigo}>
                {t.label}
              </option>
            ))}
          </select>
        </Field>
        <Field
          label="Data do atendimento"
          htmlFor={`dataAtend-${guia.id}`}
          error={erro("Data do atendimento")}
        >
          <input
            id={`dataAtend-${guia.id}`}
            type="date"
            value={guia.dataAtendimento}
            onChange={(e) => onChange({ dataAtendimento: e.target.value })}
          />
        </Field>
        <Field label="Tipo de consulta" htmlFor={`tipoConsulta-${guia.id}`}>
          <select
            id={`tipoConsulta-${guia.id}`}
            value={guia.tipoConsulta}
            onChange={(e) => onChange({ tipoConsulta: e.target.value })}
          >
            {TIPOS_CONSULTA.map((t) => (
              <option key={t.codigo} value={t.codigo}>
                {t.label}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <h4>Procedimento (Tabela TUSS)</h4>
      <div className="grid-3">
        <Field label="Código da tabela" htmlFor={`codTabela-${guia.id}`}>
          <select
            id={`codTabela-${guia.id}`}
            value={guia.codigoTabela}
            onChange={(e) => onChange({ codigoTabela: e.target.value })}
          >
            {CODIGOS_TABELA.map((t) => (
              <option key={t.codigo} value={t.codigo}>
                {t.label}
              </option>
            ))}
          </select>
        </Field>
        <Field
          label="Código do procedimento"
          htmlFor={`codProc-${guia.id}`}
          error={erro("Código do procedimento (TUSS)")}
        >
          <input
            id={`codProc-${guia.id}`}
            className="mono-field"
            value={guia.codigoProcedimento}
            onChange={(e) => onChange({ codigoProcedimento: e.target.value })}
          />
        </Field>
        <Field
          label="Valor do procedimento (R$)"
          htmlFor={`valorProc-${guia.id}`}
          error={erro("Valor do procedimento")}
        >
          <input
            id={`valorProc-${guia.id}`}
            className="mono-field"
            inputMode="decimal"
            placeholder="150.00"
            value={guia.valorProcedimento}
            onChange={(e) => onChange({ valorProcedimento: e.target.value })}
          />
        </Field>
      </div>
    </section>
  );
}
