function getUrlWord(target) {
    return new RegExp('\\b' + target + '\\b', 'i').test(window.location.href);
}

class AccountActivate {
    build() {
        /*removeIf(production)*/ objDebug.debugMethod(this, objDebug.getMethodName()); /*endRemoveIf(production)*/
        if (!getUrlWord('activate')) {
            return;
        }

        this.update();
        this.getParameter();
        this.send();
    }

    getParameter() {
        /*removeIf(production)*/ objDebug.debugMethod(this, objDebug.getMethodName()); /*endRemoveIf(production)*/
        let urlSplit = window.location.href.split('&');

        if (urlSplit.length <= 2) {
            return;
        }

        this.u = urlSplit[1].substring(2);
        this.p = urlSplit[2].substring(2);
    }

    update() {
        /*removeIf(production)*/ objDebug.debugMethod(this, objDebug.getMethodName()); /*endRemoveIf(production)*/
        this.$page = document.querySelector('#accountActivate');
        this.$accountActivating = this.$page.querySelector('[data-id="accountActivating"]');
        this.$accountActivated = this.$page.querySelectorAll('[data-id="accountActivated"]');
    }

    send() {
        /*removeIf(production)*/ objDebug.debugMethod(this, objDebug.getMethodName()); /*endRemoveIf(production)*/
        let self = this;
        let ajax = new XMLHttpRequest();
        let url = objWbUrl.getController({ 'folder': 'account', 'file': 'ActivateAjax' });
        let parameter =
            '&m=activate' +
            '&u=' + this.u +
            '&p=' + this.p;

        if (typeof this.u === 'undefined' || this.u === '' || typeof this.p === 'undefined' || this.p === '') {
            return;
        }

        console.log(this.u);
        console.log(this.p);

        ajax.open('POST', url, true);
        ajax.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

        ajax.onreadystatechange = function () {
            if (ajax.readyState == 4 && ajax.status == 200) {
                self.response(ajax.responseText);
            }
        }

        ajax.send(parameter);
    }

    response(data) {
        /*removeIf(production)*/ objDebug.debugMethod(this, objDebug.getMethodName()); /*endRemoveIf(production)*/
        let response = '';
        let color = '';
        let classDisplay = 'display-none';

        switch (data) {
            case 'ok':
                this.$accountActivating.classList.add(classDisplay);
                Array.prototype.forEach.call(this.$accountActivated, function (item) {
                    item.classList.remove(classDisplay)
                });
                break;
            default:
                color = 'red';
                response = globalTranslation.formProblemSend;
                objWfNotification.add(response, color, this.$accountActivating);
                break;
        }

    }
}
class Carousel {
    constructor() {
        /*removeIf(production)*/ objDebug.debugMethod(this, 'constructor'); /*endRemoveIf(production)*/
        this.isCarousel = true;
    }

    build() {
        /*removeIf(production)*/ objDebug.debugMethod(this, objDebug.getMethodName()); /*endRemoveIf(production)*/
        this.verifyHasCarousel();

        if (this.isCarousel) {
            this.update();
        }
    }

    update() {
        /*removeIf(production)*/ objDebug.debugMethod(this, objDebug.getMethodName()); /*endRemoveIf(production)*/
        this.$mainCarousel = document.querySelector('#mainCarousel');
        this.$mainCarouselImage = this.$mainCarousel.querySelector('.carousel-list').querySelectorAll('img');
    }

    changeImage() {
        /*removeIf(production)*/ objDebug.debugMethod(this, objDebug.getMethodName()); /*endRemoveIf(production)*/
        if (!this.isCarousel) {
            return;
        }

        Array.prototype.forEach.call(this.$mainCarouselImage, function (item) {
            let url = './assets/img/banner/' + objTheme.device + '/' + item.getAttribute('data-img');

            item.setAttribute('src', url);
        });
    }

    resize() {
        /*removeIf(production)*/ objDebug.debugMethod(this, objDebug.getMethodName()); /*endRemoveIf(production)*/
        this.changeImage();
    }

