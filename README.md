# Koda Themes — White-label

Este projeto é um **template white-label** (HTML/CSS/JS) pensado para você “trocar a skin” rapidamente, mantendo:

- **Dados do cliente** em `config/config.js` (nome, contatos, links, textos, dados/serviços/produtos, GA4 etc.)
- **Identidade visual** em `config/theme.js` (cores, fontes, raios, logos e assets)

## Estrutura
```
/assets
  /css
  /js
/config
  config.js
  theme.js
/imagens
/partials
index.html
...
```

## Como trocar para outro cliente (fluxo padrão)
1) Edite **apenas**:
- `config/config.js`
- `config/theme.js`

2) (Opcional) Ajuste textos específicos por página no bloco `seo.pages` do `config.js`.

## Fontes (Google Fonts)
- O link de fontes fica em `theme.js` (`fonts.googleFontsHref`)
- As CSS usam `var(--font-sans)` e `var(--font-script)`.

## Agendamento (Serviços)
Quando o carrinho contém **serviços**, ao clicar em **Agendar** abre um modal para escolher data/hora.
A data/hora escolhida vai junto na mensagem do WhatsApp.

## SEO / Head
O `main.js` aplica SEO por página (title/description/canonical/OG/Twitter) com base no `config.js`.

> Observação: sitemap.xml e robots.txt permanecem como arquivos estáticos (úteis para preview local).  
> Em produção, o recomendado é gerar versões por domínio (build ou função), caso você queira SEO “perfeito” em múltiplos clientes.
