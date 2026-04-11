import{a as Y}from"./chunk-S3KZHQPI.js";import{a as X}from"./chunk-WCH5PNIR.js";import{a as te,b as ae}from"./chunk-ULJ77Y3S.js";import"./chunk-U3TPF22P.js";import{b as ee}from"./chunk-4DFKC72L.js";import"./chunk-P4K4FSDJ.js";import{d as J,f as K,g as Q}from"./chunk-ASSQJ4PB.js";import{Ea as y,Ga as W,Ja as Z,j as q,l as G,q as _}from"./chunk-363FN62Q.js";import{$a as B,Ab as m,Bb as f,Hb as U,Ib as H,K as T,Ka as h,L as z,La as F,Oa as L,Q as v,Qa as u,Tb as I,W as $,X as M,Ya as S,Z as k,Za as p,ab as x,bb as d,cb as b,da as j,eb as N,fb as O,gb as r,hb as l,ib as c,ka as A,mb as P,rb as g,sb as s,tb as R,ub as V,wa as D,za as o,zb as w}from"./chunk-GMCVL5JR.js";import"./chunk-4CLCTAJ7.js";var le=["*"];function se(e,n){if(e&1&&(r(0,"span",3),m(1),l()),e&2){let t=s();o(),f(t.label)}}function ce(e,n){if(e&1&&c(0,"span",5),e&2){let t=s(2);d(t.icon),p("ngClass","p-avatar-icon")}}function pe(e,n){if(e&1&&u(0,ce,1,3,"span",4),e&2){let t=s(),a=w(5);p("ngIf",t.icon)("ngIfElse",a)}}function me(e,n){if(e&1){let t=P();r(0,"img",7),g("error",function(i){$(t);let C=s(2);return M(C.imageError(i))}),l()}if(e&2){let t=s(2);p("src",t.image,D),S("aria-label",t.ariaLabel)}}function ue(e,n){if(e&1&&u(0,me,1,2,"img",6),e&2){let t=s();p("ngIf",t.image)}}var de=({dt:e})=>`
.p-avatar {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: ${e("avatar.width")};
    height: ${e("avatar.height")};
    font-size: ${e("avatar.font.size")};
    color: ${e("avatar.color")};
    background: ${e("avatar.background")};
    border-radius: ${e("avatar.border.radius")};
}

.p-avatar-image {
    background: transparent;
}

.p-avatar-circle {
    border-radius: 50%;
}

.p-avatar-circle img {
    border-radius: 50%;
}

.p-avatar-icon {
    font-size: ${e("avatar.icon.size")};
    width: ${e("avatar.icon.size")};
    height: ${e("avatar.icon.size")};
}

.p-avatar img {
    width: 100%;
    height: 100%;
}

.p-avatar-lg {
    width: ${e("avatar.lg.width")};
    height: ${e("avatar.lg.width")};
    font-size: ${e("avatar.lg.font.size")};
}

.p-avatar-lg .p-avatar-icon {
    font-size: ${e("avatar.lg.icon.size")};
    width: ${e("avatar.lg.icon.size")};
    height: ${e("avatar.lg.icon.size")};
}

.p-avatar-xl {
    width: ${e("avatar.xl.width")};
    height: ${e("avatar.xl.width")};
    font-size: ${e("avatar.xl.font.size")};
}

.p-avatar-xl .p-avatar-icon {
    font-size: ${e("avatar.xl.font.size")};
    width: ${e("avatar.xl.icon.size")};
    height: ${e("avatar.xl.icon.size")};
}

.p-avatar-group {
    display: flex;
    align-items: center;
}

.p-avatar-group .p-avatar + .p-avatar {
    margin-inline-start: ${e("avatar.group.offset")};
}

.p-avatar-group .p-avatar {
    border: 2px solid ${e("avatar.group.border.color")};
}

.p-avatar-group .p-avatar-lg + .p-avatar-lg {
    margin-inline-start: ${e("avatar.lg.group.offset")};
}

.p-avatar-group .p-avatar-xl + .p-avatar-xl {
    margin-inline-start: ${e("avatar.xl.group.offset")};
}
`,fe={root:({props:e})=>["p-avatar p-component",{"p-avatar-image":e.image!=null,"p-avatar-circle":e.shape==="circle","p-avatar-lg":e.size==="large","p-avatar-xl":e.size==="xlarge"}],label:"p-avatar-label",icon:"p-avatar-icon"},ie=(()=>{class e extends W{name="avatar";theme=de;classes=fe;static \u0275fac=(()=>{let t;return function(i){return(t||(t=k(e)))(i||e)}})();static \u0275prov=T({token:e,factory:e.\u0275fac})}return e})();var E=(()=>{class e extends Z{label;icon;image;size="normal";shape="square";style;styleClass;ariaLabel;ariaLabelledBy;onImageError=new j;_componentStyle=v(ie);imageError(t){this.onImageError.emit(t)}get hostClass(){return this.styleClass}static \u0275fac=(()=>{let t;return function(i){return(t||(t=k(e)))(i||e)}})();static \u0275cmp=h({type:e,selectors:[["p-avatar"]],hostVars:19,hostBindings:function(a,i){a&2&&(S("data-pc-name","avatar")("aria-label",i.ariaLabel)("aria-labelledby",i.ariaLabelledBy),x(i.style),d(i.hostClass),B("p-avatar",!0)("p-component",!0)("p-avatar-circle",i.shape==="circle")("p-avatar-lg",i.size==="large")("p-avatar-xl",i.size==="xlarge")("p-avatar-image",i.image!=null))},inputs:{label:"label",icon:"icon",image:"image",size:"size",shape:"shape",style:"style",styleClass:"styleClass",ariaLabel:"ariaLabel",ariaLabelledBy:"ariaLabelledBy"},outputs:{onImageError:"onImageError"},features:[U([ie]),L],ngContentSelectors:le,decls:6,vars:2,consts:[["iconTemplate",""],["imageTemplate",""],["class","p-avatar-text",4,"ngIf","ngIfElse"],[1,"p-avatar-text"],[3,"class","ngClass",4,"ngIf","ngIfElse"],[3,"ngClass"],[3,"src","error",4,"ngIf"],[3,"error","src"]],template:function(a,i){if(a&1&&(R(),V(0),u(1,se,2,1,"span",2)(2,pe,1,2,"ng-template",null,0,I)(4,ue,1,1,"ng-template",null,1,I)),a&2){let C=w(3);o(),p("ngIf",i.label)("ngIfElse",C)}},dependencies:[_,q,G,y],encapsulation:2,changeDetection:0})}return e})(),re=(()=>{class e{static \u0275fac=function(a){return new(a||e)};static \u0275mod=F({type:e});static \u0275inj=z({imports:[E,y,y]})}return e})();var ve=()=>({"background-color":"#3b82f6",color:"#fff"}),he=(e,n)=>n.route;function xe(e,n){e&1&&(r(0,"span",4),m(1,"TareasObras"),l())}function be(e,n){if(e&1&&(r(0,"span",19),m(1),l()),e&2){let t=s().$implicit;o(),f(t.label)}}function _e(e,n){if(e&1&&(r(0,"a",6),c(1,"i"),u(2,be,2,1,"span",19),l()),e&2){let t=n.$implicit,a=s();p("routerLink",t.route)("pTooltip",a.collapsed()?t.label:""),o(),d(t.icon+" text-base w-4 flex-shrink-0"),o(),b(a.collapsed()?-1:2)}}function ye(e,n){if(e&1&&(r(0,"div",8),c(1,"p-avatar",20),r(2,"div",21)(3,"p",22),m(4),l(),r(5,"p",23),m(6),l()()()),e&2){let t,a,i=s();o(),x(H(5,ve)),p("label",i.userInitials()),o(3),f((t=i.auth.user())==null?null:t.nombreCompleto),o(2),f((a=i.auth.user())==null?null:a.rol)}}var ne=class e{auth=v(X);theme=v(Y);collapsed=A(!1);navItems=[{label:"Dashboard",icon:"pi pi-chart-bar",route:"/dashboard"},{label:"Obras",icon:"pi pi-building",route:"/obras"},{label:"Diario Obra",icon:"pi pi-id-card",route:"/partes-trabajo"},{label:"Tareas",icon:"pi pi-list-check",route:"/tareas"},{label:"Materiales",icon:"pi pi-box",route:"/materiales"},{label:"Proveedores",icon:"pi pi-truck",route:"/proveedores",roles:["Admin","Supervisor"]},{label:"Usuarios",icon:"pi pi-users",route:"/usuarios",roles:["Admin"]},{label:"Operarios",icon:"pi pi-id-card",route:"/operarios",roles:["Admin","Supervisor"]}];visibleNav(){return this.navItems.filter(n=>!n.roles||n.roles.includes(this.auth.user()?.rol??""))}userInitials(){return(this.auth.user()?.nombreCompleto??"").split(" ").map(t=>t[0]).slice(0,2).join("").toUpperCase()}toggleCollapse(){this.collapsed.set(!this.collapsed())}toggleTheme(){this.theme.toggle()}logout(){this.auth.logout()}static \u0275fac=function(t){return new(t||e)};static \u0275cmp=h({type:e,selectors:[["app-shell"]],decls:26,vars:9,consts:[[1,"flex","h-screen","overflow-hidden","bg-surface-50","dark:bg-surface-950"],[1,"flex","items-center","gap-3","px-4","py-5","border-b","border-surface-200","dark:border-surface-700"],[1,"w-8","h-8","rounded-lg","bg-primary-600","flex","items-center","justify-center","flex-shrink-0"],[1,"pi","pi-building","text-white","text-sm"],[1,"font-bold","text-surface-900","dark:text-surface-100","text-lg","tracking-tight"],[1,"flex-1","px-2","py-4","space-y-1","overflow-y-auto"],["routerLinkActive","bg-primary-50 dark:bg-primary-950 text-primary-700 dark:text-primary-300","tooltipPosition","right",1,"flex","items-center","gap-3","px-3","py-2.5","rounded-lg","text-surface-600","dark:text-surface-400","hover:bg-surface-100","dark:hover:bg-surface-800","transition-colors",3,"routerLink","pTooltip"],[1,"border-t","border-surface-200","dark:border-surface-700","p-3","space-y-2"],[1,"flex","items-center","gap-3","px-2","py-2","rounded-lg"],[1,"w-full","flex","items-center","justify-center","p-2","rounded-lg","text-surface-500","hover:bg-surface-100","dark:hover:bg-surface-800","transition-colors",3,"click"],[1,"flex-1","flex","flex-col","overflow-hidden"],[1,"h-14","flex","items-center","justify-between","px-6","bg-white","dark:bg-surface-900","border-b","border-surface-200","dark:border-surface-700","flex-shrink-0"],[1,"text-sm","font-semibold","text-surface-700","dark:text-surface-300"],[1,"text-primary-600","dark:text-primary-400"],[1,"flex","items-center","gap-2"],[1,"w-9","h-9","flex","items-center","justify-center","rounded-lg","text-surface-600","dark:text-surface-400","hover:bg-surface-100","dark:hover:bg-surface-800","transition-colors",3,"click"],["pTooltip","Cerrar sesi\xF3n","tooltipPosition","left",1,"w-9","h-9","flex","items-center","justify-center","rounded-lg","text-surface-600","dark:text-surface-400","hover:bg-red-50","dark:hover:bg-red-950","hover:text-red-600","transition-colors",3,"click"],[1,"pi","pi-sign-out"],[1,"flex-1","overflow-y-auto","p-6"],[1,"text-sm","font-medium"],["styleClass","flex-shrink-0","size","normal","shape","circle",3,"label"],[1,"min-w-0"],[1,"text-sm","font-semibold","text-surface-900","dark:text-surface-100","truncate"],[1,"text-xs","text-surface-500","truncate"]],template:function(t,a){if(t&1&&(r(0,"div",0)(1,"aside")(2,"div",1)(3,"div",2),c(4,"i",3),l(),u(5,xe,2,0,"span",4),l(),r(6,"nav",5),N(7,_e,3,5,"a",6,he),l(),r(9,"div",7),u(10,ye,7,6,"div",8),r(11,"button",9),g("click",function(){return a.toggleCollapse()}),c(12,"i"),l()()(),r(13,"div",10)(14,"header",11)(15,"h1",12),m(16," Bienvenido, "),r(17,"span",13),m(18),l()(),r(19,"div",14)(20,"button",15),g("click",function(){return a.toggleTheme()}),c(21,"i"),l(),r(22,"button",16),g("click",function(){return a.logout()}),c(23,"i",17),l()()(),r(24,"main",18),c(25,"router-outlet"),l()()()),t&2){let i;o(),d((a.collapsed()?"w-16":"w-64")+" flex flex-col h-full bg-white dark:bg-surface-900 border-r border-surface-200 dark:border-surface-700 transition-all duration-300 z-20"),o(4),b(a.collapsed()?-1:5),o(2),O(a.visibleNav()),o(3),b(a.collapsed()?-1:10),o(2),d(a.collapsed()?"pi pi-chevron-right":"pi pi-chevron-left"),o(6),f((i=a.auth.user())==null?null:i.nombreCompleto),o(3),d(a.theme.isDark()?"pi pi-sun":"pi pi-moon")}},dependencies:[J,K,Q,ee,ae,te,re,E,_],encapsulation:2})};export{ne as ShellComponent};
