"use strict";var Ba=Object.create;var gt=Object.defineProperty;var Tn=Object.getOwnPropertyDescriptor;var ja=Object.getOwnPropertyNames;var $a=Object.getPrototypeOf,za=Object.prototype.hasOwnProperty;var F=(e,t)=>()=>(t||e((t={exports:{}}).exports,t),t.exports),Ua=(e,t)=>{for(var r in t)gt(e,r,{get:t[r],enumerable:!0})},En=(e,t,r,n)=>{if(t&&typeof t=="object"||typeof t=="function")for(let i of ja(t))!za.call(e,i)&&i!==r&&gt(e,i,{get:()=>t[i],enumerable:!(n=Tn(t,i))||n.enumerable});return e};var Lt=(e,t,r)=>(r=e!=null?Ba($a(e)):{},En(t||!e||!e.__esModule?gt(r,"default",{value:e,enumerable:!0}):r,e)),qa=e=>En(gt({},"__esModule",{value:!0}),e),L=(e,t,r,n)=>{for(var i=n>1?void 0:n?Tn(t,r):t,o=e.length-1,a;o>=0;o--)(a=e[o])&&(i=(n?a(t,r,i):a(i))||i);return n&&i&&gt(t,r,i),i},A=(e,t)=>(r,n)=>t(r,n,e);var _r=F(()=>{var Pn;(function(e){(function(t){var r=typeof globalThis=="object"?globalThis:typeof global=="object"?global:typeof self=="object"?self:typeof this=="object"?this:s(),n=i(e);typeof r.Reflect<"u"&&(n=i(r.Reflect,n)),t(n,r),typeof r.Reflect>"u"&&(r.Reflect=e);function i(l,c){return function(d,g){Object.defineProperty(l,d,{configurable:!0,writable:!0,value:g}),c&&c(d,g)}}function o(){try{return Function("return this;")()}catch{}}function a(){try{return(0,eval)("(function() { return this; })()")}catch{}}function s(){return o()||a()}})(function(t,r){var n=Object.prototype.hasOwnProperty,i=typeof Symbol=="function",o=i&&typeof Symbol.toPrimitive<"u"?Symbol.toPrimitive:"@@toPrimitive",a=i&&typeof Symbol.iterator<"u"?Symbol.iterator:"@@iterator",s=typeof Object.create=="function",l={__proto__:[]}instanceof Array,c=!s&&!l,d={create:s?function(){return Ar(Object.create(null))}:l?function(){return Ar({__proto__:null})}:function(){return Ar({})},has:c?function(u,p){return n.call(u,p)}:function(u,p){return p in u},get:c?function(u,p){return n.call(u,p)?u[p]:void 0}:function(u,p){return u[p]}},g=Object.getPrototypeOf(Function),v=typeof Map=="function"&&typeof Map.prototype.entries=="function"?Map:Oa(),b=typeof Set=="function"&&typeof Set.prototype.entries=="function"?Set:Ma(),P=typeof WeakMap=="function"?WeakMap:Na(),H=i?Symbol.for("@reflect-metadata:registry"):void 0,R=Fa(),ee=La(R);function D(u,p,f,m){if(I(f)){if(!hn(u))throw new TypeError;if(!mn(p))throw new TypeError;return an(u,p)}else{if(!hn(u))throw new TypeError;if(!j(p))throw new TypeError;if(!j(m)&&!I(m)&&!He(m))throw new TypeError;return He(m)&&(m=void 0),f=se(f),Pa(u,p,f,m)}}t("decorate",D);function W(u,p){function f(m,E){if(!j(m))throw new TypeError;if(!I(E)&&!Ra(E))throw new TypeError;dn(u,p,m,E)}return f}t("metadata",W);function ue(u,p,f,m){if(!j(f))throw new TypeError;return I(m)||(m=se(m)),dn(u,p,f,m)}t("defineMetadata",ue);function pe(u,p,f){if(!j(p))throw new TypeError;return I(f)||(f=se(f)),sn(u,p,f)}t("hasMetadata",pe);function ae(u,p,f){if(!j(p))throw new TypeError;return I(f)||(f=se(f)),Pr(u,p,f)}t("hasOwnMetadata",ae);function on(u,p,f){if(!j(p))throw new TypeError;return I(f)||(f=se(f)),ln(u,p,f)}t("getMetadata",on);function we(u,p,f){if(!j(p))throw new TypeError;return I(f)||(f=se(f)),cn(u,p,f)}t("getOwnMetadata",we);function te(u,p){if(!j(u))throw new TypeError;return I(p)||(p=se(p)),un(u,p)}t("getMetadataKeys",te);function Se(u,p){if(!j(u))throw new TypeError;return I(p)||(p=se(p)),pn(u,p)}t("getOwnMetadataKeys",Se);function Er(u,p,f){if(!j(p))throw new TypeError;if(I(f)||(f=se(f)),!j(p))throw new TypeError;I(f)||(f=se(f));var m=pt(p,f,!1);return I(m)?!1:m.OrdinaryDeleteMetadata(u,p,f)}t("deleteMetadata",Er);function an(u,p){for(var f=u.length-1;f>=0;--f){var m=u[f],E=m(p);if(!I(E)&&!He(E)){if(!mn(E))throw new TypeError;p=E}}return p}function Pa(u,p,f,m){for(var E=u.length-1;E>=0;--E){var $=u[E],q=$(p,f,m);if(!I(q)&&!He(q)){if(!j(q))throw new TypeError;m=q}}return m}function sn(u,p,f){var m=Pr(u,p,f);if(m)return!0;var E=kr(p);return He(E)?!1:sn(u,E,f)}function Pr(u,p,f){var m=pt(p,f,!1);return I(m)?!1:fn(m.OrdinaryHasOwnMetadata(u,p,f))}function ln(u,p,f){var m=Pr(u,p,f);if(m)return cn(u,p,f);var E=kr(p);if(!He(E))return ln(u,E,f)}function cn(u,p,f){var m=pt(p,f,!1);if(!I(m))return m.OrdinaryGetOwnMetadata(u,p,f)}function dn(u,p,f,m){var E=pt(f,m,!0);E.OrdinaryDefineOwnMetadata(u,p,f,m)}function un(u,p){var f=pn(u,p),m=kr(u);if(m===null)return f;var E=un(m,p);if(E.length<=0)return f;if(f.length<=0)return E;for(var $=new b,q=[],M=0,y=f;M<y.length;M++){var x=y[M],w=$.has(x);w||($.add(x),q.push(x))}for(var S=0,N=E;S<N.length;S++){var x=N[S],w=$.has(x);w||($.add(x),q.push(x))}return q}function pn(u,p){var f=pt(u,p,!1);return f?f.OrdinaryOwnMetadataKeys(u,p):[]}function gn(u){if(u===null)return 1;switch(typeof u){case"undefined":return 0;case"boolean":return 2;case"string":return 3;case"symbol":return 4;case"number":return 5;case"object":return u===null?1:6;default:return 6}}function I(u){return u===void 0}function He(u){return u===null}function Ca(u){return typeof u=="symbol"}function j(u){return typeof u=="object"?u!==null:typeof u=="function"}function ka(u,p){switch(gn(u)){case 0:return u;case 1:return u;case 2:return u;case 3:return u;case 4:return u;case 5:return u}var f=p===3?"string":p===5?"number":"default",m=vn(u,o);if(m!==void 0){var E=m.call(u,f);if(j(E))throw new TypeError;return E}return Aa(u,f==="default"?"number":f)}function Aa(u,p){if(p==="string"){var f=u.toString;if(Oe(f)){var m=f.call(u);if(!j(m))return m}var E=u.valueOf;if(Oe(E)){var m=E.call(u);if(!j(m))return m}}else{var E=u.valueOf;if(Oe(E)){var m=E.call(u);if(!j(m))return m}var $=u.toString;if(Oe($)){var m=$.call(u);if(!j(m))return m}}throw new TypeError}function fn(u){return!!u}function _a(u){return""+u}function se(u){var p=ka(u,3);return Ca(p)?p:_a(p)}function hn(u){return Array.isArray?Array.isArray(u):u instanceof Object?u instanceof Array:Object.prototype.toString.call(u)==="[object Array]"}function Oe(u){return typeof u=="function"}function mn(u){return typeof u=="function"}function Ra(u){switch(gn(u)){case 3:return!0;case 4:return!0;default:return!1}}function Cr(u,p){return u===p||u!==u&&p!==p}function vn(u,p){var f=u[p];if(f!=null){if(!Oe(f))throw new TypeError;return f}}function bn(u){var p=vn(u,a);if(!Oe(p))throw new TypeError;var f=p.call(u);if(!j(f))throw new TypeError;return f}function yn(u){return u.value}function xn(u){var p=u.next();return p.done?!1:p}function wn(u){var p=u.return;p&&p.call(u)}function kr(u){var p=Object.getPrototypeOf(u);if(typeof u!="function"||u===g||p!==g)return p;var f=u.prototype,m=f&&Object.getPrototypeOf(f);if(m==null||m===Object.prototype)return p;var E=m.constructor;return typeof E!="function"||E===u?p:E}function Ia(){var u;!I(H)&&typeof r.Reflect<"u"&&!(H in r.Reflect)&&typeof r.Reflect.defineMetadata=="function"&&(u=Ha(r.Reflect));var p,f,m,E=new P,$={registerProvider:q,getProvider:y,setProvider:w};return $;function q(S){if(!Object.isExtensible($))throw new Error("Cannot add provider to a frozen registry.");switch(!0){case u===S:break;case I(p):p=S;break;case p===S:break;case I(f):f=S;break;case f===S:break;default:m===void 0&&(m=new b),m.add(S);break}}function M(S,N){if(!I(p)){if(p.isProviderFor(S,N))return p;if(!I(f)){if(f.isProviderFor(S,N))return p;if(!I(m))for(var G=bn(m);;){var z=xn(G);if(!z)return;var oe=yn(z);if(oe.isProviderFor(S,N))return wn(G),oe}}}if(!I(u)&&u.isProviderFor(S,N))return u}function y(S,N){var G=E.get(S),z;return I(G)||(z=G.get(N)),I(z)&&(z=M(S,N),I(z)||(I(G)&&(G=new v,E.set(S,G)),G.set(N,z))),z}function x(S){if(I(S))throw new TypeError;return p===S||f===S||!I(m)&&m.has(S)}function w(S,N,G){if(!x(G))throw new Error("Metadata provider not registered.");var z=y(S,N);if(z!==G){if(!I(z))return!1;var oe=E.get(S);I(oe)&&(oe=new v,E.set(S,oe)),oe.set(N,G)}return!0}}function Fa(){var u;return!I(H)&&j(r.Reflect)&&Object.isExtensible(r.Reflect)&&(u=r.Reflect[H]),I(u)&&(u=Ia()),!I(H)&&j(r.Reflect)&&Object.isExtensible(r.Reflect)&&Object.defineProperty(r.Reflect,H,{enumerable:!1,configurable:!1,writable:!1,value:u}),u}function La(u){var p=new P,f={isProviderFor:function(x,w){var S=p.get(x);return I(S)?!1:S.has(w)},OrdinaryDefineOwnMetadata:q,OrdinaryHasOwnMetadata:E,OrdinaryGetOwnMetadata:$,OrdinaryOwnMetadataKeys:M,OrdinaryDeleteMetadata:y};return R.registerProvider(f),f;function m(x,w,S){var N=p.get(x),G=!1;if(I(N)){if(!S)return;N=new v,p.set(x,N),G=!0}var z=N.get(w);if(I(z)){if(!S)return;if(z=new v,N.set(w,z),!u.setProvider(x,w,f))throw N.delete(w),G&&p.delete(x),new Error("Wrong provider for target.")}return z}function E(x,w,S){var N=m(w,S,!1);return I(N)?!1:fn(N.has(x))}function $(x,w,S){var N=m(w,S,!1);if(!I(N))return N.get(x)}function q(x,w,S,N){var G=m(S,N,!0);G.set(x,w)}function M(x,w){var S=[],N=m(x,w,!1);if(I(N))return S;for(var G=N.keys(),z=bn(G),oe=0;;){var Sn=xn(z);if(!Sn)return S.length=oe,S;var Da=yn(Sn);try{S[oe]=Da}catch(Ga){try{wn(z)}finally{throw Ga}}oe++}}function y(x,w,S){var N=m(w,S,!1);if(I(N)||!N.delete(x))return!1;if(N.size===0){var G=p.get(w);I(G)||(G.delete(S),G.size===0&&p.delete(G))}return!0}}function Ha(u){var p=u.defineMetadata,f=u.hasOwnMetadata,m=u.getOwnMetadata,E=u.getOwnMetadataKeys,$=u.deleteMetadata,q=new P,M={isProviderFor:function(y,x){var w=q.get(y);return!I(w)&&w.has(x)?!0:E(y,x).length?(I(w)&&(w=new b,q.set(y,w)),w.add(x),!0):!1},OrdinaryDefineOwnMetadata:p,OrdinaryHasOwnMetadata:f,OrdinaryGetOwnMetadata:m,OrdinaryOwnMetadataKeys:E,OrdinaryDeleteMetadata:$};return M}function pt(u,p,f){var m=R.getProvider(u,p);if(!I(m))return m;if(f){if(R.setProvider(u,p,ee))return ee;throw new Error("Illegal state.")}}function Oa(){var u={},p=[],f=(function(){function M(y,x,w){this._index=0,this._keys=y,this._values=x,this._selector=w}return M.prototype["@@iterator"]=function(){return this},M.prototype[a]=function(){return this},M.prototype.next=function(){var y=this._index;if(y>=0&&y<this._keys.length){var x=this._selector(this._keys[y],this._values[y]);return y+1>=this._keys.length?(this._index=-1,this._keys=p,this._values=p):this._index++,{value:x,done:!1}}return{value:void 0,done:!0}},M.prototype.throw=function(y){throw this._index>=0&&(this._index=-1,this._keys=p,this._values=p),y},M.prototype.return=function(y){return this._index>=0&&(this._index=-1,this._keys=p,this._values=p),{value:y,done:!0}},M})(),m=(function(){function M(){this._keys=[],this._values=[],this._cacheKey=u,this._cacheIndex=-2}return Object.defineProperty(M.prototype,"size",{get:function(){return this._keys.length},enumerable:!0,configurable:!0}),M.prototype.has=function(y){return this._find(y,!1)>=0},M.prototype.get=function(y){var x=this._find(y,!1);return x>=0?this._values[x]:void 0},M.prototype.set=function(y,x){var w=this._find(y,!0);return this._values[w]=x,this},M.prototype.delete=function(y){var x=this._find(y,!1);if(x>=0){for(var w=this._keys.length,S=x+1;S<w;S++)this._keys[S-1]=this._keys[S],this._values[S-1]=this._values[S];return this._keys.length--,this._values.length--,Cr(y,this._cacheKey)&&(this._cacheKey=u,this._cacheIndex=-2),!0}return!1},M.prototype.clear=function(){this._keys.length=0,this._values.length=0,this._cacheKey=u,this._cacheIndex=-2},M.prototype.keys=function(){return new f(this._keys,this._values,E)},M.prototype.values=function(){return new f(this._keys,this._values,$)},M.prototype.entries=function(){return new f(this._keys,this._values,q)},M.prototype["@@iterator"]=function(){return this.entries()},M.prototype[a]=function(){return this.entries()},M.prototype._find=function(y,x){if(!Cr(this._cacheKey,y)){this._cacheIndex=-1;for(var w=0;w<this._keys.length;w++)if(Cr(this._keys[w],y)){this._cacheIndex=w;break}}return this._cacheIndex<0&&x&&(this._cacheIndex=this._keys.length,this._keys.push(y),this._values.push(void 0)),this._cacheIndex},M})();return m;function E(M,y){return M}function $(M,y){return y}function q(M,y){return[M,y]}}function Ma(){var u=(function(){function p(){this._map=new v}return Object.defineProperty(p.prototype,"size",{get:function(){return this._map.size},enumerable:!0,configurable:!0}),p.prototype.has=function(f){return this._map.has(f)},p.prototype.add=function(f){return this._map.set(f,f),this},p.prototype.delete=function(f){return this._map.delete(f)},p.prototype.clear=function(){this._map.clear()},p.prototype.keys=function(){return this._map.keys()},p.prototype.values=function(){return this._map.keys()},p.prototype.entries=function(){return this._map.entries()},p.prototype["@@iterator"]=function(){return this.keys()},p.prototype[a]=function(){return this.keys()},p})();return u}function Na(){var u=16,p=d.create(),f=m();return(function(){function y(){this._key=m()}return y.prototype.has=function(x){var w=E(x,!1);return w!==void 0?d.has(w,this._key):!1},y.prototype.get=function(x){var w=E(x,!1);return w!==void 0?d.get(w,this._key):void 0},y.prototype.set=function(x,w){var S=E(x,!0);return S[this._key]=w,this},y.prototype.delete=function(x){var w=E(x,!1);return w!==void 0?delete w[this._key]:!1},y.prototype.clear=function(){this._key=m()},y})();function m(){var y;do y="@@WeakMap@@"+M();while(d.has(p,y));return p[y]=!0,y}function E(y,x){if(!n.call(y,f)){if(!x)return;Object.defineProperty(y,f,{value:d.create()})}return y[f]}function $(y,x){for(var w=0;w<x;++w)y[w]=Math.random()*255|0;return y}function q(y){if(typeof Uint8Array=="function"){var x=new Uint8Array(y);return typeof crypto<"u"?crypto.getRandomValues(x):typeof msCrypto<"u"?msCrypto.getRandomValues(x):$(x,y),x}return $(new Array(y),y)}function M(){var y=q(u);y[6]=y[6]&79|64,y[8]=y[8]&191|128;for(var x="",w=0;w<u;++w){var S=y[w];(w===4||w===6||w===8)&&(x+="-"),S<16&&(x+="0"),x+=S.toString(16).toLowerCase()}return x}}function Ar(u){return u.__=void 0,delete u.__,u}})})(Pn||(Pn={}))});var Bn=F(()=>{});var wt=F((nf,$n)=>{var ss=Object.prototype.toString;$n.exports=function(t){if(t===void 0)return"undefined";if(t===null)return"null";var r=typeof t;if(r==="boolean")return"boolean";if(r==="string")return"string";if(r==="number")return"number";if(r==="symbol")return"symbol";if(r==="function")return ps(t)?"generatorfunction":"function";if(ls(t))return"array";if(hs(t))return"buffer";if(fs(t))return"arguments";if(ds(t))return"date";if(cs(t))return"error";if(us(t))return"regexp";switch(jn(t)){case"Symbol":return"symbol";case"Promise":return"promise";case"WeakMap":return"weakmap";case"WeakSet":return"weakset";case"Map":return"map";case"Set":return"set";case"Int8Array":return"int8array";case"Uint8Array":return"uint8array";case"Uint8ClampedArray":return"uint8clampedarray";case"Int16Array":return"int16array";case"Uint16Array":return"uint16array";case"Int32Array":return"int32array";case"Uint32Array":return"uint32array";case"Float32Array":return"float32array";case"Float64Array":return"float64array"}if(gs(t))return"generator";switch(r=ss.call(t),r){case"[object Object]":return"object";case"[object Map Iterator]":return"mapiterator";case"[object Set Iterator]":return"setiterator";case"[object String Iterator]":return"stringiterator";case"[object Array Iterator]":return"arrayiterator"}return r.slice(8,-1).toLowerCase().replace(/\s/g,"")};function jn(e){return typeof e.constructor=="function"?e.constructor.name:null}function ls(e){return Array.isArray?Array.isArray(e):e instanceof Array}function cs(e){return e instanceof Error||typeof e.message=="string"&&e.constructor&&typeof e.constructor.stackTraceLimit=="number"}function ds(e){return e instanceof Date?!0:typeof e.toDateString=="function"&&typeof e.getDate=="function"&&typeof e.setDate=="function"}function us(e){return e instanceof RegExp?!0:typeof e.flags=="string"&&typeof e.ignoreCase=="boolean"&&typeof e.multiline=="boolean"&&typeof e.global=="boolean"}function ps(e,t){return jn(e)==="GeneratorFunction"}function gs(e){return typeof e.throw=="function"&&typeof e.return=="function"&&typeof e.next=="function"}function fs(e){try{if(typeof e.length=="number"&&typeof e.callee=="function")return!0}catch(t){if(t.message.indexOf("callee")!==-1)return!0}return!1}function hs(e){return e.constructor&&typeof e.constructor.isBuffer=="function"?e.constructor.isBuffer(e):!1}});var Un=F((of,zn)=>{"use strict";zn.exports=function(t){return typeof t<"u"&&t!==null&&(typeof t=="object"||typeof t=="function")}});var Kn=F((af,Vn)=>{"use strict";var qn=Un();Vn.exports=function(t){qn(t)||(t={});for(var r=arguments.length,n=1;n<r;n++){var i=arguments[n];qn(i)&&ms(t,i)}return t};function ms(e,t){for(var r in t)vs(t,r)&&(e[r]=t[r])}function vs(e,t){return Object.prototype.hasOwnProperty.call(e,t)}});var Xn=F((sf,Wn)=>{"use strict";var bs=wt(),ys=Kn();Wn.exports=function(e,t){typeof t=="function"&&(t={parse:t});var r=ws(e),n={section_delimiter:"---",parse:Ts},i=ys({},n,t),o=i.section_delimiter,a=r.content.split(/\r?\n/),s=null,l=Yn(),c=[],d=[];function g(ee){r.content=ee,s=[],c=[]}function v(ee){d.length&&(l.key=Ss(d[0],o),l.content=ee,i.parse(l,s),s.push(l),l=Yn(),c=[],d=[])}for(var b=0;b<a.length;b++){var P=a[b],H=d.length,R=P.trim();if(xs(R,o)){if(R.length===3&&b!==0){if(H===0||H===2){c.push(P);continue}d.push(R),l.data=c.join(`
`),c=[];continue}s===null&&g(c.join(`
`)),H===2&&v(c.join(`
`)),d.push(R);continue}c.push(P)}return s===null?g(c.join(`
`)):v(c.join(`
`)),r.sections=s,r};function xs(e,t){return!(e.slice(0,t.length)!==t||e.charAt(t.length+1)===t.slice(-1))}function ws(e){if(bs(e)!=="object"&&(e={content:e}),typeof e.content!="string"&&!Es(e.content))throw new TypeError("expected a buffer or string");return e.content=e.content.toString(),e.sections=[],e}function Ss(e,t){return e?e.slice(t.length).trim():""}function Yn(){return{key:"",data:"",content:""}}function Ts(e){return e}function Es(e){return e&&e.constructor&&typeof e.constructor.isBuffer=="function"?e.constructor.isBuffer(e):!1}});var Ce=F((lf,Pe)=>{"use strict";function Jn(e){return typeof e>"u"||e===null}function Ps(e){return typeof e=="object"&&e!==null}function Cs(e){return Array.isArray(e)?e:Jn(e)?[]:[e]}function ks(e,t){var r,n,i,o;if(t)for(o=Object.keys(t),r=0,n=o.length;r<n;r+=1)i=o[r],e[i]=t[i];return e}function As(e,t){var r="",n;for(n=0;n<t;n+=1)r+=e;return r}function _s(e){return e===0&&Number.NEGATIVE_INFINITY===1/e}Pe.exports.isNothing=Jn;Pe.exports.isObject=Ps;Pe.exports.toArray=Cs;Pe.exports.repeat=As;Pe.exports.isNegativeZero=_s;Pe.exports.extend=ks});var We=F((cf,Qn)=>{"use strict";function St(e,t){Error.call(this),this.name="YAMLException",this.reason=e,this.mark=t,this.message=(this.reason||"(unknown reason)")+(this.mark?" "+this.mark.toString():""),Error.captureStackTrace?Error.captureStackTrace(this,this.constructor):this.stack=new Error().stack||""}St.prototype=Object.create(Error.prototype);St.prototype.constructor=St;St.prototype.toString=function(t){var r=this.name+": ";return r+=this.reason||"(unknown reason)",!t&&this.mark&&(r+=" "+this.mark.toString()),r};Qn.exports=St});var ti=F((df,ei)=>{"use strict";var Zn=Ce();function Gr(e,t,r,n,i){this.name=e,this.buffer=t,this.position=r,this.line=n,this.column=i}Gr.prototype.getSnippet=function(t,r){var n,i,o,a,s;if(!this.buffer)return null;for(t=t||4,r=r||75,n="",i=this.position;i>0&&`\0\r
\x85\u2028\u2029`.indexOf(this.buffer.charAt(i-1))===-1;)if(i-=1,this.position-i>r/2-1){n=" ... ",i+=5;break}for(o="",a=this.position;a<this.buffer.length&&`\0\r
\x85\u2028\u2029`.indexOf(this.buffer.charAt(a))===-1;)if(a+=1,a-this.position>r/2-1){o=" ... ",a-=5;break}return s=this.buffer.slice(i,a),Zn.repeat(" ",t)+n+s+o+`
`+Zn.repeat(" ",t+this.position-i+n.length)+"^"};Gr.prototype.toString=function(t){var r,n="";return this.name&&(n+='in "'+this.name+'" '),n+="at line "+(this.line+1)+", column "+(this.column+1),t||(r=this.getSnippet(),r&&(n+=`:
`+r)),n};ei.exports=Gr});var V=F((uf,ni)=>{"use strict";var ri=We(),Rs=["kind","resolve","construct","instanceOf","predicate","represent","defaultStyle","styleAliases"],Is=["scalar","sequence","mapping"];function Fs(e){var t={};return e!==null&&Object.keys(e).forEach(function(r){e[r].forEach(function(n){t[String(n)]=r})}),t}function Ls(e,t){if(t=t||{},Object.keys(t).forEach(function(r){if(Rs.indexOf(r)===-1)throw new ri('Unknown option "'+r+'" is met in definition of "'+e+'" YAML type.')}),this.tag=e,this.kind=t.kind||null,this.resolve=t.resolve||function(){return!0},this.construct=t.construct||function(r){return r},this.instanceOf=t.instanceOf||null,this.predicate=t.predicate||null,this.represent=t.represent||null,this.defaultStyle=t.defaultStyle||null,this.styleAliases=Fs(t.styleAliases||null),Is.indexOf(this.kind)===-1)throw new ri('Unknown kind "'+this.kind+'" is specified for "'+e+'" YAML type.')}ni.exports=Ls});var ke=F((pf,oi)=>{"use strict";var ii=Ce(),Nt=We(),Hs=V();function Br(e,t,r){var n=[];return e.include.forEach(function(i){r=Br(i,t,r)}),e[t].forEach(function(i){r.forEach(function(o,a){o.tag===i.tag&&o.kind===i.kind&&n.push(a)}),r.push(i)}),r.filter(function(i,o){return n.indexOf(o)===-1})}function Os(){var e={scalar:{},sequence:{},mapping:{},fallback:{}},t,r;function n(i){e[i.kind][i.tag]=e.fallback[i.tag]=i}for(t=0,r=arguments.length;t<r;t+=1)arguments[t].forEach(n);return e}function Xe(e){this.include=e.include||[],this.implicit=e.implicit||[],this.explicit=e.explicit||[],this.implicit.forEach(function(t){if(t.loadKind&&t.loadKind!=="scalar")throw new Nt("There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.")}),this.compiledImplicit=Br(this,"implicit",[]),this.compiledExplicit=Br(this,"explicit",[]),this.compiledTypeMap=Os(this.compiledImplicit,this.compiledExplicit)}Xe.DEFAULT=null;Xe.create=function(){var t,r;switch(arguments.length){case 1:t=Xe.DEFAULT,r=arguments[0];break;case 2:t=arguments[0],r=arguments[1];break;default:throw new Nt("Wrong number of arguments for Schema.create function")}if(t=ii.toArray(t),r=ii.toArray(r),!t.every(function(n){return n instanceof Xe}))throw new Nt("Specified list of super schemas (or a single Schema object) contains a non-Schema object.");if(!r.every(function(n){return n instanceof Hs}))throw new Nt("Specified list of YAML types (or a single Type object) contains a non-Type object.");return new Xe({include:t,explicit:r})};oi.exports=Xe});var si=F((gf,ai)=>{"use strict";var Ms=V();ai.exports=new Ms("tag:yaml.org,2002:str",{kind:"scalar",construct:function(e){return e!==null?e:""}})});var ci=F((ff,li)=>{"use strict";var Ns=V();li.exports=new Ns("tag:yaml.org,2002:seq",{kind:"sequence",construct:function(e){return e!==null?e:[]}})});var ui=F((hf,di)=>{"use strict";var Ds=V();di.exports=new Ds("tag:yaml.org,2002:map",{kind:"mapping",construct:function(e){return e!==null?e:{}}})});var Dt=F((mf,pi)=>{"use strict";var Gs=ke();pi.exports=new Gs({explicit:[si(),ci(),ui()]})});var fi=F((vf,gi)=>{"use strict";var Bs=V();function js(e){if(e===null)return!0;var t=e.length;return t===1&&e==="~"||t===4&&(e==="null"||e==="Null"||e==="NULL")}function $s(){return null}function zs(e){return e===null}gi.exports=new Bs("tag:yaml.org,2002:null",{kind:"scalar",resolve:js,construct:$s,predicate:zs,represent:{canonical:function(){return"~"},lowercase:function(){return"null"},uppercase:function(){return"NULL"},camelcase:function(){return"Null"}},defaultStyle:"lowercase"})});var mi=F((bf,hi)=>{"use strict";var Us=V();function qs(e){if(e===null)return!1;var t=e.length;return t===4&&(e==="true"||e==="True"||e==="TRUE")||t===5&&(e==="false"||e==="False"||e==="FALSE")}function Vs(e){return e==="true"||e==="True"||e==="TRUE"}function Ks(e){return Object.prototype.toString.call(e)==="[object Boolean]"}hi.exports=new Us("tag:yaml.org,2002:bool",{kind:"scalar",resolve:qs,construct:Vs,predicate:Ks,represent:{lowercase:function(e){return e?"true":"false"},uppercase:function(e){return e?"TRUE":"FALSE"},camelcase:function(e){return e?"True":"False"}},defaultStyle:"lowercase"})});var bi=F((yf,vi)=>{"use strict";var Ys=Ce(),Ws=V();function Xs(e){return 48<=e&&e<=57||65<=e&&e<=70||97<=e&&e<=102}function Js(e){return 48<=e&&e<=55}function Qs(e){return 48<=e&&e<=57}function Zs(e){if(e===null)return!1;var t=e.length,r=0,n=!1,i;if(!t)return!1;if(i=e[r],(i==="-"||i==="+")&&(i=e[++r]),i==="0"){if(r+1===t)return!0;if(i=e[++r],i==="b"){for(r++;r<t;r++)if(i=e[r],i!=="_"){if(i!=="0"&&i!=="1")return!1;n=!0}return n&&i!=="_"}if(i==="x"){for(r++;r<t;r++)if(i=e[r],i!=="_"){if(!Xs(e.charCodeAt(r)))return!1;n=!0}return n&&i!=="_"}for(;r<t;r++)if(i=e[r],i!=="_"){if(!Js(e.charCodeAt(r)))return!1;n=!0}return n&&i!=="_"}if(i==="_")return!1;for(;r<t;r++)if(i=e[r],i!=="_"){if(i===":")break;if(!Qs(e.charCodeAt(r)))return!1;n=!0}return!n||i==="_"?!1:i!==":"?!0:/^(:[0-5]?[0-9])+$/.test(e.slice(r))}function el(e){var t=e,r=1,n,i,o=[];return t.indexOf("_")!==-1&&(t=t.replace(/_/g,"")),n=t[0],(n==="-"||n==="+")&&(n==="-"&&(r=-1),t=t.slice(1),n=t[0]),t==="0"?0:n==="0"?t[1]==="b"?r*parseInt(t.slice(2),2):t[1]==="x"?r*parseInt(t,16):r*parseInt(t,8):t.indexOf(":")!==-1?(t.split(":").forEach(function(a){o.unshift(parseInt(a,10))}),t=0,i=1,o.forEach(function(a){t+=a*i,i*=60}),r*t):r*parseInt(t,10)}function tl(e){return Object.prototype.toString.call(e)==="[object Number]"&&e%1===0&&!Ys.isNegativeZero(e)}vi.exports=new Ws("tag:yaml.org,2002:int",{kind:"scalar",resolve:Zs,construct:el,predicate:tl,represent:{binary:function(e){return e>=0?"0b"+e.toString(2):"-0b"+e.toString(2).slice(1)},octal:function(e){return e>=0?"0"+e.toString(8):"-0"+e.toString(8).slice(1)},decimal:function(e){return e.toString(10)},hexadecimal:function(e){return e>=0?"0x"+e.toString(16).toUpperCase():"-0x"+e.toString(16).toUpperCase().slice(1)}},defaultStyle:"decimal",styleAliases:{binary:[2,"bin"],octal:[8,"oct"],decimal:[10,"dec"],hexadecimal:[16,"hex"]}})});var wi=F((xf,xi)=>{"use strict";var yi=Ce(),rl=V(),nl=new RegExp("^(?:[-+]?(?:0|[1-9][0-9_]*)(?:\\.[0-9_]*)?(?:[eE][-+]?[0-9]+)?|\\.[0-9_]+(?:[eE][-+]?[0-9]+)?|[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+\\.[0-9_]*|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$");function il(e){return!(e===null||!nl.test(e)||e[e.length-1]==="_")}function ol(e){var t,r,n,i;return t=e.replace(/_/g,"").toLowerCase(),r=t[0]==="-"?-1:1,i=[],"+-".indexOf(t[0])>=0&&(t=t.slice(1)),t===".inf"?r===1?Number.POSITIVE_INFINITY:Number.NEGATIVE_INFINITY:t===".nan"?NaN:t.indexOf(":")>=0?(t.split(":").forEach(function(o){i.unshift(parseFloat(o,10))}),t=0,n=1,i.forEach(function(o){t+=o*n,n*=60}),r*t):r*parseFloat(t,10)}var al=/^[-+]?[0-9]+e/;function sl(e,t){var r;if(isNaN(e))switch(t){case"lowercase":return".nan";case"uppercase":return".NAN";case"camelcase":return".NaN"}else if(Number.POSITIVE_INFINITY===e)switch(t){case"lowercase":return".inf";case"uppercase":return".INF";case"camelcase":return".Inf"}else if(Number.NEGATIVE_INFINITY===e)switch(t){case"lowercase":return"-.inf";case"uppercase":return"-.INF";case"camelcase":return"-.Inf"}else if(yi.isNegativeZero(e))return"-0.0";return r=e.toString(10),al.test(r)?r.replace("e",".e"):r}function ll(e){return Object.prototype.toString.call(e)==="[object Number]"&&(e%1!==0||yi.isNegativeZero(e))}xi.exports=new rl("tag:yaml.org,2002:float",{kind:"scalar",resolve:il,construct:ol,predicate:ll,represent:sl,defaultStyle:"lowercase"})});var jr=F((wf,Si)=>{"use strict";var cl=ke();Si.exports=new cl({include:[Dt()],implicit:[fi(),mi(),bi(),wi()]})});var $r=F((Sf,Ti)=>{"use strict";var dl=ke();Ti.exports=new dl({include:[jr()]})});var ki=F((Tf,Ci)=>{"use strict";var ul=V(),Ei=new RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$"),Pi=new RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$");function pl(e){return e===null?!1:Ei.exec(e)!==null||Pi.exec(e)!==null}function gl(e){var t,r,n,i,o,a,s,l=0,c=null,d,g,v;if(t=Ei.exec(e),t===null&&(t=Pi.exec(e)),t===null)throw new Error("Date resolve error");if(r=+t[1],n=+t[2]-1,i=+t[3],!t[4])return new Date(Date.UTC(r,n,i));if(o=+t[4],a=+t[5],s=+t[6],t[7]){for(l=t[7].slice(0,3);l.length<3;)l+="0";l=+l}return t[9]&&(d=+t[10],g=+(t[11]||0),c=(d*60+g)*6e4,t[9]==="-"&&(c=-c)),v=new Date(Date.UTC(r,n,i,o,a,s,l)),c&&v.setTime(v.getTime()-c),v}function fl(e){return e.toISOString()}Ci.exports=new ul("tag:yaml.org,2002:timestamp",{kind:"scalar",resolve:pl,construct:gl,instanceOf:Date,represent:fl})});var _i=F((Ef,Ai)=>{"use strict";var hl=V();function ml(e){return e==="<<"||e===null}Ai.exports=new hl("tag:yaml.org,2002:merge",{kind:"scalar",resolve:ml})});var Fi=F((Pf,Ii)=>{"use strict";var Ae;try{Ri=require,Ae=Ri("buffer").Buffer}catch{}var Ri,vl=V(),zr=`ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=
\r`;function bl(e){if(e===null)return!1;var t,r,n=0,i=e.length,o=zr;for(r=0;r<i;r++)if(t=o.indexOf(e.charAt(r)),!(t>64)){if(t<0)return!1;n+=6}return n%8===0}function yl(e){var t,r,n=e.replace(/[\r\n=]/g,""),i=n.length,o=zr,a=0,s=[];for(t=0;t<i;t++)t%4===0&&t&&(s.push(a>>16&255),s.push(a>>8&255),s.push(a&255)),a=a<<6|o.indexOf(n.charAt(t));return r=i%4*6,r===0?(s.push(a>>16&255),s.push(a>>8&255),s.push(a&255)):r===18?(s.push(a>>10&255),s.push(a>>2&255)):r===12&&s.push(a>>4&255),Ae?Ae.from?Ae.from(s):new Ae(s):s}function xl(e){var t="",r=0,n,i,o=e.length,a=zr;for(n=0;n<o;n++)n%3===0&&n&&(t+=a[r>>18&63],t+=a[r>>12&63],t+=a[r>>6&63],t+=a[r&63]),r=(r<<8)+e[n];return i=o%3,i===0?(t+=a[r>>18&63],t+=a[r>>12&63],t+=a[r>>6&63],t+=a[r&63]):i===2?(t+=a[r>>10&63],t+=a[r>>4&63],t+=a[r<<2&63],t+=a[64]):i===1&&(t+=a[r>>2&63],t+=a[r<<4&63],t+=a[64],t+=a[64]),t}function wl(e){return Ae&&Ae.isBuffer(e)}Ii.exports=new vl("tag:yaml.org,2002:binary",{kind:"scalar",resolve:bl,construct:yl,predicate:wl,represent:xl})});var Hi=F((Cf,Li)=>{"use strict";var Sl=V(),Tl=Object.prototype.hasOwnProperty,El=Object.prototype.toString;function Pl(e){if(e===null)return!0;var t=[],r,n,i,o,a,s=e;for(r=0,n=s.length;r<n;r+=1){if(i=s[r],a=!1,El.call(i)!=="[object Object]")return!1;for(o in i)if(Tl.call(i,o))if(!a)a=!0;else return!1;if(!a)return!1;if(t.indexOf(o)===-1)t.push(o);else return!1}return!0}function Cl(e){return e!==null?e:[]}Li.exports=new Sl("tag:yaml.org,2002:omap",{kind:"sequence",resolve:Pl,construct:Cl})});var Mi=F((kf,Oi)=>{"use strict";var kl=V(),Al=Object.prototype.toString;function _l(e){if(e===null)return!0;var t,r,n,i,o,a=e;for(o=new Array(a.length),t=0,r=a.length;t<r;t+=1){if(n=a[t],Al.call(n)!=="[object Object]"||(i=Object.keys(n),i.length!==1))return!1;o[t]=[i[0],n[i[0]]]}return!0}function Rl(e){if(e===null)return[];var t,r,n,i,o,a=e;for(o=new Array(a.length),t=0,r=a.length;t<r;t+=1)n=a[t],i=Object.keys(n),o[t]=[i[0],n[i[0]]];return o}Oi.exports=new kl("tag:yaml.org,2002:pairs",{kind:"sequence",resolve:_l,construct:Rl})});var Di=F((Af,Ni)=>{"use strict";var Il=V(),Fl=Object.prototype.hasOwnProperty;function Ll(e){if(e===null)return!0;var t,r=e;for(t in r)if(Fl.call(r,t)&&r[t]!==null)return!1;return!0}function Hl(e){return e!==null?e:{}}Ni.exports=new Il("tag:yaml.org,2002:set",{kind:"mapping",resolve:Ll,construct:Hl})});var Je=F((_f,Gi)=>{"use strict";var Ol=ke();Gi.exports=new Ol({include:[$r()],implicit:[ki(),_i()],explicit:[Fi(),Hi(),Mi(),Di()]})});var ji=F((Rf,Bi)=>{"use strict";var Ml=V();function Nl(){return!0}function Dl(){}function Gl(){return""}function Bl(e){return typeof e>"u"}Bi.exports=new Ml("tag:yaml.org,2002:js/undefined",{kind:"scalar",resolve:Nl,construct:Dl,predicate:Bl,represent:Gl})});var zi=F((If,$i)=>{"use strict";var jl=V();function $l(e){if(e===null||e.length===0)return!1;var t=e,r=/\/([gim]*)$/.exec(e),n="";return!(t[0]==="/"&&(r&&(n=r[1]),n.length>3||t[t.length-n.length-1]!=="/"))}function zl(e){var t=e,r=/\/([gim]*)$/.exec(e),n="";return t[0]==="/"&&(r&&(n=r[1]),t=t.slice(1,t.length-n.length-1)),new RegExp(t,n)}function Ul(e){var t="/"+e.source+"/";return e.global&&(t+="g"),e.multiline&&(t+="m"),e.ignoreCase&&(t+="i"),t}function ql(e){return Object.prototype.toString.call(e)==="[object RegExp]"}$i.exports=new jl("tag:yaml.org,2002:js/regexp",{kind:"scalar",resolve:$l,construct:zl,predicate:ql,represent:Ul})});var Vi=F((Ff,qi)=>{"use strict";var Gt;try{Ui=require,Gt=Ui("esprima")}catch{typeof window<"u"&&(Gt=window.esprima)}var Ui,Vl=V();function Kl(e){if(e===null)return!1;try{var t="("+e+")",r=Gt.parse(t,{range:!0});return!(r.type!=="Program"||r.body.length!==1||r.body[0].type!=="ExpressionStatement"||r.body[0].expression.type!=="ArrowFunctionExpression"&&r.body[0].expression.type!=="FunctionExpression")}catch{return!1}}function Yl(e){var t="("+e+")",r=Gt.parse(t,{range:!0}),n=[],i;if(r.type!=="Program"||r.body.length!==1||r.body[0].type!=="ExpressionStatement"||r.body[0].expression.type!=="ArrowFunctionExpression"&&r.body[0].expression.type!=="FunctionExpression")throw new Error("Failed to resolve function");return r.body[0].expression.params.forEach(function(o){n.push(o.name)}),i=r.body[0].expression.body.range,r.body[0].expression.body.type==="BlockStatement"?new Function(n,t.slice(i[0]+1,i[1]-1)):new Function(n,"return "+t.slice(i[0],i[1]))}function Wl(e){return e.toString()}function Xl(e){return Object.prototype.toString.call(e)==="[object Function]"}qi.exports=new Vl("tag:yaml.org,2002:js/function",{kind:"scalar",resolve:Kl,construct:Yl,predicate:Xl,represent:Wl})});var Tt=F((Lf,Yi)=>{"use strict";var Ki=ke();Yi.exports=Ki.DEFAULT=new Ki({include:[Je()],explicit:[ji(),zi(),Vi()]})});var ho=F((Hf,Et)=>{"use strict";var fe=Ce(),to=We(),Jl=ti(),ro=Je(),Ql=Tt(),xe=Object.prototype.hasOwnProperty,Bt=1,no=2,io=3,jt=4,Ur=1,Zl=2,Wi=3,ec=/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/,tc=/[\x85\u2028\u2029]/,rc=/[,\[\]\{\}]/,oo=/^(?:!|!!|![a-z\-]+!)$/i,ao=/^(?:!|[^,\[\]\{\}])(?:%[0-9a-f]{2}|[0-9a-z\-#;\/\?:@&=\+\$,_\.!~\*'\(\)\[\]])*$/i;function Xi(e){return Object.prototype.toString.call(e)}function de(e){return e===10||e===13}function Re(e){return e===9||e===32}function re(e){return e===9||e===32||e===10||e===13}function Qe(e){return e===44||e===91||e===93||e===123||e===125}function nc(e){var t;return 48<=e&&e<=57?e-48:(t=e|32,97<=t&&t<=102?t-97+10:-1)}function ic(e){return e===120?2:e===117?4:e===85?8:0}function oc(e){return 48<=e&&e<=57?e-48:-1}function Ji(e){return e===48?"\0":e===97?"\x07":e===98?"\b":e===116||e===9?"	":e===110?`
`:e===118?"\v":e===102?"\f":e===114?"\r":e===101?"\x1B":e===32?" ":e===34?'"':e===47?"/":e===92?"\\":e===78?"\x85":e===95?"\xA0":e===76?"\u2028":e===80?"\u2029":""}function ac(e){return e<=65535?String.fromCharCode(e):String.fromCharCode((e-65536>>10)+55296,(e-65536&1023)+56320)}function so(e,t,r){t==="__proto__"?Object.defineProperty(e,t,{configurable:!0,enumerable:!0,writable:!0,value:r}):e[t]=r}var lo=new Array(256),co=new Array(256);for(_e=0;_e<256;_e++)lo[_e]=Ji(_e)?1:0,co[_e]=Ji(_e);var _e;function sc(e,t){this.input=e,this.filename=t.filename||null,this.schema=t.schema||Ql,this.onWarning=t.onWarning||null,this.legacy=t.legacy||!1,this.json=t.json||!1,this.listener=t.listener||null,this.implicitTypes=this.schema.compiledImplicit,this.typeMap=this.schema.compiledTypeMap,this.length=e.length,this.position=0,this.line=0,this.lineStart=0,this.lineIndent=0,this.documents=[]}function uo(e,t){return new to(t,new Jl(e.filename,e.input,e.position,e.line,e.position-e.lineStart))}function k(e,t){throw uo(e,t)}function $t(e,t){e.onWarning&&e.onWarning.call(null,uo(e,t))}var Qi={YAML:function(t,r,n){var i,o,a;t.version!==null&&k(t,"duplication of %YAML directive"),n.length!==1&&k(t,"YAML directive accepts exactly one argument"),i=/^([0-9]+)\.([0-9]+)$/.exec(n[0]),i===null&&k(t,"ill-formed argument of the YAML directive"),o=parseInt(i[1],10),a=parseInt(i[2],10),o!==1&&k(t,"unacceptable YAML version of the document"),t.version=n[0],t.checkLineBreaks=a<2,a!==1&&a!==2&&$t(t,"unsupported YAML version of the document")},TAG:function(t,r,n){var i,o;n.length!==2&&k(t,"TAG directive accepts exactly two arguments"),i=n[0],o=n[1],oo.test(i)||k(t,"ill-formed tag handle (first argument) of the TAG directive"),xe.call(t.tagMap,i)&&k(t,'there is a previously declared suffix for "'+i+'" tag handle'),ao.test(o)||k(t,"ill-formed tag prefix (second argument) of the TAG directive"),t.tagMap[i]=o}};function ye(e,t,r,n){var i,o,a,s;if(t<r){if(s=e.input.slice(t,r),n)for(i=0,o=s.length;i<o;i+=1)a=s.charCodeAt(i),a===9||32<=a&&a<=1114111||k(e,"expected valid JSON character");else ec.test(s)&&k(e,"the stream contains non-printable characters");e.result+=s}}function Zi(e,t,r,n){var i,o,a,s;for(fe.isObject(r)||k(e,"cannot merge mappings; the provided source object is unacceptable"),i=Object.keys(r),a=0,s=i.length;a<s;a+=1)o=i[a],xe.call(t,o)||(so(t,o,r[o]),n[o]=!0)}function Ze(e,t,r,n,i,o,a,s){var l,c;if(Array.isArray(i))for(i=Array.prototype.slice.call(i),l=0,c=i.length;l<c;l+=1)Array.isArray(i[l])&&k(e,"nested arrays are not supported inside keys"),typeof i=="object"&&Xi(i[l])==="[object Object]"&&(i[l]="[object Object]");if(typeof i=="object"&&Xi(i)==="[object Object]"&&(i="[object Object]"),i=String(i),t===null&&(t={}),n==="tag:yaml.org,2002:merge")if(Array.isArray(o))for(l=0,c=o.length;l<c;l+=1)Zi(e,t,o[l],r);else Zi(e,t,o,r);else!e.json&&!xe.call(r,i)&&xe.call(t,i)&&(e.line=a||e.line,e.position=s||e.position,k(e,"duplicated mapping key")),so(t,i,o),delete r[i];return t}function qr(e){var t;t=e.input.charCodeAt(e.position),t===10?e.position++:t===13?(e.position++,e.input.charCodeAt(e.position)===10&&e.position++):k(e,"a line break is expected"),e.line+=1,e.lineStart=e.position}function U(e,t,r){for(var n=0,i=e.input.charCodeAt(e.position);i!==0;){for(;Re(i);)i=e.input.charCodeAt(++e.position);if(t&&i===35)do i=e.input.charCodeAt(++e.position);while(i!==10&&i!==13&&i!==0);if(de(i))for(qr(e),i=e.input.charCodeAt(e.position),n++,e.lineIndent=0;i===32;)e.lineIndent++,i=e.input.charCodeAt(++e.position);else break}return r!==-1&&n!==0&&e.lineIndent<r&&$t(e,"deficient indentation"),n}function zt(e){var t=e.position,r;return r=e.input.charCodeAt(t),!!((r===45||r===46)&&r===e.input.charCodeAt(t+1)&&r===e.input.charCodeAt(t+2)&&(t+=3,r=e.input.charCodeAt(t),r===0||re(r)))}function Vr(e,t){t===1?e.result+=" ":t>1&&(e.result+=fe.repeat(`
`,t-1))}function lc(e,t,r){var n,i,o,a,s,l,c,d,g=e.kind,v=e.result,b;if(b=e.input.charCodeAt(e.position),re(b)||Qe(b)||b===35||b===38||b===42||b===33||b===124||b===62||b===39||b===34||b===37||b===64||b===96||(b===63||b===45)&&(i=e.input.charCodeAt(e.position+1),re(i)||r&&Qe(i)))return!1;for(e.kind="scalar",e.result="",o=a=e.position,s=!1;b!==0;){if(b===58){if(i=e.input.charCodeAt(e.position+1),re(i)||r&&Qe(i))break}else if(b===35){if(n=e.input.charCodeAt(e.position-1),re(n))break}else{if(e.position===e.lineStart&&zt(e)||r&&Qe(b))break;if(de(b))if(l=e.line,c=e.lineStart,d=e.lineIndent,U(e,!1,-1),e.lineIndent>=t){s=!0,b=e.input.charCodeAt(e.position);continue}else{e.position=a,e.line=l,e.lineStart=c,e.lineIndent=d;break}}s&&(ye(e,o,a,!1),Vr(e,e.line-l),o=a=e.position,s=!1),Re(b)||(a=e.position+1),b=e.input.charCodeAt(++e.position)}return ye(e,o,a,!1),e.result?!0:(e.kind=g,e.result=v,!1)}function cc(e,t){var r,n,i;if(r=e.input.charCodeAt(e.position),r!==39)return!1;for(e.kind="scalar",e.result="",e.position++,n=i=e.position;(r=e.input.charCodeAt(e.position))!==0;)if(r===39)if(ye(e,n,e.position,!0),r=e.input.charCodeAt(++e.position),r===39)n=e.position,e.position++,i=e.position;else return!0;else de(r)?(ye(e,n,i,!0),Vr(e,U(e,!1,t)),n=i=e.position):e.position===e.lineStart&&zt(e)?k(e,"unexpected end of the document within a single quoted scalar"):(e.position++,i=e.position);k(e,"unexpected end of the stream within a single quoted scalar")}function dc(e,t){var r,n,i,o,a,s;if(s=e.input.charCodeAt(e.position),s!==34)return!1;for(e.kind="scalar",e.result="",e.position++,r=n=e.position;(s=e.input.charCodeAt(e.position))!==0;){if(s===34)return ye(e,r,e.position,!0),e.position++,!0;if(s===92){if(ye(e,r,e.position,!0),s=e.input.charCodeAt(++e.position),de(s))U(e,!1,t);else if(s<256&&lo[s])e.result+=co[s],e.position++;else if((a=ic(s))>0){for(i=a,o=0;i>0;i--)s=e.input.charCodeAt(++e.position),(a=nc(s))>=0?o=(o<<4)+a:k(e,"expected hexadecimal character");e.result+=ac(o),e.position++}else k(e,"unknown escape sequence");r=n=e.position}else de(s)?(ye(e,r,n,!0),Vr(e,U(e,!1,t)),r=n=e.position):e.position===e.lineStart&&zt(e)?k(e,"unexpected end of the document within a double quoted scalar"):(e.position++,n=e.position)}k(e,"unexpected end of the stream within a double quoted scalar")}function uc(e,t){var r=!0,n,i=e.tag,o,a=e.anchor,s,l,c,d,g,v={},b,P,H,R;if(R=e.input.charCodeAt(e.position),R===91)l=93,g=!1,o=[];else if(R===123)l=125,g=!0,o={};else return!1;for(e.anchor!==null&&(e.anchorMap[e.anchor]=o),R=e.input.charCodeAt(++e.position);R!==0;){if(U(e,!0,t),R=e.input.charCodeAt(e.position),R===l)return e.position++,e.tag=i,e.anchor=a,e.kind=g?"mapping":"sequence",e.result=o,!0;r||k(e,"missed comma between flow collection entries"),P=b=H=null,c=d=!1,R===63&&(s=e.input.charCodeAt(e.position+1),re(s)&&(c=d=!0,e.position++,U(e,!0,t))),n=e.line,et(e,t,Bt,!1,!0),P=e.tag,b=e.result,U(e,!0,t),R=e.input.charCodeAt(e.position),(d||e.line===n)&&R===58&&(c=!0,R=e.input.charCodeAt(++e.position),U(e,!0,t),et(e,t,Bt,!1,!0),H=e.result),g?Ze(e,o,v,P,b,H):c?o.push(Ze(e,null,v,P,b,H)):o.push(b),U(e,!0,t),R=e.input.charCodeAt(e.position),R===44?(r=!0,R=e.input.charCodeAt(++e.position)):r=!1}k(e,"unexpected end of the stream within a flow collection")}function pc(e,t){var r,n,i=Ur,o=!1,a=!1,s=t,l=0,c=!1,d,g;if(g=e.input.charCodeAt(e.position),g===124)n=!1;else if(g===62)n=!0;else return!1;for(e.kind="scalar",e.result="";g!==0;)if(g=e.input.charCodeAt(++e.position),g===43||g===45)Ur===i?i=g===43?Wi:Zl:k(e,"repeat of a chomping mode identifier");else if((d=oc(g))>=0)d===0?k(e,"bad explicit indentation width of a block scalar; it cannot be less than one"):a?k(e,"repeat of an indentation width identifier"):(s=t+d-1,a=!0);else break;if(Re(g)){do g=e.input.charCodeAt(++e.position);while(Re(g));if(g===35)do g=e.input.charCodeAt(++e.position);while(!de(g)&&g!==0)}for(;g!==0;){for(qr(e),e.lineIndent=0,g=e.input.charCodeAt(e.position);(!a||e.lineIndent<s)&&g===32;)e.lineIndent++,g=e.input.charCodeAt(++e.position);if(!a&&e.lineIndent>s&&(s=e.lineIndent),de(g)){l++;continue}if(e.lineIndent<s){i===Wi?e.result+=fe.repeat(`
`,o?1+l:l):i===Ur&&o&&(e.result+=`
`);break}for(n?Re(g)?(c=!0,e.result+=fe.repeat(`
`,o?1+l:l)):c?(c=!1,e.result+=fe.repeat(`
`,l+1)):l===0?o&&(e.result+=" "):e.result+=fe.repeat(`
`,l):e.result+=fe.repeat(`
`,o?1+l:l),o=!0,a=!0,l=0,r=e.position;!de(g)&&g!==0;)g=e.input.charCodeAt(++e.position);ye(e,r,e.position,!1)}return!0}function eo(e,t){var r,n=e.tag,i=e.anchor,o=[],a,s=!1,l;for(e.anchor!==null&&(e.anchorMap[e.anchor]=o),l=e.input.charCodeAt(e.position);l!==0&&!(l!==45||(a=e.input.charCodeAt(e.position+1),!re(a)));){if(s=!0,e.position++,U(e,!0,-1)&&e.lineIndent<=t){o.push(null),l=e.input.charCodeAt(e.position);continue}if(r=e.line,et(e,t,io,!1,!0),o.push(e.result),U(e,!0,-1),l=e.input.charCodeAt(e.position),(e.line===r||e.lineIndent>t)&&l!==0)k(e,"bad indentation of a sequence entry");else if(e.lineIndent<t)break}return s?(e.tag=n,e.anchor=i,e.kind="sequence",e.result=o,!0):!1}function gc(e,t,r){var n,i,o,a,s=e.tag,l=e.anchor,c={},d={},g=null,v=null,b=null,P=!1,H=!1,R;for(e.anchor!==null&&(e.anchorMap[e.anchor]=c),R=e.input.charCodeAt(e.position);R!==0;){if(n=e.input.charCodeAt(e.position+1),o=e.line,a=e.position,(R===63||R===58)&&re(n))R===63?(P&&(Ze(e,c,d,g,v,null),g=v=b=null),H=!0,P=!0,i=!0):P?(P=!1,i=!0):k(e,"incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line"),e.position+=1,R=n;else if(et(e,r,no,!1,!0))if(e.line===o){for(R=e.input.charCodeAt(e.position);Re(R);)R=e.input.charCodeAt(++e.position);if(R===58)R=e.input.charCodeAt(++e.position),re(R)||k(e,"a whitespace character is expected after the key-value separator within a block mapping"),P&&(Ze(e,c,d,g,v,null),g=v=b=null),H=!0,P=!1,i=!1,g=e.tag,v=e.result;else if(H)k(e,"can not read an implicit mapping pair; a colon is missed");else return e.tag=s,e.anchor=l,!0}else if(H)k(e,"can not read a block mapping entry; a multiline key may not be an implicit key");else return e.tag=s,e.anchor=l,!0;else break;if((e.line===o||e.lineIndent>t)&&(et(e,t,jt,!0,i)&&(P?v=e.result:b=e.result),P||(Ze(e,c,d,g,v,b,o,a),g=v=b=null),U(e,!0,-1),R=e.input.charCodeAt(e.position)),e.lineIndent>t&&R!==0)k(e,"bad indentation of a mapping entry");else if(e.lineIndent<t)break}return P&&Ze(e,c,d,g,v,null),H&&(e.tag=s,e.anchor=l,e.kind="mapping",e.result=c),H}function fc(e){var t,r=!1,n=!1,i,o,a;if(a=e.input.charCodeAt(e.position),a!==33)return!1;if(e.tag!==null&&k(e,"duplication of a tag property"),a=e.input.charCodeAt(++e.position),a===60?(r=!0,a=e.input.charCodeAt(++e.position)):a===33?(n=!0,i="!!",a=e.input.charCodeAt(++e.position)):i="!",t=e.position,r){do a=e.input.charCodeAt(++e.position);while(a!==0&&a!==62);e.position<e.length?(o=e.input.slice(t,e.position),a=e.input.charCodeAt(++e.position)):k(e,"unexpected end of the stream within a verbatim tag")}else{for(;a!==0&&!re(a);)a===33&&(n?k(e,"tag suffix cannot contain exclamation marks"):(i=e.input.slice(t-1,e.position+1),oo.test(i)||k(e,"named tag handle cannot contain such characters"),n=!0,t=e.position+1)),a=e.input.charCodeAt(++e.position);o=e.input.slice(t,e.position),rc.test(o)&&k(e,"tag suffix cannot contain flow indicator characters")}return o&&!ao.test(o)&&k(e,"tag name cannot contain such characters: "+o),r?e.tag=o:xe.call(e.tagMap,i)?e.tag=e.tagMap[i]+o:i==="!"?e.tag="!"+o:i==="!!"?e.tag="tag:yaml.org,2002:"+o:k(e,'undeclared tag handle "'+i+'"'),!0}function hc(e){var t,r;if(r=e.input.charCodeAt(e.position),r!==38)return!1;for(e.anchor!==null&&k(e,"duplication of an anchor property"),r=e.input.charCodeAt(++e.position),t=e.position;r!==0&&!re(r)&&!Qe(r);)r=e.input.charCodeAt(++e.position);return e.position===t&&k(e,"name of an anchor node must contain at least one character"),e.anchor=e.input.slice(t,e.position),!0}function mc(e){var t,r,n;if(n=e.input.charCodeAt(e.position),n!==42)return!1;for(n=e.input.charCodeAt(++e.position),t=e.position;n!==0&&!re(n)&&!Qe(n);)n=e.input.charCodeAt(++e.position);return e.position===t&&k(e,"name of an alias node must contain at least one character"),r=e.input.slice(t,e.position),xe.call(e.anchorMap,r)||k(e,'unidentified alias "'+r+'"'),e.result=e.anchorMap[r],U(e,!0,-1),!0}function et(e,t,r,n,i){var o,a,s,l=1,c=!1,d=!1,g,v,b,P,H;if(e.listener!==null&&e.listener("open",e),e.tag=null,e.anchor=null,e.kind=null,e.result=null,o=a=s=jt===r||io===r,n&&U(e,!0,-1)&&(c=!0,e.lineIndent>t?l=1:e.lineIndent===t?l=0:e.lineIndent<t&&(l=-1)),l===1)for(;fc(e)||hc(e);)U(e,!0,-1)?(c=!0,s=o,e.lineIndent>t?l=1:e.lineIndent===t?l=0:e.lineIndent<t&&(l=-1)):s=!1;if(s&&(s=c||i),(l===1||jt===r)&&(Bt===r||no===r?P=t:P=t+1,H=e.position-e.lineStart,l===1?s&&(eo(e,H)||gc(e,H,P))||uc(e,P)?d=!0:(a&&pc(e,P)||cc(e,P)||dc(e,P)?d=!0:mc(e)?(d=!0,(e.tag!==null||e.anchor!==null)&&k(e,"alias node should not have any properties")):lc(e,P,Bt===r)&&(d=!0,e.tag===null&&(e.tag="?")),e.anchor!==null&&(e.anchorMap[e.anchor]=e.result)):l===0&&(d=s&&eo(e,H))),e.tag!==null&&e.tag!=="!")if(e.tag==="?"){for(e.result!==null&&e.kind!=="scalar"&&k(e,'unacceptable node kind for !<?> tag; it should be "scalar", not "'+e.kind+'"'),g=0,v=e.implicitTypes.length;g<v;g+=1)if(b=e.implicitTypes[g],b.resolve(e.result)){e.result=b.construct(e.result),e.tag=b.tag,e.anchor!==null&&(e.anchorMap[e.anchor]=e.result);break}}else xe.call(e.typeMap[e.kind||"fallback"],e.tag)?(b=e.typeMap[e.kind||"fallback"][e.tag],e.result!==null&&b.kind!==e.kind&&k(e,"unacceptable node kind for !<"+e.tag+'> tag; it should be "'+b.kind+'", not "'+e.kind+'"'),b.resolve(e.result)?(e.result=b.construct(e.result),e.anchor!==null&&(e.anchorMap[e.anchor]=e.result)):k(e,"cannot resolve a node with !<"+e.tag+"> explicit tag")):k(e,"unknown tag !<"+e.tag+">");return e.listener!==null&&e.listener("close",e),e.tag!==null||e.anchor!==null||d}function vc(e){var t=e.position,r,n,i,o=!1,a;for(e.version=null,e.checkLineBreaks=e.legacy,e.tagMap={},e.anchorMap={};(a=e.input.charCodeAt(e.position))!==0&&(U(e,!0,-1),a=e.input.charCodeAt(e.position),!(e.lineIndent>0||a!==37));){for(o=!0,a=e.input.charCodeAt(++e.position),r=e.position;a!==0&&!re(a);)a=e.input.charCodeAt(++e.position);for(n=e.input.slice(r,e.position),i=[],n.length<1&&k(e,"directive name must not be less than one character in length");a!==0;){for(;Re(a);)a=e.input.charCodeAt(++e.position);if(a===35){do a=e.input.charCodeAt(++e.position);while(a!==0&&!de(a));break}if(de(a))break;for(r=e.position;a!==0&&!re(a);)a=e.input.charCodeAt(++e.position);i.push(e.input.slice(r,e.position))}a!==0&&qr(e),xe.call(Qi,n)?Qi[n](e,n,i):$t(e,'unknown document directive "'+n+'"')}if(U(e,!0,-1),e.lineIndent===0&&e.input.charCodeAt(e.position)===45&&e.input.charCodeAt(e.position+1)===45&&e.input.charCodeAt(e.position+2)===45?(e.position+=3,U(e,!0,-1)):o&&k(e,"directives end mark is expected"),et(e,e.lineIndent-1,jt,!1,!0),U(e,!0,-1),e.checkLineBreaks&&tc.test(e.input.slice(t,e.position))&&$t(e,"non-ASCII line breaks are interpreted as content"),e.documents.push(e.result),e.position===e.lineStart&&zt(e)){e.input.charCodeAt(e.position)===46&&(e.position+=3,U(e,!0,-1));return}if(e.position<e.length-1)k(e,"end of the stream or a document separator is expected");else return}function po(e,t){e=String(e),t=t||{},e.length!==0&&(e.charCodeAt(e.length-1)!==10&&e.charCodeAt(e.length-1)!==13&&(e+=`
`),e.charCodeAt(0)===65279&&(e=e.slice(1)));var r=new sc(e,t),n=e.indexOf("\0");for(n!==-1&&(r.position=n,k(r,"null byte is not allowed in input")),r.input+="\0";r.input.charCodeAt(r.position)===32;)r.lineIndent+=1,r.position+=1;for(;r.position<r.length-1;)vc(r);return r.documents}function go(e,t,r){t!==null&&typeof t=="object"&&typeof r>"u"&&(r=t,t=null);var n=po(e,r);if(typeof t!="function")return n;for(var i=0,o=n.length;i<o;i+=1)t(n[i])}function fo(e,t){var r=po(e,t);if(r.length!==0){if(r.length===1)return r[0];throw new to("expected a single document in the stream, but found more")}}function bc(e,t,r){return typeof t=="object"&&t!==null&&typeof r>"u"&&(r=t,t=null),go(e,t,fe.extend({schema:ro},r))}function yc(e,t){return fo(e,fe.extend({schema:ro},t))}Et.exports.loadAll=go;Et.exports.load=fo;Et.exports.safeLoadAll=bc;Et.exports.safeLoad=yc});var Do=F((Of,Xr)=>{"use strict";var Ct=Ce(),kt=We(),xc=Tt(),wc=Je(),To=Object.prototype.toString,Eo=Object.prototype.hasOwnProperty,Sc=9,Pt=10,Tc=13,Ec=32,Pc=33,Cc=34,Po=35,kc=37,Ac=38,_c=39,Rc=42,Co=44,Ic=45,ko=58,Fc=61,Lc=62,Hc=63,Oc=64,Ao=91,_o=93,Mc=96,Ro=123,Nc=124,Io=125,Q={};Q[0]="\\0";Q[7]="\\a";Q[8]="\\b";Q[9]="\\t";Q[10]="\\n";Q[11]="\\v";Q[12]="\\f";Q[13]="\\r";Q[27]="\\e";Q[34]='\\"';Q[92]="\\\\";Q[133]="\\N";Q[160]="\\_";Q[8232]="\\L";Q[8233]="\\P";var Dc=["y","Y","yes","Yes","YES","on","On","ON","n","N","no","No","NO","off","Off","OFF"];function Gc(e,t){var r,n,i,o,a,s,l;if(t===null)return{};for(r={},n=Object.keys(t),i=0,o=n.length;i<o;i+=1)a=n[i],s=String(t[a]),a.slice(0,2)==="!!"&&(a="tag:yaml.org,2002:"+a.slice(2)),l=e.compiledTypeMap.fallback[a],l&&Eo.call(l.styleAliases,s)&&(s=l.styleAliases[s]),r[a]=s;return r}function mo(e){var t,r,n;if(t=e.toString(16).toUpperCase(),e<=255)r="x",n=2;else if(e<=65535)r="u",n=4;else if(e<=4294967295)r="U",n=8;else throw new kt("code point within a string may not be greater than 0xFFFFFFFF");return"\\"+r+Ct.repeat("0",n-t.length)+t}function Bc(e){this.schema=e.schema||xc,this.indent=Math.max(1,e.indent||2),this.noArrayIndent=e.noArrayIndent||!1,this.skipInvalid=e.skipInvalid||!1,this.flowLevel=Ct.isNothing(e.flowLevel)?-1:e.flowLevel,this.styleMap=Gc(this.schema,e.styles||null),this.sortKeys=e.sortKeys||!1,this.lineWidth=e.lineWidth||80,this.noRefs=e.noRefs||!1,this.noCompatMode=e.noCompatMode||!1,this.condenseFlow=e.condenseFlow||!1,this.implicitTypes=this.schema.compiledImplicit,this.explicitTypes=this.schema.compiledExplicit,this.tag=null,this.result="",this.duplicates=[],this.usedDuplicates=null}function vo(e,t){for(var r=Ct.repeat(" ",t),n=0,i=-1,o="",a,s=e.length;n<s;)i=e.indexOf(`
`,n),i===-1?(a=e.slice(n),n=s):(a=e.slice(n,i+1),n=i+1),a.length&&a!==`
`&&(o+=r),o+=a;return o}function Kr(e,t){return`
`+Ct.repeat(" ",e.indent*t)}function jc(e,t){var r,n,i;for(r=0,n=e.implicitTypes.length;r<n;r+=1)if(i=e.implicitTypes[r],i.resolve(t))return!0;return!1}function Wr(e){return e===Ec||e===Sc}function tt(e){return 32<=e&&e<=126||161<=e&&e<=55295&&e!==8232&&e!==8233||57344<=e&&e<=65533&&e!==65279||65536<=e&&e<=1114111}function $c(e){return tt(e)&&!Wr(e)&&e!==65279&&e!==Tc&&e!==Pt}function bo(e,t){return tt(e)&&e!==65279&&e!==Co&&e!==Ao&&e!==_o&&e!==Ro&&e!==Io&&e!==ko&&(e!==Po||t&&$c(t))}function zc(e){return tt(e)&&e!==65279&&!Wr(e)&&e!==Ic&&e!==Hc&&e!==ko&&e!==Co&&e!==Ao&&e!==_o&&e!==Ro&&e!==Io&&e!==Po&&e!==Ac&&e!==Rc&&e!==Pc&&e!==Nc&&e!==Fc&&e!==Lc&&e!==_c&&e!==Cc&&e!==kc&&e!==Oc&&e!==Mc}function Fo(e){var t=/^\n* /;return t.test(e)}var Lo=1,Ho=2,Oo=3,Mo=4,Ut=5;function Uc(e,t,r,n,i){var o,a,s,l=!1,c=!1,d=n!==-1,g=-1,v=zc(e.charCodeAt(0))&&!Wr(e.charCodeAt(e.length-1));if(t)for(o=0;o<e.length;o++){if(a=e.charCodeAt(o),!tt(a))return Ut;s=o>0?e.charCodeAt(o-1):null,v=v&&bo(a,s)}else{for(o=0;o<e.length;o++){if(a=e.charCodeAt(o),a===Pt)l=!0,d&&(c=c||o-g-1>n&&e[g+1]!==" ",g=o);else if(!tt(a))return Ut;s=o>0?e.charCodeAt(o-1):null,v=v&&bo(a,s)}c=c||d&&o-g-1>n&&e[g+1]!==" "}return!l&&!c?v&&!i(e)?Lo:Ho:r>9&&Fo(e)?Ut:c?Mo:Oo}function qc(e,t,r,n){e.dump=(function(){if(t.length===0)return"''";if(!e.noCompatMode&&Dc.indexOf(t)!==-1)return"'"+t+"'";var i=e.indent*Math.max(1,r),o=e.lineWidth===-1?-1:Math.max(Math.min(e.lineWidth,40),e.lineWidth-i),a=n||e.flowLevel>-1&&r>=e.flowLevel;function s(l){return jc(e,l)}switch(Uc(t,a,e.indent,o,s)){case Lo:return t;case Ho:return"'"+t.replace(/'/g,"''")+"'";case Oo:return"|"+yo(t,e.indent)+xo(vo(t,i));case Mo:return">"+yo(t,e.indent)+xo(vo(Vc(t,o),i));case Ut:return'"'+Kc(t,o)+'"';default:throw new kt("impossible error: invalid scalar style")}})()}function yo(e,t){var r=Fo(e)?String(t):"",n=e[e.length-1]===`
`,i=n&&(e[e.length-2]===`
`||e===`
`),o=i?"+":n?"":"-";return r+o+`
`}function xo(e){return e[e.length-1]===`
`?e.slice(0,-1):e}function Vc(e,t){for(var r=/(\n+)([^\n]*)/g,n=(function(){var c=e.indexOf(`
`);return c=c!==-1?c:e.length,r.lastIndex=c,wo(e.slice(0,c),t)})(),i=e[0]===`
`||e[0]===" ",o,a;a=r.exec(e);){var s=a[1],l=a[2];o=l[0]===" ",n+=s+(!i&&!o&&l!==""?`
`:"")+wo(l,t),i=o}return n}function wo(e,t){if(e===""||e[0]===" ")return e;for(var r=/ [^ ]/g,n,i=0,o,a=0,s=0,l="";n=r.exec(e);)s=n.index,s-i>t&&(o=a>i?a:s,l+=`
`+e.slice(i,o),i=o+1),a=s;return l+=`
`,e.length-i>t&&a>i?l+=e.slice(i,a)+`
`+e.slice(a+1):l+=e.slice(i),l.slice(1)}function Kc(e){for(var t="",r,n,i,o=0;o<e.length;o++){if(r=e.charCodeAt(o),r>=55296&&r<=56319&&(n=e.charCodeAt(o+1),n>=56320&&n<=57343)){t+=mo((r-55296)*1024+n-56320+65536),o++;continue}i=Q[r],t+=!i&&tt(r)?e[o]:i||mo(r)}return t}function Yc(e,t,r){var n="",i=e.tag,o,a;for(o=0,a=r.length;o<a;o+=1)Ie(e,t,r[o],!1,!1)&&(o!==0&&(n+=","+(e.condenseFlow?"":" ")),n+=e.dump);e.tag=i,e.dump="["+n+"]"}function Wc(e,t,r,n){var i="",o=e.tag,a,s;for(a=0,s=r.length;a<s;a+=1)Ie(e,t+1,r[a],!0,!0)&&((!n||a!==0)&&(i+=Kr(e,t)),e.dump&&Pt===e.dump.charCodeAt(0)?i+="-":i+="- ",i+=e.dump);e.tag=o,e.dump=i||"[]"}function Xc(e,t,r){var n="",i=e.tag,o=Object.keys(r),a,s,l,c,d;for(a=0,s=o.length;a<s;a+=1)d="",a!==0&&(d+=", "),e.condenseFlow&&(d+='"'),l=o[a],c=r[l],Ie(e,t,l,!1,!1)&&(e.dump.length>1024&&(d+="? "),d+=e.dump+(e.condenseFlow?'"':"")+":"+(e.condenseFlow?"":" "),Ie(e,t,c,!1,!1)&&(d+=e.dump,n+=d));e.tag=i,e.dump="{"+n+"}"}function Jc(e,t,r,n){var i="",o=e.tag,a=Object.keys(r),s,l,c,d,g,v;if(e.sortKeys===!0)a.sort();else if(typeof e.sortKeys=="function")a.sort(e.sortKeys);else if(e.sortKeys)throw new kt("sortKeys must be a boolean or a function");for(s=0,l=a.length;s<l;s+=1)v="",(!n||s!==0)&&(v+=Kr(e,t)),c=a[s],d=r[c],Ie(e,t+1,c,!0,!0,!0)&&(g=e.tag!==null&&e.tag!=="?"||e.dump&&e.dump.length>1024,g&&(e.dump&&Pt===e.dump.charCodeAt(0)?v+="?":v+="? "),v+=e.dump,g&&(v+=Kr(e,t)),Ie(e,t+1,d,!0,g)&&(e.dump&&Pt===e.dump.charCodeAt(0)?v+=":":v+=": ",v+=e.dump,i+=v));e.tag=o,e.dump=i||"{}"}function So(e,t,r){var n,i,o,a,s,l;for(i=r?e.explicitTypes:e.implicitTypes,o=0,a=i.length;o<a;o+=1)if(s=i[o],(s.instanceOf||s.predicate)&&(!s.instanceOf||typeof t=="object"&&t instanceof s.instanceOf)&&(!s.predicate||s.predicate(t))){if(e.tag=r?s.tag:"?",s.represent){if(l=e.styleMap[s.tag]||s.defaultStyle,To.call(s.represent)==="[object Function]")n=s.represent(t,l);else if(Eo.call(s.represent,l))n=s.represent[l](t,l);else throw new kt("!<"+s.tag+'> tag resolver accepts not "'+l+'" style');e.dump=n}return!0}return!1}function Ie(e,t,r,n,i,o){e.tag=null,e.dump=r,So(e,r,!1)||So(e,r,!0);var a=To.call(e.dump);n&&(n=e.flowLevel<0||e.flowLevel>t);var s=a==="[object Object]"||a==="[object Array]",l,c;if(s&&(l=e.duplicates.indexOf(r),c=l!==-1),(e.tag!==null&&e.tag!=="?"||c||e.indent!==2&&t>0)&&(i=!1),c&&e.usedDuplicates[l])e.dump="*ref_"+l;else{if(s&&c&&!e.usedDuplicates[l]&&(e.usedDuplicates[l]=!0),a==="[object Object]")n&&Object.keys(e.dump).length!==0?(Jc(e,t,e.dump,i),c&&(e.dump="&ref_"+l+e.dump)):(Xc(e,t,e.dump),c&&(e.dump="&ref_"+l+" "+e.dump));else if(a==="[object Array]"){var d=e.noArrayIndent&&t>0?t-1:t;n&&e.dump.length!==0?(Wc(e,d,e.dump,i),c&&(e.dump="&ref_"+l+e.dump)):(Yc(e,d,e.dump),c&&(e.dump="&ref_"+l+" "+e.dump))}else if(a==="[object String]")e.tag!=="?"&&qc(e,e.dump,t,o);else{if(e.skipInvalid)return!1;throw new kt("unacceptable kind of an object to dump "+a)}e.tag!==null&&e.tag!=="?"&&(e.dump="!<"+e.tag+"> "+e.dump)}return!0}function Qc(e,t){var r=[],n=[],i,o;for(Yr(e,r,n),i=0,o=n.length;i<o;i+=1)t.duplicates.push(r[n[i]]);t.usedDuplicates=new Array(o)}function Yr(e,t,r){var n,i,o;if(e!==null&&typeof e=="object")if(i=t.indexOf(e),i!==-1)r.indexOf(i)===-1&&r.push(i);else if(t.push(e),Array.isArray(e))for(i=0,o=e.length;i<o;i+=1)Yr(e[i],t,r);else for(n=Object.keys(e),i=0,o=n.length;i<o;i+=1)Yr(e[n[i]],t,r)}function No(e,t){t=t||{};var r=new Bc(t);return r.noRefs||Qc(e,r),Ie(r,0,e,!0,!0)?r.dump+`
`:""}function Zc(e,t){return No(e,Ct.extend({schema:wc},t))}Xr.exports.dump=No;Xr.exports.safeDump=Zc});var Bo=F((Mf,B)=>{"use strict";var qt=ho(),Go=Do();function Vt(e){return function(){throw new Error("Function "+e+" is deprecated and cannot be used.")}}B.exports.Type=V();B.exports.Schema=ke();B.exports.FAILSAFE_SCHEMA=Dt();B.exports.JSON_SCHEMA=jr();B.exports.CORE_SCHEMA=$r();B.exports.DEFAULT_SAFE_SCHEMA=Je();B.exports.DEFAULT_FULL_SCHEMA=Tt();B.exports.load=qt.load;B.exports.loadAll=qt.loadAll;B.exports.safeLoad=qt.safeLoad;B.exports.safeLoadAll=qt.safeLoadAll;B.exports.dump=Go.dump;B.exports.safeDump=Go.safeDump;B.exports.YAMLException=We();B.exports.MINIMAL_SCHEMA=Dt();B.exports.SAFE_SCHEMA=Je();B.exports.DEFAULT_SCHEMA=Tt();B.exports.scan=Vt("scan");B.exports.parse=Vt("parse");B.exports.compose=Vt("compose");B.exports.addConstructor=Vt("addConstructor")});var $o=F((Nf,jo)=>{"use strict";var ed=Bo();jo.exports=ed});var Jr=F((exports,module)=>{"use strict";var yaml=$o(),engines=exports=module.exports;engines.yaml={parse:yaml.safeLoad.bind(yaml),stringify:yaml.safeDump.bind(yaml)};engines.json={parse:JSON.parse.bind(JSON),stringify:function(e,t){let r=Object.assign({replacer:null,space:2},t);return JSON.stringify(e,r.replacer,r.space)}};engines.javascript={parse:function parse(str,options,wrap){try{return wrap!==!1&&(str=`(function() {
return `+str.trim()+`;
}());`),eval(str)||{}}catch(e){if(wrap!==!1&&/(unexpected|identifier)/i.test(e.message))return parse(str,options,!1);throw new SyntaxError(e)}},stringify:function(){throw new Error("stringifying JavaScript is not supported")}}});var Uo=F((Df,zo)=>{"use strict";zo.exports=function(e){return typeof e=="string"&&e.charAt(0)==="\uFEFF"?e.slice(1):e}});var Kt=F(he=>{"use strict";var qo=Uo(),Vo=wt();he.define=function(e,t,r){Reflect.defineProperty(e,t,{enumerable:!1,configurable:!0,writable:!0,value:r})};he.isBuffer=function(e){return Vo(e)==="buffer"};he.isObject=function(e){return Vo(e)==="object"};he.toBuffer=function(e){return typeof e=="string"?Buffer.from(e):e};he.toString=function(e){if(he.isBuffer(e))return qo(String(e));if(typeof e!="string")throw new TypeError("expected input to be a string or buffer");return qo(e)};he.arrayify=function(e){return e?Array.isArray(e)?e:[e]:[]};he.startsWith=function(e,t,r){return typeof r!="number"&&(r=t.length),e.slice(0,r)===t}});var At=F((Bf,Ko)=>{"use strict";var td=Jr(),rd=Kt();Ko.exports=function(e){let t=Object.assign({},e);return t.delimiters=rd.arrayify(t.delims||t.delimiters||"---"),t.delimiters.length===1&&t.delimiters.push(t.delimiters[0]),t.language=(t.language||t.lang||"yaml").toLowerCase(),t.engines=Object.assign({},td,t.parsers,t.engines),t}});var Qr=F((jf,Yo)=>{"use strict";Yo.exports=function(e,t){let r=t.engines[e]||t.engines[nd(e)];if(typeof r>"u")throw new Error('gray-matter engine "'+e+'" is not registered');return typeof r=="function"&&(r={parse:r}),r};function nd(e){switch(e.toLowerCase()){case"js":case"javascript":return"javascript";case"coffee":case"coffeescript":case"cson":return"coffee";case"yaml":case"yml":return"yaml";default:return e}}});var Zr=F(($f,Wo)=>{"use strict";var id=wt(),od=Qr(),ad=At();Wo.exports=function(e,t,r){if(t==null&&r==null)switch(id(e)){case"object":t=e.data,r={};break;case"string":return e;default:throw new TypeError("expected file to be a string or object")}let n=e.content,i=ad(r);if(t==null){if(!i.data)return e;t=i.data}let o=e.language||i.language,a=od(o,i);if(typeof a.stringify!="function")throw new TypeError('expected "'+o+'.stringify" to be a function');t=Object.assign({},e.data,t);let s=i.delimiters[0],l=i.delimiters[1],c=a.stringify(t,r).trim(),d="";return c!=="{}"&&(d=rt(s)+rt(c)+rt(l)),typeof e.excerpt=="string"&&e.excerpt!==""&&n.indexOf(e.excerpt.trim())===-1&&(d+=rt(e.excerpt)+rt(l)),d+rt(n)};function rt(e){return e.slice(-1)!==`
`?e+`
`:e}});var Jo=F((zf,Xo)=>{"use strict";var sd=At();Xo.exports=function(e,t){let r=sd(t);if(e.data==null&&(e.data={}),typeof r.excerpt=="function")return r.excerpt(e,r);let n=e.data.excerpt_separator||r.excerpt_separator;if(n==null&&(r.excerpt===!1||r.excerpt==null))return e;let i=typeof r.excerpt=="string"?r.excerpt:n||r.delimiters[0],o=e.content.indexOf(i);return o!==-1&&(e.excerpt=e.content.slice(0,o)),e}});var ea=F((Uf,Zo)=>{"use strict";var Qo=wt(),ld=Zr(),nt=Kt();Zo.exports=function(e){return Qo(e)!=="object"&&(e={content:e}),Qo(e.data)!=="object"&&(e.data={}),e.contents&&e.content==null&&(e.content=e.contents),nt.define(e,"orig",nt.toBuffer(e.content)),nt.define(e,"language",e.language||""),nt.define(e,"matter",e.matter||""),nt.define(e,"stringify",function(t,r){return r&&r.language&&(e.language=r.language),ld(e,t,r)}),e.content=nt.toString(e.content),e.isEmpty=!1,e.excerpt="",e}});var ra=F((qf,ta)=>{"use strict";var cd=Qr(),dd=At();ta.exports=function(e,t,r){let n=dd(r),i=cd(e,n);if(typeof i.parse!="function")throw new TypeError('expected "'+e+'.parse" to be a function');return i.parse(t,n)}});var tn=F((Vf,oa)=>{"use strict";var ud=Bn(),pd=Xn(),en=At(),gd=Zr(),na=Jo(),fd=Jr(),hd=ea(),md=ra(),ia=Kt();function Z(e,t){if(e==="")return{data:{},content:e,excerpt:"",orig:e};let r=hd(e),n=Z.cache[r.content];if(!t){if(n)return r=Object.assign({},n),r.orig=n.orig,r;Z.cache[r.content]=r}return vd(r,t)}function vd(e,t){let r=en(t),n=r.delimiters[0],i=`
`+r.delimiters[1],o=e.content;r.language&&(e.language=r.language);let a=n.length;if(!ia.startsWith(o,n,a))return na(e,r),e;if(o.charAt(a)===n.slice(-1))return e;o=o.slice(a);let s=o.length,l=Z.language(o,r);l.name&&(e.language=l.name,o=o.slice(l.raw.length));let c=o.indexOf(i);return c===-1&&(c=s),e.matter=o.slice(0,c),e.matter.replace(/^\s*#[^\n]+/gm,"").trim()===""?(e.isEmpty=!0,e.empty=e.content,e.data={}):e.data=md(e.language,e.matter,r),c===s?e.content="":(e.content=o.slice(c+i.length),e.content[0]==="\r"&&(e.content=e.content.slice(1)),e.content[0]===`
`&&(e.content=e.content.slice(1))),na(e,r),(r.sections===!0||typeof r.section=="function")&&pd(e,r.section),e}Z.engines=fd;Z.stringify=function(e,t,r){return typeof e=="string"&&(e=Z(e,r)),gd(e,t,r)};Z.read=function(e,t){let r=ud.readFileSync(e,"utf8"),n=Z(r,t);return n.path=e,n};Z.test=function(e,t){return ia.startsWith(e,en(t).delimiters[0])};Z.language=function(e,t){let n=en(t).delimiters[0];Z.test(e)&&(e=e.slice(n.length));let i=e.slice(0,e.search(/\r?\n/));return{raw:i,name:i?i.trim():""}};Z.cache={};Z.clearCache=function(){Z.cache={}};oa.exports=Z});var Rd={};Ua(Rd,{default:()=>Sr});module.exports=qa(Rd);var Tr=require("obsidian"),vv=Lt(_r());var Lp=Lt(_r());var Rr;(function(e){e[e.Transient=0]="Transient",e[e.Singleton=1]="Singleton",e[e.ResolutionScoped=2]="ResolutionScoped",e[e.ContainerScoped=3]="ContainerScoped"})(Rr||(Rr={}));var X=Rr;var Ir=function(e,t){return Ir=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(r,n){r.__proto__=n}||function(r,n){for(var i in n)n.hasOwnProperty(i)&&(r[i]=n[i])},Ir(e,t)};function ft(e,t){Ir(e,t);function r(){this.constructor=e}e.prototype=t===null?Object.create(t):(r.prototype=t.prototype,new r)}function Cn(e,t,r,n){function i(o){return o instanceof r?o:new r(function(a){a(o)})}return new(r||(r=Promise))(function(o,a){function s(d){try{c(n.next(d))}catch(g){a(g)}}function l(d){try{c(n.throw(d))}catch(g){a(g)}}function c(d){d.done?o(d.value):i(d.value).then(s,l)}c((n=n.apply(e,t||[])).next())})}function kn(e,t){var r={label:0,sent:function(){if(o[0]&1)throw o[1];return o[1]},trys:[],ops:[]},n,i,o,a;return a={next:s(0),throw:s(1),return:s(2)},typeof Symbol=="function"&&(a[Symbol.iterator]=function(){return this}),a;function s(c){return function(d){return l([c,d])}}function l(c){if(n)throw new TypeError("Generator is already executing.");for(;r;)try{if(n=1,i&&(o=c[0]&2?i.return:c[0]?i.throw||((o=i.return)&&o.call(i),0):i.next)&&!(o=o.call(i,c[1])).done)return o;switch(i=0,o&&(c=[c[0]&2,o.value]),c[0]){case 0:case 1:o=c;break;case 4:return r.label++,{value:c[1],done:!1};case 5:r.label++,i=c[1],c=[0];continue;case 7:c=r.ops.pop(),r.trys.pop();continue;default:if(o=r.trys,!(o=o.length>0&&o[o.length-1])&&(c[0]===6||c[0]===2)){r=0;continue}if(c[0]===3&&(!o||c[1]>o[0]&&c[1]<o[3])){r.label=c[1];break}if(c[0]===6&&r.label<o[1]){r.label=o[1],o=c;break}if(o&&r.label<o[2]){r.label=o[2],r.ops.push(c);break}o[2]&&r.ops.pop(),r.trys.pop();continue}c=t.call(e,r)}catch(d){c=[6,d],i=0}finally{n=o=0}if(c[0]&5)throw c[1];return{value:c[0]?c[1]:void 0,done:!0}}}function ht(e){var t=typeof Symbol=="function"&&Symbol.iterator,r=t&&e[t],n=0;if(r)return r.call(e);if(e&&typeof e.length=="number")return{next:function(){return e&&n>=e.length&&(e=void 0),{value:e&&e[n++],done:!e}}};throw new TypeError(t?"Object is not iterable.":"Symbol.iterator is not defined.")}function Me(e,t){var r=typeof Symbol=="function"&&e[Symbol.iterator];if(!r)return e;var n=r.call(e),i,o=[],a;try{for(;(t===void 0||t-- >0)&&!(i=n.next()).done;)o.push(i.value)}catch(s){a={error:s}}finally{try{i&&!i.done&&(r=n.return)&&r.call(n)}finally{if(a)throw a.error}}return o}function le(){for(var e=[],t=0;t<arguments.length;t++)e=e.concat(Me(arguments[t]));return e}var Fr="injectionTokens";function Lr(e){var t=Reflect.getMetadata("design:paramtypes",e)||[],r=Reflect.getOwnMetadata(Fr,e)||{};return Object.keys(r).forEach(function(n){t[+n]=r[n]}),t}function mt(e,t){return function(r,n,i){var o=Reflect.getOwnMetadata(Fr,r)||{};o[i]=t?{token:e,transform:t.transformToken,transformArgs:t.args||[]}:e,Reflect.defineMetadata(Fr,o,r)}}function vt(e){return!!e.useClass}function Ne(e){return!!e.useFactory}var Ht=(function(){function e(t){this.wrap=t,this.reflectMethods=["get","getPrototypeOf","setPrototypeOf","getOwnPropertyDescriptor","defineProperty","has","set","deleteProperty","apply","construct","ownKeys"]}return e.prototype.createProxy=function(t){var r=this,n={},i=!1,o,a=function(){return i||(o=t(r.wrap()),i=!0),o};return new Proxy(n,this.createHandler(a))},e.prototype.createHandler=function(t){var r={},n=function(i){r[i]=function(){for(var o=[],a=0;a<arguments.length;a++)o[a]=arguments[a];o[0]=t();var s=Reflect[i];return s.apply(void 0,le(o))}};return this.reflectMethods.forEach(n),r},e})();function ve(e){return typeof e=="string"||typeof e=="symbol"}function Hr(e){return typeof e=="object"&&"token"in e&&"multiple"in e}function Ot(e){return typeof e=="object"&&"token"in e&&"transform"in e}function An(e){return typeof e=="function"||e instanceof Ht}function Te(e){return!!e.useToken}function Ee(e){return e.useValue!=null}function _n(e){return vt(e)||Ee(e)||Te(e)||Ne(e)}var Va=(function(){function e(){this._registryMap=new Map}return e.prototype.entries=function(){return this._registryMap.entries()},e.prototype.getAll=function(t){return this.ensure(t),this._registryMap.get(t)},e.prototype.get=function(t){this.ensure(t);var r=this._registryMap.get(t);return r[r.length-1]||null},e.prototype.set=function(t,r){this.ensure(t),this._registryMap.get(t).push(r)},e.prototype.setAll=function(t,r){this._registryMap.set(t,r)},e.prototype.has=function(t){return this.ensure(t),this._registryMap.get(t).length>0},e.prototype.clear=function(){this._registryMap.clear()},e.prototype.ensure=function(t){this._registryMap.has(t)||this._registryMap.set(t,[])},e})(),bt=Va;var Ka=(function(e){ft(t,e);function t(){return e!==null&&e.apply(this,arguments)||this}return t})(bt),Rn=Ka;var Ya=(function(){function e(){this.scopedResolutions=new Map}return e})(),yt=Ya;function Wa(e,t){if(e===null)return"at position #"+t;var r=e.split(",")[t].trim();return'"'+r+'" at position #'+t}function Xa(e,t,r){return r===void 0&&(r="    "),le([e],t.message.split(`
`).map(function(n){return r+n})).join(`
`)}function Or(e,t,r){var n=Me(e.toString().match(/constructor\(([\w, ]+)\)/)||[],2),i=n[1],o=i===void 0?null:i,a=Wa(o,t);return Xa("Cannot inject the dependency "+a+' of "'+e.name+'" constructor. Reason:',r)}function In(e){if(typeof e.dispose!="function")return!1;var t=e.dispose;return!(t.length>0)}var Ja=(function(e){ft(t,e);function t(){return e!==null&&e.apply(this,arguments)||this}return t})(bt);var Qa=(function(e){ft(t,e);function t(){return e!==null&&e.apply(this,arguments)||this}return t})(bt);var Za=(function(){function e(){this.preResolution=new Ja,this.postResolution=new Qa}return e})(),Fn=Za;var Mr=new Map,es=(function(){function e(t){this.parent=t,this._registry=new Rn,this.interceptors=new Fn,this.disposed=!1,this.disposables=new Set}return e.prototype.register=function(t,r,n){n===void 0&&(n={lifecycle:X.Transient}),this.ensureNotDisposed();var i;if(_n(r)?i=r:i={useClass:r},Te(i))for(var o=[t],a=i;a!=null;){var s=a.useToken;if(o.includes(s))throw new Error("Token registration cycle detected! "+le(o,[s]).join(" -> "));o.push(s);var l=this._registry.get(s);l&&Te(l.provider)?a=l.provider:a=null}if((n.lifecycle===X.Singleton||n.lifecycle==X.ContainerScoped||n.lifecycle==X.ResolutionScoped)&&(Ee(i)||Ne(i)))throw new Error('Cannot use lifecycle "'+X[n.lifecycle]+'" with ValueProviders or FactoryProviders');return this._registry.set(t,{provider:i,options:n}),this},e.prototype.registerType=function(t,r){return this.ensureNotDisposed(),ve(r)?this.register(t,{useToken:r}):this.register(t,{useClass:r})},e.prototype.registerInstance=function(t,r){return this.ensureNotDisposed(),this.register(t,{useValue:r})},e.prototype.registerSingleton=function(t,r){if(this.ensureNotDisposed(),ve(t)){if(ve(r))return this.register(t,{useToken:r},{lifecycle:X.Singleton});if(r)return this.register(t,{useClass:r},{lifecycle:X.Singleton});throw new Error('Cannot register a type name as a singleton without a "to" token')}var n=t;return r&&!ve(r)&&(n=r),this.register(t,{useClass:n},{lifecycle:X.Singleton})},e.prototype.resolve=function(t,r,n){r===void 0&&(r=new yt),n===void 0&&(n=!1),this.ensureNotDisposed();var i=this.getRegistration(t);if(!i&&ve(t)){if(n)return;throw new Error('Attempted to resolve unregistered dependency token: "'+t.toString()+'"')}if(this.executePreResolutionInterceptor(t,"Single"),i){var o=this.resolveRegistration(i,r);return this.executePostResolutionInterceptor(t,o,"Single"),o}if(An(t)){var o=this.construct(t,r);return this.executePostResolutionInterceptor(t,o,"Single"),o}throw new Error("Attempted to construct an undefined constructor. Could mean a circular dependency problem. Try using `delay` function.")},e.prototype.executePreResolutionInterceptor=function(t,r){var n,i;if(this.interceptors.preResolution.has(t)){var o=[];try{for(var a=ht(this.interceptors.preResolution.getAll(t)),s=a.next();!s.done;s=a.next()){var l=s.value;l.options.frequency!="Once"&&o.push(l),l.callback(t,r)}}catch(c){n={error:c}}finally{try{s&&!s.done&&(i=a.return)&&i.call(a)}finally{if(n)throw n.error}}this.interceptors.preResolution.setAll(t,o)}},e.prototype.executePostResolutionInterceptor=function(t,r,n){var i,o;if(this.interceptors.postResolution.has(t)){var a=[];try{for(var s=ht(this.interceptors.postResolution.getAll(t)),l=s.next();!l.done;l=s.next()){var c=l.value;c.options.frequency!="Once"&&a.push(c),c.callback(t,r,n)}}catch(d){i={error:d}}finally{try{l&&!l.done&&(o=s.return)&&o.call(s)}finally{if(i)throw i.error}}this.interceptors.postResolution.setAll(t,a)}},e.prototype.resolveRegistration=function(t,r){if(this.ensureNotDisposed(),t.options.lifecycle===X.ResolutionScoped&&r.scopedResolutions.has(t))return r.scopedResolutions.get(t);var n=t.options.lifecycle===X.Singleton,i=t.options.lifecycle===X.ContainerScoped,o=n||i,a;return Ee(t.provider)?a=t.provider.useValue:Te(t.provider)?a=o?t.instance||(t.instance=this.resolve(t.provider.useToken,r)):this.resolve(t.provider.useToken,r):vt(t.provider)?a=o?t.instance||(t.instance=this.construct(t.provider.useClass,r)):this.construct(t.provider.useClass,r):Ne(t.provider)?a=t.provider.useFactory(this):a=this.construct(t.provider,r),t.options.lifecycle===X.ResolutionScoped&&r.scopedResolutions.set(t,a),a},e.prototype.resolveAll=function(t,r,n){var i=this;r===void 0&&(r=new yt),n===void 0&&(n=!1),this.ensureNotDisposed();var o=this.getAllRegistrations(t);if(!o&&ve(t)){if(n)return[];throw new Error('Attempted to resolve unregistered dependency token: "'+t.toString()+'"')}if(this.executePreResolutionInterceptor(t,"All"),o){var a=o.map(function(l){return i.resolveRegistration(l,r)});return this.executePostResolutionInterceptor(t,a,"All"),a}var s=[this.construct(t,r)];return this.executePostResolutionInterceptor(t,s,"All"),s},e.prototype.isRegistered=function(t,r){return r===void 0&&(r=!1),this.ensureNotDisposed(),this._registry.has(t)||r&&(this.parent||!1)&&this.parent.isRegistered(t,!0)},e.prototype.reset=function(){this.ensureNotDisposed(),this._registry.clear(),this.interceptors.preResolution.clear(),this.interceptors.postResolution.clear()},e.prototype.clearInstances=function(){var t,r;this.ensureNotDisposed();try{for(var n=ht(this._registry.entries()),i=n.next();!i.done;i=n.next()){var o=Me(i.value,2),a=o[0],s=o[1];this._registry.setAll(a,s.filter(function(l){return!Ee(l.provider)}).map(function(l){return l.instance=void 0,l}))}}catch(l){t={error:l}}finally{try{i&&!i.done&&(r=n.return)&&r.call(n)}finally{if(t)throw t.error}}},e.prototype.createChildContainer=function(){var t,r;this.ensureNotDisposed();var n=new e(this);try{for(var i=ht(this._registry.entries()),o=i.next();!o.done;o=i.next()){var a=Me(o.value,2),s=a[0],l=a[1];l.some(function(c){var d=c.options;return d.lifecycle===X.ContainerScoped})&&n._registry.setAll(s,l.map(function(c){return c.options.lifecycle===X.ContainerScoped?{provider:c.provider,options:c.options}:c}))}}catch(c){t={error:c}}finally{try{o&&!o.done&&(r=i.return)&&r.call(i)}finally{if(t)throw t.error}}return n},e.prototype.beforeResolution=function(t,r,n){n===void 0&&(n={frequency:"Always"}),this.interceptors.preResolution.set(t,{callback:r,options:n})},e.prototype.afterResolution=function(t,r,n){n===void 0&&(n={frequency:"Always"}),this.interceptors.postResolution.set(t,{callback:r,options:n})},e.prototype.dispose=function(){return Cn(this,void 0,void 0,function(){var t;return kn(this,function(r){switch(r.label){case 0:return this.disposed=!0,t=[],this.disposables.forEach(function(n){var i=n.dispose();i&&t.push(i)}),[4,Promise.all(t)];case 1:return r.sent(),[2]}})})},e.prototype.getRegistration=function(t){return this.isRegistered(t)?this._registry.get(t):this.parent?this.parent.getRegistration(t):null},e.prototype.getAllRegistrations=function(t){return this.isRegistered(t)?this._registry.getAll(t):this.parent?this.parent.getAllRegistrations(t):null},e.prototype.construct=function(t,r){var n=this;if(t instanceof Ht)return t.createProxy(function(o){return n.resolve(o,r)});var i=(function(){var o=Mr.get(t);if(!o||o.length===0){if(t.length===0)return new t;throw new Error('TypeInfo not known for "'+t.name+'"')}var a=o.map(n.resolveParams(r,t));return new(t.bind.apply(t,le([void 0],a)))})();return In(i)&&this.disposables.add(i),i},e.prototype.resolveParams=function(t,r){var n=this;return function(i,o){var a,s,l;try{return Hr(i)?Ot(i)?i.multiple?(a=n.resolve(i.transform)).transform.apply(a,le([n.resolveAll(i.token,new yt,i.isOptional)],i.transformArgs)):(s=n.resolve(i.transform)).transform.apply(s,le([n.resolve(i.token,t,i.isOptional)],i.transformArgs)):i.multiple?n.resolveAll(i.token,new yt,i.isOptional):n.resolve(i.token,t,i.isOptional):Ot(i)?(l=n.resolve(i.transform,t)).transform.apply(l,le([n.resolve(i.token,t)],i.transformArgs)):n.resolve(i,t)}catch(c){throw new Error(Or(r,o,c))}}},e.prototype.ensureNotDisposed=function(){if(this.disposed)throw new Error("This container has been disposed, you cannot interact with a disposed container")},e})(),T=new es;function ts(e,t){var r={token:e,multiple:!1,isOptional:t&&t.isOptional};return mt(r)}var C=ts;function rs(e){return function(t){Mr.set(t,Lr(t)),e&&e.token&&(Array.isArray(e.token)?e.token.forEach(function(r){T.register(r,t)}):T.register(e.token,t))}}var _=rs;function ns(){return function(e){_()(e),T.registerSingleton(e)}}var xt=ns;if(typeof Reflect>"u"||!Reflect.getMetadata)throw new Error(`tsyringe requires a reflect polyfill. Please add 'import "reflect-metadata"' to the top of your entry point.`);var h={LoggerService:Symbol.for("LoggerService"),CacheRepository:Symbol.for("CacheRepository"),StorageRepository:Symbol.for("StorageRepository"),KeyValueStorePort:Symbol.for("KeyValueStorePort"),PluginDataStore:Symbol.for("PluginDataStore"),HttpClient:Symbol.for("HttpClient"),VaultRepository:Symbol.for("VaultRepository"),MarkdownRenderer:Symbol.for("MarkdownRenderer"),SettingsRenderer:Symbol.for("SettingsRenderer"),PluginConfigService:Symbol.for("PluginConfigService"),GitHubApiPort:Symbol.for("GitHubApiPort"),GitHubAuthService:Symbol.for("GitHubAuthService"),GitHubRepoService:Symbol.for("GitHubRepoService"),GitHubPagesService:Symbol.for("GitHubPagesService"),PublisherService:Symbol.for("PublisherService"),SiteGeneratorService:Symbol.for("SiteGeneratorService"),DiffEngineService:Symbol.for("DiffEngineService"),LinkGraphService:Symbol.for("LinkGraphService"),ThemeRegistry:Symbol.for("ThemeRegistry"),ThemeRenderer:Symbol.for("ThemeRenderer"),ThemeService:Symbol.for("ThemeService"),PluginInitializer:Symbol.for("PluginInitializer"),ErrorBoundary:Symbol.for("ErrorBoundary"),ObsidianApp:Symbol.for("ObsidianApp"),NoteSelectorView:Symbol.for("NoteSelectorView"),PublishModalView:Symbol.for("PublishModalView"),SettingsPanelView:Symbol.for("SettingsPanelView"),StatusBarView:Symbol.for("StatusBarView"),ViewController:Symbol.for("ViewController")};var Ln={debug:0,info:1,warn:2,error:3},De=class{constructor(){this.minLevel="debug"}setLevel(t){this.minLevel=t}debug(t,...r){this.log("debug",t,r)}info(t,...r){this.log("info",t,r)}warn(t,...r){this.log("warn",t,r)}error(t,...r){this.log("error",t,r)}log(t,r,n){if(Ln[t]<Ln[this.minLevel])return;let o=`${`[OG][${t.toUpperCase()}]`} ${r}`;switch(t){case"debug":console.debug(o,...n);break;case"info":console.info(o,...n);break;case"warn":console.warn(o,...n);break;case"error":console.error(o,...n);break}}};De=L([_()],De);var Ge=class{constructor(){this.store=new Map}get(t){return this.store.get(t)}set(t,r){this.store.set(t,r)}delete(t){return this.store.delete(t)}has(t){return this.store.has(t)}clear(){this.store.clear()}getAll(){let t={};for(let[r,n]of this.store.entries())t[r]=n;return t}};Ge=L([_()],Ge);var Be=class{constructor(){this.store=new Map}get(t){return this.store.get(t)}set(t,r){this.store.set(t,r)}delete(t){return this.store.delete(t)}has(t){return this.store.has(t)}clear(){this.store.clear()}getAll(){let t={};for(let[r,n]of this.store.entries())t[r]=n;return t}};Be=L([_()],Be);var O=class{constructor(t){this.namespace=null;O.logger=t}static setPlugin(t){O.sharedPlugin=t}static create(t){let r=new O({});return r.namespace=t,r}async init(){if(O.sharedLoaded)return;if(O.sharedLoadingPromise!==null){await O.sharedLoadingPromise;return}let t=O.sharedPlugin;if(t===null){O.sharedLoaded=!0;return}O.sharedLoadingPromise=(async()=>{let r=await t.loadData();O.sharedData=r??{},O.sharedLoaded=!0})(),await O.sharedLoadingPromise}get(t){return this.nsData()[t]}set(t,r){this.nsData()[t]=r,this.persist().catch(n=>{this.logError("persist failed after set",n)})}delete(t){let r=this.nsData(),n=t in r;return Reflect.deleteProperty(r,t),n&&this.persist().catch(i=>{this.logError("persist failed after delete",i)}),n}has(t){return t in this.nsData()}clear(){this.namespace!==null?O.sharedData[this.namespace]={}:(O.logger?.warn("[PluginDataStore] clear() called without namespace \u2014 clearing all shared data"),O.sharedData={}),this.persist().catch(t=>{this.logError("persist failed after clear",t)})}getAll(){return{...this.nsData()}}nsData(){if(this.namespace!==null){let t=this.namespace;return O.sharedData[t]||(O.sharedData[t]={}),O.sharedData[t]}return O.sharedData}async persist(){let t=O.sharedPlugin;t!==null&&await t.saveData(O.sharedData)}logError(t,r){let n=r instanceof Error?r.message:String(r);O.logger?.error(`[PluginDataStore] ${t}: ${n}`)}};O.sharedData={},O.sharedLoaded=!1,O.sharedPlugin=null,O.sharedLoadingPromise=null,O.logger=null,O=L([_(),A(0,C(h.LoggerService))],O);var Hn=require("obsidian");var is=12e4,je=class{constructor(){this.interceptors=[]}addInterceptor(t){this.interceptors.push(t)}async request(t){return await this.buildChain()(t)}async get(t,r){return await this.request({method:"GET",url:t,...r})}async post(t,r,n){return await this.request({method:"POST",url:t,body:r,...n})}async patch(t,r,n){return await this.request({method:"PATCH",url:t,body:r,...n})}async delete(t,r){return await this.request({method:"DELETE",url:t,...r})}buildChain(){let t=async r=>await this.executeRequest(r);return this.interceptors.slice().reverse().reduce((r,n)=>i=>n(i,r),t)}async executeRequest(t){let r=t.method??"GET",n=t.timeout??is,i={Accept:"application/json",...t.headers},o;t.body!==void 0&&(o=JSON.stringify(t.body),i["Content-Type"]="application/json");let a=(async()=>{try{let l=await(0,Hn.requestUrl)({url:t.url,method:r,headers:i,body:o,contentType:i["Content-Type"]??"application/json"}),c={};if(l.headers)for(let[g,v]of Object.entries(l.headers))c[g]=String(v);let d=l.json;if(d==null)try{d=JSON.parse(l.text)}catch{d=l.text}return{status:l.status,headers:c,data:d}}catch(l){let c=l,d;if(c.json!==void 0&&c.json!==null)d=c.json;else if(c.message!==void 0)try{d=JSON.parse(c.message)}catch{d={error:c.message}}else d={error:String(l)};return{status:c.status??0,headers:c.headers??{},data:d}}})(),s=new Promise(l=>{window.setTimeout(()=>{l({status:0,headers:{},data:{error:`Request to ${t.url} timed out after ${n}ms. Check your network connection or try again.`}})},n)});return await Promise.race([a,s])}};je=L([_()],je);async function $e(e){let r=new TextEncoder().encode(e),n=await crypto.subtle.digest("SHA-256",r);return Array.from(new Uint8Array(n)).map(o=>o.toString(16).padStart(2,"0")).join("")}var ze=class{constructor(t){this.app=t}async readFile(t){let r=this.app.vault.getFileByPath(t);if(r===null)throw new Error(`File not found: ${t}`);return await this.app.vault.read(r)}async readBinary(t){let r=this.app.vault.getFileByPath(t);if(r===null)throw new Error(`File not found: ${t}`);return await this.app.vault.readBinary(r)}async exists(t){return this.app.vault.getFileByPath(t)!==null}async listMarkdownFiles(){return this.app.vault.getMarkdownFiles().map(t=>t.path)}async getPublishFile(t){let r=this.app.vault.getFileByPath(t);if(r===null)throw new Error(`File not found: ${t}`);let n=await this.app.vault.read(r),i=await $e(n);return{relativePath:t,absolutePath:r.path,content:n,hash:i,mtime:r.stat.mtime}}};ze=L([_(),A(0,C(h.ObsidianApp))],ze);var Mt=require("obsidian");function On(){return activeDocument}var Ue=class{constructor(t){this.app=t}async render(t,r){let n=On().createElement("div");n.setCssProps({display:"none"}),On().body.appendChild(n);let i=new Mt.Component;try{return i.load(),await Mt.MarkdownRenderer.render(this.app,t,n,r,i),n.innerHTML}finally{i.unload(),n.remove()}}};Ue=L([_(),A(0,C(h.ObsidianApp))],Ue);var qe=class{display(){}};qe=L([_()],qe);var be={githubToken:"",githubUsername:"",repoName:"my-garden-site",publishBranch:"gh-pages",siteTitle:"My Verdant Site",siteDescription:"A verdant site powered by Verdant",themeId:"default",lastPublished:"",selectedNotes:[]};var ne=class{static async wrap(t,r,n){try{return await t()}catch(i){let o=i instanceof Error?i.message:String(i),a=i instanceof Error?i.stack:void 0;throw n.error(`[${r}] ${o}`),a!==void 0&&n.error(`[${r}] ${a}`),i}}static async safeExecute(t,r,n,i){try{return await t()}catch(o){let a=o instanceof Error?o.message:String(o),s=o instanceof Error?o.stack:void 0;return n.error(`[${i}] ${a}`),s!==void 0&&n.error(`[${i}] ${s}`),r}}};var Nr=[{key:"githubToken",label:"GitHub Token",description:"Personal Access Token with repo scope",type:"string",defaultValue:"",required:!0,sensitive:!0},{key:"githubUsername",label:"GitHub Username",description:"Your GitHub username/organization",type:"string",defaultValue:"",required:!0},{key:"repoName",label:"Repository Name",description:"Target GitHub repository",type:"string",defaultValue:"my-garden-site",required:!0},{key:"publishBranch",label:"Publish Branch",description:"Branch for GitHub Pages",type:"string",defaultValue:"gh-pages",required:!1},{key:"siteTitle",label:"Site Title",description:"Your site's title",type:"string",defaultValue:"My Verdant Site",required:!1},{key:"siteDescription",label:"Site Description",description:"SEO description",type:"string",defaultValue:"A verdant site powered by Verdant",required:!1},{key:"themeId",label:"Theme",description:"Site theme",type:"string",defaultValue:"default",required:!1},{key:"lastPublished",label:"Last Published",description:"ISO timestamp of last publish",type:"string",defaultValue:"",required:!1},{key:"selectedNotes",label:"Selected Notes",description:"Notes selected for publishing",type:"string[]",defaultValue:[],required:!1}];var ge=class{constructor(t){this.logger=t;this.settings={...be};this.store=null;this.listeners=[];this.savePromise=Promise.resolve()}init(t){this.store=t}async load(){if(this.store===null)return{...be};let t=this.store;return ne.safeExecute(async()=>{let r=t.getAll();return this.settings={...be,...r},{...this.settings}},{...be},this.logger,"PluginConfigService.load")}async save(){if(this.store===null)return;this.saveTimer!==void 0&&(window.clearTimeout(this.saveTimer),this.saveTimer=void 0,this.pendingResolve?.(),this.pendingResolve=void 0);let t={...this.settings},r=this.store;this.savePromise=this.savePromise.then(async()=>{for(let[n,i]of Object.entries(t))r.set(n,i)}).catch(n=>{throw this.logger.error("Failed to save plugin config",n),n}),await this.savePromise}get(t){return this.settings[t]}getAll(){return{...this.settings}}async set(t,r){this.settings[t]=r;for(let n of this.listeners)n(t,r);return this.saveTimer!==void 0&&(window.clearTimeout(this.saveTimer),this.pendingResolve?.()),new Promise(n=>{this.pendingResolve=n,this.saveTimer=window.setTimeout(()=>{this.saveTimer=void 0,this.pendingResolve=void 0,this.save().finally(()=>n())},ge.DEBOUNCE_MS)})}async update(t){Object.assign(this.settings,t),this.saveTimer!==void 0&&(window.clearTimeout(this.saveTimer),this.saveTimer=void 0,this.pendingResolve?.(),this.pendingResolve=void 0),await this.save();for(let r of Object.keys(t))for(let n of this.listeners)n(r,this.settings[r])}getSchema(t){return Nr.find(r=>r.key===t)}getSchemaAll(){return[...Nr]}onChange(t){return this.listeners.push(t),()=>{let r=this.listeners.indexOf(t);r>=0&&this.listeners.splice(r,1)}}async reset(){this.settings={...be},await this.save()}};ge.DEBOUNCE_MS=300,ge=L([_(),A(0,C(h.LoggerService))],ge);function Mn(){T.registerSingleton(h.LoggerService,De),T.registerSingleton(h.CacheRepository,Ge),T.registerSingleton(h.StorageRepository,Be),T.registerSingleton(h.PluginDataStore,O),T.registerSingleton(h.HttpClient,je),T.registerSingleton(h.VaultRepository,ze),T.registerSingleton(h.MarkdownRenderer,Ue),T.registerSingleton(h.SettingsRenderer,qe),T.registerSingleton(h.PluginConfigService,ge)}var K="https://api.github.com";var Nn="100644",Dn="blob";var Dr="chore: update site",Gn="chore: remove files from site";var Ve=class{constructor(t,r){this.httpClient=t;this.logger=r}async validateToken(t){this.logger.debug("Validating GitHub token...");try{let r=await this.httpClient.get(`${K}/user`,{headers:this.authHeaders(t)});if(r.status===200){let n=r.data.login;return this.logger.info("GitHub token validated for user: {username}",n),{valid:!0,username:n}}return r.status===401||r.status===403?(this.logger.warn("GitHub token rejected with status {status}",r.status),{valid:!1,error:"Token is invalid or expired. Please generate a new Personal Access Token."}):(this.logger.error("Unexpected status validating token: {status}",r.status),{valid:!1,error:`GitHub API returned status ${r.status}.`})}catch(r){return this.logger.error("Network error validating GitHub token",r),{valid:!1,error:"Network error. Please check your internet connection."}}}authHeaders(t){return{Authorization:`Bearer ${t}`,Accept:"application/vnd.github.v3+json"}}};Ve=L([_(),A(0,C(h.HttpClient)),A(1,C(h.LoggerService))],Ve);var os=5,ce=class{constructor(t,r,n){this.httpClient=t;this.store=r;this.logger=n}async ensureRepoExists(t,r,n){this.logger.debug("Checking if repo {owner}/{repo} exists...",r,n);try{let i=await this.httpClient.get(`${K}/repos/${r}/${n}`,{headers:this.authHeaders(t)});if(i.status===200){let o=i.data,a=this.toRepoInfo(o);return this.updateCache(r,n,a.defaultBranch),this.logger.info("Repo {owner}/{repo} exists",r,n),a}if(i.status===404){this.logger.info("Repo {owner}/{repo} not found, creating...",r,n);let o=await this.httpClient.post(`${K}/user/repos`,{name:n,auto_init:!0},{headers:this.authHeaders(t)});if(o.status===201){let a=o.data,s=this.toRepoInfo(a);return this.updateCache(r,n,s.defaultBranch),this.logger.info("Created repo {owner}/{repo}",r,n),s}return this.logger.error("Failed to create repo {owner}/{repo}: status {status}",r,n,o.status),this.notFoundRepoInfo(r,n)}return this.logger.error("Unexpected status checking repo {owner}/{repo}: {status}",r,n,i.status),this.notFoundRepoInfo(r,n)}catch(i){return this.logger.error("Error ensuring repo {owner}/{repo} exists: {error}",r,n,i),this.notFoundRepoInfo(r,n)}}async pushFiles(t,r,n,i,o,a){this.logger.debug("Pushing {count} files to {owner}/{repo}:{branch}",o.length,r,n,i);try{let s=await this.createBlobs(t,r,n,o),l=await this.getBaseTree(t,r,n,i),c=await this.postTree(t,r,n,l.treeSha,s),d=await this.postCommit(t,r,n,a,c,l.refSha);return await this.updateRef(t,r,n,i,d,l.isNewBranch),this.logger.info("Successfully pushed {count} files to {owner}/{repo}:{branch}",o.length,r,n,i),{success:!0,commitSha:d}}catch(s){return this.logger.error("Failed to push files: {error}",s),{success:!1,error:s instanceof Error?s.message:String(s)}}}async deleteFiles(t,r,n,i,o,a){this.logger.debug("Deleting {count} files from {owner}/{repo}:{branch}",o.length,r,n,i);try{let s=o.map(g=>({path:g,mode:Nn,type:Dn,sha:null})),l=await this.getBaseTree(t,r,n,i),c=await this.postTree(t,r,n,l.treeSha,s),d=await this.postCommit(t,r,n,a,c,l.refSha);return await this.updateRef(t,r,n,i,d,l.isNewBranch),this.logger.info("Successfully deleted {count} files from {owner}/{repo}:{branch}",o.length,r,n,i),{success:!0,commitSha:d}}catch(s){return this.logger.error("Failed to delete files: {error}",s),{success:!1,error:s instanceof Error?s.message:String(s)}}}authHeaders(t){return{Authorization:`Bearer ${t}`,Accept:"application/vnd.github.v3+json"}}toRepoInfo(t){return{name:t.name,owner:t.owner.login,fullName:t.full_name,url:t.html_url,defaultBranch:t.default_branch,exists:!0}}notFoundRepoInfo(t,r){return{name:r,owner:t,fullName:`${t}/${r}`,url:"",defaultBranch:"main",exists:!1}}async createBlobs(t,r,n,i){let o=[],a=as(i,os);for(let s of a){let l=await Promise.all(s.map(async c=>{let d=await this.httpClient.post(`${K}/repos/${r}/${n}/git/blobs`,{content:c.content,encoding:"utf-8"},{headers:this.authHeaders(t)});if(d.status!==201)throw new Error(`Failed to create blob for ${c.path}: status ${d.status}`);return{path:c.path,mode:c.mode,type:c.type,sha:d.data.sha}}));o.push(...l)}return o}async getBaseTree(t,r,n,i){let o=await this.httpClient.get(`${K}/repos/${r}/${n}/git/refs/heads/${i}`,{headers:this.authHeaders(t)});if(o.status===200){let g=o.data.object.sha,v=await this.httpClient.get(`${K}/repos/${r}/${n}/git/commits/${g}`,{headers:this.authHeaders(t)});if(v.status!==200)throw new Error(`Failed to get commit ${g}: status ${v.status}`);return{refSha:g,treeSha:v.data.tree.sha,isNewBranch:!1}}let a=await this.httpClient.get(`${K}/repos/${r}/${n}`,{headers:this.authHeaders(t)});if(a.status!==200)throw new Error(`Failed to get repo ${r}/${n}: status ${a.status}`);let s=a.data.default_branch,l=await this.httpClient.get(`${K}/repos/${r}/${n}/git/refs/heads/${s}`,{headers:this.authHeaders(t)});if(l.status!==200)return{refSha:"",treeSha:"",isNewBranch:!0};let c=l.data.object.sha,d=await this.httpClient.get(`${K}/repos/${r}/${n}/git/commits/${c}`,{headers:this.authHeaders(t)});if(d.status!==200)throw new Error(`Failed to get commit ${c}: status ${d.status}`);return{refSha:c,treeSha:d.data.tree.sha,isNewBranch:!0}}async postTree(t,r,n,i,o){let a={tree:o};i!==""&&(a.base_tree=i);let s=await this.httpClient.post(`${K}/repos/${r}/${n}/git/trees`,a,{headers:this.authHeaders(t)});if(s.status!==201)throw new Error(`Failed to create tree: status ${s.status}`);return s.data.sha}async postCommit(t,r,n,i,o,a){let s={message:i,tree:o,parents:a!==""?[a]:[]},l=await this.httpClient.post(`${K}/repos/${r}/${n}/git/commits`,s,{headers:this.authHeaders(t)});if(l.status!==201)throw new Error(`Failed to create commit: status ${l.status}`);return l.data.sha}updateCache(t,r,n){try{let i=this.store.get(ce.CACHE_KEY);i!==void 0&&(i.siteConfig.repo=`${t}/${r}`,i.siteConfig.branch=n,this.store.set(ce.CACHE_KEY,i))}catch(i){this.logger.warn("Failed to update publish cache: {error}",i)}}async updateRef(t,r,n,i,o,a){if(a){let s=await this.httpClient.post(`${K}/repos/${r}/${n}/git/refs`,{ref:`refs/heads/${i}`,sha:o},{headers:this.authHeaders(t)});if(s.status!==201)throw new Error(`Failed to create ref refs/heads/${i}: status ${s.status}`)}else{let s=await this.httpClient.patch(`${K}/repos/${r}/${n}/git/refs/heads/${i}`,{sha:o,force:!0},{headers:this.authHeaders(t)});if(s.status!==200)throw new Error(`Failed to update ref refs/heads/${i}: status ${s.status}`)}}};ce.CACHE_KEY="publish_cache",ce=L([_(),A(0,C(h.HttpClient)),A(1,C(h.KeyValueStorePort)),A(2,C(h.LoggerService))],ce);function as(e,t){let r=[];for(let n=0;n<e.length;n+=t)r.push(e.slice(n,n+t));return r}var Ke=class{constructor(t,r){this.httpClient=t;this.logger=r}async enablePages(t,r,n,i){let o=i??"gh-pages";if(this.logger.debug("Enabling GitHub Pages for {owner}/{repo} on branch {branch}",r,n,o),(await this.getPagesStatus(t,r,n)).enabled){this.logger.info("GitHub Pages already enabled for {owner}/{repo}, skipping enable call",r,n);return}try{let s=await this.httpClient.post(`${K}/repos/${r}/${n}/pages`,{source:{branch:o,path:"/"}},{headers:this.authHeaders(t)});if(s.status===201||s.status===204||s.status===409){this.logger.info("GitHub Pages enabled for {owner}/{repo}",r,n);return}throw this.logger.error("Failed to enable GitHub Pages for {owner}/{repo}: status {status}",r,n,s.status),new Error(`GitHub API returned status ${s.status} when enabling Pages.`)}catch(s){throw this.logger.error("Error enabling GitHub Pages for {owner}/{repo}: {error}",r,n,s),s}}async getPagesStatus(t,r,n){this.logger.debug("Getting GitHub Pages status for {owner}/{repo}",r,n);try{let i=await this.httpClient.get(`${K}/repos/${r}/${n}/pages`,{headers:this.authHeaders(t)});if(i.status===200){let o=i.data;return{enabled:!0,url:o.html_url,status:o.status}}return i.status===404?(this.logger.info("GitHub Pages not enabled for {owner}/{repo}",r,n),{enabled:!1,url:"",status:null}):(this.logger.error("Unexpected status getting Pages status for {owner}/{repo}: {status}",r,n,i.status),{enabled:!1,url:"",status:null})}catch(i){return this.logger.error("Error getting GitHub Pages status for {owner}/{repo}: {error}",r,n,i),{enabled:!1,url:"",status:null}}}authHeaders(t){return{Authorization:`Bearer ${t}`,Accept:"application/vnd.github.v3+json"}}};Ke=L([_(),A(0,C(h.HttpClient)),A(1,C(h.LoggerService))],Ke);var Ye=class{constructor(t,r,n,i){this.logger=t;this.authService=r;this.repoService=n;this.pagesService=i}async validateToken(t){return this.logger.debug("GithubApiAdapter.validateToken"),ne.wrap(async()=>this.authService.validateToken(t),"GithubApiAdapter.validateToken",this.logger)}async ensureRepoExists(t,r,n){return this.logger.debug("GithubApiAdapter.ensureRepoExists"),ne.wrap(async()=>this.repoService.ensureRepoExists(t,r,n),"GithubApiAdapter.ensureRepoExists",this.logger)}async pushFiles(t,r,n,i,o,a){return this.logger.debug("GithubApiAdapter.pushFiles"),ne.wrap(async()=>this.repoService.pushFiles(t,r,n,i,o,a),"GithubApiAdapter.pushFiles",this.logger)}async deleteFiles(t,r,n,i,o,a){return this.logger.debug("GithubApiAdapter.deleteFiles"),ne.wrap(async()=>this.repoService.deleteFiles(t,r,n,i,o,a),"GithubApiAdapter.deleteFiles",this.logger)}async enablePages(t,r,n,i){return this.logger.debug("GithubApiAdapter.enablePages"),ne.wrap(async()=>{await this.pagesService.enablePages(t,r,n,i)},"GithubApiAdapter.enablePages",this.logger)}async getPagesStatus(t,r,n){return this.logger.debug("GithubApiAdapter.getPagesStatus"),ne.wrap(async()=>this.pagesService.getPagesStatus(t,r,n),"GithubApiAdapter.getPagesStatus",this.logger)}};Ye=L([_(),A(0,C(h.LoggerService)),A(1,C(h.GitHubAuthService)),A(2,C(h.GitHubRepoService)),A(3,C(h.GitHubPagesService))],Ye);var da=Lt(tn());var bd=Lt(tn()),aa=/\[\[(?:([^\]|#]+?)\/)?([^\]|#]+)(?:#([^\]|]*))?(?:\|([^\]|]+))?\]\]/g;function sa(e){let t=[],r=new Set,n;for(;(n=aa.exec(e))!==null;){let i=n[2]?.trim();if(!i)continue;let o=i.toLowerCase();if(r.has(o))continue;r.add(o);let a=n[1]?.trim()||void 0,s=n[4]?.trim()||void 0;t.push({name:i,folder:a,alias:s})}return t}function rn(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function la(e,t){return e.replace(aa,(r,n,i,o,a)=>{let s=i.trim(),l=n?.trim()||void 0,c=rn(a?.trim()??s),d=rn(t(s,l));return o!==void 0&&o.trim().length>0&&(d+=`#${rn(o.trim())}`),`<a href="${d}">${c}</a>`})}var yd="app://obsidian.md/",xd=["resources/",".trash/"],wd={png:"image/png",jpg:"image/jpeg",jpeg:"image/jpeg",gif:"image/gif",svg:"image/svg+xml",webp:"image/webp",bmp:"image/bmp",ico:"image/x-icon"};function Yt(e){return e.trim().toLowerCase().replace(/\s+/g,"-").replace(/[<>:"/\\|?*#[\]{}()@!$&+=,;'`~%^]+/g,"").replace(/-+/g,"-").replace(/^-+|-+$/g,"")}function ca(e){return`/${e.replace(/\.md$/i,"").replace(/\\/g,"/").split("/").map(r=>Yt(r)).join("/")}/`}function nn(e){return`${e.replace(/\.md$/i,"").replace(/\\/g,"/").split("/").map(r=>Yt(r)).join("/")}/index.html`}function Sd(e){return Yt(e.replace(/\.md$/i,"").replace(/\\/g,"/").split("/").pop()??e)}var it=class{constructor(t,r,n,i,o){this.renderer=t;this.logger=r;this.themeRenderer=n;this.linkGraphService=i;this.vaultRepo=o}async generateFile(t,r,n,i){let o=(0,da.default)(t.content),a=o.data,s=o.content,l=a.title??this.extractTitleFromBody(s),c=Array.isArray(a.tags)?a.tags:[],d=a.date,g;typeof d=="string"&&d.length>0&&!Number.isNaN(Date.parse(d))?g=d:d instanceof Date&&!Number.isNaN(d.getTime())&&(g=d.toISOString());let v=this.buildExcerpt(s),b=la(s,(we,te)=>{let Se;n!==void 0?Se=this.linkGraphService.resolveWikiLink({name:we,folder:te},n)??ca(we):Se=ca(we);let Er=Se.startsWith("/")?Se.slice(1):Se;return`${r.baseUrl}/${Er}`}),P=await this.renderer.render(b,t.relativePath),H=await this.processImages(P),R=nn(t.relativePath),ee=Sd(t.relativePath),D=[],W,ue,pe,ae;if(n){D=this.linkGraphService.getRelatedNotes(ee,n);let we=Array.from(n.edges.keys()).sort(),te=this.linkGraphService.getPrevNext(ee,n,we);te.prev&&(W=n.slugToTitle.get(te.prev)??te.prev,pe=n.slugToRepoPath.get(te.prev)??`${te.prev}/index.html`),te.next&&(ue=n.slugToTitle.get(te.next)??te.next,ae=n.slugToRepoPath.get(te.next)??`${te.next}/index.html`)}return{html:this.themeRenderer.renderNote(H,l,c,g,r,D,i,W,ue,pe,ae),relativePath:R,title:l,tags:c,excerpt:v,date:g}}async generateSite(t,r,n){this.logger.info("Generating site with %d files",t.length);let i=this.linkGraphService.buildGraph(t),o=[],a=new Map;for(let D of t){let W=await this.generateFile(D,r,i,n);o.push(W);for(let ue of W.tags){let pe=a.get(ue)??[];pe.push({title:W.title,path:W.relativePath}),a.set(ue,pe)}}let s=o.map((D,W)=>({title:D.title,path:D.relativePath,order:W})),l={};for(let[D,W]of a)l[D]=W;let c=o.map(D=>({title:D.title,path:D.relativePath,tags:D.tags,excerpt:D.excerpt})),d=this.themeRenderer.renderIndex(o,r),g=this.themeRenderer.getTotalPages(o.length),v=[];for(let D=2;D<=g;D++){let W=this.themeRenderer.renderIndexPage(o,r,D);v.push({html:W,relativePath:`page/${D}/index.html`,title:`Page ${D}`,tags:[],excerpt:"",date:void 0})}let b=this.generateTagDetailFiles(l,r),P=[...o,...v,...b],H=o.filter(D=>D.date!==void 0).map(D=>({title:D.title,slug:D.relativePath.replace(/\/index\.html$/,""),date:D.date,excerpt:D.excerpt})),R=this.themeRenderer.renderFeed(H,r),ee=[];if((r.customCss??"").length===0){let D=this.themeRenderer.getCSS(r.themeId??"default");ee.push({html:D,relativePath:"assets/theme.css",title:"Theme CSS",tags:[],excerpt:"",date:void 0})}return{files:[...P,...ee],indexHtml:d,navigation:s,tags:l,searchIndex:c,feedXml:R}}async processImages(t){let r=/<img\b[^>]*\bsrc="(app:\/\/obsidian\.md\/[^"]*)"[^>]*>/gi,n=t,i=[],o=Array.from(t.matchAll(r));for(let a of o){let s=a[0],l=a[1];if(!l)continue;let c=decodeURIComponent(l.slice(yd.length));if(this.isObsidianInternalPath(c)){this.logger.debug("Skipping Obsidian internal resource: %s",c),i.push({old:s,new:""});continue}try{let d=await this.vaultRepo.readBinary(c),g=(c.split(".").pop()??"").toLowerCase(),v=wd[g]??"application/octet-stream",b=this.arrayBufferToBase64(d),P=`data:${v};base64,${b}`,H=s.replace(l,P);i.push({old:s,new:H}),this.logger.debug("Embedded vault image: %s",c)}catch{this.logger.warn("Failed to read vault image, removing from output: %s",c),i.push({old:s,new:""})}}for(let{old:a,new:s}of i)n=n.split(a).join(s);return n}isObsidianInternalPath(t){return xd.some(r=>t.startsWith(r))}arrayBufferToBase64(t){let r=new Uint8Array(t),n=4096,i="";for(let o=0;o<r.length;o+=n)i+=String.fromCharCode(...r.subarray(o,o+n));return btoa(i)}generateTagDetailFiles(t,r){let n=[];for(let[i,o]of Object.entries(t)){let a=o.map(c=>({html:"",relativePath:c.path,title:c.title,tags:[i],excerpt:"",date:void 0})),s=this.themeRenderer.renderTagDetail(a,i,r),l=Yt(i);n.push({html:s,relativePath:`tags/${l}/index.html`,title:`Tag: ${i}`,tags:[i],excerpt:`${o.length} note${o.length!==1?"s":""} with tag "${i}"`,date:void 0})}return n}extractTitleFromBody(t){return t.match(/^#\s+(.+)$/m)?.[1]?.trim()??"Untitled"}buildExcerpt(t){let r=t.replace(/^---[\s\S]*?---/m,"").replace(/#{1,6}\s+.*/g,"").replace(/<[^>]+>/g,"").replace(/\[([^\]]*)\]\([^)]*\)/g,"$1").replace(/\*\*([^*]+)\*\*/g,"$1").replace(/\*([^*]+)\*/g,"$1").replace(/`([^`]+)`/g,"$1").trim().replace(/\s+/g," ");return r.length<=200?r:r.slice(0,197)+"..."}};it=L([_(),A(0,C(h.MarkdownRenderer)),A(1,C(h.LoggerService)),A(2,C(h.ThemeRenderer)),A(3,C(h.LinkGraphService)),A(4,C(h.VaultRepository))],it);function Td(e,t){return e.lastModified===t.mtime}var ot=class{constructor(t,r){this.logger=t;this.store=r}async computeDiff(t){let r=this.store.get("main");this.logger.info("Computing diff: %d current files vs cache with %d entries",t.length,r!=null?Object.keys(r.files).length:0);let n=[],i=[],o=[],a=[],s=new Map;for(let l of t)s.set(l.relativePath,l);if(r==null){for(let l of t)n.push(l);return this.logger.info("Diff result (no cache): %d added, %d modified, %d deleted, %d unchanged",n.length,i.length,o.length,a.length),{added:n,modified:i,deleted:o,unchanged:a}}for(let l of t){let c=r.files[l.relativePath];if(c===void 0){n.push(l);continue}if(Td(c,l)){a.push(l.relativePath);continue}await $e(l.content)===c.hash?a.push(l.relativePath):i.push(l)}for(let l of Object.keys(r.files))s.has(l)||o.push(l);return this.logger.info("Diff result: %d added, %d modified, %d deleted, %d unchanged",n.length,i.length,o.length,a.length),{added:n,modified:i,deleted:o,unchanged:a}}};ot=L([_(),A(0,C(h.LoggerService)),A(1,C(h.KeyValueStorePort))],ot);var Wt="gh-pages";function Y(e,t,r,n){n!==void 0&&n({step:e,percent:t,message:r})}function _t(e){return Date.now()-e}var at=class{constructor(t,r,n,i,o,a,s){this.vaultRepo=t;this.store=r;this.logger=n;this.githubApi=i;this.siteGenerator=o;this.diffEngine=a;this.themeRenderer=s}async publish(t,r,n,i=10){let o=Date.now(),a=r.githubBranch??Wt;try{this.validateConfig(r);let s=await this.scanNotes(t,i,n);Y("generating",30,"Generating static site...",n);let l=await this.siteGenerator.generateSite(s,r),c=this.buildGitFiles(l,r);if(Y("pushing",60,"Ensuring GitHub repository exists...",n),!(await this.githubApi.ensureRepoExists(r.githubToken,r.githubOwner,r.githubRepo)).exists)throw new Error(`Repository "${r.githubOwner}/${r.githubRepo}" could not be created. Please check that your GitHub token has repo scope and try again.`);Y("pushing",65,"Pushing to GitHub...",n);let g=await this.githubApi.pushFiles(r.githubToken,r.githubOwner,r.githubRepo,a,c,Dr);if(!g.success)throw new Error(g.error??"Git push failed");return Y("deploying",75,"Enabling GitHub Pages...",n),await this.githubApi.enablePages(r.githubToken,r.githubOwner,r.githubRepo,a),Y("deploying",85,"Updating cache...",n),await this.updateCache(s,r),Y("done",100,"Published successfully!",n),{success:!0,siteUrl:r.baseUrl,notesPublished:s.length,elapsedMs:_t(o),wasIncremental:!1}}catch(s){let l=s instanceof Error?s.message:"Unknown error";return this.logger.error("Publish failed: %s",l),Y("error",0,l,n),{success:!1,siteUrl:void 0,notesPublished:0,elapsedMs:_t(o),error:l,wasIncremental:!1}}}async publishIncremental(t,r,n,i=10){let o=Date.now(),a=r.githubBranch??Wt;try{this.validateConfig(r);let s=await this.scanNotes(t,i,n);Y("generating",30,"Computing diff...",n);let l=await this.diffEngine.computeDiff(s);if(l.added.length===0&&l.modified.length===0&&l.deleted.length===0)return this.logger.info("No changes detected, skipping publish"),Y("done",100,"No changes to publish",n),{success:!0,siteUrl:r.baseUrl,notesPublished:0,elapsedMs:_t(o),wasIncremental:!0};Y("generating",40,"Generating static site...",n);let c=await this.siteGenerator.generateSite(s,r);if(Y("pushing",60,"Ensuring GitHub repository exists...",n),!(await this.githubApi.ensureRepoExists(r.githubToken,r.githubOwner,r.githubRepo)).exists)throw new Error(`Repository "${r.githubOwner}/${r.githubRepo}" could not be created. Please check that your GitHub token has repo scope and try again.`);Y("pushing",65,"Pushing changes to GitHub...",n);let g=this.buildGitFiles(c,r),v=await this.githubApi.pushFiles(r.githubToken,r.githubOwner,r.githubRepo,a,g,Dr);if(!v.success)throw new Error(v.error??"Git push failed");if(l.deleted.length>0){Y("pushing",70,"Removing deleted files...",n);let b=l.deleted.map(P=>nn(P));await this.githubApi.deleteFiles(r.githubToken,r.githubOwner,r.githubRepo,a,b,Gn)}return Y("deploying",75,"Enabling GitHub Pages...",n),await this.githubApi.enablePages(r.githubToken,r.githubOwner,r.githubRepo,a),Y("deploying",85,"Updating cache...",n),await this.updateCache(s,r),Y("done",100,"Published incrementally!",n),{success:!0,siteUrl:r.baseUrl,notesPublished:s.length,elapsedMs:_t(o),wasIncremental:!0}}catch(s){let l=s instanceof Error?s.message:"Unknown error";return this.logger.error("Incremental publish failed: %s",l),Y("error",0,l,n),{success:!1,siteUrl:void 0,notesPublished:0,elapsedMs:_t(o),error:l,wasIncremental:!0}}}async scanNotes(t,r=10,n){if(t.length===0)throw new Error("PUBLISH_NO_FILES");if(r!==-1&&t.length>r)throw new Error(`Free tier limit exceeded: max ${r} notes`);Y("scanning",10,"Scanning vault...",n);let i=[];for(let o of t){let a=await this.vaultRepo.getPublishFile(o);i.push(a)}return this.logger.info("Scanned %d notes from vault",i.length),i}buildGitFiles(t,r){let n=[];for(let a of t.files)n.push({path:a.relativePath,content:a.html,mode:"100644",type:"blob"});n.push({path:"index.html",content:t.indexHtml,mode:"100644",type:"blob"}),n.push({path:"navigation.json",content:JSON.stringify(t.navigation,null,2),mode:"100644",type:"blob"}),n.push({path:"search.json",content:JSON.stringify(t.searchIndex,null,2),mode:"100644",type:"blob"});let i=this.themeRenderer.renderTags(t.tags,r);n.push({path:"tags/index.html",content:i,mode:"100644",type:"blob"}),n.push({path:".nojekyll",content:"",mode:"100644",type:"blob"}),t.feedXml&&n.push({path:"feed.xml",content:t.feedXml,mode:"100644",type:"blob"});let o=r.customCss??this.themeRenderer.getCSS(r.themeId??"default");if(n.push({path:"assets/theme.css",content:o,mode:"100644",type:"blob"}),r.isPro){let a=this.themeRenderer.getFlexSearchBundle();a&&n.push({path:"assets/flexsearch.bundle.js",content:a,mode:"100644",type:"blob"})}return n}validateConfig(t){let r=[];if(t.githubToken===""&&r.push("GitHub token"),t.githubOwner===""&&r.push("GitHub username"),t.githubRepo===""&&r.push("Repository name"),t.title===""&&r.push("Site title"),r.length>0)throw new Error(`Missing required configuration: ${r.join(", ")}. Please fill in these fields in the settings panel.`);(!t.baseUrl||t.baseUrl==="")&&this.logger.warn("baseUrl is empty \u2014 site links may not resolve correctly")}async updateCache(t,r){let n={};for(let o of t){let a=await $e(o.content);n[o.relativePath]={hash:a,size:new TextEncoder().encode(o.content).length,lastModified:o.mtime}}let i={version:1,lastPublished:new Date().toISOString(),files:n,siteConfig:{repo:r.githubRepo,branch:r.githubBranch??Wt}};this.store.set("main",i),this.logger.info("Cache updated with %d files",t.length)}};at=L([_(),A(0,C(h.VaultRepository)),A(1,C(h.KeyValueStorePort)),A(2,C(h.LoggerService)),A(3,C(h.GitHubApiPort)),A(4,C(h.SiteGeneratorService)),A(5,C(h.DiffEngineService)),A(6,C(h.ThemeRenderer))],at);function Fe(e){return e.trim().toLowerCase().replace(/\s+/g,"-").replace(/[<>:"/\\|?*#[\]{}()@!$&+=,;'`~%^]+/g,"").replace(/-+/g,"-").replace(/^-+|-+$/g,"")}function Ed(e){return Fe(e.replace(/\.md$/i,"").replace(/\\/g,"/").split("/").pop()??e)}function ua(e){return`${e.replace(/\.md$/i,"").replace(/\\/g,"/").split("/").map(r=>Fe(r)).join("/")}/index.html`}var st=class{buildGraph(t){let r=new Map,n=new Map,i=new Map,o=new Map,a=new Map,s=new Map;for(let c of t){let d=Ed(c.relativePath);s.set(d,c),o.set(d,ua(c.relativePath))}let l=new Map;for(let[c,d]of s){let g=this.extractTitleFromContent(d.content),b=ua(d.relativePath).replace(/\/index\.html$/,"/");l.set(c,c),a.set(c,b);let P=d.relativePath.replace(/\.md$/i,"").replace(/\\/g,"/").split("/").map(R=>Fe(R)).join("/");a.set(P,b);let H=Fe(g);H.length>0&&(l.set(H,c),a.set(H,b))}for(let[c,d]of s){let g=sa(d.content),v=new Set;for(let b of g){let P=l.get(Fe(b.name));P!==void 0&&P!==c&&v.add(P)}r.set(c,v),n.set(c,this.extractTitleFromContent(d.content))}for(let[c,d]of r)for(let g of d){let v=i.get(g)??new Set;v.add(c),i.set(g,v)}return{edges:r,slugToTitle:n,backlinks:i,slugToRepoPath:o,linkNameToUrl:a}}resolveWikiLink(t,r){let n=Fe(t.name);if(n.length!==0){if(t.folder!==void 0&&t.folder.trim().length>0){let o=`${t.folder.split("/").map(s=>Fe(s)).join("/")}/${n}`,a=r.linkNameToUrl.get(o);if(a!==void 0)return a}return r.linkNameToUrl.get(n)}}getRelatedNotes(t,r,n=5){let i=r.edges.get(t)??new Set;if(i.size===0)return[];let o=new Set;for(let s of i){let l=r.backlinks.get(s);if(l!==void 0)for(let c of l)c!==t&&o.add(c)}let a=[];for(let s of o){let l=r.edges.get(s)??new Set;if(l.size===0)continue;let c=0;for(let v of i)l.has(v)&&c++;let d=i.size+l.size-c,g=c/d;g>0&&a.push({slug:s,title:r.slugToTitle.get(s)??s,score:g,repoPath:r.slugToRepoPath.get(s)??`${s}/index.html`})}return a.sort((s,l)=>l.score-s.score||s.title.localeCompare(l.title)),a.slice(0,n)}getPrevNext(t,r,n){let i=n.indexOf(t);if(i===-1)return{};let o=i>0?n[i-1]:void 0,a=i<n.length-1?n[i+1]:void 0;return{prev:o,next:a}}extractTitleFromContent(t){let r=t.match(/^---\s*\ntitle:\s*(.+)\s*\n/);return r?.[1]?r[1].trim().replace(/^['"]|['"]$/g,""):t.match(/^#\s+(.+)$/m)?.[1]?.trim()??"Untitled"}};st=L([_()],st);var pa=[{id:"default",name:"Default Light",description:"Clean, minimal light theme",isBuiltIn:!0},{id:"dark",name:"Dark Mode",description:"Easy-on-the-eyes dark theme",isBuiltIn:!0}];var Le=class{constructor(t){this.logger=t;this.themes=new Map;this.registerBuiltIn()}register(t){if(this.themes.has(t.id)){this.logger.warn(`Theme "${t.id}" is already registered. Skipping duplicate.`);return}this.themes.set(t.id,t)}get(t){return this.themes.get(t)}list(){return Array.from(this.themes.values())}getBuiltIn(){return Array.from(this.themes.values()).filter(t=>t.isBuiltIn)}registerBuiltIn(){for(let t of pa)this.themes.set(t.id,t)}};Le=L([_(),A(0,C(h.LoggerService))],Le);var ga=`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="{{description}}">
  <title>{{title}}</title>
  {{stylesheetLink}}
  <style>{{inlineStyles}}</style>
</head>
<body>
  <header class="garden-nav">
    <div class="garden-nav-header">
      <div class="garden-brand">
        <div class="garden-logo"></div>
        <a href="{{baseUrl}}/" class="garden-site-title">{{siteTitle}}</a>
      </div>
      <button class="garden-menu-toggle" aria-label="Toggle navigation" aria-expanded="false">
        <span class="garden-menu-icon"></span>
      </button>
      <div class="garden-nav-links">
        {{navLinks}}
      </div>
    </div>
  </header>

  <main class="garden-content">{{content}}</main>

  <footer class="garden-footer">
    <div class="garden-footer-inner">
      <p>Cultivated with <a href="https://verdant.pub" target="_blank" rel="noopener">Verdant</a></p>
      <p class="garden-footer-stats">{{stats}}</p>
    </div>
  </footer>

  <script>
(function() {
  var toggle = document.querySelector('.garden-menu-toggle');
  var navLinks = document.querySelector('.garden-nav-links');
  if (toggle && navLinks) {
    toggle.addEventListener('click', function() {
      var expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', !expanded);
      navLinks.classList.toggle('garden-nav-open');
      toggle.classList.toggle('garden-menu-active');
    });
  }

  var searchInput = document.querySelector('.garden-search-input:not(.garden-search-pro)');
  var cards = document.querySelectorAll('.garden-card');
  var noteCount = document.querySelector('.garden-note-count');

  if (searchInput && cards.length > 0) {
    searchInput.addEventListener('input', function(e) {
      var query = e.target.value.toLowerCase().trim();
      var visibleCount = 0;

      cards.forEach(function(card) {
        var title = card.getAttribute('data-title') || '';
        var excerpt = card.getAttribute('data-excerpt') || '';
        var tags = card.getAttribute('data-tags') || '';
        var match = query === '' ||
          title.toLowerCase().indexOf(query) !== -1 ||
          excerpt.toLowerCase().indexOf(query) !== -1 ||
          tags.toLowerCase().indexOf(query) !== -1;

        card.style.display = match ? '' : 'none';
        if (match) visibleCount++;
      });

      if (noteCount) {
        noteCount.textContent = visibleCount + ' note' + (visibleCount !== 1 ? 's' : '');
      }
    });
  }

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && navLinks && navLinks.classList.contains('garden-nav-open')) {
      navLinks.classList.remove('garden-nav-open');
      if (toggle) {
        toggle.classList.remove('garden-menu-active');
        toggle.setAttribute('aria-expanded', 'false');
      }
    }
  });
})();
  <\/script>
  {{searchScript}}
</body>
</html>`;var fa=`<div class="garden-home">
  <header class="garden-home-header">
    <p class="garden-home-description">{{description}}</p>
    <div class="garden-search-container">
      {{searchHtml}}
      <span class="garden-note-count">{{noteCount}} notes</span>
      {{searchResultsContainer}}
    </div>
  </header>

  <section class="garden-card-grid">
    {{noteCards}}
  </section>

  <div class="garden-empty-state" style="display:{{isEmptyDisplay}}">
    <span class="garden-empty-icon"></span>
    <p class="garden-empty-text">No notes published yet</p>
    <p class="garden-empty-subtext">Your first note marks the beginning of your garden.</p>
  </div>

  <nav class="garden-pagination" style="display:{{paginationDisplay}}">
    {{paginationHtml}}
  </nav>
</div>`;var ha=`<article class="garden-note">
  <aside class="garden-toc">
    <button class="garden-toc-toggle" aria-expanded="false">
      Table of Contents
      <span class="garden-toc-arrow"></span>
    </button>
    <nav class="garden-toc-nav">
      {{tocHtml}}
    </nav>
  </aside>

  <div class="garden-note-main">
    <header class="garden-note-header">
      <h1>{{title}}</h1>
      <div class="garden-note-meta">
        {{date}}
      </div>
    </header>

    <div class="garden-note-body">
      {{bodyHtml}}
    </div>

    <div class="garden-note-tags">
      {{tagsHtml}}
    </div>

    <section class="garden-related">
      <h2 class="garden-related-heading">Related Notes</h2>
      {{relatedNotesHtml}}
    </section>

    <nav class="garden-note-pagination">
      {{pagination}}
    </nav>
  </div>

  <section class="garden-comments">
    <h2 class="garden-comments-heading">Comments</h2>
    {{commentsHtml}}
  </section>
</article>

<script>
(function() {
  var tocToggle = document.querySelector('.garden-toc-toggle');
  var tocNav = document.querySelector('.garden-toc-nav');
  if (tocToggle && tocNav) {
    if (!tocNav.innerHTML.trim()) {
      tocToggle.style.display = 'none';
    } else {
      tocToggle.addEventListener('click', function() {
        var expanded = tocToggle.getAttribute('aria-expanded') === 'true';
        tocToggle.setAttribute('aria-expanded', !expanded);
        tocNav.classList.toggle('garden-toc-open');
        tocToggle.classList.toggle('garden-toc-active');
      });
    }
  }

  var relatedSection = document.querySelector('.garden-related');
  if (relatedSection && !relatedSection.querySelector('.garden-related-item')) {
    relatedSection.style.display = 'none';
  }

  var commentsSection = document.querySelector('.garden-comments');
  if (commentsSection && !commentsSection.querySelector('.giscus')) {
    commentsSection.style.display = 'none';
  }
})();
<\/script>`;var ma=`<section class="garden-tags">
  <h1>Tags</h1>
  <div class="garden-tag-cloud">
    {{tagCloud}}
  </div>
</section>`;var va=`<section class="garden-tag-detail">
  <header>
    <h1>{{tag}}</h1>
    <p>{{count}} notes</p>
  </header>
  <div class="garden-card-grid">
    {{noteCards}}
  </div>
</section>`;var Xt=`/* Verdant */
:root {
  --bg: #faf9f6;
  --bg-elevated: #ffffff;
  --bg-subtle: #f2f0eb;
  --text: #1c1917;
  --text-secondary: #78716c;
  --text-tertiary: #a8a29e;
  --accent: #4f46e5;
  --accent-hover: #4338ca;
  --accent-subtle: rgba(79, 70, 229, 0.08);
  --accent-ring: rgba(79, 70, 229, 0.2);
  --warm: #d97706;
  --warm-subtle: rgba(217, 119, 6, 0.1);
  --border: #e7e5e4;
  --border-strong: #d6d3d1;
  --code-bg: #f5f5f4;
  --shadow-1: 0 1px 2px 0 rgba(0,0,0,0.04);
  --shadow-2: 0 1px 3px 0 rgba(0,0,0,0.07), 0 1px 2px -1px rgba(0,0,0,0.04);
  --shadow-3: 0 4px 6px -1px rgba(0,0,0,0.07), 0 2px 4px -2px rgba(0,0,0,0.04);
  --shadow-4: 0 10px 15px -3px rgba(0,0,0,0.08), 0 4px 6px -4px rgba(0,0,0,0.03);
  --font-serif: "Source Serif 4", Georgia, "Times New Roman", serif;
  --font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  --font-mono: "SF Mono", "Fira Code", "JetBrains Mono", Consolas, monospace;
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

html { font-size: 16px; -webkit-text-size-adjust: 100%; }

body {
  font-family: var(--font-sans);
  line-height: 1.75;
  color: var(--text);
  background: var(--bg);
  min-height: 100vh;
  -webkit-font-smoothing: antialiased;
}`;var Jt=`/* \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
   Navigation
   \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 */
.garden-nav {
  position: sticky;
  top: 0;
  z-index: 50;
  background: rgba(250, 249, 246, 0.82);
  backdrop-filter: blur(16px) saturate(1.8);
  -webkit-backdrop-filter: blur(16px) saturate(1.8);
  border-bottom: 1px solid var(--border);
}

.garden-nav-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.garden-brand {
  display: flex;
  align-items: center;
  gap: 10px;
}

.garden-logo {
  width: 28px;
  height: 28px;
  background: linear-gradient(135deg, #059669 0%, #10b981 100%);
  border-radius: 7px;
  display: grid;
  place-items: center;
  box-shadow: 0 1px 3px rgba(5, 150, 105, 0.3);
}

.garden-logo::after {
  content: "";
  width: 10px;
  height: 10px;
  border: 2px solid rgba(255,255,255,0.9);
  border-radius: 50% 50% 50% 0;
  transform: rotate(-45deg);
}

.garden-site-title {
  font-family: var(--font-serif);
  font-size: 1.15rem;
  font-weight: 600;
  color: var(--text);
  text-decoration: none;
  letter-spacing: -0.02em;
}

.garden-site-title:hover { color: var(--accent); }

.garden-menu-toggle {
  display: none;
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
  border-radius: 6px;
}

.garden-menu-toggle:hover { background: var(--bg-subtle); }

.garden-menu-icon {
  display: block;
  width: 20px;
  height: 2px;
  background: var(--text);
  border-radius: 2px;
  position: relative;
}

.garden-menu-icon::before,
.garden-menu-icon::after {
  content: "";
  position: absolute;
  width: 20px;
  height: 2px;
  background: var(--text);
  border-radius: 2px;
  left: 0;
  transition: 0.2s ease;
}

.garden-menu-icon::before { top: -6px; }
.garden-menu-icon::after { top: 6px; }

.garden-menu-active .garden-menu-icon { background: transparent; }
.garden-menu-active .garden-menu-icon::before { top: 0; transform: rotate(45deg); }
.garden-menu-active .garden-menu-icon::after { top: 0; transform: rotate(-45deg); }

.garden-nav-links { display: flex; gap: 4px; }

.garden-nav-link {
  padding: 6px 14px;
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 0.88rem;
  font-weight: 500;
  border-radius: 6px;
  transition: all 0.15s ease;
}

.garden-nav-link:hover {
  color: var(--accent);
  background: var(--accent-subtle);
}`;var Qt=`/* \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
   Content
   \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 */
.garden-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 48px 24px 80px;
}`;var Zt=`/* \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
   Home
   \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 */
.garden-home-header {
  text-align: center;
  margin-bottom: 48px;
  padding-top: 16px;
}

.garden-home-description {
  font-family: var(--font-serif);
  font-size: 1.25rem;
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 28px;
  max-width: 480px;
  margin-left: auto;
  margin-right: auto;
}

.garden-search-container {
  display: flex;
  align-items: center;
  gap: 12px;
  max-width: 380px;
  margin: 0 auto;
  position: relative;
}

.garden-search-input {
  flex: 1;
  padding: 10px 16px 10px 40px;
  border: 1.5px solid var(--border);
  border-radius: 10px;
  font-size: 0.9rem;
  font-family: var(--font-sans);
  background: var(--bg-elevated);
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23a8a29e' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='11' cy='11' r='8'/%3E%3Cpath d='m21 21-4.3-4.3'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: 14px center;
  color: var(--text);
  transition: all 0.2s ease;
  box-shadow: var(--shadow-1);
}

.garden-search-input:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-ring), var(--shadow-2);
}