    verifyHasCarousel() {
        /*removeIf(production)*/ objDebug.debugMethod(this, objDebug.getMethodName()); /*endRemoveIf(production)*/
        if (document.querySelector('#mainCarousel') === null) {
            this.isCarousel = false;
        }
    }
}
/*removeIf(production)*/
class Debug {
    constructor() {
        this.isAccountActivate = true;
        this.isCarousel = true;
        this.isContact = true;
        this.isManagement = true;
        this.isPasswordReset = true;
        this.isRanking = true;
        this.isRankingSearch = true;
        this.isTheme = true;
    }

    debugMethod(obj, method, parameter = '') {
        let string = '';
        let className = obj.constructor.name;
        //        let arrMethod = Object.getOwnPropertyNames(Object.getPrototypeOf(obj));

        if (!this['is' + className]) {
            return false;
        }

        string += '%c';
        string += 'obj' + className;
        string += '.';
        string += '%c';
        string += method;
        string += '(';

        string += '%c';
        if (parameter !== '') {
            string += parameter;
        }

        string += '%c';
        string += ');';

        console.log(string, 'color: black', 'color: orange', 'color: red', 'color: green');
    }

    getMethodName() {
        let userAgent = window.navigator.userAgent;
        let msie = userAgent.indexOf('.NET ');

        if (msie > 0) {
            return false;
        }

        let e = new Error('dummy');
        let stack = e.stack.split('\n')[2]
            // " at functionName ( ..." => "functionName"
            .replace(/^\s+at\s+(.+?)\s.+/g, '$1');
        let split = stack.split(".");

        if (stack !== 'new') {
            return split[1];
        } else {
            return 'constructor';
        }
    }
}
/*endRemoveIf(production)*/
class Management {
    verifyLoad() {
        /*removeIf(production)*/ objDebug.debugMethod(this, objDebug.getMethodName()); /*endRemoveIf(production)*/
        let self = this;
        
        window.addEventListener('load', self.applyClass(), false);
    }
    
    applyClass() {
        /*removeIf(production)*/ objDebug.debugMethod(this, objDebug.getMethodName()); /*endRemoveIf(production)*/
        objCarousel.build();
        objAccountActivate.build();
        objTheme.build();
        objRanking.build();
        objPasswordReset.build();
    }
}
class PasswordReset {
    build() {
        /*removeIf(production)*/ objDebug.debugMethod(this, objDebug.getMethodName()); /*endRemoveIf(production)*/
        if (!getUrlWord('reset')) {
            return;
        }

        this.update();
        this.buildMenu();
        this.getParameter();
    }

    getParameter() {
        /*removeIf(production)*/ objDebug.debugMethod(this, objDebug.getMethodName()); /*endRemoveIf(production)*/
        let urlSplit = window.location.href.split('&');

        if (urlSplit.length <= 2) {
            return;
        }

        this.i = urlSplit[1].substring(2);
        this.u = urlSplit[2].substring(2);
    }

    update() {
        /*removeIf(production)*/ objDebug.debugMethod(this, objDebug.getMethodName()); /*endRemoveIf(production)*/
        this.$page = document.querySelector('#accountReset');
        this.$form = this.$page.querySelector('.form');
        this.$btSend = this.$page.querySelector('[data-id="btSend"]');
        this.$fieldPassword = this.$page.querySelector('[data-id="fieldPassword"]');
    }

    buildMenu() {
        /*removeIf(production)*/ objDebug.debugMethod(this, objDebug.getMethodName()); /*endRemoveIf(production)*/
        let self = this;

        this.$btSend.addEventListener('click', function (event) {
            if (self.validate()) {
                self.send();
            }
        });
    }

    validate() {
        /*removeIf(production)*/ objDebug.debugMethod(this, objDebug.getMethodName()); /*endRemoveIf(production)*/
        if (this.$fieldPassword.value.length < 6 || this.$fieldPassword.value === '') {
            this.response('passwordLength');
            this.$fieldPassword.focus();
            return false;
        }

        return true;
    }

