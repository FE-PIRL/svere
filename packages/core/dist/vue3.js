!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t(require("vue")):"function"==typeof define&&define.amd?define(["vue"],t):(e="undefined"!=typeof globalThis?globalThis:e||self).ServeVue3=t(e.Vue)}(this,(function(e){"use strict";var t=function(){return t=Object.assign||function(e){for(var t,n=1,r=arguments.length;n<r;n++)for(var o in t=arguments[n])Object.prototype.hasOwnProperty.call(t,o)&&(e[o]=t[o]);return e},t.apply(this,arguments)};return function(n,r){var o=function(e){return t({element:"div",id:"svelte-wrapper"},e)}(r);return e.defineComponent({name:o.id,setup:function(t,r){var o=e.ref(null),a=e.ref(null);return e.onMounted((function(){var e=/on([A-Z]+[a-zA-Z]*)/,u=/watch([A-Z]+[a-zA-Z]*)/;a.value=new n({target:o.value,props:r.attrs});var i=[];for(var c in r.attrs){var l=c.match(e),f=c.match(u);l&&"function"==typeof r.attrs[c]&&a.value.$on("".concat(l[1][0].toLowerCase()).concat(l[1].slice(1)),t[c]),f&&"function"==typeof t[c]&&i.push(["".concat(f[1][0].toLowerCase()).concat(f[1].slice(1)),t[c]])}if(i.length&&a.value.$$.update){var s=a.value.$$.update;a.value.$$.update=function(){i.forEach((function(e){var t=e[0],n=e[1],r=a.value.$$.props[t],o=a.value.$$.ctx[r];o&&n(o)})),s.apply(null,arguments)}}return function(){return a.value.$destroy()}})),e.onUpdated((function(){var e;return null===(e=a.value)||void 0===e?void 0:e.$set(r.attrs)})),e.onDeactivated((function(){var e;return null===(e=a.value)||void 0===e?void 0:e.$destroy()})),{component:a,container:o}},render:function(){var n={ref:"container",id:o.id,style:t({},o.styles),class:o.className};return e.h(o.element,n)}})}}));
