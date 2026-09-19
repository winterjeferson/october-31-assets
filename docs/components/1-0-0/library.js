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
        const shadowRoot = props.context.shadowRoot;
        const styles = this.loadStyles(shadowRoot, fileDesignSystem);
        const stylesGame = this.loadStyles(shadowRoot, fileGame);
        const response = `<style>${styles}${stylesGame}</style>${component}`;

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

    static buildId(target) {
        const removeEmptySpaces = Helper.removeEmptySpaces(target);
        const convertToLowerCase = Helper.convertToLowerCase(removeEmptySpaces);

        return convertToLowerCase;
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

    static toggleClass(target, classCss) {
        if (!target || !classCss) return;

        if (Array.isArray(classCss)) {
            classCss.forEach((className) => target.classList.toggle(className));
        } else {
            target.classList.toggle(classCss);
        }
    }
}
class Layout {
    static attributeActive = 'is-active';
    static attributeDisabled = 'is-disabled';
    static attributePositionX = 'data-position-x';
    static attributePositionY = 'data-position-y';
    static attributePositionXInitial = `${this.attributePositionX}-initial`;
    static attributePositionYInitial = `${this.attributePositionY}-initial`;

    static cssNamespace = 'ds-';
    static cssDisplay = `${this.cssNamespace}display-none`;
    static cssButtonActive = `${this.cssNamespace}button--active`;
    static cssAnimationFadeIn = `${this.cssNamespace}animation--fade-in`;
    static cssAnimationFadeOut = `${this.cssNamespace}animation--fade-out`;
    static cssAnimationFromLeft = `${this.cssNamespace}animation--from-left`;
    static cssAnimationFromRight = `${this.cssNamespace}animation--from-right`;
    static cssFormField = `${this.cssNamespace}column ${this.cssNamespace}form__field`;

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

    //accepted: data-handler-props='["param1", 123, true, "$this"]'
    static addEventListeners(context, target) {
        const itens = context.shadowRoot.querySelectorAll(target);

        itens.forEach((item) => {
            const handler = item.getAttribute('data-handler');
            const params = item.getAttribute('data-handler-props');

            if (handler && typeof context[handler] === 'function') {
                let parsedParams = [];
                if (params) {
                    parsedParams = JSON.parse(params).map(param => param === "$this" ? context : param);
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

    static buildTextCapacity(text, value, valueMax) {
        return `${text}: <span>${value}</span> / <span>${valueMax}</span>`;
    }

    static buildPixel(target) {
        return `${target}px`;
    }

    static drawButtonClose(props) {
        const { position, click, id } = props;
        const tooltip = Translation.buildTranslationButtonClose();
        const html = `
            <c-button 
                id="${id}"
                icon="close" 
                icon-size="small"
                theme="red" 
                size="regular" 
                data-tooltip="${tooltip}"
                is-proportional="true"
                is-rounded="true"
                click="${click}"
                page-position="${position}"
            >
            </c-button>
        `;
        return html;
    }

    static drawIcon(props) {
        const { icon } = props;
        props.cssPrefix = 'icon';
        const css = Layout.buildCss(props);
        const html = `
            <svg ${css}>
                <use xlink:href="${fileIcon}#${icon}"></use>
            </svg>
        `;
        return html;
    }

    static drawLoading(props) {
        const { theme, size } = props;
        const html = `
            <div class="ds-loading ds-center">
                <div class="ds-loading ds-loading-2 ds-loading-2--${size} ds-loading-2--${theme} ds-animate"></div>
                <div class="ds-loading ds-loading-2 ds-loading-2--${size} ds-loading-2--${theme} ds-animate"></div>
                <div class="ds-loading ds-loading-2 ds-loading-2--${size} ds-loading-2--${theme} ds-animate"></div>
            </div>
        `;
        return html;
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

    static drawTile(props) {
        const { id, positionX, positionY } = props;
        const theme = Tiles.decode(id);
        const click = `{el: HTML.elGamePlayer, positionXTo: ${positionX}, positionYTo: ${positionY}}`;
        const html = `
        <button 
            type="button"
            class="ds-tile"
            data-position-x="${positionX}"
            data-position-y="${positionY}"
            style="background-color: ${theme}"
            onclick="Walk.walk(${click});"
        >
        ${positionX} / ${positionY}  
        </button>
    `;
        return html;
    }

    static init() {
        this.resize();
    }

    static resize() {
        this.game.width = HTML.elGame?.offsetWidth;
        this.game.height = HTML.elGame?.offsetHeight;
        this.screen.width = window.innerWidth;
        this.screen.height = window.innerHeight;
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
        const icon = Layout.drawIcon({
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
        const version = globalVersion.game || '';
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

    static get gameBattle() {
        return this.game?.battle;
    }

    static get gameEquipment() {
        return this.game?.equipment;
    }

    static get gameGeneric() {
        return this.game?.generic;
    }

    static get gamePlayer() {
        return this.game?.player;
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
        const version = globalVersion.translation;
        const language = globalLanguage;
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

    static getTranslation() {
        return Storage.getValue(this.node);
    }

    static setLocalStorage(target, value) {
        const json = JSON.stringify(value);
        const args = {
            target,
            value: json
        }
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
        const urlAssets = globalPathAssets;
        const language = globalLanguage;
        const version = globalVersion.translation;
        const url = `${urlAssets}translation/${version}/${language}/${target}.json`;

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