    send() {
        /*removeIf(production)*/ objDebug.debugMethod(this, objDebug.getMethodName()); /*endRemoveIf(production)*/
        let self = this;
        let ajax = new XMLHttpRequest();
        let url = objWbUrl.getController({ 'folder': 'account', 'file': 'ResetAjax' });
        let parameter =
            '&m=reset' +
            '&i=' + this.i +
            '&u=' + this.u +
            '&p=' + this.$fieldPassword.value;

        if (typeof this.u === 'undefined' || this.u === '' || typeof this.i === 'undefined' || this.i === '') {
            return;
        }

        this.$btSend.setAttribute('disabled', 'disabled');
        ajax.open('POST', url, true);
        ajax.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

        ajax.onreadystatechange = function () {
            if (ajax.readyState == 4 && ajax.status == 200) {
                self.$btSend.removeAttribute('disabled');
                self.response(ajax.responseText);
            }
        }

        ajax.send(parameter);
    }

    response(data) {
        /*removeIf(production)*/ objDebug.debugMethod(this, objDebug.getMethodName()); /*endRemoveIf(production)*/
        let response = '';
        let color = '';

        switch (data) {
            case 'ok':
                color = 'green';
                response = globalTranslation.passwordReseted;
                break;
            case 'passwordLength':
                color = 'red';
                response = globalTranslation.passwordLength;
                break;
            default:
                color = 'red';
                response = globalTranslation.formProblemSend;
                break;
        }

        objWfNotification.add(response, color, this.$form);
    }
}
class Ranking {
    constructor() {
        /*removeIf(production)*/ objDebug.debugMethod(this, 'constructor'); /*endRemoveIf(production)*/
        this.currentFilter = '';
        this.$page = document.querySelector('#' + 'ranking');
    }

    build() {
        /*removeIf(production)*/ objDebug.debugMethod(this, objDebug.getMethodName()); /*endRemoveIf(production)*/
        if (!document.contains(this.$page)) {
            return;
        }

        this.update();
        this.buildMenu();
    }

    update() {
        /*removeIf(production)*/ objDebug.debugMethod(this, objDebug.getMethodName()); /*endRemoveIf(production)*/
        this.$tbody = this.$page.querySelector('tbody');
        this.$btLoadMore = this.$page.querySelector('[data-id="loadMore"]');
        this.$btFilterExperience = this.$page.querySelector('[data-id="filterExperience"]');
        this.$btFilterWarrior = this.$page.querySelector('[data-id="filterAll"]');
        this.$btFilterWarrior = this.$page.querySelector('[data-id="filterWarrior"]');
        this.$btFilterWizard = this.$page.querySelector('[data-id="filterWizard"]');
        this.$btFilterHunter = this.$page.querySelector('[data-id="filterHunter"]');
        this.$btFilterMerchant = this.$page.querySelector('[data-id="filterMerchant"]');
        this.$btFilterSearch = this.$page.querySelector('[data-id="filterSearch"]');
    }

    buildMenu() {
        /*removeIf(production)*/ objDebug.debugMethod(this, objDebug.getMethodName()); /*endRemoveIf(production)*/
        let self = this;

        if (this.$btLoadMore !== null) {
            this.$btLoadMore.addEventListener('click', function (event) {
                self.loadMore();
            });
        }

        this.$btFilterExperience.addEventListener('click', function (event) {
            self.filter(this.getAttribute('data-id'));
        });

        this.$btFilterWarrior.addEventListener('click', function (event) {
            self.filter(this.getAttribute('data-id'));
        });

        this.$btFilterWizard.addEventListener('click', function (event) {
            self.filter(this.getAttribute('data-id'));
        });

        this.$btFilterHunter.addEventListener('click', function (event) {
            self.filter(this.getAttribute('data-id'));
        });

        this.$btFilterMerchant.addEventListener('click', function (event) {
            self.filter(this.getAttribute('data-id'));
        });

        this.$btFilterSearch.addEventListener('click', function (event) {
            self.search();
        });
    }