.garden-search-input::placeholder { color: var(--text-tertiary); }

.garden-search-results {
  display: none;
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  max-height: 420px;
  overflow-y: auto;
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: 12px;
  box-shadow: var(--shadow-4);
  z-index: 40;
}

.garden-search-result-item {
  display: block;
  padding: 14px 18px;
  border-bottom: 1px solid var(--border);
  text-decoration: none;
  color: inherit;
  transition: background 0.12s ease;
}

.garden-search-result-item:last-child {
  border-bottom: none;
}

.garden-search-result-item:hover {
  background: var(--accent-subtle);
}

.garden-search-result-title {
  font-family: var(--font-serif);
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 4px;
  line-height: 1.4;
}

.garden-search-result-excerpt {
  font-size: 0.82rem;
  color: var(--text-secondary);
  line-height: 1.5;
  margin-bottom: 6px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.garden-search-result-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.garden-search-result-tags .garden-tag {
  font-size: 0.7rem;
  padding: 2px 7px;
}

.garden-search-highlight {
  background: var(--warm-subtle);
  color: var(--warm);
  border-radius: 2px;
  padding: 0 2px;
  font-weight: 600;
}

.garden-search-empty,
.garden-search-error {
  padding: 24px 18px;
  text-align: center;
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.garden-search-error {
  color: var(--warm);
}

.garden-note-count {
  font-size: 0.82rem;
  color: var(--text-tertiary);
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
}`;var er=`/* \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
   Cards
   \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 */
.garden-card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
}

.garden-card {
  display: flex;
  flex-direction: column;
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 24px;
  box-shadow: var(--shadow-1);
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  text-decoration: none;
  color: inherit;
  position: relative;
  overflow: hidden;
}

.garden-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2.5px;
  background: linear-gradient(90deg, var(--warm), #f59e0b);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.garden-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-4);
  border-color: var(--border-strong);
}

.garden-card:hover::before { transform: scaleX(1); }

.garden-card-title {
  font-family: var(--font-serif);
  font-size: 1.05rem;
  font-weight: 600;
  margin-bottom: 8px;
  color: var(--text);
  line-height: 1.45;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.garden-card-excerpt {
  font-size: 0.87rem;
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: auto;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.garden-card-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 16px;
  padding-top: 14px;
  border-top: 1px solid var(--border);
}

.garden-card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.garden-card-date {
  font-size: 0.78rem;
  color: var(--text-tertiary);
  white-space: nowrap;
}`;var tr=`/* \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
   Tags
   \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 */
.garden-tag {
  display: inline-flex;
  align-items: center;
  padding: 3px 10px;
  background: var(--accent-subtle);
  color: var(--accent);
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.15s ease;
}

a.garden-tag:hover {
  background: var(--accent);
  color: #fff;
}`;var rr=`/* \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
   Note Page
   \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 */
.garden-note {
  display: grid;
  grid-template-columns: 220px minmax(0, 720px);
  gap: 0 48px;
  max-width: 1040px;
  margin: 0 auto;
  align-items: start;
}

.garden-note-header {
  margin-bottom: 40px;
  padding-bottom: 24px;
  border-bottom: 1px solid var(--border);
}

.garden-note-header h1 {
  font-family: var(--font-serif);
  font-size: 2.2rem;
  font-weight: 600;
  margin-bottom: 12px;
  letter-spacing: -0.02em;
  line-height: 1.25;
}

.garden-note-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.garden-note-meta::before {
  content: "";
  width: 6px;
  height: 6px;
  background: var(--warm);
  border-radius: 50%;
  flex-shrink: 0;
}

.garden-note-main {
  grid-column: 2;
}`;var nr=`/* \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
   TOC Sidebar
   \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 */
.garden-toc {
  grid-column: 1;
  grid-row: 1;
  position: sticky;
  top: 80px;
  padding-right: 16px;
}

.garden-toc-toggle {
  display: none;
  width: 100%;
  padding: 10px 12px;
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--text);
  cursor: pointer;
  text-align: left;
}

.garden-toc-arrow {
  float: right;
  width: 8px;
  height: 8px;
  border-right: 2px solid var(--text-secondary);
  border-bottom: 2px solid var(--text-secondary);
  transform: rotate(45deg);
  transition: transform 0.2s ease;
  margin-top: 4px;
}

.garden-toc-active .garden-toc-arrow {
  transform: rotate(-135deg);
  margin-top: 8px;
}

.garden-toc-nav {
  font-size: 0.83rem;
  line-height: 1.6;
}

.garden-toc-nav a {
  display: block;
  padding: 3px 0;
  color: var(--text-secondary);
  text-decoration: none;
  border-left: 2px solid transparent;
  padding-left: 12px;
  transition: all 0.15s ease;
}

.garden-toc-nav a:hover {
  color: var(--accent);
  border-left-color: var(--accent);
}

.garden-toc-nav a.garden-toc-active-link {
  color: var(--accent);
  border-left-color: var(--accent);
  font-weight: 500;
}

.garden-toc-nav .garden-toc-h2 { padding-left: 12px; }
.garden-toc-nav .garden-toc-h3 { padding-left: 28px; font-size: 0.8rem; }

.garden-note-body {
  font-size: 1rem;
  line-height: 1.8;
  color: var(--text);
}

.garden-note-body > *:first-child { margin-top: 0; }

.garden-note-body h1 {
  font-family: var(--font-serif);
  font-size: 1.8rem;
  font-weight: 600;
  margin: 2.5rem 0 1rem;
  letter-spacing: -0.02em;
}

.garden-note-body h2 {
  font-family: var(--font-serif);
  font-size: 1.35rem;
  font-weight: 600;
  margin: 2rem 0 0.75rem;
  padding-bottom: 0.4rem;
  border-bottom: 1px solid var(--border);
  scroll-margin-top: 80px;
}

.garden-note-body h3 {
  font-family: var(--font-serif);
  font-size: 1.1rem;
  font-weight: 600;
  margin: 1.5rem 0 0.6rem;
  scroll-margin-top: 80px;
}

.garden-note-body h4 {
  font-family: var(--font-serif);
  font-size: 1rem;
  font-weight: 600;
  margin: 1.3rem 0 0.5rem;
  color: var(--text-secondary);
}

.garden-note-body p { margin-bottom: 1.1rem; }

.garden-note-body a {
  color: var(--accent);
  text-decoration: none;
  border-bottom: 1px solid var(--accent-subtle);
  transition: border-color 0.15s ease;
}

.garden-note-body a:hover {
  border-bottom-color: var(--accent);
}

.garden-note-body strong { font-weight: 600; }

.garden-note-body ul,
.garden-note-body ol { margin: 0 0 1.1rem 1.5rem; }

.garden-note-body li { margin-bottom: 0.35rem; }

.garden-note-body li::marker { color: var(--warm); }

.garden-note-body code {
  background: var(--code-bg);
  padding: 0.15rem 0.4rem;
  border-radius: 4px;
  font-family: var(--font-mono);
  font-size: 0.84em;
  color: var(--accent-hover);
}

.garden-note-body pre {
  background: var(--bg-subtle);
  border: 1px solid var(--border);
  padding: 1rem 1.2rem;
  border-radius: 8px;
  overflow-x: auto;
  margin: 1.2rem 0;
  line-height: 1.6;
}

.garden-note-body pre code {
  padding: 0;
  background: none;
  font-size: 0.86rem;
  color: var(--text);
}

.garden-note-body blockquote {
  border-left: 3px solid var(--warm);
  padding: 0.75rem 1.1rem;
  margin: 1.2rem 0;
  color: var(--text-secondary);
  font-style: italic;
  background: var(--warm-subtle);
  border-radius: 0 6px 6px 0;
}

.garden-note-body blockquote p:last-child { margin-bottom: 0; }

.garden-note-body img {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  box-shadow: var(--shadow-2);
}

.garden-note-body hr {
  border: none;
  height: 1px;
  background: var(--border);
  margin: 2rem 0;
}

.garden-note-body table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  margin: 1.2rem 0;
  font-size: 0.9rem;
  border: 1px solid var(--border);
  border-radius: 8px;
  overflow: hidden;
}

