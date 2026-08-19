# Guias TISS — Envio de Lote (SOAP / BC Saúde)

Aplicação web para preencher os dados de uma Guia de Consulta no padrão TISS
e gerar a mensagem SOAP (envelope + lote de guias) pronta para envio ao
Web Service do BC Saúde.

## O que a aplicação faz

- Formulário com validação para o cabeçalho da transação SOAP (identificação,
  origem, destino, versão do padrão TISS) e para o lote de guias.
- Suporte a múltiplas guias de consulta no mesmo lote (adicionar/remover).
- Geração do XML SOAP completo, com escape correto de caracteres especiais,
  espelhando a estrutura de `soapenv:Envelope` → `soapenv:Header` /
  `soapenv:Body` → `guiasTISS` → `guiaConsulta`.
- Cópia para a área de transferência e download do arquivo `.xml`.
- Envio opcional via HTTP POST para uma URL de homologação/produção informada
  pelo usuário (útil após obter o WSDL de homologação junto ao BC Saúde).

## Rodando localmente

```bash
npm install
npm run dev      # ambiente de desenvolvimento
npm run build    # build de produção em dist/
npm run lint     # lint com oxlint
```

## Próximos passos sugeridos

- Validar o XML gerado contra os arquivos `.xsd` oficiais da ANS/TISS antes
  do envio em produção.
- Solicitar a `bcsaude.credenciamento@bcb.gov.br` a URL do WSDL de
  homologação e credenciais de teste.
- Se o envio direto do navegador for bloqueado por CORS, use o XML gerado
  aqui a partir de um backend (proxy) que faça a chamada SOAP.
