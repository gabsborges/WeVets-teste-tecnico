# WeVet - Technical Test with Node.js

Script em Node.js que consome APIs públicas, cruza dados e gera um arquivo JSON com posts enriquecidos com informações do autor e localização (via CEP).
Projetado com arquitetura em camadas, controle de concorrência, cache e tratamento robusto de erros.

---

## Como executar

```bash
npm install
node index.js

Execute os testes unitários:
npm test

Cobertura de testes:
npm run test:coverage
```

---

## O que o script faz

* Busca posts e usuários em APIs públicas
* Seleciona os **20 posts com maior ID**
* Associa cada post ao autor
* Consulta CEP do autor para enriquecimento
* Gera `output/data.json`

Se a consulta de CEP falhar, o script continua e retorna `city` e `state` como `null`.

---

## Estrutura

```
src/
  application → orquestração da geração do relatório
  domain      → regras de negócio (enriquecimento de posts)
  infra       → integrações externas (APIs, HTTP client, escrita de arquivos)
  config      → constantes e mapeamentos
  utils       → utilidades (logger, etc.)
```

---

## Decisões técnicas

* HTTP client centralizado com timeout e tratamento de erros
* Cache de CEP para evitar chamadas repetidas à API externa
* Controle de concorrência para chamadas externas (asyncPool)
* Logger robusto com timestamps e níveis (info, warn, error)
* Tratamento de erros consistente: falhas em CEP não interrompem o script
* Separação em camadas para organização, manutenção e escalabilidade
* Validação mínima de dados antes de processar posts e usuários
* Testes unitários aprimorados:
  Cobrem fallback de CEP
  Verificam cache
  Validam posts com campos faltantes
  Testam logs (warn/info/error)

---

## Saída

Arquivo:

```
output/data.json
```

Formato:

```json
{
  "postId": 100,
  "title": "Post title",
  "authorName": "User name",
  "authorEmail": "email@email.com",
  "cep": "01001000",
  "city": "São Paulo",
  "state": "SP"
}