    loadMore() {
        /*removeIf(production)*/ objDebug.debugMethod(this, objDebug.getMethodName()); /*endRemoveIf(production)*/
        let self = this;
        let ajax = new XMLHttpRequest();
        let url = objWbUrl.getController({ 'folder': 'home', 'file': 'RankingAjax' });
        let parameter =
            '&c=Ranking' +
            '&m=buildLoadMoreButtonClick' +
            '&filter=' + this.currentFilter;

        this.$btLoadMore.classList.add('disabled');
        ajax.open('POST', url, true);
        ajax.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

        ajax.onreadystatechange = function () {
            if (ajax.readyState == 4 && ajax.status == 200) {
                self.$btLoadMore.classList.remove('disabled');
                self.loadMoreSuccess(ajax.responseText);
            }
        }

        ajax.send(parameter);
    }

    loadMoreSuccess(json) {
        /*removeIf(production)*/ objDebug.debugMethod(this, objDebug.getMethodName()); /*endRemoveIf(production)*/
        const el = this.$page.querySelector('.table').querySelector('tbody');
        const obj = JSON.parse(json);
        let value = '';

        if (obj.length < 10) {
            this.$btLoadMore.classList.add('disabled');
        }

        for (let key in obj) {
            value += `
                <tr>
                    <td></td>
                    <td>${obj[key]['about_name']}</td>
                    <td>${obj[key]['user']}</td>
                    <td>${obj[key]['about_class']}</td>
                    <td>${obj[key]['about_level']}</td>
                    <td>${obj[key]['about_experience']}</td>
                </tr>
            `;
        }

        el.insertAdjacentHTML('beforeend', value);
    }

    filter(target) {
        /*removeIf(production)*/ objDebug.debugMethod(this, objDebug.getMethodName()); /*endRemoveIf(production)*/
        let filter = target.substring(6).toLowerCase();
        let self = this;
        let ajax = new XMLHttpRequest();
        let url = objWbUrl.getController({ 'folder': 'home', 'file': 'RankingAjax' });
        let parameter =
            '&c=Ranking' +
            '&m=Filter' +
            '&filter=' + filter;

        this.currentFilter = filter;
        this.$btLoadMore.classList.add('disabled');

        ajax.open('POST', url, true);
        ajax.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

        ajax.onreadystatechange = function () {
            if (ajax.readyState == 4 && ajax.status == 200) {
                self.emptyTable();
                self.$btLoadMore.classList.remove('disabled');
                self.loadMoreSuccess(ajax.responseText);
            }
        }

        ajax.send(parameter);
    }

    emptyTable() {
        /*removeIf(production)*/ objDebug.debugMethod(this, objDebug.getMethodName()); /*endRemoveIf(production)*/
        while (this.$tbody.firstChild) {
            this.$tbody.removeChild(this.$tbody.firstChild);
        }
    }

    search() {
        /*removeIf(production)*/ objDebug.debugMethod(this, objDebug.getMethodName()); /*endRemoveIf(production)*/
        let ajax = new XMLHttpRequest();
        let url = objWbUrl.getController({ 'folder': 'home', 'file': 'RankingSearchAjax' });

        objWfModal.buildModal('', '', 'bi');

        ajax.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                objWfModal.$modalContent.innerHTML = this.responseText;
                objRankingSearch.build();
            }
        };

        ajax.open('GET', url, true);
        ajax.send();
    }
}
class RankingSearch {
    build() {
        /*removeIf(production)*/ objDebug.debugMethod(this, objDebug.getMethodName()); /*endRemoveIf(production)*/
        this.update();
        this.buildMenu();
    }

    update() {
        /*removeIf(production)*/ objDebug.debugMethod(this, objDebug.getMethodName()); /*endRemoveIf(production)*/
        this.$page = document.querySelector('#rankingSearch');
        this.$fieldSearch = this.$page.querySelector('[data-id="fieldSearch"]');
        this.$btSend = this.$page.querySelector('[data-id="btSend"]');
    }

