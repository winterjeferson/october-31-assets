class Code {
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
        const color = code.color;
        const codeTranslation = code.translation;
        const translation = Translation.translation.default.code[codeTranslation];
        const response = { translation, color };

        return response;
    }
}
class Components {
    static styleCache = {};

    static dispatch(props) {
        const { event, context, detail } = props;

        context.dispatchEvent(new CustomEvent(event, {
            detail,
            bubbles: true,
            composed: true
        }));
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
        const {
            fileCss
        } = props;
        const shadowRoot = props.context.shadowRoot;
        const stylesDs = Components.loadStyles(shadowRoot, gbFileDesignSystem);
        const stylesGame = Components.loadStyles(shadowRoot, gbFileGame);
        const stylesGameDs = Components.loadStyles(shadowRoot, gbFileGameDs);
        const stylesCustom = fileCss ? Components.loadStyles(shadowRoot, fileCss) : '';
        let response = `
            <style>
                ${stylesDs}
                ${stylesGame}
                ${stylesGameDs}
                ${stylesCustom}
            </style>
            ${component}
        `;
        response = response.replace(new RegExp('__replace_folder_assets__', 'g'), gbFolderGameAssetsImg);
        shadowRoot.innerHTML = response;
    }
}
class Helper {
    static addClass(target, classCss) {
        if (!target || !classCss) return;

        if (Array.isArray(classCss)) {
            target.classList.add(...classCss);
        } else {
            target.classList.add(classCss);
        }
    }

    //@deprecated
    static ajax(props) {
        return new Promise((resolve, reject) => {
            const url = window?.urls?.game || '';
            const controller = props.controller ? url + props.controller : `${url}php/controller.php`;
            const namespace = props.namespace || 'Game';
            const token = props?.token || gameLayout?.token;
            const kind = props.kind || 'POST';
            let xhr = new XMLHttpRequest();

            xhr.open(kind, controller, true);
            xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            xhr.onload = () => {
                if (xhr.status >= 200 && xhr.status < 300) {
                    this.ajaxLoaded(xhr.responseText);
                    resolve(xhr.responseText);
                }
                reject(xhr.statusText);
            };
            xhr.onerror = () => reject(xhr.statusText);
            xhr.send(`&n=${namespace}&t=${token + props.parameter}`);
        });
    }

    //@deprecated
    static ajaxLoaded(data) {
        const isParse = this.validateParse(data);
        const isSessionExpired = data === 'session_expired';
        const isMaintenance = data === 'maintenance';
        const isProblem = isSessionExpired || isMaintenance;

        if (isParse) {
            const json = JSON.parse(data);
            const isGame = this.origin === 'game';

            if (isGame) return gamePageAchievement.verifyNotification(json);
        }
        if (isProblem) gameLayout.decodeMessage(data);
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
        const response = String(JSON.stringify(target));

        return response;
    }

    static capitalizeString(target) {
        if (target) return this.convertToUpperCase(target.charAt(0)) + target.slice(1);
    }

    static convertToLowerCase(target) {
        return target.toLowerCase();
    }

    static convertToUpperCase(target) {
        return target.toUpperCase();
    }

    static isStringEmpty(target) {
        const isEmpty = target === '';
        const isUndefined = typeof target === 'undefined';
        const isNull = target === null;
        const response = isEmpty || isUndefined || isNull;
        return response;
    }

