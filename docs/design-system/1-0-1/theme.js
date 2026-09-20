export class Management {
    static async init() {
        await HTML.loadIconSprite();

        customElements.define(`${Components.prefixComponentDash}tooltip`, Tooltip);
        customElements.define(`${Components.prefixComponentDash}form-field`, FormField);
        customElements.define(`${Components.prefixComponentDash}button`, Button);
        customElements.define(`${Components.prefixComponentDash}progress`, Progress);
        customElements.define(`${Components.prefixComponentDash}select`, Select);
        customElements.define(`${Components.prefixComponentDash}modal`, Modal);
        customElements.define(`${Components.prefixComponentDash}page`, Page);
        customElements.define(`${Components.prefixComponentDash}confirmation`, Confirmation);
        customElements.define(`${Components.prefixComponentDash}bug-report`, BugReport);
        customElements.define(`${Components.prefixComponentDash}password-reset`, PasswordReset);
        customElements.define(`${Components.prefixComponentDash}suggestion`, Suggestion);

        Translation.init();
        await Translation.translate('default');
        MenuDropDown.init();
        MenuToggle.init();
    }
}
export class Analytics {
    static get env() {
        return gbIsLocalHost ? 'localhost' : 'production';
    }

    static get isLoaded() {
        return typeof window.gtag === 'function';
    }

    static load() {
        if (window.gtag || !gbGoogleAnalyticsId) return;

        const scriptTag = document.createElement('script');
        scriptTag.async = true;
        scriptTag.src = `https://www.googletagmanager.com/gtag/js?id=${gbGoogleAnalyticsId}`;
        document.head.appendChild(scriptTag);

        window.dataLayer = window.dataLayer || [];
        window.gtag = function () {
            window.dataLayer.push(arguments);
        };
        window.gtag('js', new Date());
        window.gtag('config', gbGoogleAnalyticsId);
    }

    static push(eventName, params = {}) {
        if (!this.isLoaded) return;

        window.gtag('event', eventName, {
            o31_env: this.env,
            ...params,
        });
    }

    static pageView(props) {
        const { page_title, page_location } = props;

        this.push('o31_page_view', {
            page_title,
            page_location,
        });
    }

    static siteEvent(props) {
        const { event_name, ...params } = props;

        this.push(`o31_site_${event_name}`, params);
    }

    static gameEvent(props) {
        const { event_name, ...params } = props;

        this.push(`o31_game_${event_name}`, params);
    }
}

export class Code {
    static colors = [
        { id: 0, color: 'red' },
        { id: 1, color: 'green' },
        { id: 2, color: 'orange' },
    ];
    static codes = [
        { id: 'default', translation: 'default', color: 0 },
        { id: 'emailInvalid', translation: 'email_invalid', color: 0 },
        { id: 'emailNotFound', translation: 'email_not_found', color: 0 },
        { id: 'emailSent', translation: 'email_sent', color: 1 },
        { id: 'emailAlreadyActivated', translation: 'email_already_activated', color: 2 },
        { id: 'emailAlreadyRegistered', translation: 'email_already_registered', color: 2 },
        { id: 'emailOrPasswordInvalid', translation: 'email_or_password_invalid', color: 0 },
        { id: 'emailInactive', translation: 'email_inactive', color: 0 },
        { id: 'fieldInvalid', translation: 'field_invalid', color: 0 },
        { id: 'passwordExpired', translation: 'password_expired', color: 0 },
        { id: 'passwordStrongInvalid', translation: 'password_strong_invalid', color: 0 },
        { id: 'captchaInvalid', translation: 'captcha_invalid', color: 0 },
        { id: 'checkboxInvalid', translation: 'checkbox_invalid', color: 0 },
        { id: 'userNameInvalid', translation: 'user_name_invalid', color: 2 },
        { id: 'userNotFound', translation: 'user_not_found', color: 0 },
        { id: 'userAlreadyRegistered', translation: 'user_already_registered', color: 0 },
        { id: 'specialCharactersNotAllowed', translation: 'special_characters_not_allowed', color: 0 },
        { id: 'registerDone', translation: 'register_done', color: 1 },
    ];

    static getCode(id) {
        const getValue = (target, item) => this[target].find(index => index.id === item);
        const code = getValue('codes', id);
        const color = code?.color || 0;
        const codeTranslation = code?.translation;
        const translation = Translation.translation.default.code[codeTranslation];
        const response = { translation, color };

        return response;
    }
}
export class Components {
    static styleCache = {};
    static prefix = 'ds';


    static buildName(prefix, name) {
        const response = `${prefix}${name}`;

        return response;
    }

    static dispatch(props) {
        const { event, context, detail } = props;

        context.dispatchEvent(new CustomEvent(event, {
            detail,
            bubbles: true,
            composed: true
        }));
    }

    static insert(props) {
        const {
            el = document.body,
            position = 'afterbegin',
            html
        } = props;
        el.insertAdjacentHTML(position, html);
    }

    static init(components) {
        components.forEach(([component, className]) => {
            this.#define({
                component,
                className
            });
        });
    }

    static get componentButton() {
        const response = this.#buildName('button');

        return response;
    }

    static get componentBugReport() {
        const response = this.#buildName('bug-report');

        return response;
    }

    static get componentFormField() {
        const response = this.#buildName('form-field');

        return response;
    }

    static get componentModal() {
        const response = this.#buildName('modal');

        return response;
    }

    static get componentPage() {
        const response = this.#buildName('page');

        return response;
    }

    static get componentProgress() {
        const response = this.#buildName('progress');

        return response;
    }

    static get componentPasswordReset() {
        const response = this.#buildName('password-reset');

        return response;
    }

    static get componentSelect() {
        const response = this.#buildName('select');

        return response;
    }

    static get componentSuggestion() {
        const response = this.#buildName('suggestion');

        return response;
    }

    static get componentBugReport() {
        const response = this.#buildName('bug-report');

        return response;
    }

    static get prefixComponent() {
        const response = 'c-';

        return response;
    }

    static get prefixComponentDash() {
        const response = `${this.prefixComponent}${this.prefix}-`;

        return response;
    }

    static loadStyles(shadowRoot, file) {
        let fileStyle = this.styleCache[file];
        if (fileStyle) return fileStyle;
        const globalStyles = Array.from(document.styleSheets).find(
            sheet => sheet.href && sheet.href.includes(file)
        );
        const isValid = globalStyles && shadowRoot;
        let style = '';

        if (isValid) {
            try {
                const cssRules = Array.from(globalStyles.cssRules).map(rule => rule.cssText).join(' ');

                style = cssRules;
                fileStyle = style;
            } catch (error) {
                console.error('Failed to apply global styles:', error);
            }
        }
        return style;
    }

    static render(props, component) {
        const { context, fileCss } = props;
        const shadowRoot = context.shadowRoot;
        const cacheKey = fileCss || '__default__';

        if (!this.styleCache[cacheKey]) {
            const files = this.#globalStyleFiles(fileCss);

            let styles = '';
            const length = files.length;

            for (let i = 0; i < length; i++) {
                styles += this.loadStyles(shadowRoot, files[i]);
            }

            styles = this.replaceAssets(styles);
            this.styleCache[cacheKey] = `<style>${styles}</style>`;
        }

        const contextClasses = context.getAttribute('context') || '';
        const cssClass = context.getAttribute('css-wrapper') || '';
        const allClasses = [contextClasses, cssClass].filter(Boolean).join(' ');
        const response = this.replaceAssets(component);
        const wrapped = allClasses
            ? `<div class="${allClasses}">${response}</div>`
            : response;

        shadowRoot.innerHTML = this.styleCache[cacheKey] + wrapped;
    }

    static replaceAssets(content) {
        const response = content.replace(/__replace_folder_assets__/g, gbFolderGameAssetsImg);
        return response;
    }



    static #buildName(name) {
        const response = this.buildName(this.prefixComponentDash, name);

        return response;
    }

    static #define(args) {
        const {
            component,
            className
        } = args;

        if (customElements.get(component)) {
            return;
        }

        customElements.define(component, className);
    }

    static #globalStyleFiles(fileCss) {
        const files = [
            typeof gbFileDesignSystem !== 'undefined' ? gbFileDesignSystem : '',
            typeof gbFileGame !== 'undefined' ? gbFileGame : '',
            typeof gbFileLore !== 'undefined' ? gbFileLore : '',
            typeof gbFileSite !== 'undefined' ? gbFileSite : '',
            fileCss
        ].filter(Boolean);

        return files;
    }
}
export class ConfirmationHandler {
    static open(props) {
        return new Promise(resolve => {
            const el = document.createElement('c-ds-confirmation');

            if (props.title) el.setAttribute('modal_title', props.title);
            if (props.text) el.setAttribute('text', props.text);
            if (props.size) el.setAttribute('size', props.size);

            el.setAttribute('open', 'true');

            el.addEventListener('confirmation-result', e => {
                resolve(e.detail.confirmed);
            });

            document.body.appendChild(el);
        });
    }
}
export class DataCache {
    static cache = {};

    static init(node, version) {
        const data = this.getLocalStorage(node);
        const isDifferent = data?.version !== version;
        if (!data || isDifferent) {
            this.setLocalStorage(node, { version });
            this.cache[node] = {};
        } else {
            this.cache[node] = data;
        }
    }

    static async get(node, key, url) {
        if (!this.cache[node]) this.cache[node] = this.getLocalStorage(node) || {};

        const cached = this.cache[node][key];
        if (cached && cached.url === url) return cached.data;

        const fetched = await this.requestFile(url);
        this.cache[node][key] = { url, data: fetched };

        const storage = this.getLocalStorage(node) || {};
        storage[key] = { url, data: fetched };
        this.setLocalStorage(node, storage);

        return fetched;
    }

    static getLocalStorage(node) {
        const raw = Storage.getValue(node);
        try {
            return JSON.parse(raw);
        } catch {
            return {};
        }
    }

    static setLocalStorage(node, value) {
        Storage.setValue({ target: node, value: JSON.stringify(value) });
    }

