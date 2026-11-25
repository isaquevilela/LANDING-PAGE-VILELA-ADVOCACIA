# Vilela Advocacia Especializada

Landing page estática em HTML, CSS e JavaScript puro.

## Publicação no Cloudflare Pages

- Framework preset: `None`
- Build command: deixar vazio
- Build output directory: `.`
- Root directory: raiz do projeto

## Páginas e prévia local

- `index.html` é a página institucional.
- `direito-trabalhista.html` e `direito-consumidor.html` são as páginas de campanha. O Cloudflare Pages entrega os arquivos nas rotas sem a extensão.
- `privacidade.html` descreve a hospedagem, o contato e a medição opcional.

Use Node.js para iniciar a prévia com `node tools/preview.mjs`. Acesse `http://127.0.0.1:8788`. É possível informar outra porta como argumento.

Edite os textos em `tools/service-content.mjs` e a estrutura compartilhada em `tools/build-pages.mjs`. Rode `node tools/build-pages.mjs` e inclua os HTMLs gerados junto com os arquivos-fonte. O Cloudflare continua sem comando de build. Após aprovação jurídica e autorização de publicação, envie primeiro a uma branch de prévia e confira as rotas diretas. A publicação ocorre ao integrar à branch de produção configurada no Cloudflare.

[Roteamento do Cloudflare Pages](https://developers.cloudflare.com/pages/configuration/serving-pages/)

## WhatsApp e medição de campanhas

Cada página usa o telefone oficial e a mensagem “Olá, Dr. Isaque! Acessei sua página de [área] e gostaria de informações sobre atendimento jurídico.” A área é Direito Trabalhista ou Direito do Consumidor.

A medição usa Google Tag direta em `measurement.js`. O destino é `AW-18588684549/nvJpCIWZpb8dEIWi459F`, ação **Contato** (7917358213). O site emite um evento `conversion` por clique elegível e mantém a navegação nativa do link. O Google Ads aplica a configuração de contagem “Uma” por interação com anúncio. O clique mede intenção de contato. A confirmação de mensagem enviada ou contratação ocorre fora do site.

O site carrega a tag após consentimento e deixa `analytics_storage` e `ad_personalization` negados. A opção “Preferências de privacidade” permite revogar ou conceder consentimento. A revogação atualiza o Consent Mode e bloqueia novos eventos. A tag pode usar o identificador do clique presente na chegada para atribuição. O endereço do WhatsApp e a mensagem não integram os parâmetros do evento.

O contêiner `GTM-MMJ5726L` fica fora desta integração. Mantenha uma única origem de disparo para a ação. Em Google Ads, confirme o objetivo primário **Contato**, a contagem “Uma” e a codificação automática. Após publicação, use o Tag Assistant nas três páginas para comparar carregamento, clique consentido, recusa e revogação. Confirme a recepção da ação e a atribuição no Google Ads antes de retomar as campanhas.

[Consent Mode](https://developers.google.com/tag-platform/security/guides/consent) · [Conversões do Google Ads](https://support.google.com/google-ads/answer/16560108)

## Revisão antes de publicar

- O site confirma a atuação trabalhista e de consumo, OAB/MG nº 224.007, atendimento nacional online e presencial em Minas Gerais. A formação acadêmica não consta do projeto. Confirmar eventual formação antes de adicioná-la.
- Confirmar se o escritório atende diretamente justa causa, rescisão indireta, aviso-prévio, banco de horas, adicional noturno, diferenças salariais, outras estabilidades, férias e décimo terceiro. Justa causa e rescisão indireta constam como conteúdo informativo, com revisão pendente.
- Confirmar fraudes bancárias e Pix, cartões não solicitados, veículos adquiridos e negativas de cobertura antes de usar esses temas como oferta ou destino de campanha. A transação não reconhecida consta como conteúdo informativo. Negativas de cobertura constam como tema dentro de planos e seguros e exigem confirmação.
- Revisar o aviso de privacidade conforme os tratamentos efetivos do escritório, inclusive bases legais, retenção, fornecedores, transferências e canal de direitos. Validar também o consentimento e a configuração real das tags antes de habilitar a medição.
- Revisar a home institucional quanto a “Soluções rápidas”, “Análise imediata”, “rápida e eficaz solução” e “FALE COM O ADVOGADO AGORA”. Esses trechos merecem avaliação de linguagem publicitária pelo advogado.
- Após autorização, medir Lighthouse mobile na prévia publicada e acompanhar Core Web Vitals com dados reais. Validar os links de WhatsApp em Android e iOS, enviar o sitemap ao Search Console e verificar as URLs canônicas.

[Provimento 205/2021 da OAB](https://www.oab.org.br/leisnormas/legislacao/provimentos/205-2021) · [CLT](https://planalto.gov.br/ccivil_03/decreto-lei/del5452compilado.htm) · [CDC](https://www.planalto.gov.br/ccivil_03/leis/l8078compilado.htm) · [ANAC](https://www.anac.gov.br/assuntos/legislacao/direitos-e-deveres-dos-passageiros)