.garden-note-body th {
  background: var(--bg-subtle);
  font-weight: 600;
  text-align: left;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-secondary);
}

.garden-note-body th,
.garden-note-body td {
  border-bottom: 1px solid var(--border);
  padding: 0.55rem 0.8rem;
}

.garden-note-body th:first-child, .garden-note-body td:first-child { padding-left: 1rem; }
.garden-note-body th:last-child, .garden-note-body td:last-child { padding-right: 1rem; }
.garden-note-body tbody tr:last-child td { border-bottom: none; }
.garden-note-body tbody tr:nth-child(even) { background: var(--bg-subtle); }`;var ir=`/* \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
   Related Notes
   \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 */
.garden-related {
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid var(--border);
}

.garden-related-heading {
  font-family: var(--font-serif);
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 14px;
  color: var(--text);
}

.garden-related-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.garden-related-item a {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  color: var(--text);
  text-decoration: none;
  border-radius: 6px;
  font-size: 0.9rem;
  transition: all 0.15s ease;
}

.garden-related-item a:hover {
  background: var(--accent-subtle);
  color: var(--accent);
}

.garden-related-item a::before {
  content: "";
  width: 4px;
  height: 4px;
  background: var(--warm);
  border-radius: 50%;
  flex-shrink: 0;
}`;var or=`/* \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
   Comments
   \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 */
