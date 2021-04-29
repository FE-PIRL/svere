!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports,require("react")):"function"==typeof define&&define.amd?define(["exports","react"],t):t((e="undefined"!=typeof globalThis?globalThis:e||self).Core={},e.React)}(this,(function(e,t){"use strict";function n(e){return e&&"object"==typeof e&&"default"in e?e:{default:e}}var r=n(t),o=function(){return(o=Object.assign||function(e){for(var t,n=1,r=arguments.length;n<r;n++)for(var o in t=arguments[n])Object.prototype.hasOwnProperty.call(t,o)&&(e[o]=t[o]);return e}).apply(this,arguments)},u={element:"div",id:"svelte-react-wrapper"};
/*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */e.reactify=function(e,n){return function(c){var i=t.useRef(null),a=t.useRef(null),f=t.useState(!1),l=f[0],s=f[1];return t.useEffect((function(){var t,n,r=/on([A-Z]{1,}[a-zA-Z]*)/,o=/watch([A-Z]{1,}[a-zA-Z]*)/;a.current=new e({target:i.current,props:c});var u=[];for(var f in c){var l=f.match(r),s=f.match(o);l&&"function"==typeof c[f]&&(null===(t=a.current)||void 0===t||t.$on(""+l[1][0].toLowerCase()+l[1].slice(1),c[f])),s&&"function"==typeof c[f]&&u.push([""+s[1][0].toLowerCase()+s[1].slice(1),c[f]])}if(u.length){var d=null===(n=a.current)||void 0===n?void 0:n.$$.update;d&&(a.current.$$.update=function(){u.forEach((function(e){var t,n,r=e[0],o=e[1],u=null===(t=a.current)||void 0===t?void 0:t.$$.props[r],c=null===(n=a.current)||void 0===n?void 0:n.$$.ctx[u];c&&o(c)})),d.apply(null,arguments)})}return function(){var e;null===(e=a.current)||void 0===e||e.$destroy()}}),[]),t.useEffect((function(){var e;l?null===(e=a.current)||void 0===e||e.$set(c):s(!0)}),[c]),n=n?Object.assign({},u,n):u,r.default.createElement(n.element,{ref:i,id:n.id,className:n.className,style:o({},n.styles)})}},Object.defineProperty(e,"__esModule",{value:!0})}));
