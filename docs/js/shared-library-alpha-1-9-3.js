export class Carousel{constructor(){this.attCurrentSlide="data-current-slide",this.attPrevious='[data-id="previous"]',this.attNext='[data-id="next"]',this.cssCarouselList="carousel__list",this.cssCarouselListItem="carousel__item",this.cssCarouselController="carousel__controller",this.cssButton="carousel__controller-button",this.cssButtonActive=`${this.cssButton}--active`,this.cssDisplay="hide",this.cssTransition=".7s",this.elCarousel=document.querySelectorAll(".carousel"),this.counterCurrent=0,this.transition=5,this.isAutoplay=!0,this.interval=1e3,this.buildNavigationControllerClick=this.buildNavigationControllerClick.bind(this)}animate(t){const e="arrow"===t.from?t.target.parentNode.querySelector(`.${this.cssCarouselList}`):t.target.parentNode.parentNode.querySelector(`.${this.cssCarouselList}`),i=e.parentNode.getAttribute("data-style"),s=Number(e.querySelector(`.${this.cssCarouselListItem}`).offsetWidth),o=t.currentSlide,n=Number(o*s);"fade"!==i?this.animateSlide({elCarouselList:e,currentPosition:n}):this.animateFade({elCarouselList:e,currentPosition:n,currentSlide:o})}animateFade(t){const e=t.elCarouselList.querySelectorAll(`.${this.cssCarouselListItem}`),i=e[t.currentSlide];e.forEach((t=>{t.style.opacity=0,t.style.transition=this.cssTransition})),i.style.opacity=1,i.style.left=`-${t.currentPosition}px`,i.style.transition=this.cssTransition}animateSlide(t){t.elCarouselList.style.transform=`translateX(-${t.currentPosition}px)`}buildAutoplay(){this.isAutoplay&&(this.interval=setInterval(this.verifyInterval,this.interval),this.isAutoplay=!1)}buildLayout(){this.elCarousel.forEach((t=>{const e=t.querySelectorAll(`.${this.cssCarouselList} .${this.cssCarouselListItem}`).length,i=t.getAttribute("data-autoplay"),s=t.getAttribute(this.attCurrentSlide);"true"===i&&this.buildAutoplay(),this.resize(t),this.buildController(t,e),this.defineActive(t.querySelector(`[data-id="${s}"]`)),1===e&&(t.querySelector(this.attPrevious).classList.add(this.cssDisplay),t.querySelector(this.attNext).classList.add(this.cssDisplay),t.querySelector(`.${this.cssCarouselController}`).classList.add(this.cssDisplay))}))}buildController(t,e){const i=`button button--small button--small--proportional ${this.cssButton}`,s=t.querySelector(`.${this.cssCarouselController}`);let o="";for(let t=0;t<e;t++)o+=`<button type="button"  class="${i}" data-id="${t}" aria-hidden="true"></button>`;s.innerHTML=o}buildNavigation(){this.elCarousel.forEach((t=>{this.buildNavigationController(t),this.buildNavigationLeft(t),this.buildNavigationRight(t)}))}buildNavigationController(t){t.querySelectorAll(`.${this.cssButton}`).forEach((t=>{helper.addClick(t,this.buildNavigationControllerClick)}))}buildNavigationControllerClick(t){const e=t.target,i=t.target.getAttribute("data-id");e.parentNode.parentNode.setAttribute(this.attCurrentSlide,i),this.defineActive(e),this.animate({currentSlide:e.getAttribute("data-id"),target:e,from:"navigation"})}buildNavigationArrow(t){t.button.onclick=()=>{const e=t.button.parentNode.parentNode,i=e.querySelector(`.${this.cssCarouselList}`),s=Number(i.querySelectorAll(`.${this.cssCarouselListItem}`).length),o=Number(e.getAttribute(this.attCurrentSlide));let n=0;n="previous"===t.side?0===o?s-1:o-1:o===s-1?0:o+1,e.setAttribute(this.attCurrentSlide,n),this.defineActive(e.querySelector(`[data-id="${n}"]`)),this.animate({currentSlide:n,target:i,from:"arrow"})}}buildNavigationLeft(t){const e=t.querySelector(this.attPrevious);this.buildNavigationArrow({button:e,side:"previous"})}buildNavigationRight(t){const e=t.querySelector(this.attNext);this.buildNavigationArrow({button:e,side:"next"})}defineActive(t){t.parentNode.parentNode.querySelectorAll(`.${this.cssButton}`).forEach((t=>{t.classList.remove(this.cssButtonActive)})),t.classList.add(this.cssButtonActive)}init(){this.elCarousel&&(this.buildLayout(),this.buildNavigation(),this.watchResize())}resize(t){const e=t.querySelector(`.${this.cssCarouselList}`),i=e.querySelectorAll(`.${this.cssCarouselListItem}`).length;e.style.width+=100*i+"%"}verifyInterval(){const t=window.carousel;t.counterCurrent++,t.counterCurrent>=t.transition&&(t.counterCurrent=0,t.elCarousel.forEach((e=>{const i=e.getAttribute("data-autoplay"),s=e.querySelector(t.attNext);"true"===i&&s.click()})))}watchResize(){window.addEventListener("resize",(()=>{this.elCarousel.forEach((t=>{this.watchResizeLoop(t)}))}),!0)}watchResizeLoop(t){const e=t.parentNode.parentNode.parentNode.parentNode,i=e.querySelector(`.${this.cssCarouselList}`);this.defineActive(e.querySelector('[data-id="0"]')),this.animate({currentSlide:0,target:i,from:"arrow"})}}export class Form{validateEmpty(t){const e=t.length;for(let i=0;i<e;i++)if(""===t[i].value)return t[i].focus(),!1;return!0}}export class LazyLoad{constructor(){this.cssAttribute="data-lazy-load",this.cssData=`[${this.cssAttribute}="true"]`}addListener(){document.querySelector("body").addEventListener("scroll",(()=>{window.requestAnimationFrame((()=>{this.buildLoop()}))}))}buildLoop(){document.querySelectorAll(this.cssData).forEach((t=>{this.verifyPosition(t)}))}buildImage(t){const e=t.getAttribute("data-src");t.setAttribute("src",e),t.removeAttribute(this.cssAttribute)}init(){document.querySelector(this.cssData)&&(this.addListener(),this.buildLoop())}verifyPosition(t){window.scrollY>=window.helper.offset(t).top-window.outerHeight&&this.buildImage(t)}}export class LoadingMain{constructor(){this.cssHide="hide",this.cssAnimation="animate",this.elWrapper=document.querySelector(".loading-main"),this.elWrapper&&(this.elLoading=this.elWrapper.querySelector(".loading"),this.elBody=document.querySelector("body"))}hide(){this.elWrapper&&(this.elWrapper.classList.add(this.cssHide),this.elLoading.classList.remove(this.cssAnimation),this.elBody.style.overflow="auto")}}export class MenuDropDown{update(){this.isClickBuild=!1,this.classMenu="drop-down",this.classMenuText=`${this.classMenu}-text`,this.cssDropDownContent=`${this.classMenu}__content`,this.cssOpend=`${this.cssDropDownContent}--opened`,this.cssMobileShow="mobile-show",this.elMenu=document.querySelectorAll(`.${this.classMenu}, .${this.classMenuText}`),this.addClickAction=this.addClickAction.bind(this),this.close=this.close.bind(this)}addClick(){this.elMenu.forEach((t=>{const e=t.querySelectorAll(".button:first-child, .link:first-child")[0];helper.addClick(e,this.addClickAction)}))}addClickAction(t){const e=t.target.parentNode.querySelector(`.${this.cssDropDownContent}`);null!==e&&helper.addClass(e,this.cssOpend)}close(){const t=window.menuDropDown;"string"!==this.elMenu&&t.elMenu.forEach((e=>{const i=e.querySelector(`.${t.cssDropDownContent}`);null!==i&&helper.removeClass(i,this.cssOpend)}))}init(){this.update(),this.elMenu&&(this.isClickBuild||(this.isClickBuild=!0,this.addClick()),document.addEventListener("click",this.close,!0))}listener(t){const e=document.querySelectorAll(`.${window.menuDropDown.cssMobileShow}`);t.toElement.classList.contains("button")||t.toElement.classList.contains("link")||e.forEach((t=>{helper.removeClass(t,menuDropDown.cssMobileShow)}))}reset(){document.removeEventListener("click",this.listener,!0),window.menuDropDown.init()}}export class MenuToggle{constructor(){this.cssButton="toggle-menu",this.cssOpen="toggle-menu__open",this.isWatch=!1,this.handleClick=this.handleClick.bind(this)}buildMenu(){this.elButton.forEach((t=>{helper.addClick(t,this.handleClick)}))}handleClick(t){const e=t.target.nextElementSibling;e.classList.contains(this.cssOpen)?e.classList.remove(this.cssOpen):e.classList.add(this.cssOpen)}init(){this.update(),this.buildMenu(),this.isWatch||(this.isWatch=!0,this.watchResize())}update(){this.elButton=document.querySelectorAll(`.${this.cssButton}`)}reset(){this.init()}watchResize(){window.onresize=()=>{this.init()}}}export class Modal{constructor(){this.isModalOpen=!1,this.cssHide="hide",this.cssClose="modal--close",this.cssScrollbar="scrollbar scrollbar--grey",this.elBody=document.querySelector("body")}buildHtml(){const t=`\n            <div class="modal ${this.cssClose} ${this.cssScrollbar}">\n                <div class="modal__box">\n                    <header class="modal__header right">\n                        <button type="button" aria-label="${window.translation.translation.close}" class="button button--small button--small--proportional button--grey button--transparent button--close">\n                            <svg class="icon icon--regular rotate-45">\n                                <use xlink:href="./assets/img/icon.svg#plus"></use>\n                            </svg>\n                        </button>\n                    </header>\n                    <div class="row">\n                        <div class="modal__content"></div>\n                    </div>\n                    <div class="navigation-change button-wrapper row center ${this.cssHide}">\n                        <button type="button" class="button button--big" data-id="previous" aria-label="${window.translation.translation.previous}" >\n                            <svg class="icon icon--extra-big icon--white">\n                                <use xlink:href="./assets/img/icon.svg#previous"></use>\n                            </svg>\n                        </button>\n                        <button type="button" class="button button--big" data-id="next" aria-label="${window.translation.translation.next}" >\n                            <svg class="icon icon--extra-big icon--white rotate-180">\n                                <use xlink:href="./assets/img/icon.svg#previous"></use>\n                            </svg>\n                        </button>\n                    </div>\n                    <footer class="button-wrapper modal__footer center ${this.cssHide}">\n                        <button type="button" class="button button--regular button--green" data-id="confirm"></button>\n                        <button type="button" class="button button--regular button--grey" data-id="cancel"></button>\n                    </footer>\n                </div>\n            </div>\n        `;this.elBody.insertAdjacentHTML("afterbegin",t)}buildKeyboard(){window.addEventListener("keyup",(t=>{const e=t.key;"Escape"===e&&this.buildKeyboardEscape(),"ArrowLeft"===e&&this.buildKeyboardArrowLeft(),"ArrowRight"===e&&this.buildKeyboardArrowRight()}))}buildKeyboardEscape(){this.isModalOpen&&this.closeModal()}buildKeyboardArrowLeft(){this.isModalOpen&&(this.elModalNavigationArrowLeft.classList.contains(this.cssHide)||this.elModalNavigationArrowLeft.click())}buildKeyboardArrowRight(){this.isModalOpen&&(this.elModalNavigationArrowRight.classList.contains(this.cssHide)||this.elModalNavigationArrowRight.click())}buildMenuGallery(){this.elGallery&&(this.elGallery.forEach((t=>{t.querySelectorAll("a").forEach((t=>{this.buildMenuGalleryButton(t)}))})),helper.addClick(this.elModalNavigationArrowLeft,this.handleClickArrowLeft.bind(this)),helper.addClick(this.elModalNavigationArrowRight,this.handleClickArrowRight.bind(this)))}buildMenuGalleryButton(t){t.addEventListener("click",(e=>{const i=t.getAttribute("href"),s=t.querySelector("img").getAttribute("data-description");e.preventDefault(),this.buildModal({kind:"gallery",size:"big"}),this.buildGalleryImage(i,s),this.buildGalleryNavigation(t)}))}buildMenu(){const t=this.elModalFooter.querySelector('[data-id="cancel"]');helper.addClick(this.elModalClose,this.closeModal.bind(this)),helper.addClick(t,this.closeModal.bind(this))}buildGalleryNavigation(t){const e=t.parentNode.parentNode.querySelectorAll("a"),i=e.length-1;let s=[];e.forEach((t=>{s.push(t)})),i>0?this.buildGalleryNavigationShow({array:s,target:t,siblingLength:i}):this.elModalNavigationArrow.classList.add(this.cssHide)}buildGalleryNavigationShow(t){const e=t.array.indexOf(t.target);this.elModalNavigationArrow.classList.remove(this.cssHide),this.targetBuildGalleryChange=t.target,e<=0?this.elModalNavigationArrowLeft.classList.add(this.cssHide):this.elModalNavigationArrowLeft.classList.remove(this.cssHide),e>=t.siblingLength?this.elModalNavigationArrowRight.classList.add(this.cssHide):this.elModalNavigationArrowRight.classList.remove(this.cssHide)}buildModal(t){this.elModalFooter.classList.add(this.cssHide),void 0===t.action?this.openModal():this.closeModal(),void 0!==t.click&&this.buildContentConfirmationAction(t.click),void 0!==t.confirmText?this.elModalFooterConfirm.innerHTML=t.confirmText:this.translate(),this.buildModalSize(t.size),this.buildModalKind(t)}buildModalKind(t){"ajax"===t.kind&&this.buildContentAjax(t.content),"confirmation"===t.kind&&this.buildContentConfirmation(t.content),"gallery"!==t.kind?this.elModalNavigationArrow.classList.add("hide"):this.elModalNavigationArrow.classList.remove("hide")}buildModalSize(t="regular"){const e="modal--";["extra-small","small","regular","big","extra-big","full"].forEach((t=>{this.elModalBox.classList.remove(`${e}${t}`)})),this.elModalBox.classList.add(`${e}${t}`)}buildContentAjax(t){const e=this;let i=new XMLHttpRequest;i.onreadystatechange=function(){4===!this.readyState&&200===this.status||e.buildContentAjaxSuccess(this.responseText)},i.open("GET",t,!0),i.send()}buildContentAjaxSuccess(t){this.elModalContent.innerHTML=t,this.resetOtherClass()}buildGalleryImage(t,e){const i=`<img src="${t}" class="img-responsive" style="margin:auto;" title="" alt=""/>`;this.elModalContent.innerHTML=i,this.changeText(e)}buildContentConfirmation(t){const e=`<div class="center">${t}</div>`;this.elModalFooter.classList.remove(this.cssHide),this.elModalContent.innerHTML=e}buildContentConfirmationAction(t){this.elModalFooterConfirm.setAttribute("onclick",t)}changeText(t){const e=`<p class="modal__description">${t}</p>`;""!==t&&null!==t&&this.elModalContent.insertAdjacentHTML("beforeend",e)}closeModal(){this.isModalOpen=!1,this.elBody.classList.add("overflow-y"),this.elBody.classList.remove("overflow-hidden"),this.elBody.style.overflowY="auto",this.elBody.style.position="relative",this.elModal.classList.add(this.cssClose),this.elModalBox.classList.remove("modal-animate"),this.resetOtherClass()}init(){this.buildHtml(),this.update(),this.buildMenu(),this.buildMenuGallery(),this.buildKeyboard(),this.translate()}handleClickArrowLeft(){this.targetBuildGalleryChange.previousElementSibling.click()}handleClickArrowRight(){this.targetBuildGalleryChange.nextElementSibling.click()}openModal(){this.isModalOpen=!0,this.elBody.classList.remove("overflow-y"),this.elBody.classList.add("overflow-hidden"),this.elBody.style.overflowY="hidden",this.elModal.classList.remove(this.cssClose),this.elModalBox.classList.add("modal-animate")}resetOtherClass(){"undefined"!=typeof menuDropDown&&menuDropDown.reset(),"undefined"!=typeof menuToggle&&menuToggle.init(),"undefined"!=typeof menuTab&&menuTab.init(),"undefined"!=typeof lazyLoad&&lazyLoad.init()}translate(){this.elModalFooterConfirm.innerHTML=translation.translation.confirm,this.elModalFooterCancel.innerHTML=translation.translation.cancel}update(){this.targetBuildGalleryChange="",this.elModal=document.querySelector(".modal"),this.elModalFooter=this.elModal.querySelector("footer"),this.elModalFooterConfirm=this.elModalFooter.querySelector('[data-id="confirm"]'),this.elModalFooterCancel=this.elModalFooter.querySelector('[data-id="cancel"]'),this.elModalClose=document.querySelector(".modal__header .button--close"),this.elModalContent=document.querySelector(".modal__content"),this.elModalBox=this.elModal.querySelector(".modal__box"),this.elModalNavigationArrow=this.elModal.querySelector(".navigation-change"),this.elModalNavigationArrowLeft=this.elModalNavigationArrow.querySelector('[data-id="previous"]'),this.elModalNavigationArrowRight=this.elModalNavigationArrow.querySelector('[data-id="next"]'),this.elGallery=document.querySelectorAll(".gallery")}}export class Notification{constructor(){this.elBody=document.querySelector("body"),this.elNotificationId="notification",this.colorDefault="grey",this.notificationId=0}add(t){if(!t.text)return;this.placeItem(t);const e=document.querySelector(`#${this.elNotificationId+this.notificationId}`);this.remove(e,t.text.length),this.notificationId++}buildHtml(){const t=`<div id="${this.elNotificationId}" class="${this.elNotificationId} ${this.elNotificationId}--default"></div>`;this.elBody.insertAdjacentHTML("beforeend",t)}buildHtmlItem(t){const e=void 0!==t.color?t.color:this.colorDefault;return`\n            <div class="${this.elNotificationId}__item ${this.elNotificationId}--regular ${this.elNotificationId}--${e}" id="${this.elNotificationId}${this.notificationId}">\n                <span class="${this.elNotificationId}__text">${t.text}</span>\n                <button type="button" class="button button--small button--small--proportional button--transparent" onclick="Notification.remove(this.parentNode, 0)" aria-label="${window.translation.translation.close}">\n                    <svg class="icon icon--regular rotate-45">\n                        <use xlink:href="./assets/img/icon.svg#plus"></use>\n                    </svg>\n                </button>\n            </div>\n        `}init(){this.buildHtml(),this.update()}placeItem(t){let e=this.buildHtmlItem(t),i="";if(void 0===t.place)i=this.elNotification;else{let s=document.querySelector(t.place).querySelector(`.${this.elNotificationId}`);null===s?(e=`<div class="${this.elNotificationId}">${e}</div>`,i=document.querySelector(t.place)):i=s}i.insertAdjacentHTML("beforeend",e)}remove(t,e){setTimeout((()=>{this.removeItem(t)}),150*e)}removeItem(t){null!==t.parentNode&&t.parentNode.removeChild(t)}update(){const t=document.querySelector(`#${this.elNotificationId}`);this.elNotification=t}}export class Table{constructor(){this.elTable=document.querySelectorAll(".table"),this.cssResponsive="table-responsive"}build(){this.elTable.forEach((t=>{helper.wrapItem(t,this.cssResponsive);const e=t.parentNode.parentNode.querySelector(`.${this.cssResponsive}`);helper.wrapItem(e,`wrapper-${this.cssResponsive}`)}))}init(){this.elTable&&this.build()}}export class Translation{constructor(){this.translation="",this.translationEn={cancel:"Cancel",close:"Close",confirm:"Confirm",input_upload:"Select File...",next:"Next",previous:"Previous"},this.translationEs={cancel:"Cancelar",close:"Cerrar",confirm:"Confirmar",input_upload:"Seleccione Archivo...",next:"Siguiente",previous:"Anterior"},this.translationPt={cancel:"Cancelar",close:"Fechar",confirm:"Confirmar",input_upload:"Selecione o Arquivo...",next:"Próximo",previous:"Anterior"}}defineLanguege(){const t=globalLanguage.charAt(0).toUpperCase()+globalLanguage.slice(1);this.translation=this[`translation${t}`]}init(){this.defineLanguege()}}export class Component{constructor(){this.entityBlank="&nbsp;"}buildAttributeClass(t){const e=t=>void 0!==t?s+=t+i:"",i=" ";let s="";return e(t.css),e(t.cssSize),e(t.cssStyle),e(t.cssComponent),s.slice(-1)===i&&(s=s.slice(0,-1)),t.css?` class="${s}" `:""}buildAttributeChange(t){return void 0!==t.change?` onchange="${t.change}" `:""}buildAttributeClick(t){return void 0!==t.click?` onclick="${t.click}" `:""}buildAttributeData(t){const e=t.dataCustom;if(!e)return;const i=Object.entries(e);let s=" ";return i.forEach((([t,e])=>{const i=e.label,o=e.value;s+=` data-${i}="${o}" `})),s}buildAttributeFor(t){return void 0!==t.id?` for="${t.prefix}_${t.id}" `:""}buildAttributeId(t){return void 0!==t.id?` id="${t.prefix}_${t.id}" `:""}buildAttributeLabel(t){const e=this.buildAttributeFor(t);return void 0!==t.label?`<label ${e}>${t.label}</label>`:this.entityBlank}buildAttributeMax(t){return void 0!==t.max?` max="${t.max}" `:""}buildAttributeMin(t){return void 0!==t.min?` min="${t.min}" `:""}buildAttributeType(t){return` type="${void 0!==t.type?t.type:"text"}" `}buildAttributeValue(t){return void 0!==t.value?` value="${t.value}" `:""}buildButton(t){t.prefix="button",t.css=t.prefix,t.cssSize=void 0!==t.cssSize?`${t.prefix}-${t.cssSize}`:`${t.prefix}-regular`,t.cssStyle=void 0!==t.cssStyle?`${t.prefix}-${t.cssStyle}`:"",t.cssComponent=void 0!==t.cssComponent?t.cssComponent:"";const e=this.buildAttributeId(t),i=this.buildAttributeClick(t),s=this.buildAttributeData(t),o=this.buildAttributeClass(t),n=t.text?t.text:"";return`<button type="button" ${o} ${e} ${s} ${i} ${t.attribute?t.attribute:""}>${n}</button>`}buildCard(t){const e=void 0!==t.header&&t.header,i=void 0!==t.content?t.content:this.entityBlank,s=void 0!==t.footer&&t.footer;return`\n            <div class="card">\n                ${e?`\n            <header>\n                <h4 class="card-title">${e}</h4>\n            </header>\n        `:""}\n                <div class="card-body">\n                    <div class="responsive-row">\n                        <div class="responsive-column-regular-12">\n                            ${i}\n                        </div>\n                    </div>\n                </div>\n                ${s?`\n            <footer>\n                ${s}\n            </footer>\n        `:""}\n            </div>\n        `}buildMenuTab(t){const e=Object.entries(t);let i="";return i+='\n            <div class="responsive-row">\n                <div class="responsive-column-regular-12">\n                    <nav class="menu-tab menu menu-horizontal menu-drop-down">\n                        <ul>\n        ',e.forEach((([t,e])=>{i+=`<li>${e}</li>`})),i+="\n                        </ul>\n                    </nav>\n                </div>\n            </div>\n        ",i}buildMenuTabContent(t){const e=Object.entries(t);let i="";return i+='\n            <div class="responsive-row">\n                <div class="responsive-column-regular-12">\n                    <div class="menu-tab-box">\n        ',e.forEach((([t,e])=>{i+=e})),i+="\n                    </div>\n                </div>\n            </div>\n        ",i}buildIcon(t){return`<span class="fa fa fa-${t}" aria-hidden="true"></span>`}buildInput(t){t.prefix="input";const e=this.buildAttributeId(t),i=this.buildAttributeChange(t),s=this.buildAttributeData(t),o=this.buildAttributeType(t),n=t.attribute?t.attribute:"";return`<input ${e} ${s} ${o} ${this.buildAttributeValue(t)} ${i} ${this.buildAttributeMax(t)} ${this.buildAttributeMin(t)} class="input" ${n}>`}buildSelect(t){t.prefix="select";const e=this.buildAttributeId(t),i=this.buildAttributeLabel(t),s=this.buildAttributeData(t),o=void 0!==t.optionDefault,n=void 0!==t.option&&t.option;let l=`\n            <div class="form-field responsive-row">\n                <div class="responsive-column-regular-4">\n                    ${i}\n                </div>\n                <div class="responsive-column-regular-8">\n                    <select ${e} ${s} ${this.buildAttributeChange(t)} class="input">\n        `;if(!o){t.value=!1;const e="Selecione",i=this.buildAttributeValue(t);l+=`<option selected="true" ${i}>${e}</option>`}return n&&Object.entries(n).forEach((([e,i])=>{const s=[{label:"price",value:i.dataPrice}];t.dataCustom=s,t.value=i.value;const o=this.buildAttributeValue(t),n=this.buildAttributeData(t);l+=`<option ${o} ${n}>${i.text}</option>`})),l+="\n                    </select>\n                </div>\n            </div>\n        ",l}}export class DataLayerModify{constructor(){}addPageView(){const t=window.location,e=t.href,i=t.origin,s=t.href,o=this.validateText(t.pathname.split("/")[1]),n=this.validateText(e.replace(i,"")),l=this.validateText(document.referrer),a=this.validateText(document.title);this.push({event:"pageview",location:s,pagetype:o,path:n,referrer:l,title:a})}push(t){dataLayer.push(t)}update(t){const e=this.validateText(t.action),i=this.validateText(t.label),s=this.validateText(t.category);this.push({event:"gaEvent",eventCategory:s,eventAction:e,eventLabel:i})}validateText(t){return void 0===t||""===t||"/"===t?this.textDefault:String(t)}}export class Helper{constructor(){this.cssDisplayNone="display-none",this.origin,this.isDebug=!0}addChange(t,e){t&&this.addEvent({el:t,action:e,event:"change"})}addClick(t,e){t&&this.addEvent({el:t,action:e,event:"click"})}addEvent(t){const e=t.action,i=t.el,s=t.event;i&&(i.removeEventListener(s,e),i.addEventListener(s,e))}addClass(t,e){t&&e&&(e instanceof Array?e.forEach((e=>{t.classList.add(e)})):t.classList.add(e))}ajax(t){return new Promise(((e,i)=>{const s=t.controller?t.controller:"php/controller.php",o=t.namespace?t.namespace:"Game",n=t.token?t.token:gameLayout.token,l=t.kind?t.kind:"POST";let a=new XMLHttpRequest;a.open(l,s,!0),a.setRequestHeader("Content-type","application/x-www-form-urlencoded"),a.onload=()=>{a.status>=200&&a.status<300&&(this.ajaxLoaded(a.responseText),e(a.responseText)),i(a.statusText)},a.onerror=()=>i(a.statusText),a.send(`&n=${o}&t=${n+t.parameter}`)}))}ajaxLoaded(t){if(this.verifyParse(t)){const e=JSON.parse(t);if("game"===this.origin)return gamePageAchievement.verifyNotification(e)}"session_expired"!==t&&"maintenance"!==t||gameLayout.decodeMessage(t)}capitalize(t){return t.charAt(0).toUpperCase()+t.slice(1)}debug(t){const e="object"==typeof t;this.isDebug&&(e?console.table(t):console.log(t))}findInObject(t){const e=t.target,i=t.search,s=t.value,o=t.get,n=e.length;for(let t=0;t<n;t++){const n=e[t];if(n[i]==s)return!1!==o?n[o]:t}}getSelectValue(t){return t.options[t.selectedIndex].value}getSize(t){return parseFloat(getComputedStyle(t.el,null)[t.value].replace("px",""))}getTranslateValue(t){if(void 0===t)return;const e=window.getComputedStyle(t).transform;if("none"===e)return{x:0,y:0,z:0};const i=e.includes("3d")?"3d":"2d",s=e.match(/matrix.*\((.+)\)/)[1].split(", ");return"2d"===i?{x:Number(s[4]),y:Number(s[5]),z:0}:"3d"===i?{x:Number(s[12]),y:Number(s[13]),z:Number(s[14])}:void 0}getUrlParameter(t){const e=top.location.search.substring(1).split("&");for(let i=0;i<e.length;i++){let s=e[i].split("=");if(s[0]===t)return s[1]}}getUrlWord(t){return new RegExp("\\b"+t+"\\b","i").test(window.location.href)}height(t){return this.getSize({el:t,value:"height"})}hide(t){this.addClass(t,this.cssDisplayNone)}isElementVisible(t){return null!==t?.offsetParent}isStringEmpty(t){return""===t||null==t}isJson(t){try{const e=JSON.parse(t);return e instanceof Array||e instanceof Object}catch(t){return!1}}offset(t){let e=t.getBoundingClientRect();const i=window.pageXOffset||document.documentElement.scrollLeft,s=window.pageYOffset||document.documentElement.scrollTop;return{top:e.top+s,left:e.left+i}}randomInArray(t){const e=Math.random()*t.length;return t[Math.floor(e)]}randomNumber(t){const e=Math.random()*t;return Math.floor(e)}remove(t){t&&null!==t.parentNode&&t.parentNode.removeChild(t)}removeClass(t,e){t&&e&&(e instanceof Array?e.forEach((e=>{this.removeClassExecute(t,e)})):this.removeClassExecute(t,e))}removeClassExecute(t,e){t.classList.contains(e)&&t.classList.remove(e)}removeInArray(t){const e=t.arr,i=e.indexOf(t.value);e.splice(i,1)}setInputValue(t,e){t&&(t.value=e)}show(t){this.removeClass(t,this.cssDisplayNone)}sortSelect(t){const e=t.options.length;let i=[];for(let s=0;s<e;s++)i[s]=[],i[s][0]=t.options[s].text,i[s][1]=t.options[s].value;for(i.sort();t.options.length>0;)t.options[0]=null;for(let e=0;e<i.length;e++){let s=new Option(i[e][0],i[e][1]);t.options[e]=s}}trigger(t,e){const i=new Event(e);t.dispatchEvent(i)}useStorage(t){const e=t.target,i="october_31_";switch(t.action){case"set":window.localStorage.setItem(i+e,t.value);break;case"get":return window.localStorage.getItem(i+e);case"remove":window.localStorage.removeItem(i+e)}}validateEmptySpace(t){return-1!==t.value.indexOf(" ")}verifyParse(t){try{JSON.parse(t)}catch(t){return!1}return!0}verifyUrlRoute(t){return window.location.pathname.split("/").indexOf(t)>-1}width(t){return this.getSize({el:t,value:"width"})}wrapItem(t,e){const i=document.createElement("div");i.className=e,t.parentNode.insertBefore(i,t),i.appendChild(t)}}