    buildMenu() {
        /*removeIf(production)*/ objDebug.debugMethod(this, objDebug.getMethodName()); /*endRemoveIf(production)*/
        let self = this;

        this.$btSend.addEventListener('click', function (event) {
            if (objWfForm.validateEmpty([self.$fieldSearch])) {
                self.search();
            }
        });
    }

    search() {
        /*removeIf(production)*/ objDebug.debugMethod(this, objDebug.getMethodName()); /*endRemoveIf(production)*/
        let self = this;
        let ajax = new XMLHttpRequest();
        let url = objWbUrl.getController({ 'folder': 'home', 'file': 'RankingSearchAjaxSearch' });
        let parameter =
            '&c=Ranking' +
            '&m=search' +
            '&character=' + this.$fieldSearch.value;

        this.$btSend.classList.add('disabled');
        ajax.open('POST', url, true);
        ajax.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

        ajax.onreadystatechange = function () {
            if (ajax.readyState == 4 && ajax.status == 200) {
                self.$btSend.classList.remove('disabled');
                self.searchSuccess(ajax.responseText);
            }
        }

        ajax.send(parameter);
    }

    searchSuccess(response) {
        /*removeIf(production)*/ objDebug.debugMethod(this, objDebug.getMethodName()); /*endRemoveIf(production)*/
        const el = this.$page.querySelector('.ranking');
        const obj = JSON.parse(response);
        let value = '';

        for (let key in obj) {
            value += `
                <tr>
                    <td>${obj[key]['ranking_position']}</td>
                    <td>${obj[key]['about_name']}</td>
                    <td>${obj[key]['user']}</td>
                    <td>${obj[key]['about_class']}</td>
                    <td>${obj[key]['about_level']}</td>
                    <td>${obj[key]['about_experience']}</td>
                </tr>
            `;
        }

        el.classList.remove('display-none')
        el.querySelector('tbody').insertAdjacentHTML('beforeend', value);
    }
}
class Theme {
    constructor() {
        /*removeIf(production)*/ objDebug.debugMethod(this, 'constructor'); /*endRemoveIf(production)*/
        this.device = false;
        this.breakPointExtraSmall = 0;
        this.breakPointSmall = 576;
        this.breakPointMedium = 768;
        this.breakPointBig = 992;
        this.breakPointExtraBig = 1200;
    }

    build() {
        /*removeIf(production)*/ objDebug.debugMethod(this, objDebug.getMethodName()); /*endRemoveIf(production)*/
        this.removeFromUrl('referral');
        this.update();
        this.buildDevice();
        this.watchResize();

        objCarousel.resize();
    }

    buildDevice() {
        /*removeIf(production)*/ objDebug.debugMethod(this, objDebug.getMethodName()); /*endRemoveIf(production)*/
        let widthCurrent = window.innerWidth;
        let widthPhone = 0;
        let widthTable = this.breakPointMedium;

        if (widthCurrent >= widthPhone && widthCurrent < widthTable) {
            this.device = 'phone';
        } else {
            this.device = 'desktop';
        }
    }

    watchResize() {
        /*removeIf(production)*/ objDebug.debugMethod(this, objDebug.getMethodName()); /*endRemoveIf(production)*/
        let self = this;

        window.addEventListener('resize', function (event) {
            self.buildDevice();
            objCarousel.resize();
        });
    }

    update() {
        /*removeIf(production)*/ objDebug.debugMethod(this, objDebug.getMethodName()); /*endRemoveIf(production)*/
        this.controller = './assets/php/controller.php';
    }

    verifyUrlParameter(parameter) {
        /*removeIf(production)*/ objDebug.debugMethod(this, objDebug.getMethodName()); /*endRemoveIf(production)*/
        let url = window.location.href;

        if (url.indexOf('?' + parameter + '=') != -1) {
            return true;
        } else if (url.indexOf('&' + parameter + '=') != -1) {
            return true;
        }
        return false;
    }