    static async fetchData(props) {
        const {
            controller,
            method = 'POST',
            ...params
        } = props;

        const shouldUseJson = Object.values(params).some(
            val => typeof val === 'object' && val !== null
        );
        const headers = {
            'Content-Type': shouldUseJson
                ? 'application/json'
                : 'application/x-www-form-urlencoded'
        };
        const body = shouldUseJson
            ? JSON.stringify({ controller, ...params })
            : new URLSearchParams({ controller, ...params });

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
                    const response = Helper.fetchDataResponse(data);
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
            errorMessage
        } = props;
        if (isError) return alert(errorMessage);
        if (isMaintenance) return alert('isMaintenance');
        return data;
    }

    static findById(itens, target) {
        return itens.find(index => index.id === target);
    }

    static getAttributeAsNumber(target, attribute) {
        return Number(target.getAttribute(attribute));
    }

    static getPositionX(target) {
        return this.getAttributeAsNumber(target, Layout.attributePositionX);
    }

    static getPositionY(target) {
        return this.getAttributeAsNumber(target, Layout.attributePositionY);
    }

    static getCaptchaResponse() {
        return grecaptcha.getResponse();
    }

    static getRandomBetween(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
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
        const code = props?.code || false;
        const size = props?.size || this.modalSizeDefault;
        const title = props?.title || false;
        const getCode = code ? Code.getCode(code) : false;
        const color = getCode ? getCode.color : 'grey';
        const content = getCode ? getCode.translation : '';
        const args = {};
        if (size) args.size = size;
        if (color) args.color = color;
        if (title) args.title = title;
        if (content) args.content = content;
        if (isError) alert(content);
        if (isNotification) alert(content);
        // if (isError) libModal.open(args);
        // if (isNotification) libModal.open(args);
        return isError;
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

    static isObjectContent(data) {
        const length = Object.entries(data).length;
        return length > 0;
    }

    static isString(target) {
        const response = typeof target === 'string';
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
        return str.replace(/\s+/g, '');
    }

    static renderCaptcha(id = '') {
        const el = document.getElementById(Layout.idCaptcha + id);
        const recaptcha = Variable.recaptcha;

        if (!el) return;
        el.setAttribute('class', 'g-recaptcha');
        el.setAttribute('data-sitekey', recaptcha);
        el.setAttribute('data-action', 'LOGIN');
        if (grecaptcha.render) grecaptcha.render(el, {
            'sitekey': recaptcha,
            'action': 'LOGIN',
        });
    }

    static replaceRule(text) {
        const props = {
            text,
            isRule: true
        };

        return this.replaceInText(props);
    }

    static replaceInText(props) {
        let {
            text,
            isRule = false
        } = props;

        if (!text || typeof text !== 'string') {
            throw new Error('text must be a string');
        }

        const regex = /\{\{(.*?)\}\}/g;
        text = text.replace(regex, (_, rulePath) => {
            let replaceBy = rulePath.split('.').reduce((obj, key) => {
                return obj && obj[key] !== undefined ? obj[key] : undefined;
            }, Rule);

            // if (replaceBy === undefined) {
            //     console.warn(`Rule for key "${rulePath}" not found.`);
            // }

            return isRule ? `<span>${replaceBy}</span>` : replaceBy;
        });
        return text;
    }

    static resetCaptcha() {
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
        const isValid = regex.test(target.value);

        Helper.validateFormField(target, isValid);
        return isValid;
    }

    //@deprecated
    static validateParse(data) {
        try {
            JSON.parse(data);
        } catch (e) {
            return false;
        }
        return true;
    }

    static validateFormEmptyValue(target, value) {
        const isValid = value !== '';

        Helper.validateFormField(target, isValid);
        return isValid;
    }

    static validateFormFieldEmpty(target) {
        const isValid = target.value !== '';

        Helper.validateFormField(target, isValid);
        return isValid;
    }

    static validateFormField(target, isValid) {
        const css = 'ds-form__input--invalid';

        if (isValid) {
            Helper.removeClass(target, css);
        } else {
            Helper.addClass(target, css);
        }
    }
}
class Layout {
    static attributeActive = 'is-active';
    static attributeDisabled = 'is-disabled';
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
    static game = {
        height: 0,
        width: 0
    };
    static screen = {
        height: 0,
        width: 0
    };
    static durabilityColors = ['green', 'orange', 'red'];

    //accepted: data-handler-props='["param1", 123, true, "$this"]'
    static addEventListeners(context, target) {
        const itens = context.shadowRoot.querySelectorAll(target);

        itens.forEach((item) => {
            const isDisabled = item.getAttribute(this.attributeDisabled) === 'true';
            if (isDisabled) return;

            const handler = item.getAttribute('data-handler');
            const params = item.getAttribute('data-handler-props');

            if (handler && typeof context[handler] === 'function') {
                let parsedParams = [];

                if (params) {
                    try {
                        parsedParams = JSON.parse(params).map(param => param === "$this" ? context : param);
                    } catch (e) {
                        if (params === "$this") {
                            parsedParams = [context];
                        } else {
                            console.error('Invalid JSON in data-handler-props:', params);
                        }
                    }
                }

                item.addEventListener('click', () => context[handler](...parsedParams));
            }
        });
    }

