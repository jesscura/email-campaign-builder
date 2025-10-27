"use strict";(()=>{var e={};e.id=810,e.ids=[810],e.modules={20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},92048:e=>{e.exports=require("fs")},32615:e=>{e.exports=require("http")},35240:e=>{e.exports=require("https")},55315:e=>{e.exports=require("path")},68621:e=>{e.exports=require("punycode")},76162:e=>{e.exports=require("stream")},17360:e=>{e.exports=require("url")},71568:e=>{e.exports=require("zlib")},22461:(e,r,t)=>{t.r(r),t.d(r,{originalPathname:()=>p,patchFetch:()=>x,requestAsyncStorage:()=>s,routeModule:()=>l,serverHooks:()=>j,staticGenerationAsyncStorage:()=>d});var o={};t.r(o),t.d(o,{POST:()=>u});var n=t(17370),m=t(35317),a=t(2579),i=t(26567),c=t(74037);async function u(e){let{campaign:r}=await e.json(),t=(0,c.T)(r),{html:o,errors:n}=(0,c.B)(t);return i.NextResponse.json({html:o,errors:n})}let l=new n.AppRouteRouteModule({definition:{kind:m.x.APP_ROUTE,page:"/api/render/route",pathname:"/api/render",filename:"route",bundlePath:"app/api/render/route"},resolvedPagePath:"/home/runner/work/email-builder/email-builder/apps/web/app/api/render/route.ts",nextConfigOutput:"standalone",userland:o}),{requestAsyncStorage:s,staticGenerationAsyncStorage:d,serverHooks:j}=l,p="/api/render/route";function x(){return(0,a.patchFetch)({serverHooks:j,staticGenerationAsyncStorage:d})}},74037:(e,r,t)=>{t.d(r,{T:()=>c,B:()=>u});let o=require("mjml");var n=t.n(o),m=t(95524),a=t.n(m);let i=`
  a { text-decoration: none; }
`;function c(e){let r=`
    <mj-head>
      <mj-attributes>
        <mj-all font-family="Inter, Arial" />
      </mj-attributes>
      <mj-title>${e.subject}</mj-title>
      <mj-preview>${e.preheader}</mj-preview>
    </mj-head>`,t=e.blocks.map(r=>(function(e,r){switch(e.type){case"text":return`<mj-section background-color="${r.backgroundColor}"><mj-column>
        <mj-text color="${r.textColor}" font-size="16px" line-height="1.5">${e.data.html}</mj-text>
      </mj-column></mj-section>`;case"image":return`<mj-section background-color="${r.backgroundColor}"><mj-column>
        <mj-image src="${e.data.src}" alt="${e.data.alt||""}" padding="0px"></mj-image>
      </mj-column></mj-section>`;case"button":return`<mj-section background-color="${r.backgroundColor}"><mj-column>
        <mj-button href="${e.data.href}" background-color="${r.primaryColor}" color="#ffffff" font-size="16px" border-radius="6px" padding="16px">${e.data.label}</mj-button>
      </mj-column></mj-section>`;case"divider":return`<mj-section background-color="${r.backgroundColor}"><mj-column><mj-divider border-color="#e5e7eb"></mj-divider></mj-column></mj-section>`;case"spacer":return`<mj-section background-color="${r.backgroundColor}"><mj-column><mj-spacer height="${e.data.height}px" /></mj-column></mj-section>`;case"two_column":return`<mj-section background-color="${r.backgroundColor}">
        <mj-column><mj-text color="${r.textColor}" font-size="16px" line-height="1.5">${e.data.leftHtml}</mj-text></mj-column>
        <mj-column><mj-text color="${r.textColor}" font-size="16px" line-height="1.5">${e.data.rightHtml}</mj-text></mj-column>
      </mj-section>`;case"social":return`<mj-section background-color="${r.backgroundColor}"><mj-column>
        ${(e.data.links||[]).map(e=>`<mj-text><a href="${e.url}">${e.platform}</a></mj-text>`).join("")}
      </mj-column></mj-section>`}})(r,e.theme)).join("\n");return`<mjml>
    ${r}
    <mj-body background-color="${e.theme.backgroundColor}">
      <mj-section padding="0"><mj-column><mj-spacer height="16px"/></mj-column></mj-section>
      ${t}
      <mj-section padding="0"><mj-column><mj-spacer height="16px"/></mj-column></mj-section>
    </mj-body>
  </mjml>`}function u(e){let{html:r,errors:t}=n()(e,{minify:!0,keepComments:!1});return{html:a().inlineContent(r,i,{removeStyleTags:!1}),errors:t}}}};var r=require("../../../webpack-runtime.js");r.C(e);var t=e=>r(r.s=e),o=r.X(0,[910,145,524],()=>t(22461));module.exports=o})();