import{d as m,D as y,a as v,g as e,b as t,e as w,F as n,G as c,X as u,t as _,h as B,s as f}from"./index-3d120acd.js";const k={class:"base-table"},g={class:"base-table-header"},x={class:"base-table-body"},D=m({__name:"BaseTable",props:{columns:{},data:{}},setup(b){const r=b,p=y(()=>r.data.map(a=>r.columns.map(l=>({content:a[l.dataIndex],width:l.width}))));return(a,l)=>{const d=v("autoscroll");return e(),t("div",k,[w("ul",g,[(e(!0),t(n,null,c(a.columns,(s,o)=>(e(),t("li",{key:o,class:"base-table-header-column",style:u({width:s.width})},_(s.title),5))),128))]),B((e(),t("div",x,[(e(!0),t(n,null,c(p.value,(s,o)=>(e(),t("ul",{key:o,class:"base-table-body-row"},[(e(!0),t(n,null,c(s,(i,h)=>(e(),t("li",{key:h,class:"base-table-body-column",style:u({width:i.width})},_(i.content),5))),128))]))),128))])),[[d,20]])])}}});const T=f(D,[["__scopeId","data-v-19ed4d2b"]]);export{T as default};