    static buildAttribute(props) {
        const label = props.label;
        const value = props.value;

        if (!value) return '';
        return `${label}="${value}"`;
    }

    static buildCss(props) {
        const context = props?.context;
        const prefix = `${this.cssNamespace}${props?.cssPrefix}`;
        const attributeTheme = context ? context.getAttribute('theme') : props?.theme;
        const attributeIsProportional = context ? context.getAttribute('is-proportional') : props?.isProportional;
        const attributeIsRounded = context ? context.getAttribute('is-rounded') : props?.isRounded;
        const attributeSize = context ? context.getAttribute('size') : props?.size;
        let attributeCssCustom = context ? context.getAttribute('css-custom') : props?.cssCustom;

        const cssActive = props.cssActive;
        if (cssActive) attributeCssCustom += ` ${prefix}--active`;

        const cssCustom = attributeCssCustom ? `${attributeCssCustom}` : '';
        const rounded = attributeIsRounded ? `${prefix}--rounded` : '';
        const proportional = attributeIsProportional ? `${prefix}--proportional` : '';
        const theme = attributeTheme ? `${prefix}--${attributeTheme}` : '';
        const size = attributeSize ? `${prefix}--${attributeSize}` : '';
        const value = `${prefix} ${theme} ${size} ${proportional} ${rounded} ${cssCustom}`;
        const args = {
            label: 'class',
            value,
        };
        return this.buildAttribute(args);
    }

    static buildProgressColor(props) {
        const { value, valueMax, isReverse = false } = props;
        const math = this.buildProgressSize();
        const colors = this.durabilityColors;
        const size = this.calculatePercentage(value, valueMax);

        if (size <= math) return isReverse ? colors[2] : colors[0];
        if (size <= math * 2) return colors[1];
        return isReverse ? colors[0] : colors[2];
    }

    static buildProgressSize() {
        const length = this.durabilityColors.length;
        const math = 100 / length;

        return math;
    }

    static buildPixel(target) {
        return `${target}px`;
    }

    static drawCaptcha(id = '') {
        return `<div id="${Layout.idCaptcha + id}"></div>`;
    }

    static init() {
        this.resize();
    }

    static setActiveButton(target, isActive = true) {
        const elMenu = target.parentNode.querySelectorAll('[data-kind="button"]');

        elMenu.forEach((index) => {
            index.setAttribute(this.attributeActive, 'false');
        });
        if (isActive) target.setAttribute(this.attributeActive, 'true');
    }
}
class Notification {
    static css = 'notification';
    static id = `game_${this.css}`;
    static colorDefault = 'grey';
    static notificationId = 0;

    static add(props) {
        if (!props.content) return;

        this.placeItem(props);

        const el = document.querySelector(`#${this.id + this.notificationId}`);
        this.remove(el, props.content.length);
        this.notificationId++;
    }

    static buildHtml(props) {
        const id = props.id ? `id="${this.id}_${props.id}"` : '';
        const position = props.position ? props.position : 'left';
        const content = props.content ? props.content : '';

        return `<div ${id} class="${Layout.cssNamespace}${this.css} ${Layout.cssNamespace}${this.css}--${position}">${content}</div>`;
    }

    static buildHtmlDefault() {
        const positions = ['center', 'left', 'right'];
        const elBody = document.querySelector('body');
        let html = '';

        positions.forEach((item) => {
            html += this.buildHtml({ id: item, position: item });

        });
        elBody.insertAdjacentHTML('beforeend', html);
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
                <span class="${Layout.cssNamespace}${this.css}__text">${props.content}</span>
                <button type="button" 
                    class="${Layout.cssNamespace}button ${Layout.cssNamespace}button--extra-small ${Layout.cssNamespace}button--proportional ${Layout.cssNamespace}button--transparent" 
                    onclick="Notification.remove(this.parentNode, 0)" 
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
            let elList = document.querySelector(props.place).querySelector(`.${this.id}`);

            if (elList === null) {
                let newString = this.buildHtml({ content: string, position });

                string = newString;
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
        if (item.parentNode === null) return;
        item.parentNode.removeChild(item);
    }
}
class Storage {
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
class Translation {
    static node = 'translation';
    static translation = {};