    static async requestFile(url) {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Failed to fetch: ${url}`);
        return await response.json();
    }
}
export class DataLoader {
    static #pending = Promise.resolve();

    static fetchData(props) {
        const result = this.#pending.then(() => this.#execute(props));

        this.#pending = result.catch(() => { });

        return result;
    }

    static async #execute(props) {
        const {
            controller,
            action,
            method = 'POST',
            ...params
        } = props;
        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded'
        };
        const body = new URLSearchParams();
        const args = { controller, action, token: gbToken, ...params };

        const jsonFields = ['tiles', 'collectibles', 'doors', 'monsters', 'npcs', 'playerPositions', 'ids'];

        Object.entries(args).forEach(([key, value]) => {
            const isArray = Array.isArray(value);
            const isJsonField = jsonFields.includes(key);

            if (isArray && isJsonField) {
                body.append(key, JSON.stringify(value));
                return;
            }

            if (isArray) {
                value.forEach((item, index) => {
                    Object.entries(item).forEach(([itemKey, itemValue]) => {
                        body.append(`${key}[${index}][${itemKey}]`, itemValue);
                    });
                });

                return;
            }

            body.append(key, value);
        });

        const endpoint = gbUrlApp;

        return new Promise((resolve) => {
            fetch(endpoint, {
                method,
                headers,
                body
            })
                .then(response => {
                    if (!response.ok) throw new Error('Network response was not ok');
                    return response.json();
                })
                .then(data => {
                    const response = this.fetchDataResponse(data);
                    resolve(response);
                })
                .catch(error => console.error('Error:', error));
        });
    }

    static async fetchDataResponse(props) {
        const {
            isError,
            isMaintenance,
            data,
            debug,
            errorMessage,
            token
        } = props;
        const hasQueryWarning = debug?.hasQueryWarning;

        if (token) {
            gbToken = token;
        }

        if (isError || hasQueryWarning) {
            let translation;
            let color;

            if (errorMessage === Prefix.TOKEN_INVALID) {
                translation = Translation?.default?.code?.token_invalid;
                color = 'red';
            } else if (isError) {
                translation = Translation?.default?.code[errorMessage];
                color = 'red';
            }

            if (hasQueryWarning) {
                translation = Translation?.default?.code?.query_warning;
                color = 'pink';
            }

            const {
                color: propColor = 'pink',
                position = 'right',
                size = 'regular'
            } = props;

            const args = {
                content: translation,
                color: color || propColor,
                position,
                size
            };

            Notification.add(args);
            if (isError) return props;
        }

        if (isMaintenance) return alert('isMaintenance');

        return data;
    }
}
export class MenuDropDown {
    static cssWrapper = 'ds-drop-down';
    static cssContent = `${this.cssWrapper}__content`;
    static cssOpend = `${this.cssContent}--opened`;

    static addEventListeners() {
        const data = [
            {
                el: document,
                handler: this.close
            }
        ];

        this.els.forEach((index) => {
            data.push({
                el: index,
                handler: this.toggleContent
            });

            const elContent = index.querySelector(`.${this.cssContent}`);
            if (elContent) {
                data.push({
                    el: elContent,
                    event: 'click',
                    handler: this.closeOnChildClick
                });
            }
        });

        data.forEach((index) => {
            index.context = this;
            Helper.addEventListener(index);
        });
    }

    static close(event) {
        const target = event?.target;
        if (!target) return;
        if (target.closest(`.${this.cssWrapper}`)) return;

        this.els.forEach((index) => {
            const elContent = index.querySelector(`.${this.cssContent}`);
            if (!elContent) return;
            Helper.removeClass(elContent, this.cssOpend);
        });
    }

    static closeOnChildClick(event) {
        event.stopPropagation();
        const dropdown = event.currentTarget.closest(`.${this.cssWrapper}`);
        if (!dropdown) return;
        const elContent = dropdown.querySelector(`.${this.cssContent}`);
        Helper.removeClass(elContent, this.cssOpend);
    }

    static init() {
        this.updateHTML();
        if (this.els.length === 0) return;
        this.addEventListeners();
    }

    static toggleContent(event) {
        event.stopPropagation();
        const el = event.currentTarget;
        const elContent = el.querySelector(`.${this.cssContent}`);
        Helper.toggleClass(elContent, this.cssOpend);
    }

    static updateHTML() {
        this.els = document.querySelectorAll(`.${this.cssWrapper}`);
    }
}

export class Helper {
    static addClass(target, classCss) {
        if (!target || !classCss) return;

        if (Array.isArray(classCss)) {
            target.classList.add(...classCss);
        } else {
            target.classList.add(classCss);
        }
    }

    static addEventListener(props) {
        const {
            el,
            event = 'click',
            handler,
            context = el,
            isOnce = false
        } = props;

        if (el) el.addEventListener(event, handler.bind(context), { once: isOnce });
    }

    static addEventListenerDOM(target) {
        document.addEventListener('DOMContentLoaded', () => {
            window.addEventListener('load', () => {
                target?.handleLoaded();
            });
        });
    }

    static buildDataId(target) {
        const response = `[data-id="${target}"]`;

        return response;
    }

    static buildId(target) {
        const removeEmptySpaces = Helper.removeEmptySpaces(target);
        const convertToLowerCase = Helper.convertToLowerCase(removeEmptySpaces);

        return convertToLowerCase;
    }

    static buildJSON(target) {
        const response = undefined;

        if (typeof target !== 'string') return response;

        try {
            return JSON.parse(target);
        } catch {
            return response;
        }
    }

    static buildBoolenFromHTML(target) {
        let response = undefined;

        if (target === 'true') response = true;
        if (target === 'false') response = false;

        return response;
    }

    static buildJSONToHTML(target) {
        if (typeof target === 'undefined') return;
        const json = String(JSON.stringify(target));
        const response = this.escapeHTML(json);

        return response;
    }

    static calculatePercentage(value, valueMax, isRound = false) {
        const calc = (Number(value) / Number(valueMax)) * 100;
        const response = isRound ? Math.round(calc) : calc;

        return response;
    }

    static capitalizeString(target) {
        if (!target) return;

        const response = this.convertToUpperCase(target.charAt(0)) + target.slice(1);

        return response;
    }

    static convertToLowerCase(target) {
        const response = target.toLowerCase();

        return response;
    }

    static convertToUpperCase(target) {
        const response = target.toUpperCase();

        return response;
    }

    static convertCamelToSnake(target) {
        const response = target.replace(/([A-Z])/g, '_$1').toLowerCase();

        return response;
    }

    static escapeHTML(target) {
        const string = String(target ?? '');
        const response = string.replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');

        return response;
    }

    static findById(itens, target) {
        const response = itens.find(index => index.id === target);

        return response;
    }

    static getAttributeAsNumber(target, attribute) {
        const response = Number(target.getAttribute(attribute));

        return response;
    }

    static getElementByDataId(context, target) {
        const dataId = this.buildDataId(target);
        const response = context.querySelector(dataId);

        return response;
    }

    static getElementsByDataId(context, target) {
        const dataId = this.buildDataId(target);
        const response = context.querySelectorAll(dataId);

        return response;
    }

    static getJsonFromAttribute(context, target) {
        const response = this.buildJSON(context.getAttribute(target));

        return response;
    }

    static getPositionX(target) {
        const response = this.getAttributeAsNumber(target, Layout.attributePositionX);

        return response;
    }

    static getPositionY(target) {
        const response = this.getAttributeAsNumber(target, Layout.attributePositionY);

        return response;
    }

    static getCaptchaResponse() {
        if (typeof grecaptcha === 'undefined') return '';

        const response = grecaptcha.getResponse();

        return response;
    }

    static getNow() {
        const response = Math.floor(Date.now() / 1000);

        return response;
    }

    static getRandomBetween(min, max) {
        const response = Math.floor(Math.random() * (max - min + 1)) + min;

        return response;
    }

    static getTranslateValue(target) {
        const response = { x: 0, y: 0, z: 0 };

        if (typeof target === 'undefined') return response;

        const style = window.getComputedStyle(target);
        const matrix = style.transform;

        if (!matrix || matrix === 'none') return response;

        const matrixType = matrix.includes('3d') ? '3d' : '2d';
        const matrixValues = matrix.match(/matrix.*\((.+)\)/);

        if (matrixValues) {
            const values = matrixValues[1].split(', ');
            if (matrixType === '2d') {
                return {
                    x: Number(values[4]),
                    y: Number(values[5]),
                    z: 0
                };
            } else if (matrixType === '3d') {
                return {
                    x: Number(values[12]),
                    y: Number(values[13]),
                    z: Number(values[14])
                };
            }
        }

        return response;
    }

    static getUrlParameter(target) {
        const url = top.location.search.substring(1);
        const parameter = url.split('&');

        for (let i = 0; i < parameter.length; i++) {
            const parameterName = parameter[i].split('=');
            const found = parameterName[0] === target;

            if (found) return parameterName[1];
        }
    }

    static async handleResponse(props) {
        const isError = props?.isError || false;
        const isNotification = props?.isNotification || false;
        const code = props?.code || props?.errorMessage || false;
        const size = props?.size || this.modalSizeDefault;
        const title = props?.title || false;
        const getCode = code ? Code.getCode(code) : false;
        const colorCode = getCode
            ? (typeof getCode.color === 'number' ? Code.colors[getCode.color].color : getCode.color)
            : false;
        const color = isError ? Notification.colorError : (colorCode || Notification.colorDefault);
        const contentCode = getCode && getCode.translation ? getCode.translation : '';
        const content = contentCode
            || (code ? Translation.default.code[code] : '')
            || props?.content
            || '';
        const args = {};

        if (size) args.size = size;
        if (color) args.color = color;
        if (title) args.title = title;
        if (content) args.content = content;
        if (isError) return isError;
        if (isNotification) Notification.add(args);

        return isError;
    }

    static log(title, data, color = null) {
        let dataFormatted = data;

        try {
            dataFormatted = JSON.parse(JSON.stringify(data));
        } catch {
            dataFormatted = data;
        }

        const response = color
            ? console.log(
                `%c${title}`,
                `color: ${color};`,
                dataFormatted
            )
            : console.log(title, dataFormatted);

        return response;
    }

    static isElementVisible(el) {
        if (!el) return false;

        const rect = el.getBoundingClientRect();

        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    static isString(target) {
        const response = typeof target === 'string';

        return response;
    }

    static isStringEmpty(target) {
        const isEmpty = target === '';
        const isUndefined = typeof target === 'undefined';
        const isNull = target === null;
        const response = isEmpty || isUndefined || isNull;

        return response;
    }

    static isObjectContent(data) {
        const length = Object.entries(data).length;
        const response = length > 0;

        return response;
    }

    static removeClass(target, css) {
        if (!target || !css) return;

        if (Array.isArray(css)) {
            css.forEach((className) => target.classList.remove(className));
        } else if (target.classList.contains(css)) {
            target.classList.remove(css);
        }
    }

    static removeEmptySpaces(str) {
        const response = str.replace(/\s+/g, '');

        return response;
    }

    static renderCaptcha(id = '') {
        if (!gbIsCaptcha) return;

        const el = document.getElementById(Layout.idCaptcha + id);
        const recaptcha = Statics.recaptcha;

        if (!el) return;

        el.setAttribute('class', 'g-recaptcha');
        el.setAttribute('data-sitekey', recaptcha);
        el.setAttribute('data-action', 'LOGIN');

        if (grecaptcha.render) grecaptcha.render(el, {
            'sitekey': recaptcha,
            'action': 'LOGIN',
        });
    }

    static replaceInText(props) {
        let {
            text,
            isRuleLayout = false,
            ruleList,
            ruleTranslation = {}
        } = props;

        if (!text || typeof text !== 'string') {
            throw new Error('text must be a string');
        }

        const hasRule = typeof ruleList !== 'undefined';
        const regex = /\{\{(.*?)\}\}/g;

        const resolveValue = (obj) => {
            if (obj === undefined || obj === null) return '';
            if (typeof obj !== 'object') return String(obj);

            const entries = Object.entries(obj);
            if (entries.length === 0) return '';
            if (entries.length === 1) return String(entries[0][1]);

            return entries.map(([k, v]) => `${k}: ${v}`).join(', ');
        };

        const findPrefix = (key) => {
            const snake = this.convertCamelToSnake(key);
            const lower = key.toLowerCase();
            return (
                ruleTranslation[key] ||
                ruleTranslation[snake] ||
                ruleTranslation[lower] ||
                null
            );
        };

        const applyPrefixOutside = (prefix, value, isRuleLayout) => {
            if (!prefix) return isRuleLayout ? `<span>${value}</span>` : value;
            if (isRuleLayout) return `${prefix}: <span>${value}</span>`;

            return `${prefix}: ${value}`;
        };

        text = text.replace(regex, (_, rulePath) => {
            if (!hasRule) return isRuleLayout ? '<span></span>' : '';

            const keys = rulePath.split('.');
            const lastKey = keys[keys.length - 1];

            const resolvePath = (obj, path) => {
                return path.split('.').reduce((acc, part) => {
                    if (acc === undefined || acc === null) return undefined;

                    const match = part.match(/^(\w+)\[(\d+)\]$/);

                    if (match) {
                        const [, key, index] = match;
                        return acc[key]?.[Number(index)];
                    }

                    return acc[part];
                }, obj);
            };

            const resolvedRule = resolvePath(ruleList, rulePath);
            const value = resolveValue(resolvedRule);
            const prefix = findPrefix(lastKey);

            return applyPrefixOutside(prefix, value, isRuleLayout);
        });

        return text;
    }

    static resetCaptcha() {
        if (typeof grecaptcha === 'undefined') return;

        grecaptcha.reset();
    }

    static shuffle(array) {
        const length = array.length;

        for (let i = length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }

        return array;
    }

    static sortData(data, sortBy) {
        const response = [...data].sort((a, b) => a[sortBy] - b[sortBy]);

        return response;
    }

    static toggleButtonEnabled(props) {
        const elButton = props.button;
        const action = props.action;
        const attribute = 'disabled';

        if (action) return elButton.setAttribute(attribute, action);

        elButton.removeAttribute(attribute);
    }

    static toggleClass(target, classCss) {
        if (!target || !classCss) return;

        if (Array.isArray(classCss)) {
            classCss.forEach((className) => target.classList.toggle(className));
        } else {
            target.classList.toggle(classCss);
        }
    }

    static validateCaptcha() {
        if (!gbIsCaptcha) return true;

        const isCaptcha = grecaptcha && Helper.getCaptchaResponse().length !== 0;
        const props = {
            content: {
                isError: true,
                code: 'captchaInvalid'
            }
        };
        const content = props.content;

        if (isCaptcha) return true;

        content.size = this.modalSizeDefault;
        content.title = Translation.translation.interface.response.response;
        Helper.handleResponse(content);
        Helper.resetCaptcha();

        return false;
    }

    static validateEmail(target) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const response = regex.test(target.value);

        Helper.validateFormField(target, response);
        return response;
    }

    static validateFormEmptyValue(target, value) {
        const response = value !== '';

        Helper.validateFormField(target, response);
        return response;
    }

    static validateFormFieldEmpty(target) {
        const response = target.value !== '';

        Helper.validateFormField(target, response);
        return response;
    }

    static validateFormField(target, isValid) {
        const css = 'ds-form__input--invalid';

        let element = target;

        if (target.matches(Components.componentFormField)) {
            element = target.shadowRoot.querySelector('input');
        }

        if (!element) {
            return;
        }

        if (isValid) {
            Helper.removeClass(element, css);
        } else {
            Helper.addClass(element, css);
        }
    }
}
export class HTML {
    static drawDivCentered(content) {
        const response = `<div class="ds-center">${content}</div>`;
        return response;
    }

    static drawIcon(props) {
        const { icon } = props;
        props.cssPrefix = 'icon';
        const css = Layout.buildCss(props);
        const iconSource = this.icons?.[icon];
        const attributes = iconSource
            ? `viewBox="${iconSource.viewBox}" xmlns="http://www.w3.org/2000/svg"`
            : '';
        const content = iconSource ? iconSource.html : '';
        const html = `
            <svg ${css} ${attributes}>
                ${content}
                <use xlink:href="#${icon}"></use>
            </svg>
        `;
        return html;
    }

    static drawIconStatus(isDone) {
        const theme = isDone ? 'green' : 'purple';
        const props = {
            theme,
            size: 'big',
            icon: 'check'
        };
        const icon = HTML.drawIcon(props);

        return icon;
    }

    static drawLoading(props) {
        const { theme, size, id = '' } = props;
        const htmlLoading = `
            <div class="ds-loading ds-loading-2 ds-loading-2--${size} ds-loading-2--${theme} ds-animate"></div>`;
        const html = `
            <div class="ds-loading ds-center" id="${id}">
                ${htmlLoading}
                ${htmlLoading}
                ${htmlLoading}
            </div>
        `;
        return html;
    }

    static async loadIconSprite() {
        if (this.spriteLoaded) return;

        this.spriteLoaded = true;

        try {
            const response = await fetch(gbFileIcon);
            const text = await response.text();
            const doc = new DOMParser().parseFromString(text, 'image/svg+xml');
            const symbols = doc.querySelectorAll('symbol');
            this.icons = {};

            for (const symbol of symbols) {
                this.icons[symbol.id] = {
                    viewBox: symbol.getAttribute('viewBox'),
                    html: symbol.innerHTML
                };
            }

            const svg = doc.documentElement;

            if (svg?.localName === 'svg') {
                svg.setAttribute('aria-hidden', 'true');
                svg.style.display = 'none';
                document.body.appendChild(svg);
            }
        } catch (error) {
            console.error('Failed to load icons:', error);
        }
    }

    static drawRibbon(title) {
        const html = `
            <div class="ds-center">
                <div class="ds-ribbon">
                    <div class="ds-ribbon__content">
                        <div class="ds-center">
                            <div class="ds-content__title">
                                <h2 class="ds-title">${title}</h2>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        return html;
    }