.garden-comments {
  grid-column: 2;
  margin-top: 48px;
  padding-top: 24px;
  border-top: 1px solid var(--border);
}

.garden-comments-heading {
  font-family: var(--font-serif);
  font-size: 1.15rem;
  font-weight: 600;
  margin-bottom: 16px;
  color: var(--text);
}`;var ar=`/* \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
   Note Footer
   \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 */
.garden-note-tags {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid var(--border);
  max-width: 680px;
  margin-left: auto;
  margin-right: auto;
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.garden-note-pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 32px;
  padding-top: 20px;
  border-top: 1px solid var(--border);
  max-width: 680px;
  margin-left: auto;
  margin-right: auto;
  font-size: 0.9rem;
}

.garden-note-pagination a {
  color: var(--accent);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.15s ease;
}

.garden-note-pagination a:hover { color: var(--accent-hover); }

.garden-note-pagination .garden-pipe { color: var(--border); user-select: none; }`;var sr=`/* \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
   Tags Page
   \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 */
.garden-tags {
  max-width: 680px;
  margin: 0 auto;
}

.garden-tags h1 {
  font-family: var(--font-serif);
  font-size: 1.8rem;
  margin-bottom: 28px;
  font-weight: 600;
}

.garden-tag-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: baseline;
}

.garden-tag-cloud .garden-tag {
  padding: 5px 14px;
  transition: all 0.2s ease;
}