    removeFromUrl(parameter) {
        /*removeIf(production)*/ objDebug.debugMethod(this, objDebug.getMethodName()); /*endRemoveIf(production)*/
        let verify = this.verifyUrlParameter(parameter);

        if (verify) {
            window.history.replaceState({}, document.title, '/');
        }
    }
}
/*removeIf(production)*/
class WbDebug {
    constructor() {
        this.isWbAdmin = true;

        this.isWbAdmin = true;
        this.isWbAdminBlog = true;
        this.isWbLogin = true;
        this.isWbManagement = true;
        this.isWbTranslation = true;
        this.isWbUrl = true;
    }

    debugMethod(obj, method, parameter = '') {
        let string = '';
        let className = obj.constructor.name;
        //        let arrMethod = Object.getOwnPropertyNames(Object.getPrototypeOf(obj));

        if (!this['is' + className]) {
            return false;
        }

        string += '%c';
        string += 'obj' + className;
        string += '.';
        string += '%c';
        string += method;
        string += '(';

        string += '%c';
        if (parameter !== '') {
            string += parameter;
        }

        string += '%c';
        string += ');';

        console.log(string, 'color: black', 'color: green', 'color: red', 'color: green');
    }

    getMethodName() {
        let userAgent = window.navigator.userAgent;
        let msie = userAgent.indexOf('.NET ');

        if (msie > 0) {
            return false;
        }

        let e = new Error('dummy');
        let stack = e.stack.split('\n')[2]
            // " at functionName ( ..." => "functionName"
            .replace(/^\s+at\s+(.+?)\s.+/g, '$1');
        let split = stack.split(".");

        if (stack !== 'new') {
            return split[1];
        } else {
            return 'constructor';
        }
    }
}
/*endRemoveIf(production)*/
class WbBlog {
    constructor() {
        /*removeIf(production)*/ objWbDebug.debugMethod(this, 'constructor'); /*endRemoveIf(production)*/
        this.classlaodMore = 'loadMore';
    }
    
    build() {
        /*removeIf(production)*/ objWbDebug.debugMethod(this, objWbDebug.getMethodName()); /*endRemoveIf(production)*/
        if (!getUrlWord('blog')) {
            return;
        }

        this.update();
        this.buildMenu();
    }

    update() {
        /*removeIf(production)*/ objWbDebug.debugMethod(this, objWbDebug.getMethodName()); /*endRemoveIf(production)*/
        this.page = 'pageBlog';
        this.$lastPost = document.querySelector('#' + this.page + 'LastPost');
        this.$mostViewed = document.querySelector('#' + this.page + 'MostViewed');
    }

    buildMenu() {
        /*removeIf(production)*/ objWbDebug.debugMethod(this, objWbDebug.getMethodName()); /*endRemoveIf(production)*/
        let self = this;

        if (!this.$lastPost) {
            return;
        }

        if (document.contains(this.$lastPost.querySelector('[data-id="' + this.classlaodMore + '"]'))) {
            this.$lastPost.querySelector('[data-id="' + this.classlaodMore + '"]').addEventListener('click', function (event) {
                self.loadMore(this);
            });
        }

        if (document.contains(this.$mostViewed.querySelector('[data-id="' + this.classlaodMore + '"]'))) {
            this.$mostViewed.querySelector('[data-id="' + this.classlaodMore + '"]').addEventListener('click', function (event) {
                self.loadMore(this);
            });
        }
    }

    loadMore(target) {
        /*removeIf(production)*/ objWbDebug.debugMethod(this, objWbDebug.getMethodName()); /*endRemoveIf(production)*/
        let self = this;
        let parentId = target.parentNode.parentNode.parentNode.getAttribute('id');
        let parentIdString = parentId.substring(this.page.length);
        let ajax = new XMLHttpRequest();
        let url = objWbUrl.getController({ 'folder': 'blog', 'file': 'LoadMore' });
        let parameter =
            '&target=' + parentIdString;

        target.classList.add('disabled');
        ajax.open('POST', url, true);
        ajax.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        ajax.onreadystatechange = function () {
            if (ajax.readyState == 4 && ajax.status == 200) {
                target.classList.remove('disabled');
                self.loadMoreSuccess(parentId, ajax.responseText);
            }
        }
        ajax.send(parameter);
    }