    static drawS(isDone, text) {
        let response = text;
        if (isDone) response = `<s class="ds-s">${text}</s>`;
        return response;
    }

    static drawTH(text) {
        const response = `
            <th>${text}</th>
        `;
        return response;
    }

    static drawTD(content, isCentered = false) {
        const css = isCentered ? ' class="ds-middle" ' : '';
        const response = `
            <td ${css}>
                ${content}
            </td>
        `;
        return response;
    }
}
export class Layout {
    static attributeActive = 'is-active';
    static attributeOpen = 'is-open';
    static attributePositionX = 'data-position-x';
    static attributePositionY = 'data-position-y';
    static attributePositionXInitial = `${this.attributePositionX}-initial`;
    static attributePositionYInitial = `${this.attributePositionY}-initial`;

    static cssNamespace = 'ds-';
    static cssAnimationPrepare = `${this.cssNamespace}animation-prepare`;
    static cssDisplay = `${this.cssNamespace}display-none`;
    static cssButtonActive = `${this.cssNamespace}button--active`;
    static cssAnimationFadeIn = `${this.cssNamespace}animation--fade-in`;
    static cssAnimationFadeOut = `${this.cssNamespace}animation--fade-out`;
    static cssAnimationFromLeft = `${this.cssNamespace}animation--from-left`;
    static cssAnimationFromRight = `${this.cssNamespace}animation--from-right`;
    static cssFormField = `${this.cssNamespace}column ${this.cssNamespace}form__field`;
    static cssTile = `${this.cssNamespace}tile`;

    static idCaptcha = 'captcha';

    static tileSize = 50;
    static tileSizeHalf = this.tileSize / 2;
    static durabilityColors = ['green', 'orange', 'red'];
    static symbol = {
        'infinity': '∞'
    };
    static theme = {
        menuTab: 'purple',
        selectDefault: 'purple',
        menuDefault: 'outline--purple',
        menuDefaultIcon: 'white',
        menuSize: 'small',
        menuProceed: 'outline--blue',
        menuDanger: 'outline--red',
        menuSuccess: 'outline--green',
        form: 'ds-form ds-form--purple--dark',
        dropDownFull: 'ds-drop-down--full',
        card: 'ds-card ds-card--purple--dark',
        table: 'ds-table ds-table--purple',
    };

    static currencySymbols = {
        'pt-br': 'R$',
        'pt-BR': 'R$',
        'en': 'U$',
        'en-us': 'U$',
        'en-US': 'U$',
    };




    //accepted: data-handler-props='["param1", 123, true, "$this"]'
    static addEventListeners(context, target) {
        const itens = context.shadowRoot.querySelectorAll(target);

        itens.forEach((item) => {
            const handler = item.getAttribute('data-handler');
            const params = item.getAttribute('data-handler-props');

            if (!handler || typeof context[handler] !== 'function') return;

            let parsedParams = [];

            if (params) {
                try {
                    parsedParams = JSON.parse(params).map(p => p === '$this' ? context : p);
                } catch {
                    if (params === '$this') parsedParams = [context];
                    else console.error('Invalid JSON in data-handler-props:', params);
                }
            }

            item.addEventListener('click', (...args) => {
                const isDisabled = item.getAttribute(Prefix.ATTR_IS_DISABLED) === 'true';
                if (isDisabled) return;

                context[handler].bind(context, ...parsedParams)(...args);
            });
        });
    }

    static buildAttribute(props) {
        const label = props.label;
        const value = props.value;

        if (!value) return '';

        const response = `${label}="${value}"`;

        return response;
    }

    static buildCss(props) {
        const context = props?.context;
        const prefix = `${this.cssNamespace}${props?.cssPrefix}`;
        const attributeTheme = context ? context.getAttribute('theme') : props?.theme;
        const attributeIsProportional = context ? context.getAttribute('is-proportional') : props?.isProportional;
        const attributeIsRounded = context ? context.getAttribute('is-rounded') : props?.isRounded;
        const attributeIsFull = context ? context.getAttribute('is-full') : props?.isFull;
        const attributeSize = context ? context.getAttribute('size') : props?.size;
        let attributeCssCustom = context ? context.getAttribute('css-custom') : props?.cssCustom;

        const cssActive = props.cssActive;
        if (cssActive) attributeCssCustom += ` ${prefix}--active`;

        const cssCustom = attributeCssCustom ? `${attributeCssCustom}` : '';
        const rounded = attributeIsRounded ? `${prefix}--rounded` : '';
        const proportional = attributeIsProportional ? `${prefix}--proportional` : '';
        const full = attributeIsFull ? `${prefix}--full` : '';
        const theme = attributeTheme ? this.buildTheme(attributeTheme, prefix) : '';
        const size = attributeSize ? `${prefix}--${attributeSize}` : '';
        const value = `${prefix} ${theme} ${size} ${proportional} ${rounded} ${full} ${cssCustom}`;
        const args = {
            label: 'class',
            value,
        };
        const response = this.buildAttribute(args);

        return response;
    }

    static buildCurrencyText(props) {
        const { language, value } = props;
        const key = String(language).toLowerCase();
        const symbol = this.currencySymbols[key] || this.currencySymbols['pt-br'];
        const number = new Intl.NumberFormat('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(value);
        const response = `${symbol} ${number}`;

        return response;
    }

    static buildProgressColor(props) {
        const { value, valueMax, isReverse = false } = props;
        const math = this.buildProgressSize();
        const colors = this.durabilityColors;
        const size = Helper.calculatePercentage(value, valueMax);

        if (size <= math) return isReverse ? colors[2] : colors[0];
        if (size <= math * 2) return colors[1];

        const response = isReverse ? colors[0] : colors[2];

        return response;
    }

    static buildProgressSize() {
        const length = this.durabilityColors.length;
        const math = 100 / length;

        return math;
    }

    static buildPixel(target) {
        const response = `${target}px`;

        return response;
    }

    static buildTextCapacity(props) {
        const {
            text,
            value,
            valueMax,
            isPercentage = false
        } = props;
        let response;

        if (isPercentage) {
            const math = Helper.calculatePercentage(value, valueMax, true);
            response = text ? `${text}: ${this.buildSpan(math)}%` : `${math}%`;
        } else {
            const data = `${this.buildSpan(value)} / ${this.buildSpan(valueMax)}`;
            response = text ? `${text}: ${data}` : data;
        }

        return response;
    }

    static buildSpan(content) {
        const response = `<span>${content}</span>`;

        return response;
    }

    static buildTheme(attributeTheme, prefix) {
        const [element, modifier] = attributeTheme.split('--');
        const isElement = modifier !== undefined;
        const response = isElement
            ? `${prefix}__${element}--${modifier}`
            : `${prefix}--${attributeTheme}`;

        return response;
    }

    static drawCaptcha(id = '') {
        if (!gbIsCaptcha) return '';

        return `<div id="${Layout.idCaptcha + id}"></div>`;
    }

    static drawField(props) {
        const {
            label,
            value, id,
            type,
            required,
            autoComplete,
            rule,
            theme,
            iconTheme,
            isReadOnly,
            hint
        } = props;
        const cssDefault = Layout.cssFormField + ' ds-row';
        const css = props.css ? `${cssDefault} ${props.css}` : cssDefault;
        const typeValidation = typeof value === 'number' ? 'tel' : type ?? 'text';
        const componentFormField = Components.componentFormField;
        const escape = Helper.escapeHTML;
        const response = `
            <${componentFormField}
                ${id ? `id="${escape(id)}"` : ''}
                ${css ? `class="${escape(css)}"` : `class="${escape(cssDefault)}"`}
                ${label ? `label="${escape(label)}"` : ''}
                ${typeValidation ? `type="${escape(typeValidation)}"` : ''}
                ${value != null ? `input-value="${escape(value)}"` : ''}
                ${isReadOnly ? `is-read-only="${isReadOnly}"` : ''}
                ${required ? `required="${required}"` : ''}
                ${autoComplete ? `autocomplete="${escape(autoComplete)}"` : ''}
                ${rule ? `data-rule="${escape(rule)}"` : ''}
                ${hint ? `hint="${escape(hint)}"` : ''}
                ${theme ? `theme="${escape(theme)}"` : ''}
                ${iconTheme ? `icon-theme="${escape(iconTheme)}"` : ''}
                css-wrapper="ds-form ds-form--purple--dark"
            ></${componentFormField}> `;

        return response;
    }

    static setActiveButton(target, isActive = true) {
        const elMenu = target?.parentNode.querySelectorAll('[data-kind="button"]');
        elMenu?.forEach((index) => {
            index.setAttribute(this.attributeActive, 'false');
        });

        if (isActive) target?.setAttribute(this.attributeActive, 'true');
    }

    static getIconDataById(id) {
        const buildTooltip = (target) => Translation.gameSkill[target];
        const toolTipChanceToRun = `${buildTooltip('action_run')} <span>{{action_run.chance}}</span>.`;
        const theme = this.theme;
        const themeDefault = theme.menuDefault;
        const themeDanger = theme.menuDanger;
        const data = [
            {
                id: 'actionRun',
                icon: 'run',
                theme: themeDanger,
                tooltip: toolTipChanceToRun,
            },
            {
                id: 'actionUseItem',
                icon: 'potion',
                theme: themeDefault,
                tooltip: buildTooltip('action_use_item'),
            },
            {
                id: 'attackMeleeDouble',
                icon: 'attack_double',
                theme: themeDefault,
                tooltip: buildTooltip('attack_melee_double'),
            },
            {
                id: 'attackFireball',
                icon: 'attack_fireball',
                theme: themeDefault,
                tooltip: buildTooltip('attack_fireball'),
            },
            {
                id: 'attackMultipleArrows',
                icon: 'attack_arrow',
                theme: themeDefault,
                tooltip: buildTooltip('attack_multiple_arrows'),
            },
            {
                id: 'attackCoinThrow',
                icon: 'attack_coin',
                theme: themeDefault,
                tooltip: buildTooltip('attack_coin_throw'),
            },
            {
                id: 'attackMelee',
                icon: 'attack',
                theme: themeDefault,
                tooltip: buildTooltip('attack_melee'),
            },
            {
                id: 'attackThrowWeapon',
                icon: 'attack_throw_weapon',
                theme: themeDefault,
                tooltip: buildTooltip('attack_throw_weapon'),
            },
        ];

        const response = data.find(item => item.id === id);

        if (!response) console.error('Icon not found for id:', id, 'ds.Layout.getIconDataById()');

        return response;
    }

    static isButtonDisabled(button) {
        if (!button) return;

        const isDisabled = button.getAttribute(Prefix.ATTR_IS_DISABLED);
        const response = isDisabled === 'true';

        return response;
    }

    static setButtonDisabled(button, isDisabled) {
        if (button) button.setAttribute(Prefix.ATTR_IS_DISABLED, isDisabled);
    }
}
export class Log {

    static getAllowedColors() {
        const response = ['black', 'red', 'orange', 'purple', 'green', 'blue'];
        return response;
    }

    static getColor(color) {
        return this.getAllowedColors().includes(color) ? color : 'black';
    }

    static getConfig(props) {
        const {
            title = '',
            value,
            color = 'black',
            isTable = false
        } = props;

        return {
            title,
            value,
            color: this.getColor(color),
            isTable
        };
    }

    static logTable(value) {
        console.table(value);
    }

    static logValue({ title, value, color }) {
        if (title !== '') {
            console.log(`%c${title}`, `color: ${color}`, value);
            return;
        }

        console.log('%c', `color: ${color}`, value);
    }

    static set(props) {
        const config = this.getConfig(props);

        if (config.isTable === true) {
            this.logTable(config.value);
            return;
        }

        this.logValue(config);
    }
}

export class MapGame {
    static buildDoors(props) {
        const { tiles, map } = props;
        let doorsId = [];

        const doors = tiles.filter((tile) => tile.is_door);
        doors.forEach((door) => {
            doorsId.push(door.id);
        });

        const tilesAll = this.getAllTiles(map);
        let respose = [];
        tilesAll.forEach((index) => {
            const tileId = Number(index.dataset?.tileId);
            const isDoor = doorsId.includes(tileId);
            if (isDoor) respose.push(index.dataset.id);
        });
        return respose;
    }

    static drawTile(props) {
        const {
            id,
            idMap,
            idCity,
            tileId,
            positionX,
            positionY,
            isAltered = false,
            tiles
        } = props;
        const tile = Helper.findById(tiles, Number(tileId));
        const tileCss = tile?.css;
        // const dev = `<span style="opacity:.1">${positionX} / ${positionY}</span>`;
        const html = `
            <button 
                type="button"
                class="${Layout.cssTile} lo-${tileCss}"
                data-id="${id}"
                data-id-map="${idMap}"
                data-id-city="${idCity}"
                data-tile-id="${tileId}"
                data-position-x="${positionX}"
                data-position-y="${positionY}"
                data-is-altered="${isAltered}"
                tabindex="-1"
            ></button>
        `;

        return html;
    }

    static getAllTiles(target) {
        const response = target.querySelectorAll(`.${Layout.cssTile}`);
        return response;
    }

    static getTileByPosition(props) {
        const { map, x, y } = props;
        const response = map.querySelector(`[data-position-x='${x}'][data-position-y='${y}']`);
        return response;
    }
}
export class MenuToggle {
    static cssButton = 'ds-toggle-menu';
    static cssContent = 'ds-toggle-menu__content';
    static cssOpened = 'ds-toggle-menu__content--opened';

    static addEventListeners() {
        const data = [
            {
                el: document,
                handler: this.close
            }
        ];

        this.elsButton.forEach((index) => {
            data.push({
                el: index,
                handler: this.toggle
            });
        });

        data.forEach((index) => {
            index.context = this;
            Helper.addEventListener(index);
        });
    }

