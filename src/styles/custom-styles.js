import { css } from 'lit-element';

/*
This file is reserved for any custom css that developers want to add to
customize their theme. Simply add your css to this file and yarn build.
*/

export default css`
    .focused-body-tag { color: var(--blue); padding-left: 0;  }
    .focused-body-tag:hover { background: none; color: inherit; }
    .focused-body-tag-m { font-weight: bold; }
    .focused-body-tag-m.put { color: var(--orange); }
    .focused-body-tag-m.post { color: var(--green); }
    .focused-body-tag-m.get { color: var(--blue); }
    .focused-body-tag-m.delete { color: var(--red); }
    .focused-body-tag-m.options, 
    .focused-body-tag-m.head, 
    .focused-body-tag-m.patch { color: var(--yellow); }
    .focused-body-tag-path { }
    .focused-body-tag-path:hover { color: var(--brown) }
    .nav-bar-path.active {background: var(--light-fg);}
`;
