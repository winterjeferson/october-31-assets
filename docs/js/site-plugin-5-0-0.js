export class WbBlog {
    constructor() {
        this.classlaodMore = 'loadMore';
        this.classDisabled = 'button--disabled';
    }

    build() {
        if (!getUrlWord('blog')) return;

        this.update();
        this.buildMenu();
    }

    update() {
        this.page = 'pageBlog';
        this.$lastPost = document.querySelector('#' + this.page + 'LastPost');
        this.$mostViewed = document.querySelector('#' + this.page + 'MostViewed');
    }

    buildMenu() {
        let elLastPost = this.$lastPost.querySelector(`[data-id="${this.classlaodMore}"]`);
        let elMostViewed = this.$mostViewed.querySelector(`[data-id="${this.classlaodMore}"]`);

        if (!this.$lastPost) return;

        if (document.contains(elLastPost)) {
            elLastPost.addEventListener('click', () => {
                this.loadMore(elLastPost);
            });
        }

        if (document.contains(elMostViewed)) {
            elMostViewed.addEventListener('click', () => {
                this.loadMore(elMostViewed);
            });
        }
    }

    loadMore(target) {
        let self = this;
        let parentId = target.parentNode.parentNode.getAttribute('id');
        let parentIdString = parentId.substring(this.page.length);
        let ajax = new XMLHttpRequest();
        let url = objWbUrl.getController({
            'folder': 'blog',
            'file': 'LoadMore'
        });
        let parameter =
            '&target=' + parentIdString;

        target.classList.add(this.classDisabled);
        ajax.open('POST', url, true);
        ajax.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        ajax.onreadystatechange = () => {
            if (ajax.readyState === 4 && ajax.status === 200) {
                target.classList.remove(this.classDisabled);
                self.loadMoreSuccess(parentId, ajax.responseText);
            }
        };
        ajax.send(parameter);
    }

    loadMoreSuccess(parentId, value) {
        let json = JSON.parse(value);
        let $section = document.querySelector('#' + parentId);
        let $sectionList = $section.querySelector('.blog-list');
        let $bt = $section.querySelector('[data-id="' + this.classlaodMore + '"]');

        if (!json[this.classlaodMore]) {
            $bt.classList.add(this.classDisabled);
        }

        $sectionList.insertAdjacentHTML('beforeend', json['html']);
        window.scrollTo(0, document.documentElement.scrollTop + 1);
        window.scrollTo(0, document.documentElement.scrollTop - 1);
    }
}
export class WbForm {
    build() {
        if (!getUrlWord('contact')) return;

        this.update();
        this.buildMenu();
    }

    update() {
        this.$page = document.querySelector('#pageContact');
        this.$form = this.$page.querySelector('.form');
        this.$formFieldName = this.$form.querySelector('[data-id="fieldName"]');
        this.$formFieldEmail = this.$form.querySelector('[data-id="fieldEmail"]');
        this.$formFieldMessage = this.$form.querySelector('[data-id="fieldMessage"]');
        this.$btSend = this.$page.querySelector('[data-id="btSend"]');
    }

    buildMenu() {
        const self = this;

        this.$btSend.addEventListener('click', () => {
            if (objWfForm.validateEmpty([self.$formFieldEmail, self.$formFieldMessage])) {
                self.send();
            }
        });
    }

    send() {
        const self = this;
        const ajax = new XMLHttpRequest();
        const url = objWbUrl.getController({
            'folder': 'form',
            'file': 'FormAjax'
        });
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
            if (ajax.readyState === 4 && ajax.status === 200) {
                self.$btSend.removeAttribute('disabled');
                self.response(ajax.responseText);
            }
        };

        ajax.send(parameter);
    }

    response(data) {
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
export class WbTranslation {
    build() {
        this.update();
        this.defineActive();
        this.buildMenu();
    }

    buildMenu() {
        this.$select.addEventListener('change', function () {
            let selected = this.selectedIndex;
            let value = this.options[selected].getAttribute('data-url');

            window.location.replace(value);
        });
    }

    defineActive() {
        this.$select.value = globalLanguage;
    }

    update() {
        this.$select = document.querySelector('#translationSelect');
    }
}
export class WbUrl {
    buildSEO(url) {
        return url.toString() // Convert to string
            .normalize('NFD') // Change diacritics
            .replace(/[\u0300-\u036f]/g, '') // Remove illegal characters
            .replace(/\s+/g, '-') // Change whitespace to dashes
            .toLowerCase() // Change to lowercase
            .replace(/&/g, '-and-') // Replace ampersand
            .replace(/[^a-z0-9\-]/g, '') // Remove anything that is not a letter, number or dash
            .replace(/-+/g, '-') // Remove duplicate dashes
            .replace(/^-*/, '') // Remove starting dashes
            .replace(/-*$/, ''); // Remove trailing dashes
    }

    build(target) {
        window.location = globalUrl + globalLanguage + '/' + target + '/';
    }

    buildVersion() {
        const objVersion = JSON.parse(globalVersion);

        this.pathSite = `./site/${objVersion.site}/php/`;
    }

    getController(obj) {
        this.buildVersion();

        return `${this.pathSite}controller/${obj['folder']}/${obj['file']}.php`;
    }

    getView(obj) {
        this.buildVersion();

        return `${this.pathSite}view/${obj['folder']}/${obj['file']}.php`;
    }

    watch(fieldWatch, fieldReturn) {
        const self = this;

        fieldWatch.addEventListener('focusout', function () {
            fieldReturn.value = self.buildSEO(fieldWatch.value);
        });
    }
}