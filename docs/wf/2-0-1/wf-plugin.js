export class Carousel{constructor(){this.attCurrentSlide="data-current-slide",this.attPrevious='[data-id="previous"]',this.attNext='[data-id="next"]',this.cssCarouselList="carousel__list",this.cssCarouselListItem="carousel__item",this.cssCarouselController="carousel__controller",this.cssButton="carousel__controller-button",this.cssButtonActive=`${this.cssButton}--active`,this.cssDisplay="hide",this.cssTransition=".7s",this.elCarousel=document.querySelectorAll(".carousel"),this.counterCurrent=0,this.transition=5,this.isAutoplay=!0,this.interval=1e3,this.buildNavigationControllerClick=this.buildNavigationControllerClick.bind(this)}animate(t){const e="arrow"===t.from?t.target.parentNode.querySelector(`.${this.cssCarouselList}`):t.target.parentNode.parentNode.querySelector(`.${this.cssCarouselList}`),s=e.parentNode.getAttribute("data-style"),i=Number(e.querySelector(`.${this.cssCarouselListItem}`).offsetWidth),o=t.currentSlide,n=Number(o*i);"fade"!==s?this.animateSlide({elCarouselList:e,currentPosition:n}):this.animateFade({elCarouselList:e,currentPosition:n,currentSlide:o})}animateFade(t){const e=t.elCarouselList.querySelectorAll(`.${this.cssCarouselListItem}`),s=e[t.currentSlide];e.forEach((t=>{t.style.opacity=0,t.style.transition=this.cssTransition})),s.style.opacity=1,s.style.left=`-${t.currentPosition}px`,s.style.transition=this.cssTransition}animateSlide(t){t.elCarouselList.style.transform=`translateX(-${t.currentPosition}px)`}buildAutoplay(){this.isAutoplay&&(this.interval=setInterval(this.verifyInterval,this.interval),this.isAutoplay=!1)}buildLayout(){this.elCarousel.forEach((t=>{const e=t.querySelectorAll(`.${this.cssCarouselList} .${this.cssCarouselListItem}`).length,s=t.getAttribute("data-autoplay"),i=t.getAttribute(this.attCurrentSlide),o=t.querySelectorAll("img"),n=o.length>0;if("true"===s&&this.buildAutoplay(),this.resize(t),this.buildController(t,e),this.defineActive(t.querySelector(`[data-id="${i}"]`)),1===e&&(t.querySelector(this.attPrevious).classList.add(this.cssDisplay),t.querySelector(this.attNext).classList.add(this.cssDisplay),t.querySelector(`.${this.cssCarouselController}`).classList.add(this.cssDisplay)),n){const e=o[0].naturalWidth;t.style.maxWidth=`${e}px`}}))}buildController(t,e){const s=`button button--small button--small--proportional ${this.cssButton}`,i=t.querySelector(`.${this.cssCarouselController}`);let o="";for(let t=0;t<e;t++)o+=`<button type="button" class="${s}" data-id="${t}" aria-hidden="true"></button>`;i.innerHTML=o}buildNavigation(){this.elCarousel.forEach((t=>{this.buildNavigationController(t),this.buildNavigationLeft(t),this.buildNavigationRight(t)}))}buildNavigationController(t){t.querySelectorAll(`.${this.cssButton}`).forEach((t=>{wfpHelper.addClick(t,this.buildNavigationControllerClick)}))}buildNavigationControllerClick(t){const e=t.target,s=t.target.getAttribute("data-id");e.parentNode.parentNode.setAttribute(this.attCurrentSlide,s),this.defineActive(e),this.animate({currentSlide:e.getAttribute("data-id"),target:e,from:"navigation"})}buildNavigationArrow(t){t.button.onclick=()=>{const e=t.button.parentNode.parentNode,s=e.querySelector(`.${this.cssCarouselList}`),i=Number(s.querySelectorAll(`.${this.cssCarouselListItem}`).length),o=Number(e.getAttribute(this.attCurrentSlide));let n=0;n="previous"===t.side?0===o?i-1:o-1:o===i-1?0:o+1,e.setAttribute(this.attCurrentSlide,n),this.defineActive(e.querySelector(`[data-id="${n}"]`)),this.animate({currentSlide:n,target:s,from:"arrow"})}}buildNavigationLeft(t){const e=t.querySelector(this.attPrevious);this.buildNavigationArrow({button:e,side:"previous"})}buildNavigationRight(t){const e=t.querySelector(this.attNext);this.buildNavigationArrow({button:e,side:"next"})}defineActive(t){t.parentNode.parentNode.querySelectorAll(`.${this.cssButton}`).forEach((t=>{t.classList.remove(this.cssButtonActive)})),t.classList.add(this.cssButtonActive)}init(){this.elCarousel&&(this.buildLayout(),this.buildNavigation(),this.watchResize())}resize(t){const e=t.querySelector(`.${this.cssCarouselList}`),s=e.querySelectorAll(`.${this.cssCarouselListItem}`).length;e.style.width+=100*s+"%"}verifyInterval(){const t=window.wfpCarousel;t.counterCurrent++,t.counterCurrent>=t.transition&&(t.counterCurrent=0,t.elCarousel.forEach((e=>{const s=e.getAttribute("data-autoplay"),i=e.querySelector(t.attNext);"true"===s&&i.click()})))}watchResize(){window.addEventListener("resize",(()=>{this.elCarousel.forEach((t=>{this.watchResizeLoop(t)}))}),!0)}watchResizeLoop(t){const e=t.parentNode.parentNode.parentNode.parentNode,s=e.querySelector(`.${this.cssCarouselList}`);this.defineActive(e.querySelector('[data-id="0"]')),this.animate({currentSlide:0,target:s,from:"arrow"})}}export class Component{drawButton(t){const e=t.css?t.css:"",s=t.onclick?`onclick="${t.onclick}"`:"",i=t.label?t.label:"",o=t.ariaLabel?`aria-label="${t.ariaLabel}"`:"",n=t.icon?t.icon:"";return`\n            <button type="button" ${o} class="button ${e} button--${t.color?t.color:"grey"} button--${t.size?t.size:"regular"}" ${s}>\n                ${n}${i} \n            </button>\n        `}drawCloseButton(t){return t.size="extra-small",t.css=`button--${t.size} button--${t.size}--proportional button--transparent button--close`,t.ariaLabel=window?.wfpTranslation?.translation?.close?window?.wfpTranslation?.translation?.close:"close",t.icon=this.drawIcon({rotate:"45",size:"regular",icon:"plus"}),this.drawButton(t)}drawIcon(t){const e=t.rotate?`rotate-${t.rotate}`:"",s=t.color?`icon--${t.color}`:"",i=t.size?t.size:"regular",o=t.icon?t.icon:"";return`\n            <svg class="icon icon--${i} ${e} ${s}">\n                <use xlink:href="${wfpIconAddress+o}"></use>\n            </svg>\n        `}drawImage(t){const e=t.src?`src="${t.src}"`:"",s=t.title?`title="${t.title}"`:"",i=t.alt?`alt="${t.alt}"`:s,o=t.style?`style="${t.style}"`:"";return`<img ${e} ${t.css?`class="${t.css}"`:""} ${o} ${s} ${i}>`}drawModal(t){const e=t.size?t.size:"regular",s=t.content?t.content:"",i=t.color?t.color:"grey";return`\n            <div class="modal" style="z-index:${this.drawModalZIndex()}">\n                <div class="modal__box modal--${e} modal--${i}">\n                    ${s}\n                </div>\n            </div>\n        `}drawModalZIndex(){const t=wfpModal?.getElModal();let e=5;if(t.length>0){const s=t[0];e=Number(s.style.zIndex)+1}return e}drawModalContent(t){return`\n            <div class="row">\n                <div class="modal__content">\n                    ${t.content?t.content:""}\n                </div>\n            </div>\n        `}drawModalDresciption(t){const e=t.description;return e?`<p class="modal__description">${e}</p>`:""}drawModalFooter(t){return`\n            <footer class="button-wrapper modal__footer right">\n                ${t.content?t.content:""}\n            </footer>\n        `}drawModalHeader(t){return`\n            <header class="modal__header right">\n                ${this.drawCloseButton({onclick:t.onclick})}\n            </header>\n        `}drawModalNavigation(t){const e=t?.target;if(!e)return;const s=wfpGallery.currentGalleryItens,i=wfpGallery.currentGalleryIndex,o=0===i,n=s.length===i+1,r=this.drawIcon({size:"extra-big",icon:"previous",color:"white"}),l=this.drawIcon({rotate:"180",size:"extra-big",icon:"previous",color:"white"});return`\n            <div class="navigation-change button-wrapper row center">\n                ${this.drawButton({size:"big",ariaLabel:window.wfpTranslation.translation.previous,icon:r,css:o?"hide":"",onclick:"wfpGallery.handlePrevious();"})}\n                ${this.drawButton({size:"big",ariaLabel:window.wfpTranslation.translation.next,icon:l,css:n?"hide":"",onclick:"wfpGallery.handleNext();"})}\n            </div>\n        `}}export class Confirmation{draw(t){const e=t.buttonSize?t.buttonSize:"regular",s=t.title?`<h3>${t.title}</h3>`:"",i=t.content?`<p>${t.content}</p>`:"",o=wfpModal.getActionClose(),n=t.translationCancel?t.translationCancel:window.wfpTranslation.translation.cancel,r=t.translationConfirm?t.translationConfirm:window.wfpTranslation.translation.confirm,l=t.colorConfirm?t.colorConfirm:"blue",a=t.colorCancel?t.colorCancel:"grey",c=wfpComponent.drawButton({color:a,label:n,size:e,onclick:o}),d=wfpComponent.drawButton({color:l,label:r,size:e,onclick:`${t.onclick};${o}`}),u=wfpComponent.drawModalHeader({onclick:o}),h=wfpComponent.drawModalContent({content:s+i}),p=wfpComponent.drawModalFooter({content:c+d}),w=wfpComponent.drawModal({size:t.size,content:u+h+p});wfpModal.show(w)}open(t){this.draw(t)}}export class Form{validateEmpty(t){const e=t.length;for(let s=0;s<e;s++){const e=t[s];if(""===e.value)return e.focus(),!1}return!0}}export class Gallery{constructor(){this.currentGallery,this.currentGalleryItens,this.currentGalleryIndex,this.currentModal}draw(t){const e=t?.target?.getAttribute("data-target"),s=t?.target?.getAttribute("data-description"),i=wfpComponent.drawModalHeader({onclick:wfpModal.getActionClose()}),o=wfpComponent.drawModalNavigation(t),n=wfpComponent.drawModalDresciption({description:s}),r=wfpComponent.drawImage({style:"margin:auto;",css:"img-responsive",src:e}),l=wfpComponent.drawModalContent({content:r+n}),a=wfpComponent.drawModal({size:t?.size,color:t?.color,content:i+l+o});wfpModal.show(a)}open(t){const e=t?.target;this.currentGallery=e?.parentNode,this.currentGalleryItens=Array.from(this.currentGallery.querySelectorAll(".gallery__item")),this.currentGalleryIndex=this.currentGalleryItens.indexOf(e),this.draw(t)}handleChange(t){t&&(wfpModal.closeByKey(),t.click())}handleNext(){const t=this.currentGalleryItens[this.currentGalleryIndex+1];this.handleChange(t)}handlePrevious(){const t=this.currentGalleryItens[this.currentGalleryIndex-1];this.handleChange(t)}}export class Helper{constructor(){this.elBody=document.querySelector("body"),this.onkeypress()}addClass(t,e){if(t&&e)if(e instanceof Array)for(let s in e)t.classList.add(e[s]);else t.classList.add(e)}addClick(t,e){t&&this.addEvent({el:t,action:e,event:"click"})}addEvent(t){const e=t.action,s=t.el,i=t.event;s&&(s.removeEventListener(i,e),s.addEventListener(i,e))}ajax(t){return new Promise(((e,s)=>{const i=t.controller,o=t.kind?t.kind:"GET";let n=new XMLHttpRequest;n.open(o,i,!0),n.setRequestHeader("Content-type","application/x-www-form-urlencoded"),n.onload=()=>{n.status>=200&&n.status<300&&e(n.responseText),s(n.statusText)},n.onerror=()=>s(n.statusText),n.send()}))}capitalize(t){return t.charAt(0).toUpperCase()+t.slice(1)}getUrlParameter(t){const e=top.location.search.substring(1).split("&");for(let s=0;s<e.length;s++){let i=e[s].split("=");if(i[0]===t)return i[1]}}getUrlWord(t){return new RegExp("\\b"+t+"\\b","i").test(window.location.href)}offset(t){let e=t.getBoundingClientRect();const s=window.pageXOffset||document.documentElement.scrollLeft,i=window.pageYOffset||document.documentElement.scrollTop;return{top:e.top+i,left:e.left+s}}onkeypress(){window.addEventListener("keyup",(t=>{switch(t.key){case"Escape":wfpModal&&wfpModal.closeByKey();break;case"ArrowLeft":wfpGallery&&wfpGallery.handlePrevious();break;case"ArrowRight":wfpGallery&&wfpGallery.handleNext()}}))}removeClass(t,e){if(t&&e)if(e instanceof Array)for(let s in e)t.classList.contains(e[s])&&t.classList.remove(e[s]);else t.classList.contains(e)&&t.classList.remove(e)}verifyUrlRoute(t){return window.location.pathname.split("/").indexOf(t)>-1}wrapItem(t,e){const s=document.createElement("div");s.className=e,t.parentNode.insertBefore(s,t),s.appendChild(t)}}export class LazyLoad{constructor(){this.cssAttribute="data-lazy-load",this.cssData=`[${this.cssAttribute}="true"]`}addListener(){document.querySelector("body").addEventListener("scroll",(()=>{window.requestAnimationFrame((()=>{this.buildLoop()}))}))}buildLoop(){document.querySelectorAll(this.cssData).forEach((t=>{this.verifyPosition(t)}))}buildImage(t){const e=t.getAttribute("data-src");t.setAttribute("src",e),t.removeAttribute(this.cssAttribute)}init(){document.querySelector(this.cssData)&&(this.addListener(),this.buildLoop())}verifyPosition(t){window.scrollY>=window.wfpHelper.offset(t).top-window.outerHeight&&this.buildImage(t)}}export class LoadingMain{constructor(){this.cssHide="hide",this.cssAnimation="animate",this.elWrapper=document.querySelector(".loading-main"),this.elWrapper&&(this.elLoading=this.elWrapper.querySelector(".loading"))}hide(){this.elWrapper&&(this.elWrapper.classList.add(this.cssHide),this.elLoading.classList.remove(this.cssAnimation),wfpHelper.elBody.style.overflow="auto")}}export class Mask{constructor(){this.elMask=document.querySelectorAll("[data-mask]")}addListener(){this.elMask.forEach((t=>{this.addListenerLoop(t)}))}addListenerLoop(t){t.addEventListener("input",(e=>{const s=e.target.value,i=t.dataset.mask,o=wfpHelper.capitalize(i);e.target.value=this[`mask${o}`](s)}))}init(){this.elMask&&this.addListener()}maskCep(t){return t.replace(/\D/g,"").replace(/(\d{5})(\d)/,"$1-$2").replace(/(-\d{3})\d+?$/,"$1")}maskCpf(t){return t.replace(/\D/g,"").replace(/(\d{3})(\d)/,"$1.$2").replace(/(\d{3})(\d)/,"$1.$2").replace(/(\d{3})(\d{1,2})/,"$1-$2").replace(/(-\d{2})\d+?$/,"$1")}maskCnpj(t){return t.replace(/\D/g,"").replace(/(\d{2})(\d)/,"$1.$2").replace(/(\d{3})(\d)/,"$1.$2").replace(/(\d{3})(\d)/,"$1/$2").replace(/(\d{4})(\d)/,"$1-$2").replace(/(-\d{2})\d+?$/,"$1")}maskDate(t){return t.replace(/\D/g,"").replace(/(\d{2})(\d)/,"$1/$2").replace(/(\d{2})(\d)/,"$1/$2").replace(/(\d{4})(\d)/,"$1")}maskPhone(t){return t.replace(/\D/g,"").replace(/(\d{2})(\d)/,"($1) $2").replace(/(\d{4})(\d)/,"$1-$2").replace(/(\d{4})-(\d)(\d{4})/,"$1$2-$3").replace(/(-\d{4})\d+?$/,"$1")}maskPis(t){return t.replace(/\D/g,"").replace(/(\d{3})(\d)/,"$1.$2").replace(/(\d{5})(\d)/,"$1.$2").replace(/(\d{5}\.)(\d{2})(\d)/,"$1$2-$3").replace(/(-\d)\d+?$/,"$1")}}export class MenuDropDown{update(){this.isClickBuild=!1,this.classMenu="drop-down",this.classMenuText=`${this.classMenu}-text`,this.cssDropDownContent=`${this.classMenu}__content`,this.cssOpend=`${this.cssDropDownContent}--opened`,this.cssMobileShow="mobile-show",this.elMenu=document.querySelectorAll(`.${this.classMenu}, .${this.classMenuText}`),this.addClickAction=this.addClickAction.bind(this),this.close=this.close.bind(this)}addClick(){this.elMenu.forEach((t=>{const e=t.querySelectorAll(".button:first-child, .link:first-child")[0];wfpHelper.addClick(e,this.addClickAction)}))}addClickAction(t){const e=t.target.parentNode.querySelector(`.${this.cssDropDownContent}`);null!==e&&wfpHelper.addClass(e,this.cssOpend)}close(){const t=window.wfpMenuDropDown;"string"!==t.elMenu&&t.elMenu.forEach((e=>{const s=e.querySelector(`.${t.cssDropDownContent}`);null!==s&&wfpHelper.removeClass(s,this.cssOpend)}))}init(){this.update(),this.elMenu&&(this.isClickBuild||(this.isClickBuild=!0,this.addClick()),document.addEventListener("click",this.close,!0))}listener(t){const e=document.querySelectorAll(`.${window.wfpMenuDropDown.cssMobileShow}`);t.toElement.classList.contains("button")||t.toElement.classList.contains("link")||e.forEach((t=>{wfpHelper.removeClass(t,window.wfpMenuDropDown.cssMobileShow)}))}reset(){console.log("aqui"),document.removeEventListener("click",this.listener,!0),window.wfpMenuDropDown.init()}}export class MenuTab{constructor(){this.cssMenu="tab",this.cssMenuActive=`${this.cssMenu}--active`,this.cssAllButton=`.${this.cssMenu} > .button, .${this.cssMenu} > .drop-down > .button`}buildClick(){document.querySelectorAll(this.cssAllButton).forEach((t=>{t.addEventListener("click",(()=>{this.buildCss(t)}))}))}buildCss(t){(t.parentNode.classList.contains(this.cssMenu)?t.parentNode:t.parentNode.parentNode).querySelectorAll(this.cssAllButton).forEach((t=>{t.classList.remove(this.cssMenuActive)})),t.classList.add(this.cssMenuActive)}init(){this.el=document.querySelectorAll(`.${this.cssMenu}`),this.el&&this.buildClick()}}export class MenuToggle{constructor(){this.cssButton="toggle-menu",this.cssOpen="toggle-menu__open",this.isWatch=!1,this.handleClick=this.handleClick.bind(this)}buildMenu(){this.elButton.forEach((t=>{wfpHelper.addClick(t,this.handleClick)}))}handleClick(t){const e=t.target.nextElementSibling;e.classList.contains(this.cssOpen)?e.classList.remove(this.cssOpen):e.classList.add(this.cssOpen)}init(){this.update(),this.buildMenu(),this.isWatch||(this.isWatch=!0,this.watchResize())}update(){this.elButton=document.querySelectorAll(`.${this.cssButton}`)}reset(){this.init()}watchResize(){window.onresize=()=>{this.init()}}}export class Modal{constructor(){this.cssButtonClose="button--close"}close(t){t.parentNode.parentNode.parentNode.remove()}closeByKey(){const t=this.getElModal(),e=t.length,s=t[0],i=s?.querySelector(`.${this.cssButtonClose}`);e<1||i.click()}async draw(t){const e=t.title?`<h3>${t.title}</h3>`:"",s="ajax"===t.kind?await wfpHelper.ajax({controller:t.content}):t.content,i=wfpComponent.drawModalHeader({onclick:this.getActionClose()}),o=wfpComponent.drawModalContent({content:e+s}),n=wfpComponent.drawModal({size:t.size,content:i+o});this.show(n)}getActionClose(){return"wfpModal.close(this)"}getElModal(){return document.querySelectorAll(".modal")}async open(t){await this.draw(t),"undefined"!=typeof wfpMenuDropDown&&wfpMenuDropDown.reset(),"undefined"!=typeof wfpMenuToggle&&wfpMenuToggle.init(),"undefined"!=typeof wfpMenuTab&&wfpMenuTab.init(),"undefined"!=typeof wfpLazyLoad&&wfpLazyLoad.init()}show(t){wfpHelper.elBody.insertAdjacentHTML("afterbegin",t)}}export class Notification{constructor(){this.elBody=document.querySelector("body"),this.id="notification",this.colorDefault="grey",this.notificationId=0}add(t){if(!t.content)return;this.placeItem(t);const e=document.querySelector(`#${this.id+this.notificationId}`);this.remove(e,t.content.length),this.notificationId++}buildHtml(t){const e=t.id?`id="${this.id}_${t.id}"`:"",s=t.position?t.position:"left",i=t.content?t.content:"";return`<div ${e} class="${this.id} ${this.id}--${s}">${i}</div>`}buildHtmlDefault(){let t="";["center","left","right"].forEach((e=>{t+=this.buildHtml({id:e,position:e})})),this.elBody.insertAdjacentHTML("beforeend",t)}buildHtmlItem(t){const e=void 0!==t.color?t.color:this.colorDefault,s=void 0!==t.size?t.size:"regular",i=window?.translation?.translation?.close?window?.translation?.translation?.close:"close",o=wfpComponent.drawIcon({rotate:"45",size:"regular",icon:"plus"});return`\n            <div class="${this.id}__item ${this.id}--${s} ${this.id}--${e}" id="${this.id}${this.notificationId}">\n                <span class="${this.id}__text">${t.content}</span>\n                <button type="button" \n                    class="button button--small button--small--proportional button--transparent" \n                    onclick="wfpNotification.remove(this.parentNode, 0)" \n                    aria-label="${i}"\n                >\n                    ${o}\n                </button>\n            </div>\n        `}init(){this.buildHtmlDefault()}placeItem(t){const e=void 0!==t.place,s=void 0!==t.position?t.position:"right";let i=this.buildHtmlItem(t),o="";if(e){let e=document.querySelector(t.place).querySelector(`.${this.id}`);null===e?(i=this.buildHtml({content:i,position:s}),o=document.querySelector(t.place)):(e.style.position="relative",o=e)}else o=document.getElementById(`${this.id}_${s}`);o&&o.insertAdjacentHTML("beforeend",i)}remove(t,e){setTimeout((()=>{this.removeItem(t)}),150*e)}removeItem(t){null!==t.parentNode&&t.parentNode.removeChild(t)}}export class Table{constructor(){this.elTable=document.querySelectorAll(".table"),this.cssResponsive="table-responsive",this.colorSeparator="--"}build(){this.elTable.forEach((t=>{wfpHelper.wrapItem(t,this.cssResponsive);const e=t.parentNode.parentNode.querySelector(`.${this.cssResponsive}`),s=this.getTableColor(t);wfpHelper.addClass(e,"scrollbar"),wfpHelper.addClass(e,`scrollbar--${s}`),wfpHelper.wrapItem(e,`wrapper-${this.cssResponsive}`)}))}init(){this.elTable&&this.build()}getTableColor(t){const e=t.classList;let s="";return e.forEach((t=>{t.includes(this.colorSeparator)&&(s=t.split(this.colorSeparator)[1])})),s}}export class Tag{close(t){t.parentNode.parentNode.removeChild(t.parentNode)}}export class Translation{constructor(){this.translation="",this.translationEn={cancel:"Cancel",close:"Close",confirm:"OK",input_upload:"Select File...",next:"Next",previous:"Previous"},this.translationEs={cancel:"Cancelar",close:"Cerrar",confirm:"OK",input_upload:"Seleccione Archivo...",next:"Siguiente",previous:"Anterior"},this.translationPt={cancel:"Cancelar",close:"Fechar",confirm:"OK",input_upload:"Selecione o Arquivo...",next:"Próximo",previous:"Anterior"}}defineLanguege(){const t=wfpLanguage.charAt(0).toUpperCase()+wfpLanguage.slice(1);this.translation=this[`translation${t}`]}init(){this.defineLanguege()}}