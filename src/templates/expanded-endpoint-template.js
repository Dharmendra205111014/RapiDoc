import { html } from 'lit-element';
import { unsafeHTML } from 'lit-html/directives/unsafe-html';
import marked from 'marked';
import { invalidCharsRegEx, rapidocApiKey } from '@/utils/common-utils';
import { pathSecurityTemplate } from '@/templates/security-scheme-template';
import codeSamplesTemplate from '@/templates/code-samples-template';
import callbackTemplate from '@/templates/callback-template';
import '@/components/api-request';
import '@/components/api-response';

/* eslint-disable indent */

export function expandedEndpointBodyTemplate(path) {
  const acceptContentTypes = new Set();
  for (const respStatus in path.responses) {
    for (const acceptContentType in (path.responses[respStatus]?.content)) {
      acceptContentTypes.add(acceptContentType.trim());
    }
  }
  const accept = [...acceptContentTypes].join(', ');

  // Filter API Keys that are non-empty and are applicable to the the path
  const nonEmptyApiKeys = this.resolvedSpec.securitySchemes.filter((v) => (v.finalKeyValue && path.security?.some((ps) => (v.apiKeyId in ps)))) || [];

  // If a RapiDoc API Key is specified on the element and its value is not hyphen(-) then include it for all paths
  const rapiDocApiKey = this.resolvedSpec.securitySchemes.find((v) => (v.apiKeyId === rapidocApiKey && v.value !== '-'));
  if (rapiDocApiKey) {
    nonEmptyApiKeys.push(rapiDocApiKey);
  }

  const codeSampleTabPanel = path.xCodeSamples ? codeSamplesTemplate.call(this, path.xCodeSamples) : '';
  try {
    return html`
    ${this.renderStyle === 'read' ? html` <div class='divider'></div>` : ''}
    <div class='expanded-endpoint-body observe-me ${path.method} ${path.deprecated ? 'deprecated' : ''} ' id='${path.method}-${path.path.replace(invalidCharsRegEx, '-')}'>
    ${path.deprecated ? html`<div class="bold-text red-text" > DEPRECATED </div>` : ''}
    ${html`
      <h2 class = "${path.deprecated ? 'gray-text' : ''}"> 
        ${path.summary || html`<span class='upper ${path.deprecated ? ' method-fg gray-text' : path.method}  '> ${path.method}</span> ${path.path}`} 
      </h2>
      ${path.summary
        ? html`
          <div class='mono-font regular-font-size' style='padding: 8px 0; color:var(--fg3)'> 
            <span class='regular-font upper method-fg  ${path.deprecated ? ' gray-text' : ` bold-text ${path.method}`} '>${path.method}</span> 
            <span class = '${path.deprecated ? 'gray-text' : ''}'> ${path.path} </span>
          </div>`
        : ''
      }`
    }
    ${path.description ? html`<div class="m-markdown"> ${unsafeHTML(marked(path.description || ''))}</div>` : ''}
    ${pathSecurityTemplate.call(this, path.security)}
    ${codeSampleTabPanel}
    <div class='expanded-req-resp-container'>
      <api-request  class="request-panel"
        method = "${path.method}"
        path = "${path.path}"
        .parameters = "${path.parameters}"
        .request_body = "${path.requestBody}"
        .api_keys = "${nonEmptyApiKeys}"
        .servers = "${path.servers}"
        server-url = "${path.servers?.[0]?.url || this.selectedServer.computedUrl}"
        fill-request-fields-with-example = "${this.fillRequestFieldsWithExample}"
        allow-try = "${this.allowTry}"
        accept = "${accept}"
        render-style="${this.renderStyle}" 
        schema-style = "${this.schemaStyle}"
        active-schema-tab = "${this.defaultSchemaTab}"
        schema-expand-level = "${this.schemaExpandLevel}"
        schema-description-expanded = "${this.schemaDescriptionExpanded}"
        proxy-url="${this.proxyUrl ? this.proxyUrl : ''}"
      > </api-request>

      ${path.callbacks ? callbackTemplate.call(this, path.callbacks) : ''}

      <api-response
        class = 'response-panel'
        .responses = "${path.responses}"
        render-style = "${this.renderStyle}"
        schema-style = "${this.schemaStyle}"
        active-schema-tab = "${this.defaultSchemaTab}"
        schema-expand-level = "${this.schemaExpandLevel}"
        schema-description-expanded = "${this.schemaDescriptionExpanded}"
        selected-status = "${Object.keys(path.responses || {})[0] || ''}"
      > </api-response>
    </div>
  </div>
  `;
  } catch (e) {
    return html`<div style="height: 100vh; display: flex; justify-content: center; align-items: center;"><slot name="expended-body-error">
      <img src="https://image.flaticon.com/icons/png/128/2891/2891441.png" />
      <p>Error while parsing spec</p>
    </slot></div>`;
  }
}

export default function expandedEndpointTemplate() {
  return html`
  ${this.resolvedSpec.tags.map((tag) => html`
    <div id="tag--${tag.name.replace(invalidCharsRegEx, '-')}" class='regular-font section-gap--read-mode observe-me' style="border-top:1px solid var(--primary-color);">
      <div class="title tag">${tag.name}</div>
      <div class="regular-font-size">
        ${unsafeHTML(`<div class='m-markdown regular-font'>${marked(tag.description ? tag.description : '')}</div>`)}
      </div>
    </div>
    <div class='regular-font section-gap--read-mode'>
      ${tag.paths.map((path) => expandedEndpointBodyTemplate.call(this, path))}
    </div>
    `)
  }
`;
}
/* eslint-enable indent */