.garden-tag-cloud .garden-tag:hover {
  transform: scale(1.06);
}`;var lr=`/* \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
   Tag Detail
   \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 */
.garden-tag-detail header {
  margin-bottom: 40px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--border);
}

.garden-tag-detail header h1 {
  font-family: var(--font-serif);
  font-size: 1.8rem;
  margin-bottom: 6px;
}

.garden-tag-detail header p { color: var(--text-secondary); font-size: 0.9rem; }`;var cr=`/* \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
   Empty State
   \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 */
.garden-empty-state {
  text-align: center;
  padding: 64px 24px;
  border: 2px dashed var(--border);
  border-radius: 16px;
  background: var(--bg-subtle);
}

.garden-empty-icon {
  display: block;
  margin: 0 auto 20px;
  width: 56px;
  height: 56px;
  border-radius: 14px;
  background: linear-gradient(135deg, var(--warm-subtle), var(--accent-subtle));
  position: relative;
}

.garden-empty-icon::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 20px;
  height: 24px;
  border: 2.5px solid var(--warm);
  border-radius: 2px 2px 0 0;
  border-bottom-width: 0;
}

.garden-empty-icon::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(-45deg);
  width: 10px;
  height: 2px;
  background: var(--warm);
}

.garden-empty-text {
  font-family: var(--font-serif);
  font-size: 1.15rem;
  color: var(--text);
  margin-bottom: 6px;
}

