export class WbBlog{constructor(){this.classlaodMore="loadMore",this.classDisabled="button--disabled"}build(){getUrlWord("blog")&&(this.update(),this.buildMenu())}update(){this.page="pageBlog",this.$lastPost=document.querySelector("#"+this.page+"LastPost"),this.$mostViewed=document.querySelector("#"+this.page+"MostViewed")}buildMenu(){if(!this.$lastPost)return;let e=this.$lastPost.querySelector(`[data-id="${this.classlaodMore}"]`),t=this.$mostViewed.querySelector(`[data-id="${this.classlaodMore}"]`);document.contains(e)&&e.addEventListener("click",(()=>{this.loadMore(e)})),document.contains(t)&&t.addEventListener("click",(()=>{this.loadMore(t)}))}loadMore(e){let t=this,l=e.parentNode.parentNode.getAttribute("id"),s=l.substring(this.page.length),o=new XMLHttpRequest,i=objWbUrl.getController({folder:"blog",file:"LoadMore"}),a="&target="+s;e.classList.add(this.classDisabled),o.open("POST",i,!0),o.setRequestHeader("Content-type","application/x-www-form-urlencoded"),o.onreadystatechange=()=>{4===o.readyState&&200===o.status&&(e.classList.remove(this.classDisabled),t.loadMoreSuccess(l,o.responseText))},o.send(a)}loadMoreSuccess(e,t){let l=JSON.parse(t),s=document.querySelector("#"+e),o=s.querySelector(".blog-list"),i=s.querySelector('[data-id="'+this.classlaodMore+'"]');l[this.classlaodMore]||i.classList.add(this.classDisabled),o.insertAdjacentHTML("beforeend",l.html),window.scrollTo(0,document.documentElement.scrollTop+1),window.scrollTo(0,document.documentElement.scrollTop-1)}}export class WbForm{build(){getUrlWord("contact")&&(this.update(),this.buildMenu())}update(){this.elPage=document.getElementById("pageContact"),this.elForm=this.elPage.querySelector(".form"),this.elFormFieldName=this.elForm.querySelector('[data-id="fieldName"]'),this.elFormFieldEmail=this.elForm.querySelector('[data-id="fieldEmail"]'),this.elFormFieldMessage=this.elForm.querySelector('[data-id="fieldMessage"]'),this.elButtonSend=this.elPage.querySelector('[data-id="btSend"]')}buildMenu(){this.elButtonSend.addEventListener("click",(()=>{form.validateEmpty([this.elFormFieldEmail,this.elFormFieldMessage])&&this.send()}))}send(){const e=new XMLHttpRequest,t=objWbUrl.getController({folder:"contact",file:"FormAjax"});let l="&method=sendForm&name="+this.elFormFieldName.value+"&email="+this.elFormFieldEmail.value+"&message="+this.elFormFieldMessage.value+"&token="+globalToken;this.elButtonSend.setAttribute("disabled","disabled"),e.open("POST",t,!0),e.setRequestHeader("Content-type","application/x-www-form-urlencoded"),e.onreadystatechange=()=>{4===e.readyState&&200===e.status&&(this.elButtonSend.removeAttribute("disabled"),this.response(e.responseText))},e.send(l)}response(e){let t="",l="";this.elFormFieldName.value="",this.elFormFieldEmail.value="",this.elFormFieldMessage.value="","ok"===e?(l="green",t=globalTranslation.formSent):(l="red",t=globalTranslation.formProblemSend),notification.add({text:t,color:l,place:".form"})}}export class WbTranslation{build(){this.update(),this.elSelect&&(this.defineActive(),this.buildMenu())}buildMenu(){this.elSelect.addEventListener("change",(function(){let e=this.selectedIndex,t=this.options[e].getAttribute("data-url");window.location.replace(t)}))}defineActive(){this.elSelect.value=globalLanguage}update(){this.elSelect=document.querySelector("#translationSelect")}}export class WbUrl{buildSEO(e){return e.toString().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/\s+/g,"-").toLowerCase().replace(/&/g,"-and-").replace(/[^a-z0-9\-]/g,"").replace(/-+/g,"-").replace(/^-*/,"").replace(/-*$/,"")}build(e){window.location=globalUrl+window.globalLanguage+"/"+e+"/"}buildVersion(){const e=JSON.parse(globalVersion);this.pathSite=`./site/${e.site}/php/`}getController(e){return this.buildVersion(),`${this.pathSite}controller/${e.folder}/${e.file}.php`}getView(e){return this.buildVersion(),`${this.pathSite}view/${e.folder}/${e.file}.php`}watch(e,t){const l=this;e.addEventListener("focusout",(function(){t.value=l.buildSEO(e.value)}))}}