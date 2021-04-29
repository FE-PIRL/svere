import r,{useRef as t,useState as n,useEffect as e}from"react";
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
***************************************************************************** */var o=function(){return(o=Object.assign||function(r){for(var t,n=1,e=arguments.length;n<e;n++)for(var o in t=arguments[n])Object.prototype.hasOwnProperty.call(t,o)&&(r[o]=t[o]);return r}).apply(this,arguments)},a={element:"div",id:"svelte-react-wrapper"},u=function(u,c){return function(l){var i=t(null),s=t(null),v=n(!1),f=v[0],p=v[1];return e((function(){var r,t,n=/on([A-Z]{1,}[a-zA-Z]*)/,e=/watch([A-Z]{1,}[a-zA-Z]*)/;s.current=new u({target:i.current,props:l});var o=[];for(var a in l){var c=a.match(n),v=a.match(e);c&&"function"==typeof l[a]&&(null===(r=s.current)||void 0===r||r.$on(""+c[1][0].toLowerCase()+c[1].slice(1),l[a])),v&&"function"==typeof l[a]&&o.push([""+v[1][0].toLowerCase()+v[1].slice(1),l[a]])}if(o.length){var f=null===(t=s.current)||void 0===t?void 0:t.$$.update;f&&(s.current.$$.update=function(){o.forEach((function(r){var t,n,e=r[0],o=r[1],a=null===(t=s.current)||void 0===t?void 0:t.$$.props[e],u=null===(n=s.current)||void 0===n?void 0:n.$$.ctx[a];u&&o(u)})),f.apply(null,arguments)})}return function(){var r;null===(r=s.current)||void 0===r||r.$destroy()}}),[]),e((function(){var r;f?null===(r=s.current)||void 0===r||r.$set(l):p(!0)}),[l]),c=c?Object.assign({},a,c):a,r.createElement(c.element,{ref:i,id:c.id,className:c.className,style:o({},c.styles)})}};export{u as reactify};