.garden-empty-subtext { color: var(--text-secondary); font-size: 0.9rem; }`;var dr=`/* \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
   Pagination
   \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 */
.garden-pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-top: 48px;
  padding: 20px 0;
  flex-wrap: wrap;
}

.garden-pagination-prev,
.garden-pagination-next {
  display: inline-flex;
  align-items: center;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 0.88rem;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.15s ease;
}

.garden-pagination-prev:not(.garden-pagination-disabled),
.garden-pagination-next:not(.garden-pagination-disabled) {
  color: var(--accent);
  background: var(--accent-subtle);
}

.garden-pagination-prev:not(.garden-pagination-disabled):hover,
.garden-pagination-next:not(.garden-pagination-disabled):hover {
  background: var(--accent-ring);
}

.garden-pagination-disabled {
  color: var(--text-tertiary);
  background: var(--bg-subtle);
  cursor: default;
}

.garden-pagination-page {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 36px;
  height: 36px;
  padding: 0 8px;
  border-radius: 8px;
  font-size: 0.88rem;
  font-weight: 500;
  text-decoration: none;
  color: var(--text-secondary);
  transition: all 0.15s ease;
}

a.garden-pagination-page:hover {
  background: var(--accent-subtle);
  color: var(--accent);
}

.garden-pagination-active {
  background: var(--accent);
  color: #fff;
}`;var ur=`/* \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
   Footer
   \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 */
.garden-footer {
  text-align: center;
  padding: 40px 24px;
  color: var(--text-tertiary);
  font-size: 0.82rem;
  border-top: 1px solid var(--border);
  margin-top: 80px;
  background: var(--bg-subtle);
}

.garden-footer-inner {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.garden-footer a {
  color: var(--accent);
  text-decoration: none;
  transition: color 0.15s ease;
}

.garden-footer a:hover { color: var(--accent-hover); }

.garden-footer-stats { font-size: 0.78rem; opacity: 0.7; }`;var pr=`/* \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
   Responsive
   \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 */
@media (max-width: 640px) {
  .garden-menu-toggle { display: flex; align-items: center; }

  .garden-nav-links {
    display: none;
    flex-direction: column;
    width: 100%;
    gap: 4px;
    padding: 8px 0 12px;
  }

  .garden-nav-links.garden-nav-open { display: flex; }

  .garden-nav-header { flex-wrap: wrap; }

  .garden-card-grid { grid-template-columns: 1fr; }

  .garden-content { padding: 24px 16px 60px; }

  .garden-home-header { padding-top: 8px; margin-bottom: 32px; }

  .garden-search-container { max-width: none; }

  .garden-note-count { width: 100%; text-align: center; }

  .garden-note-header h1 { font-size: 1.7rem; }

  .garden-note {
    grid-template-columns: 1fr;
    max-width: 100%;
  }

  .garden-note-main { grid-column: 1; }

  .garden-toc {
    grid-column: 1;
    grid-row: auto;
    position: static;
    top: auto;
    padding-right: 0;
    margin-bottom: 24px;
  }

  .garden-toc-toggle { display: block; }

  .garden-toc-nav {
    display: none;
    padding: 8px 0;
  }

  .garden-toc-nav.garden-toc-open { display: block; }

  .garden-comments { grid-column: 1; }

  .garden-note-body h1 { font-size: 1.5rem; }
  .garden-note-body h2 { font-size: 1.2rem; }
}

@media (min-width: 641px) and (max-width: 1024px) {
  .garden-content { padding: 40px 20px 60px; }
  .garden-card-grid { grid-template-columns: repeat(2, 1fr); }

  .garden-note {
    grid-template-columns: 1fr;
    max-width: 680px;
  }

  .garden-note-main { grid-column: 1; }

  .garden-toc {
    grid-column: 1;
    grid-row: auto;
    position: static;
    top: auto;
    padding-right: 0;
    margin-bottom: 24px;
  }

  .garden-toc-toggle { display: block; }

  .garden-toc-nav {
    display: none;
    padding: 8px 0;
  }

  .garden-toc-nav.garden-toc-open { display: block; }

  .garden-comments { grid-column: 1; }
}

@media (min-width: 1025px) {
  .garden-card-grid { grid-template-columns: repeat(3, 1fr); }
}`;var gr=`/* \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
   Print
   \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 */
@media print {
  .garden-nav, .garden-footer, .garden-note-pagination,
  .garden-toc, .garden-related, .garden-comments { display: none; }

  .garden-note-body { font-size: 11pt; line-height: 1.6; }

  .garden-note-body a::after {
    content: " (" attr(href) ")";
    font-size: 0.8em;
    color: var(--text-secondary);
  }
}`;var ba=[{name:"variables",description:"CSS custom properties, reset, html/body base styles",css:Xt,lineCount:Xt.split(`
`).length},{name:"navigation",description:"Top navigation bar: sticky header, brand, logo, menu toggle, nav links",css:Jt,lineCount:Jt.split(`
`).length},{name:"content",description:"Content wrapper: max-width container with padding",css:Qt,lineCount:Qt.split(`
`).length},{name:"home",description:"Home page: header, description, search input, search results",css:Zt,lineCount:Zt.split(`
`).length},{name:"cards",description:"Note cards: grid layout, card hover effects, title, excerpt, meta",css:er,lineCount:er.split(`
`).length},{name:"tags",description:"Tag styling: inline tag badges with accent colors",css:tr,lineCount:tr.split(`
`).length},{name:"note-page",description:"Note page layout: two-column grid, header with title and meta",css:rr,lineCount:rr.split(`
`).length},{name:"note-body",description:"Note body: TOC sidebar, typography (headings, code, pre, blockquote, img, table)",css:nr,lineCount:nr.split(`
`).length},{name:"related-notes",description:"Related notes section at bottom of note pages",css:ir,lineCount:ir.split(`
`).length},{name:"comments",description:"Giscus comments section",css:or,lineCount:or.split(`
`).length},{name:"note-footer",description:"Note footer: tags display and prev/next pagination",css:ar,lineCount:ar.split(`
`).length},{name:"tags-page",description:"Tags index page: tag cloud with variable font sizes",css:sr,lineCount:sr.split(`
`).length},{name:"tag-detail",description:"Tag detail page: header with tag name and note count",css:lr,lineCount:lr.split(`
`).length},{name:"empty-state",description:"Empty state: dashed border container with icon",css:cr,lineCount:cr.split(`
`).length},{name:"pagination",description:"Pagination: page numbers, prev/next buttons",css:dr,lineCount:dr.split(`
`).length},{name:"footer",description:"Site footer: centered text, links, stats",css:ur,lineCount:ur.split(`
`).length},{name:"responsive",description:"Responsive media queries: mobile and tablet breakpoints",css:pr,lineCount:pr.split(`
`).length},{name:"print",description:"Print styles: hide nav/footer, show link URLs",css:gr,lineCount:gr.split(`
`).length}],Pd=new Map;for(let e of ba)Pd.set(e.name,e);function ya(){return ba.map(e=>e.css).join(`

`)}var xa=`/* Verdant */
:root {
  --bg: #faf9f6;
  --bg-elevated: #ffffff;
  --bg-subtle: #f2f0eb;
  --text: #1c1917;
  --text-secondary: #78716c;
  --text-tertiary: #a8a29e;
  --accent: #4f46e5;
  --accent-hover: #4338ca;
  --accent-subtle: rgba(79, 70, 229, 0.08);
  --accent-ring: rgba(79, 70, 229, 0.2);
  --warm: #d97706;
  --warm-subtle: rgba(217, 119, 6, 0.1);
  --border: #e7e5e4;
  --border-strong: #d6d3d1;
  --code-bg: #f5f5f4;
  --shadow-1: 0 1px 2px 0 rgba(0,0,0,0.04);
  --shadow-2: 0 1px 3px 0 rgba(0,0,0,0.07), 0 1px 2px -1px rgba(0,0,0,0.04);
  --shadow-3: 0 4px 6px -1px rgba(0,0,0,0.07), 0 2px 4px -2px rgba(0,0,0,0.04);
  --shadow-4: 0 10px 15px -3px rgba(0,0,0,0.08), 0 4px 6px -4px rgba(0,0,0,0.03);
  --font-serif: "Source Serif 4", Georgia, "Times New Roman", serif;
  --font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  --font-mono: "SF Mono", "Fira Code", "JetBrains Mono", Consolas, monospace;
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

html { font-size: 16px; -webkit-text-size-adjust: 100%; }

body {
  font-family: var(--font-sans);
  line-height: 1.75;
  color: var(--text);
  background: var(--bg);
  min-height: 100vh;
  -webkit-font-smoothing: antialiased;
}

/* \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
   Navigation
   \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 */
.garden-nav {
  position: sticky;
  top: 0;
  z-index: 50;
  background: rgba(250, 249, 246, 0.82);
  backdrop-filter: blur(16px) saturate(1.8);
  -webkit-backdrop-filter: blur(16px) saturate(1.8);
  border-bottom: 1px solid var(--border);
}

.garden-nav-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.garden-brand {
  display: flex;
  align-items: center;
  gap: 10px;
}

.garden-logo {
  width: 28px;
  height: 28px;
  background: linear-gradient(135deg, #059669 0%, #10b981 100%);
  border-radius: 7px;
  display: grid;
  place-items: center;
  box-shadow: 0 1px 3px rgba(5, 150, 105, 0.3);
}

.garden-logo::after {
  content: "";
  width: 10px;
  height: 10px;
  border: 2px solid rgba(255,255,255,0.9);
  border-radius: 50% 50% 50% 0;
  transform: rotate(-45deg);
}

.garden-site-title {
  font-family: var(--font-serif);
  font-size: 1.15rem;
  font-weight: 600;
  color: var(--text);
  text-decoration: none;
  letter-spacing: -0.02em;
}

.garden-site-title:hover { color: var(--accent); }

.garden-menu-toggle {
  display: none;
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
  border-radius: 6px;
}

.garden-menu-toggle:hover { background: var(--bg-subtle); }

.garden-menu-icon {
  display: block;
  width: 20px;
  height: 2px;
  background: var(--text);
  border-radius: 2px;
  position: relative;
}

.garden-menu-icon::before,
.garden-menu-icon::after {
  content: "";
  position: absolute;
  width: 20px;
  height: 2px;
  background: var(--text);
  border-radius: 2px;
  left: 0;
  transition: 0.2s ease;
}

.garden-menu-icon::before { top: -6px; }
.garden-menu-icon::after { top: 6px; }

.garden-menu-active .garden-menu-icon { background: transparent; }
.garden-menu-active .garden-menu-icon::before { top: 0; transform: rotate(45deg); }
.garden-menu-active .garden-menu-icon::after { top: 0; transform: rotate(-45deg); }

.garden-nav-links { display: flex; gap: 4px; }

.garden-nav-link {
  padding: 6px 14px;
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 0.88rem;
  font-weight: 500;
  border-radius: 6px;
  transition: all 0.15s ease;
}

.garden-nav-link:hover {
  color: var(--accent);
  background: var(--accent-subtle);
}

/* \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
   Content
   \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 */
.garden-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 48px 24px 80px;
}

/* \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
   Home
   \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 */
.garden-home-header {
  text-align: center;
  margin-bottom: 48px;
  padding-top: 16px;
}

.garden-home-description {
  font-family: var(--font-serif);
  font-size: 1.25rem;
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 28px;
  max-width: 480px;
  margin-left: auto;
  margin-right: auto;
}

.garden-search-container {
  display: flex;
  align-items: center;
  gap: 12px;
  max-width: 380px;
  margin: 0 auto;
  position: relative;
}

.garden-search-input {
  flex: 1;
  padding: 10px 16px 10px 40px;
  border: 1.5px solid var(--border);
  border-radius: 10px;
  font-size: 0.9rem;
  font-family: var(--font-sans);
  background: var(--bg-elevated);
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23a8a29e' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='11' cy='11' r='8'/%3E%3Cpath d='m21 21-4.3-4.3'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: 14px center;
  color: var(--text);
  transition: all 0.2s ease;
  box-shadow: var(--shadow-1);
}

.garden-search-input:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-ring), var(--shadow-2);
}

.garden-search-input::placeholder { color: var(--text-tertiary); }

.garden-search-results {
  display: none;
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  max-height: 420px;
  overflow-y: auto;
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: 12px;
  box-shadow: var(--shadow-4);
  z-index: 40;
}

.garden-search-result-item {
  display: block;
  padding: 14px 18px;
  border-bottom: 1px solid var(--border);
  text-decoration: none;
  color: inherit;
  transition: background 0.12s ease;
}

.garden-search-result-item:last-child {
  border-bottom: none;
}

.garden-search-result-item:hover {
  background: var(--accent-subtle);
}

.garden-search-result-title {
  font-family: var(--font-serif);
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 4px;
  line-height: 1.4;
}

.garden-search-result-excerpt {
  font-size: 0.82rem;
  color: var(--text-secondary);
  line-height: 1.5;
  margin-bottom: 6px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.garden-search-result-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.garden-search-result-tags .garden-tag {
  font-size: 0.7rem;
  padding: 2px 7px;
}

.garden-search-highlight {
  background: var(--warm-subtle);
  color: var(--warm);
  border-radius: 2px;
  padding: 0 2px;
  font-weight: 600;
}

.garden-search-empty,
.garden-search-error {
  padding: 24px 18px;
  text-align: center;
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.garden-search-error {
  color: var(--warm);
}

.garden-note-count {
  font-size: 0.82rem;
  color: var(--text-tertiary);
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
}

/* \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
   Cards
   \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 */
.garden-card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
}

.garden-card {
  display: flex;
  flex-direction: column;
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 24px;
  box-shadow: var(--shadow-1);
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  text-decoration: none;
  color: inherit;
  position: relative;
  overflow: hidden;
}

.garden-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2.5px;
  background: linear-gradient(90deg, var(--warm), #f59e0b);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.garden-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-4);
  border-color: var(--border-strong);
}

.garden-card:hover::before { transform: scaleX(1); }

.garden-card-title {
  font-family: var(--font-serif);
  font-size: 1.05rem;
  font-weight: 600;
  margin-bottom: 8px;
  color: var(--text);
  line-height: 1.45;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.garden-card-excerpt {
  font-size: 0.87rem;
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: auto;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.garden-card-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 16px;
  padding-top: 14px;
  border-top: 1px solid var(--border);
}

.garden-card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.garden-card-date {
  font-size: 0.78rem;
  color: var(--text-tertiary);
  white-space: nowrap;
}

/* \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
   Tags
   \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 */
.garden-tag {
  display: inline-flex;
  align-items: center;
  padding: 3px 10px;
  background: var(--accent-subtle);
  color: var(--accent);
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.15s ease;
}

a.garden-tag:hover {
  background: var(--accent);
  color: #fff;
}

/* \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
   Note Page
   \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 */
.garden-note {
  display: grid;
  grid-template-columns: 220px minmax(0, 720px);
  gap: 0 48px;
  max-width: 1040px;
  margin: 0 auto;
  align-items: start;
}

.garden-note-header {
  margin-bottom: 40px;
  padding-bottom: 24px;
  border-bottom: 1px solid var(--border);
}

.garden-note-header h1 {
  font-family: var(--font-serif);
  font-size: 2.2rem;
  font-weight: 600;
  margin-bottom: 12px;
  letter-spacing: -0.02em;
  line-height: 1.25;
}

.garden-note-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.garden-note-meta::before {
  content: "";
  width: 6px;
  height: 6px;
  background: var(--warm);
  border-radius: 50%;
  flex-shrink: 0;
}

.garden-note-main {
  grid-column: 2;
}

/* \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
   TOC Sidebar
   \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 */
.garden-toc {
  grid-column: 1;
  grid-row: 1;
  position: sticky;
  top: 80px;
  padding-right: 16px;
}

.garden-toc-toggle {
  display: none;
  width: 100%;
  padding: 10px 12px;
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--text);
  cursor: pointer;
  text-align: left;
}

.garden-toc-arrow {
  float: right;
  width: 8px;
  height: 8px;
  border-right: 2px solid var(--text-secondary);
  border-bottom: 2px solid var(--text-secondary);
  transform: rotate(45deg);
  transition: transform 0.2s ease;
  margin-top: 4px;
}

.garden-toc-active .garden-toc-arrow {
  transform: rotate(-135deg);
  margin-top: 8px;
}

.garden-toc-nav {
  font-size: 0.83rem;
  line-height: 1.6;
}

.garden-toc-nav a {
  display: block;
  padding: 3px 0;
  color: var(--text-secondary);
  text-decoration: none;
  border-left: 2px solid transparent;
  padding-left: 12px;
  transition: all 0.15s ease;
}

.garden-toc-nav a:hover {
  color: var(--accent);
  border-left-color: var(--accent);
}

.garden-toc-nav a.garden-toc-active-link {
  color: var(--accent);
  border-left-color: var(--accent);
  font-weight: 500;
}

.garden-toc-nav .garden-toc-h2 { padding-left: 12px; }
.garden-toc-nav .garden-toc-h3 { padding-left: 28px; font-size: 0.8rem; }

.garden-note-body {
  font-size: 1rem;
  line-height: 1.8;
  color: var(--text);
}

.garden-note-body > *:first-child { margin-top: 0; }

.garden-note-body h1 {
  font-family: var(--font-serif);
  font-size: 1.8rem;
  font-weight: 600;
  margin: 2.5rem 0 1rem;
  letter-spacing: -0.02em;
}

.garden-note-body h2 {
  font-family: var(--font-serif);
  font-size: 1.35rem;
  font-weight: 600;
  margin: 2rem 0 0.75rem;
  padding-bottom: 0.4rem;
  border-bottom: 1px solid var(--border);
  scroll-margin-top: 80px;
}

.garden-note-body h3 {
  font-family: var(--font-serif);
  font-size: 1.1rem;
  font-weight: 600;
  margin: 1.5rem 0 0.6rem;
  scroll-margin-top: 80px;
}

.garden-note-body h4 {
  font-family: var(--font-serif);
  font-size: 1rem;
  font-weight: 600;
  margin: 1.3rem 0 0.5rem;
  color: var(--text-secondary);
}

.garden-note-body p { margin-bottom: 1.1rem; }

.garden-note-body a {
  color: var(--accent);
  text-decoration: none;
  border-bottom: 1px solid var(--accent-subtle);
  transition: border-color 0.15s ease;
}

.garden-note-body a:hover {
  border-bottom-color: var(--accent);
}

.garden-note-body strong { font-weight: 600; }

.garden-note-body ul,
.garden-note-body ol { margin: 0 0 1.1rem 1.5rem; }

.garden-note-body li { margin-bottom: 0.35rem; }

.garden-note-body li::marker { color: var(--warm); }

.garden-note-body code {
  background: var(--code-bg);
  padding: 0.15rem 0.4rem;
  border-radius: 4px;
  font-family: var(--font-mono);
  font-size: 0.84em;
  color: var(--accent-hover);
}

.garden-note-body pre {
  background: var(--bg-subtle);
  border: 1px solid var(--border);
  padding: 1rem 1.2rem;
  border-radius: 8px;
  overflow-x: auto;
  margin: 1.2rem 0;
  line-height: 1.6;
}

.garden-note-body pre code {
  padding: 0;
  background: none;
  font-size: 0.86rem;
  color: var(--text);
}

.garden-note-body blockquote {
  border-left: 3px solid var(--warm);
  padding: 0.75rem 1.1rem;
  margin: 1.2rem 0;
  color: var(--text-secondary);
  font-style: italic;
  background: var(--warm-subtle);
  border-radius: 0 6px 6px 0;
}

.garden-note-body blockquote p:last-child { margin-bottom: 0; }

.garden-note-body img {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  box-shadow: var(--shadow-2);
}

.garden-note-body hr {
  border: none;
  height: 1px;
  background: var(--border);
  margin: 2rem 0;
}

.garden-note-body table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  margin: 1.2rem 0;
  font-size: 0.9rem;
  border: 1px solid var(--border);
  border-radius: 8px;
  overflow: hidden;
}

.garden-note-body th {
  background: var(--bg-subtle);
  font-weight: 600;
  text-align: left;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-secondary);
}

.garden-note-body th,
.garden-note-body td {
  border-bottom: 1px solid var(--border);
  padding: 0.55rem 0.8rem;
}

.garden-note-body th:first-child, .garden-note-body td:first-child { padding-left: 1rem; }
.garden-note-body th:last-child, .garden-note-body td:last-child { padding-right: 1rem; }
.garden-note-body tbody tr:last-child td { border-bottom: none; }
.garden-note-body tbody tr:nth-child(even) { background: var(--bg-subtle); }

/* \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
   Related Notes
   \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 */
.garden-related {
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid var(--border);
}

.garden-related-heading {
  font-family: var(--font-serif);
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 14px;
  color: var(--text);
}

.garden-related-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.garden-related-item a {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  color: var(--text);
  text-decoration: none;
  border-radius: 6px;
  font-size: 0.9rem;
  transition: all 0.15s ease;
}

.garden-related-item a:hover {
  background: var(--accent-subtle);
  color: var(--accent);
}

.garden-related-item a::before {
  content: "";
  width: 4px;
  height: 4px;
  background: var(--warm);
  border-radius: 50%;
  flex-shrink: 0;
}

/* \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
   Comments
   \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 */
.garden-comments {
  grid-column: 2;
  margin-top: 48px;
  padding-top: 24px;
  border-top: 1px solid var(--border);
}

.garden-comments-heading {
  font-family: var(--font-serif);
  font-size: 1.15rem;
  font-weight: 600;
  margin-bottom: 16px;
  color: var(--text);
}

/* \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
   Note Footer
   \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 */
.garden-note-tags {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid var(--border);
  max-width: 680px;
  margin-left: auto;
  margin-right: auto;
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.garden-note-pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 32px;
  padding-top: 20px;
  border-top: 1px solid var(--border);
  max-width: 680px;
  margin-left: auto;
  margin-right: auto;
  font-size: 0.9rem;
}

.garden-note-pagination a {
  color: var(--accent);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.15s ease;
}

.garden-note-pagination a:hover { color: var(--accent-hover); }

.garden-note-pagination .garden-pipe { color: var(--border); user-select: none; }

/* \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
   Tags Page
   \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 */
.garden-tags {
  max-width: 680px;
  margin: 0 auto;
}

.garden-tags h1 {
  font-family: var(--font-serif);
  font-size: 1.8rem;
  margin-bottom: 28px;
  font-weight: 600;
}

.garden-tag-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: baseline;
}

.garden-tag-cloud .garden-tag {
  padding: 5px 14px;
  transition: all 0.2s ease;
}

.garden-tag-cloud .garden-tag:hover {
  transform: scale(1.06);
}

/* \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
   Tag Detail
   \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 */
.garden-tag-detail header {
  margin-bottom: 40px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--border);
}

.garden-tag-detail header h1 {
  font-family: var(--font-serif);
  font-size: 1.8rem;
  margin-bottom: 6px;
}

.garden-tag-detail header p { color: var(--text-secondary); font-size: 0.9rem; }

/* \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
   Empty State
   \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 */
.garden-empty-state {
  text-align: center;
  padding: 64px 24px;
  border: 2px dashed var(--border);
  border-radius: 16px;
  background: var(--bg-subtle);
}

.garden-empty-icon {
  display: block;
  margin: 0 auto 20px;
  width: 56px;
  height: 56px;
  border-radius: 14px;
  background: linear-gradient(135deg, var(--warm-subtle), var(--accent-subtle));
  position: relative;
}

.garden-empty-icon::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 20px;
  height: 24px;
  border: 2.5px solid var(--warm);
  border-radius: 2px 2px 0 0;
  border-bottom-width: 0;
}

.garden-empty-icon::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(-45deg);
  width: 10px;
  height: 2px;
  background: var(--warm);
}

.garden-empty-text {
  font-family: var(--font-serif);
  font-size: 1.15rem;
  color: var(--text);
  margin-bottom: 6px;
}

.garden-empty-subtext { color: var(--text-secondary); font-size: 0.9rem; }

/* \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
   Pagination
   \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 */
.garden-pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-top: 48px;
  padding: 20px 0;
  flex-wrap: wrap;
}

.garden-pagination-prev,
.garden-pagination-next {
  display: inline-flex;
  align-items: center;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 0.88rem;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.15s ease;
}

.garden-pagination-prev:not(.garden-pagination-disabled),
.garden-pagination-next:not(.garden-pagination-disabled) {
  color: var(--accent);
  background: var(--accent-subtle);
}

.garden-pagination-prev:not(.garden-pagination-disabled):hover,
.garden-pagination-next:not(.garden-pagination-disabled):hover {
  background: var(--accent-ring);
}

.garden-pagination-disabled {
  color: var(--text-tertiary);
  background: var(--bg-subtle);
  cursor: default;
}

