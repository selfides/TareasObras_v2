import{a as vt,b as gt}from"./chunk-JFRKY534.js";import{e as Y,f as mt}from"./chunk-OS4IJJGC.js";import{Ca as ft,Da as X,Fa as ht,Ha as k,L as bt,R as ut,S as pt,T as L,Z as U,ba as F,da as G,j as rt,n as lt,na as J,q as $,sa as dt,t as j,y as ct}from"./chunk-WGUKE3IX.js";import{$a as y,$b as st,Db as it,Fb as at,Ga as M,J as B,Ja as g,K as O,Ka as et,L as Z,Na as m,Oa as nt,Pa as p,Q as l,Va as c,W as P,Wa as A,X as V,Xb as C,Ya as _,Yb as ot,Z as h,_b as r,db as I,eb as N,fb as S,ga as d,ha as tt,ib as W,ja as R,jb as H,nb as D,ob as f,pb as T,qb as w,rb as Q,sb as x,tb as b,ub as u,ya as v}from"./chunk-BZGD74QT.js";var z="/api",_t=class e{http=l(ct);getAll(){return this.http.get(`${z}/categoriasoperario`)}create(s){return this.http.post(`${z}/categoriasoperario`,s)}update(s,t){return this.http.put(`${z}/categoriasoperario/${s}`,t)}delete(s){return this.http.delete(`${z}/categoriasoperario/${s}`)}static \u0275fac=function(t){return new(t||e)};static \u0275prov=O({token:e,factory:e.\u0275fac,providedIn:"root"})};var xt=["previcon"],Ct=["nexticon"],$t=["content"],kt=["prevButton"],Bt=["nextButton"],It=["inkbar"],Dt=["tabs"],E=["*"],Lt=e=>({"p-tablist-viewport":e});function Ft(e,s){e&1&&W(0)}function Et(e,s){if(e&1&&p(0,Ft,1,0,"ng-container",11),e&2){let t=f(2);A("ngTemplateOutlet",t.prevIconTemplate||t._prevIconTemplate)}}function Ot(e,s){e&1&&S(0,"ChevronLeftIcon")}function Pt(e,s){if(e&1){let t=H();I(0,"button",10,3),D("click",function(){P(t);let n=f();return V(n.onPrevButtonClick())}),p(2,Et,1,1,"ng-container")(3,Ot,1,0,"ChevronLeftIcon"),N()}if(e&2){let t=f();c("aria-label",t.prevButtonAriaLabel)("tabindex",t.tabindex())("data-pc-group-section","navigator"),v(2),y(t.prevIconTemplate||t._prevIconTemplate?2:3)}}function Vt(e,s){e&1&&W(0)}function Rt(e,s){if(e&1&&p(0,Vt,1,0,"ng-container",11),e&2){let t=f(2);A("ngTemplateOutlet",t.nextIconTemplate||t._nextIconTemplate)}}function Mt(e,s){e&1&&S(0,"ChevronRightIcon")}function At(e,s){if(e&1){let t=H();I(0,"button",12,4),D("click",function(){P(t);let n=f();return V(n.onNextButtonClick())}),p(2,Rt,1,1,"ng-container")(3,Mt,1,0,"ChevronRightIcon"),N()}if(e&2){let t=f();c("aria-label",t.nextButtonAriaLabel)("tabindex",t.tabindex())("data-pc-group-section","navigator"),v(2),y(t.nextIconTemplate||t._nextIconTemplate?2:3)}}function Nt(e,s){e&1&&w(0)}var St=({dt:e})=>`
.p-tabs {
    display: flex;
    flex-direction: column;
}

.p-tablist {
    display: flex;
    position: relative;
}

.p-tabs-scrollable > .p-tablist {
    overflow: hidden;
}

.p-tablist-viewport {
    overflow-x: auto;
    overflow-y: hidden;
    scroll-behavior: smooth;
    scrollbar-width: none;
    overscroll-behavior: contain auto;
}

.p-tablist-viewport::-webkit-scrollbar {
    display: none;
}

.p-tablist-tab-list {
    position: relative;
    display: flex;
    background: ${e("tabs.tablist.background")};
    border-style: solid;
    border-color: ${e("tabs.tablist.border.color")};
    border-width: ${e("tabs.tablist.border.width")};
}

.p-tablist-content {
    flex-grow: 1;
}

.p-tablist-nav-button {
    all: unset;
    position: absolute !important;
    flex-shrink: 0;
    top: 0;
    z-index: 2;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${e("tabs.nav.button.background")};
    color: ${e("tabs.nav.button.color")};
    width: ${e("tabs.nav.button.width")};
    transition: color ${e("tabs.transition.duration")}, outline-color ${e("tabs.transition.duration")}, box-shadow ${e("tabs.transition.duration")};
    box-shadow: ${e("tabs.nav.button.shadow")};
    outline-color: transparent;
    cursor: pointer;
}

.p-tablist-nav-button:focus-visible {
    z-index: 1;
    box-shadow: ${e("tabs.nav.button.focus.ring.shadow")};
    outline: ${e("tabs.nav.button.focus.ring.width")} ${e("tabs.nav.button.focus.ring.style")} ${e("tabs.nav.button.focus.ring.color")};
    outline-offset: ${e("tabs.nav.button.focus.ring.offset")};
}

.p-tablist-nav-button:hover {
    color: ${e("tabs.nav.button.hover.color")};
}

.p-tablist-prev-button {
    left: 0;
}

.p-tablist-next-button {
    right: 0;
}

.p-tab {
    display: flex;
    align-items: center;
    flex-shrink: 0;
    cursor: pointer;
    user-select: none;
    position: relative;
    border-style: solid;
    white-space: nowrap;
    gap: ${e("tabs.tab.gap")};
    background: ${e("tabs.tab.background")};
    border-width: ${e("tabs.tab.border.width")};
    border-color: ${e("tabs.tab.border.color")};
    color: ${e("tabs.tab.color")};
    padding: ${e("tabs.tab.padding")};
    font-weight: ${e("tabs.tab.font.weight")};
    transition: background ${e("tabs.transition.duration")}, border-color ${e("tabs.transition.duration")}, color ${e("tabs.transition.duration")}, outline-color ${e("tabs.transition.duration")}, box-shadow ${e("tabs.transition.duration")};
    margin: ${e("tabs.tab.margin")};
    outline-color: transparent;
}

.p-tab:not(.p-disabled):focus-visible {
    z-index: 1;
    box-shadow: ${e("tabs.tab.focus.ring.shadow")};
    outline: ${e("tabs.tab.focus.ring.width")} ${e("tabs.tab.focus.ring.style")} ${e("tabs.tab.focus.ring.color")};
    outline-offset: ${e("tabs.tab.focus.ring.offset")};
}

.p-tab:not(.p-tab-active):not(.p-disabled):hover {
    background: ${e("tabs.tab.hover.background")};
    border-color: ${e("tabs.tab.hover.border.color")};
    color: ${e("tabs.tab.hover.color")};
}

.p-tab-active {
    background: ${e("tabs.tab.active.background")};
    border-color: ${e("tabs.tab.active.border.color")};
    color: ${e("tabs.tab.active.color")};
}

.p-tabpanels {
    background: ${e("tabs.tabpanel.background")};
    color: ${e("tabs.tabpanel.color")};
    padding: ${e("tabs.tabpanel.padding")};
    outline: 0 none;
}

.p-tabpanel:focus-visible {
    box-shadow: ${e("tabs.tabpanel.focus.ring.shadow")};
    outline: ${e("tabs.tabpanel.focus.ring.width")} ${e("tabs.tabpanel.focus.ring.style")} ${e("tabs.tabpanel.focus.ring.color")};
    outline-offset: ${e("tabs.tabpanel.focus.ring.offset")};
}

.p-tablist-active-bar {
    z-index: 1;
    display: block;
    position: absolute;
    bottom: ${e("tabs.active.bar.bottom")};
    height: ${e("tabs.active.bar.height")};
    background: ${e("tabs.active.bar.background")};
    transition: 250ms cubic-bezier(0.35, 0, 0.25, 1);
}
`,Ht={root:({props:e})=>["p-tabs p-component",{"p-tabs-scrollable":e.scrollable}]},yt=(()=>{class e extends ht{name="tabs";theme=St;classes=Ht;static \u0275fac=(()=>{let t;return function(n){return(t||(t=h(e)))(n||e)}})();static \u0275prov=O({token:e,factory:e.\u0275fac})}return e})();var Tt=(()=>{class e extends k{prevIconTemplate;nextIconTemplate;templates;content;prevButton;nextButton;inkbar;tabs;pcTabs=l(B(()=>K));isPrevButtonEnabled=R(!1);isNextButtonEnabled=R(!1);resizeObserver;showNavigators=r(()=>this.pcTabs.showNavigators());tabindex=r(()=>this.pcTabs.tabindex());scrollable=r(()=>this.pcTabs.scrollable());constructor(){super(),st(()=>{this.pcTabs.value(),j(this.platformId)&&setTimeout(()=>{this.updateInkBar()})})}get prevButtonAriaLabel(){return this.config.translation.aria.previous}get nextButtonAriaLabel(){return this.config.translation.aria.next}ngAfterViewInit(){super.ngAfterViewInit(),this.showNavigators()&&j(this.platformId)&&(this.updateButtonState(),this.bindResizeObserver())}_prevIconTemplate;_nextIconTemplate;ngAfterContentInit(){this.templates.forEach(t=>{switch(t.getType()){case"previcon":this._prevIconTemplate=t.template;break;case"nexticon":this._nextIconTemplate=t.template;break}})}ngOnDestroy(){this.unbindResizeObserver(),super.ngOnDestroy()}onScroll(t){this.showNavigators()&&this.updateButtonState(),t.preventDefault()}onPrevButtonClick(){let t=this.content.nativeElement,i=F(t),n=Math.abs(t.scrollLeft)-i,a=n<=0?0:n;t.scrollLeft=G(t)?-1*a:a}onNextButtonClick(){let t=this.content.nativeElement,i=F(t)-this.getVisibleButtonWidths(),n=t.scrollLeft+i,a=t.scrollWidth-i,o=n>=a?a:n;t.scrollLeft=G(t)?-1*o:o}updateButtonState(){let t=this.content?.nativeElement,i=this.el?.nativeElement,{scrollWidth:n,offsetWidth:a}=t,o=Math.abs(t.scrollLeft),q=F(t);this.isPrevButtonEnabled.set(o!==0),this.isNextButtonEnabled.set(i.offsetWidth>=a&&o!==n-q)}updateInkBar(){let t=this.content?.nativeElement,i=this.inkbar?.nativeElement,n=this.tabs?.nativeElement,a=ut(t,'[data-pc-name="tab"][data-p-active="true"]');i&&(i.style.width=bt(a)+"px",i.style.left=U(a).left-U(n).left+"px")}getVisibleButtonWidths(){let t=this.prevButton?.nativeElement,i=this.nextButton?.nativeElement;return[t,i].reduce((n,a)=>a?n+F(a):n,0)}bindResizeObserver(){this.resizeObserver=new ResizeObserver(()=>this.updateButtonState()),this.resizeObserver.observe(this.el.nativeElement)}unbindResizeObserver(){this.resizeObserver&&(this.resizeObserver.unobserve(this.el.nativeElement),this.resizeObserver=null)}static \u0275fac=function(i){return new(i||e)};static \u0275cmp=g({type:e,selectors:[["p-tablist"]],contentQueries:function(i,n,a){if(i&1&&(Q(a,xt,4),Q(a,Ct,4),Q(a,ft,4)),i&2){let o;b(o=u())&&(n.prevIconTemplate=o.first),b(o=u())&&(n.nextIconTemplate=o.first),b(o=u())&&(n.templates=o)}},viewQuery:function(i,n){if(i&1&&(x($t,5),x(kt,5),x(Bt,5),x(It,5),x(Dt,5)),i&2){let a;b(a=u())&&(n.content=a.first),b(a=u())&&(n.prevButton=a.first),b(a=u())&&(n.nextButton=a.first),b(a=u())&&(n.inkbar=a.first),b(a=u())&&(n.tabs=a.first)}},hostVars:5,hostBindings:function(i,n){i&2&&(c("data-pc-name","tablist"),_("p-tablist",!0)("p-component",!0))},features:[m],ngContentSelectors:E,decls:9,vars:6,consts:[["content",""],["tabs",""],["inkbar",""],["prevButton",""],["nextButton",""],["type","button","pRipple","",1,"p-tablist-nav-button","p-tablist-prev-button"],[1,"p-tablist-content",3,"scroll","ngClass"],["role","tablist",1,"p-tablist-tab-list"],["role","presentation",1,"p-tablist-active-bar"],["type","button","pRipple","",1,"p-tablist-nav-button","p-tablist-next-button"],["type","button","pRipple","",1,"p-tablist-nav-button","p-tablist-prev-button",3,"click"],[4,"ngTemplateOutlet"],["type","button","pRipple","",1,"p-tablist-nav-button","p-tablist-next-button",3,"click"]],template:function(i,n){if(i&1){let a=H();T(),p(0,Pt,4,4,"button",5),I(1,"div",6,0),D("scroll",function(q){return P(a),V(n.onScroll(q))}),I(3,"div",7,1),w(5),S(6,"span",8,2),N()(),p(8,At,4,4,"button",9)}i&2&&(y(n.showNavigators()&&n.isPrevButtonEnabled()?0:-1),v(),A("ngClass",at(4,Lt,n.scrollable())),v(5),c("data-pc-section","inkbar"),v(2),y(n.showNavigators()&&n.isNextButtonEnabled()?8:-1))},dependencies:[$,rt,lt,vt,gt,mt,Y,X],encapsulation:2,changeDetection:0})}return e})(),Qt=(()=>{class e extends k{value=M();disabled=d(!1,{transform:C});pcTabs=l(B(()=>K));pcTabList=l(B(()=>Tt));el=l(tt);ripple=r(()=>this.config.ripple());id=r(()=>`${this.pcTabs.id()}_tab_${this.value()}`);ariaControls=r(()=>`${this.pcTabs.id()}_tabpanel_${this.value()}`);active=r(()=>J(this.pcTabs.value(),this.value()));tabindex=r(()=>this.active()?this.pcTabs.tabindex():-1);mutationObserver;onFocus(t){this.pcTabs.selectOnFocus()&&this.changeActiveValue()}onClick(t){this.changeActiveValue()}onKeyDown(t){switch(t.code){case"ArrowRight":this.onArrowRightKey(t);break;case"ArrowLeft":this.onArrowLeftKey(t);break;case"Home":this.onHomeKey(t);break;case"End":this.onEndKey(t);break;case"PageDown":this.onPageDownKey(t);break;case"PageUp":this.onPageUpKey(t);break;case"Enter":case"NumpadEnter":case"Space":this.onEnterKey(t);break;default:break}t.stopPropagation()}ngAfterViewInit(){super.ngAfterViewInit(),this.bindMutationObserver()}onArrowRightKey(t){let i=this.findNextTab(t.currentTarget);i?this.changeFocusedTab(t,i):this.onHomeKey(t),t.preventDefault()}onArrowLeftKey(t){let i=this.findPrevTab(t.currentTarget);i?this.changeFocusedTab(t,i):this.onEndKey(t),t.preventDefault()}onHomeKey(t){let i=this.findFirstTab();this.changeFocusedTab(t,i),t.preventDefault()}onEndKey(t){let i=this.findLastTab();this.changeFocusedTab(t,i),t.preventDefault()}onPageDownKey(t){this.scrollInView(this.findLastTab()),t.preventDefault()}onPageUpKey(t){this.scrollInView(this.findFirstTab()),t.preventDefault()}onEnterKey(t){this.changeActiveValue(),t.preventDefault()}findNextTab(t,i=!1){let n=i?t:t.nextElementSibling;return n?L(n,"data-p-disabled")||L(n,"data-pc-section")==="inkbar"?this.findNextTab(n):n:null}findPrevTab(t,i=!1){let n=i?t:t.previousElementSibling;return n?L(n,"data-p-disabled")||L(n,"data-pc-section")==="inkbar"?this.findPrevTab(n):n:null}findFirstTab(){return this.findNextTab(this.pcTabList?.tabs?.nativeElement?.firstElementChild,!0)}findLastTab(){return this.findPrevTab(this.pcTabList?.tabs?.nativeElement?.lastElementChild,!0)}changeActiveValue(){this.pcTabs.updateValue(this.value())}changeFocusedTab(t,i){pt(i),this.scrollInView(i)}scrollInView(t){t?.scrollIntoView?.({block:"nearest"})}bindMutationObserver(){j(this.platformId)&&(this.mutationObserver=new MutationObserver(t=>{t.forEach(()=>{this.active()&&this.pcTabList?.updateInkBar()})}),this.mutationObserver.observe(this.el.nativeElement,{childList:!0,characterData:!0,subtree:!0}))}unbindMutationObserver(){this.mutationObserver.disconnect()}ngOnDestroy(){this.mutationObserver&&this.unbindMutationObserver(),super.ngOnDestroy()}static \u0275fac=(()=>{let t;return function(n){return(t||(t=h(e)))(n||e)}})();static \u0275cmp=g({type:e,selectors:[["p-tab"]],hostVars:16,hostBindings:function(i,n){i&1&&D("focus",function(o){return n.onFocus(o)})("click",function(o){return n.onClick(o)})("keydown",function(o){return n.onKeyDown(o)}),i&2&&(c("data-pc-name","tab")("id",n.id())("aria-controls",n.ariaControls())("role","tab")("aria-selected",n.active())("data-p-disabled",n.disabled())("data-p-active",n.active())("tabindex",n.tabindex()),_("p-tab",!0)("p-tab-active",n.active())("p-disabled",n.disabled())("p-component",!0))},inputs:{value:[1,"value"],disabled:[1,"disabled"]},outputs:{value:"valueChange"},features:[nt([Y]),m],ngContentSelectors:E,decls:1,vars:0,template:function(i,n){i&1&&(T(),w(0))},dependencies:[$,X],encapsulation:2,changeDetection:0})}return e})(),jt=(()=>{class e extends k{pcTabs=l(B(()=>K));value=M(void 0);id=r(()=>`${this.pcTabs.id()}_tabpanel_${this.value()}`);ariaLabelledby=r(()=>`${this.pcTabs.id()}_tab_${this.value()}`);active=r(()=>J(this.pcTabs.value(),this.value()));static \u0275fac=(()=>{let t;return function(n){return(t||(t=h(e)))(n||e)}})();static \u0275cmp=g({type:e,selectors:[["p-tabpanel"]],hostVars:9,hostBindings:function(i,n){i&2&&(c("data-pc-name","tabpanel")("id",n.id())("role","tabpanel")("aria-labelledby",n.ariaLabelledby())("data-p-active",n.active()),_("p-tabpanel",!0)("p-component",!0))},inputs:{value:[1,"value"]},outputs:{value:"valueChange"},features:[m],ngContentSelectors:E,decls:1,vars:1,template:function(i,n){i&1&&(T(),p(0,Nt,1,0)),i&2&&y(n.active()?0:-1)},dependencies:[$],encapsulation:2,changeDetection:0})}return e})(),zt=(()=>{class e extends k{static \u0275fac=(()=>{let t;return function(n){return(t||(t=h(e)))(n||e)}})();static \u0275cmp=g({type:e,selectors:[["p-tabpanels"]],hostVars:6,hostBindings:function(i,n){i&2&&(c("data-pc-name","tabpanels")("role","presentation"),_("p-tabpanels",!0)("p-component",!0))},features:[m],ngContentSelectors:E,decls:1,vars:0,template:function(i,n){i&1&&(T(),w(0))},dependencies:[$],encapsulation:2,changeDetection:0})}return e})(),K=(()=>{class e extends k{value=M(void 0);scrollable=d(!1,{transform:C});lazy=d(!1,{transform:C});selectOnFocus=d(!1,{transform:C});showNavigators=d(!0,{transform:C});tabindex=d(0,{transform:ot});id=R(dt("pn_id_"));_componentStyle=l(yt);updateValue(t){this.value.update(()=>t)}static \u0275fac=(()=>{let t;return function(n){return(t||(t=h(e)))(n||e)}})();static \u0275cmp=g({type:e,selectors:[["p-tabs"]],hostVars:8,hostBindings:function(i,n){i&2&&(c("data-pc-name","tabs")("id",n.id()),_("p-tabs",!0)("p-tabs-scrollable",n.scrollable())("p-component",!0))},inputs:{value:[1,"value"],scrollable:[1,"scrollable"],lazy:[1,"lazy"],selectOnFocus:[1,"selectOnFocus"],showNavigators:[1,"showNavigators"],tabindex:[1,"tabindex"]},outputs:{value:"valueChange"},features:[it([yt]),m],ngContentSelectors:E,decls:1,vars:0,template:function(i,n){i&1&&(T(),w(0))},dependencies:[$],encapsulation:2,changeDetection:0})}return e})(),he=(()=>{class e{static \u0275fac=function(i){return new(i||e)};static \u0275mod=et({type:e});static \u0275inj=Z({imports:[K,zt,jt,Tt,Qt]})}return e})();export{_t as a,Tt as b,Qt as c,jt as d,zt as e,K as f,he as g};
