export class Carousel{constructor(){this.attCurrentSlide="data-current-slide",this.attPrevious='[data-id="previous"]',this.attNext='[data-id="next"]',this.cssCarouselList="carousel__list",this.cssCarouselListItem="carousel__item",this.cssCarouselController="carousel__controller",this.cssButton="carousel__controller-button",this.cssButtonActive=`${this.cssButton}--active`,this.cssDisplay="hide",this.cssTransition=".7s",this.elCarousel=document.querySelectorAll(".carousel"),this.counterCurrent=0,this.transition=5,this.isAutoplay=!0}build(){this.elCarousel.length<1||(this.buildLayout(),this.buildNavigation(),this.watchResize())}buildAutoplay(){this.isAutoplay&&(this.interval=setInterval(this.verifyInterval,1e3),this.isAutoplay=!1)}buildLayout(){const t=this;Array.prototype.forEach.call(this.elCarousel,e=>{let i=e.querySelectorAll(`.${t.cssCarouselList} .${this.cssCarouselListItem}`).length;"true"===e.getAttribute("data-autoplay")&&t.buildAutoplay(),t.resizeLayout(e),t.buildLayoutController(e,i),t.defineActive(e.querySelector('[data-id="'+e.getAttribute(t.attCurrentSlide)+'"]')),1===i&&(e.querySelector(t.attPrevious).classList.add(t.cssDisplay),e.querySelector(t.attNext).classList.add(t.cssDisplay),e.querySelector(`.${t.cssCarouselController}`).classList.add(t.cssDisplay))})}watchResize(){const t=this;window.onresize=(()=>{Array.prototype.forEach.call(t.elCarousel,e=>{let i=e.parentNode.parentNode.parentNode.parentNode,o=i.querySelector(`.${t.cssCarouselList}`);t.defineActive(i.querySelector('[data-id="0"]')),t.animate({currentSlide:0,target:o,from:"arrow"})})})}buildLayoutController(t,e){const i=`button button--small button--small--proportional ${this.cssButton}`;let o="";for(let t=0;t<e;t++)o+=`\n                <button type="button" class="${i}" data-id="${t}" aria-hidden="true"></button>\n            `;t.querySelector(`.${this.cssCarouselController}`).innerHTML=o}buildNavigation(){Array.prototype.forEach.call(this.elCarousel,t=>{this.buildNavigationController(t),this.buildNavigationArrowLeft(t),this.buildNavigationArrowRight(t)})}buildNavigationController(t){const e=t.querySelectorAll(`.${this.cssButton}`);Array.prototype.forEach.call(e,t=>{t.onclick=(()=>{this.defineActive(t),this.animate({currentSlide:t.getAttribute("data-id"),target:t,from:"navigation"})})})}buildNavigationArrow(t){const e=this;t.button.onclick=(()=>{const i=t.button.parentNode.parentNode,o=i.querySelector(`.${e.cssCarouselList}`),s=Number(o.querySelectorAll(`.${this.cssCarouselListItem}`).length),l=Number(i.getAttribute(e.attCurrentSlide));let a=0;a="previous"===t.side?0===l?s-1:l-1:l===s-1?0:l+1,i.setAttribute(e.attCurrentSlide,a),e.defineActive(i.querySelector(`[data-id="${a}"]`)),e.animate({currentSlide:a,target:o,from:"arrow"})})}buildNavigationArrowLeft(t){const e=t.querySelector(this.attPrevious);this.buildNavigationArrow({button:e,side:"previous"})}buildNavigationArrowRight(t){const e=t.querySelector(this.attNext);this.buildNavigationArrow({button:e,side:"next"})}animate(t){const e="arrow"===t.from?t.target.parentNode.querySelector(`.${this.cssCarouselList}`):t.target.parentNode.parentNode.querySelector(`.${this.cssCarouselList}`),i=e.parentNode.getAttribute("data-style"),o=Number(e.querySelector(`.${this.cssCarouselListItem}`).offsetWidth),s=t.currentSlide,l=Number(s*o);switch(i){case"fade":this.animateFade({elCarouselList:e,currentPosition:l,currentSlide:s});break;default:this.animateSlide({elCarouselList:e,currentPosition:l})}}animateFade(t){const e=t.elCarouselList.querySelectorAll(`.${this.cssCarouselListItem}`);Array.prototype.forEach.call(e,t=>{t.style.opacity=0,t.style.transition=this.cssTransition}),e[t.currentSlide].style.opacity=1,e[t.currentSlide].style.left=`-${t.currentPosition}px`,e[t.currentSlide].style.transition=this.cssTransition}animateSlide(t){t.elCarouselList.style.transform=`translateX(-${t.currentPosition}px)`}verifyInterval(){const t=window.carousel;t.counterCurrent++,t.counterCurrent>=t.transition&&(t.counterCurrent=0,Array.prototype.forEach.call(t.elCarousel,e=>{"true"===e.getAttribute("data-autoplay")&&e.querySelector(t.attNext).click()}))}defineActive(t){const e=t.parentNode.parentNode.querySelectorAll(`.${this.cssButton}`);Array.prototype.forEach.call(e,t=>{t.classList.remove(this.cssButtonActive)}),t.classList.add(this.cssButtonActive)}resizeLayout(t){const e=t.querySelector(`.${this.cssCarouselList}`),i=e.querySelectorAll(`.${this.cssCarouselListItem}`).length;e.style.width+=`${100*i}%`}};export class Form{validateEmpty(t){const e=t.length;for(let i=0;i<e;i++)if(""===t[i].value)return t[i].focus(),!1;return!0}};export class LazyLoad{constructor(){this.cssAttribute="data-lazy-load",this.cssData=`[${this.cssAttribute}="true"]`}build(){document.querySelector(this.cssData)&&(this.addListener(),this.buildLoop())}addListener(){window.addEventListener("scroll",()=>{window.requestAnimationFrame(()=>{this.buildLoop()})})}buildLoop(){const t=document.querySelectorAll(this.cssData);Array.prototype.forEach.call(t,t=>{this.verifyPosition(t)})}verifyPosition(t){window.scrollY>=window.helper.offset(t).top-window.outerHeight&&this.buildImage(t)}buildImage(t){t.setAttribute("src",t.getAttribute("data-src")),t.removeAttribute(this.cssAttribute)}};export class LoadingMain{constructor(){this.cssHide="hide",this.cssAnimation="animate",this.cssOverflow="overflow-hidden",this.elWrapper=document.querySelector(".loading-main"),this.elLoading=this.elWrapper.querySelector(".loading"),this.elBody=document.querySelector("body")}hide(){this.elWrapper.parentNode.removeChild(this.elWrapper),this.elBody.classList.remove(this.cssOverflow)}};export class MenuDropDown{update(){this.isClickBuild=!1,this.classMenu="drop-down",this.classMenuText=`${this.classMenu}-text`,this.cssDropDownContent=`${this.classMenu}__content`,this.cssOpend=`${this.cssDropDownContent}--opened`,this.cssMobileShow="mobile-show",this.elMenu=document.querySelectorAll(`.${this.classMenu}, .${this.classMenuText}`)}build(){this.update(),this.elMenu.length<1||(this.isClickBuild||(this.isClickBuild=!0,this.buildClick()),document.addEventListener("click",this.close,!0))}close(){if("string"===this.elMenu)return;const t=window.menuDropDown;Array.prototype.forEach.call(t.elMenu,e=>{const i=e.querySelector(`.${t.cssDropDownContent}`);null!==i&&i.classList.contains(t.cssOpend)&&i.classList.remove(t.cssOpend)})}buildClick(){const t=this;Array.prototype.forEach.call(this.elMenu,e=>{let i=e.querySelectorAll(".button:first-child, .link:first-child")[0];i.addEventListener("click",function(){t.buildClickAction(i)})})}buildClickAction(t){const e=t.parentNode.querySelector(`.${this.cssDropDownContent}`);null!==e&&e.classList.add(this.cssOpend)}listener(t){const e=document.querySelectorAll(`.${window.menuDropDown.cssMobileShow}`);t.toElement.classList.contains("button")||t.toElement.classList.contains("link")||Array.prototype.forEach.call(e,t=>{t.classList.remove(window.menuDropDown.cssMobileShow)})}reset(){document.removeEventListener("click",this.listener,!0),window.menuDropDown.build()}};export class MenuToggle{constructor(){this.classButton="toggle-menu",this.isWatch=!1}build(){this.update(),this.buildClick(),this.isWatch||(this.isWatch=!0,this.watchResize())}update(){this.elButton=document.querySelectorAll(`.${this.classButton}`)}buildClick(){Array.prototype.forEach.call(this.elButton,t=>{t.onclick=(()=>{const e=t.nextElementSibling;e.hasAttribute("style")?e.removeAttribute("style"):e.style.display="flex"})})}watchResize(){window.onresize=(()=>{this.build()})}reset(){this.build()}};export class Modal{constructor(){this.isModalOpen=!1,this.cssHide="hide",this.cssClose="modal--close",this.elBody=document.querySelector("body")}update(){this.targetBuildGalleryChange="",this.elModal=document.querySelector(".modal"),this.elModalFooter=this.elModal.querySelector("footer"),this.elModalFooterConfirm=this.elModalFooter.querySelector('[data-id="confirm"]'),this.elModalFooterCancel=this.elModalFooter.querySelector('[data-id="cancel"]'),this.elModalClose=document.querySelector(".modal__header .button--close"),this.elModalContent=document.querySelector(".modal__content"),this.elModalBox=this.elModal.querySelector(".modal__box"),this.elModalNavigationArrow=this.elModal.querySelector(".navigation-change"),this.elModalNavigationArrowLeft=this.elModalNavigationArrow.querySelector('[data-id="previous"]'),this.elModalNavigationArrowRight=this.elModalNavigationArrow.querySelector('[data-id="next"]'),this.elGallery=document.querySelectorAll(".gallery")}build(){this.buildHtml(),this.update(),this.buildMenu(),this.buildMenuGallery(),this.buildKeyboard(),this.buildTranslation()}buildHtml(){const t=`\n            <div class="modal ${this.cssClose}">\n                <div class="modal__box">\n                    <header class="modal__header right">\n                        <button type="button" aria-label="${window.translation.translation.close}" class="button button--small button--small--proportional button--transparent button--close">\n                            <svg class="icon icon--regular rotate-45">\n                                <use xlink:href="./assets/img/icon.svg#plus"></use>\n                            </svg>\n                        </button>\n                    </header>\n                    <div class="row">\n                        <div class="modal__content"></div>\n                    </div>\n                    <div class="navigation-change button-wrapper row center ${this.cssHide}">\n                        <button type="button" class="button button--big" data-id="previous" aria-label="${window.translation.translation.previous}" >\n                            <svg class="icon icon--extra-big icon--white">\n                                <use xlink:href="./assets/img/icon.svg#previous"></use>\n                            </svg>\n                        </button>\n                        <button type="button" class="button button--big" data-id="next" aria-label="${window.translation.translation.next}" >\n                            <svg class="icon icon--extra-big icon--white rotate-180">\n                                <use xlink:href="./assets/img/icon.svg#previous"></use>\n                            </svg>\n                        </button>\n                    </div>\n                    <footer class="button-wrapper modal__footer center ${this.cssHide}">\n                        <button type="button" class="button button--regular button--green" data-id="confirm"></button>\n                        <button type="button" class="button button--regular button--grey" data-id="cancel"></button>\n                    </footer>\n                </div>\n            </div>\n        `;this.elBody.insertAdjacentHTML("afterbegin",t)}buildTranslation(){this.elModalFooterConfirm.innerHTML=window.translation.translation.confirm,this.elModalFooterCancel.innerHTML=window.translation.translation.cancel}buildKeyboard(){window.addEventListener("keyup",t=>{if("Escape"===t.key&&this.isModalOpen&&this.closeModal(),"ArrowLeft"===t.key){if(!this.isModalOpen)return;if(this.elModalNavigationArrowLeft.classList.contains(this.cssHide))return;this.elModalNavigationArrowLeft.click()}if("ArrowRight"===t.key){if(!this.isModalOpen)return;if(this.elModalNavigationArrowRight.classList.contains(this.cssHide))return;this.elModalNavigationArrowRight.click()}})}buildMenuGallery(){this.elGallery&&(Array.prototype.forEach.call(this.elGallery,t=>{let e=t.querySelectorAll("a");Array.prototype.forEach.call(e,t=>{t.addEventListener("click",e=>{e.preventDefault(),this.buildModal("gallery",!1,"full"),this.buildGalleryImage(t.getAttribute("href"),t.querySelector("img").getAttribute("data-description")),this.buildGalleryNavigation(t)})})}),this.elModalNavigationArrowLeft.addEventListener("click",()=>{this.targetBuildGalleryChange.previousElementSibling.click()}),this.elModalNavigationArrowRight.addEventListener("click",()=>{this.targetBuildGalleryChange.nextElementSibling.click()}))}buildMenu(){this.elModalClose.addEventListener("click",()=>{this.closeModal()}),document.addEventListener("click",t=>{t.target.matches("button *, a *")}),this.elModalFooter.querySelector('[data-id="cancel"]').addEventListener("click",()=>{this.closeModal()})}buildGalleryNavigation(t){let e=[],i=t.parentNode.parentNode,o=i.querySelectorAll("a").length-1;Array.prototype.forEach.call(i.querySelectorAll("a"),t=>{e.push(t)});let s=e.indexOf(t);o>0?(this.elModalNavigationArrow.classList.remove(this.cssHide),this.targetBuildGalleryChange=t,s<=0?this.elModalNavigationArrowLeft.classList.add(this.cssHide):this.elModalNavigationArrowLeft.classList.remove(this.cssHide),s>=o?this.elModalNavigationArrowRight.classList.add(this.cssHide):this.elModalNavigationArrowRight.classList.remove(this.cssHide)):this.elModalNavigationArrow.classList.add(this.cssHide)}buildModal(t){this.elModalFooter.classList.add(this.cssHide),void 0===t.action?this.openModal():this.closeModal(),void 0!==t.click&&this.buildContentConfirmationAction(t.click),this.buildModalSize(t.size),this.buildModalKind(t)}buildModalKind(t){switch("ajax"===t.kind&&this.buildContentAjax(t.content),"confirmation"===t.kind&&this.buildContentConfirmation(t.content),t.kind){case"gallery":this.elModalNavigationArrow.classList.remove("hide");break;default:this.elModalNavigationArrow.classList.add("hide")}}openModal(){this.isModalOpen=!0,this.elBody.classList.remove("overflow-y"),this.elBody.classList.add("overflow-hidden"),this.elBody.style.overflowY="hidden",this.elModal.classList.remove(this.cssClose),this.elModalBox.classList.add("modal-animate")}closeModal(){this.isModalOpen=!1,this.elBody.classList.add("overflow-y"),this.elBody.classList.remove("overflow-hidden"),this.elBody.style.overflowY="auto",this.elBody.style.position="relative",this.elModal.classList.add(this.cssClose),this.elModalBox.classList.remove("modal-animate"),this.resetOtherClass()}buildModalSize(t="regular"){Array.prototype.forEach.call(["extra-small","small","regular","big","extra-big","full"],t=>{this.elModalBox.classList.remove(`modal--${t}`)}),this.elModalBox.classList.add(`modal--${t}`)}buildContentAjax(t){let e=this,i=new XMLHttpRequest;i.onreadystatechange=function(){4===this.readyState&&200===this.status&&(e.elModalContent.innerHTML=this.responseText,e.resetOtherClass())},i.open("GET",t,!0),i.send()}buildGalleryImage(t,e){const i=`<img src="${t}" class="img-responsive" style="margin:auto;" title="" alt=""/>`;this.elModalContent.innerHTML=i,this.changeText(e)}buildContentConfirmation(t){const e=`<div class="center">${t}</div>`;this.elModalFooter.classList.remove(this.cssHide),this.elModalContent.innerHTML=e}buildContentConfirmationAction(t){this.elModalFooterConfirm.setAttribute("onclick",t)}changeText(t){if(""===t||null===t)return;const e=`<p class="modal__description">${t}</p>`;"string"!=typeof t&&this.elModalContent.insertAdjacentHTML("beforeend",e)}resetOtherClass(){void 0!==window.menuDropDown&&window.menuDropDown.reset(),void 0!==window.menuToggle&&window.menuToggle.build(),void 0!==window.menuTab&&window.menuTab.build(),void 0!==window.lazyLoad&&window.lazyLoad.build()}};export class Notification{constructor(){this.elBody=document.querySelector("body"),this.elNotificationId="notification",this.colorDefault="grey",this.notificationId=0}build(){this.buildHtml(),this.update()}update(){this.elNotification=document.querySelector(`#${this.elNotificationId}`)}buildHtml(){const t=`<div id="${this.elNotificationId}" class="${this.elNotificationId} ${this.elNotificationId}--default"></div>`;this.elBody.insertAdjacentHTML("beforeend",t)}buildHtmlItem(t){const e=void 0!==t.color?t.color:this.colorDefault,i=void 0!==window.translation?window.translation.translation.close:"close";return`\n            <div class="${this.elNotificationId}__item ${this.elNotificationId}--regular ${this.elNotificationId}--${e}" id="${this.elNotificationId+this.notificationId}">\n                <span class="${this.elNotificationId}__text">${t.text}</span>\n                <button type="button" class="button button--small button--small--proportional button--transparent" onclick="this.parentNode.remove();" aria-label="${i}">\n                    <svg class="icon icon--regular rotate-45">\n                        <use xlink:href="./assets/img/icon.svg#plus"></use>\n                    </svg>\n                </button>\n            </div>\n        `}add(t){t.text&&(this.placeItem(t),this.remove(document.querySelector(`#${this.elNotificationId}${this.notificationId}`),t.text.length),this.notificationId++)}placeItem(t){let e=this.buildHtmlItem(t),i="";if(void 0===t.place)i=this.elNotification;else{let o=document.querySelector(t.place).querySelector(`.${this.elNotificationId}`);if(null===o){e=`<div class="${this.elNotificationId}">${e}</div>`,i=document.querySelector(t.place)}else i=o}i.insertAdjacentHTML("beforeend",e)}remove(t,e){setTimeout(()=>{this.removeItem(t)},150*e)}removeItem(t){void 0!==t&&null!==t.parentNode&&t.parentNode.removeChild(t)}};export class Table{constructor(){this.elTable=document.querySelectorAll(".table"),this.cssResponsive="table-responsive"}build(){this.elTable.length<1||this.buildResponsive()}buildResponsive(){Array.prototype.forEach.call(this.elTable,t=>{window.helper.wrap({target:t,css:this.cssResponsive}),window.helper.wrap({target:t.parentNode.parentNode.querySelector(`.${this.cssResponsive}`),css:`wrapper-${this.cssResponsive}`})})}};export class Translation{constructor(){this.translation="",this.translationEn={cancel:"Cancel",close:"Close",confirm:"Confirm",input_upload:"Select File...",next:"Next",previous:"Previous"},this.translationEs={cancel:"Cancelar",close:"Cerrar",confirm:"Confirmar",input_upload:"Seleccione Archivo...",next:"Siguiente",previous:"Anterior"},this.translationPt={cancel:"Cancelar",close:"Fechar",confirm:"Confirmar",input_upload:"Selecione o Arquivo...",next:"Próximo",previous:"Anterior"}}build(){this.defineLanguege()}defineLanguege(){const t=globalLanguage.charAt(0).toUpperCase()+globalLanguage.slice(1);this.translation=this[`translation${t}`]}};export class Helper{constructor(){this.cssDisplayNone="display-none"}addChange(t,e){t&&this.addEvent({el:t,action:e,event:"change"})}addClick(t,e){t&&this.addEvent({el:t,action:e,event:"click"})}addEvent(t){const e=t.action,i=t.el,o=t.event;i&&(i.removeEventListener(o,e),i.addEventListener(o,e))}addClass(t,e){if(t&&e)if(e instanceof Array)for(let i in e)t.classList.add(e[i]);else t.classList.add(e)}ajax(t){return new Promise((e,i)=>{const o=void 0===t.controller?"php/controller2.php":t.controller,s=void 0!==t.token?`&t=${t.token}`:`&t=${objGameLayout.token}`,l=void 0===t.kind?"POST":t.kind;let a=new XMLHttpRequest;a.open(l,o,!0),a.setRequestHeader("Content-type","application/x-www-form-urlencoded"),a.onload=(()=>{a.status>=200&&a.status<300?e(a.responseText):i(a.statusText)}),a.onerror=(()=>i(a.statusText)),a.send(s+t.parameter)})}capitalize(t){return t.charAt(0).toUpperCase()+t.slice(1)}findInObject(t){const e=t.target,i=t.search,o=t.value,s=t.get,l=e.length;for(let t=0;t<l;t++){const l=e[t];if(l[i]==o)return!1!==s?l[s]:t}}getSize(t){return parseFloat(getComputedStyle(t.el,null)[t.value].replace("px",""))}getTranslateValue(t){if(void 0===t)return;const e=window.getComputedStyle(t).transform;if("none"===e)return{x:0,y:0,z:0};const i=e.includes("3d")?"3d":"2d",o=e.match(/matrix.*\((.+)\)/)[1].split(", ");return"2d"===i?{x:Number(o[4]),y:Number(o[5]),z:0}:"3d"===i?{x:Number(o[12]),y:Number(o[13]),z:Number(o[14])}:void 0}getUrlParameter(t){const e=top.location.search.substring(1).split("&");for(let i=0;i<e.length;i++){let o=e[i].split("=");if(o[0]===t)return o[1]}}getUrlWord(t){return new RegExp("\\b"+t+"\\b","i").test(window.location.href)}height(t){return this.getSize({el:t,value:"height"})}hide(t){this.addClass(t,this.cssDisplayNone)}randomInArray(t){const e=Math.random()*t.length;return t[Math.floor(e)]}randomNumber(t){const e=Math.random()*t;return Math.floor(e)}sortSelect(t){const e=t.options.length;let i=[];for(let o=0;o<e;o++)i[o]=[],i[o][0]=t.options[o].text,i[o][1]=t.options[o].value;for(i.sort();t.options.length>0;)t.options[0]=null;for(let e=0;e<i.length;e++){let o=new Option(i[e][0],i[e][1]);t.options[e]=o}}offset(t){let e=t.getBoundingClientRect();const i=window.pageXOffset||document.documentElement.scrollLeft,o=window.pageYOffset||document.documentElement.scrollTop;return{top:e.top+o,left:e.left+i}}remove(t){t&&null!==t.parentNode&&t.parentNode.removeChild(t)}removeClass(t,e){if(t&&e)if(e instanceof Array)for(let i in e)this.removeClassDo(t,e[i]);else this.removeClassDo(t,e)}removeClassDo(t,e){t.classList.contains(e)&&t.classList.remove(e)}removeInArray(t){const e=t.arr,i=e.indexOf(t.value);e.splice(i,1)}show(t){this.removeClass(t,this.cssDisplayNone)}trigger(t,e){const i=new Event(e);t.dispatchEvent(i)}useStorage(t){const e=t.target;switch(t.action){case"set":window.localStorage.setItem("october_31_"+e,t.value);break;case"get":return window.localStorage.getItem("october_31_"+e);case"remove":window.localStorage.removeItem("october_31_"+e)}}validateEmptySpace(t){return-1!==t.value.indexOf(" ")}verifyUrlRoute(t){return window.location.pathname.split("/").indexOf(t)>-1}width(t){return this.getSize({el:t,value:"width"})}wrap(t){const e=document.createElement("div");e.className=t.css,t.target.parentNode.insertBefore(e,t.target),e.appendChild(t.target)}};