    loadMoreSuccess(parentId, value) {
        /*removeIf(production)*/ objWbDebug.debugMethod(this, objWbDebug.getMethodName()); /*endRemoveIf(production)*/
        let json = JSON.parse(value);
        let $section = document.querySelector('#' + parentId);
        let $sectionList = $section.querySelector('.blog-list');
        let $bt = $section.querySelector('[data-id="' + this.classlaodMore + '"]');

        if (!json[this.classlaodMore]) {
            $bt.classList.add('disabled');
        }

        $sectionList.insertAdjacentHTML('beforeend', json['html']);
        window.scrollTo(0, document.documentElement.scrollTop + 1);
        window.scrollTo(0, document.documentElement.scrollTop - 1);
    }
}
class WbForm {
    build() {
        /*removeIf(production)*/ objWbDebug.debugMethod(this, objWbDebug.getMethodName()); /*endRemoveIf(production)*/
        if (!getUrlWord('contact')) {
            return;
        }

        this.update();
        this.buildMenu();
    }

    update() {
        /*removeIf(production)*/ objWbDebug.debugMethod(this, objWbDebug.getMethodName()); /*endRemoveIf(production)*/
        this.$page = document.querySelector('#pageContact');
        this.$form = this.$page.querySelector('.form');
        this.$formFieldName = this.$form.querySelector('[data-id="fieldName"]');
        this.$formFieldEmail = this.$form.querySelector('[data-id="fieldEmail"]');
        this.$formFieldMessage = this.$form.querySelector('[data-id="fieldMessage"]');
        this.$btSend = this.$page.querySelector('[data-id="btSend"]');
    }

    buildMenu() {
        /*removeIf(production)*/ objWbDebug.debugMethod(this, objWbDebug.getMethodName()); /*endRemoveIf(production)*/
        const self = this;

        this.$btSend.addEventListener('click', function (event) {
            if (objWfForm.validateEmpty([self.$formFieldEmail, self.$formFieldMessage])) {
                self.send();
            }
        });
    }

    send() {
        /*removeIf(production)*/ objWbDebug.debugMethod(this, objWbDebug.getMethodName()); /*endRemoveIf(production)*/
        const self = this;
        const ajax = new XMLHttpRequest();
        const url = objWbUrl.getController({ 'folder': 'form', 'file': 'FormAjax' });
        let parameter =
            '&method=sendForm' +
            '&name=' + this.$formFieldName.value +
            '&email=' + this.$formFieldEmail.value +
            '&message=' + this.$formFieldMessage.value +
            '&token=' + globalToken;

        this.$btSend.setAttribute('disabled', 'disabled');
        ajax.open('POST', url, true);
        ajax.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

        ajax.onreadystatechange = function () {
            if (ajax.readyState == 4 && ajax.status == 200) {
                self.$btSend.removeAttribute('disabled');
                self.response(ajax.responseText);
            }
        }

        ajax.send(parameter);
    }

    response(data) {
        /*removeIf(production)*/ objWbDebug.debugMethod(this, objWbDebug.getMethodName()); /*endRemoveIf(production)*/
        let response = '';
        let color = '';

        switch (data) {
            case 'ok':
                color = 'green';
                response = globalTranslation.formSent;
                break;
            default:
                color = 'red';
                response = globalTranslation.formProblemSend;
                break;
        }

        objWfNotification.add(response, color, this.$form);
    }
}
class WbManagement {
    verifyLoad() {
        /*removeIf(production)*/ objWbDebug.debugMethod(this, objWbDebug.getMethodName()); /*endRemoveIf(production)*/
        window.addEventListener('load', this.applyClass(), { once: true });
    }

