import{d as j,u as w,r as x,s as C,a as S,o as V,b as n,c as i,w as t,_ as J,e as m,f,g as r,h as R,i as y,t as c,j as k,k as q,B as M,l as P}from"./index-CSmqUZEd.js";import{u as T,_ as $}from"./DisplayNameForm.vue_vue_type_script_setup_true_lang-F_wFxm2o.js";import"./CheckmarkOutline-D2H_k4ke.js";import"./FormItem-SDgVF96q.js";const z=q("p",null,"Jou are invited to join",-1),A={key:0,"data-testid":"text-presentation-presenter"},D={key:1,"data-testid":"text-presentation-description"},K=j({__name:"JoinView",setup(E){var d,p,_;const s=w(),o=(p=(d=s.currentRoute.value)==null?void 0:d.query.code)==null?void 0:p.toString(),u=(_=s.currentRoute.value)==null?void 0:_.query.presenter,e=x(null),{displayName:h}=C(S()),{peekPresentation:v,join:b}=T();V(async()=>{if(o){const a=await v(o);a&&(e.value=a)}});async function B(){e.value&&o&&(await b(o),s.push("/feedback"))}return(a,U)=>{const N=M,l=P,g=J;return n(),i(g,{size:"large",vertical:""},{default:t(()=>[e.value?(n(),i(l,{key:0,title:e.value.title||"an untitled presentation",embedded:"","data-testid":"text-presentation-title"},{header:t(()=>[z]),action:t(()=>[m($),m(N,{disabled:!r(h),primary:"",type:"primary",onClick:R(B,["prevent"]),"data-testid":"button-join"},{default:t(()=>[f("Join!")]),_:1},8,["disabled"])]),default:t(()=>[r(u)?(n(),y("h3",A,"by "+c(r(u)),1)):k("",!0),e.value.description?(n(),y("p",D,c(e.value.description),1)):k("",!0)]),_:1},8,["title"])):(n(),i(l,{key:1},{default:t(()=>[f(c(a.$t("no_join_code_instructions")),1)]),_:1}))]),_:1})}}});export{K as default};