    static close(event) {
        const target = event?.target;
        if (!target) return;
        if (target.closest(`.${this.cssButton}`)) return;
        if (target.closest(`.${this.cssContent}`)) return;

        this.elsContent.forEach((index) => {
            Helper.removeClass(index, this.cssOpened);
        });
    }

    static init() {
        this.updateHTML();
        if (this.elsButton.length === 0) return;
        this.addEventListeners();
    }

    static toggle(event) {
        event.stopPropagation();
        const el = event.currentTarget;
        const elContent = el.closest(`.${this.cssContent}`);
        if (!elContent) return;
        Helper.toggleClass(elContent, this.cssOpened);
    }

    static updateHTML() {
        this.elsButton = document.querySelectorAll(`.${this.cssButton}`);
        this.elsContent = document.querySelectorAll(`.${this.cssContent}`);
    }
}

export class Modules {
    static nodeLore = 'lore';



    static async getAchievements() {
        await this.setData('achievements');
    }

    static async getItems() {
        await this.setData('items');
    }

    static async getLore(target) {
        this.initLore();

        const response = await DataCache.get(this.nodeLore, target, gbFiles.lore[target]);
        return response;
    }

    static async getMonsters() {
        await this.setData('monsters');
    }

    static async getNPCs() {
        await this.setData('npcs');
    }

    static async getTiles() {
        await this.setData('tiles');
    }

    static async getQuests() {
        await this.setData('quests');
    }

    static initLore() {
        DataCache.init(this.nodeLore, gbVersion.lore);
    }

    static async setData(target) {
        this.initLore();

        const response = await this.getLore(target);
        Modules[target] = response;
    }
}
export class Notification {
    static css = 'notification';
    static id = `game_${this.css}`;
    static colorDefault = 'grey';
    static colorError = 'red';
    static notificationId = 0;

    static add(props) {
        if (!props.content) return;

        this.placeItem(props);

        const el = document.querySelector(`#${this.id}${this.notificationId}`);
        this.addEventListeners(el);
        this.remove(el, props.content.length);

        this.notificationId++;
    }

    static addEventListeners(el) {
        const data = [];

        const button = el?.querySelector('button');
        if (!button) return;

        data.push({
            el: button,
            handler: () => {
                this.removeItem(el);
            },
            context: this
        });

        data.forEach((index) => {
            Helper.addEventListener(index);
        });
    }

    static buildHtml(props) {
        const id = props.id ? `id="${this.id}_${props.id}"` : '';
        const position = props.position ? props.position : 'left';
        const content = props.content ? props.content : '';

        return `<div ${id} class="${Layout.cssNamespace}${this.css} ${Layout.cssNamespace}${this.css}--${position}">${content}</div>`;
    }

    static buildHtmlDefault() {
        let html = '';
        const positions = ['center', 'left', 'right'];

        positions.forEach((item) => {
            html += this.buildHtml({ id: item, position: item });
        });

        Components.insert({ html });
    }

    static buildHtmlItem(props) {
        const color = typeof props.color !== 'undefined' ? props.color : this.colorDefault;
        const size = typeof props.size !== 'undefined' ? props.size : 'regular';
        const icon = !HTML ? 'X' : HTML.drawIcon({
            icon: 'close',
            size: 'small'
        });

        return `
            <div
                class="${Layout.cssNamespace}${this.css}__item ${Layout.cssNamespace}${this.css}--${size} ${Layout.cssNamespace}${this.css}--${color}"
                id="${this.id}${this.notificationId}"
            >
                <span class="${Layout.cssNamespace}${this.css}__text">${Helper.escapeHTML(props.content)}</span>
                <button
                    type="button"
                    class="${Layout.cssNamespace}button ${Layout.cssNamespace}button--extra-small ${Layout.cssNamespace}button--proportional ${Layout.cssNamespace}button--transparent"
                >
                    ${icon}
                </button>
            </div>
        `;
    }

    static init() {
        this.buildHtmlDefault();
    }

    static placeItem(props) {
        const isPlaceId = typeof props.place !== 'undefined';
        const position = typeof props.position !== 'undefined' ? props.position : 'right';
        let string = this.buildHtmlItem(props);
        let elPlace = '';

        if (isPlaceId) {
            const elList = document.querySelector(props.place).querySelector(`.${this.id}`);

            if (elList === null) {
                string = this.buildHtml({ content: string, position });
                elPlace = document.querySelector(props.place);
            } else {
                elList.style.position = 'relative';
                elPlace = elList;
            }
        } else {
            elPlace = document.getElementById(`${this.id}_${position}`);
        }

        if (elPlace) elPlace.insertAdjacentHTML('beforeend', string);
    }

    static remove(item, messageLength) {
        const time = messageLength * 150;

        setTimeout(() => {
            this.removeItem(item);
        }, time);
    }

    static removeItem(item) {
        if (!item || item.parentNode === null) return;
        item.parentNode.removeChild(item);
    }
}

export class Prefix {
    static ACCEPT = 'accept';
    static ACTION_RUN = 'actionRun';
    static APPLY_CUSTOMIZATION = 'apply_customization';
    static ATTRIBUTES = 'attributes';
    static ATTR_BUTTON = 'has-button';
    static ATTR_BUTTON_ICON = 'icon';
    static ATTR_BUTTON_THEME = 'button-theme';
    static ATTR_BUTTON_TOOLTIP = 'button-data-tooltip';
    static ATTR_BEHAVIOR = 'data-behavior';
    static ATTR_DATA_POSITION_X = 'data-position-x';
    static ATTR_DATA_POSITION_Y = 'data-position-y';
    static ATTR_EMOJI = 'emoji';
    static ATTR_INPUT_MAX = 'input-max';
    static ATTR_INPUT_MIN = 'input-min';
    static ATTR_INPUT_VALUE = 'input-value';
    static ATTR_IS_READ_ONLY = 'is-read-only';
    static ATTR_IS_DISABLED = 'is-disabled';
    static ATTR_LABEL = 'label';
    static PLACEHOLDER = 'placeholder';
    static ATTR_TYPE = 'type';
    static BUY = 'buy';
    static BUY_CUSTOMIZATION = 'buy_customization';
    static CRAFT = 'craft';
    static DEPOSIT = 'deposit';
    static FINISH = 'finish';
    static ITEMS = 'items';
    static LOSE = 'lose';
    static MONSTER = 'monster';
    static NEEDS = 'needs';
    static OPPONENT = 'opponent';
    static PLAYER = 'player';
    static REWARDS = 'rewards';
    static QUEST = 'quest';
    static SELL = 'sell';
    static SCARED = 'scared';
    static TOKEN_INVALID = 'Invalid token';
    static WIN = 'win';
    static WITHDRAW = 'withdraw';
}
export class Statics {
    static account = {
        guest: {
            email: 'guest@october31.com.br',
            password: 'AcC4654@!jjsdf'
        }
    };
    static recaptcha = '6LfggRMaAAAAAGtcCInz0HXWEKcnJYxaeQTKrPnT';
}
export class Storage {
    static get prefix() {
        const version = gbVersion.game || '';
        return `october_31_${version}_`;
    }

    static getValue(target) {
        return window.localStorage.getItem(this.prefix + target);
    }

    static removeValue(target) {
        window.localStorage.removeItem(this.prefix + target);
    }

    static setValue(props) {
        const { target, value } = props;
        const label = this.prefix + target;
        window.localStorage.setItem(label, value);
    }
}
export class Translation {
    static node = 'translation';
    static translation = {};



    static buildPlayerClass(target) {
        const response = this.gamePlayer[`class_${target}`];

        return response;
    }

    static buildPlayerClassDescription(target) {
        const response = this.gamePlayer[`class_${target}_description`];

        return response;
    }

    static buildTranslationButtonClose() {
        const hotkey = 'esc';
        const translation = this.interfaceDefault?.close;
        const response = this.buildTextAndHotkey(translation, hotkey);

        return response;
    }

    static buildTextAndHotkey(text, hotkey) {
        const translationHotkey = this.interfaceDefault?.shortcut;
        const response = `
            ${text}.
            <br/>
            ${translationHotkey} <span>${hotkey}</span>
        `;

        return response;
    }

    static init() {
        DataCache.init(this.node, gbVersion.translation);
    }

    static get dialogDefault() {
        const response = this.dialog?.default;

        return response;
    }

    static get default() {
        const response = this.translation?.default;

        return response;
    }

    static get dialog() {
        const response = this.translation?.dialog;

        return response;
    }

    static get game() {
        const response = this.translation?.game;

        return response;
    }

    static get gameAchievements() {
        const response = this.game?.achievements;

        return response;
    }

    static get gameBattle() {
        const response = this.game?.battle;

        return response;
    }

    static get gameBuffs() {
        const response = this.game?.buffs;

        return response;
    }

    static get gameCraft() {
        const response = this.game?.craft;

        return response;
    }

    static get gameCustomization() {
        const response = this.game?.customization;

        return response;
    }

    static get gameEquipment() {
        const response = this.game?.equipment;

        return response;
    }

    static get gameGeneric() {
        const response = this.game?.generic;

        return response;
    }

    static get gameLoot() {
        const response = this.game?.loot;

        return response;
    }

    static get gameMonster() {
        const response = this.game?.monster;

        return response;
    }

    static get gamePlayer() {
        const response = this.game?.player;

        return response;
    }

    static get gameQuest() {
        const response = this.game?.quest;

        return response;
    }

    static get gameTip() {
        const response = this.game?.tip;

        return response;
    }

    static get gameSkill() {
        const response = this.game?.skill;

        return response;
    }

    static get gameStory() {
        const response = this.game?.story;

        return response;
    }

    static get interface() {
        const response = this.translation?.interface;

        return response;
    }

    static get interfaceDefault() {
        const response = this.interface?.default;

        return response;
    }

    static get login() {
        const response = this.translation?.login;

        return response;
    }

    static get loginDefault() {
        const response = this.login?.default;

        return response;
    }

    static getTranslationPage(target) {
        if (target === 'attributes') target = 'attribute';
        if (target === 'quests') target = 'quest';
        if (target === 'achievements') target = 'achievement';
        if (target === 'settings') target = 'setting';

        const response = this.interface?.[`page_${target}`];

        return response;
    }

    static replaceTexts(response) {
        for (const key in response) {
            const index = response[key];

            if (typeof index === 'object') {
                Translation.replaceTexts(index);
            } else {
                response[key] = Helper.replaceRule(index);
            }
        }

        return response;
    }

    static async translate(target) {
        const language = gbLanguage;
        const version = gbVersion.translation;
        const url = `${gbUrlAssets}translation/${version}/${language}/${target}.json`;
        const response = await DataCache.get(this.node, target, url);

        this.translation[target] = response;

        return response;
    }
}
export class Validation {
    static cssInvalid = 'ds-form__input--invalid';

    static validateEmail(target) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const value = this.getElementValue(target);
        const response = regex.test(value);

        this.toggleInvalidClass(target, response);

        return response;
    }

    static validatePassword(target) {
        const value = this.getElementValue(target);
        const response = value !== '';

        this.toggleInvalidClass(target, response);

        return response;
    }

    static validateStrongPassword(target) {
        const value = this.getElementValue(target);
        const response = this.isStrongPassword(value);

        this.toggleInvalidClass(target, response);

        return response;
    }

    static validateUsername(target) {
        const value = this.getElementValue(target);
        const response = value !== '';

        this.toggleInvalidClass(target, response);

        return response;
    }




    static getElementValue(target) {
        const response = target?.value;

        return response;
    }

    static isStrongPassword(value) {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,}$/;
        const response = regex.test(value);

