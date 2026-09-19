const nameSpace = 'lo'; // eslint-disable-line no-unused-vars
let deps = {}; // eslint-disable-line no-unused-vars
let ds; // eslint-disable-line no-unused-vars
export class Components {
    static get collectable() {
        const response = this.#buildName('collectable');

        return response;
    }

    static get entity() {
        const response = this.#buildName('entity');

        return response;
    }

    static get prefixComponent() {
        const response = `${ds.Components.prefixComponent}${nameSpace}`;

        return response;
    }

    static get prefixComponentDash() {
        const response = `${this.prefixComponent}-`;

        return response;
    }



    static #buildName(name) {
        const response = ds.Components.buildName(this.prefixComponentDash, name);

        return response;
    }
}
export class Customizations {
    static cssCustomization = 'customization--';

    static getColor(id) {
        const response = this.getData(
            Statics.colors,
            id
        );

        return response;
    }

    static getColorCSS(id) {
        const response = this.getColor(id)?.css;

        return response;
    }

    static getData(target, id) {
        if (!target) {
            return;
        }

        const response = target.find((customization) => {
            return customization.id_customization === Number(id);
        });

        return response;
    }

    static getSkin(id) {
        const response = this.getData(
            Statics.skins,
            id
        );

        return response;
    }

    static getSkinCSS(id) {
        const response = this.getSkin(id)?.css;

        return response;
    }
}
export class FetchData {
    static async update() {
        const controller = 'Lore/Statics';
        const args = {
            controller,
            action: 'update',
        };

        const response = await this.fetchData(args);
        return response;
    }

    static async fetchData(props) {
        const response = await this.retryInvalidToken(() => ds.DataLoader.fetchData(props));

        if (response) return response;
    }

    static async retryInvalidToken(request) {
        const attempts = 3;
        let response;

        for (let index = 0; index < attempts; index++) {
            response = await request();

            if (response?.isError && response?.errorMessage === ds.Prefix.TOKEN_INVALID) {
                continue;
            }

            break;
        }

        return response;
    }
}
export class HTML {
    static drawCollectable(target) {
        const item = ds.Helper.findById(ds.Modules.items, target);
        const css = item.css_tile;
        const html = `
            <div
                class="ds-tile gm-collectable lo-${css}"
            ></div>
        `;
        return html;
    }

    static drawEmoji(emoji) {
        if (!emoji) return '';

        const response = `
            <div
                class="ds-animation--up-down-2 ds-tooltip ds-emoji-wrapper"
            >
                <p>${emoji}</p>
                <div class="ds-tooltip__arrow"></div>
            </div>
        `;
        return response;
    }

    static drawLoot(props) {
        const {
            item,
            itemLoot,
            isDurability,
            isEquipment,
            kind,
            tooltipValue,
            isTooltip = true,
            id,
            durabilityStorage
        } = props;
        const itemId = item ?? props.target;
        const itemById = ds.Helper.findById(ds.Modules.items, Number(itemId));
        const itemDurability = durabilityStorage || null;
        const itemLootValue = itemLoot ?? props.itemLoot ?? item?.il ?? item?.itemLoot;
        const itemByItemLoot = itemLootValue ? ds.Helper.findById(ds.Modules.items, Number(itemLootValue)) : null;
        const itemLore = itemById ? itemById : itemByItemLoot;
        const itemCss = itemLore?.css_item ? itemLore?.css_item : (typeof itemLootValue === 'object' ? itemLootValue?.css_item : '');
        const durabilityMax = itemLore?.durability;
        const themeArgs = {
            value: itemDurability,
            valueMax: durabilityMax,
            isReverse: true
        };
        const theme = ds.Layout.buildProgressColor(themeArgs);
        const tooltipaArgs = {
            text: ds.Translation.gameGeneric?.durability,
            value: itemDurability,
            valueMax: durabilityMax,
            isPercentage: true
        };
        const itemTranslation = itemLore?.translation;

        let tooltipItem = isDurability ? ds.Translation.gameEquipment?.[itemTranslation] : ds.Translation.gameLoot?.[itemTranslation];
        if (!isEquipment && !itemTranslation) tooltipItem = ds.Translation.gameEquipment[kind];
        if (tooltipValue) tooltipItem = tooltipValue;

        const tooltipProgress = ds.Layout.buildTextCapacity(tooltipaArgs);
        const progress = `
            <c-ds-progress
                id="${id}"
                value="${itemDurability}"
                value-max="${durabilityMax}"
                theme="${theme}"
                data-tooltip="${tooltipProgress}"
                class="ds-display-flex ds-progress--durability ds-progress-position"
                direction="vertical"
                css-wrapper="gm-style gm-durability-wrapper"
            ></c-ds-progress>
        `;

        const durability = isDurability && itemDurability ? progress : '';
        let html = `
            <div
                class="${ds.Layout.cssTile} loot-${itemCss}"
                css-custom="ds-button--transparent"
        `;

        if (isTooltip) html += `data-tooltip="${tooltipItem}"`;

        html += `
            ></div>
            ${durability}
        `;

        return html;
    }

