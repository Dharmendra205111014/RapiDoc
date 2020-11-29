import { html } from 'lit-element';
import { unsafeHTML } from 'lit-html/directives/unsafe-html';
import marked from 'marked';
import { expandedEndpointBodyTemplate } from '@/templates/expanded-endpoint-template';
import { invalidCharsRegEx, pathIsInSearch } from '@/utils/common-utils';
import '@/components/api-request';
import '@/components/api-response';

/* eslint-disable indent */
function focusedTagBodyTemplate(selectedTag) {
  try {
    return html`
      <h1 id="tag--${selectedTag.name}">${selectedTag.name}</h1>
      ${selectedTag.description ? html`<div class="m-markdown"> ${unsafeHTML(marked(selectedTag.description || ''))}</div>` : ''}
      ${selectedTag.paths.length > 0 ? html`
      <!-- Path (endpoints) -->
      <h3>Go To: </h3>
      ${selectedTag.paths.filter((v) => {
        if (this.matchPaths) {
          return pathIsInSearch(this.matchPaths, v);
        }
        return true;
      }).map((p) => html`
      <div 
        class='nav-bar-path focused-body-tag
        ${this.usePathInNavBar === 'true' ? 'small-font' : ''}' 
        data-content-id='${p.method}-${p.path.replace(invalidCharsRegEx, '-')}' 
        @click = '${() => this.scrollTo(`${p.method}-${p.path.replace(invalidCharsRegEx, '-')}`)}'
      > 
        <span style = "${p.deprecated ? 'filter:opacity(0.5)' : ''}"> 
          <span class='focused-body-tag-m ${p.method}'>${p.method.toUpperCase()}</span> 
          <span class='mono-font focused-body-tag-path'>${p.path}</span>
        </span>
      </div>`)}
      ` : ''}
    `;
  } catch (e) {
    return html`<div style="height: 100vh; display: flex; justify-content: center; align-items: center;"><slot name="expended-body-error">
      <img src="https://image.flaticon.com/icons/png/128/2891/2891441.png" />
      <p>Error while parsing spec</p>
    </slot></div>`;
  }
}

export default function focusedEndpointTemplate() {
  let itemToFocus = '';
  let selectedPathObj = {};
  let selectedTagObj = {};
  let i = 0;
  if (this.selectedContentId) {
    itemToFocus = this.selectedContentId;
  } else {
    itemToFocus = 'overview';
  }
  if (itemToFocus === 'overview' || itemToFocus === 'authentication' || itemToFocus === 'api-servers') {
    selectedPathObj = {};
    selectedTagObj = {};
  } else if (itemToFocus.startsWith('tag--')) {
    const tag = itemToFocus.replace('tag--', '');
    selectedTagObj = this.resolvedSpec.tags.find((v) => v.name.replace(invalidCharsRegEx, '-') === tag);
  } else {
    for (i = 0; i < this.resolvedSpec.tags.length; i += 1) {
      selectedTagObj = this.resolvedSpec.tags[i];
      selectedPathObj = this.resolvedSpec.tags[i].paths.find((v) => `${v.method}-${v.path.replace(invalidCharsRegEx, '-')}` === itemToFocus);
      if (selectedPathObj) {
        break;
      }
    }
    if (!selectedPathObj) {
      selectedTagObj = this.resolvedSpec.tags[0];
      selectedPathObj = this.resolvedSpec.tags[0]?.paths[0];
    }
  }

  return itemToFocus === 'overview' || itemToFocus === 'authentication' || itemToFocus === 'api-servers'
    ? ''
    : itemToFocus.startsWith('tag--')
      ? html`
        <div class='regular-font section-gap--focused-mode'>
          ${focusedTagBodyTemplate.call(this, selectedTagObj)}
        </div>`
      : html`
        <div class='regular-font section-gap--focused-mode'>
          ${expandedEndpointBodyTemplate.call(this, selectedPathObj)}
        </div>
      `;
}
/* eslint-enable indent */
