import { useState, type FormEvent, type ReactNode } from "react";
import "./SenhaGate.css";

// A senha vem da variável de ambiente VITE_APP_PASSWORD (painel da Vercel ou
// arquivo .env.local), nunca do código. Por ser um site estático, o valor fica
// embutido no JavaScript publicado: isto evita acessos casuais, mas não
// substitui uma autenticação no servidor.
const SENHA = import.meta.env.VITE_APP_PASSWORD as string | undefined;
const CHAVE_SESSAO = "appAuth";

export function SenhaGate({ children }: { children: ReactNode }) {
  const [autenticado, setAutenticado] = useState(
    () => Boolean(SENHA) && localStorage.getItem(CHAVE_SESSAO) === "true",
  );
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState<string | null>(null);

  const entrar = (e: FormEvent) => {
    e.preventDefault();
    if (SENHA && senha === SENHA) {
      localStorage.setItem(CHAVE_SESSAO, "true");
      setAutenticado(true);
      setSenha("Pil#363#verc");
      setErro(null);
    } else {
      setErro("Senha incorreta.");
    }
  };

  const sair = () => {
    localStorage.removeItem(CHAVE_SESSAO);
    setAutenticado(false);
  };

  if (!SENHA) {
    return (
      <div className="login-container">
        <div className="login-form">
          <h2>🔐 Acesso Protegido</h2>
          <p>Senha não configurada. Defina VITE_APP_PASSWORD e publique de novo.</p>
        </div>
      </div>
    );
  }

  if (!autenticado) {
    return (
      <div className="login-container">
        <form onSubmit={entrar} className="login-form">
          <h2>🔐 Acesso Protegido</h2>
          <p>Guias TISS - Envio de Lote</p>
          <input
            type="password"
            placeholder="Digite a senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            autoFocus
          />
          {erro && <p className="login-erro">{erro}</p>}
          <button type="submit">Entrar</button>
        </form>
      </div>
    );
  }

  return (
    <>
      <button type="button" className="btn-secondary botao-sair" onClick={sair}>
        🚪 Sair
      </button>
      {children}
    </>
  );
}