    applyClass() {
        /*removeIf(production)*/ objWbDebug.debugMethod(this, objWbDebug.getMethodName()); /*endRemoveIf(production)*/
        objWbTranslation.build();
        objWbBlog.build();
        objWbForm.build();
    }
}
class WbTranslation {
    build() {
        /*removeIf(production)*/ objWbDebug.debugMethod(this, objWbDebug.getMethodName()); /*endRemoveIf(production)*/
        this.update();
        this.defineActive();
        this.buildMenu();
    }

    buildMenu() {
        /*removeIf(production)*/ objWbDebug.debugMethod(this, objWbDebug.getMethodName()); /*endRemoveIf(production)*/
        this.$select.addEventListener('change', function () {
            let selected = this.selectedIndex;
            let value = this.options[selected].getAttribute('data-url');

            window.location.replace(value);
        });
    }

    defineActive() {
        /*removeIf(production)*/ objWbDebug.debugMethod(this, objWbDebug.getMethodName()); /*endRemoveIf(production)*/
        this.$select.value = globalLanguage;
    }

    update() {
        /*removeIf(production)*/ objWbDebug.debugMethod(this, objWbDebug.getMethodName()); /*endRemoveIf(production)*/
        this.$select = document.querySelector('#translationSelect');
    }
}
class WbUrl {
    buildSEO(url) {
        /*removeIf(production)*/ objWbDebug.debugMethod(this, objWbDebug.getMethodName()); /*endRemoveIf(production)*/
        return url.toString()               // Convert to string
            .normalize('NFD')               // Change diacritics
            .replace(/[\u0300-\u036f]/g, '') // Remove illegal characters
            .replace(/\s+/g, '-')            // Change whitespace to dashes
            .toLowerCase()                  // Change to lowercase
            .replace(/&/g, '-and-')          // Replace ampersand
            .replace(/[^a-z0-9\-]/g, '')     // Remove anything that is not a letter, number or dash
            .replace(/-+/g, '-')             // Remove duplicate dashes
            .replace(/^-*/, '')              // Remove starting dashes
            .replace(/-*$/, '');             // Remove trailing dashes
    }

    build(target) {
        /*removeIf(production)*/ objWbDebug.debugMethod(this, objWbDebug.getMethodName()); /*endRemoveIf(production)*/
        window.location = globalUrl + globalLanguage + '/' + target + '/';
    }

    getController(obj) {
        /*removeIf(production)*/ objWbDebug.debugMethod(this, objWbDebug.getMethodName()); /*endRemoveIf(production)*/
        return './application/controller/' + obj['folder'] + '/' + obj['file'] + '.php';
    }

    getView(obj) {
        /*removeIf(production)*/ objWbDebug.debugMethod(this, objWbDebug.getMethodName()); /*endRemoveIf(production)*/
        return './application/view/' + obj['folder'] + '/' + obj['file'] + '.php';
    }

    watch(fieldWatch, fieldReturn) {
        /*removeIf(production)*/ objWbDebug.debugMethod(this, objWbDebug.getMethodName()); /*endRemoveIf(production)*/
        const self = this;

        fieldWatch.addEventListener('focusout', function () {
            fieldReturn.value = self.buildSEO(fieldWatch.value);
        });
    }
}
/*removeIf(production)*/
var objWbDebug = new WbDebug();
/*endRemoveIf(production)*/

var objWbBlog = new WbBlog();
var objWbForm  = new WbForm();
var objWbManagement = new WbManagement();
var objWbTranslation = new WbTranslation();
var objWbUrl = new WbUrl();

objWbManagement.verifyLoad();
/*removeIf(production)*/
const objDebug = new Debug();
/*endRemoveIf(production)*/
const objAccountActivate = new AccountActivate();
const objCarousel = new Carousel();
const objManagement = new Management();
const objPasswordReset = new PasswordReset();
const objRanking = new Ranking();
const objRankingSearch = new RankingSearch();
const objTheme = new Theme();

objManagement.verifyLoad();