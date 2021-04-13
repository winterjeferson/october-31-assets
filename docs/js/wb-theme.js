function getUrlWord(e){return new RegExp("\\b"+e+"\\b","i").test(window.location.href)}class AccountActivate{build(){objDebug.debugMethod(this,objDebug.getMethodName()),getUrlWord("activate")&&(this.update(),this.getParameter(),this.send())}getParameter(){objDebug.debugMethod(this,objDebug.getMethodName());let e=window.location.href.split("&");e.length<=2||(this.u=e[1].substring(2),this.p=e[2].substring(2))}update(){objDebug.debugMethod(this,objDebug.getMethodName()),this.$page=document.querySelector("#accountActivate"),this.$accountActivating=this.$page.querySelector('[data-id="accountActivating"]'),this.$accountActivated=this.$page.querySelectorAll('[data-id="accountActivated"]')}send(){objDebug.debugMethod(this,objDebug.getMethodName());let e=this,t=new XMLHttpRequest,o=objWbUrl.getController({folder:"account",file:"ActivateAjax"}),i="&m=activate&u="+this.u+"&p="+this.p;void 0!==this.u&&""!==this.u&&void 0!==this.p&&""!==this.p&&(console.log(this.u),console.log(this.p),t.open("POST",o,!0),t.setRequestHeader("Content-type","application/x-www-form-urlencoded"),t.onreadystatechange=function(){4==t.readyState&&200==t.status&&e.response(t.responseText)},t.send(i))}response(e){objDebug.debugMethod(this,objDebug.getMethodName());let t="",o="";switch(e){case"ok":this.$accountActivating.classList.add("display-none"),Array.prototype.forEach.call(this.$accountActivated,function(e){e.classList.remove("display-none")});break;default:o="red",t=globalTranslation.formProblemSend,objWfNotification.add(t,o,this.$accountActivating)}}}class Carousel{constructor(){objDebug.debugMethod(this,"constructor"),this.isCarousel=!0}build(){objDebug.debugMethod(this,objDebug.getMethodName()),this.verifyHasCarousel(),this.isCarousel&&this.update()}update(){objDebug.debugMethod(this,objDebug.getMethodName()),this.$mainCarousel=document.querySelector("#mainCarousel"),this.$mainCarouselImage=this.$mainCarousel.querySelector(".carousel-list").querySelectorAll("img")}changeImage(){objDebug.debugMethod(this,objDebug.getMethodName()),this.isCarousel&&Array.prototype.forEach.call(this.$mainCarouselImage,function(e){let t="./assets/img/banner/"+objTheme.device+"/"+e.getAttribute("data-img");e.setAttribute("src",t)})}resize(){objDebug.debugMethod(this,objDebug.getMethodName()),this.changeImage()}verifyHasCarousel(){objDebug.debugMethod(this,objDebug.getMethodName()),null===document.querySelector("#mainCarousel")&&(this.isCarousel=!1)}}class Debug{constructor(){this.isAccountActivate=!0,this.isCarousel=!0,this.isContact=!0,this.isManagement=!0,this.isPasswordReset=!0,this.isRanking=!0,this.isRankingSearch=!0,this.isTheme=!0}debugMethod(e,t,o=""){let i="",s=e.constructor.name;if(!this["is"+s])return!1;i+="%c",i+="obj"+s,i+=".",i+="%c",i+=t,i+="(",i+="%c",""!==o&&(i+=o),i+="%c",i+=");",console.log(i,"color: black","color: orange","color: red","color: green")}getMethodName(){if(window.navigator.userAgent.indexOf(".NET ")>0)return!1;let e=new Error("dummy").stack.split("\n")[2].replace(/^\s+at\s+(.+?)\s.+/g,"$1"),t=e.split(".");return"new"!==e?t[1]:"constructor"}}class Management{verifyLoad(){objDebug.debugMethod(this,objDebug.getMethodName());window.addEventListener("load",this.applyClass(),!1)}applyClass(){objDebug.debugMethod(this,objDebug.getMethodName()),objCarousel.build(),objAccountActivate.build(),objTheme.build(),objRanking.build(),objPasswordReset.build()}}class PasswordReset{build(){objDebug.debugMethod(this,objDebug.getMethodName()),getUrlWord("reset")&&(this.update(),this.buildMenu(),this.getParameter())}getParameter(){objDebug.debugMethod(this,objDebug.getMethodName());let e=window.location.href.split("&");e.length<=2||(this.i=e[1].substring(2),this.u=e[2].substring(2))}update(){objDebug.debugMethod(this,objDebug.getMethodName()),this.$page=document.querySelector("#accountReset"),this.$form=this.$page.querySelector(".form"),this.$btSend=this.$page.querySelector('[data-id="btSend"]'),this.$fieldPassword=this.$page.querySelector('[data-id="fieldPassword"]')}buildMenu(){objDebug.debugMethod(this,objDebug.getMethodName());let e=this;this.$btSend.addEventListener("click",function(t){e.validate()&&e.send()})}validate(){return objDebug.debugMethod(this,objDebug.getMethodName()),!(this.$fieldPassword.value.length<6||""===this.$fieldPassword.value)||(this.response("passwordLength"),this.$fieldPassword.focus(),!1)}send(){objDebug.debugMethod(this,objDebug.getMethodName());let e=this,t=new XMLHttpRequest,o=objWbUrl.getController({folder:"account",file:"ResetAjax"}),i="&m=reset&i="+this.i+"&u="+this.u+"&p="+this.$fieldPassword.value;void 0!==this.u&&""!==this.u&&void 0!==this.i&&""!==this.i&&(this.$btSend.setAttribute("disabled","disabled"),t.open("POST",o,!0),t.setRequestHeader("Content-type","application/x-www-form-urlencoded"),t.onreadystatechange=function(){4==t.readyState&&200==t.status&&(e.$btSend.removeAttribute("disabled"),e.response(t.responseText))},t.send(i))}response(e){objDebug.debugMethod(this,objDebug.getMethodName());let t="",o="";switch(e){case"ok":o="green",t=globalTranslation.passwordReseted;break;case"passwordLength":o="red",t=globalTranslation.passwordLength;break;default:o="red",t=globalTranslation.formProblemSend}objWfNotification.add(t,o,this.$form)}}class Ranking{constructor(){objDebug.debugMethod(this,"constructor"),this.currentFilter="",this.$page=document.querySelector("#ranking")}build(){objDebug.debugMethod(this,objDebug.getMethodName()),document.contains(this.$page)&&(this.update(),this.buildMenu())}update(){objDebug.debugMethod(this,objDebug.getMethodName()),this.$tbody=this.$page.querySelector("tbody"),this.$btLoadMore=this.$page.querySelector('[data-id="loadMore"]'),this.$btFilterExperience=this.$page.querySelector('[data-id="filterExperience"]'),this.$btFilterWarrior=this.$page.querySelector('[data-id="filterAll"]'),this.$btFilterWarrior=this.$page.querySelector('[data-id="filterWarrior"]'),this.$btFilterWizard=this.$page.querySelector('[data-id="filterWizard"]'),this.$btFilterHunter=this.$page.querySelector('[data-id="filterHunter"]'),this.$btFilterMerchant=this.$page.querySelector('[data-id="filterMerchant"]'),this.$btFilterSearch=this.$page.querySelector('[data-id="filterSearch"]')}buildMenu(){objDebug.debugMethod(this,objDebug.getMethodName());let e=this;null!==this.$btLoadMore&&this.$btLoadMore.addEventListener("click",function(t){e.loadMore()}),this.$btFilterExperience.addEventListener("click",function(t){e.filter(this.getAttribute("data-id"))}),this.$btFilterWarrior.addEventListener("click",function(t){e.filter(this.getAttribute("data-id"))}),this.$btFilterWizard.addEventListener("click",function(t){e.filter(this.getAttribute("data-id"))}),this.$btFilterHunter.addEventListener("click",function(t){e.filter(this.getAttribute("data-id"))}),this.$btFilterMerchant.addEventListener("click",function(t){e.filter(this.getAttribute("data-id"))}),this.$btFilterSearch.addEventListener("click",function(t){e.search()})}loadMore(){objDebug.debugMethod(this,objDebug.getMethodName());let e=this,t=new XMLHttpRequest,o=objWbUrl.getController({folder:"home",file:"RankingAjax"}),i="&c=Ranking&m=buildLoadMoreButtonClick&filter="+this.currentFilter;this.$btLoadMore.classList.add("disabled"),t.open("POST",o,!0),t.setRequestHeader("Content-type","application/x-www-form-urlencoded"),t.onreadystatechange=function(){4==t.readyState&&200==t.status&&(e.$btLoadMore.classList.remove("disabled"),e.loadMoreSuccess(t.responseText))},t.send(i)}loadMoreSuccess(e){objDebug.debugMethod(this,objDebug.getMethodName());const t=this.$page.querySelector(".table").querySelector("tbody"),o=JSON.parse(e);let i="";o.length<10&&this.$btLoadMore.classList.add("disabled");for(let e in o)i+=`\n                <tr>\n                    <td></td>\n                    <td>${o[e].about_name}</td>\n                    <td>${o[e].user}</td>\n                    <td>${o[e].about_class}</td>\n                    <td>${o[e].about_level}</td>\n                    <td>${o[e].about_experience}</td>\n                </tr>\n            `;t.insertAdjacentHTML("beforeend",i)}filter(e){objDebug.debugMethod(this,objDebug.getMethodName());let t=e.substring(6).toLowerCase(),o=this,i=new XMLHttpRequest,s=objWbUrl.getController({folder:"home",file:"RankingAjax"}),a="&c=Ranking&m=Filter&filter="+t;this.currentFilter=t,this.$btLoadMore.classList.add("disabled"),i.open("POST",s,!0),i.setRequestHeader("Content-type","application/x-www-form-urlencoded"),i.onreadystatechange=function(){4==i.readyState&&200==i.status&&(o.emptyTable(),o.$btLoadMore.classList.remove("disabled"),o.loadMoreSuccess(i.responseText))},i.send(a)}emptyTable(){for(objDebug.debugMethod(this,objDebug.getMethodName());this.$tbody.firstChild;)this.$tbody.removeChild(this.$tbody.firstChild)}search(){objDebug.debugMethod(this,objDebug.getMethodName());let e=new XMLHttpRequest,t=objWbUrl.getController({folder:"home",file:"RankingSearchAjax"});objWfModal.buildModal("","","bi"),e.onreadystatechange=function(){4==this.readyState&&200==this.status&&(objWfModal.$modalContent.innerHTML=this.responseText,objRankingSearch.build())},e.open("GET",t,!0),e.send()}}class RankingSearch{build(){objDebug.debugMethod(this,objDebug.getMethodName()),this.update(),this.buildMenu()}update(){objDebug.debugMethod(this,objDebug.getMethodName()),this.$page=document.querySelector("#rankingSearch"),this.$fieldSearch=this.$page.querySelector('[data-id="fieldSearch"]'),this.$btSend=this.$page.querySelector('[data-id="btSend"]')}buildMenu(){objDebug.debugMethod(this,objDebug.getMethodName());let e=this;this.$btSend.addEventListener("click",function(t){objWfForm.validateEmpty([e.$fieldSearch])&&e.search()})}search(){objDebug.debugMethod(this,objDebug.getMethodName());let e=this,t=new XMLHttpRequest,o=objWbUrl.getController({folder:"home",file:"RankingSearchAjaxSearch"}),i="&c=Ranking&m=search&character="+this.$fieldSearch.value;this.$btSend.classList.add("disabled"),t.open("POST",o,!0),t.setRequestHeader("Content-type","application/x-www-form-urlencoded"),t.onreadystatechange=function(){4==t.readyState&&200==t.status&&(e.$btSend.classList.remove("disabled"),e.searchSuccess(t.responseText))},t.send(i)}searchSuccess(e){objDebug.debugMethod(this,objDebug.getMethodName());const t=this.$page.querySelector(".ranking"),o=JSON.parse(e);let i="";for(let e in o)i+=`\n                <tr>\n                    <td>${o[e].ranking_position}</td>\n                    <td>${o[e].about_name}</td>\n                    <td>${o[e].user}</td>\n                    <td>${o[e].about_class}</td>\n                    <td>${o[e].about_level}</td>\n                    <td>${o[e].about_experience}</td>\n                </tr>\n            `;t.classList.remove("display-none"),t.querySelector("tbody").insertAdjacentHTML("beforeend",i)}}class Theme{constructor(){objDebug.debugMethod(this,"constructor"),this.device=!1,this.breakPointExtraSmall=0,this.breakPointSmall=576,this.breakPointMedium=768,this.breakPointBig=992,this.breakPointExtraBig=1200}build(){objDebug.debugMethod(this,objDebug.getMethodName()),this.removeFromUrl("referral"),this.update(),this.buildDevice(),this.watchResize(),objCarousel.resize()}buildDevice(){objDebug.debugMethod(this,objDebug.getMethodName());let e=window.innerWidth,t=this.breakPointMedium;this.device=e>=0&&e<t?"phone":"desktop"}watchResize(){objDebug.debugMethod(this,objDebug.getMethodName());let e=this;window.addEventListener("resize",function(t){e.buildDevice(),objCarousel.resize()})}update(){objDebug.debugMethod(this,objDebug.getMethodName()),this.controller="./assets/php/controller.php"}verifyUrlParameter(e){objDebug.debugMethod(this,objDebug.getMethodName());let t=window.location.href;return-1!=t.indexOf("?"+e+"=")||-1!=t.indexOf("&"+e+"=")}removeFromUrl(e){objDebug.debugMethod(this,objDebug.getMethodName()),this.verifyUrlParameter(e)&&window.history.replaceState({},document.title,"/")}}class WbDebug{constructor(){this.isWbAdmin=!0,this.isWbAdmin=!0,this.isWbAdminBlog=!0,this.isWbLogin=!0,this.isWbManagement=!0,this.isWbTranslation=!0,this.isWbUrl=!0}debugMethod(e,t,o=""){let i="",s=e.constructor.name;if(!this["is"+s])return!1;i+="%c",i+="obj"+s,i+=".",i+="%c",i+=t,i+="(",i+="%c",""!==o&&(i+=o),i+="%c",i+=");",console.log(i,"color: black","color: green","color: red","color: green")}getMethodName(){if(window.navigator.userAgent.indexOf(".NET ")>0)return!1;let e=new Error("dummy").stack.split("\n")[2].replace(/^\s+at\s+(.+?)\s.+/g,"$1"),t=e.split(".");return"new"!==e?t[1]:"constructor"}}class WbBlog{constructor(){objWbDebug.debugMethod(this,"constructor"),this.classlaodMore="loadMore"}build(){objWbDebug.debugMethod(this,objWbDebug.getMethodName()),getUrlWord("blog")&&(this.update(),this.buildMenu())}update(){objWbDebug.debugMethod(this,objWbDebug.getMethodName()),this.page="pageBlog",this.$lastPost=document.querySelector("#"+this.page+"LastPost"),this.$mostViewed=document.querySelector("#"+this.page+"MostViewed")}buildMenu(){objWbDebug.debugMethod(this,objWbDebug.getMethodName());let e=this;this.$lastPost&&(document.contains(this.$lastPost.querySelector('[data-id="'+this.classlaodMore+'"]'))&&this.$lastPost.querySelector('[data-id="'+this.classlaodMore+'"]').addEventListener("click",function(t){e.loadMore(this)}),document.contains(this.$mostViewed.querySelector('[data-id="'+this.classlaodMore+'"]'))&&this.$mostViewed.querySelector('[data-id="'+this.classlaodMore+'"]').addEventListener("click",function(t){e.loadMore(this)}))}loadMore(e){objWbDebug.debugMethod(this,objWbDebug.getMethodName());let t=this,o=e.parentNode.parentNode.parentNode.getAttribute("id"),i=o.substring(this.page.length),s=new XMLHttpRequest,a=objWbUrl.getController({folder:"blog",file:"LoadMore"}),d="&target="+i;e.classList.add("disabled"),s.open("POST",a,!0),s.setRequestHeader("Content-type","application/x-www-form-urlencoded"),s.onreadystatechange=function(){4==s.readyState&&200==s.status&&(e.classList.remove("disabled"),t.loadMoreSuccess(o,s.responseText))},s.send(d)}loadMoreSuccess(e,t){objWbDebug.debugMethod(this,objWbDebug.getMethodName());let o=JSON.parse(t),i=document.querySelector("#"+e),s=i.querySelector(".blog-list"),a=i.querySelector('[data-id="'+this.classlaodMore+'"]');o[this.classlaodMore]||a.classList.add("disabled"),s.insertAdjacentHTML("beforeend",o.html),window.scrollTo(0,document.documentElement.scrollTop+1),window.scrollTo(0,document.documentElement.scrollTop-1)}}class WbForm{build(){objWbDebug.debugMethod(this,objWbDebug.getMethodName()),getUrlWord("contact")&&(this.update(),this.buildMenu())}update(){objWbDebug.debugMethod(this,objWbDebug.getMethodName()),this.$page=document.querySelector("#pageContact"),this.$form=this.$page.querySelector(".form"),this.$formFieldName=this.$form.querySelector('[data-id="fieldName"]'),this.$formFieldEmail=this.$form.querySelector('[data-id="fieldEmail"]'),this.$formFieldMessage=this.$form.querySelector('[data-id="fieldMessage"]'),this.$btSend=this.$page.querySelector('[data-id="btSend"]')}buildMenu(){objWbDebug.debugMethod(this,objWbDebug.getMethodName());const e=this;this.$btSend.addEventListener("click",function(t){objWfForm.validateEmpty([e.$formFieldEmail,e.$formFieldMessage])&&e.send()})}send(){objWbDebug.debugMethod(this,objWbDebug.getMethodName());const e=this,t=new XMLHttpRequest,o=objWbUrl.getController({folder:"form",file:"FormAjax"});let i="&method=sendForm&name="+this.$formFieldName.value+"&email="+this.$formFieldEmail.value+"&message="+this.$formFieldMessage.value+"&token="+globalToken;this.$btSend.setAttribute("disabled","disabled"),t.open("POST",o,!0),t.setRequestHeader("Content-type","application/x-www-form-urlencoded"),t.onreadystatechange=function(){4==t.readyState&&200==t.status&&(e.$btSend.removeAttribute("disabled"),e.response(t.responseText))},t.send(i)}response(e){objWbDebug.debugMethod(this,objWbDebug.getMethodName());let t="",o="";switch(e){case"ok":o="green",t=globalTranslation.formSent;break;default:o="red",t=globalTranslation.formProblemSend}objWfNotification.add(t,o,this.$form)}}class WbManagement{verifyLoad(){objWbDebug.debugMethod(this,objWbDebug.getMethodName()),window.addEventListener("load",this.applyClass(),{once:!0})}applyClass(){objWbDebug.debugMethod(this,objWbDebug.getMethodName()),objWbTranslation.build(),objWbBlog.build(),objWbForm.build()}}class WbTranslation{build(){objWbDebug.debugMethod(this,objWbDebug.getMethodName()),this.update(),this.defineActive(),this.buildMenu()}buildMenu(){objWbDebug.debugMethod(this,objWbDebug.getMethodName()),this.$select.addEventListener("change",function(){let e=this.selectedIndex,t=this.options[e].getAttribute("data-url");window.location.replace(t)})}defineActive(){objWbDebug.debugMethod(this,objWbDebug.getMethodName()),this.$select.value=globalLanguage}update(){objWbDebug.debugMethod(this,objWbDebug.getMethodName()),this.$select=document.querySelector("#translationSelect")}}class WbUrl{buildSEO(e){return objWbDebug.debugMethod(this,objWbDebug.getMethodName()),e.toString().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/\s+/g,"-").toLowerCase().replace(/&/g,"-and-").replace(/[^a-z0-9\-]/g,"").replace(/-+/g,"-").replace(/^-*/,"").replace(/-*$/,"")}build(e){objWbDebug.debugMethod(this,objWbDebug.getMethodName()),window.location=globalUrl+globalLanguage+"/"+e+"/"}getController(e){return objWbDebug.debugMethod(this,objWbDebug.getMethodName()),"./application/controller/"+e.folder+"/"+e.file+".php"}getView(e){return objWbDebug.debugMethod(this,objWbDebug.getMethodName()),"./application/view/"+e.folder+"/"+e.file+".php"}watch(e,t){objWbDebug.debugMethod(this,objWbDebug.getMethodName());const o=this;e.addEventListener("focusout",function(){t.value=o.buildSEO(e.value)})}}var objWbDebug=new WbDebug,objWbBlog=new WbBlog,objWbForm=new WbForm,objWbManagement=new WbManagement,objWbTranslation=new WbTranslation,objWbUrl=new WbUrl;objWbManagement.verifyLoad();const objDebug=new Debug,objAccountActivate=new AccountActivate,objCarousel=new Carousel,objManagement=new Management,objPasswordReset=new PasswordReset,objRanking=new Ranking,objRankingSearch=new RankingSearch,objTheme=new Theme;objManagement.verifyLoad();