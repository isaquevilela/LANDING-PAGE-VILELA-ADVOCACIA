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

O evento `whatsapp_click` registra intenção de contato. O clique não confirma que houve mensagem enviada ou contratação. Os dados do evento são `page_id` (`service_01` trabalhista e `service_02` consumidor), `button_position` e `cta_id`. Os CTAs usam `cta_01` (hero), `cta_02` (áreas), `cta_03` (processo), `cta_04` (encerramento) e `cta_05` (flutuante).

1. Forneça o ID do contêiner web `GTM-…` e o ID do fluxo GA4 `G-…`. Para medir diretamente no Google Ads, forneça também o ID `AW-…` e o rótulo da ação de conversão. Configure as tags de destino no GTM e o contêiner em `measurement.js`.
2. Crie um acionador de evento personalizado `whatsapp_click` e variáveis da camada de dados para `page_id`, `button_position` e `cta_id`. Configure a tag de evento do GA4 e registre dimensões personalizadas se quiser relatórios por esses campos. Desative cliques externos da medição otimizada nesse fluxo para evitar coleta automática da URL do WhatsApp. Desative a coleta de eventos que não serão usados.
3. Configure a medição de anúncios com uma ação de clique de contato e contagem “Uma”. Use a tag direta com o mesmo acionador ou vincule GA4 e importe o evento principal. Escolha uma única fonte como conversão primária por campanha. Evite gatilhos genéricos de clique, conversões otimizadas e públicos de remarketing.
4. Exija `analytics_storage` para GA4 e `ad_storage` e `ad_user_data` para Ads. A personalização permanece negada. Configure a vinculação de conversões no destino de Ads conforme a instalação da Google tag. Ative a codificação automática e valide atribuição na prévia. UTMs e identificadores ficam na URL de chegada para leitura pelas tags consentidas. O código não os copia para o WhatsApp, não os salva e não garante atribuição após navegação a outra rota.
5. No GTM, use URLs canônicas sem query ou fragmento para localização da página no GA4 e desative o envio automático do referenciador quando aplicável. Não use texto do CTA, URL de clique, URL bruta, parâmetros livres, relatos ou documentos como campos de eventos. Confira as requisições reais no Tag Assistant e na rede antes de publicar o contêiner. A captura nativa para atribuição precisa ser conferida separadamente, sobretudo se houver parâmetros arbitrários na URL recebida.
6. Em prévia, teste uma visita com recusa, outra com permissão, um clique por botão e a revogação antes do próximo clique. Verifique desaparecimento de novos eventos após revogação, contagem unitária e funcionamento do WhatsApp. A revogação atualiza o Consent Mode e bloqueia o evento no site. Cookies já gravados seguem as configurações e políticas das ferramentas usadas.

[Consent Mode](https://developers.google.com/tag-platform/security/guides/consent) · [Conversões do Google Ads](https://support.google.com/google-ads/answer/16560108)

## Revisão antes de publicar

- O site confirma a atuação trabalhista e de consumo, OAB/MG nº 224.007, atendimento nacional online e presencial em Minas Gerais. A formação acadêmica não consta do projeto. Confirmar eventual formação antes de adicioná-la.
- Confirmar se o escritório atende diretamente justa causa, rescisão indireta, aviso-prévio, banco de horas, adicional noturno, diferenças salariais, outras estabilidades, férias e décimo terceiro. Justa causa e rescisão indireta constam como conteúdo informativo, com revisão pendente.
- Confirmar fraudes bancárias e Pix, cartões não solicitados, veículos adquiridos e negativas de cobertura antes de usar esses temas como oferta ou destino de campanha. A transação não reconhecida consta como conteúdo informativo. Negativas de cobertura constam como tema dentro de planos e seguros e exigem confirmação.
- Revisar o aviso de privacidade conforme os tratamentos efetivos do escritório, inclusive bases legais, retenção, fornecedores, transferências e canal de direitos. Validar também o consentimento e a configuração real das tags antes de habilitar a medição.
- Revisar a home institucional quanto a “Soluções rápidas”, “Análise imediata”, “rápida e eficaz solução” e “FALE COM O ADVOGADO AGORA”. Esses trechos merecem avaliação de linguagem publicitária pelo advogado.
- Após autorização, medir Lighthouse mobile na prévia publicada e acompanhar Core Web Vitals com dados reais. Validar os links de WhatsApp em Android e iOS, enviar o sitemap ao Search Console e verificar as URLs canônicas.

[Provimento 205/2021 da OAB](https://www.oab.org.br/leisnormas/legislacao/provimentos/205-2021) · [CLT](https://planalto.gov.br/ccivil_03/decreto-lei/del5452compilado.htm) · [CDC](https://www.planalto.gov.br/ccivil_03/leis/l8078compilado.htm) · [ANAC](https://www.anac.gov.br/assuntos/legislacao/direitos-e-deveres-dos-passageiros)
