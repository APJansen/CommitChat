(()=>{"use strict";function e(e,n){return Array(n+1).join(e)}var n=["ADDRESS","ARTICLE","ASIDE","AUDIO","BLOCKQUOTE","BODY","CANVAS","CENTER","DD","DIR","DIV","DL","DT","FIELDSET","FIGCAPTION","FIGURE","FOOTER","FORM","FRAMESET","H1","H2","H3","H4","H5","H6","HEADER","HGROUP","HR","HTML","ISINDEX","LI","MAIN","MENU","NAV","NOFRAMES","NOSCRIPT","OL","OUTPUT","P","PRE","SECTION","TABLE","TBODY","TD","TFOOT","TH","THEAD","TR","UL"];function t(e){return a(e,n)}var r=["AREA","BASE","BR","COL","COMMAND","EMBED","HR","IMG","INPUT","KEYGEN","LINK","META","PARAM","SOURCE","TRACK","WBR"];function i(e){return a(e,r)}var o=["A","TABLE","THEAD","TBODY","TFOOT","TH","TD","IFRAME","SCRIPT","AUDIO","VIDEO"];function a(e,n){return n.indexOf(e.nodeName)>=0}function l(e,n){return e.getElementsByTagName&&n.some((function(n){return e.getElementsByTagName(n).length}))}var c={};function u(e){return e?e.replace(/(\n+\s*)+/g,"\n"):""}function s(e){for(var n in this.options=e,this._keep=[],this._remove=[],this.blankRule={replacement:e.blankReplacement},this.keepReplacement=e.keepReplacement,this.defaultRule={replacement:e.defaultReplacement},this.array=[],e.rules)this.array.push(e.rules[n])}function f(e,n,t){for(var r=0;r<e.length;r++){var i=e[r];if(d(i,n,t))return i}}function d(e,n,t){var r=e.filter;if("string"==typeof r){if(r===n.nodeName.toLowerCase())return!0}else if(Array.isArray(r)){if(r.indexOf(n.nodeName.toLowerCase())>-1)return!0}else{if("function"!=typeof r)throw new TypeError("`filter` needs to be a string, array, or function");if(r.call(e,n,t))return!0}}function p(e){var n=e.nextSibling||e.parentNode;return e.parentNode.removeChild(e),n}function m(e,n,t){return e&&e.parentNode===n||t(n)?n.nextSibling||n.parentNode:n.firstChild||n.nextSibling||n.parentNode}c.paragraph={filter:"p",replacement:function(e){return"\n\n"+e+"\n\n"}},c.lineBreak={filter:"br",replacement:function(e,n,t){return t.br+"\n"}},c.heading={filter:["h1","h2","h3","h4","h5","h6"],replacement:function(n,t,r){var i=Number(t.nodeName.charAt(1));return"setext"===r.headingStyle&&i<3?"\n\n"+n+"\n"+e(1===i?"=":"-",n.length)+"\n\n":"\n\n"+e("#",i)+" "+n+"\n\n"}},c.blockquote={filter:"blockquote",replacement:function(e){return"\n\n"+(e=(e=e.replace(/^\n+|\n+$/g,"")).replace(/^/gm,"> "))+"\n\n"}},c.list={filter:["ul","ol"],replacement:function(e,n){var t=n.parentNode;return"LI"===t.nodeName&&t.lastElementChild===n?"\n"+e:"\n\n"+e+"\n\n"}},c.listItem={filter:"li",replacement:function(e,n,t){e=e.replace(/^\n+/,"").replace(/\n+$/,"\n").replace(/\n/gm,"\n    ");var r=t.bulletListMarker+"   ",i=n.parentNode;if("OL"===i.nodeName){var o=i.getAttribute("start"),a=Array.prototype.indexOf.call(i.children,n);r=(o?Number(o)+a:a+1)+".  "}return r+e+(n.nextSibling&&!/\n$/.test(e)?"\n":"")}},c.indentedCodeBlock={filter:function(e,n){return"indented"===n.codeBlockStyle&&"PRE"===e.nodeName&&e.firstChild&&"CODE"===e.firstChild.nodeName},replacement:function(e,n,t){return"\n\n    "+n.firstChild.textContent.replace(/\n/g,"\n    ")+"\n\n"}},c.fencedCodeBlock={filter:function(e,n){return"fenced"===n.codeBlockStyle&&"PRE"===e.nodeName&&e.firstChild&&"CODE"===e.firstChild.nodeName},replacement:function(n,t,r){for(var i,o=((t.firstChild.getAttribute("class")||"").match(/language-(\S+)/)||[null,""])[1],a=t.firstChild.textContent,l=r.fence.charAt(0),c=3,u=new RegExp("^"+l+"{3,}","gm");i=u.exec(a);)i[0].length>=c&&(c=i[0].length+1);var s=e(l,c);return"\n\n"+s+o+"\n"+a.replace(/\n$/,"")+"\n"+s+"\n\n"}},c.horizontalRule={filter:"hr",replacement:function(e,n,t){return"\n\n"+t.hr+"\n\n"}},c.inlineLink={filter:function(e,n){return"inlined"===n.linkStyle&&"A"===e.nodeName&&e.getAttribute("href")},replacement:function(e,n){var t=n.getAttribute("href"),r=u(n.getAttribute("title"));return r&&(r=' "'+r+'"'),"["+e+"]("+t+r+")"}},c.referenceLink={filter:function(e,n){return"referenced"===n.linkStyle&&"A"===e.nodeName&&e.getAttribute("href")},replacement:function(e,n,t){var r,i,o=n.getAttribute("href"),a=u(n.getAttribute("title"));switch(a&&(a=' "'+a+'"'),t.linkReferenceStyle){case"collapsed":r="["+e+"][]",i="["+e+"]: "+o+a;break;case"shortcut":r="["+e+"]",i="["+e+"]: "+o+a;break;default:var l=this.references.length+1;r="["+e+"]["+l+"]",i="["+l+"]: "+o+a}return this.references.push(i),r},references:[],append:function(e){var n="";return this.references.length&&(n="\n\n"+this.references.join("\n")+"\n\n",this.references=[]),n}},c.emphasis={filter:["em","i"],replacement:function(e,n,t){return e.trim()?t.emDelimiter+e+t.emDelimiter:""}},c.strong={filter:["strong","b"],replacement:function(e,n,t){return e.trim()?t.strongDelimiter+e+t.strongDelimiter:""}},c.code={filter:function(e){var n=e.previousSibling||e.nextSibling,t="PRE"===e.parentNode.nodeName&&!n;return"CODE"===e.nodeName&&!t},replacement:function(e){if(!e)return"";e=e.replace(/\r?\n|\r/g," ");for(var n=/^`|^ .*?[^ ].* $|`$/.test(e)?" ":"",t="`",r=e.match(/`+/gm)||[];-1!==r.indexOf(t);)t+="`";return t+n+e+n+t}},c.image={filter:"img",replacement:function(e,n){var t=u(n.getAttribute("alt")),r=n.getAttribute("src")||"",i=u(n.getAttribute("title"));return r?"!["+t+"]("+r+(i?' "'+i+'"':"")+")":""}},s.prototype={add:function(e,n){this.array.unshift(n)},keep:function(e){this._keep.unshift({filter:e,replacement:this.keepReplacement})},remove:function(e){this._remove.unshift({filter:e,replacement:function(){return""}})},forNode:function(e){return e.isBlank?this.blankRule:(n=f(this.array,e,this.options))||(n=f(this._keep,e,this.options))||(n=f(this._remove,e,this.options))?n:this.defaultRule;var n},forEach:function(e){for(var n=0;n<this.array.length;n++)e(this.array[n],n)}};var g,h,y="undefined"!=typeof window?window:{},v=function(){var e=y.DOMParser,n=!1;try{(new e).parseFromString("","text/html")&&(n=!0)}catch(e){}return n}()?y.DOMParser:(g=function(){},function(){var e=!1;try{document.implementation.createHTMLDocument("").open()}catch(n){window.ActiveXObject&&(e=!0)}return e}()?g.prototype.parseFromString=function(e){var n=new window.ActiveXObject("htmlfile");return n.designMode="on",n.open(),n.write(e),n.close(),n}:g.prototype.parseFromString=function(e){var n=document.implementation.createHTMLDocument("");return n.open(),n.write(e),n.close(),n},g);function b(e,n){var r;return function(e){var n=e.element,t=e.isBlock,r=e.isVoid,i=e.isPre||function(e){return"PRE"===e.nodeName};if(n.firstChild&&!i(n)){for(var o=null,a=!1,l=null,c=m(l,n,i);c!==n;){if(3===c.nodeType||4===c.nodeType){var u=c.data.replace(/[ \r\n\t]+/g," ");if(o&&!/ $/.test(o.data)||a||" "!==u[0]||(u=u.substr(1)),!u){c=p(c);continue}c.data=u,o=c}else{if(1!==c.nodeType){c=p(c);continue}t(c)||"BR"===c.nodeName?(o&&(o.data=o.data.replace(/ $/,"")),o=null,a=!1):r(c)||i(c)?(o=null,a=!0):o&&(a=!1)}var s=m(l,c,i);l=c,c=s}o&&(o.data=o.data.replace(/ $/,""),o.data||p(o))}}({element:r="string"==typeof e?(h=h||new v).parseFromString('<x-turndown id="turndown-root">'+e+"</x-turndown>","text/html").getElementById("turndown-root"):e.cloneNode(!0),isBlock:t,isVoid:i,isPre:n.preformattedCode?A:null}),r}function A(e){return"PRE"===e.nodeName||"CODE"===e.nodeName}function E(e,n){return e.isBlock=t(e),e.isCode="CODE"===e.nodeName||e.parentNode.isCode,e.isBlank=function(e){return!i(e)&&!function(e){return a(e,o)}(e)&&/^\s*$/i.test(e.textContent)&&!function(e){return l(e,r)}(e)&&!function(e){return l(e,o)}(e)}(e),e.flankingWhitespace=function(e,n){if(e.isBlock||n.preformattedCode&&e.isCode)return{leading:"",trailing:""};var t,r={leading:(t=e.textContent.match(/^(([ \t\r\n]*)(\s*))(?:(?=\S)[\s\S]*\S)?((\s*?)([ \t\r\n]*))$/))[1],leadingAscii:t[2],leadingNonAscii:t[3],trailing:t[4],trailingNonAscii:t[5],trailingAscii:t[6]};return r.leadingAscii&&k("left",e,n)&&(r.leading=r.leadingNonAscii),r.trailingAscii&&k("right",e,n)&&(r.trailing=r.trailingNonAscii),{leading:r.leading,trailing:r.trailing}}(e,n),e}function k(e,n,r){var i,o,a;return"left"===e?(i=n.previousSibling,o=/ $/):(i=n.nextSibling,o=/^ /),i&&(3===i.nodeType?a=o.test(i.nodeValue):r.preformattedCode&&"CODE"===i.nodeName?a=!1:1!==i.nodeType||t(i)||(a=o.test(i.textContent))),a}var N=Array.prototype.reduce,C=[[/\\/g,"\\\\"],[/\*/g,"\\*"],[/^-/g,"\\-"],[/^\+ /g,"\\+ "],[/^(=+)/g,"\\$1"],[/^(#{1,6}) /g,"\\$1 "],[/`/g,"\\`"],[/^~~~/g,"\\~~~"],[/\[/g,"\\["],[/\]/g,"\\]"],[/^>/g,"\\>"],[/_/g,"\\_"],[/^(\d+)\. /g,"$1\\. "]];function T(e){if(!(this instanceof T))return new T(e);var n={rules:c,headingStyle:"setext",hr:"* * *",bulletListMarker:"*",codeBlockStyle:"indented",fence:"```",emDelimiter:"_",strongDelimiter:"**",linkStyle:"inlined",linkReferenceStyle:"full",br:"  ",preformattedCode:!1,blankReplacement:function(e,n){return n.isBlock?"\n\n":""},keepReplacement:function(e,n){return n.isBlock?"\n\n"+n.outerHTML+"\n\n":n.outerHTML},defaultReplacement:function(e,n){return n.isBlock?"\n\n"+e+"\n\n":e}};this.options=function(e){for(var n=1;n<arguments.length;n++){var t=arguments[n];for(var r in t)t.hasOwnProperty(r)&&(e[r]=t[r])}return e}({},n,e),this.rules=new s(this.options)}function R(e){var n=this;return N.call(e.childNodes,(function(e,t){var r="";return 3===(t=new E(t,n.options)).nodeType?r=t.isCode?t.nodeValue:n.escape(t.nodeValue):1===t.nodeType&&(r=w.call(n,t)),D(e,r)}),"")}function S(e){var n=this;return this.rules.forEach((function(t){"function"==typeof t.append&&(e=D(e,t.append(n.options)))})),e.replace(/^[\t\r\n]+/,"").replace(/[\t\r\n\s]+$/,"")}function w(e){var n=this.rules.forNode(e),t=R.call(this,e),r=e.flankingWhitespace;return(r.leading||r.trailing)&&(t=t.trim()),r.leading+n.replacement(t,e,this.options)+r.trailing}function D(e,n){var t=function(e){for(var n=e.length;n>0&&"\n"===e[n-1];)n--;return e.substring(0,n)}(e),r=n.replace(/^\n*/,""),i=Math.max(e.length-t.length,n.length-r.length);return t+"\n\n".substring(0,i)+r}T.prototype={turndown:function(e){if(!function(e){return null!=e&&("string"==typeof e||e.nodeType&&(1===e.nodeType||9===e.nodeType||11===e.nodeType))}(e))throw new TypeError(e+" is not a string, or an element/document/fragment node.");if(""===e)return"";var n=R.call(this,new b(e,this.options));return S.call(this,n)},use:function(e){if(Array.isArray(e))for(var n=0;n<e.length;n++)this.use(e[n]);else{if("function"!=typeof e)throw new TypeError("plugin must be a Function or an Array of Functions");e(this)}return this},addRule:function(e,n){return this.rules.add(e,n),this},keep:function(e){return this.rules.keep(e),this},remove:function(e){return this.rules.remove(e),this},escape:function(e){return C.reduce((function(e,n){return e.replace(n[0],n[1])}),e)}};const O=T,x=".min-h-\\[20px\\].flex.flex-col.items-start.gap-4.whitespace-pre-wrap",L="selected-user-lightblue",B="selected-model-lightblue";function M(e,n){return e.querySelector(n).innerHTML}function I(e){return e.split("\n").map((e=>"> "+e)).join("\n")}document.body.addEventListener("click",(e=>{const n=e.target;(function(e,n){const t="group w-full text-gray-800 dark:text-gray-100 border-b border-black/10 dark:border-gray-900/50 dark:bg-gray-800".split(" "),r=[...e.classList];return t.every((e=>r.includes(e)))})(n)&&(n.classList.toggle(L),n.nextElementSibling.classList.toggle(B),function(){const e=document.querySelectorAll("."+L),n=function(){const e=document.querySelector(".flex.w-full.items-center.justify-center.gap-1.border-b.border-black\\/10.bg-gray-50.p-3.text-gray-500.dark\\:border-gray-900\\/50.dark\\:bg-gray-700.dark\\:text-gray-300");if(!e)return void console.error("Model information element not found.");return e.textContent.match(/Model: (.+)$/)[1].replace(/"(.+)"|Default \((.+)\)/,"$1$2")}();let t="## Relevant conversation with "+n+"\n\n";const r=new O;(function(e){e.addRule("codeBlock",{filter:["pre"],replacement:function(e,n){const t=n.querySelector("code"),r=(t.getAttribute("class")||"").match(/language-(\w+)/);return"\n```"+(r?r[1]:"")+"\n"+t.textContent+"\n```\n"}})})(r),e.forEach((e=>{M(e,x);const i=M(e.nextElementSibling,".markdown.prose.w-full.break-words.dark\\:prose-invert.light"),o=e.querySelector(x).textContent,a=r.turndown(i),l=I(o),c=I(a);t+=`### Me:\n${l}\n\n### ${n}:\n${c}\n\n`})),function(e){const n=document.createElement("textarea");n.value=e,document.body.appendChild(n),n.select(),document.execCommand("copy"),document.body.removeChild(n)}(t),console.log(`Copied user and model messages to clipboard: "${t}"`)}())})),document.addEventListener("keydown",(e=>{e.ctrlKey&&e.shiftKey&&"KeyX"===e.code&&function(){const e=document.querySelectorAll("."+L),n=document.querySelectorAll("."+B);e.forEach((e=>{e.classList.remove(L)})),n.forEach((e=>{e.classList.remove(B)}))}()}))})();