    static drawMonster(props) {
        const { context, animation, emoji } = props;
        const monster = context.getAttribute('data-kind');
        const id = context.getAttribute('id');
        const css = `${ds.Layout.cssTile} ${ds.Layout.cssAnimationPrepare} monster__${monster} ${animation}`;
        const emojiWrapper = this.drawEmoji(emoji);
        const html = `
            ${emojiWrapper}
            <div
                id="${id}"
                data-x="" data-y=""
                data-race=""
                data-level=""
                data-kind=""
                class="${css}"
            ></div>
        `;
        return html;
    }

    static drawPerson(props) {
        const { animation, customizations, equipments, emoji } = props;
        const buildProperty = (prop) => ds.Helper.isStringEmpty(prop) ? '' : prop;
        const getPerson = (id) => ds.Helper.findById(ds.Modules.items, Number(id))?.css_person;
        const getColor = (id) => Customizations.getColorCSS(id);
        const getSkin = (id) => Customizations.getSkinCSS(id);
        const cssSkin = (prop) => buildProperty(prop) !== '' ? getSkin(prop) : '';
        const cssCustomization = (prop) => buildProperty(prop) !== '' ? getColor(prop) : '';
        const buildEquipmentValidate = (prop) => getPerson(prop) !== null && typeof getPerson(prop) !== 'undefined' ? getPerson(prop) : '';
        const buildEquipment = (prop) => buildProperty(prop) !== '' ? buildEquipmentValidate(buildProperty(prop)) : '';
        const customizationEye = cssCustomization(customizations?.eye);
        const customizationHair = cssCustomization(customizations?.hair);
        const customizationClothes = buildEquipment(equipments?.clothes);
        const customizationSkin = cssSkin(customizations?.skin);
        const equipmentArmor = buildEquipment(equipments?.armor);
        const equipmentBackpack = buildEquipment(equipments?.backpack);
        const equipmentBoot = buildEquipment(equipments?.boot) || buildEquipment(equipments?.boots);
        const equipmentEyes = buildEquipment(equipments?.eyes);
        const equipmentFace = buildEquipment(equipments?.face);
        const equipmentGlove = buildEquipment(equipments?.glove) || buildEquipment(equipments?.gloves);
        const equipmentHair = buildEquipment(equipments?.hair);
        const equipmentHelmet = buildEquipment(equipments?.helmet);
        const equipmentShield = buildEquipment(equipments?.shield);
        const equipmentPants = buildEquipment(equipments?.pants);
        const equipmentWeapon = buildEquipment(equipments?.weapon);
        const cssDefault = `${ds.Layout.cssTile} gm-person-part ${ds.Layout.cssAnimationPrepare}`;
        const emojiWrapper = this.drawEmoji(emoji);
        const html = `
            ${emojiWrapper}
            <div class="person ${cssDefault}">
                <div
                    class="${cssDefault} ${animation} ${customizationSkin} skin"
                    data-element="skin"
                    data-color="skin"
                ></div>
                <div
                    class="${cssDefault} ${animation} skin-stroke"
                    data-element="skin_stroke"
                ></div>
                <div
                    class="${cssDefault} ${animation} eye-white"
                    data-element="eye_white"
                ></div>
                <div
                    class="${cssDefault} ${animation} ${customizationEye} eye-color"
                    data-element="eye_color"
                    data-color="eye"
                ></div>
                <div
                    class="${cssDefault} ${animation} shadow"
                    data-element="shadow"
                ></div>
                <div
                    class="${cssDefault} ${animation} ${customizationClothes}"
                    data-element="clothes"
                    data-customization="clothes"
                ></div>
                <div
                    class="${cssDefault} ${animation} ${equipmentPants}"
                    data-element="pants"
                ></div>
                <div
                    class="${cssDefault} ${animation} ${equipmentArmor}"
                    data-element="armor"
                ></div>
                <div
                    class="${cssDefault} ${animation} ${equipmentBoot}"
                    data-element="boot"
                ></div>
                <div
                    class="${cssDefault} ${animation} ${equipmentGlove}"
                    data-element="glove"
                ></div>
                <div
                    class="${cssDefault} ${animation} ${equipmentWeapon}"
                    data-element="weapon"
                ></div>
                <div
                    class="${cssDefault} ${animation} ${equipmentShield}"
                    data-element="shield"
                ></div>
                <div
                    class="${cssDefault} ${animation} ${customizationHair} ${equipmentHair}"
                    data-element="hair"
                    data-customization="hair"
                    data-color="hair"
                ></div>
                <div
                    class="${cssDefault} ${animation} ${equipmentHelmet}"
                    data-element="helmet"
                ></div>
                <div
                    class="${cssDefault} ${animation} ${equipmentBackpack}"
                    data-element="backpack"
                ></div>
                <div
                    class="${cssDefault} ${animation} ${equipmentEyes}"
                    data-element="eyes"
                ></div>
                <div
                    class="${cssDefault} ${animation} ${equipmentFace}"
                    data-element="face"
                ></div>
            </div>
        `;
        return html;
    }
}
export class Management {
    static async handleLoaded() {
        await Statics.update();
    }

