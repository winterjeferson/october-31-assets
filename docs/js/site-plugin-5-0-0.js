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
/*removeIf(production)*/
var objWbDebug = new WbDebug();
/*endRemoveIf(production)*/

var objWbBlog = new WbBlog();
var objWbForm  = new WbForm();
var objWbManagement = new WbManagement();
var objWbTranslation = new WbTranslation();
var objWbUrl = new WbUrl();

objWbManagement.verifyLoad();