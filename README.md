# WeVet - Technical Test with Node.js

Script em Node.js que consome APIs públicas, cruza dados e gera um arquivo JSON com posts enriquecidos com informações do autor e localização (via CEP).

---

## Como executar

```bash
npm install
node index.js
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
 application → orquestração
 domain → regras de negócio
 infra → integrações externas
 config → constantes
 utils → utilidades
```

---

## Decisões técnicas

* HTTP client centralizado
* Cache de CEP (evita chamadas repetidas)
* Controle de concorrência para chamadas externas
* Separação em camadas para organização e manutenção

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
