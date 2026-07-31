# Castro Intelligence — implementação SEO/AEO

## Publicação
Publique o conteúdo desta pasta na raiz do domínio `castrointelligence.com.br`. O projeto permanece compatível com GitHub Pages e não usa PHP.

## Antes de publicar
1. Validar o GTM `GTM-5CB9PXD5`.
2. No GTM, configurar GA4 e Microsoft Clarity exigindo `analytics_storage = granted`.
3. Configurar tags de mídia paga exigindo `ad_storage`, `ad_user_data` e `ad_personalization = granted`.
4. Testar o Consent Mode no Tag Assistant.
5. Enviar `/sitemap.xml` ao Google Search Console e Bing Webmaster Tools.
6. Validar JSON-LD no Rich Results Test e no Schema Markup Validator.

## Sitemap
Execute `python scripts/generate_seo.py` após criar ou remover páginas. O sitemap é gerado a partir das tags canonical e ignora páginas `noindex`.

## Clarity
A instalação recomendada é via GTM. O site já envia Consent Mode v2; configure o Clarity para respeitar `analytics_storage`. Não há ID do Clarity hardcoded no código.
