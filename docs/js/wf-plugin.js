var isLocal = location.hostname === "localhost" || location.hostname === "127.0.0.1" ? true : false;
var urlLocal = 'https://localhost/d/development/project/october-31/october-31-assets/docs/img/site/5-0-0/';
var urlAssets = 'https://winterjeferson.github.io/october-31-assets/img/site/5-0-0/';
var urlFinal = isLocal ? urlLocal : urlAssets;

var translationEN={cancel:"Cancel",close:"Close",confirm:"Confirm",input_upload:"Select File...",next:"Next",previous:"Previous"},translationES={cancel:"Cancelar",close:"Cerrar",confirm:"Confirmar",input_upload:"Seleccione Archivo...",next:"Siguiente",previous:"Anterior"},translationPT={cancel:"Cancelar",close:"Fechar",confirm:"Confirmar",input_upload:"Selecione o Arquivo...",next:"Próximo",previous:"Anterior"};function getUrlParameter(t){let e=top.location.search.substring(1).split("&");for(let i=0;i<e.length;i++){let o=e[i].split("=");if(o[0]===t)return o[1]}}function getUrlWord(t){return new RegExp("\\b"+t+"\\b","i").test(window.location.href)}function offset(t){var e=t.getBoundingClientRect(),i=window.pageXOffset||document.documentElement.scrollLeft,o=window.pageYOffset||document.documentElement.scrollTop;return{top:e.top+o,left:e.left+i}}function verifyUrlRoute(t){return window.location.pathname.split("/").indexOf(t)>-1}function wrapItem(t,e){let i=document.createElement("div");i.className=e,t.parentNode.insertBefore(i,t),i.appendChild(t)}class WfCarousel{constructor(){this.$carousel=document.querySelectorAll(".carousel"),this.classDisplay="display-none",this.counterCurrent=0,this.transition=5}build(){this.$carousel.length<1||(this.interval=setInterval(this.verifyInternval,1e3),this.buildLayout(),this.buildNavigation(),this.watchResize())}buildLayout(){let t=this;Array.prototype.forEach.call(this.$carousel,function(e){let i=e.querySelectorAll(".carousel-list li").length;t.resizeLayout(e),t.buildLayoutController(e,i),t.defineActive(e.querySelector('[data-id="'+e.getAttribute("data-current-slide")+'"]')),1===i&&(e.querySelector('[data-id="navLeft"]').classList.add(t.classDisplay),e.querySelector('[data-id="navRight"]').classList.add(t.classDisplay),e.querySelector(".carousel-controller").classList.add(t.classDisplay))})}watchResize(){let t=this;window.onresize=function(){Array.prototype.forEach.call(t.$carousel,function(e){let i=e.parentNode.parentNode.parentNode.parentNode,o=i.querySelector(".carousel-list");t.defineActive(i.querySelector('[data-id="0"]')),t.animate(0,o,"arrow")})}}buildLayoutController(t,e){let i="";for(let t=0;t<e;t++)i+=`\n                <li>\n                    <button type="button" class="bt-sm carousel-controller-bt" data-id="${t}" aria-hidden="true">\n                        <span aria-hidden="true">&bull;</span>\n                    </button>\n                </li>\n            `;t.querySelector(".carousel-controller").innerHTML=i}buildNavigation(){let t=this,e=document.querySelectorAll(".carousel");Array.prototype.forEach.call(e,function(e){t.buildNavigationControllerBt(e),t.buildNavigationArrowLeft(e),t.buildNavigationArrowRight(e)})}buildNavigationControllerBt(t){let e=this,i=t.querySelectorAll(".carousel-controller-bt");Array.prototype.forEach.call(i,function(t){t.onclick=function(){t.parentNode.parentNode.parentNode.parentNode.querySelector('[data-current-slide="'+t.getAttribute("data-id")+'"]'),e.defineActive(t),e.animate(t.getAttribute("data-id"),t,"navigation")}})}buildNavigationArrowLeft(t){let e=this,i=t.querySelector('[data-id="navLeft"]');i.onclick=function(){let t=i.parentNode.parentNode.parentNode.parentNode,o=t.querySelector(".carousel-list"),l=Number(o.querySelectorAll("li").length),s=Number(t.getAttribute("data-current-slide")),n=0;0===s?(n=l-1,t.setAttribute("data-current-slide",n)):(n=s-1,t.setAttribute("data-current-slide",n)),e.defineActive(t.querySelector('[data-id="'+n+'"]')),e.animate(n,o,"arrow")}}buildNavigationArrowRight(t){let e=this,i=t.querySelector('[data-id="navRight"]');i.onclick=function(){let t=i.parentNode.parentNode.parentNode.parentNode,o=t.querySelector(".carousel-list"),l=Number(o.querySelectorAll("li").length),s=Number(t.getAttribute("data-current-slide")),n=0;s===l-1?(n=0,t.setAttribute("data-current-slide",n)):(n=s+1,t.setAttribute("data-current-slide",n)),e.defineActive(t.querySelector('[data-id="'+n+'"]')),e.animate(n,o,"arrow")}}animate(t,e,i){let o="arrow"===i?e.parentNode.parentNode.parentNode.querySelector(".carousel-list"):e.parentNode.parentNode.parentNode.parentNode.querySelector(".carousel-list"),l=o.parentNode.parentNode.parentNode,s=Number(o.querySelector("li").offsetWidth),n=Number(t*s);switch(l.getAttribute("data-style")){case"fade":Array.prototype.forEach.call(o.querySelectorAll("li"),function(t){t.style.opacity=0}),o.querySelector("li").style.transition=".7s",o.querySelectorAll("li")[t].style.opacity=1,o.querySelectorAll("li")[t].style.left="-"+n+"px",o.querySelectorAll("li")[t].style.transition=".7s";break;default:o.style.transform="translateX(-"+n+"px)"}}verifyInternval(){let t=objWfCarousel;t.counterCurrent++,t.counterCurrent>=t.transition&&(t.counterCurrent=0,Array.prototype.forEach.call(t.$carousel,function(t){t.querySelector('[data-id="navRight"]').click()}))}defineActive(t){let e=t.parentNode.parentNode.querySelectorAll(".carousel-controller-bt");Array.prototype.forEach.call(e,function(t){t.classList.remove("active")}),t.classList.add("active")}resizeLayout(t){let e=t.querySelector(".carousel-list"),i=e.querySelectorAll("li"),o=i.length;e.style.width=100*+o+"%",Array.prototype.forEach.call(i,function(t){t.style.width=100/o+"%"})}}class WfForm{build(){document.querySelectorAll("form").length<1||(this.buildKeyboard(),this.buildInputFile())}buildKeyboard(){let t=this;window.addEventListener("keyup",function(e){13===e.keyCode&&(t.buildFocus(".radio"),t.buildFocus(".checkbox"),t.buildFocus(".input-switch"))})}buildFocus(t){let e=document.querySelectorAll(t);Array.prototype.forEach.call(e,function(t){let e=t.querySelector("input");document.activeElement==t&&e.click()})}buildInputFile(){let t=this;Array.prototype.forEach.call(document.querySelectorAll('input[type="file"]'),function(e){let i=e.parentNode;e.getAttribute("style")&&-1!=e.getAttribute("style").indexOf("display:")||(e.style.display="none",i.insertAdjacentHTML("beforeend",t.buildInputFileHtml()),i.setAttribute("tabIndex",0),i.style.outline=0,document.activeElement==i&&i.querySelector(".input-file").classList.add("focus"),e.addEventListener("focusout",function(){i.querySelector(".input-file").classList.remove("focus")}),t.buildInputFileAddAction(e))})}buildInputFileAddAction(t){let e=t.parentNode,i=e.querySelector(".input-file-name"),o=e.querySelector('input[type="file"]');e.addEventListener("click",function(){o.click()}),o.addEventListener("change",function(){i.innerHTML=o.value})}buildInputFileHtml(){let t="";return t+='<div class="input-file">',t+='    <div class="input-file-name"></div>',t+='    <div class="input-file-text"><span class="fa fa-upload" aria-hidden="true"></span>&nbsp; '+objWfTranslation.translation.input_upload+"</div>",t+="</div>"}validateEmpty(t){let e=t,i=e.length;for(let t=0;t<i;t++)if(""===e[t].value)return e[t].focus(),!1;return!0}}class WfLayout{constructor(){this.$body=document.querySelector("body"),this.breakPointExtraSmall=0,this.breakPointSmall=576,this.breakPointMedium=768,this.breakPointBig=992,this.breakPointExtraBig=1200,this.breakPointFullHd=1920}}class WfLazyLoad{build(){document.querySelectorAll('[data-lazy-load="true"]').length<1||(this.addListener(),this.buildLoop())}addListener(){let t=this;window.addEventListener("scroll",function(e){window.requestAnimationFrame(function(){t.buildLoop()})})}buildLoop(){let t=this,e=document.querySelectorAll('[data-lazy-load="true"]');Array.prototype.forEach.call(e,function(e){t.verifyPosition(e)})}verifyPosition(t){window.scrollY>=offset(t).top-window.outerHeight&&this.buildImage(t)}buildImage(t){t.setAttribute("src",t.getAttribute("data-src")),t.removeAttribute("data-lazy-load")}}class WfMask{constructor(){this.$inputMask=document.querySelectorAll("[data-mask]")}build(){this.$inputMask.length<1||this.addListener()}addListener(){let t=this;this.$inputMask.forEach(e=>{e.addEventListener("input",i=>{let o=i.target.value,l=e.dataset.mask,s=l.charAt(0).toUpperCase()+l.slice(1);i.target.value=t["mask"+s](o)})})}maskCep(t){return t.replace(/\D/g,"").replace(/(\d{5})(\d)/,"$1-$2").replace(/(-\d{3})\d+?$/,"$1")}maskCpf(t){return t.replace(/\D/g,"").replace(/(\d{3})(\d)/,"$1.$2").replace(/(\d{3})(\d)/,"$1.$2").replace(/(\d{3})(\d{1,2})/,"$1-$2").replace(/(-\d{2})\d+?$/,"$1")}maskCnpj(t){return t.replace(/\D/g,"").replace(/(\d{2})(\d)/,"$1.$2").replace(/(\d{3})(\d)/,"$1.$2").replace(/(\d{3})(\d)/,"$1/$2").replace(/(\d{4})(\d)/,"$1-$2").replace(/(-\d{2})\d+?$/,"$1")}maskDate(t){return t.replace(/\D/g,"").replace(/(\d{2})(\d)/,"$1/$2").replace(/(\d{2})(\d)/,"$1/$2").replace(/(\d{4})(\d)/,"$1")}maskPhone(t){return t.replace(/\D/g,"").replace(/(\d{2})(\d)/,"($1) $2").replace(/(\d{4})(\d)/,"$1-$2").replace(/(\d{4})-(\d)(\d{4})/,"$1$2-$3").replace(/(-\d{4})\d+?$/,"$1")}maskPis(t){return t.replace(/\D/g,"").replace(/(\d{3})(\d)/,"$1.$2").replace(/(\d{5})(\d)/,"$1.$2").replace(/(\d{5}\.)(\d{2})(\d)/,"$1$2-$3").replace(/(-\d)\d+?$/,"$1")}}class WfMenuDropDown{update(){this.isClickBuild=!1,this.classMenu="menu-drop-down",this.classArrow="bt-arrow",this.classMenuText=this.classMenu+"-text",this.classShowMobile="mobile-show",this.$menu=document.querySelectorAll("."+this.classMenu+" , ."+this.classMenuText),this.$menuDropDownUl=document.querySelectorAll("."+this.classMenu+" ul , ."+this.classMenuText+" ul"),this.$menuDropDownLi=document.querySelectorAll("."+this.classMenu+" ul li , ."+this.classMenuText+" ul li"),this.$icon=`\n            <svg class="icon icon-re ${this.classArrow}">\n                <use xlink:href="${urlFinal}icon.svg#triangle"></use>\n            </svg>\n        `}build(){this.update(),this.$menu.length<1||(this.buildIcon(),this.isClickBuild||(this.isClickBuild=!0,this.buildClick()),this.buildClickOut())}buildIcon(){let t=this,e=document.querySelectorAll("."+this.classMenu+" ul > li > ul , ."+this.classMenuText+" ul > li > ul");Array.prototype.forEach.call(e,function(e){document.body.contains(e.parentNode.querySelector(".bt ."+t.classArrow+" , .link ."+t.classArrow))||e.parentNode.querySelector(".bt , .link").insertAdjacentHTML("beforeend",t.$icon)})}buildClick(){let t=this;Array.prototype.forEach.call(this.$menu,function(e){let i=e.querySelectorAll("li > .bt , li > .link"),o=e.querySelectorAll("ul > li > ul > li > .bt , ul > li > ul > li > .link");Array.prototype.forEach.call(i,function(e){e.addEventListener("click",function(){t.buildClickAction(e)})}),Array.prototype.forEach.call(o,function(e){e.addEventListener("click",function(){e.parentNode.parentNode.classList.remove(t.classShowMobile)})})})}buildClickAction(t){let e=t.parentNode.querySelector("ul");if(!document.body.contains(e))return;let i=e.parentNode.parentNode.parentNode.querySelector("ul > li > ul");i.classList.contains(this.classShowMobile)&&i.classList.remove(this.classShowMobile),e.classList.contains(this.classShowMobile)?e.classList.remove(this.classShowMobile):e.classList.add(this.classShowMobile),e.classList.remove(self.classShowMobile),e.style.opacity=1}buildClickOut(){document.addEventListener("click",this.listener,!0)}listener(t){t.toElement.classList.contains("bt")||t.toElement.classList.contains("link")||Array.prototype.forEach.call(document.querySelectorAll("."+objWfMenuDropDown.classShowMobile),function(t){t.classList.remove(objWfMenuDropDown.classShowMobile)})}reset(){document.removeEventListener("click",event,!0),document.removeEventListener("click",this.listener,!0),objWfMenuDropDown.build()}}class WfMenuTab{build(){this.defineActive()}defineActive(){let t=this,e=document.querySelectorAll(".menu-tab > ul > li > .bt");Array.prototype.forEach.call(e,function(e){e.addEventListener("click",function(){t.buildClick(e)})})}buildClick(t){let e=t.parentNode.parentNode.querySelectorAll("li");Array.prototype.forEach.call(e,function(t){t.classList.remove("menu-tab-active")}),t.parentNode.classList.add("menu-tab-active")}}class WfMenuToggle{build(){this.updateVariable(),this.buildBt(),this.watchResize()}updateVariable(){this.$bt=document.querySelectorAll(".bt-toggle")}buildBt(){Array.prototype.forEach.call(this.$bt,function(t,e){t.onclick=function(){let e=t.parentNode.querySelector("nav > ul"),i=t.parentNode.querySelector("nav ul");e.classList.contains("mobile-show")?(e.classList.remove("mobile-show"),i.classList.remove("mobile-show")):e.classList.add("mobile-show")}})}watchResize(){let t=this;window.onresize=function(){t.build()}}reset(){this.build()}}class WfModal{updateVariable(){this.targetBuildGalleryChange="",this.cssDisplay="display-none",this.isModalOpen=!1,this.$body=document.querySelector("body"),this.$modal=document.querySelector("#modal"),this.$modalFooter=this.$modal.querySelector("footer"),this.$modalFooterConfirm=this.$modalFooter.querySelector('[data-id="confirm"]'),this.$modalFooterCancel=this.$modalFooter.querySelector('[data-id="cancel"]'),this.$modalClose=document.querySelector("#modalClose"),this.$modalContent=document.querySelector("#modalContent"),this.$modalBox=this.$modal.querySelector(".modal-box"),this.$modalNavigationArrow=this.$modal.querySelector(".navigation-arrow"),this.$modalNavigationArrowLeft=this.$modalNavigationArrow.querySelector('[data-id="navLeft"]'),this.$modalNavigationArrowRight=this.$modalNavigationArrow.querySelector('[data-id="navRight"]'),this.$gallery=document.querySelectorAll(".gallery")}build(){this.buildHtml(),this.updateVariable(),this.buildMenu(),this.buildMenuGallery(),this.buildKeyboard(),this.buildTranslation()}buildHtml(){let t=`\n            <div id="modal" class="modal-close">\n                <div class="modal-box">\n                    <header>\n                        <button id="modalClose" type="button" aria-label="${objWfTranslation.translation.close}" class="bt bt-sm bt-grey bt-transparent">\n                            <svg class="icon icon-bi rotate-45">\n                                <use xlink:href="${urlFinal}icon.svg#plus"></use>\n                            </svg>\n                        </button>\n                    </header>\n                    <div class="row">\n                        <div id="modalContent" class="col-es-12"></div>\n                    </div>\n                    <div class="menu-horizontal">\n                        <ul class="navigation-arrow">\n                            <li>\n                                <button type="button" class="bt bt-bi" data-id="navLeft" aria-label="${objWfTranslation.translation.previous}" >\n                                    <svg class="icon icon-eb">\n                                        <use xlink:href="${urlFinal}icon.svg#previous"></use>\n                                    </svg>\n                                </button>\n                            </li>\n                            <li>\n                                <button type="button" class="bt bt-bi" data-id="navRight" aria-label="${objWfTranslation.translation.next}" >\n                                    <svg class="icon icon-eb rotate-180">\n                                        <use xlink:href="${urlFinal}icon.svg#previous"></use>\n                                    </svg>\n                                </button>\n                            </li>\n                        </ul>\n                    </div>\n                    <footer class="display-none text-center">\n                        <div class="menu menu-horizontal">\n                            <ul>\n                                <li>\n                                    <button type="button" class="bt bt-re bt-green" data-id="confirm"></button>\n                                </li>\n                                <li>\n                                    <button type="button" class="bt bt-re bt-grey" data-id="cancel"></button>\n                                </li>\n                            </ul>\n                        </div>\n                    </footer>\n                </div>\n            </div>\n        `;document.querySelector("body").insertAdjacentHTML("afterbegin",t)}buildTranslation(){this.$modalFooterConfirm.innerHTML=objWfTranslation.translation.confirm,this.$modalFooterCancel.innerHTML=objWfTranslation.translation.cancel}buildKeyboard(){let t=this;window.addEventListener("keyup",function(e){if(27===e.keyCode&&t.isModalOpen&&t.closeModal(),37===e.keyCode){if(!t.isModalOpen)return;if(t.$modalNavigationArrowLeft.classList.contains(t.cssDisplay))return;t.$modalNavigationArrowLeft.click()}if(39===e.keyCode){if(!t.isModalOpen)return;if(t.$modalNavigationArrowRight.classList.contains(t.cssDisplay))return;t.$modalNavigationArrowRight.click()}})}buildMenuGallery(){let t=this;this.$gallery&&(Array.prototype.forEach.call(this.$gallery,function(e){let i=e.querySelectorAll("a");Array.prototype.forEach.call(i,function(e){e.addEventListener("click",function(i){i.preventDefault(),t.buildModal("gallery",!1,"fu"),t.buildGalleryImage(e.getAttribute("href"),e.querySelector("img").getAttribute("data-description")),t.buildGalleryNavigation(e)})})}),this.$modalNavigationArrowLeft.addEventListener("click",function(){t.targetBuildGalleryChange.parentNode.previousElementSibling.querySelector("a").click()}),this.$modalNavigationArrowRight.addEventListener("click",function(){t.targetBuildGalleryChange.parentNode.nextElementSibling.querySelector("a").click()}))}buildMenu(){let t=this;this.$modalClose.addEventListener("click",function(){t.closeModal()}),document.addEventListener("click",function(t){t.target.matches("button *, a *")}),this.$modalFooter.querySelector('[data-id="cancel"]').addEventListener("click",function(e){t.closeModal()})}buildGalleryNavigation(t){let e=[],i=t.parentNode.parentNode,o=i.querySelectorAll("a").length-1;Array.prototype.forEach.call(i.querySelectorAll("a"),function(t){e.push(t)});let l=e.indexOf(t);o>0?(this.$modalNavigationArrow.classList.remove(this.cssDisplay),this.targetBuildGalleryChange=t,l<=0?this.$modalNavigationArrowLeft.classList.add(this.cssDisplay):this.$modalNavigationArrowLeft.classList.remove(this.cssDisplay),l>=o?this.$modalNavigationArrowRight.classList.add(this.cssDisplay):this.$modalNavigationArrowRight.classList.remove(this.cssDisplay)):this.$modalNavigationArrow.classList.add(this.cssDisplay)}buildModal(t,e,i="re",o="open"){this.$modalFooter.classList.add(this.cssDisplay),"open"===o?this.openModal():this.closeModal(),this.buildModalSize(i),this.buildModalKind(t,e)}buildModalKind(t,e){switch("ajax"===t&&this.buildContentAjax(e),"confirmation"===t&&this.buildContentConfirmation(e),t){case"gallery":this.$modalNavigationArrow.classList.remove("arrow-inactive"),this.$modalNavigationArrow.classList.add("arrow-active");break;default:this.$modalNavigationArrow.classList.remove("arrow-active"),this.$modalNavigationArrow.classList.add("arrow-inactive")}}openModal(){this.isModalOpen=!0,this.$body.classList.remove("overflow-y"),this.$body.classList.add("overflow-hidden"),this.$body.style.overflowY="hidden",this.$modal.classList.remove("modal-close"),this.$modalBox.classList.add("modal-animate")}closeModal(){this.isModalOpen=!1,this.$body.classList.add("overflow-y"),this.$body.classList.remove("overflow-hidden"),this.$body.style.overflowY="auto",this.$body.style.position="relative",this.$modal.classList.add("modal-close"),this.$modalBox.classList.remove("modal-animate"),this.resetOtherClass()}buildModalSize(t="re"){this.$modalBox.classList.remove("modal-es"),this.$modalBox.classList.remove("modal-sm"),this.$modalBox.classList.remove("modal-re"),this.$modalBox.classList.remove("modal-bi"),this.$modalBox.classList.remove("modal-eb"),this.$modalBox.classList.remove("modal-fu"),this.$modalBox.classList.add("modal-"+t)}buildContentAjax(t){let e=this,i=new XMLHttpRequest;i.onreadystatechange=function(){4==this.readyState&&200==this.status&&(e.$modalContent.innerHTML=this.responseText,e.resetOtherClass())},i.open("GET",t,!0),i.send()}buildGalleryImage(t,e){let i='<img src="'+t+'" class="img-responsive" style="margin:auto;" title="" alt=""/>';this.$modalContent.innerHTML=i,this.changeText(e)}buildContentConfirmation(t){let e='<div class="padding-re text-center">'+t+"</div>";this.$modalFooter.classList.remove(this.cssDisplay),this.$modalContent.innerHTML=e}buildContentConfirmationAction(t){this.$modalFooterConfirm.setAttribute("onclick",t)}changeText(t){let e="";""!==t&&null!==t&&(e+='<p class="modal-description">',e+=t,e+="</p>",void 0!==t&&this.$modalContent.insertAdjacentHTML("beforeend",e))}resetOtherClass(){void 0!==objWfForm&&objWfForm.buildInputFile(),void 0!==objWfMenuDropDown&&objWfMenuDropDown.reset(),void 0!==objWfMenuToggle&&objWfMenuToggle.build(),void 0!==objWfTooltip&&objWfTooltip.reset(),void 0!==objWfMenuTab&&objWfMenuTab.defineActive(),void 0!==objWfLazyLoad&&objWfLazyLoad.build()}}class WfNotification{constructor(){this.$body=document.querySelector("body"),this.$notifyItem=document.querySelectorAll(".notify-item"),this.notifyId=0}build(){this.buildHtml(),this.buildNavigation()}buildHtml(){this.$body.insertAdjacentHTML("beforeend",'\n            <div id="notify">\n                <ul class="notify-list">\n                </ul>\n            </div>\n        '),this.$notify=document.querySelector("#notify .notify-list")}buildHtmlItem(t="grey",e){return`\n            <li id="notify${this.notifyId}">\n                <div class="notify-item notify-${t}">\n                    <span class="text">${e}</span>\n                    <button type="button" class="bt" onclick="objWfNotification.remove(this.parentNode, 0)" aria-label="${objWfTranslation.translation.close}">\n                        <svg class="icon icon-re rotate-45">\n                            <use xlink:href="${urlFinal}icon.svg#plus"></use>\n                        </svg>\n                    </button>\n                </div>\n            </li>\n        `}buildNavigation(){Array.prototype.forEach.call(this.$notifyItem,function(t){let e=t.querySelectorAll(".bt");Array.prototype.forEach.call(e,function(t){t.addEventListener("click",function(){t.parentNode.parentNode.parentNode.removeChild(t.parentNode.parentNode)})})})}add(t,e,i=this.$notify){let o=this.buildHtmlItem(e,t),l="";if(!t)return!1;i!==this.$notify?((l="string"==typeof i?document.querySelector(i):i).querySelector(".notify-list")||l.insertAdjacentHTML("beforeend",'<ul class="notify-list"></ul>'),l.querySelector(".notify-list").insertAdjacentHTML("beforeend",o)):i.insertAdjacentHTML("beforeend",o),this.remove(document.querySelector("#notify"+this.notifyId),t.length),this.notifyId++}remove(t,e){setTimeout(function(){t.parentNode.removeChild(t)},150*e)}}class WfProgress{update(){this.isFinish=!1,this.progressSize=0,this.$loadingMain=document.getElementById("loadingMain"),this.$body=document.querySelector("body"),this.$bar=document.querySelector("#loadingMain").querySelector(".progress-bar"),this.$all=document.querySelectorAll("div, section, article"),this.$allLength=this.$all.length}build(){document.getElementById("loadingMain")<1||(this.update(),this.start())}start(){let t=this,e=setInterval(function(){let o=100*t.progressSize/i;t.progressSize++,t.$bar.style.width=o+"%",t.progressSize>=i&&(clearInterval(e),t.finish(),t.isFinish=!0)},1),i=this.buildProportion()}finish(){this.$loadingMain.classList.add("loading-main-done"),this.$body.style.overflowY="auto",setTimeout(this.remove(this.$loadingMain),1e3)}remove(t){t.parentNode.removeChild(t)}buildProportion(){return this.$allLength>1e3?this.$allLength/50:this.$allLength>900?this.$allLength/45:this.$allLength>800?this.$allLength/40:this.$allLength>700?this.$allLength/35:this.$allLength>600?this.$allLength/30:this.$allLength>500?this.$allLength/25:this.$allLength>400?this.$allLength/20:this.$allLength>300?this.$allLength/15:this.$allLength>200?this.$allLength/10:this.$allLength}}class WfTable{constructor(){this.$table=document.querySelectorAll(".table")}build(){this.$table.length<1||this.buildResponsive()}buildResponsive(){Array.prototype.forEach.call(this.$table,function(t){wrapItem(t,"table-responsive"),wrapItem(t.parentNode.parentNode.querySelector(".table-responsive"),"table-responsive-wrapper")})}}class WfTag{constructor(){this.$tagBt=document.querySelectorAll(".tag-item-bt")}build(){this.$tagBt.length<1||this.buildClick()}buildClick(){Array.prototype.forEach.call(this.$tagBt,function(t){let e=t.querySelector(".tag-bt");e.addEventListener("click",function(){e.parentNode.parentNode.parentNode.removeChild(e.parentNode.parentNode)})})}}class WfTooltip{constructor(){this.elementTop=0,this.elementLeft=0,this.elementWidth=0,this.elementHeight=0,this.elementLeft=0,this.style="black",this.space=5,this.currentWindowScroll=0,this.windowWidth=0,this.windowHeight=0,this.centerWidth=0,this.centerHeight=0,this.positionTop=0,this.positionLeft=0}build(){this.buildHtml(),this.updateVariable(!1),this.$tooltipData.length<1||(this.buildMaxWidth(),this.buildResize(),this.buildTooltip())}updateVariable(t){this.$tooltip=document.querySelector("#tooltip"),this.$tooltipBody=document.querySelector("#tooltipBody"),this.$tooltipPointer=document.querySelector("#tooltipPointer"),this.$tooltipData=document.querySelectorAll('[data-tooltip="true"]'),this.windowWidth=window.offsetWidth,this.windowHeight=window.offsetHeight,this.currentWindowScroll=window.scrollY,this.elementTop=!1!==t?offset(t).top:0,this.elementLeft=!1!==t?offset(t).left:0,this.elementWidth=!1!==t?t.offsetWidth:0,this.elementHeight=!1!==t?t.offsetHeight:0,this.tooltipWidth=!1!==t?this.$tooltip.offsetWidth:0,this.tooltipHeight=!1!==t?this.$tooltip.offsetHeight:0,this.centerWidth=(this.tooltipWidth-this.elementWidth)/2,this.centerHeight=this.elementHeight/2-this.tooltipHeight/2,this.positionLeft=this.elementLeft-this.centerWidth,this.positionTop=this.elementTop-this.tooltipHeight-this.space}buildHtml(){document.querySelector("body").insertAdjacentHTML("beforeend",'\n            <div id="tooltip">\n                <div id="tooltipBody"></div>\n                <div id="tooltipPointer"></div>\n            </div>\n        ')}buildResize(){let t=this;window.onresize=function(){t.updateVariable(!1),t.buildMaxWidth()}}buildTooltip(){let t=this;this.showTooltip(!1),Array.prototype.forEach.call(this.$tooltipData,function(e){let i=e.getAttribute("title");void 0!==i&&null!==i&&""!==i&&(e.setAttribute("data-tooltip-text",i),e.removeAttribute("title"),e.onmouseover=function(){t.$tooltipBody.innerHTML=e.getAttribute("data-tooltip-text"),t.changeLayout(e.getAttribute("data-tooltip-color")),t.positionTooltip(e,e.getAttribute("data-tooltip-placement")),t.showTooltip(!0)},e.onmouseout=function(){t.showTooltip(!1)})})}buildMaxWidth(){this.$tooltip.style.maxWidth=this.windowWidth-2*this.space}showTooltip(t){t?this.$tooltip.classList.add("tooltip-show"):this.$tooltip.classList.remove("tooltip-show")}positionTooltipSwitchDirection(t){let e=void 0===t?"top":t;switch(e){case"top":this.elementTop-this.tooltipHeight<this.currentWindowScroll&&(e="bottom");break;case"right":this.elementLeft+this.tooltipWidth+this.elementWidth>this.windowWidth&&(e="left");break;case"bottom":this.elementTop+this.tooltipHeight+this.elementHeight>this.currentWindowScroll+this.windowHeight&&(e="top");break;case"left":this.tooltipWidth+this.space>this.elementLeft&&(e="right")}return e}positionTooltipTop(){this.positionTop=this.elementTop-this.tooltipHeight-this.space,this.positionLeft=this.elementLeft-this.centerWidth}positionTooltipBottom(){this.positionTop=this.elementTop+this.elementHeight+this.space,this.positionLeft=this.elementLeft-this.centerWidth}positionTooltipRight(){this.positionTop=this.elementTop+this.centerHeight,this.positionLeft=this.elementLeft+this.elementWidth+this.space}positionTooltipLeft(){this.positionTop=this.elementTop+this.centerHeight,this.positionLeft=this.elementLeft-this.tooltipWidth-this.space}positionTooltip(t,e){this.positionLeft<=0&&(this.positionLeft=this.space),this.positionLeft+this.tooltipWidth>=this.windowWidth&&(this.positionLeft=this.windowWidth-this.tooltipWidth-this.space)}changeArrowPositionHorizontal(){this.$tooltipPointer.style.left=this.$tooltip.offsetWidth/2+"px"}changeArrowPositionVertical(){this.$tooltipPointer.style.left=""}changeArrowDirection(t){this.$tooltipPointer.classList.remove("tooltip-direction-top"),this.$tooltipPointer.classList.remove("tooltip-direction-bottom"),this.$tooltipPointer.classList.remove("tooltip-direction-left"),this.$tooltipPointer.classList.remove("tooltip-direction-right"),this.$tooltipPointer.classList.add("tooltip-direction-"+t)}changeLayout(t){let e=void 0===t?e=this.style:t;this.$tooltip.removeAttribute("class"),this.$tooltip.classList.add("tooltip"),this.$tooltip.classList.add("tooltip-"+e)}reset(){let t=document.getElementById("tooltip");t.parentNode.removeChild(t),objWfTooltip.build()}}class WfTranslation{constructor(){this.translation=""}build(){this.defineLanguege()}defineLanguege(){switch(globalLanguage){case"pt":this.translation=translationPT;break;case"en":this.translation=translationEN}}}class WfManagementPlugin{verifyLoad(){window.addEventListener("load",this.applyClass(),{once:!0})}applyClass(){objWfTranslation.build(),objWfProgress.build(),objWfForm.build(),objWfMask.build(),objWfModal.build(),objWfCarousel.build(),objWfLazyLoad.build(),objWfMenuDropDown.build(),objWfMenuTab.build(),objWfMenuToggle.build(),objWfNotification.build(),objWfTable.build(),objWfTag.build(),objWfTooltip.build()}}const objWfManagementPlugin=new WfManagementPlugin,objWfCarousel=new WfCarousel,objWfForm=new WfForm,objWfLayout=new WfLayout,objWfLazyLoad=new WfLazyLoad,objWfMask=new WfMask,objWfMenuDropDown=new WfMenuDropDown,objWfMenuTab=new WfMenuTab,objWfMenuToggle=new WfMenuToggle,objWfModal=new WfModal,objWfNotification=new WfNotification,objWfProgress=new WfProgress,objWfTable=new WfTable,objWfTag=new WfTag,objWfTooltip=new WfTooltip,objWfTranslation=new WfTranslation;objWfManagementPlugin.verifyLoad();