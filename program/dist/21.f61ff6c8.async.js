webpackJsonp([21],{688:function(e,a,t){"use strict";Object.defineProperty(a,"__esModule",{value:!0});var n=t(42),r=t.n(n),c=t(96),s=t.n(c),u=t(324);a.default={namespace:"rule",state:{data:{list:[],pagination:{}}},effects:{fetch:s.a.mark(function e(a,t){var n,r,c,p;return s.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return n=a.payload,r=t.call,c=t.put,e.next=4,r(u.e,n);case 4:return p=e.sent,e.next=7,c({type:"save",payload:p});case 7:case"end":return e.stop()}},e,this)}),add:s.a.mark(function e(a,t){var n,r,c,p,o;return s.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return n=a.payload,r=a.callback,c=t.call,p=t.put,e.next=4,c(u.a,n);case 4:return o=e.sent,e.next=7,p({type:"save",payload:o});case 7:r&&r();case 8:case"end":return e.stop()}},e,this)}),remove:s.a.mark(function e(a,t){var n,r,c,p,o;return s.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return n=a.payload,r=a.callback,c=t.call,p=t.put,e.next=4,c(u.f,n);case 4:return o=e.sent,e.next=7,p({type:"save",payload:o});case 7:r&&r();case 8:case"end":return e.stop()}},e,this)})},reducers:{save:function(e,a){return r()({},e,{data:a.payload})}}}}});