    static init(props) {
        deps = props;
        ds = deps.ds;
        ds.Helper.addEventListenerDOM(this);
        this.initComponents();
    }

    static initComponents() {
        customElements.define('c-lo-entity', Entity);
        customElements.define('c-lo-collectable', Collectable);
    }
}
export class Statics {
    static colors = [];
    static skins = [];
    static clothesDefault = [];
    static hairDefault = [];

    static async update() {
        await ds.Modules.getItems();
        await ds.Modules.getTiles();

        const data = await FetchData.update();

        if (data.customizations) this.updateCustomizations(data);
    }

    static buildCustomizations(customizations, kind) {
        const response = customizations.filter((customization) => {
            return customization.kind === kind;
        });

        response.forEach((customization) => {
            customization.css = `${Customizations.cssCustomization}${customization.label}`;
        });

        return response;
    }

    static updateCustomizations(data) {
        const { customizations } = data;
        const { clothesDefault, hairDefault } = customizations;

        if (!customizations) return;

        const available = customizations.available;

        this.colors = this.buildCustomizations(available, 1);
        this.skins = this.buildCustomizations(available, 0);
        this.clothesDefault = clothesDefault;
        this.hairDefault = hairDefault;
    }
}
export class Collectable extends HTMLElement {
    args = {
        context: this,
        cssPrefix: 'collectable'
    };



    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.render();
    }



    draw() {
        const loot = Number(this.getAttribute('data-loot'));
        const response = HTML.drawCollectable(loot);
        return response;
    }

    render() {
        const component = this.draw();

        ds.Components.render(this.args, component);
        ds.Tooltip?.elTooltipWrapper?.build(this.args);
    }
}
export class Entity extends HTMLElement {
    args = {
        context: this,
        cssPrefix: 'entity'
    };



    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.render();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue === newValue) return;
        this.redraw();
    }

    static get observedAttributes() {
        const response = [
            'direction',
            'action',
            'customizations',
            'equipments',
            'emoji'
        ];
        return response;
    }



    draw(animation) {
        const entity = this.getAttribute('entity');
        const capitalize = ds.Helper.capitalizeString(entity);
        const html = this[`draw${capitalize}`](animation);

        return html;
    }

    drawMonster(animation) {
        const emoji = this.emoji;
        const args = {
            context: this,
            animation,
            emoji
        };
        const html = HTML.drawMonster(args);
        return html;
    }

    drawPerson(animation) {
        const customizations = this.customizations;
        const equipments = this.equipments;
        const emoji = this.emoji;
        const args = {
            context: this,
            animation,
            customizations,
            equipments,
            emoji
        };
        const html = HTML.drawPerson(args);
        return html;
    }

    get customizations() {
        const response = this.getJsonFromAttribute('customizations');
        return response;
    }

    get emoji() {
        const response = this.getJsonFromAttribute('emoji');
        return response;
    }

    get equipments() {
        const response = this.getJsonFromAttribute('equipments');
        return response;
    }

    getJsonFromAttribute(attribute) {
        const response = ds.Helper.getJsonFromAttribute(this, attribute);
        return response;
    }

    redraw() {
        const direction = this.getAttribute('direction');
        const action = this.getAttribute('action');
        const entity = this.getAttribute('entity');
        const isDirection = direction && direction !== 'undefined';
        let animation = `${action}-${direction}`;

        if (action === 'sleep') animation = 'idle-down-sleep';
        if (entity === 'person' && action === 'stand') animation += '-delay';
        if (!isDirection && action !== 'sleep') return;
        this.render(animation);
    }

    render(animation = 'stand-bottom') {
        const component = this.draw(animation);
        ds.Components.render(this.args, component);
        ds.Tooltip?.elTooltipWrapper?.build(this.args);
    }

    static setAttr(props) {
        const { target, attr, value } = props;
        if (!target || !attr || !value) return;
        const fixValue = JSON.stringify(value);

        target.setAttribute(attr, fixValue);
    }

    static setCustomizations(target, value) {
        const args = {
            target,
            value,
            attr: 'customizations'
        };

        this.setAttr(args);
    }

    static setEquipments(target, value) {
        const args = {
            target,
            value,
            attr: 'equipments'
        };

        this.setAttr(args);
    }
}