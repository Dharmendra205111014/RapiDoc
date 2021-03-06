import { html } from 'lit-html';
import { invalidCharsRegEx } from '@/utils/common-utils';
import '@/components/dialog-box';

/* eslint-disable indent */
export default function searchByPropertiesModalTemplate() {
  document.addEventListener('close', () => { this.showAdvanceSearchDialog = false; });
  document.addEventListener('open', this.onOpenSearchDialog);

  return html`
    <dialog-box 
      heading="Advanced Search" 
      show="${(!!this.showAdvanceSearchDialog)}"
    >
      <span class="advance-search-options">
        <input
          style="width:100%; padding-right:20px;"
          type="text"
          placeholder="search text..."
          spellcheck="false"
          @keyup = "${(e) => this.onAdvanceSearch(e, 400)}"
        >
        <div style="display:flex; margin:8px 0 24px;">
          <div>
            <input style="cursor:pointer;" type="checkbox" id="search-api-path" checked @change = "${(e) => this.onAdvanceSearch(e, 0)}">
            <label for="search-api-path" style="cursor:pointer;"> API Path </label>
            </div>
          <div style="margin-left: 16px;">
            <input style="cursor:pointer;" type="checkbox" id="search-api-descr" checked @change = "${(e) => this.onAdvanceSearch(e, 0)}">
            <label style="cursor:pointer;" for="search-api-descr"> API Description </label>
          </div>
          <div style="margin-left: 16px;">
            <input style="cursor:pointer;" type="checkbox" id="search-api-params" @change = "${(e) => this.onAdvanceSearch(e, 0)}">
            <label style="cursor:pointer;" for="search-api-params"> API Parameters </label>
          </div>
          <div style="margin-left: 16px;">
            <input style="cursor:pointer;" type="checkbox" id="search-api-request-body" @change = "${(e) => this.onAdvanceSearch(e, 0)}">
            <label style="cursor:pointer;" for="search-api-request-body"> Request Body Parameters </label>
          </div>
          <div style="margin-left: 16px;">
            <input style="cursor:pointer;" type="checkbox" id="search-api-resp-descr" @change = "${(e) => this.onAdvanceSearch(e, 0)}">
            <label style="cursor:pointer;" for="search-api-resp-descr"> Response Description </label>
          </div>
        </div>
      </span>
      
      ${this.advanceSearchMatches?.map((path) => html`
      <div
        class="mono-font small-font-size hover-bg"
        style='padding: 5px; cursor: pointer; border-bottom: 1px solid var(--light-border-color); ${path.deprecated ? 'filter:opacity(0.5);' : ''}' 
        data-content-id='${path.method}-${path.path}'
        tabindex = '0'
        @click="${
          () => {
            this.matchPaths = ''; // clear quick filter if applied
            this.showAdvanceSearchDialog = false; // Hide Search Dialog
            this.requestUpdate();
            this.scrollTo(`${path.method}-${path.path.replace(invalidCharsRegEx, '-')}`);
          }
        }"
      > 
        <span class="upper bold-text method-fg ${path.method}">${path.method}</span> 
        <span>${path.path}</span>
        <span class="regular-font gray-text">${path.summary}</span>
      </div>
    `)
    }
    </dialog-box>
  `;
}
/* eslint-enable indent */
