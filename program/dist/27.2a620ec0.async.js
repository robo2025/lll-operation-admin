webpackJsonp([27],{682:function(e,a,t){"use strict";Object.defineProperty(a,"__esModule",{value:!0});var n=t(42),r=t.n(n),s=t(96),c=t.n(s),i=t(324);a.default={namespace:"activities",state:{list:[],loading:!0},effects:{fetchList:c.a.mark(function e(a,t){var n,r,s;return c.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return n=t.call,r=t.put,e.next=3,r({type:"changeLoading",payload:!0});case 3:return e.next=5,n(i.c);case 5:return s=e.sent,e.next=8,r({type:"saveList",payload:Array.isArray(s)?s:[]});case 8:return e.next=10,r({type:"changeLoading",payload:!1});case 10:case"end":return e.stop()}},e,this)})},reducers:{saveList:function(e,a){return r()({},e,{list:a.payload})},changeLoading:function(e,a){return r()({},e,{loading:a.payload})}}}}});