        return response;
    }

    static getInputElement(target) {
        const isFormField = target?.matches(Components.componentFormField);
        const response = isFormField ? target?.shadowRoot?.querySelector('input') : target;

        return response;
    }

    static toggleInvalidClass(target, isValid) {
        const element = this.getInputElement(target);

        if (!element) return;

        if (isValid) {
            Helper.removeClass(element, this.cssInvalid);
        } else {
            Helper.addClass(element, this.cssInvalid);
        }
    }
}
export class BugReport extends HTMLElement {
    args = {
        context: this,
        cssPrefix: 'bug-report',
    };
    static idDescription = 'bug_report_description';
    static idReproduce = 'bug_report_reproduce';
    static idExpected = 'bug_report_expected';
    static idObtained = 'bug_report_obtained';
    static maxAttachmentSize = 20000000;
    static maxAttachments = 3;
    attachmentsBase64 = [null, null, null];
    attachmentNames = ['', '', ''];





    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.render();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue === newValue) return;

        switch (name) {
            case Layout.attributeOpen:
                this.updateOpen(newValue);
                break;
            case 'page':
                this.updatePage(newValue);
                break;
            default:
                this.render();
                break;
        }
    }

    static get observedAttributes() {
        const response = [
            Layout.attributeOpen,
            'page',
        ];

        return response;
    }







    addEventListeners() {
        const componentButton = Components.componentButton;

        Layout.addEventListeners(this, componentButton);
        this.addAttachmentListeners();
        this.addFieldListeners();
    }

    addAttachmentListeners() {
        for (let i = 0; i < BugReport.maxAttachments; i++) {
            const input = this.shadowRoot.getElementById(this.getAttachmentId(i));

            if (input) {
                input.addEventListener('change', (event) => this.handleAttachmentChange(i, event));
            }
        }
    }

    addFieldListeners() {
        this.elDescription?.addEventListener('input', () => this.updateButtonState());
    }

    buildDescriptionUser() {
        const translation = this.translationPage;
        const description = this.elDescription?.value?.trim() || '';
        const reproduce = this.elReproduce?.value?.trim() || '';
        const expected = this.elExpected?.value?.trim() || '';
        const obtained = this.elObtained?.value?.trim() || '';

        const parts = [];

        if (description) {
            parts.push(`${translation?.description_label || 'Descrição'}:\n\n${description}`);
        }

        if (reproduce) {
            parts.push(`${translation?.reproduce_label || 'Como reproduzir'}:\n\n${reproduce}`);
        }

        if (expected) {
            parts.push(`${translation?.expected_label || 'Resultado esperado'}:\n\n${expected}`);
        }

        if (obtained) {
            parts.push(`${translation?.obtained_label || 'Resultado obtido'}:\n\n${obtained}`);
        }

        return parts.join('\n\n');
    }

    clearAttachmentError(index) {
        const errorEl = this.shadowRoot.getElementById(`bug_report_attachment_error_${index}`);

        if (errorEl) errorEl.textContent = '';
    }

    clearForm() {
        this.elDescription.value = '';
        this.elReproduce.value = '';
        this.elExpected.value = '';
        this.elObtained.value = '';

        for (let i = 0; i < BugReport.maxAttachments; i++) {
            const input = this.shadowRoot.getElementById(this.getAttachmentId(i));
            if (input) input.value = '';
            this.attachmentsBase64[i] = null;
            this.attachmentNames[i] = '';
            this.clearAttachmentError(i);
        }
    }

    clearBugReport() {
        this.clearForm();
    }

    draw() {
        const translation = this.translationPage;
        const content = this.drawContent(translation);

        return content;
    }

    drawContent(translation) {
        const descriptionField = this.drawTextField(
            translation?.describe,
            BugReport.idDescription,
            translation?.describe,
        );
        const reproduceField = this.drawTextField(
            translation?.reproduce,
            BugReport.idReproduce,
            translation?.reproduce,
        );
        const expectedField = this.drawTextField(
            translation?.result_expected,
            BugReport.idExpected,
            translation?.result_expected,
        );
        const obtainedField = this.drawTextField(
            translation?.result_obtained,
            BugReport.idObtained,
            translation?.result_obtained,
        );
        const attachments = this.drawAttachments(translation);
        const button = this.drawButton();
        const translationBugReport = Helper.escapeHTML(translation?.title);
        const translationDescription = Helper.escapeHTML(translation?.description);
        const response = `
            <form class="ds-page__bug-report ds-form">
                <div class="ds-row ds-center">
                    <h2 class="ds-title">${translationBugReport}</h2>
                </div>
                <div class="ds-row">
                    <p>${translationDescription}</p>
                </div>
                <div class="ds-row">
                    ${descriptionField}
                </div>
                    <div class="ds-row">
                    ${reproduceField}
                </div>
                    <div class="ds-row">
                    ${expectedField}
                </div>
                    <div class="ds-row">
                    ${obtainedField}
                </div>
                <div class="ds-row ds-bug-report__attachments">
                    ${attachments}
                </div>
                ${button}
            </form>
        `;

        return response;
    }

    drawTextField(label, id, placeholder) {
        const response = `
            <div class="ds-row ds-form__field">
                <label class="ds-form__label" for="${id}">${label}</label>
                <textarea
                    id="${id}"
                    class="ds-form__input"
                    rows="4"
                    placeholder="${placeholder}"
                ></textarea>
            </div>
        `;

        return response;
    }

    drawAttachments(translation) {
        let attachmentsHtml = '';

        for (let i = 0; i < BugReport.maxAttachments; i++) {
            const id = this.getAttachmentId(i);
            const label = translation?.attachment_label?.replace('{n}', i + 1) || `Anexo ${i + 1}`;
            const errorId = `bug_report_attachment_error_${i}`;

            attachmentsHtml += `
                <div class="ds-row ds-row ds-form__field ds-bug-report__attachment">
                    <label class="ds-form__label" for="${id}">${label}</label>
                    <input
                        id="${id}"
                        class="ds-form__input"
                        type="file"
                        accept="image/*,video/*"
                        data-index="${i}"
                    />
                    <div class="ds-form__input-validation" id="${errorId}"></div>
                </div>
            `;
        }

        return attachmentsHtml;
    }

    drawButton() {
        const componentButton = Components.componentButton;
        const translation = Translation.interfaceDefault?.send ?? 'Enviar';

        const theme = this.attributeButtonTheme || 'blue';
        const size = this.attributeButtonSize || (this.isSite ? 'regular' : 'small');
        const cssCustom = this.attributeButtonCss ? `css-custom="${this.attributeButtonCss}"` : '';
        const response = `
            <${componentButton}
                label="${translation}"
                theme="${theme}"
                size="${size}"
                ${cssCustom}
                data-handler="handleSend"
                data-handler-props='[]'
                data-kind="button"
                is-disabled="true"
            ></${componentButton}>
        `;

        return response;
    }

    get isSite() {
        const themeAttribute = this.attributeTheme;
        const response = themeAttribute === 'site';

        return response;
    }

    get elDescription() {
        const response = this.getElById(BugReport.idDescription);

        return response;
    }

    get elReproduce() {
        const response = this.getElById(BugReport.idReproduce);

        return response;
    }

    get elExpected() {
        const response = this.getElById(BugReport.idExpected);

        return response;
    }

    get elObtained() {
        const response = this.getElById(BugReport.idObtained);

        return response;
    }

    get elAttachmentInputs() {
        const response = this.shadowRoot.querySelectorAll('input[type="file"]');

        return response;
    }

    get elButton() {
        const response = this.shadowRoot.querySelector(Components.componentButton);

        return response;
    }

    get attributeTheme() {
        const response = this.getAttribute('theme');

        return response;
    }

    get attributeButtonTheme() {
        const response = this.getAttribute('button-theme');

        return response;
    }

    get attributeButtonSize() {
        const response = this.getAttribute('button-size');

        return response;
    }

    get attributeButtonCss() {
        const response = this.getAttribute('button-css');

        return response;
    }

    getElById(id) {
        const response = this.shadowRoot.getElementById(id);

        return response;
    }

    get isEnabled() {
        const description = this.elDescription?.value?.trim();
        const response = description !== '';

        return response;
    }

    get translationPage() {
        const response = Translation.getTranslationPage('bug_report');

        return response;
    }

    getAttachmentId(index) {
        const response = `bug_report_attachment_${index}`;

        return response;
    }

    getAttachmentsData() {
        const attachments = [];

        for (let i = 0; i < BugReport.maxAttachments; i++) {
            const base64 = this.attachmentsBase64[i];
            const name = this.attachmentNames[i];

            if (base64 && name) {
                attachments.push({
                    base64,
                    name,
                });
            }
        }

        return attachments;
    }

    handleAttachmentChange(index, event) {
        const file = event.target?.files?.[0];

        if (!file) {
            this.attachmentsBase64[index] = null;
            this.attachmentNames[index] = '';
            this.clearAttachmentError(index);

            return;
        }

        const maxSize = BugReport.maxAttachmentSize;

        if (file.size > maxSize) {
            this.showAttachmentError(index, this.translationPage?.attachment_error);
            const input = this.shadowRoot.getElementById(this.getAttachmentId(index));

            if (input) input.value = '';

            return;
        }

        const reader = new FileReader();

        reader.onload = (e) => {
            const dataURL = e.target.result;
            const base64 = dataURL.split(',')[1];
            this.attachmentsBase64[index] = base64;
            this.attachmentNames[index] = file.name;
            this.clearAttachmentError(index);
        };

        reader.readAsDataURL(file);
    }

    handleBugReportSubmit(event) {
        const { description, attachments } = event.detail;

        this.sendBugReport(description, attachments);
    }

    handleSend() {
        const description = this.buildDescriptionUser();
        const attachments = this.getAttachmentsData();

        this.sendBugReport(description, attachments);
    }

    notify(content, color = Notification.colorDefault) {
        const argsNotification = {
            content,
            color,
        };

        Notification.add(argsNotification);
    }

    notifyError() {
        const translation = this.translationPage?.error;

        this.notify(translation, Notification.colorError);
    }

    notifySuccess() {
        const content = this.translationPage?.success;
        const color = this.isSite ? 'green' : 'orange';

        this.notify(content, color);
    }

    render() {
        const component = this.draw();

        Components.render(this.args, component);

        this.addEventListeners();
        this.updateButtonState();
    }

    async sendBugReport(descriptionUser, attachments) {
        this.toggleButtonDisabled(false);

        const args = {
            controller: 'DesignSystem/BugReport',
            action: 'sendBugReport',
            description_user: descriptionUser,
            attachment_1: attachments?.[0]?.base64 ?? null,
            attachment_2: attachments?.[1]?.base64 ?? null,
            attachment_3: attachments?.[2]?.base64 ?? null,
            attachment_1_name: attachments?.[0]?.name ?? null,
            attachment_2_name: attachments?.[1]?.name ?? null,
            attachment_3_name: attachments?.[2]?.name ?? null,
        };
        const response = await DataLoader.fetchData(args);

        if (response?.isError) {
            this.notifyError();
        } else {
            this.notifySuccess();
            this.clearBugReport();
        }

        this.toggleButtonDisabled(true);
    }

    showAttachmentError(index, message) {
        const errorEl = this.shadowRoot.getElementById(`bug_report_attachment_error_${index}`);

        if (errorEl) errorEl.textContent = message;
    }

    toggleButtonDisabled(isEnabled) {
        const button = this.elButton;

        if (!button) return;

        if (isEnabled) {
            button.removeAttribute(Prefix.ATTR_IS_DISABLED);
        } else {
            button.setAttribute(Prefix.ATTR_IS_DISABLED, 'true');
        }
    }

    updateButtonState() {
        const isEnabled = this.isEnabled;

        this.toggleButtonDisabled(isEnabled);
    }

    updateOpen(value) {
        const isOpen = value === 'true';

        if (isOpen) {
            this.setAttribute(Layout.attributeOpen, 'true');
        } else {
            this.removeAttribute(Layout.attributeOpen);
        }
    }

    updatePage(page) {
        this.setAttribute('page', page || '');
    }
}
export class Button extends HTMLElement {
    args = {
        context: this,
        cssPrefix: 'button',
        detail: []
    };



    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.render();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue === newValue) return;

        const el = this.shadowRoot.querySelector('button');

        if (!el) return;

        this.updateAttributes(name, newValue, el);
    }

    static get observedAttributes() {
        const response = [
            Prefix.ATTR_IS_DISABLED,
            Layout.attributeActive,
            'css-custom',
            'data-tooltip',
            'label',
            'icon',
            'icon-theme',
            'is-full'
        ];

        return response;
    }


    buildClick() {
        if (!this.isClick) return;

        const el = this.shadowRoot.querySelector('button');

        el.addEventListener('click', () => this.handleClick());
    }

    draw() {
        const label = Helper.escapeHTML(this.getAttribute('label') || '');
        const type = this.getAttribute('type') || 'button';
        const attributeDisabled = this.getAttribute(Prefix.ATTR_IS_DISABLED) || 'false';
        const isDisabled = attributeDisabled === 'true' ? 'disabled' : '';
        const attributeActive = this.getAttribute(Layout.attributeActive) || 'false';
        const isActive = attributeActive === 'true';

        this.args.cssActive = isActive ? true : false;

        const css = Layout.buildCss(this.args);
        const icon = this.drawIcon();
        const theme = this.getAttribute('theme') || 'transparent';
        const button = `
            <button
                ${css}
                type="${type}"
                ${isDisabled}
            >
                <span class="label">${label}</span>
                <span class="icon">${icon}</span>
            </button>
        `;
        const response = this.isOver
            ? `<div class="ds-form ds-form--${theme}">${button}</div>`
            : button;

        return response;
    }

    static drawButtonClose(props) {
        const {
            position,
            click,
            id,
            size = 'small',
            sizeIcon = 'small',
            tooltip = props.tooltip ? props.tooltip : Translation.buildTranslationButtonClose(),
            dataId,
            isRounded = false
        } = props;
        const attributeIsRounded = isRounded ? 'is-rounded="true"' : '';
        const response = `
            <c-ds-button
                id="${Helper.escapeHTML(id)}"
                icon="close"
                icon-size="${size}"
                theme="outline--white"
                size="${sizeIcon}"
                data-tooltip="${Helper.escapeHTML(tooltip)}"
                data-id="${Helper.escapeHTML(dataId)}"
                is-proportional="true"
                ${attributeIsRounded}
                click="${click}"
                page-position="${position}"
                css-wrapper="gm-style"
            >
            </c-ds-button>
        `;

        return response;
    }

    drawIcon() {
        const isIcon = this.getAttribute('icon') || false;

        if (!isIcon) return '';

        const icon = this.getAttribute('icon');
        const size = this.getAttribute('icon-size') || 'regular';
        let theme = this.getAttribute('icon-theme') || 'white';
        const attributeActive = this.getAttribute(Layout.attributeActive) || 'false';
        const isActive = attributeActive === 'true';

        if (isActive) theme = 'black';

        const props = {
            theme,
            size,
            icon
        };
        const response = HTML.drawIcon(props);

        return response;
    }

    get attributeClick() {
        const response = this.getAttribute('click');

        return response;
    }

    get isClick() {
        const response = this.attributeClick || false;

        return response;
    }

    get isFull() {
        return this.getAttribute('is-full') === 'true';
    }

    get isOver() {
        const response = this.classList.contains('ds-button--over');

        return response;
    }

    handleClick() {
        const args = this.args;

        args.event = this.attributeClick;
        args.detail.pageTarget = this.getAttribute('page-target');
        args.detail.event = this.attributeClick;
        args.detail.context = this;
        args.detail.pagePosition = this.getAttribute('page-position');

        Components.dispatch(args);
    }

    render() {
        const component = this.draw();

        Components.render(this.args, component);

        this.updateFull();
        this.buildClick();

        Tooltip?.elTooltipWrapper?.build(this.args);
    }

    updateAttributes(name, value, el) {
        const handlers = {
            [Prefix.ATTR_IS_DISABLED]: () => this.updateDisabled(value, el),
            [Layout.attributeActive]: () => this.updateActive(value, el),
            'label': () => this.updateLabel(value, el),
            'icon': () => this.updateIcon(el),
            'icon-theme': () => this.updateIcon(el),
            'css-custom': () => this.updateCss(el),
            'data-tooltip': () => this.updateTooltip(),
            'is-full': () => this.updateFull()
        };

        const handler = handlers[name];

        if (handler) handler();
    }

    updateFull() {
        this.style.width = this.isFull ? '100%' : '';
    }

    updateActive(value, el) {
        const isActive = value === 'true';

        this.args.cssActive = isActive;
        this.updateCss(el);
        this.updateIcon(el);
    }

    updateCss(el) {
        const attributeActive = this.getAttribute(Layout.attributeActive) || 'false';
        const isActive = attributeActive === 'true';

        this.args.cssActive = isActive;

        const css = Layout.buildCss(this.args);
        const cssString = css.replace('class="', '').replace('"', '');

        el.className = cssString;
    }

    updateDisabled(value, el) {
        const isDisabled = value === 'true';

        el.disabled = isDisabled;
    }

    updateIcon(el) {
        const iconContainer = el.querySelector('.icon');

        if (!iconContainer) return;

        const icon = this.drawIcon();

        iconContainer.innerHTML = icon;
    }

    updateLabel(value, el) {
        const labelContainer = el.querySelector('.label');

        if (!labelContainer) return;

        labelContainer.textContent = value;
    }

    updateTooltip() {
        Tooltip?.elTooltipWrapper?.build(this.args);
    }
}
export class Confirmation extends HTMLElement {
    args = {
        context: this,
        cssPrefix: 'hud-confirmation'
    };
    idButtonCancel = 'button_cancel';
    idButtonConfirm = 'button_confirm';

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.render();
    }

    static get observedAttributes() {
        return ['open', 'text', 'modal_title', 'size'];
    }

    attributeChangedCallback() {
        this.render();
    }

    isOpen() {
        return this.getAttribute('open') === 'true';
    }

    draw() {
        if (!this.isOpen()) return '';

        const text = Helper.escapeHTML(this.getAttribute('text') ?? '');
        const title = Helper.escapeHTML(this.getAttribute('modal_title') ?? '');
        const size = Helper.escapeHTML(this.getAttribute('size') ?? 'extra-small');
        const translatioCancel = Translation.interfaceDefault.cancel;
        const translatioConfirm = Translation.interfaceDefault.confirm;

        return `
            <div class="ds-modal">
                <div class="ds-modal__box ds-modal--${size} ds-content-theme">
                    <header class="ds-page__header">
                        <div class="ds-ribbon">
                            <div class="ds-ribbon__content">
                                <div class="ds-center">
                                    <div class="ds-content__title">
                                        <h2 class="ds-title">${title}</h2>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </header>
                    <div class="ds-row ds-page__text">
                        <p>${text}</p>
                    </div>
                    <div class="ds-page__footer">
                        <div class="ds-row ds-page__menu">
                            <div class="ds-button-wrapper ds-row ds-right">
                                <c-ds-button
                                    id="${this.idButtonCancel}"
                                    theme="grey"
                                    size="small"
                                    label="${translatioCancel}"
                                ></c-ds-button>
                                <c-ds-button
                                    id="${this.idButtonConfirm}"
                                    theme="blue"
                                    size="small"
                                    label="${translatioConfirm}"
                                ></c-ds-button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    bindEvents() {
        const btnCancel = this.shadowRoot.getElementById(this.idButtonCancel);
        if (btnCancel) btnCancel.onclick = () => this.emitAndClose(false);

        const btnConfirm = this.shadowRoot.getElementById(this.idButtonConfirm);
        if (btnConfirm) btnConfirm.onclick = () => this.emitAndClose(true);
    }

    emitAndClose(value) {
        this.dispatchEvent(
            new CustomEvent('confirmation-result', {
                detail: { confirmed: value },
                bubbles: true,
                composed: true
            })
        );

        this.remove();
    }

    render() {
        Components.render(this.args, this.draw());
        this.bindEvents();
    }
}
export class FormField extends HTMLElement {
    args = {
        context: this,
        cssPrefix: 'form-field'
    };
    iconEyeOpen = 'eye_open';
    iconEyeClose = 'eye_close';





    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.render();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue === newValue) return;
        this.updateAttribute(name, newValue);
    }

    static get observedAttributes() {
        return [
            Prefix.ATTR_INPUT_VALUE,
            Prefix.ATTR_INPUT_MAX,
            Prefix.ATTR_INPUT_MIN,
            Prefix.ATTR_IS_READ_ONLY,
            Prefix.ATTR_TYPE,
            'theme'
        ];
    }





    addEventListeners() {
        if (!this.input) return;

        this.input.addEventListener('input', () => this.filterNumber());
        this.input.addEventListener('blur', () => this.clampNumber());
        this.input.addEventListener('change', () => this.clampNumber());

        const button = this.shadowRoot.querySelector('.ds-button--over');
        const isPassword = this.isPassword && button;

        if (isPassword) {
            button.addEventListener('click', () => this.togglePassword());
        }
    }

    buildValue() {
        return this.inputValue;
    }

    clampNumber() {
        if (!this.isNumber) return;

        let value = Number(this.input.value);
        if (Number.isNaN(value)) return;

        if (this.inputMin !== '' && value < Number(this.inputMin)) {
            value = Number(this.inputMin);
        }

        if (this.inputMax !== '' && value > Number(this.inputMax)) {
            value = Number(this.inputMax);
        }

        this.input.value = value;
        this.setAttribute(Prefix.ATTR_INPUT_VALUE, value);
    }

    draw() {
        const id = Helper.buildId(this.label);
        const readOnly = this.isReadOnly ? 'readonly' : '';
        const placeholder = this.placeholder ? `placeholder="${this.placeholder}"` : '';
        const button = this.isPassword ? this.drawPasswordButton() : '';
        const label = Helper.escapeHTML(this.label);
        const value = Helper.escapeHTML(this.buildValue());
        const hint = this.hint ? `
            <div class="ds-row">
                <small class="ds-form__hint">
                    ${Helper.escapeHTML(this.hint)}
                </small>
            </div>
        ` : '';
        const theme = this.theme;
        const response = `
            <div class="ds-form ds-form--${theme}">
                <label class="ds-form__label ds-truncate" for="id_${id}">${label}</label>
                <div class="ds-row">
                    <input
                        class="ds-form__input ds-${readOnly}"
                        id="id_${id}"
                        type="${this.type}"
                        value="${value}"
                        max="${this.inputMax}"
                        min="${this.inputMin}"
                        ${readOnly}
                        ${placeholder}
                    >
                    ${button}
                </div>
                ${hint}
            </div>
        `;

        return response;
    }

    drawPasswordButton() {
        const theme = this.theme;
        const iconTheme = this.iconTheme;
        const response = `
            <${this.componentButton}
                theme="${theme}"
                size="extra-small"
                is-proportional="true"
                class="ds-button--over"
                icon="${this.iconEyeClose}"
                icon-theme="${iconTheme}"
                icon-size="big"
                css-custom="ds-button--eye"
            ></${this.componentButton}>
        `;

        return response;
    }

    filterNumber() {
        if (!this.isNumber) return;

        const value = this.input.value;
        if (value === '' || value === '-' || value === '.') return;

        if (Number.isNaN(Number(value))) {
            this.input.value = this.inputValue;
        }
    }

    focus() {
        this.input?.focus();
    }

    get componentButton() {
        const response = Components.componentButton;

        return response;
    }

    get theme() {
        const response = this.getAttribute('theme') || 'transparent';

        return response;
    }

    get iconTheme() {
        const response = this.getAttribute('icon-theme') || 'black';

        return response;
    }

    get hint() {
        const response = this.getAttribute('hint') || '';

        return response;
    }

    get isNumber() {
        const response = this.type === 'number';

        return response;
    }

    get input() {
        const response = this.shadowRoot.querySelector('input');

        return response;
    }

    get inputValue() {
        const response = this.getAttribute(Prefix.ATTR_INPUT_VALUE) || '';

        return response;
    }

    get label() {
        const response = this.getAttribute(Prefix.ATTR_LABEL) || '';

        return response;
    }

    get type() {
        const response = this.getAttribute(Prefix.ATTR_TYPE) || 'text';

        return response;
    }

    get value() {
        const response = this.input?.value ?? '';

        return response;
    }

    static getInputValueByTarget(target) {
        const elInput = target.shadowRoot.querySelector('input');
        const response = elInput ? elInput.value : '';

        return response;
    }

    get inputMax() {
        const response = this.getAttribute(Prefix.ATTR_INPUT_MAX) || '';

        return response;
    }

    get inputMin() {
        const response = this.getAttribute(Prefix.ATTR_INPUT_MIN) || '';

        return response;
    }

    get isReadOnly() {
        const response = this.getAttribute(Prefix.ATTR_IS_READ_ONLY) === 'true';

        return response;
    }
    get isPassword() {
        const response = this.type === 'password';

        return response;
    }

    get placeholder() {
        const response = this.getAttribute(Prefix.PLACEHOLDER);

        return response;
    }

    render() {
        Components.render(this.args, this.draw());

        this.addEventListeners();
    }

    set value(newValue) {
        if (!this.input) return;

        this.input.value = newValue ?? '';
    }

    static setValue(target, value) {
        const elInput = target.shadowRoot.querySelector('input');

        if (!elInput) return;

        elInput.value = value ?? '';
    }

    togglePassword() {
        const button = this.shadowRoot.querySelector(this.componentButton);

        const isHidden = this.input.type === 'password';

        this.input.type = isHidden ? 'text' : 'password';

        button.setAttribute(
            'icon',
            isHidden ? this.iconEyeOpen : this.iconEyeClose
        );
    }

    updateAttribute(name, value) {
        if (!this.input) return;

        switch (name) {
            case Prefix.ATTR_INPUT_VALUE:
                this.input.value = value ?? '';
                break;

            case Prefix.ATTR_INPUT_MAX:
                this.input.max = value || '';
                break;

            case Prefix.ATTR_INPUT_MIN:
                this.input.min = value || '';
                break;

            case Prefix.ATTR_IS_READ_ONLY:
                if (value === 'true') this.input.setAttribute('readonly', '');
                else this.input.removeAttribute('readonly');
                break;

            case Prefix.ATTR_TYPE:
                this.input.type = value || 'text';
                break;
        }
    }
}

export class Modal extends HTMLElement {
    args = {
        context: this,
        cssPrefix: 'hud-modal'
    };
    isOpen = false;
    isCloseButton = true;



    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.render();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue === newValue) return;
        this.render();
    }

    static get observedAttributes() {
        const response = [Layout.attributeOpen, 'is-close-button'];

        return response;
    }



    draw() {
        const isOpen = this.getAttribute(Layout.attributeOpen);

        if (isOpen === 'true') this.isOpen = true;
        if (isOpen === 'false' || !isOpen) this.isOpen = false;
        if (!this.isOpen) return '';

        const buttonClose = this.drawCloseButton();
        const page = this.getAttribute('page');
        const title = this.getAttribute('page-title');
        const size = Helper.escapeHTML(this.getAttribute('size'));
        const description = this.drawDescription();
        const ribbon = HTML.drawRibbon(title);
        const pageComponent = this.drawPage(page);
        let response = `
            <div class="ds-modal">
                <div class="ds-modal__box ds-modal--${size} ds-content-theme">
                    <header class="ds-page__header">
                        ${buttonClose}
                        ${ribbon}
                    </header>
                    ${description}
                    ${pageComponent}
                </div>
            </div>
        `;

        return response;
    }

    static drawContent(content) {
        let response = '';

        response += `
            <div class="ds-modal__content ds-scrollbar">
                <div class="ds-row">
                    <div class="ds-page__content ds-scrollbar">
                        ${content}
                    </div>
                </div>
            </div>
        `;

        return response;
    }

    static drawFooter(content) {
        let response = '';

        response += `
            <div class="ds-page__footer">
                <div class="ds-row ds-page__menu">
                    <div class="ds-button-wrapper ds-row ds-right">
                        ${content}
                    </div>
                </div>
            </div>
        `;

        return response;
    }

    drawCloseButton() {
        const isCloseButton = this.getAttribute('is-close-button');

        if (isCloseButton === 'true') this.isCloseButton = true;
        if (isCloseButton === 'false' || !isCloseButton) this.isCloseButton = false;
        if (!this.isCloseButton) return '';

        const buttonClose = Button.drawButtonClose({
            position: null,
            click: 'close-modal',
        });
        let response = `
            <div class="ds-content__close">
                ${buttonClose}
            </div>
        `;

        return response;
    }

    drawDescription() {
        const description = this.getAttribute('page-description');

        if (!description) return '';

        const response = `
            <div class="ds-row ds-page__text">
                <p>${Helper.escapeHTML(description)}</p>
            </div>
        `;

        return response;
    }

    drawPage(page) {
        const response = `
            <c-${Helper.escapeHTML(page)}
                class="ds-display-flex"
                page="${Helper.escapeHTML(page)}"
            >
            </c-${Helper.escapeHTML(page)}>
        `;

        return response;
    }

    render() {
        const component = this.draw();

        Components.render(this.args, component);
    }
}
export class Page extends HTMLElement {
    args = {
        context: this,
        cssPrefix: 'hud-page'
    };
    isOpen = false;
    isMenu = false;
    lastPage;
    static dataIdPage = 'page';
    static currentFilter;
    cssPaddingReset = 'ds-padding-reset';
    drawPageComponentLastComponent;



    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.resetLastPage();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue === newValue) return;

        switch (name) {
            case 'position':
                this.updatePosition(newValue);
                break;
            case 'page':
                this.updatePage(newValue);
                break;
            default:
                this.render();
                break;
        }
    }

    static get observedAttributes() {
        const response = ['position', Layout.attributeOpen, 'page'];

        return response;
    }



    draw() {
        const getTranslationPage = (target) => Translation.getTranslationPage(target);
        const position = this.getAttribute('position') || '';
        const isOpen = this.getAttribute(Layout.attributeOpen);

        if (isOpen === 'true') this.isOpen = true;
        if (isOpen === 'false' || !isOpen) this.isOpen = false;
        if (!this.isOpen) return '';

        const buttonClose = Button.drawButtonClose({
            position,
            click: 'close-hud-page',
        });
        const page = this.getAttribute('page');
        const title = getTranslationPage(page)?.title;
        const ribbon = HTML.drawRibbon(Helper.escapeHTML(title));
        const description = getTranslationPage(page)?.description || '';
        const loading = HTML.drawLoading({ theme: 'grey', size: 'big' });
        const response = `
            <div
                class="ds-content-theme gm-hud__content-page ds-content--${Helper.escapeHTML(position)}"
                data-position="${Helper.escapeHTML(position)}"
            >
                <section class="ds-page">
                    <div class="ds-page__header">
                        ${ribbon}"
                        <div class="ds-content__close">
                            ${buttonClose}
                        </div>
                    </div>
                    <div class="ds-row ds-page__text">
                        <p>${Helper.escapeHTML(description)}</p>
                    </div>
                     <div class="ds-row">
                        <div class="ds-button-wrapper ds-row ds-center ds-tab ds-tab--purple">
                        </div>
                    </div>
                    <div class="ds-page__loading ds-display-contents">
                       ${loading}
                    </div>
                </section>
            </div>
        `;

        return response;
    }

    static drawContent(css, content) {
        const value = (css instanceof HTMLElement) ? css.getAttribute('page') || '' : css;
        const response = `
            <div class="ds-page__content ds-scrollbar ds-page__${value}">
                ${content}
            </div>
        `;

        return response;
    }

    static drawFooter(content, isMenu = true) {
        let response = '<div class="ds-page__footer">';

        if (isMenu) response += '<div class="ds-row ds-right ds-button-wrapper">';

        response += content;

        if (isMenu) response += '</div>';

        response += '</div>';

        return response;
    }

    drawMenu(props) {
        const { buttons } = props;
        let response = '';

        buttons.forEach((button) => {
            response += `
                <c-ds-button
                    data-id="${Helper.escapeHTML(button?.id)}"
                    theme="${Helper.escapeHTML(button?.theme || 'black')}"
                    size="${Helper.escapeHTML(button?.size || 'small')}"
                    data-tooltip="${Helper.escapeHTML(button?.tooltip || '')}"
                    label="${Helper.escapeHTML(button?.label || '')}"
                    css-custom="ds-tab__button"
                    css-wrapper="ds-tab"
                    data-handler="${Helper.escapeHTML(button?.handler)}"
                    data-handler-props='${Helper.escapeHTML(button?.handlerProps)}'
                    data-kind='button'
                    ${Layout?.attributeActive}=""
                >
                </c-ds-button>
            `;
        });

        return response;
    }

    drawPage(page) {
        if (!page) return;

        const response = `
            <c-${Helper.escapeHTML(page)}
                data-id="${Page.dataIdPage}"
                class="ds-display-contents"
                page="${Helper.escapeHTML(page)}"
            >
            </c-${Helper.escapeHTML(page)}>
        `;

        return response;
    }

    drawPageComponent(target = undefined) {
        const page = target || this.getAttribute('page');

        if (this.drawPageComponentLastComponent === page) return;

        this.drawPageComponentLastComponent = page;

        const elPage = this.drawPage(page);

        const container = this.elContentContainer;
        if (container) container.innerHTML = elPage;

        const currentFilter = Page.currentFilter;
        if (currentFilter) this.handleFilter(Page.currentFilter);
    }

    get elContent() {
        const response = this.elContentContainer?.querySelector('.ds-display-contents');

        return response;
    }

    get elContentContainer() {
        const response = this.shadowRoot.querySelector('.ds-page__loading');

        return response;
    }

    get elMenu() {
        const response = this.shadowRoot.querySelector('.ds-button-wrapper');

        return response;
    }

    get elMenuButtons() {
        const response = this.elMenu?.querySelectorAll('c-ds-button');

        return response;
    }

    getActiveButton(target) {
        const response = this.elMenu?.querySelector(`[data-id="${target}"]`);

        return response;
    }

    getBackPage(target) {
        const backFilter = this.lastPage.backFilter;
        const response = backFilter ?? target;

        return response;
    }

    handleClickPage(target) {
        const elButton = this.getActiveButton(target);

        Layout.setActiveButton(elButton);

        elButton?.click();
    }

    handleFilter(target) {
        this.elContent?.handleFilter?.(target);

        const elButton = this.getActiveButton(target);
        Layout.setActiveButton(elButton);

        Page.currentFilter = target;
    }

    handleOpenPage(target) {
        this.drawPageComponent(target);
        this.handleClickPage(target);
        this.resetLastPage();
    }

    render() {
        const component = this.draw();
        Components.render(this.args, component);

        this.drawPageComponentLastComponent = undefined;

        queueMicrotask(() => {
            this.drawPageComponent();
        });
    }

    resetLayout() {
        if (this.elMenu) this.elMenu.innerHTML = '';
        if (this.elContentContainer) this.elContentContainer.innerHTML = '';
    }

    resetLastPage() {
        this.lastPage = {};
    }

    setMenu(props) {
        const el = this.drawMenu(props);
        const elMenu = this.elMenu;

        if (!elMenu) return;

        Helper.addClass(elMenu.parentNode, 'ds-page__menu');

        elMenu.innerHTML = el;

        Layout.addEventListeners(this, 'c-ds-button');

        const elButton = this.elMenuButtons[0];
        if (elButton) elButton.setAttribute('is-active', true);
    }

    setTitle(value) {
        const el = this.shadowRoot.querySelector('.ds-title');
        if (el) el.innerText = value;
    }

    setText(value) {
        const el = this.shadowRoot.querySelector('.ds-page__text');

        if (value === '') {
            Helper.addClass(el, this.cssPaddingReset);
        } else {
            Helper.removeClass(el, this.cssPaddingReset);
        }

        const elParagraph = el.querySelector('p');
        if (elParagraph) elParagraph.innerHTML = value;
    }

    updatePage(page) {
        this.resetLayout();
        this.drawPageComponent(page);

        const elTitle = this.shadowRoot.querySelector('.ds-title');
        if (elTitle) {
            elTitle.innerText = Translation.getTranslationPage(page)?.title || '';
        }

        const elText = this.shadowRoot.querySelector('.ds-page__text p');
        if (elText) {
            elText.innerHTML = Helper.escapeHTML(Translation.getTranslationPage(page)?.description || '');
        }
    }

    updatePosition(position) {
        const el = this.shadowRoot.querySelector('.ds-content-theme');

        if (!el) return;

        el.dataset.position = position;
        el.className = `ds-content-theme ds-hud__content-page ds-content--${position}`;
    }
}
export class PasswordReset extends HTMLElement {
    args = {
        context: this,
        cssPrefix: 'password-reset'
    };
    static idCurrent = 'current';
    static idNew = 'new';
    static eventSubmit = 'passwordResetSubmit';



    constructor() {
        super();

        this.attachShadow({ mode: 'open' });

        this.render();
    }



    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue === newValue) return;

        this.render();
    }

    static get observedAttributes() {
        const response = [
            'mode',
            'button-theme',
            'button-size',
            'button-is-rounded',
            'button-is-full',
            'button-label'
        ];

        return response;
    }



    addEventListeners() {
        const button = this.elButton;

        if (button) {
            button.addEventListener('click', () => this.handleSubmit());
        }

        const fields = [this.elCurrent, this.elNew].filter(Boolean);

        fields.forEach((field) => {
            field.addEventListener('input', () => this.updateButtonState());
        });
    }

    draw() {
        const translation = this.translation;
        const current = this.isToken ? '' : this.drawField(PasswordReset.idCurrent, translation.password_old, 'password');
        const fieldNew = this.drawField(
            PasswordReset.idNew,
            translation.password_new,
            'password',
            'passwordStrongInvalid',
            translation.password_hint
        );
        const button = this.drawButton();
        const response = `
            ${current}
            ${fieldNew}
            <div class="ds-row ds-right">
                ${button}
            </div>
        `;

        return response;
    }

    drawButton() {
        const theme = this.buttonTheme;
        const size = this.buttonSize;
        const isRounded = this.buttonIsRounded;
        const isFull = this.buttonIsFull;
        const label = this.buttonLabel;
        const attributeTheme = theme ? `theme="${theme}"` : '';
        const attributeSize = size ? `size="${size}"` : '';
        const attributeIsRounded = isRounded ? 'is-rounded="true"' : '';
        const attributeIsFull = isFull ? 'is-full="true"' : '';
        const response = `
            <${Components.componentButton}
                ${attributeTheme}
                ${attributeSize}
                ${attributeIsRounded}
                ${attributeIsFull}
                label="${Helper.escapeHTML(label)}"
            ></${Components.componentButton}>
        `;

        return response;
    }

    get buttonTheme() {
        return this.getAttribute('button-theme') || Layout.theme.menuDefault;
    }

    get buttonSize() {
        return this.getAttribute('button-size') || Layout.theme.menuSize;
    }

    get buttonIsRounded() {
        return this.getAttribute('button-is-rounded') === 'true';
    }

    get buttonIsFull() {
        return this.getAttribute('button-is-full') === 'true';
    }

    get buttonLabel() {
        return this.getAttribute('button-label') || this.translation?.send;
    }

    drawField(id, label, type, rule, hint) {
        const args = {
            id,
            css: 'ds-row',
            label,
            value: '',
            isReadOnly: false,
            iconTheme: Layout.theme.menuDefaultIcon,
            type,
            rule,
            hint
        };
        const field = Layout.drawField(args);
        const response = `
            <div class="ds-row">
                ${field}
            </div>
        `;

        return response;
    }

    get elButton() {
        const response = this.shadowRoot.querySelector(Components.componentButton);

        return response;
    }

    get elCurrent() {
        const response = this.getElById(PasswordReset.idCurrent);

        return response;
    }

    get elNew() {
        const response = this.getElById(PasswordReset.idNew);

        return response;
    }

    get isEnabled() {
        const isNewValid = Validation.validateStrongPassword(this.elNew);
        let response = isNewValid;

        if (!this.isToken) {
            const isCurrentValid = Validation.validatePassword(this.elCurrent);

            response = response && isCurrentValid;
        }

        return response;
    }

    get isToken() {
        return this.mode === 'token';
    }

    get mode() {
        const response = this.getAttribute('mode') || 'session';

        return response;
    }

    get translation() {
        const response = Translation.loginDefault;

        return response;
    }

    getElById(id) {
        const response = this.shadowRoot.getElementById(id);

        return response;
    }

    handleSubmit() {
        if (!this.isEnabled) return;

        const detail = {
            password: this.elNew.value
        };

        if (this.isToken) {
            detail.userId = Helper.getUrlParameter('id');
            detail.email = Helper.getUrlParameter('e');
            detail.token = Helper.getUrlParameter('t');
        } else {
            detail.currentPassword = this.elCurrent.value;
        }

        this.dispatchEvent(new CustomEvent(PasswordReset.eventSubmit, {
            detail,
            bubbles: true,
            composed: true
        }));
    }

    render() {
        Components.render(this.args, this.draw());

        this.addEventListeners();
        this.updateButtonState();
    }

    updateButtonState() {
        const button = this.elButton;

        if (!button) return;

        if (this.isEnabled) {
            button.removeAttribute(Prefix.ATTR_IS_DISABLED);
        } else {
            button.setAttribute(Prefix.ATTR_IS_DISABLED, 'true');
        }
    }
}

export class Progress extends HTMLElement {
    args = {
        context: this,
        cssPrefix: 'hud-progress'
    };



    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.render();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue === newValue) return;
        if (name === 'data-tooltip') {
            this.buildTooltip();
            return;
        }
        if (name === 'value' || name === 'value-max') {
            this.updateValue();
            return;
        }
        this.render();
    }

    static get observedAttributes() {
        return ['value', 'value-max', 'theme', 'data-tooltip'];
    }



    buildTooltip() {
        Tooltip?.elTooltipWrapper?.build(this.args);
    }

    calculateValue() {
        const value = this.getAttribute('value');
        const valueMax = this.getAttribute('value-max');

        return Helper.calculatePercentage(value, valueMax);
    }

    draw() {
        const theme = Helper.escapeHTML(this.getAttribute('theme'));
        const direction = Helper.escapeHTML(this.getAttribute('direction'));
        const isVertical = direction === 'vertical';
        const border = this.drawBorder();
        const value = this.calculateValue();
        const style = isVertical ? 'height' : 'width';
        const cssCustom = Helper.escapeHTML(this.getAttribute('css-custom'));
        let html = '';

        html += `
            <div class="ds-progress ds-progress--${direction} ${border} ds-progress--${theme} ${cssCustom}">
                <div class="ds-progress__bar" style="${style}: ${value}%"></div>
            </div>
        `;
        return html;
    }

    drawBorder() {
        const border = Helper.escapeHTML(this.getAttribute('border'));
        let response = '';

        if (border) response = `ds-progress--border-${border}`;
        return response;
    }

    render() {
        const component = this.draw();

        Components.render(this.args, component);
        this.buildTooltip();
    }

    updateValue() {
        const bar = this.shadowRoot.querySelector('.ds-progress__bar');
        const direction = this.getAttribute('direction');
        const isVertical = direction === 'vertical';
        const style = isVertical ? 'height' : 'width';
        const value = this.calculateValue();

        if (bar) bar.style[style] = `${value}%`;
    }
}
export class Select extends HTMLElement {
    args = {
        context: this,
        cssPrefix: 'form-select'
    };



    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this._value = '';
        this.render();
        this.addEventListeners();
    }



    addEventListeners() {
        Helper.addEventListener({
            el: document,
            handler: this.close,
            context: this
        });
        Helper.addEventListener({
            el: this.elTrigger,
            handler: this.toggleContent,
            context: this
        });
        this.elOptions.forEach((option) => {
            Helper.addEventListener({
                el: option,
                handler: this.handleOptionClick,
                context: this
            });
        });
    }

    buildCssButton(theme) {
        const response = Layout.buildTheme(theme, 'ds-button');

        return response;
    }

    buildCssContent(theme) {
        const response = Layout.buildTheme(theme, 'ds-drop-down__content');

        return response;
    }

    buildCssLabel(theme) {
        const cssForm = Layout.buildTheme(theme, 'ds-form');
        const response = `ds-form ${cssForm}`;

        return response;
    }

    close(event) {
        const path = event?.composedPath?.() ?? [];
        if (path.includes(this)) return;

        Helper.removeClass(this.elContent, MenuDropDown.cssOpend);
    }

    dispatchChange() {
        const customEvent = new CustomEvent('change', {
            bubbles: true,
            composed: true,
            detail: { value: this._value }
        });

        this.dispatchEvent(customEvent);
    }

    draw() {
        const translation = Translation?.interface.default.select;
        const label = Helper.escapeHTML(this.getAttribute('label') || '');
        const theme = this.theme;
        const cssButton = this.buildCssButton(theme);
        const cssContent = this.buildCssContent(theme);
        const cssLabel = this.buildCssLabel(theme);
        const id = Helper.buildId(label);
        const options = this.drawOptions(cssButton);
        const html = `
            <div class="${cssLabel}">
                <label
                    class="ds-form__label"
                    for="id_${id}"
                >
                    ${label}
                </label>
            </div>
            <div class="${MenuDropDown.cssWrapper}">
                <button
                    type="button"
                    class="ds-button ds-button--small ${cssButton}"
                    id="id_${id}"
                >
                    ${Helper.escapeHTML(translation)}
                </button>
                <div class="${MenuDropDown.cssContent} ${cssContent}">
                    ${options}
                </div>
            </div>
        `;

        return html;
    }

    drawOptions(cssButton) {
        const options = this.getAttribute('options');
        const json = JSON.parse(options);
        const length = json?.label?.length || 0;
        let html = '';

        for (let i = 0; i < length; i++) {
            const label = Helper.escapeHTML(json.label[i]);
            const value = Helper.escapeHTML(json.value[i]);

            html += `
                <button
                    type="button"
                    class="ds-button ds-button--small ${cssButton}"
                    data-value="${value}"
                >${label}</button>
            `;
        }

        return html;
    }

    get elContent() {
        const response = this.shadowRoot.querySelector(`.${MenuDropDown.cssContent}`);

        return response;
    }

    get elOptions() {
        const wrapper = `.${MenuDropDown.cssWrapper}`;
        const response = [...this.shadowRoot.querySelectorAll(`${wrapper} [data-value]`)];

        return response;
    }

    get elTrigger() {
        const wrapper = `.${MenuDropDown.cssWrapper}`;
        const response = this.shadowRoot.querySelector(`${wrapper} > button`);

        return response;
    }

    getOptionByValue(value) {
        const response = this.elOptions.find((option) => option.dataset.value === value);

        return response;
    }

    handleOptionClick(event) {
        event.stopPropagation();
        this.selectOption(event.currentTarget);
    }

    render() {
        const component = this.draw();

        Components.render(this.args, component);
    }

    resetValue() {
        this._value = '';
        this.elTrigger.textContent = Helper.escapeHTML(Translation?.interface.default.select);
        Helper.removeClass(this.elContent, MenuDropDown.cssOpend);
        this.dispatchChange();
    }

    selectOption(option) {
        this._value = option.dataset.value;
        this.elTrigger.textContent = option.textContent;
        Helper.removeClass(this.elContent, MenuDropDown.cssOpend);
        this.dispatchChange();
    }

    setValue(value) {
        const string = String(value);

        if (!string) {
            this.resetValue();
            return;
        }

        const option = this.getOptionByValue(string);

        if (option) this.selectOption(option);
    }

    get theme() {
        const response = this.getAttribute('theme') || Layout.theme.selectDefault || 'purple';

        return response;
    }

    toggleContent(event) {
        event.stopPropagation();
        Helper.toggleClass(this.elContent, MenuDropDown.cssOpend);
    }

    get value() {
        const response = this._value;

        return response;
    }
}
export class Suggestion extends HTMLElement {
    args = {
        context: this,
        cssPrefix: 'suggestion',
    };
    static idSuggestion = 'suggestion_text';



    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.render();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue === newValue) return;

        switch (name) {
            case Layout.attributeOpen:
                this.updateOpen(newValue);
                break;
            case 'page':
                this.updatePage(newValue);
                break;
            default:
                this.render();
                break;
        }
    }

    static get observedAttributes() {
        const response = [
            Layout.attributeOpen,
            'page',
        ];

        return response;
    }





    addEventListeners() {
        const componentButton = Components.componentButton;

        Layout.addEventListeners(this, componentButton);
        this.addFieldListeners();
    }

    addFieldListeners() {
        this.elSuggestion?.addEventListener('input', () => this.updateButtonState());
    }

    draw() {
        const translation = this.translationPage;
        const content = this.drawContent(translation);

        return content;
    }

    drawContent(translation) {
        const suggestionField = this.drawTextField(
            translation?.title,
            Suggestion.idSuggestion,
            translation?.describe,
        );
        const button = this.drawButton();
        const translationSuggestion = Helper.escapeHTML(translation?.title);
        const translationDescription = Helper.escapeHTML(translation?.description);
        const response = `
            <form class="ds-page__suggestion ds-form">
                <div class="ds-row ds-center">
                    <h2 class="ds-title">${translationSuggestion}</h2>
                </div>
                <div class="ds-row">
                    <p>${translationDescription}</p>
                </div>
                <div class="ds-row">
                    ${suggestionField}
                </div>
                ${button}
            </form>
        `;

        return response;
    }

    drawTextField(label, id, placeholder) {
        const response = `
            <div class="ds-row ds-form__field">
                <label class="ds-form__label" for="${id}">${label}</label>
                <textarea
                    id="${id}"
                    class="ds-form__input"
                    rows="6"
                    placeholder="${placeholder}"
                ></textarea>
            </div>
        `;

        return response;
    }

    drawButton() {
        const componentButton = Components.componentButton;
        const translation = Translation.interfaceDefault?.send ?? 'Enviar';

        const theme = this.attributeButtonTheme || 'blue';
        const size = this.attributeButtonSize || (this.isSite ? 'regular' : 'small');
        const cssCustom = this.attributeButtonCss ? `css-custom="${this.attributeButtonCss}"` : '';
        const response = `
            <${componentButton}
                label="${translation}"
                theme="${theme}"
                size="${size}"
                ${cssCustom}
                data-handler="handleSend"
                data-handler-props='[]'
                data-kind="button"
                is-disabled="true"
            ></${componentButton}>
        `;

        return response;
    }

    get isSite() {
        const themeAttribute = this.attributeTheme;
        const response = themeAttribute === 'site';

        return response;
    }

    get elSuggestion() {
        const response = this.getElById(Suggestion.idSuggestion);

        return response;
    }

    get elButton() {
        const response = this.shadowRoot.querySelector(Components.componentButton);

        return response;
    }

    get attributeTheme() {
        const response = this.getAttribute('theme');

        return response;
    }

    get attributeButtonTheme() {
        const response = this.getAttribute('button-theme');

        return response;
    }

    get attributeButtonSize() {
        const response = this.getAttribute('button-size');

        return response;
    }

    get attributeButtonCss() {
        const response = this.getAttribute('button-css');

        return response;
    }

    getElById(id) {
        const response = this.shadowRoot.getElementById(id);

        return response;
    }

    get isEnabled() {
        const suggestion = this.elSuggestion?.value?.trim();
        const response = suggestion !== '';

        return response;
    }

    get translationPage() {
        const response = Translation.getTranslationPage('suggestion');

        return response;
    }

    handleSend() {
        const suggestion = this.elSuggestion?.value?.trim() || '';

        this.sendSuggestion(suggestion);
    }

    notify(content, color = Notification.colorDefault) {
        const argsNotification = {
            content,
            color,
        };

        Notification.add(argsNotification);
    }

    notifyError() {
        const translation = this.translationPage?.error;

        this.notify(translation, Notification.colorError);
    }

    notifySuccess() {
        const content = this.translationPage?.success;
        const color = this.isSite ? 'green' : 'orange';

        this.notify(content, color);
    }

    render() {
        const component = this.draw();

        Components.render(this.args, component);

        this.addEventListeners();
        this.updateButtonState();
    }

    async sendSuggestion(suggestion) {
        this.toggleButtonDisabled(false);

        const args = {
            controller: 'DesignSystem/Suggestion',
            action: 'sendSuggestion',
            suggestion,
        };
        const response = await DataLoader.fetchData(args);

        if (response?.isError) {
            this.notifyError();
        } else {
            this.notifySuccess();
            this.clearSuggestion();
        }

        this.toggleButtonDisabled(true);
    }

    clearSuggestion() {
        if (this.elSuggestion) {
            this.elSuggestion.value = '';
        }
    }

    toggleButtonDisabled(isEnabled) {
        const button = this.elButton;

        if (!button) return;

        if (isEnabled) {
            button.removeAttribute(Prefix.ATTR_IS_DISABLED);
        } else {
            button.setAttribute(Prefix.ATTR_IS_DISABLED, 'true');
        }
    }

    updateButtonState() {
        const isEnabled = this.isEnabled;

        this.toggleButtonDisabled(isEnabled);
    }

    updateOpen(value) {
        const isOpen = value === 'true';

        if (isOpen) {
            this.setAttribute(Layout.attributeOpen, 'true');
        } else {
            this.removeAttribute(Layout.attributeOpen);
        }
    }

    updatePage(page) {
        this.setAttribute('page', page || '');
    }
}

export class Tooltip extends HTMLElement {
    static id = 'ds_tooltip';
    static idWrapper = `${this.id}_wrapper`;
    static idTooltipArrow = `${this.id}_arrow`;
    args = {
        context: this,
        cssPrefix: 'tooltip'
    };



    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.render();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue === newValue) return;
        this.render();
    }

    static get observedAttributes() {
        return ['value', 'position-left', 'position-top'];
    }



    build(props) {
        const context = props.context;
        const tooltip = context.getAttribute('data-tooltip');
        if (!tooltip) return;
        const args = { tooltip, context };
        const boundMouseOver = this.handleMouseOver.bind(this, args);
        const boundMouseOut = this.handleMouseOut.bind(this);

        context.addEventListener('mouseover', boundMouseOver);
        context.addEventListener('mouseout', boundMouseOut);
    }

    static clear() {
        Tooltip?.elTooltipWrapper?.setAttribute('value', '');
    }

    draw() {
        const value = this.getAttribute('value');
        const left = this.getAttribute('position-left');
        const top = this.getAttribute('position-top');
        const opacity = value ? 1 : 0;
        const style = `top:${top}px; left:${left}px; opacity:${opacity};`;
        const html = `
            <div class="ds-animation--up-down-2 ds-tooltip" style="${style}" id="${Tooltip.idTooltip}">
                <p>${value}</p>
                <div
                    class="ds-tooltip__arrow"
                    id="${Tooltip.idTooltipArrow}"
                >
                </div>
            </div>
        `;
        const isUnedfinedText = this.isUnedfinedText(value);
        const response = isUnedfinedText ? '' : html;
        return response;
    }

    static get elTooltip() {
        const response = Tooltip.getElementById(this.id);
        return response;
    }

    static get elTooltipWrapper() {
        const response = document.getElementById(this.idWrapper);
        return response;
    }

    handleMouseOver(props) {
        const isDisabled = this.isDisabled(props);
        if (isDisabled) return;

        const elTtooltipWrapper = Tooltip.elTooltipWrapper;
        const tooltipText = props.tooltip;

        elTtooltipWrapper.setAttribute('value', tooltipText);
        this.setPosition(props);
    }

    handleMouseOut() {
        Tooltip.clear();
    }

    static init() {
        const html = `
            <${Components.prefixComponentDash}tooltip
                id="${Tooltip.idWrapper}"
                class="ds-tooltip__wrapper"
            >
            </${Components.prefixComponentDash}tooltip>
        `;
        const args = { html };
        Components.insert(args);
    }

    isDisabled(props) {
        const el = props.context;
        return el.getAttribute(Prefix.ATTR_IS_DISABLED) === 'true';
    }

    isUnedfinedText(text) {
        const response = text == 'undefined';
        return response;
    }

    render() {
        const component = this.draw();
        Components.render(this.args, component);
    }

    setPosition(props) {
        const tooltip = props.tooltip;
        const isUnedfinedText = this.isUnedfinedText(tooltip);
        if (isUnedfinedText) return;

        const elTooltipWrapper = Tooltip.elTooltipWrapper;
        const tooltipElement = elTooltipWrapper.shadowRoot.getElementById(Tooltip.idTooltip);
        const tooltipRect = tooltipElement.getBoundingClientRect();
        const elTooltipArrow = elTooltipWrapper.shadowRoot.getElementById(Tooltip.idTooltipArrow);
        const elementRect = props.context.getBoundingClientRect();
        const margin = 10;
        const arrowSize = 8;

        let top = elementRect.top - tooltipRect.height - margin;
        if (top < 0) top = elementRect.bottom + margin;

        let left = elementRect.left + (elementRect.width - tooltipRect.width) / 2;
        if (left + tooltipRect.width > window.innerWidth) {
            left = window.innerWidth - tooltipRect.width - margin;
        } else if (left < 0) {
            left = margin;
        }

        tooltipElement.style.top = Layout.buildPixel(top);
        tooltipElement.style.left = Layout.buildPixel(left);

        const arrowLeftPosition = (elementRect.left + elementRect.width / 2) - left - arrowSize;
        elTooltipArrow.style.left = Layout.buildPixel(arrowLeftPosition);
    }
}