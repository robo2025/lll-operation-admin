webpackJsonp([21],{687:function(t,e,r){"use strict";function a(t){return n.apply(this,arguments)}function n(){return n=_()(g.a.mark(function t(e){var r,a,n,c,s;return g.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return r=e.offset,a=void 0===r?0:r,n=e.limit,c=void 0===n?10:n,s=A.a.get("access_token"),t.abrupt("return",Object(O.a)("".concat(z.a,"/products?offset=").concat(a,"&limit=").concat(c),{headers:{Authorization:s}}));case 3:case"end":return t.stop()}},t,this)})),n.apply(this,arguments)}function c(t){return s.apply(this,arguments)}function s(){return s=_()(g.a.mark(function t(e){var r,a;return g.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return r=e.data,a=A.a.get("access_token"),t.abrupt("return",Object(O.a)("".concat(z.a,"/products"),{method:"post",headers:{Authorization:a},data:m()({},r)}));case 3:case"end":return t.stop()}},t,this)})),s.apply(this,arguments)}function o(t){return u.apply(this,arguments)}function u(){return u=_()(g.a.mark(function t(e){var r,a,n;return g.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return r=e.prdId,a=e.data,n=A.a.get("access_token"),t.abrupt("return",Object(O.a)("".concat(z.a,"/products/").concat(r),{method:"put",headers:{Authorization:n},data:m()({},a)}));case 3:case"end":return t.stop()}},t,this)})),u.apply(this,arguments)}function i(t){return p.apply(this,arguments)}function p(){return p=_()(g.a.mark(function t(e){var r,a;return g.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return r=e.productId,a=A.a.get("access_token"),t.abrupt("return",Object(O.a)("".concat(z.a,"/products/").concat(r),{method:"get",headers:{Authorization:a}}));case 3:case"end":return t.stop()}},t,this)})),p.apply(this,arguments)}function d(t){return f.apply(this,arguments)}function f(){return f=_()(g.a.mark(function t(e){var r,a;return g.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return r=e.ids,a=A.a.get("access_token"),t.abrupt("return",Object(O.a)("".concat(z.a,"/products"),{method:"delete",headers:{Authorization:a},data:{ids:r}}));case 3:case"end":return t.stop()}},t,this)})),f.apply(this,arguments)}function l(t){return h.apply(this,arguments)}function h(){return h=_()(g.a.mark(function t(e){var r,a;return g.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return r=e.productId,a=A.a.get("access_token"),t.abrupt("return",Object(O.a)("".concat(z.a,"/goods?product_id=").concat(r),{method:"get",headers:{Authorization:a}}));case 3:case"end":return t.stop()}},t,this)})),h.apply(this,arguments)}function x(t){return y.apply(this,arguments)}function y(){return y=_()(g.a.mark(function t(e){var r,a,n;return g.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return r=e.module,a=e.productId,n=A.a.get("access_token"),t.abrupt("return",Object(O.a)("".concat(z.a,"/operationlogs?module=").concat(r,"&object_id=").concat(a),{method:"get",headers:{Authorization:n}}));case 3:case"end":return t.stop()}},t,this)})),y.apply(this,arguments)}function b(t){return k.apply(this,arguments)}function k(){return k=_()(g.a.mark(function t(e){var r,a;return g.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return r=e.fields,a=A.a.get("access_token"),t.abrupt("return",Object(O.a)("".concat(z.a,"/product_reports"),{method:"post",headers:{Authorization:a},data:{fields:r}}));case 3:case"end":return t.stop()}},t,this)})),k.apply(this,arguments)}Object.defineProperty(e,"__esModule",{value:!0});var v=r(42),m=r.n(v),w=r(96),g=r.n(w),I=r(189),_=r.n(I),j=r(127),A=r.n(j),O=r(321),z=r(98);e.default={namespace:"product",state:{list:[],detail:{},logs:[],supplierList:[],total:0,export:""},effects:{fetch:g.a.mark(function t(e,r){var n,c,s,o,u,i,p,d;return g.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return n=e.offset,c=e.limit,s=e.success,o=e.error,u=r.call,i=r.put,t.next=4,u(a,{offset:n,limit:c});case 4:if(p=t.sent,p.rescode>>0!==z.g){t.next=9;break}"function"==typeof s&&s(p.data),t.next=12;break;case 9:if("function"!=typeof o){t.next=12;break}return o(p),t.abrupt("return");case 12:return d=p.headers,t.next=15,i({type:"save",payload:p.data,headers:d});case 15:case"end":return t.stop()}},t,this)}),fetchDetail:g.a.mark(function t(e,r){var a,n,c,s,o,u;return g.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return a=e.productId,n=e.success,c=e.error,s=r.call,o=r.put,t.next=4,s(i,{productId:a});case 4:if(u=t.sent,u.rescode>>0!==z.g){t.next=9;break}"function"==typeof n&&n(u.data),t.next=12;break;case 9:if("function"!=typeof c){t.next=12;break}return c(u),t.abrupt("return");case 12:return t.next=14,o({type:"saveDetail",payload:u.data});case 14:case"end":return t.stop()}},t,this)}),add:g.a.mark(function t(e,r){var n,s,o,u,i,p,d;return g.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return n=e.data,s=e.success,o=e.error,u=r.call,i=r.put,t.next=4,u(c,{data:n});case 4:if(p=t.sent,p.rescode>>0!==z.g){t.next=9;break}"function"==typeof s&&s(p.data),t.next=12;break;case 9:if("function"!=typeof o){t.next=12;break}return o(p),t.abrupt("return");case 12:return t.next=14,u(a,{});case 14:return d=t.sent,t.next=17,i({type:"save",payload:d.data});case 17:case"end":return t.stop()}},t,this)}),modifyInfo:g.a.mark(function t(e,r){var n,c,s,u,i,p,d,f,l;return g.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return n=e.prdId,c=e.data,s=e.success,u=e.error,i=r.call,p=r.put,t.next=4,i(o,{prdId:n,data:c});case 4:if(d=t.sent,d.rescode>>0!==z.g){t.next=9;break}"function"==typeof s&&s(d.data),t.next=12;break;case 9:if("function"!=typeof u){t.next=12;break}return u(d),t.abrupt("return");case 12:return t.next=14,i(a,{});case 14:return f=t.sent,l=f.headers,t.next=18,p({type:"save",payload:f.data,headers:l});case 18:case"end":return t.stop()}},t,this)}),modifyStatus:g.a.mark(function t(e,r){var n,c,s,u,i,p,d,f,l;return g.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return n=e.categoryId,c=e.isActive,s=e.success,u=e.error,i=r.call,p=r.put,t.next=4,i(o,{categoryId:n,isActive:c});case 4:if(d=t.sent,d.rescode>>0!==z.g){t.next=9;break}"function"==typeof s&&s(d.data),t.next=12;break;case 9:if("function"!=typeof u){t.next=12;break}return u(d),t.abrupt("return");case 12:return t.next=14,i(a,{});case 14:return f=t.sent,l=f.headers,t.next=18,p({type:"save",payload:f.data,headers:l});case 18:case"end":return t.stop()}},t,this)}),remove:g.a.mark(function t(e,r){var n,c,s,o,u,i,p,f;return g.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return n=e.ids,c=e.success,s=e.error,o=r.call,u=r.put,t.next=4,o(d,{ids:n});case 4:if(i=t.sent,i.rescode>>0!==z.g){t.next=9;break}"function"==typeof c&&c(i.data),t.next=12;break;case 9:if("function"!=typeof s){t.next=12;break}return s(i),t.abrupt("return");case 12:return t.next=14,o(a,{});case 14:return p=t.sent,f=p.headers,t.next=18,u({type:"save",payload:p.data,headers:f});case 18:case"end":return t.stop()}},t,this)}),querySupplyInfo:g.a.mark(function t(e,r){var a,n,c,s,o,u;return g.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return a=e.productId,n=e.success,c=e.error,s=r.call,o=r.put,t.next=4,s(l,{productId:a});case 4:if(u=t.sent,u.rescode>>0!==z.g){t.next=9;break}"function"==typeof n&&n(u.data),t.next=12;break;case 9:if("function"!=typeof c){t.next=12;break}return c(u),t.abrupt("return");case 12:return t.next=14,o({type:"supplyInfo",payload:u.data});case 14:case"end":return t.stop()}},t,this)}),queryLogs:g.a.mark(function t(e,r){var a,n,c,s,o,u,i;return g.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return a=e.module,n=e.productId,c=e.success,s=e.error,o=r.call,u=r.put,t.next=4,o(x,{module:a,productId:n});case 4:if(i=t.sent,i.rescode>>0!==z.g){t.next=9;break}"function"==typeof c&&c(i.data),t.next=12;break;case 9:if("function"!=typeof s){t.next=12;break}return s(i),t.abrupt("return");case 12:return t.next=14,u({type:"logs",payload:i.data});case 14:case"end":return t.stop()}},t,this)}),queryExport:g.a.mark(function t(e,r){var a,n,c,s,o,u;return g.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return a=e.fields,n=e.success,c=e.error,s=r.call,o=r.put,t.next=4,s(b,{fields:a});case 4:if(u=t.sent,u.rescode>>0!==z.g){t.next=9;break}"function"==typeof n&&n(u.data),t.next=12;break;case 9:if("function"!=typeof c){t.next=12;break}return c(u),t.abrupt("return");case 12:return t.next=14,o({type:"export",payload:u.data});case 14:case"end":return t.stop()}},t,this)})},reducers:{save:function(t,e){return m()({},t,{list:e.payload,total:e.headers["x-content-total"]>>0})},saveDetail:function(t,e){return m()({},t,{detail:e.payload})},saveOne:function(t,e){return m()({},t,{list:e.payload})},modify:function(t,e){return m()({},t,{list:e.payload})},remove:function(t,e){return m()({},t,{list:e.payload})},supplyInfo:function(t,e){return m()({},t,{supplierList:e.payload})},logs:function(t,e){return m()({},t,{logs:e.payload})},export:function(t,e){return m()({},t,{export:e.payload})}}}}});