    static get dialog() {
        return this.translation?.dialog;
    }

    static get dialogDefault() {
        return this.dialog?.default;
    }

    static get game() {
        return this.translation?.game;
    }

    static get gameAchievements() {
        return this.game?.achievements;
    }

    static get gameBattle() {
        return this.game?.battle;
    }

    static get gameEquipment() {
        return this.game?.equipment;
    }

    static get gameGeneric() {
        return this.game?.generic;
    }

    static get gameLoot() {
        return this.game?.loot;
    }

    static get gameMonster() {
        return this.game?.monster;
    }

    static get gamePlayer() {
        return this.game?.player;
    }

    static get gameQuests() {
        return this.game?.quest;
    }

    static get gameTip() {
        return this.game?.tip;
    }

    static get interface() {
        return this.translation?.interface;
    }

    static get interfaceDefault() {
        return this.interface?.default;
    }

    static get login() {
        return this.translation?.login;
    }

    static buildTranslationButtonClose() {
        const hotkey = Hotkeys.getKey('esc');
        const translation = this.interfaceDefault?.close;
        const tooltip = this.buildTextAndHotkey(translation, hotkey);

        return tooltip;
    }

    static buildTextAndHotkey(text, hotkey) {
        const translationHotkey = this.interfaceDefault?.shortcut;
        const html = `
            ${text}. 
            <br/> 
            ${translationHotkey} <span>${hotkey}</span>
        `;

        return html;
    }

    static buildPlayerClass(target) {
        return this.gamePlayer[`class_${target}`];
    }

    static buildPlayerClassDescription(target) {
        return this.gamePlayer[`class_${target}_description`];
    }

    static init() {
        const getLocalStorage = this.getLocalStorage(this.node);
        const version = gbVersion.translation;
        const language = gbLanguage;
        const isDifferenteData = language !== getLocalStorage?.language || version !== getLocalStorage?.version;
        const obj = { version, language };

        if (getLocalStorage) {
            if (isDifferenteData) {
                this.setLocalStorage(this.node, obj);
            }
        } else {
            this.setLocalStorage(this.node, obj);
        }
    }

    static getTranslationPage(target) {
        if (target === 'attributes') target = 'attribute';
        if (target === 'quests') target = 'quest';
        if (target === 'achievements') target = 'achievement';
        if (target === 'settings') target = 'setting';

        const response = this.interface?.[`page_${target}`];
        return response;
    }

    static getLocalStorage(target) {
        const data = Storage.getValue(target);
        const json = JSON.parse(data);
        return json;
    }

    static replaceTexts(target) {
        for (const key in target) {
            const index = target[key];
            if (typeof index === 'object') {
                Translation.replaceTexts(index);
            } else {
                target[key] = Helper.replaceRule(index);
            }
        }
        return target;
    }

    static getTranslation() {
        return Storage.getValue(this.node);
    }

    static setLocalStorage(target, value) {
        const replaced = this.replaceTexts(value);
        const json = JSON.stringify(replaced);
        const args = {
            target,
            value: json
        };
        Storage.setValue(args);
    }

    static async translate(target) {
        const translation = this.getLocalStorage(this.node);
        const isLocalStorage = typeof translation[target] !== 'undefined';
        const response = isLocalStorage ? translation[target] : await this.requestFile(target);

        this.translation[target] = response;
        return response;
    }

    static async requestFile(target) {
        const language = gbLanguage;
        const version = gbVersion.translation;
        const url = `${gbUrlAssets}translation/${version}/${language}/${target}.json`;

        return new Promise(async (resolve, reject) => {
            try {
                const data = this.getLocalStorage(this.node);
                const response = await fetch(url);
                const responseJson = await response.json();

                data[target] = responseJson;
                this.setLocalStorage(this.node, data);
                resolve(responseJson);
            } catch (error) {
                reject(error);
            }
        });
    }
}
class Variable {
    static account = {
        guest: {
            email: 'guest@october31.com.br',
            password: 'AcC4654@!jjsdf'
        }
    };
    static recaptcha = '6LfggRMaAAAAAGtcCInz0HXWEKcnJYxaeQTKrPnT';
}