.garden-pagination-page {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 36px;
  height: 36px;
  padding: 0 8px;
  border-radius: 8px;
  font-size: 0.88rem;
  font-weight: 500;
  text-decoration: none;
  color: var(--text-secondary);
  transition: all 0.15s ease;
}

a.garden-pagination-page:hover {
  background: var(--accent-subtle);
  color: var(--accent);
}

.garden-pagination-active {
  background: var(--accent);
  color: #fff;
}

/* \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
   Footer
   \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 */
.garden-footer {
  text-align: center;
  padding: 40px 24px;
  color: var(--text-tertiary);
  font-size: 0.82rem;
  border-top: 1px solid var(--border);
  margin-top: 80px;
  background: var(--bg-subtle);
}

.garden-footer-inner {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.garden-footer a {
  color: var(--accent);
  text-decoration: none;
  transition: color 0.15s ease;
}

.garden-footer a:hover { color: var(--accent-hover); }

.garden-footer-stats { font-size: 0.78rem; opacity: 0.7; }

/* \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
   Responsive
   \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 */
@media (max-width: 640px) {
  .garden-menu-toggle { display: flex; align-items: center; }

  .garden-nav-links {
    display: none;
    flex-direction: column;
    width: 100%;
    gap: 4px;
    padding: 8px 0 12px;
  }

  .garden-nav-links.garden-nav-open { display: flex; }

  .garden-nav-header { flex-wrap: wrap; }

  .garden-card-grid { grid-template-columns: 1fr; }

  .garden-content { padding: 24px 16px 60px; }

  .garden-home-header { padding-top: 8px; margin-bottom: 32px; }

  .garden-search-container { max-width: none; }

  .garden-note-count { width: 100%; text-align: center; }

  .garden-note-header h1 { font-size: 1.7rem; }

  .garden-note {
    grid-template-columns: 1fr;
    max-width: 100%;
  }

  .garden-note-main { grid-column: 1; }

  .garden-toc {
    grid-column: 1;
    grid-row: auto;
    position: static;
    top: auto;
    padding-right: 0;
    margin-bottom: 24px;
  }

  .garden-toc-toggle { display: block; }

  .garden-toc-nav {
    display: none;
    padding: 8px 0;
  }

  .garden-toc-nav.garden-toc-open { display: block; }

  .garden-comments { grid-column: 1; }

  .garden-note-body h1 { font-size: 1.5rem; }
  .garden-note-body h2 { font-size: 1.2rem; }
}

@media (min-width: 641px) and (max-width: 1024px) {
  .garden-content { padding: 40px 20px 60px; }
  .garden-card-grid { grid-template-columns: repeat(2, 1fr); }

  .garden-note {
    grid-template-columns: 1fr;
    max-width: 680px;
  }

  .garden-note-main { grid-column: 1; }

  .garden-toc {
    grid-column: 1;
    grid-row: auto;
    position: static;
    top: auto;
    padding-right: 0;
    margin-bottom: 24px;
  }

  .garden-toc-toggle { display: block; }

  .garden-toc-nav {
    display: none;
    padding: 8px 0;
  }

  .garden-toc-nav.garden-toc-open { display: block; }

  .garden-comments { grid-column: 1; }
}

@media (min-width: 1025px) {
  .garden-card-grid { grid-template-columns: repeat(3, 1fr); }
}

/* \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
   Print
   \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 */
@media print {
  .garden-nav, .garden-footer, .garden-note-pagination,
  .garden-toc, .garden-related, .garden-comments { display: none; }

  .garden-note-body { font-size: 11pt; line-height: 1.6; }

  .garden-note-body a::after {
    content: " (" attr(href) ")";
    font-size: 0.8em;
    color: var(--text-secondary);
  }
}
`;var Cd=`
:root {
  --bg: #0c0a09;
  --bg-elevated: #1c1917;
  --bg-subtle: #292524;
  --text: #fafaf9;
  --text-secondary: #a8a29e;
  --text-tertiary: #78716c;
  --accent: #818cf8;
  --accent-hover: #a5b4fc;
  --accent-subtle: rgba(129, 140, 248, 0.12);
  --accent-ring: rgba(129, 140, 248, 0.25);
  --warm: #fbbf24;
  --warm-subtle: rgba(251, 191, 36, 0.1);
  --border: #44403c;
  --border-strong: #57534e;
  --code-bg: #292524;
  --shadow-1: 0 1px 2px 0 rgba(0,0,0,0.3);
  --shadow-2: 0 1px 3px 0 rgba(0,0,0,0.35), 0 1px 2px -1px rgba(0,0,0,0.25);
  --shadow-3: 0 4px 6px -1px rgba(0,0,0,0.4), 0 2px 4px -2px rgba(0,0,0,0.3);
  --shadow-4: 0 10px 15px -3px rgba(0,0,0,0.5), 0 4px 6px -4px rgba(0,0,0,0.35);
}

body { background: var(--bg); }

.garden-nav { background: rgba(12, 10, 9, 0.85); }

.garden-card { background: var(--bg-elevated); }

.garden-search-input {
  background-color: var(--bg-elevated);
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2378716c' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='11' cy='11' r='8'/%3E%3Cpath d='m21 21-4.3-4.3'/%3E%3C/svg%3E");
}

.garden-search-input:focus { background-color: var(--bg-subtle); }

.garden-search-results { background: var(--bg-elevated); }

.garden-search-result-item:hover { background: var(--accent-subtle); }

.garden-search-highlight { background: var(--warm-subtle); color: var(--warm); }

.garden-note-body pre { background: var(--bg); }

.garden-empty-state { border-color: var(--border-strong); }
`,wa=xa+Cd;function fr(e){return e.trim().toLowerCase().replace(/\s+/g,"-").replace(/[<>:"/\\|?*#[\]{}()@!$&+=,;'`~%^]+/g,"").replace(/-+/g,"-").replace(/^-+|-+$/g,"")}function hr(e){return e.replace(/\/index\.html$/,"/")}var ie=class{constructor(){this.cssMap=new Map;this.cssMap.set("default",ya()),this.cssMap.set("dark",wa)}getFlexSearchBundle(){return __FLEXSEARCH_BUNDLE__}getCSS(t){return this.cssMap.get(t)??this.cssMap.get("default")??""}renderIndex(t,r){return this.renderIndexPage(t,r,1)}renderIndexPage(t,r,n){let i=Math.max(1,Math.ceil(t.length/ie.PAGE_SIZE)),o=(n-1)*ie.PAGE_SIZE,a=Math.min(o+ie.PAGE_SIZE,t.length),l=t.slice(o,a).map(b=>this.renderCard(b,r.baseUrl)).join(`
`),c=t.length===0,d=this.buildIndexPagination(n,i,r.baseUrl),g=i>1?"flex":"none",v=fa.replace(/\{\{siteTitle\}\}/g,this.escapeHtml(r.title)).replace(/\{\{description\}\}/g,this.escapeHtml(r.description)).replace(/\{\{noteCards\}\}/g,l).replace(/\{\{baseUrl\}\}/g,this.escapeHtml(r.baseUrl)).replace(/\{\{searchHtml\}\}/g,this.buildSearchHtml(r)).replace(/\{\{noteCount\}\}/g,String(t.length)).replace(/\{\{isEmptyDisplay\}\}/g,c?"block":"none").replace(/\{\{paginationDisplay\}\}/g,g).replace(/\{\{paginationHtml\}\}/g,d).replace(/\{\{searchResultsContainer\}\}/g,this.buildSearchResultsContainer(r));return this.wrapLayout(v,r,void 0,`${t.length} note${t.length!==1?"s":""} published`)}getTotalPages(t){return Math.max(1,Math.ceil(t/ie.PAGE_SIZE))}renderNote(t,r,n,i,o,a,s,l,c,d,g){let v=this.escapeHtml(o.baseUrl),b=n.map(ae=>`<a href="${v}/tags/${this.escapeHtml(ae)}/" class="garden-tag">${this.escapeHtml(ae)}</a>`).join(" "),P="";if(i)try{let ae=new Date(i);isNaN(ae.getTime())||(P=`Published: ${ae.toISOString().split("T")[0]}`)}catch{P=""}let H=this.addHeadingIds(t),R=this.buildTocHtml(H),ee=this.buildRelatedNotesHtml(a??[],v),D=this.buildCommentsHtml(s),W=ha.replace(/\{\{title\}\}/g,this.escapeHtml(r)).replace(/\{\{bodyHtml\}\}/g,H).replace(/\{\{date\}\}/g,P).replace(/\{\{tagsHtml\}\}/g,b).replace(/\{\{tocHtml\}\}/g,R).replace(/\{\{relatedNotesHtml\}\}/g,ee).replace(/\{\{commentsHtml\}\}/g,D),ue=this.buildPagination(l,c,o.baseUrl,d,g),pe=W.replace(/\{\{pagination\}\}/g,ue);return this.wrapLayout(pe,o,r)}renderTags(t,r){let n=Object.entries(t).sort(([c],[d])=>c.localeCompare(d)),i=Math.max(1,...n.map(([,c])=>c.length)),o=Math.min(...n.map(([,c])=>c.length)),a=i-o||1,s=n.map(([c,d])=>{let g=d.length,b=.85+(i===o?1:(g-o)/a)*.65;return`<a href="${`${this.escapeHtml(r.baseUrl)}/tags/${this.escapeHtml(c)}/`}" class="garden-tag" style="font-size:${b.toFixed(2)}rem">${this.escapeHtml(c)} (${g})</a>`}).join(`
`),l=ma.replace(/\{\{tagCloud\}\}/g,s);return this.wrapLayout(l,r,void 0,`${Object.keys(t).length} tags`)}renderTagDetail(t,r,n){let i=t.map(a=>this.renderCard(a,n.baseUrl)).join(`
`),o=va.replace(/\{\{tag\}\}/g,this.escapeHtml(r)).replace(/\{\{count\}\}/g,String(t.length)).replace(/\{\{noteCards\}\}/g,i);return this.wrapLayout(o,n,void 0,`${t.length} notes`)}renderFeed(t,r){let n=new Date().toISOString(),i=this.escapeHtml(r.baseUrl),o=this.escapeHtml(r.title),a=t.map(s=>{let l=new Date(s.date).toISOString(),c=this.escapeXml(s.title),d=this.escapeXml(s.excerpt),g=`${i}/${this.escapeXml(s.slug)}/`;return`  <entry>
    <title>${c}</title>
    <link href="${g}"/>
    <id>${g}</id>
    <published>${l}</published>
    <updated>${l}</updated>
    <summary>${d}</summary>
  </entry>`}).join(`
`);return`<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>${o}</title>
  <link href="${i}/"/>
  <link rel="self" href="${i}/feed.xml"/>
  <updated>${n}</updated>
  <id>${i}/</id>
${a}
</feed>`}buildTocHtml(t){let r=/<h([2-3])\b[^>]*>(.+?)<\/h[2-3]>/gi,n=[],i;for(;(i=r.exec(t))!==null;){let[,o,a]=i,s=parseInt(o,10),l=a.replace(/<[^>]+>/g,"").trim(),c=fr(l);l.length>0&&n.push({level:s,text:l,id:c})}return n.length<2?"":n.map(o=>{let a=o.level===2?"garden-toc-h2":"garden-toc-h3";return`<a href="#${this.escapeHtml(o.id)}" class="${a}">${this.escapeHtml(o.text)}</a>`}).join(`
`)}addHeadingIds(t){let r=/<(h[2-3])(\b[^>]*)>([\s\S]*?)<\/h[2-3]>/gi,n={};return t.replace(r,(i,o,a,s)=>{if(/\bid\s*=/i.test(a))return i;let l=s.replace(/<[^>]+>/g,"").trim(),c=fr(l);return n[c]!==void 0?(n[c]=(n[c]??0)+1,c=`${c}-${n[c]}`):n[c]=0,`<${o}${a} id="${this.escapeHtml(c)}">${s}</${o}>`})}buildRelatedNotesHtml(t,r){return t.length===0?"":`<ul class="garden-related-list">
${t.map(n=>`      <li class="garden-related-item"><a href="${this.escapeHtml(r)}/${hr(n.repoPath)}">${this.escapeHtml(n.title)}</a></li>`).join(`
`)}
    </ul>`}buildCommentsHtml(t){return t?`<script src="https://giscus.app/client.js"
        data-repo="${this.escapeHtml(t.repo)}"
        data-repo-id="${this.escapeHtml(t.repoId)}"
        data-category="${this.escapeHtml(t.category)}"
        data-category-id="${this.escapeHtml(t.categoryId)}"
        data-mapping="pathname"
        data-strict="0"
        data-reactions-enabled="1"
        data-emit-metadata="0"
        data-input-position="bottom"
        data-theme="preferred_color_scheme"
        data-lang="en"
        crossorigin="anonymous"
        async>
<\/script>`:""}renderCard(t,r){let n=t.tags.map(s=>`<span class="garden-tag">${this.escapeHtml(s)}</span>`).join(" "),i=t.date,o=i?new Date(i).toISOString().split("T")[0]??"":"";return`<a href="${`${this.escapeHtml(r)}/${hr(t.relativePath)}`}" class="garden-card" data-title="${this.escapeHtml(t.title)}" data-excerpt="${this.escapeHtml(t.excerpt)}" data-tags="${t.tags.map(s=>this.escapeHtml(s)).join(" ")}">
      <div class="garden-card-title">${this.escapeHtml(t.title)}</div>
      <div class="garden-card-excerpt">${this.escapeHtml(t.excerpt)}</div>
      <div class="garden-card-meta">
        <div class="garden-card-tags">${n}</div>
        <div class="garden-card-date">${o}</div>
      </div>
    </a>`}wrapLayout(t,r,n,i){let o=n?`${this.escapeHtml(n)} \u2014 ${this.escapeHtml(r.title)}`:this.escapeHtml(r.title),a=this.escapeHtml(r.themeId??"default"),s=r.customCss??"",l=s.length===0?`<link rel="stylesheet" href="${this.escapeHtml(r.baseUrl)}/assets/theme.css">`:"";return ga.replace(/\{\{content\}\}/g,t).replace(/\{\{title\}\}/g,o).replace(/\{\{siteTitle\}\}/g,this.escapeHtml(r.title)).replace(/\{\{description\}\}/g,this.escapeHtml(r.description)).replace(/\{\{baseUrl\}\}/g,this.escapeHtml(r.baseUrl)).replace(/\{\{navLinks\}\}/g,this.buildNavLinks(r)).replace(/\{\{stats\}\}/g,i??"").replace(/\{\{stylesheetLink\}\}/g,l).replace(/\{\{inlineStyles\}\}/g,s).replace(/\{\{searchScript\}\}/g,this.buildSearchScript(r)).replace('<html lang="en">',`<html lang="en" data-theme="${a}">`)}buildNavLinks(t){return`<a href="${this.escapeHtml(t.baseUrl)}/" class="garden-nav-link">Notes</a>
<a href="${this.escapeHtml(t.baseUrl)}/tags/" class="garden-nav-link">Tags</a>`}buildSearchHtml(t){return t.isPro?'<input type="search" class="garden-search-input garden-search-pro" placeholder="Search all notes..." aria-label="Search all notes" autocomplete="off">':'<input type="search" class="garden-search-input" placeholder="Search notes..." aria-label="Search notes">'}buildSearchResultsContainer(t){return t.isPro?'<div class="garden-search-results" id="garden-search-results"></div>':""}buildSearchScript(t){if(!t.isPro)return"";let r=this.escapeHtml(t.baseUrl);return`<script src="${r}/assets/flexsearch.bundle.js"><\/script>
<script>
(function() {
  var input = document.querySelector('.garden-search-pro');
  var resultsContainer = document.getElementById('garden-search-results');
  var noteCount = document.querySelector('.garden-note-count');
  var cards = document.querySelectorAll('.garden-card');
  var index = null;
  var documents = [];
  var loaded = false;

  function loadIndex() {
    if (loaded) return Promise.resolve();
    return fetch('${r}/search.json')
      .then(function(r) { return r.json(); })
      .then(function(data) {
        documents = data;
        index = new FlexSearch.Document({
          document: {
            id: 'path',
            index: [
              { field: 'title', tokenize: 'forward', resolution: 9 },
              { field: 'excerpt', tokenize: 'forward', resolution: 5 },
              { field: 'tags', tokenize: 'forward', resolution: 7 }
            ],
            store: ['title', 'path', 'tags', 'excerpt']
          },
          charset: 'latin:extra',
          cache: true
        });
        for (var i = 0; i < data.length; i++) {
          index.add(data[i]);
        }
        loaded = true;
      })
      .catch(function() {
        resultsContainer.innerHTML = '<div class="garden-search-error">Failed to load search index</div>';
        resultsContainer.style.display = 'block';
      });
  }

  function highlightMatch(text, query) {
    if (!query) return text;
    var escaped = query.replace(/[.*+?^\${}()|[\\]\\\\]/g, '\\\\$&');
    var re = new RegExp('(' + escaped + ')', 'gi');
    return text.replace(re, '<mark class="garden-search-highlight">$1</mark>');
  }

  function search(query) {
    if (!index || !query) {
      resultsContainer.style.display = 'none';
      resultsContainer.innerHTML = '';
      if (noteCount) {
        noteCount.textContent = documents.length + ' note' + (documents.length !== 1 ? 's' : '');
      }
      cards.forEach(function(c) { c.style.display = ''; });
      return;
    }

    var titleResults = index.search(query, { field: 'title', limit: 20, enrich: true });
    var excerptResults = index.search(query, { field: 'excerpt', limit: 20, enrich: true });
    var tagResults = index.search(query, { field: 'tags', limit: 20, enrich: true });

    var seen = {};
    var results = [];

    function collect(resultSet) {
      for (var i = 0; i < resultSet.length; i++) {
        var items = resultSet[i].result;
        for (var j = 0; j < items.length; j++) {
          var doc = items[j].doc;
          if (doc && !seen[doc.path]) {
            seen[doc.path] = true;
            results.push(doc);
          }
        }
      }
    }

    collect(titleResults);
    collect(excerptResults);
    collect(tagResults);

    cards.forEach(function(c) { c.style.display = 'none'; });

    if (results.length === 0) {
      resultsContainer.innerHTML = '<div class="garden-search-empty">No results found for "' + query.replace(/</g, '&lt;') + '"</div>';
      resultsContainer.style.display = 'block';
      if (noteCount) noteCount.textContent = '0 notes';
      return;
    }

    function escapeHtml(s) { return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;'); }
    var html = '';
    for (var k = 0; k < results.length; k++) {
      var r = results[k];
      var url = '${r}/' + r.path.replace(/\\\\/g, '/').replace(/\\/index\\.html$/, '/');
      var titleHtml = highlightMatch(escapeHtml(r.title || ''), query);
      var excerptHtml = highlightMatch(escapeHtml(r.excerpt ? r.excerpt.substring(0, 120) : ''), query);
      var tagsHtml = r.tags ? r.tags.map(function(t) { return '<span class="garden-tag">' + escapeHtml(t) + '</span>'; }).join(' ') : '';
      html += '<a href="' + url + '" class="garden-search-result-item">' +
        '<div class="garden-search-result-title">' + titleHtml + '</div>' +
        '<div class="garden-search-result-excerpt">' + excerptHtml + '</div>' +
        (tagsHtml ? '<div class="garden-search-result-tags">' + tagsHtml + '</div>' : '') +
        '</a>';
    }
    resultsContainer.innerHTML = html;
    resultsContainer.style.display = 'block';
    if (noteCount) noteCount.textContent = results.length + ' note' + (results.length !== 1 ? 's' : '');
  }

  if (input && resultsContainer) {
    var debounceTimer = null;
    input.addEventListener('focus', function() {
      loadIndex();
    });
    input.addEventListener('input', function(e) {
      var query = e.target.value.trim();
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(function() {
        if (!loaded) {
          loadIndex().then(function() { search(query); });
        } else {
          search(query);
        }
      }, 200);
    });
    document.addEventListener('click', function(e) {
      if (!input.contains(e.target) && !resultsContainer.contains(e.target)) {
        resultsContainer.style.display = 'none';
        if (input.value === '') {
          cards.forEach(function(c) { c.style.display = ''; });
          if (noteCount) noteCount.textContent = documents.length + ' note' + (documents.length !== 1 ? 's' : '');
        }
      }
    });
    input.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        resultsContainer.style.display = 'none';
        input.blur();
      }
    });
  }
})();
<\/script>`}buildPagination(t,r,n,i,o){if(!t&&!r)return"";let a=t?`<a href="${this.escapeHtml(n)}/${i?hr(i):`${fr(t)}/`}">\u2190 ${this.escapeHtml(t)}</a>`:"<span></span>",s=r?`<a href="${this.escapeHtml(n)}/${o?hr(o):`${fr(r)}/`}">${this.escapeHtml(r)} \u2192</a>`:"<span></span>";return a+(t&&r?'<span class="garden-pipe"> | </span>':"")+s}buildIndexPagination(t,r,n){if(r<=1)return"";let i=[];if(t>1){let o=t===2?`${this.escapeHtml(n)}/`:`${this.escapeHtml(n)}/page/${t-1}/`;i.push(`<a href="${o}" class="garden-pagination-prev" aria-label="Previous page">\u2190 Prev</a>`)}else i.push('<span class="garden-pagination-prev garden-pagination-disabled">\u2190 Prev</span>');for(let o=1;o<=r;o++)if(o===t)i.push(`<span class="garden-pagination-page garden-pagination-active">${o}</span>`);else{let a=o===1?`${this.escapeHtml(n)}/`:`${this.escapeHtml(n)}/page/${o}/`;i.push(`<a href="${a}" class="garden-pagination-page">${o}</a>`)}return t<r?i.push(`<a href="${this.escapeHtml(n)}/page/${t+1}/" class="garden-pagination-next" aria-label="Next page">Next \u2192</a>`):i.push('<span class="garden-pagination-next garden-pagination-disabled">Next \u2192</span>'),i.join(`
`)}escapeHtml(t){return t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}escapeXml(t){return t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&apos;")}};ie.PAGE_SIZE=9,ie=L([_()],ie);var lt=class{constructor(t,r,n){this.registry=t;this.renderer=r;this.logger=n;this.activeThemeId="default";this.cssCache=new Map}setThemeCSS(t,r){this.cssCache.set(t,r)}async applyTheme(t){if(!this.registry.get(t))throw this.logger.error(`Cannot apply theme "${t}": not found`),new Error(`Theme "${t}" not found`);return this.activeThemeId=t,this.logger.info(`Applied theme "${t}"`),{}}getActiveTheme(){let t=this.registry.get(this.activeThemeId);return t||{id:"default",name:"Default Light",description:"",isBuiltIn:!0}}setActiveTheme(t){if(!this.registry.get(t))throw this.logger.error(`Cannot set active theme "${t}": not found`),new Error(`Theme "${t}" not found`);this.activeThemeId=t,this.logger.info(`Active theme set to "${t}"`)}async getThemeCSS(t){if(!this.registry.get(t))throw this.logger.error(`Theme "${t}" not found for CSS loading`),new Error(`Theme "${t}" not found`);let n=this.cssCache.get(t);if(n!==void 0)return n;let i=this.renderer.getCSS(t);return i.length>0?(this.cssCache.set(t,i),i):(this.logger.warn(`No CSS available for theme "${t}"`),"")}};lt=L([_(),A(0,C(h.ThemeRegistry)),A(1,C(h.ThemeRenderer)),A(2,C(h.LoggerService))],lt);var ct=class{constructor(t){this.logger=t}async initialize(t,r){try{this.logger.info("Initializing Verdant..."),this.registerPersistence(),this.registerAll(),this.initThemeRegistry()}catch(n){let i=n instanceof Error?n.message:String(n);throw this.logger.error("Plugin initialization failed: {message}",i),n}}dispose(){this.logger.info("Disposing Verdant services..."),T.clearInstances()}registerPersistence(){let t=O.create("publish_cache");T.register(h.KeyValueStorePort,{useValue:t}),this.logger.info("KeyValueStore (publish_cache) registered")}registerAll(){T.registerSingleton(h.GitHubAuthService,Ve),T.registerSingleton(h.GitHubRepoService,ce),T.registerSingleton(h.GitHubPagesService,Ke),T.registerSingleton(h.GitHubApiPort,Ye),T.registerSingleton(h.SiteGeneratorService,it),T.registerSingleton(h.DiffEngineService,ot),T.registerSingleton(h.PublisherService,at),T.registerSingleton(h.LinkGraphService,st),T.registerSingleton(h.ThemeRegistry,Le),T.registerSingleton(h.ThemeRenderer,ie),T.registerSingleton(h.ThemeService,lt),this.logger.info("All services registered in DI container")}initThemeRegistry(){let r=T.resolve(Le).list();this.logger.info("Theme registry initialized with {count} themes",r.length)}};ct=L([xt(),_(),A(0,C(h.LoggerService))],ct);var Sa=require("obsidian");var It="verdant-note-selector",mr=class extends Sa.ItemView{constructor(r,n){super(r);this.selectedFiles=new Set;this.searchQuery="";this.onPublishRequest=null;this.registerSelectionCallback=r=>{this.selectionCallback=r};this.selectionCallback=null;this.plugin=n,this.loadSelectedFiles()}getViewType(){return It}getDisplayText(){return"Note Selector"}getIcon(){return"globe"}async onOpen(){let{contentEl:r}=this;r.empty(),r.addClass("note-selector-view"),this.buildSearchBar(r),this.treeContainer=r.createDiv({cls:"tree-container"}),this.buildActionBar(r),this.renderTree()}async onClose(){this.selectionCallback=null,this.onPublishRequest=null,this.contentEl.empty()}getSelectedFiles(){return Array.from(this.selectedFiles)}buildSearchBar(r){let i=r.createDiv({cls:"garden-search-container"}).createEl("input",{type:"text",placeholder:"Search notes...",cls:"garden-search-field"});i.addEventListener("input",()=>{this.searchQuery=i.value,this.renderTree()})}buildActionBar(r){let n=r.createDiv({cls:"nav-buttons-container"}),i=this.getMaxNotes();n.createEl("button",{text:"Select All",cls:"clickable-icon"}).addEventListener("click",()=>{this.selectAll()}),n.createEl("button",{text:"Clear",cls:"clickable-icon"}).addEventListener("click",()=>{this.clearSelection()});let s=n.createSpan({cls:"tree-item-inner"}),l=`${i}`;s.setText(`${this.selectedFiles.size} / ${l} selected`),n.createSpan({cls:"tree-item-inner"}),n.createEl("button",{text:"Publish",cls:"mod-cta"}).addEventListener("click",()=>{this.onPublishRequest?.()}),this.registerSelectionCallback(()=>{let d=`${i}`;s.setText(`${this.selectedFiles.size} / ${d} selected`)})}renderTree(){this.treeContainer.empty();let n=this.plugin.app.vault.getMarkdownFiles();this.searchQuery!==""?this.renderFlatList(this.treeContainer,n):this.renderFolderTree(this.treeContainer,n)}renderFlatList(r,n){let i=this.searchQuery.toLowerCase(),o=n.filter(s=>s.path.toLowerCase().includes(i)),a=r.createDiv({cls:"tree-item"});for(let s of o)this.renderFileRow(a,s);o.length===0&&r.createSpan({cls:"tree-item-inner",text:"No matching notes"})}renderFolderTree(r,n){let i=this.buildFileTree(n);for(let o of i.children)this.renderNode(r,o,0)}buildFileTree(r){let n={name:"root",path:"",children:[],isFolder:!0};for(let i of r){let o=i.path.split("/"),a=n;for(let l=0;l<o.length-1;l++){let c=o[l]??"",d=a.children.find(g=>g.name===c&&g.isFolder);d===void 0&&(d={name:c,path:o.slice(0,l+1).join("/"),children:[],isFolder:!0},a.children.push(d)),a=d}let s=o[o.length-1]??i.name;a.children.push({name:s,path:i.path,children:[],isFolder:!1,file:i})}return this.sortNodes(n),n}sortNodes(r){r.children.sort((n,i)=>n.isFolder&&!i.isFolder?-1:!n.isFolder&&i.isFolder?1:n.name.localeCompare(i.name));for(let n of r.children)n.isFolder&&this.sortNodes(n)}renderNode(r,n,i){n.isFolder&&n.file!==void 0||(n.isFolder?this.renderFolder(r,n,i):this.renderFile(r,n,i))}renderFolder(r,n,i){let o=r.createDiv({cls:"tree-item"}),a=o.createDiv({cls:"tree-item-self is-clickable"});a.style.setProperty("padding-left",`${Math.min(i,12)*16}px`);let s=a.createDiv({cls:"tree-item-icon collapse-icon"});s.setText("\u25BC"),a.createDiv({cls:"tree-item-icon",text:"\u{1F4C1}"}),a.createDiv({cls:"tree-item-inner",text:n.name});let l=o.createDiv({cls:"tree-item-children"});a.addEventListener("click",()=>{let c=l.style.display==="none";l.style.display=c?"":"none",s.setText(c?"\u25BC":"\u25B6")});for(let c of n.children)this.renderNode(l,c,i+1)}renderFile(r,n,i){let a=r.createDiv({cls:"tree-item"}).createDiv({cls:"tree-item-self is-clickable"});a.style.setProperty("padding-left",`${Math.min(i,12)*16}px`);let s=a.createEl("input",{type:"checkbox",cls:"checkbox"});s.checked=this.selectedFiles.has(n.path),s.addEventListener("change",()=>{s.checked?this.selectedFiles.add(n.path):this.selectedFiles.delete(n.path),this.saveSelectedFiles(),this.notifySelectionChanged()}),a.createEl("label",{cls:"tree-item-inner"}).setText(n.name),a.addEventListener("click",c=>{c.target!==s&&(s.checked=!s.checked,s.dispatchEvent(new Event("change")))})}renderFileRow(r,n){this.renderFile(r,{name:n.name,path:n.path,children:[],isFolder:!1,file:n},0)}selectAll(){let n=this.plugin.app.vault.getMarkdownFiles(),i=this.getMaxNotes(),o=n.slice(0,i);for(let a of o)this.selectedFiles.add(a.path);this.saveSelectedFiles(),this.renderTree(),this.notifySelectionChanged()}clearSelection(){this.selectedFiles.clear(),this.saveSelectedFiles(),this.renderTree(),this.notifySelectionChanged()}loadSelectedFiles(){let n=T.resolve(h.PluginConfigService).getAll();this.selectedFiles=new Set(n.selectedNotes)}async saveSelectedFiles(){await T.resolve(h.PluginConfigService).set("selectedNotes",Array.from(this.selectedFiles))}notifySelectionChanged(){this.selectionCallback?.()}getMaxNotes(){return 10}};var dt=require("obsidian");function br(){return activeDocument}var yr=class extends dt.Modal{constructor(){super(...arguments);this.currentStep="info";this.repoInput=null;this.branchInput=null;this.previewLayout=null;this.resizeObserver=null;this.isPublishing=!1;this.isTransitioning=!1}onOpen(){let{contentEl:r,modalEl:n,titleEl:i,containerEl:o}=this;i!==void 0&&i.addClass("wizard-modal-title-hidden"),n.addClass("wizard-modal-flex"),r.addClass("wizard-content-flex"),o.setCssProps({width:"",maxWidth:""}),r.empty(),r.addClass("verdant-publish-wizard"),this.injectStyles(),this.stepIndicator=r.createDiv({cls:"wizard-step-indicator"}),this.contentArea=r.createDiv({cls:"wizard-content visible"}),this.navButtons=r.createDiv({cls:"wizard-nav-buttons"}),this.resizeObserver=new ResizeObserver(s=>{for(let l of s)this.reflowLayout(l.contentRect.height)}),this.resizeObserver.observe(r),this.renderStepIndicator(),this.showStep("info");let a=this.modalEl.parentElement?.querySelector(".modal-bg")??null;a!==null&&a.addClass("wizard-bg-no-pointer")}onClose(){this.resizeObserver?.disconnect(),this.resizeObserver=null,super.onClose()}renderStepIndicator(){this.stepIndicator.empty();let r=[{id:"info",label:"Customize",num:"1"},{id:"preview",label:"Preview",num:"2"},{id:"publish",label:"Publish",num:"3"}],n=Ft(this.currentStep);for(let i=0;i<r.length;i++){let o=r[i];if(o===void 0)continue;if(i>0){let l=this.stepIndicator.createDiv({cls:"wizard-step-connector"});Ft(o.id)<=n&&l.classList.add("active")}let a=Ft(o.id),s=this.stepIndicator.createSpan({cls:"wizard-dot",text:o.num});a===n?s.classList.add("active"):a<n&&s.classList.add("completed"),s.createSpan({cls:"wizard-dot-label",text:o.label}),s.addEventListener("click",()=>{o.id==="info"&&this.currentStep!=="info"?this.showStep("info"):o.id==="preview"&&this.currentStep==="publish"&&this.showStep("preview")})}}applyModalSize(r){let{modalEl:n}=this;n.removeClass("wizard-modal-expanded","wizard-modal-compact"),n.addClass("wizard-modal-flex"),r==="expanded"?n.addClass("wizard-modal-expanded"):n.addClass("wizard-modal-compact")}syncModalHeight(){let{modalEl:r,stepIndicator:n,contentArea:i,navButtons:o}=this;if(this.currentStep==="preview")return;let a=(n.clientHeight||0)+(i.scrollHeight||0)+(o.clientHeight||0);r.setCssProps({height:`${a}px`})}reflowLayout(r){if(this.currentStep!=="preview")return;let n=this.stepIndicator?.offsetHeight??0,i=this.navButtons?.offsetHeight??0,o=Math.max(0,r-n-i);this.contentArea.setCssProps({height:`${o}px`}),this.previewLayout!==null&&(this.previewLayout.setCssProps({height:`${o}px`}),this.previewFrame!==void 0&&this.previewFrame.setCssProps({height:`${Math.max(0,o-48)}px`}))}async showStep(r){if(this.isTransitioning)return;this.isTransitioning=!0;let n=Ft(r)>Ft(this.currentStep)?"forward":"back";switch(this.contentArea.classList.remove("visible"),this.contentArea.classList.add(n==="forward"?"fade-out-forward":"fade-out-back"),this.applyModalSize(r==="preview"?"expanded":"compact"),await this.waitTransition(400),this.currentStep=r,this.renderStepIndicator(),this.contentArea.empty(),this.contentArea.setCssProps({}),this.navButtons.empty(),this.contentArea.classList.remove("fade-out-forward","fade-out-back"),this.contentArea.classList.add(n==="forward"?"fade-in-forward":"fade-in-back"),r){case"info":this.renderInfoStep();break;case"preview":this.renderPreviewStep();break;case"publish":this.renderPublishStep();break}r!=="preview"&&window.requestAnimationFrame(()=>{window.requestAnimationFrame(()=>{this.syncModalHeight()})}),window.requestAnimationFrame(()=>{window.requestAnimationFrame(()=>{this.contentArea.classList.remove("fade-in-forward","fade-in-back"),this.contentArea.classList.add("visible"),this.isTransitioning=!1,r==="preview"&&this.reflowLayout(this.modalEl.clientHeight)})})}waitTransition(r){return new Promise(n=>{window.setTimeout(n,r)})}renderInfoStep(){let r=this.getSettings(),n=this.contentArea.createDiv({cls:"wizard-info-step"});n.createEl("label",{text:"Site Title",cls:"wizard-label"}),this.titleInput=n.createEl("input",{cls:"wizard-input",value:r.siteTitle}),n.createEl("label",{text:"Site Description",cls:"wizard-label"}),this.descInput=n.createEl("textarea",{cls:"wizard-textarea"}),this.descInput.value=r.siteDescription,n.createEl("label",{text:"GitHub Repository",cls:"wizard-label"}),this.repoInput=n.createEl("input",{cls:"wizard-input",value:r.repoName}),n.createEl("label",{text:"Publish Branch",cls:"wizard-label"}),this.branchInput=n.createEl("input",{cls:"wizard-input",value:r.publishBranch});let i=r.selectedNotes.length;n.createDiv({cls:"wizard-file-summary",text:`\u25CF ${i} note${i!==1?"s":""} selected`}),this.navButtons.createEl("button",{text:"Next \u2192 Preview",cls:"mod-cta"}).addEventListener("click",()=>{this.showStep("preview")})}renderPreviewStep(){this.previewLayout=this.contentArea.createDiv({cls:"wizard-preview-layout"});let r=this.previewLayout.createDiv({cls:"wizard-preview-area"}),n=r.createDiv({cls:"wizard-preview-controls"});n.createSpan({text:"Preview Theme: ",cls:"wizard-label"}),this.previewThemeSelect=n.createEl("select",{cls:"wizard-select"});let i=this.getSettings();this.populateThemeOptions(this.previewThemeSelect,i.themeId),this.previewThemeSelect.addEventListener("change",()=>{this.refreshPreview()});let o=n.createEl("button",{cls:"wizard-full-preview-btn",text:"Preview Full Site"});o.addEventListener("click",()=>{this.generateAndShowFullPreview(o)}),this.previewFrame=r.createEl("iframe",{cls:"wizard-preview-frame-styles"}),this.navButtons.createEl("button",{text:"\u2190 Back"}).addEventListener("click",()=>{this.showStep("info")}),this.navButtons.createEl("button",{text:"Publish \u2192",cls:"mod-cta"}).addEventListener("click",()=>{this.showStep("publish")}),this.refreshPreview()}writePreviewHtml(r){this.previewFrame!==void 0&&(this.previewFrame.srcdoc=r)}async refreshPreview(){try{let r=this.getSettings(),n=r.selectedNotes;if(n.length===0){this.writePreviewHtml("<html><body><p>No notes selected for preview.</p></body></html>");return}let i=T.resolve(h.VaultRepository),o=n[0]??"",a;try{a=await i.getPublishFile(o)}catch{this.writePreviewHtml("<html><body><p>Preview file not found.</p></body></html>");return}let s,l=this.previewThemeSelect?.value??r.themeId;s=await T.resolve(h.ThemeService).getThemeCSS(l),s.length===0&&(s=vr[l]??vr.default);let d=this.titleInput?.value??r.siteTitle,g={title:d,description:this.descInput?.value??r.siteDescription,baseUrl:"/",themeId:l,githubToken:"",githubOwner:"",githubRepo:"",githubBranch:"",isPro:!1,customCss:s},b=await T.resolve(h.SiteGeneratorService).generateFile(a,g),P=Ea(b.html);this.writePreviewHtml(_d(P,s,d))}catch(r){let n=r instanceof Error?r.message:String(r);this.writePreviewHtml(`<html><body><p>Preview error: ${this.escapeHtml(n)}</p></body></html>`)}}async generateAndShowFullPreview(r){let n=r.textContent??"Preview Full Site";r.textContent="Generating...",r.disabled=!0;try{let i=await this.generateFullPreview();this.writePreviewHtml(i)}catch(i){let o=i instanceof Error?i.message:String(i);this.writePreviewHtml(`<html><body><p>Full preview error: ${this.escapeHtml(o)}</p></body></html>`)}finally{r.textContent=n,r.disabled=!1}}async generateFullPreview(){let r=this.getSettings(),n=r.selectedNotes;if(n.length===0)return"<html><body><p>No notes selected for preview.</p></body></html>";let i=T.resolve(h.VaultRepository),o=[];for(let v of n)try{let b=await i.getPublishFile(v);o.push(b)}catch{continue}if(o.length===0)return"<html><body><p>No readable notes found for preview.</p></body></html>";let a,s=this.previewThemeSelect?.value??r.themeId;a=await T.resolve(h.ThemeService).getThemeCSS(s),a.length===0&&(a=vr[s]??vr.default);let c={title:this.titleInput?.value??r.siteTitle,description:this.descInput?.value??r.siteDescription,baseUrl:"/",themeId:s,githubToken:"",githubOwner:"",githubRepo:"",githubBranch:"",isPro:!1,customCss:a},g=await T.resolve(h.SiteGeneratorService).generateSite(o,c);return this.buildFullPreviewHtml(g,c.title,a,s)}buildFullPreviewHtml(r,n,i,o){let a=r.navigation.filter(l=>!l.path.startsWith("page/")&&!l.path.startsWith("tags/")).map(l=>{let c=Ta(l.path);return`<a href="javascript:void(0)" class="preview-nav-link" data-page="${me(c)}">${me(l.title)}</a>`}).join(`
`),s=r.files.filter(l=>!l.relativePath.startsWith("page/")&&!l.relativePath.startsWith("tags/")).map(l=>{let c=Ta(l.relativePath),d=Ea(l.html);return`<div class="preview-page" id="page-${me(c)}">${d}</div>`}).join(`
`);return`<!DOCTYPE html>
<html lang="en" data-theme="${me(o)}">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Full Preview \u2014 ${me(n)}</title>
  <style>${kd}</style>
  <style>${i}</style>
</head>
<body>
  <header class="garden-nav">
    <div class="garden-nav-header">
      <div class="garden-brand">
        <div class="garden-logo"></div>
        <a href="#" class="garden-site-title">${me(n)}</a>
      </div>
      <button class="preview-sidebar-toggle" onclick="toggleSidebar()" aria-label="Toggle navigation">
        <span class="garden-menu-icon"></span>
      </button>
    </div>
  </header>
  <main class="garden-content" id="preview-content">
    <p class="preview-placeholder">Select a page from the sidebar to preview.</p>
    ${s}
  </main>
  <footer class="garden-footer">
    <div class="garden-footer-inner">
      <p>Cultivated with <a href="https://verdant.pub" target="_blank" rel="noopener">Verdant</a></p>
    </div>
  </footer>
  <aside class="preview-sidebar" id="preview-sidebar">
    <div class="preview-sidebar-header">
      <span class="preview-sidebar-title">${me(n)}</span>
    </div>
    <nav class="preview-sidebar-nav">${a}</nav>
  </aside>
  <div class="preview-sidebar-overlay" id="preview-overlay" onclick="toggleSidebar()"></div>
  <script>${Ad}<\/script>
</body>
</html>`}renderPublishStep(){let r=this.contentArea.createDiv({cls:"wizard-publish-step"});r.createEl("h3",{text:"Publishing...",cls:"wizard-publish-progress"}),this.progressBar=r.createEl("progress",{cls:"publish-progress-bar"}),this.progressBar.max=100,this.progressBar.value=0,this.stepText=r.createDiv({cls:"setting-item-description",text:"Starting..."}),this.resultSection=r.createDiv({cls:"publish-result"}),this.doPublish()}async doPublish(){if(this.isPublishing)return;this.isPublishing=!0;let r=this.getSettings(),n=r.selectedNotes;if(n.length===0){new dt.Notice("No files selected. Select files in the Note Selector first."),this.isPublishing=!1,this.close();return}let i=r.githubToken;if(i===""){new dt.Notice("No GitHub token found. Please add one in Settings."),this.isPublishing=!1,this.close();return}let o=T.resolve(h.PublisherService),a=this.repoInput?.value??r.repoName,s=this.previewThemeSelect?.value??r.themeId,l={title:this.titleInput?.value??r.siteTitle,description:this.descInput?.value??r.siteDescription,baseUrl:`https://${r.githubUsername}.github.io/${a}`,themeId:s,githubToken:i,githubOwner:r.githubUsername,githubRepo:a,githubBranch:this.branchInput?.value??r.publishBranch,isPro:!1,customCss:void 0},c=T.resolve(h.LoggerService);try{let d=await ne.wrap(async()=>o.publish(n,l,g=>{this.updateProgress(g)},10),"PublishWizard.doPublish",c);this.isPublishing=!1,d.success?this.showSuccess(d):this.showError(d)}catch(d){this.isPublishing=!1;let g=d instanceof Error?d.message:String(d);new dt.Notice(`Publish failed: ${g}`),this.showError({success:!1,notesPublished:0,elapsedMs:0,wasIncremental:!1,error:g})}}updateProgress(r){this.progressBar.value=r.percent,this.stepText.setText(r.message)}showSuccess(r){this.progressBar.addClass("wizard-hidden");let n=this.contentArea.querySelector(".wizard-publish-progress");n!==null&&(n.textContent="Published!",n.classList.remove("wizard-publish-progress")),this.stepText.setText(""),this.resultSection.empty(),this.resultSection.removeClass("wizard-hidden"),this.resultSection.classList.add("wizard-publish-success"),this.resultSection.createDiv({cls:"setting-item-info",text:`${r.notesPublished} notes deployed.`}),r.siteUrl!==void 0&&(this.resultSection.createDiv({cls:"setting-item-description",text:r.siteUrl}),this.resultSection.createEl("button",{text:"View Site",cls:"mod-cta"}).addEventListener("click",()=>{r.siteUrl!==void 0&&open(r.siteUrl)})),this.resultSection.createEl("button",{text:"Close"}).addEventListener("click",()=>{this.close()})}showError(r){this.progressBar.addClass("wizard-hidden");let n=this.contentArea.querySelector(".wizard-publish-progress");n!==null&&(n.textContent="Publish failed",n.classList.remove("wizard-publish-progress")),this.stepText.setText(""),this.resultSection.empty(),this.resultSection.removeClass("wizard-hidden"),this.resultSection.classList.add("wizard-publish-error"),this.resultSection.createDiv({cls:"setting-item-error",text:r.error??"Unknown error"}),this.resultSection.createEl("button",{text:"Retry",cls:"mod-cta"}).addEventListener("click",()=>{this.resultSection.empty(),this.progressBar.removeClass("wizard-hidden"),this.doPublish()})}populateThemeOptions(r,n){r.empty();let i=[{id:"default",name:"Default Light"},{id:"dark",name:"Dark Mode"}];for(let o of i){let a=r.createEl("option",{value:o.id,text:o.name});o.id===n&&(a.selected=!0)}}getSettings(){return T.resolve(h.PluginConfigService).getAll()}escapeHtml(r){let n=br().createElement("div");return n.appendChild(br().createTextNode(r)),n.innerHTML}injectStyles(){}};function Ft(e){switch(e){case"info":return 0;case"preview":return 1;case"publish":return 2}}var kd=`
.preview-sidebar { position: fixed; top: 0; left: 0; width: 220px; height: 100%; background: var(--background-secondary, #f2f0eb); border-right: 1px solid var(--background-modifier-border, #e7e5e4); overflow-y: auto; z-index: 100; transform: translateX(-100%); transition: transform 0.3s ease; display: flex; flex-direction: column; }
.preview-sidebar.open { transform: translateX(0); }
.preview-sidebar-header { padding: 16px 14px 12px; border-bottom: 1px solid var(--background-modifier-border, #e7e5e4); flex-shrink: 0; }
.preview-sidebar-title { font-family: Georgia, serif; font-size: 1rem; font-weight: 600; color: var(--text-normal, #1c1917); letter-spacing: -0.02em; }
.preview-sidebar-nav { display: flex; flex-direction: column; padding: 8px 0; flex: 1; overflow-y: auto; }
.preview-sidebar-nav .preview-nav-link { display: block; padding: 6px 14px; font-size: 0.82rem; color: var(--text-muted, #44403c); text-decoration: none; cursor: pointer; transition: background 0.15s ease; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.preview-sidebar-nav .preview-nav-link:hover { background: rgba(79, 70, 229, 0.08); color: var(--text-accent, #4f46e5); }
.preview-sidebar-nav .preview-nav-link.active { background: rgba(79, 70, 229, 0.12); color: var(--text-accent, #4f46e5); font-weight: 500; }
.preview-sidebar-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.3); z-index: 99; display: none; }
.preview-sidebar-overlay.visible { display: block; }
.preview-placeholder { color: var(--text-faint, #a8a29e); font-size: 0.9rem; padding: 48px 24px; text-align: center; }
.preview-page { display: none; }
.preview-page.visible { display: block; }
`.trim(),Ad=`
(function() {
  var links = document.querySelectorAll('.preview-sidebar-nav .preview-nav-link');
  var pages = document.querySelectorAll('.preview-page');
  var placeholder = document.querySelector('.preview-placeholder');
  var sidebar = document.getElementById('preview-sidebar');
  var overlay = document.getElementById('preview-overlay');

  window.toggleSidebar = function() {
    if (!sidebar || !overlay) return;
    var isOpen = sidebar.classList.contains('open');
    if (isOpen) {
      sidebar.classList.remove('open');
      overlay.classList.remove('visible');
    } else {
      sidebar.classList.add('open');
      overlay.classList.add('visible');
    }
  };

  function showPage(slug) {
    var found = false;
    for (var i = 0; i < pages.length; i++) {
      if (pages[i].id === 'page-' + slug) {
        pages[i].classList.add('visible');
        found = true;
      } else {
        pages[i].classList.remove('visible');
      }
    }
    if (placeholder) {
      placeholder.style.display = found ? 'none' : '';
    }
    for (var j = 0; j < links.length; j++) {
      var linkSlug = links[j].getAttribute('data-page');
      if (linkSlug === slug) {
        links[j].classList.add('active');
      } else {
        links[j].classList.remove('active');
      }
    }
    if (sidebar && overlay) {
      sidebar.classList.remove('open');
      overlay.classList.remove('visible');
    }
  }

  for (var k = 0; k < links.length; k++) {
    links[k].addEventListener('click', function() {
      var slug = this.getAttribute('data-page');
      if (slug) showPage(slug);
    });
  }
})();
`.trim();function Ta(e){return e.replace(/\/index\.html$/i,"").replace(/\.html$/i,"").replace(/\//g,"-").toLowerCase()}function Ea(e){let t=e.match(/<main\s+class="garden-content"[^>]*>([\s\S]*)<\/main>/i);return t?.[1]!==void 0?t[1].trim():e.match(/<body[^>]*>([\s\S]*)<\/body>/i)?.[1]?.trim()??e}var vr={default:`
* { box-sizing: border-box; margin: 0; padding: 0; }
html { font-size: 16px; -webkit-text-size-adjust: 100%; }
body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif; color: #1c1917; background: #faf9f6; line-height: 1.75; min-height: 100vh; -webkit-font-smoothing: antialiased; }
h1, h2, h3, h4 { font-family: Georgia, 'Times New Roman', serif; line-height: 1.32; font-weight: 600; letter-spacing: -0.02em; }
.garden-nav { background: rgba(250, 249, 246, 0.82); backdrop-filter: blur(16px) saturate(1.8); border-bottom: 1px solid #e7e5e4; }
.garden-nav-header { display: flex; align-items: center; height: 60px; max-width: 800px; margin: 0 auto; padding: 0 24px; }
.garden-brand { display: flex; align-items: center; gap: 10px; }
.garden-logo { width: 28px; height: 28px; background: linear-gradient(135deg, #059669, #10b981); border-radius: 7px; display: grid; place-items: center; box-shadow: 0 1px 3px rgba(5,150,105,0.3); }
.garden-logo::after { content: ""; width: 10px; height: 10px; border: 2px solid rgba(255,255,255,0.9); border-radius: 50% 50% 50% 0; transform: rotate(-45deg); }
.garden-site-title { font-family: Georgia, serif; font-size: 1.15rem; font-weight: 600; color: #1c1917; text-decoration: none; letter-spacing: -0.02em; }
.garden-content { max-width: 680px; margin: 0 auto; padding: 48px 24px 80px; }
.garden-content h1 { font-size: 2.2rem; font-weight: 600; margin-bottom: 12px; line-height: 1.25; }
.garden-content h2 { font-size: 1.35rem; font-weight: 600; margin: 2rem 0 0.75rem; padding-bottom: 0.4rem; border-bottom: 1px solid #e7e5e4; }
.garden-content h3 { font-size: 1.1rem; font-weight: 600; margin: 1.5rem 0 0.6rem; }
.garden-content p { margin-bottom: 1.1rem; }
.garden-content a { color: #4f46e5; text-decoration: none; border-bottom: 1px solid rgba(79,70,229,0.08); transition: border-color 0.15s ease; }
.garden-content a:hover { border-bottom-color: #4f46e5; }
.garden-content code { background: #f5f5f4; padding: 0.15rem 0.4rem; border-radius: 4px; font-family: 'SF Mono', 'Fira Code', Consolas, monospace; font-size: 0.84em; color: #4338ca; }
.garden-content pre { background: #f2f0eb; border: 1px solid #e7e5e4; padding: 1rem 1.2rem; border-radius: 8px; overflow-x: auto; margin: 1.2rem 0; line-height: 1.6; }
.garden-content pre code { padding: 0; background: none; font-size: 0.86rem; color: inherit; }
.garden-content blockquote { border-left: 3px solid #d97706; padding: 0.75rem 1.1rem; margin: 1.2rem 0; color: #78716c; font-style: italic; background: rgba(217,119,6,0.1); border-radius: 0 6px 6px 0; }
.garden-content ul, .garden-content ol { margin: 0 0 1.1rem 1.5rem; }
.garden-content li { margin-bottom: 0.35rem; }
.garden-content li::marker { color: #d97706; }
.garden-content img { max-width: 100%; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.07), 0 1px 2px -1px rgba(0,0,0,0.04); }
.garden-content hr { border: none; height: 1px; background: #e7e5e4; margin: 2rem 0; }
.garden-content table { width: 100%; border-collapse: separate; border-spacing: 0; margin: 1.2rem 0; font-size: 0.9rem; border: 1px solid #e7e5e4; border-radius: 8px; overflow: hidden; }
.garden-content th { background: #f2f0eb; font-weight: 600; text-align: left; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.05em; color: #78716c; }
.garden-content th, .garden-content td { border-bottom: 1px solid #e7e5e4; padding: 0.55rem 0.8rem; }
.garden-content tbody tr:last-child td { border-bottom: none; }
.garden-content tbody tr:nth-child(even) { background: #f2f0eb; }
.garden-content strong { font-weight: 600; }
`.trim(),dark:`
* { box-sizing: border-box; margin: 0; padding: 0; }
html { font-size: 16px; -webkit-text-size-adjust: 100%; }
body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif; color: #fafaf9; background: #0c0a09; line-height: 1.75; min-height: 100vh; -webkit-font-smoothing: antialiased; }
h1, h2, h3, h4 { font-family: Georgia, 'Times New Roman', serif; line-height: 1.32; font-weight: 600; letter-spacing: -0.02em; }
.garden-nav { background: rgba(12, 10, 9, 0.85); backdrop-filter: blur(16px) saturate(1.8); border-bottom: 1px solid #44403c; }
.garden-nav-header { display: flex; align-items: center; height: 60px; max-width: 800px; margin: 0 auto; padding: 0 24px; }
.garden-brand { display: flex; align-items: center; gap: 10px; }
.garden-logo { width: 28px; height: 28px; background: linear-gradient(135deg, #059669, #10b981); border-radius: 7px; display: grid; place-items: center; box-shadow: 0 1px 3px rgba(5,150,105,0.3); }
.garden-logo::after { content: ""; width: 10px; height: 10px; border: 2px solid rgba(255,255,255,0.9); border-radius: 50% 50% 50% 0; transform: rotate(-45deg); }
.garden-site-title { font-family: Georgia, serif; font-size: 1.15rem; font-weight: 600; color: #fafaf9; text-decoration: none; letter-spacing: -0.02em; }
.garden-content { max-width: 680px; margin: 0 auto; padding: 48px 24px 80px; }
.garden-content h1 { font-size: 2.2rem; font-weight: 600; margin-bottom: 12px; line-height: 1.25; }
.garden-content h2 { font-size: 1.35rem; font-weight: 600; margin: 2rem 0 0.75rem; padding-bottom: 0.4rem; border-bottom: 1px solid #44403c; }
.garden-content h3 { font-size: 1.1rem; font-weight: 600; margin: 1.5rem 0 0.6rem; }
.garden-content p { margin-bottom: 1.1rem; }
.garden-content a { color: #818cf8; text-decoration: none; border-bottom: 1px solid rgba(129,140,248,0.12); transition: border-color 0.15s ease; }
.garden-content a:hover { border-bottom-color: #818cf8; }
.garden-content code { background: #292524; padding: 0.15rem 0.4rem; border-radius: 4px; font-family: 'SF Mono', 'Fira Code', Consolas, monospace; font-size: 0.84em; color: #a5b4fc; }
.garden-content pre { background: #0c0a09; border: 1px solid #44403c; padding: 1rem 1.2rem; border-radius: 8px; overflow-x: auto; margin: 1.2rem 0; line-height: 1.6; }
.garden-content pre code { padding: 0; background: none; font-size: 0.86rem; color: inherit; }
.garden-content blockquote { border-left: 3px solid #fbbf24; padding: 0.75rem 1.1rem; margin: 1.2rem 0; color: #a8a29e; font-style: italic; background: rgba(251,191,36,0.1); border-radius: 0 6px 6px 0; }
.garden-content ul, .garden-content ol { margin: 0 0 1.1rem 1.5rem; }
.garden-content li { margin-bottom: 0.35rem; }
.garden-content li::marker { color: #fbbf24; }
.garden-content img { max-width: 100%; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.35), 0 1px 2px -1px rgba(0,0,0,0.25); }
.garden-content hr { border: none; height: 1px; background: #44403c; margin: 2rem 0; }
.garden-content table { width: 100%; border-collapse: separate; border-spacing: 0; margin: 1.2rem 0; font-size: 0.9rem; border: 1px solid #44403c; border-radius: 8px; overflow: hidden; }
.garden-content th { background: #292524; font-weight: 600; text-align: left; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.05em; color: #a8a29e; }
.garden-content th, .garden-content td { border-bottom: 1px solid #44403c; padding: 0.55rem 0.8rem; }
.garden-content tbody tr:last-child td { border-bottom: none; }
.garden-content tbody tr:nth-child(even) { background: #292524; }
.garden-content strong { font-weight: 600; }
`.trim()};function _d(e,t,r){return`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Preview \u2014 ${me(r)}</title>
  <style>${t}</style>
</head>
<body>
  <header class="garden-nav">
    <div class="garden-nav-header">
      <div class="garden-brand">
        <div class="garden-logo"></div>
        <a href="#" class="garden-site-title">${me(r)}</a>
      </div>
    </div>
  </header>
  <main class="garden-content">
    ${e}
  </main>
  <footer class="garden-footer">
    <div class="garden-footer-inner">
      <p>Cultivated with <a href="https://verdant.pub" target="_blank" rel="noopener">Verdant</a></p>
    </div>
  </footer>
</body>
</html>`}function me(e){let t=br().createElement("div");return t.appendChild(br().createTextNode(e)),t.innerHTML}var ut=class{constructor(t){this.logger=t}registerViews(t){t.registerView(It,r=>{let n=new mr(r,t);return n.onPublishRequest=()=>{this.openPublishModal(t)},n}),this.logger.info("Views registered")}async activateNoteSelector(t){let{workspace:r}=t.app,i=r.getLeavesOfType(It)[0];if(i!==void 0){r.revealLeaf(i);return}let o=r.getRightLeaf(!1);o!==null&&(await o.setViewState({type:It,active:!0}),r.revealLeaf(o))}openPublishModal(t){try{new yr(t.app).open()}catch(r){let n=r instanceof Error?r.message:String(r);this.logger.error("Failed to open publish modal: %s",n)}}};ut=L([xt(),_(),A(0,C(h.LoggerService))],ut);var xr=class{constructor(t,r){this.statusBarItem=t.addStatusBarItem(),this.statusBarItem.addClass("mod-clickable"),this.clickHandler=()=>{r?.()},this.statusBarItem.addEventListener("click",this.clickHandler),this.setIdle()}setIdle(){this.statusBarItem.setText("\u25C6 Verdant: ready")}setPublishing(){this.statusBarItem.setText("\u25C7 Verdant: publishing...")}setSuccess(t){this.statusBarItem.setText(`\u25CF Verdant: ${t} notes published`)}setError(){this.statusBarItem.setText("\u25CF Verdant: publish failed")}destroy(){this.statusBarItem.removeEventListener("click",this.clickHandler),this.statusBarItem.remove()}};var J=require("obsidian");var wr=class extends J.PluginSettingTab{constructor(t,r){super(t,r),this.configService=T.resolve(h.PluginConfigService)}display(){let{containerEl:t}=this;t.empty(),this.addGitHubSection(t),this.addSiteSection(t),this.addUpgradeSection(t)}addGitHubSection(t){new J.Setting(t).setName("GitHub").setHeading();let r=this.configService.getAll();new J.Setting(t).setName("Personal Access Token").setDesc("repo scope required").addText(n=>{n.setPlaceholder("ghp_...").setValue(r.githubToken).onChange(async i=>{await this.configService.set("githubToken",i)})}).addButton(n=>{n.setButtonText("Verify").onClick(async()=>{await this.verifyToken()})}),new J.Setting(t).setName("GitHub Username").setDesc("Your GitHub username").addText(n=>{n.setPlaceholder("username").setValue(r.githubUsername).onChange(async i=>{await this.configService.set("githubUsername",i)})}),new J.Setting(t).setName("Repository Name").setDesc("Where the site gets deployed").addText(n=>{n.setPlaceholder("my-verdant-site").setValue(r.repoName).onChange(async i=>{await this.configService.set("repoName",i)})}),new J.Setting(t).setName("Publish Branch").setDesc("Default: gh-pages").addText(n=>{n.setPlaceholder("gh-pages").setValue(r.publishBranch).onChange(async i=>{await this.configService.set("publishBranch",i)})})}addUpgradeSection(t){new J.Setting(t).setName("Upgrade to Pro").setHeading(),t.createEl("p",{text:"Unlock unlimited notes and more features. Purchase on Payhip, then paste the license key in the Pro version to activate."});let n=t.createDiv({cls:"verdant-purchase-buttons"}).createEl("a",{cls:"verdant-purchase-btn verdant-purchase-btn--payhip",href:"https://payhip.com/b/RnYOS",text:"Payhip \u2014 $19"});n.target="_blank"}addSiteSection(t){new J.Setting(t).setName("Site").setHeading();let r=this.configService.getAll();new J.Setting(t).setName("Site Title").setDesc("Shown on the published site").addText(n=>{n.setPlaceholder("My Notes").setValue(r.siteTitle).onChange(async i=>{await this.configService.set("siteTitle",i)})}),new J.Setting(t).setName("Site Description").setDesc("Short description for the site header").addTextArea(n=>{n.setPlaceholder("Personal notes and writing").setValue(r.siteDescription).onChange(async i=>{await this.configService.set("siteDescription",i)})}),new J.Setting(t).setName("Theme").setDesc("Site appearance").addDropdown(n=>{let i=this.getAvailableThemes();for(let o of i)n.addOption(o.id,o.name);n.setValue(r.themeId),n.onChange(async o=>{await this.configService.set("themeId",o)})})}async verifyToken(){let t=T.resolve(h.GitHubAuthService),r=this.configService.get("githubToken");if(r===""){new J.Notice("Enter a token first");return}let n=await t.validateToken(r);n.valid?(new J.Notice(`Token valid (${n.username??"unknown"})`),n.username!==void 0&&n.username!==""&&(await this.configService.set("githubUsername",n.username),this.display())):new J.Notice(`${n.error??"Invalid token"}`)}getAvailableThemes(){try{return T.resolve(h.ThemeRegistry).list()}catch{return[]}}};var Sr=class extends Tr.Plugin{constructor(){super(...arguments);this.settings=be}async onload(){Mn();let r=T.resolve(h.PluginDataStore);O.setPlugin(this),await r.init(),T.register(h.ObsidianApp,{useValue:this.app});let n=O.create("settings"),i=T.resolve(h.PluginConfigService);i.init(n),this.settings=await i.load(),this.initializer=T.resolve(ct),await this.initializer.initialize(this,this.settings),this.viewController=T.resolve(ut),this.viewController.registerViews(this),this.statusBar=new xr(this,()=>{this.activateView()}),this.addRibbonIcon("globe","Verdant",async()=>{await this.viewController.activateNoteSelector(this)}),this.addCommand({id:"open-publish-modal",name:"Open publish modal",callback:()=>{this.viewController.openPublishModal(this)}}),this.addCommand({id:"open-note-selector",name:"Open note selector",callback:async()=>{await this.viewController.activateNoteSelector(this)}}),this.addSettingTab(new wr(this.app,this)),new Tr.Notice("Verdant loaded")}onunload(){this.statusBar?.destroy()}async loadSettings(){let r=T.resolve(h.PluginConfigService);this.settings=await r.load()}async saveSettings(){await T.resolve(h.PluginConfigService).update(this.settings)}activateView(){this.viewController.activateNoteSelector(this)}};
/*! Bundled license information:

reflect-metadata/Reflect.js:
  (*! *****************************************************************************
  Copyright (C) Microsoft. All rights reserved.
  Licensed under the Apache License, Version 2.0 (the "License"); you may not use
  this file except in compliance with the License. You may obtain a copy of the
  License at http://www.apache.org/licenses/LICENSE-2.0
  
  THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
  KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
  WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
  MERCHANTABLITY OR NON-INFRINGEMENT.
  
  See the Apache Version 2.0 License for specific language governing permissions
  and limitations under the License.
  ***************************************************************************** *)

is-extendable/index.js:
  (*!
   * is-extendable <https://github.com/jonschlinkert/is-extendable>
   *
   * Copyright (c) 2015, Jon Schlinkert.
   * Licensed under the MIT License.
   *)

strip-bom-string/index.js:
  (*!
   * strip-bom-string <https://github.com/jonschlinkert/strip-bom-string>
   *
   * Copyright (c) 2015, 2017, Jon Schlinkert.
   * Released under the MIT License.
   *)

tslib/tslib.es6.js:
  (*! *****************************************************************************
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
  ***************************************************************************** *)
*/
