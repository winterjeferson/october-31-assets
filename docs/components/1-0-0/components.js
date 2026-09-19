class Button extends HTMLElement {
    args = {
        context: this,
        cssPrefix: 'button',
        detail: []
    };

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.render();
        HTML?.elTooltipWrapper?.build(this.args);
    }

    static get observedAttributes() {
        return [Layout.attributeDisabled, Layout.attributeActive, 'css-custom'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue === newValue) return;
        this.render();
    }

    get attributeClick() {
        return this.getAttribute('click');
    }

    get isClick() {
        const response = this.attributeClick || false;

        return response;
    }

    buildClick() {
        if (!this.isClick) return;
        const el = this.shadowRoot.querySelector('button');
        el.addEventListener('click', () => this.handleClick());
    }

    draw() {
        const label = this.getAttribute('label') || '';
        const type = this.getAttribute('type') || 'button';
        const attributeDisabled = this.getAttribute(Layout.attributeDisabled) || 'false';
        const isDisabled = attributeDisabled === 'true' ? 'disabled' : '';
        const attributeActive = this.getAttribute(Layout.attributeActive) || 'false';
        const isActive = attributeActive === 'true';
        this.args.cssActive = isActive ? true : false;
        const css = Layout.buildCss(this.args);
        const icon = this.drawIcon();
        const html = `
            <button
                ${css}
                type="${type}"
                ${isDisabled}
            >
                ${label} ${icon}
            </button>
        `;

        return html;
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
        const html = Layout.drawIcon(props);

        return html;
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
        this.buildClick();
    }
}

customElements.define('c-button', Button);
class FormField extends HTMLElement {
    args = {
        context: this,
        cssPrefix: 'form-field'
    };

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.render();
    }

    draw() {
        const label = this.getAttribute('label') || '';
        const type = this.getAttribute('type') || 'text';
        const value = this.getAttribute('input-value') || '';
        const hasButton = this.getAttribute('has-button') === 'true' || false;
        const id = Helper.buildId(label);
        const htmlButton = hasButton ? this.drawButton() : '';
        const html = `
            <label class="ds-form__label" for="id_${id}">${label}</label>
            <input class="ds-form__input" id="id_${id}" type="${type}" value="${value}">
            ${htmlButton}
        `;

        return html;
    }

    drawButton() {
        const theme = this.getAttribute('button-theme') || 'black';
        const tooltip = this.getAttribute('button-data-tooltip') || '';
        const icon = this.getAttribute('icon') || '';
        const html = `
            <c-button 
                icon="${icon}" 
                icon-size="extra-small"
                theme="${theme}" 
                size="regular" 
                data-tooltip="${tooltip}"
                is-proportional="true"
                class="ds-button--over"
                css-custom="ds-animation--circle"
            >
            </c-button>
        `;
        return html;
    }

    render() {
        const component = this.draw();

        Components.render(this.args, component);
    }
}

customElements.define('c-form-field', FormField);
class FormSelect extends HTMLElement {
    args = {
        context: this,
        cssPrefix: 'form-select'
    };

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.render();
    }

    draw() {
        const label = this.getAttribute('label') || '';
        const options = this.drawOptions();
        const id = Helper.buildId(label);
        const html = `
            <label class="ds-form__label" for="id_${id}">${label}</label>
            <select class="ds-form__select" id="id_${id}">
                ${options}
            </select>
        `;

        return html;
    }

    drawOptions() {
        const options = this.getAttribute('options');
        const json = JSON.parse(options);
        const length = json.label.length;
        let html = '';

        for (let i = 0; i < length; i++) {
            const label = json.label[i];
            const value = json.value[i];

            html += `
                <option value="${value}">${label}</option>
            `;
        }
        return html;
    }

    render() {
        const component = this.draw();

        Components.render(this.args, component);
    }
}

customElements.define('c-form-select', FormSelect);
class Game extends HTMLElement {
    args = {
        context: this,
        cssPrefix: 'game'
    };
    isPlaying = false;

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.render();
    }

    draw() {
        const html = `
            <main
                id="${HTML.idGameMain}" 
                class="ds-content-position"
            >
                <c-game-battle 
                    id="${HTML.idGameBattle}"
                    class="ds-content-position"
                    >
                </c-game-battle>
                <c-game-map 
                    id="${HTML.idGameMap}"
                    class="ds-content-position"
                    >
                </c-game-map>
            </main>
        `;

        return html;
    }

    render() {
        const component = this.draw();

        Components.render(this.args, component);
    }

    setIsPlaying(value) {
        this.isPlaying = value;
    }

    setOfuscated(value) {
        const css = 'gm--obfuscated';
        const elGame = HTML.elGameMain;

        if (value) return Helper.addClass(elGame, css);
        Helper.removeClass(elGame, css);
    }
}

customElements.define('c-game', Game);
class GameBattle extends HTMLElement {
    args = {
        context: this,
        cssPrefix: 'game-battle'
    };

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.render();
    }

    build(target) {
        console.log('GameBattle build() target', target);

        HTML.elHudTransition.setAttribute('is-open', true);
        HTML.elHudTransition.setAttribute('kind', 'battle');

        setTimeout(() => {
            HTML.elHudTransition.setAttribute('is-open', false);
        }, HTML.elHudTransition.timeout);
    }

    draw() {
        const html = `
        `;

        return html;
    }

    render() {
        const component = this.draw();

        Components.render(this.args, component);
    }

    unbuild() {

    }
}

customElements.define('c-game-battle', GameBattle);
class GameCollectible extends HTMLElement {
    args = {
        context: this,
        cssPrefix: 'game-collectible'
    };

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.render();
        HTML?.elTooltipWrapper?.build(this.args);
    }

    draw() {
        const html = `
            <div 
                class="ds-tile gm-collectible"
                style="background-color: white"
            >
            </div>
        `;

        return html;
    }

    render() {
        const component = this.draw();

        Components.render(this.args, component);
    }
}

customElements.define('c-game-collectible', GameCollectible);
class GameEntity extends HTMLElement {
    args = {
        context: this,
        cssPrefix: 'entity'
    };

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.render();
        HTML?.elTooltipWrapper?.build(this.args);
    }

    static get observedAttributes() {
        return ['direction', 'action'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue === newValue) return;
        this.redraw();
    }

    draw() {
        const entity = this.getAttribute('entity');
        let html = '';

        if (entity === 'person') html = this.drawPerson();
        if (entity === 'monster') html = this.drawMonster();
        return html;
    }

    drawPerson() {
        const html = `
            <div 
                class="ds-tile"
                style="background-color: orange"
            >
            </div>
        `;
        return html;
    }

    drawMonster() {
        const html = `
            <div 
                class="ds-tile"
                style="background-color: purple"
            >
            </div>
        `;
        return html;
    }

    redraw() {
        const direction = this.getAttribute('direction');
        const action = this.getAttribute('action');
        const entity = this.getAttribute('entity');
        const id = this.getAttribute('id');
    }

    render() {
        const component = this.draw();

        Components.render(this.args, component);
    }
}

customElements.define('c-game-entity', GameEntity);
class GameMap extends HTMLElement {
    args = {
        context: this,
        cssPrefix: 'game-map'
    };
    map = {
        tiles: [],
        path: [],
        height: 0,
        width: 0,
        monsters: [],
        npcs: [],
        collectibles: [],
        player: {
            position: [0, 0]
        }
    };
    randomMovementInterval = 0;
    randomMovementIntervalTime = 0;
    directions = [
        { dx: 1, dy: 0 },
        { dx: -1, dy: 0 },
        { dx: 0, dy: 1 },
        { dx: 0, dy: -1 }
    ];
    directionsLength = this.directions.length;
    safeDistance = 2;

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    addClick(el) {
        el.forEach(index => {
            index.addEventListener('click', () => {
                const positionX = parseInt(index.getAttribute(Layout.attributePositionX));
                const positionY = parseInt(index.getAttribute(Layout.attributePositionY));
                const currentX = HTML.elGamePlayer.getAttribute('data-position-x');
                const currentY = HTML.elGamePlayer.getAttribute('data-position-y');
                const args = {
                    el: HTML.elGamePlayer,
                    positionXTo: positionX,
                    positionYTo: positionY,
                    positionXFrom: currentX,
                    positionYFrom: currentY,
                };

                Walk.walk(args);
            });
        });
    }

    draw() {
        const tiles = this.map.tiles;
        const lines = tiles.length;
        const columns = tiles[0].length;
        const widthMath = columns * Layout.tileSize;
        const width = Layout.buildPixel(widthMath);
        const heightMath = lines * Layout.tileSize;
        const height = Layout.buildPixel(heightMath);
        const player = GamePlayers.draw();
        const nPC = GameNPCs.draw(this.map.npcs);
        const collectible = GameCollectibles.draw(this.map.collectibles);
        const monsters = GameMonsters.draw(this.map.monsters);
        let html = `
            ${player}
            ${nPC}
            ${monsters}
            ${collectible}
            <div 
                class="gm-map" 
                style="width: ${width}; height: ${height};"
            >
        `;
        html += this.drawTiles(tiles);
        html += '</div>';

        this.map.width = widthMath;
        this.map.height = heightMath;
        return html;
    }

    drawTiles(map) {
        let html = '';

        map.forEach((line, lineIndex) => {
            line.forEach((column, columnIndex) => {
                const props = {
                    id: column,
                    positionX: columnIndex,
                    positionY: lineIndex
                };
                html += Layout.drawTile(props);
            });
        });
        return html;
    }

    findPath(props) {
        const { start, end } = props;
        const map = this.map.path;
        const path = Pathfinding.findPath(map, start, end);

        return path;
    }

    getOccupation(x, y) {
        const args = {
            target: undefined,
            positionX: 0,
            positionY: 0,
        };
        const playerElement = HTML.elGamePlayer;
        const playerX = parseInt(playerElement.getAttribute(Layout.attributePositionX));
        const playerY = parseInt(playerElement.getAttribute(Layout.attributePositionY));

        if (playerX === x && playerY === y) {
            args.target = playerElement;
            args.positionX = playerX;
            args.positionY = playerY;
        }

        for (const npc of this.map.npcs) {
            const elNPC = this.shadowRoot.getElementById(`${GameNPCs.id}_${npc.id}`);
            if (elNPC) {
                const npcX = parseInt(elNPC.getAttribute(Layout.attributePositionX));
                const npcY = parseInt(elNPC.getAttribute(Layout.attributePositionY));

                if (npcX === x && npcY === y) {
                    args.target = elNPC;
                    args.positionX = npcX;
                    args.positionY = npcY;
                }
            }
        }

        for (const [index, monster] of this.map.monsters.entries()) {
            for (let i = 0; i < monster.quantity; i++) {
                const elMonster = this.shadowRoot.getElementById(`${GameMonsters.id}_${index}_${i}`);

                if (elMonster) {
                    const monsterX = parseInt(elMonster.getAttribute(Layout.attributePositionX));
                    const monsterY = parseInt(elMonster.getAttribute(Layout.attributePositionY));

                    if (monsterX === x && monsterY === y) {
                        args.target = elMonster;
                        args.positionX = monsterX;
                        args.positionY = monsterY;
                    }
                }
            }
        }

        const collectibles = this.shadowRoot.querySelectorAll('.gm-collectible');
        for (const collectible of collectibles) {
            const collectibleX = parseInt(collectible.getAttribute('data-position-x'));
            const collectibleY = parseInt(collectible.getAttribute('data-position-y'));

            if (collectibleX === x && collectibleY === y) {
                args.target = collectible;
                args.positionX = collectibleX;
                args.positionY = collectibleY;
            }
        }

        return args;
    }

    isMovingRandom() {
        return Math.random() < 0.3;
    }

    isOccupied(x, y) {
        const occupation = this.getOccupation(x, y);

        if (occupation.target) return true;
        return false;
    }

    getPosition(target) {
        if (!target) return;
        const dataX = target.getAttribute(Layout.attributePositionX);
        const dataY = target.getAttribute(Layout.attributePositionY);
        const math = (target) => Number(target) * Layout.tileSize;
        const position = {
            top: math(dataY),
            left: math(dataX),
        };

        return position;
    }

    getSafeZone() {
        const availablePositions = [];
        const playerElement = this.shadowRoot.getElementById(HTML.idGamePlayer);
        const playerX = parseInt(playerElement.getAttribute(Layout.attributePositionX));
        const playerY = parseInt(playerElement.getAttribute(Layout.attributePositionY));
        const npcPositions = this.map.npcs.map(npc => ({
            x: parseInt(npc.position[0]),
            y: parseInt(npc.position[1])
        }));

        this.map.path.forEach((row, y) => {
            row.forEach((cell, x) => {
                const withinPlayerZone = x >= playerX - this.safeDistance && x <= playerX + this.safeDistance &&
                    y >= playerY - this.safeDistance && y <= playerY + this.safeDistance;

                const withinNpcZone = npcPositions.some(npcPos =>
                    x >= npcPos.x - this.safeDistance && x <= npcPos.x + this.safeDistance &&
                    y >= npcPos.y - this.safeDistance && y <= npcPos.y + this.safeDistance
                );

                if (cell === 0 && !withinPlayerZone && !withinNpcZone) {
                    availablePositions.push({ x, y });
                }
            });
        });

        return availablePositions;
    }

    isWithinMapBounds(x, y) {
        return x >= 0 && y >= 0 && x < this.map.width && y < this.map.height;
    }

    moveRandomEntities(entities, idGenerator) {
        const playerX = Number(HTML.elGamePlayer.getAttribute('data-position-x'));
        const playerY = Number(HTML.elGamePlayer.getAttribute('data-position-y'));

        entities.forEach((entity, index) => {
            const quantity = entity.quantity || 1;
            for (let i = 0; i < quantity; i++) {
                if (this.isMovingRandom()) {
                    const entityId = idGenerator(entity, index, i);
                    const el = this.shadowRoot.getElementById(entityId);

                    if (el) {
                        const behavior = el.getAttribute('behavior') || 'none';

                        const isWalkBack = el.getAttribute('is-walk-back') === 'true';
                        const initialX = parseInt(el.getAttribute(Layout.attributePositionXInitial));
                        const initialY = parseInt(el.getAttribute(Layout.attributePositionYInitial));

                        let currentX = parseInt(el.getAttribute(Layout.attributePositionX));
                        let currentY = parseInt(el.getAttribute(Layout.attributePositionY));

                        if (isWalkBack && (currentX !== initialX || currentY !== initialY)) {
                            currentX = initialX;
                            currentY = initialY;
                        } else {
                            const steps = parseInt(el.getAttribute('data-walk-steps')) || 1;
                            const randomSteps = Math.floor(Math.random() * steps) + 1;

                            for (let step = 0; step < randomSteps; step++) {
                                let targetX, targetY;

                                // if (behavior === 'aggressive') {
                                //     const dx = playerX > currentX ? 1 : playerX < currentX ? -1 : 0;
                                //     const dy = playerY > currentY ? 1 : playerY < currentY ? -1 : 0;
                                //     targetX = currentX + dx;
                                //     targetY = currentY + dy;

                                // } else {
                                const randomDirection = this.directions[Math.floor(Math.random() * this.directionsLength)];
                                targetX = currentX + randomDirection.dx;
                                targetY = currentY + randomDirection.dy;

                                if (behavior === 'none') {
                                    if (Math.abs(targetX - playerX) <= 1 && Math.abs(targetY - playerY) <= 1) {
                                        continue;
                                    }
                                }
                                // }

                                if (this.isWithinMapBounds(targetX, targetY) &&
                                    this.map.path[targetY]?.[targetX] === 0 &&
                                    !this.isOccupied(targetX, targetY)) {
                                    currentX = targetX;
                                    currentY = targetY;
                                } else {
                                    break;
                                }
                            }
                        }

                        const args = {
                            el,
                            positionXFrom: parseInt(el.getAttribute(Layout.attributePositionX)),
                            positionYFrom: parseInt(el.getAttribute(Layout.attributePositionY)),
                            positionXTo: currentX,
                            positionYTo: currentY
                        };
                        Walk.walk(args);
                    }
                }
            }
        });
    }

    moveRandomMonster() {
        this.moveRandomEntities(this.map.monsters, (monster, index, i) => `${GameMonsters.id}_${index}_${i}`);
    }

    moveRandomNPC() {
        this.moveRandomEntities(this.map.npcs, (npc) => `${GameNPCs.id}_${npc.id}`);
    }

    render() {
        const component = this.draw();

        Components.render(this.args, component);
        GamePlayers.setPosition(this.map.player.position);
        GameNPCs.setPosition(this.map.npcs);
        GameMonsters.setPosition(this.map.monsters);
        GameCollectibles.setPosition(this.map.collectibles);
        this.setMovementInterval();
        GameMonsters.addClick();
        GameNPCs.addClick();
        GameCollectibles.addClick();
    }

    setMovementInterval() {
        const getRandomIntervalTime = () => Math.floor(Math.random() * (10000 - 3000 + 1)) + 1000;

        const executeMovement = () => {
            this.moveRandomMonster();
            this.moveRandomNPC();
            clearInterval(this.randomMovementInterval);
            this.randomMovementIntervalTime = getRandomIntervalTime();
            this.setMovementInterval();
        };

        clearInterval(this.randomMovementInterval);
        this.randomMovementInterval = setInterval(executeMovement, this.randomMovementIntervalTime);
    }

    setPosition(props) {
        const calculate = (target) => Number(target) * Layout.tileSize;
        const { target, positionX, positionY } = props;
        const left = calculate(positionX);
        const top = calculate(positionY);
        const style = `transform: translate(${left}px, ${top}px); transition: .5s;`;

        target.setAttribute('style', style);
        target.setAttribute(Layout.attributePositionX, positionX);
        target.setAttribute(Layout.attributePositionY, positionY);
    }

    updateData(props) {
        const { map, monsters, npcs, player, collectibles } = props;

        this.map.path = map;
        this.map.tiles = map;
        this.map.monsters = monsters;
        this.map.npcs = npcs;
        this.map.player = player;
        this.map.collectibles = collectibles;
        this.render();
        HTML.update();
    }
}

customElements.define('c-game-map', GameMap);
class Hud extends HTMLElement {
    args = {
        context: this,
        cssPrefix: 'hud'
    };

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.render();
        this.addEventListeners();
    }

    addEventListeners() {
        this.addEventListener('close-hud-page', this.closeHudPage.bind(this));
        this.addEventListener('close-modal', this.closeModal.bind(this));
        this.addEventListener('open-hud-page', this.openPage.bind(this));
        this.addEventListener('open-modal', this.openModal.bind(this));
    }

    static buildElHudPage(target) {
        const capitalize = Helper.capitalizeString(target);
        const el = HTML[`elHudPage${capitalize}`];

        return el;
    }

    close(el) {
        el.setAttribute('is-open', 'false');
        this.setGameObfuscated();
        HTML?.elTooltipWrapper?.clear();
        HTML.elHudMenu.setActive();
    }

    closeModal() {
        const isCLoseButton = HTML.elHudModal.getAttribute('is-close-button');

        if (isCLoseButton !== 'false') this.close(HTML.elHudModal);
    }

    closeHudPage(props) {
        const { pagePosition } = props.detail;
        const el = Hud.buildElHudPage(pagePosition);

        this.close(el);
    }

    closeHudPages() {
        const pages = ['right', 'left'];

        pages.forEach((page) => {
            const el = Hud.buildElHudPage(page);
            this.close(el);
        });
    }

    draw() {
        const html = `
            <c-transition 
                id="${HTML.idHudTransition}"
                is-open="true"
                kind="loading"
            >
            </c-transition>
            <c-modal 
                id="${HTML.idHudModal}"
                page-title=""
                page-description=""
                size=""
                is-open="false"
                is-close-button="false"
                page=""
                class="ds-display-contents"
            >
            </c-modal>
            <div class="ds-hud ds-hud__background">
                <div class="ds-hud-size ds-hud-camera ds-hud-camera-shadow">
                    <div class="ds-hud__content">
                        <c-hud-page 
                            id="${HTML.idHudPageLeft}"
                            class="ds-page-height"
                            position="left"
                            page-title=""
                            is-open="false"
                        >
                        </c-hud-page>
                        <c-hud-page 
                            id="${HTML.idHudPageRight}"
                            class="ds-page-height"
                            position="right"
                            page-title=""
                            is-open="false"
                        >
                        </c-hud-page>
                        <c-game
                            id="${HTML.idGame}"
                            class="ds-page-height gm"
                        >
                        </c-game>
                    </div>
                    <div class="ds-hud__footer">
                        <section class="ds-content__navigation ds-content-theme ds-content-theme--navigation">
                            <c-hud-status 
                                id="${HTML.idHudStatus}"
                                class="ds-content__bars"
                            >
                            </c-hud-status>
                            <c-hud-menu 
                                id="${HTML.idHudMenu}"
                                class="ds-content__menu ds-right"
                            >
                            </c-hud-menu>
                        </section>
                    </div>
                </div>
            </div>
        `;
        return html;
    }

    open(el) {
        el.setAttribute('is-open', 'true');
        this.setGameObfuscated();
    }

    openPage(props) {
        const detail = props.detail;
        const {
            context,
            pageTarget,
            pagePosition,
            isNPC,
            name
        } = detail;
        const elPage = Hud.buildElHudPage(pagePosition);
        const isOpen = elPage.getAttribute('is-open') === 'true';
        const isSamePage = elPage.getAttribute('page') === pageTarget;

        if (!isOpen || !isSamePage) {
            this.setPage(elPage, pageTarget);
            this.open(elPage);
            if (isNPC) {
                this.setPageNpc(name);
                elPage.setAttribute('data-npc', name);
            }
            HTML.elHudMenu.setActive(context);
        } else if (isOpen && isSamePage) {
            this.closeHudPage({ detail: { pagePosition } });
        }
    }

    openPageChangeModal(args) {
        HTML.elGame.setIsPlaying(false);
        HTML.elHudModal.setAttribute('is-close-button', true);
        this.closeHudPages();
        this.closeModal();
        this.openModal(args);
    }

    openPageCustomize() {
        const props = {
            target: 'select-customization',
            title: Translation.interface?.page_select_customization?.title,
            description: Translation?.interface?.page_select_customization?.description,
            size: 'big',
            isCloseButton: false,
        };
        this.openPageChangeModal(props);
    }

    static openPageDetail(props) {
        const { id, context } = props;
        const pagePosition = context.parentNode.parentNode.parentNode.getAttribute('data-position');
        const elPage = Hud.buildElHudPage(pagePosition);
        const npc = elPage.getAttribute('data-npc');
        const from = npc ? `npc-${npc}` : context.getAttribute('page');
        const pageTarget = 'detail';
        const isNPC = npc ? true : false;
        const args = {
            detail: {
                id,
                page: elPage,
                pageTarget,
                pagePosition,
                from,
                isDetail: true,
                isNPC,
                name: npc
            }
        };

        elPage.lastPage = args.detail;
        HTML.elHud.openPage(args);
        HTML.elHud.setPage(elPage, pageTarget);
    }

    openModal(props) {
        const {
            target,
            title,
            description,
            size = 'regular',
            isCloseButton = true
        } = props;
        const el = HTML.elHudModal;

        el.setAttribute('page-title', title);
        el.setAttribute('page-description', description);
        el.setAttribute('size', size);
        el.setAttribute('is-close-button', isCloseButton);
        this.setPage(el, target);
        this.open(el);
    }

    openModalSelectClass() {
        const props = {
            target: 'select-class',
            title: Translation.interfaceDefault?.select_class,
            description: Translation?.interface?.page_select_class?.description,
            size: 'small',
            isCloseButton: false,
        };
        this.openPageChangeModal(props);
    }

    openModalSelectCharacter(isCloseButton = true) {
        const props = {
            target: 'select-character',
            title: Translation.interface?.page_select_character?.title,
            description: Translation.interface?.page_select_character?.description,
            size: 'small',
            isCloseButton,
        };
        this.openPageChangeModal(props);
    }

    render() {
        const component = this.draw();

        Components.render(this.args, component);
    }

    setPage(el, page) {
        el.setAttribute('page', page);
    }

    setPageNpc(target) {
        const el = HTML.elHudPageLeft;
        const text = Translation.dialog[target].greet;

        el.setTitle(target);
        el.setText(text);
    }

    setGameObfuscated() {
        const isPageRight = HTML?.elHudPageRight.getAttribute('is-open') === 'true';
        const isPageLeft = HTML?.elHudPageLeft.getAttribute('is-open') === 'true';
        const isModal = HTML.elHudModal?.getAttribute('is-open') === 'true';
        let isOfuscated = false;

        if (isPageRight) isOfuscated = true;
        if (isPageLeft) isOfuscated = true;
        if (isModal) isOfuscated = true;
        HTML.elGame.setOfuscated(isOfuscated);
    }
}

customElements.define('c-hud', Hud);
class HudContentMoney extends HTMLElement {
    args = {
        context: this,
        cssPrefix: 'hud-content-money'
    };

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.render();
    }

    draw() {
        const gold = 666;
        const diamonds = 999;
        const props = {
            theme: 'grey',
            size: 'extra-big',
            icon: 'profile'
        };
        const icon = Layout.drawIcon(props);
        const content = `
            <div class="ds-page__footer">
                Em seu inventário: 
                ${icon}
                <span class="ds-label">${gold}</span>
                ${icon}
                <span class="ds-label">${diamonds}</span>
            </div>
        `;
        const html = `
            ${content}
        `;

        return html;
    }

    render() {
        const component = this.draw();

        Components.render(this.args, component);
    }
}

customElements.define('c-hud-content-money', HudContentMoney);
class HudMenu extends HTMLElement {
    args = {
        context: this,
        cssPrefix: 'hud-menu'
    };
    buttons = [
        {
            id: `${HTML.idHudMenu}_attributes`,
            pageTarget: 'attributes',
            icon: 'profile',
            translation: 'attributes'
        },
        {
            id: `${HTML.idHudMenu}_equipments`,
            pageTarget: 'equipments',
            icon: 'equipments',
            translation: 'equipments'
        },
        {
            id: `${HTML.idHudMenu}_inventory`,
            pageTarget: 'inventory',
            icon: 'inventory',
            translation: 'inventory'
        },
        {
            id: `${HTML.idHudMenu}_map`,
            pageTarget: 'map',
            icon: 'map',
            translation: 'map'
        },
        {
            id: `${HTML.idHudMenu}_quests`,
            pageTarget: 'quests',
            icon: 'quests',
            translation: 'quests'
        },
        {
            id: `${HTML.idHudMenu}_achievements`,
            pageTarget: 'achievements',
            icon: 'achievements',
            translation: 'achievements'
        },
        {
            id: `${HTML.idHudMenu}_settings`,
            pageTarget: 'settings',
            icon: 'settings',
            translation: 'settings'
        },
    ];

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.render();
    }

    buildTooltip(page) {
        const getTranslationTitle = (target) => Translation.getTranslationPage(target)?.title;
        const hotkey = Hotkeys.getKey(page);
        const response = Translation.buildTextAndHotkey(getTranslationTitle(page), hotkey);

        return response;
    }

    draw() {
        let html = '';
        this.buttons.forEach((index) => {
            html += `
                <c-button 
                    id="${index.id || ''}" 
                    icon="${index.icon}" 
                    icon-size="big"
                    theme="black" 
                    size="extra-big" 
                    data-tooltip="${index.tooltip || ''}"
                    data-kind="button"
                    is-proportional="true"
                    page-target="${index.pageTarget}"
                    page-position="right"
                    click="open-hud-page"
                    css-custom="${index.css}"
                >
                </c-button>
            `;
        });
        return html;
    }

    redraw() {
        this.translate();
        this.render();
    }

    render() {
        const component = this.draw();

        Components.render(this.args, component);
    }

    setActive(target = undefined) {
        if (target) {
            Layout.setActiveButton(target);
        } else {
            const elButton = this.shadowRoot.querySelector('c-button');

            Layout.setActiveButton(elButton, false);
        }
    }

    translate() {
        this.buttons.forEach((index) => {
            index.tooltip = this.buildTooltip(index.translation);
        });
    }
}

customElements.define('c-hud-menu', HudMenu);
class HudPage extends HTMLElement {
    args = {
        context: this,
        cssPrefix: 'hud-page'
    };
    isOpen = false;
    isMenu = false;
    lastPage = {};

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.render();
    }

    static get observedAttributes() {
        return ['position', 'is-open', 'page'];
    }

    get elContent() {
        const el = this.elContentContainer.querySelector('.ds-display-contents');
        return el;
    }

    get elContentContainer() {
        const el = this.shadowRoot.querySelector('.ds-page__loading');
        return el;
    }

    get elMenu() {
        const el = this.shadowRoot.querySelector('.ds-button-wrapper');
        return el;
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue === newValue) return;
        this.render();
    }

    draw() {
        const getTranslationPage = (target) => Translation.getTranslationPage(target);
        const position = this.getAttribute('position') || '';
        const isOpen = this.getAttribute('is-open');
        if (isOpen === 'true') this.isOpen = true;
        if (isOpen === 'false' || !isOpen) this.isOpen = false;
        if (!this.isOpen) return '';
        const buttonClose = Layout.drawButtonClose({
            position,
            click: 'close-hud-page',
        });
        const page = this.getAttribute('page');
        const title = getTranslationPage(page)?.title;
        const ribbon = Layout.drawRibbon(title);
        const description = getTranslationPage(page)?.description || '';
        const loading = Layout.drawLoading({ theme: 'grey', size: 'big' });
        let html = `
            <div 
                class="ds-content-theme ds-hud__content-page ds-content--${position}" 
                data-position="${position}"
            >
                <section class="ds-page">
                    <div class="ds-page__header">
                        ${ribbon}"
                        <div class="ds-content__close">
                            ${buttonClose}
                        </div>
                    </div>
                    <div class="ds-row ds-page__text">
                        <p>${description}</p>
                    </div>
                     <div class="ds-row">
                        <div class="ds-button-wrapper ds-row ds-center ds-tab ds-tab--black">
                        </div>
                    </div>
                    <div class="ds-page__loading ds-display-contents">
                       ${loading}
                    </div>
                </section>
            </div>
        `;
        return html;
    }

    static drawContent(page, content) {
        const html = `
            <div class="ds-page__content ds-scrollbar ds-page__${page}">
                ${content}
            </div>
        `;
        return html;
    }

    static drawFooter(content, isMenu = true) {
        let html = '<div class="ds-page__footer">';

        if (isMenu) html += '<div class="ds-row ds-right ds-button-wrapper">';
        html += content;
        if (isMenu) html += '</div>';
        html += '</div>';
        return html;
    }

    drawMenu(props) {
        const { buttons } = props;
        let html = '';

        buttons.forEach((button) => {
            html += `
                <c-button 
                    data-id="${button.id}"
                    theme="black" 
                    size="small" 
                    data-tooltip="${button.tooltip || ''}"
                    label="${button.label || ''}"
                    css-custom="ds-tab__button"
                    data-handler="${button.handler}"
                    data-handler-props='${button.handlerProps}'
                    data-kind='button'
                    ${Layout.attributeActive}=""
                >
                </c-button>
            `;
        });
        return html;
    }

    drawPage(page) {
        const html = `
            <c-hud-page-${page}
                class="ds-display-contents"
                page="${page}"
            >
            </c-hud-page-${page}>
        `;
        return html;
    }

    drawPageComponent(target = undefined) {
        const page = target || this.getAttribute('page');
        const elPage = this.drawPage(page);

        const container = this.elContentContainer;
        if (container) container.innerHTML = elPage;
    }

    handleClickPage(target) {
        const elButton = this.elMenu.querySelector(`[data-id="${target}"]`);

        Layout.setActiveButton(elButton);
    }

    handleFilter(target) {
        this.elContent.handleFilter(target);
        this.handleClickPage(target);
    }

    handleOpenPage(target) {
        console.log('handleOpenPage() target', target);
        HTML.elHudPageLeft.drawPageComponent(target);
        this.handleClickPage(target);
    }

    render() {
        const component = this.draw();

        Components.render(this.args, component);
        setTimeout(() => {
            this.drawPageComponent();
        }, 0);
    }

    setMenu(props) {
        const el = this.drawMenu(props);

        Helper.addClass(this.elMenu.parentNode, 'ds-page__menu');
        this.elMenu.innerHTML = el;
        Layout.addEventListeners(this, 'c-button');

        const elButton = this.elMenu.querySelector('c-button');
        elButton.click();
    }

    setTitle(value) {
        const el = this.shadowRoot.querySelector('.ds-title');

        el.innerText = value;
    }

    setText(value) {
        const el = this.shadowRoot.querySelector('.ds-page__text p');

        el.innerText = value;
    }
}

customElements.define('c-hud-page', HudPage);
class HudPageAchievements extends HTMLElement {
    args = {
        context: this,
        cssPrefix: 'hud-page-achievements'
    };

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.render();
    }

    draw() {
        const translation = Translation.interfaceDefault;
        const page = this.getAttribute('page');
        const list = this.drawList();
        const content = `
            <table class="ds-table ds-table--effect">
                <thead>
                    <tr>
                        <th>${translation.title}</th>
                        <th>${translation.description}</th>
                        <th>${translation.reward}</th>
                        <th>${translation.progress}</th>
                        <th>${translation.status}</th>
                    </tr>
                </thead>
                <tbody>
                    ${list}
                </tbody>
            </table>
        `;
        const contentWrapper =  HudPage.drawContent(page, content);
        const html = `
            ${contentWrapper}
        `;

        return html;
    }

    drawList() {
        const length = 30;
        let html = '';

        for (let i = 0; i < length; i++) {
            const progress = this.drawProgress();
            const status = Helper.getRandomBetween(0, 1);
            const icon = this.drawIcon(status);
            const reward = 20;

            html += `
                <tr>
                    <td>Ficando rico</td>
                    <td>Juntar <span class="ds-color-red">1.000.000</span> moedas de ouro</td>
                    <td>
                        <div class="ds-center">
                            ${reward}
                        </div>
                    </td>
                    <td>
                        ${progress}
                    </td>
                    <td>
                        <div class="ds-center">
                            ${icon}
                        </div>
                    </td>
                </tr>
             `;
        }
        return html;
    }

    drawProgress() {
        const value = 10;
        const valueMax = 100;
        const tooltip = Layout.buildTextCapacity(Translation.interfaceDefault?.status, value, valueMax);
        const html = `
            <c-progress 
                value="${value}" 
                value-max="${valueMax}" 
                theme="green" 
                direction="horizontal"
                data-tooltip="${tooltip}"
            >
            </c-progress>
        `;

        return html;
    }

    drawIcon(status) {
        const theme = status === 0 ? 'grey' : 'green';
        const props = {
            theme,
            size: 'big',
            icon: 'check'
        };
        const icon = Layout.drawIcon(props);

        return icon;
    }

    render() {
        const component = this.draw();

        Components.render(this.args, component);
    }
}

customElements.define('c-hud-page-achievements', HudPageAchievements);
class HudPageAttributes extends HTMLElement {
    args = {
        context: this,
        cssPrefix: 'hud-page-attributes'
    };
    pageId = 'attributes';
    attributes = [
        'vitality',
        'strength',
        'intelligence',
        'dexterity'
    ];

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.render();
        this.addEventListeners();
    }

    addEventListeners() {
        this.attributes.forEach((index) => {
            const id = Helper.buildId(`${this.pageId}_${index}`);
            const button = this.shadowRoot.getElementById(id);

            button.addEventListener('click', () => this.increase(index));
        });
    }

    draw() {
        const translationPage = Translation.getTranslationPage('attributes');
        const page = this.getAttribute('page');
        const subtitle1 = this.drawSubtitle(translationPage?.title);
        const subtitle2 = this.drawSubtitle(translationPage?.statistics);
        const attributes = Data.player.attributes;
        const statistics = Data.player.statistics;
        const hasButton = attributes.distribute > 0;
        const css = Layout.cssFormField;
        const buttonTheme = 'black';
        const buttonIcon = 'plus';
        const className = Rule.classes[attributes?.class].class;
        const translationClass = Translation.buildPlayerClass(className);
        const buildTooltip = (target) => `
            ${Translation?.gameTip?.[target]} 
            ${translationPage?.distribute}: 
            <span>${attributes?.distribute}</span>`
        ;
        const content = `
            <form class="ds-form ds-form--readonly">
                <div class="ds-row">
                    <c-form-field
                        class="${css}"
                        label="${translationPage?.name}"
                        input-value="${attributes?.name}"
                    >
                    </c-form-field>
                    <c-form-field
                        class="${css}"
                        label="${translationPage?.level}"
                        type="tel"
                        input-value="${attributes?.level}"
                    >
                    </c-form-field>
                    <c-form-field
                        class="${css}"
                        label="${translationPage?.class}"
                        input-value="${translationClass}"
                    >
                    </c-form-field>
                </div>
                <div class="ds-row">
                    <c-form-field
                        class="${css}"
                        label="${translationPage?.experience}"
                        type="tel"
                        input-value="${attributes?.experience}"
                    >
                    </c-form-field>
                    <c-form-field
                        class="${css}"
                        label="${translationPage?.experience_next}"
                        type="tel"
                        input-value="${attributes?.experienceNext}"
                    >
                    </c-form-field>
                </div>
                <div class="ds-row">
                    <c-form-field
                        class="${css}"
                        label="${translationPage?.attack}"
                        type="tel"
                        input-value="${attributes?.attack}"
                    >
                    </c-form-field>
                    <c-form-field
                        class="${css}"
                        label="${translationPage?.defense}"
                        type="tel"
                        input-value="${attributes?.defense}"
                    >
                    </c-form-field>
                    <c-form-field
                        class="${css}"
                        label="${translationPage?.initiative}"
                        type="tel"
                        input-value="${attributes?.initiative}"
                    >
                    </c-form-field>
                </div>
                ${subtitle1}
                <div class="ds-row">
                    <c-form-field
                        id="${Helper.buildId(`${this.pageId}_vitality`)}"
                        class="${css}"
                        label="${translationPage?.vitality}"
                        type="tel"
                        input-value="${attributes?.vitality}"
                        has-button="${hasButton}"´
                        button-data-tooltip="${buildTooltip('increase_vitality')}"
                        button-theme="${buttonTheme}"
                        icon="${buttonIcon}"
                    >
                    </c-form-field>
                    <c-form-field
                        id="${Helper.buildId(`${this.pageId}_strength`)}"
                        class="${css}"
                        label="${translationPage?.strength}"
                        type="tel"
                        input-value="${attributes?.strength}"
                        has-button="${hasButton}"
                        button-data-tooltip="${buildTooltip('increase_strength')}"
                        button-theme="${buttonTheme}"
                        icon="${buttonIcon}"
                    >
                    </c-form-field>
                </div>
                <div class="ds-row">
                    <c-form-field
                        id="${Helper.buildId(`${this.pageId}_intelligence`)}"
                        class="${css}"
                        label="${translationPage?.intelligence}"
                        type="tel"
                        input-value="${attributes?.intelligence}"
                        has-button="${hasButton}"
                        button-data-tooltip="${buildTooltip('increase_intelligence')}"
                        button-theme="${buttonTheme}"
                        icon="${buttonIcon}"
                    >
                    </c-form-field>
                    <c-form-field
                        id="${Helper.buildId(`${this.pageId}_dexterity`)}"
                        class="${css}"
                        label="${translationPage?.dexterity}"
                        type="tel"
                        input-value="${attributes?.dexterity}"
                        has-button="${hasButton}"
                        button-data-tooltip="${buildTooltip('increase_dexterity')}"
                        button-theme="${buttonTheme}"
                        icon="${buttonIcon}"
                    >
                    </c-form-field>
                </div>
                ${subtitle2}
                <div class="ds-row">
                    <c-form-field
                        class="${css}"
                        label="${translationPage?.statistics_death}"
                        type="tel"
                        input-value="${statistics.d}"
                    >
                    </c-form-field>
                    <c-form-field
                        class="${css}"
                        label="${translationPage?.statistics_enemy}"
                        type="tel"
                        input-value="${statistics.e}"
                    >
                    </c-form-field>
                    <c-form-field
                        class="${css}"
                        label="${translationPage?.statistics_coin}"
                        type="tel"
                        input-value="${statistics.l4}"
                    >
                    </c-form-field>
                </div>
            </form>
        `;
        const contentWrapper =  HudPage.drawContent(page, content);
        const html = `
            ${contentWrapper}
        `;

        return html;
    }

    drawSubtitle(text) {
        const html = `
            <div class="ds-row ds-center">
                <h2 class="ds-content__subtitle">${text}</h2>
            </div>
        `;

        return html;
    }

    increase(target) {
        console.log('increase() target', target);
    }

    render() {
        const component = this.draw();

        Components.render(this.args, component);
    }
}

customElements.define('c-hud-page-attributes', HudPageAttributes);
class HudPageBuy extends HTMLElement {
    args = {
        context: this,
        cssPrefix: 'hud-page-buy'
    };

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.render();
        Layout.addEventListeners(this, 'button');
    }

    draw() {
        const page = 'npc';
        const list = this.drawList();
        const content = `
            <div class="ds-row ds-card-wrapper">
                ${list}
            </div>
        `;
        const contentWrapper = HudPage.drawContent(page, content);
        const footerWrapper = HudPageDetail.drawMoney();
        const html = `
            ${contentWrapper}
            ${footerWrapper}
        `;

        return html;
    }

    drawList() {
        const length = 200;
        let html = '';

        for (let i = 0; i < length; i++) {
            const props = {
                theme: 'grey',
                size: 'extra-big',
                icon: 'profile'
            };
            const icon = Layout.drawIcon(props);

            html += `
                <button 
                    class="ds-card ds-card--small" 
                    type="button"
                    data-handler="handleOpenDetails"
                    data-handler-props='["${i}"]'
                    data-kind='button'
                >
                    <div class="ds-card__body">
                        ${icon}
                    </div>
                    <div class="ds-card__footer ds-right">
                        <div class="ds-truncate">
                            1000000000000000000000
                        </div>
                    </div>
                </button>
             `;
        }
        return html;
    }

    handleOpenDetails(target) {
        const args = {
            id: target,
            context: this
        };

        Hud.openPageDetail(args);
    }

    render() {
        const component = this.draw();

        Components.render(this.args, component);
    }
}

customElements.define('c-hud-page-buy', HudPageBuy);
class HudPageCraft extends HTMLElement {
    args = {
        context: this,
        cssPrefix: 'hud-page-craft'
    };

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.render();
        Layout.addEventListeners(this, 'button');
    }

    draw() {
        const page = 'npc';
        const list = this.drawList();
        const content = `
            <div class="ds-row ds-card-wrapper">
                ${list}
            </div>
        `;
        const contentWrapper = HudPage.drawContent(page, content);
        const html = `
            ${contentWrapper}
        `;

        return html;
    }

    drawList() {
        const length = 200;
        let html = '';

        for (let i = 0; i < length; i++) {
            const props = {
                theme: 'grey',
                size: 'extra-big',
                icon: 'profile'
            };
            const icon = Layout.drawIcon(props);

            html += `
                <button 
                    class="ds-card ds-card--small" 
                    type="button"
                    data-handler="handleOpenDetails"
                    data-handler-props='["${i}"]'
                    data-kind='button'
                >
                    <div class="ds-card__body">
                        ${icon}
                    </div>
                    <div class="ds-card__footer ds-right">
                        <div class="ds-truncate">
                            1000000000000000000000
                        </div>
                    </div>
                </button>
             `;
        }
        return html;
    }

    handleOpenDetails(target) {
        const args = {
            id: target,
            context: this
        };

        Hud.openPageDetail(args);
    }

    render() {
        const component = this.draw();

        Components.render(this.args, component);
    }
}

customElements.define('c-hud-page-craft', HudPageCraft);
class HudPageDetail extends HTMLElement {
    args = {
        context: this,
        cssPrefix: 'hud-page-detail'
    };

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.render();
        Layout.addEventListeners(this, 'c-button');
    }

    draw() {
        const footer = this.drawFooter();
        const page = this.getAttribute('page');
        const props = {
            theme: 'grey',
            size: 'extra-big',
            icon: 'profile'
        };
        const icon = Layout.drawIcon(props);
        const content = `
            <div class="ds-row">
                <div class="ds-column">
                    ${icon}
                </div>
                <div class="ds-column">
                    <form class="ds-form">
                        <div class="ds-row ds-form__field">
                            <label class="ds-form__label" for="id_number_blue">Peso</label>
                            <input class="ds-form__input" id="id_number_blue" type="text" value="0" aria-label="number" readonly="">
                        </div>
                        <div class="ds-row ds-form__field">
                            <label class="ds-form__label" for="id_required_blue">Quantidade</label>
                            <input class="ds-form__input" id="id_required_blue" type="text" value="1" required="" aria-label="text required">
                        </div>
                    </form>
                </div>
            </div>
        `;
        const contentWrapper = HudPage.drawContent(page, content);
        const footerWrapper = HudPage.drawFooter(footer);
        const html = `
            ${contentWrapper}
            ${footerWrapper}
        `;

        this.setTexts();
        return html;
    }

    static drawMoney() {
        const html = `
            <c-hud-content-money
                class="ds-display-contents"
            >
            </c-hud-content-money>
        `;

        return HudPage.drawFooter(html);
    }

    drawFooter() {
        const translation = Translation.interfaceDefault;
        const translationBack = translation?.back;
        const html = `
            <c-button 
                theme="grey" 
                size="small" 
                label="${translationBack}"
                data-handler="handleBack"
                data-kind='button'
            >
            </c-button>
        `;
        return html;
    }

    get lastPageData() {
        const el = this.parentNode.parentNode.parentNode;
        const dataPosition = el.getAttribute('data-position');
        const page = Hud.buildElHudPage(dataPosition);

        return page.lastPage;
    }

    handleBack() {
        const data = this.lastPageData;
        const { pagePosition, elPage, from, isNPC, name } = data;
        const args = {
            detail: {
                page: elPage,
                pageTarget: from,
                pagePosition,
                from,
                isNPC,
                name
            }
        };

        HTML.elHud.openPage(args);
    }

    render() {
        const component = this.draw();

        Components.render(this.args, component);
    }

    setTexts() {
        const data = this.lastPageData;
        const elPage = data.page;
        const transition = Translation.interfaceDefault;

        elPage.setTitle(transition.detail);
        elPage.setText(transition.detail_description);
    }
}

customElements.define('c-hud-page-detail', HudPageDetail);
class HudPageEquipments extends HTMLElement {
    args = {
        context: this,
        cssPrefix: 'hud-page-equipments'
    };
    itens = [
        'amulet',
        'armor',
        'backpack',
        'bracelet',
        'belt',
        'boot',
        'eye',
        'face',
        'glove',
        'hair',
        'helmet',
        'ring',
        'rune',
        'shield',
        'pants',
        'weapon'
    ];

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.render();
        Layout.addEventListeners(this, 'button');
    }

    draw() {
        const page = this.getAttribute('page');
        let content = `<div class="ds-page__equipment">`;
        this.itens.forEach((index, value) => {
            const props = {
                theme: 'grey',
                size: 'extra-big',
                icon: 'profile'
            };
            const icon = Layout.drawIcon(props);

            content += `
                <button 
                    class="ds-card ds-card--small ds-equipment__${index}" 
                    type="button" 
                    data-handler="handleOpenDetails"
                    data-handler-props='["${value}"]'
                >
                    <div class="ds-card__body">
                        ${icon}
                    </div>
                </button>
            `;
        });
        content += `</div>`;

        const contentWrapper = HudPage.drawContent(page, content);
        const html = `
            ${contentWrapper}
        `;

        return html;
    }

    handleOpenDetails(target) {
        const args = {
            id: target,
            context: this
        };

        Hud.openPageDetail(args);
    }

    render() {
        const component = this.draw();

        Components.render(this.args, component);
    }
}

customElements.define('c-hud-page-equipments', HudPageEquipments);
class HudPageInventory extends HTMLElement {
    args = {
        context: this,
        cssPrefix: 'hud-page-inventory'
    };

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.render();
        Layout.addEventListeners(this, 'button');
    }

    draw() {
        const buttons = [
            GameNPCs.buttons.filterAll,
            GameNPCs.buttons.filterResources,
            GameNPCs.buttons.filterMoney,
            GameNPCs.buttons.filterUsable,
        ];
        HTML.elHudPageRight.setMenu({ buttons });

        const list = this.drawList();
        const footer = this.drawFooter();
        const page = this.getAttribute('page');
        const content = `
            <div class="ds-row ds-card-wrapper">
                ${list}
            </div>
        `;
        const contentWrapper = HudPage.drawContent(page, content);
        const footerWrapper = HudPage.drawFooter(footer, false);
        const html = `
            ${contentWrapper}
            ${footerWrapper}
        `;

        return html;
    }

    drawList() {
        const length = 100;
        let html = '';

        for (let i = 0; i < length; i++) {
            const props = {
                theme: 'grey',
                size: 'extra-big',
                icon: 'profile'
            };
            const icon = Layout.drawIcon(props);

            html += `
                <button 
                    class="ds-card ds-card--small" 
                    type="button"
                    data-handler="handleOpenDetails"
                    data-handler-props='["${i}"]'
                    data-kind='button'
                >
                    <div class="ds-card__body">
                        ${icon}
                    </div>
                    <div class="ds-card__footer ds-right">
                        <div class="ds-truncate">
                            1000000000000000000000
                        </div>
                    </div>
                </button>
             `;
        }
        return html;
    }

    drawFooter() {
        const translation = Translation.interfaceDefault;
        const translationCapacity = translation?.capacity;
        const progress = this.drawProgress(translationCapacity);
        const html = `
            <span class="ds-label">${translationCapacity}:</span>
            ${progress}
        `;
        return html;
    }

    drawProgress(translationCapacity) {
        const value = 10;
        const valueMax = 100;
        const tooltip = Layout.buildTextCapacity(translationCapacity, value, valueMax);
        const html = `
            <c-progress 
                value="${value}" 
                value-max="${valueMax}" 
                theme="green" 
                direction="horizontal"
                data-tooltip="${tooltip}"
                class="ds-display-flex ds-progress"
            >
            </c-progress>
        `;

        return html;
    }

    handleFilter(target) {
        console.log('handleFilter() target', target);
    }

    handleOpenDetails(target) {
        const args = {
            id: target,
            context: this
        };

        Hud.openPageDetail(args);
    }

    render() {
        const component = this.draw();

        Components.render(this.args, component);
    }
}

customElements.define('c-hud-page-inventory', HudPageInventory);
class HudPageMap extends HTMLElement {
    args = {
        context: this,
        cssPrefix: 'hud-page-map'
    };

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.render();
    }

    draw() {
        const page = this.getAttribute('page');
        const list = this.drawList();
        const content = `
            <div class="ds-page__${page}">
                <div class="ds-map">
                    ${list}
                </div>
            </div>
        `;
        const contentWrapper = HudPage.drawContent(page, content);
        const html = `
            ${contentWrapper}
        `;

        return html;
    }

    drawList() {
        const length = 25;
        let html = '';

        for (let i = 0; i < length; i++) {
            html += `
                <div class="ds-tile ds-tile--disabled" id="mini_map_tile_${i}">
                    <div id="mini_map_tile_skin_${i}"></div>
                    <div id="mini_map_tile_door_top_${i}" class="ds-door-top"></div>
                    <div id="mini_map_tile_door_right_${i}" class="ds-door-right"></div>
                    <div id="mini_map_tile_door_bottom_${i}" class="ds-door-bottom"></div>
                    <div id="mini_map_tile_door_left_${i}" class="ds-door-left"></div>
                </div>
             `;
        }
        return html;
    }

    render() {
        const component = this.draw();

        Components.render(this.args, component);
    }
}

customElements.define('c-hud-page-map', HudPageMap);
class HudPageNPCFresale extends HTMLElement {
    args = {
        context: this,
        cssPrefix: 'hud-page-npc-fresale'
    };
    pageId = 'npc-fresale';

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.render();
    }

    draw() {
        const buttons = [
            GameNPCs.buttons.buy,
            GameNPCs.buttons.sell,
            GameNPCs.buttons.craft,
            GameNPCs.buttons.quest,
        ];

        HTML.elHudPageLeft.setMenu({ buttons });
        return '';
    }

    render() {
        const component = this.draw();

        Components.render(this.args, component);
    }
}

customElements.define('c-hud-page-npc-fresale', HudPageNPCFresale);
class HudPageQuest extends HTMLElement {
    args = {
        context: this,
        cssPrefix: 'hud-page-quest'
    };

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.render();
    }

    draw() {
        const page = 'npc';
        const content = `
            HudPageQuest
        `;
        const contentWrapper = HudPage.drawContent(page, content);
        const html = `
            ${contentWrapper}
        `;

        return html;
    }

    render() {
        const component = this.draw();

        Components.render(this.args, component);
    }
}

customElements.define('c-hud-page-quest', HudPageQuest);
class HudPageQuests extends HTMLElement {
    args = {
        context: this,
        cssPrefix: 'hud-page-quests'
    };

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.render();
    }

    draw() {
        const translation = Translation.interfaceDefault;
        const page = this.getAttribute('page');
        const list = this.drawList();
        const content = `
            <table class="ds-table ds-table--effect">
                <thead>
                    <tr>
                        <th>${translation?.quest}</th>
                        <th>${translation?.description}</th>
                        <th>${translation?.status}</th>
                    </tr>
                </thead>
                <tbody>
                    ${list}
                </tbody>
            </table>
        `;
        const contentWrapper = HudPage.drawContent(page, content);
        const html = `
            ${contentWrapper}
        `;

        return html;
    }

    drawList() {
        const length = 100;
        let html = '';

        for (let i = 0; i < length; i++) {
            const status = Helper.getRandomBetween(0, 1);
            const icon = this.drawIcon(status);

            html += `
                <tr>
                    <td>Ingredientes para poções</td>
                    <td>Preciso de alguns ingredientes para voltar a fazer minhas poções. Podes me ajudar a
                        conseguir?
                    </td>
                    <td>
                        <div class="ds-center">
                            ${icon}
                        </div>
                    </td>
                </tr>
             `;
        }
        return html;
    }

    drawIcon(status) {
        const theme = status === 0 ? 'grey' : 'green';
        const props = {
            theme,
            size: 'big',
            icon: 'check'
        };
        const icon = Layout.drawIcon(props);

        return icon;
    }

    render() {
        const component = this.draw();

        Components.render(this.args, component);
    }
}

customElements.define('c-hud-page-quests', HudPageQuests);
class HudPageSelectCharacter extends HTMLElement {
    idPlayer = 'player'
    idCharacterNew = 'character_new'
    idCharacterPlay = 'character_play'
    args = {
        context: this,
        cssPrefix: 'hud-page-select-character'
    };

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.render();
        this.addEventListeners();
    }

    addEventListeners() {
        const elCharacterNew = this.shadowRoot.querySelectorAll(`[data-id="${this.idCharacterNew}"]`);
        elCharacterNew.forEach((index) => {
            index.addEventListener('click', () => this.addNewCharacter());
        });

        const elCharacterPlay = this.shadowRoot.querySelectorAll(`[data-id="${this.idCharacterPlay}"]`);
        elCharacterPlay.forEach((index) => {
            index.addEventListener('click', () => Management.play(index));
        });
    }

    addNewCharacter() {
        HTML.elHud.openModalSelectClass();
    }

    draw() {
        const list = this.drawList();
        const html = `${list}`;

        return html;
    }

    drawList() {
        const lengthCharacters = Object.entries(Data.login.characters).length;
        const lengthSlots = Data.login.slots - lengthCharacters;
        let html = this.drawListCharacters();
        html += this.drawListEmptySlots(lengthSlots);
        const content = Modal.drawContent(html);

        return content;
    }

    drawListCharacters() {
        const characters = Object.entries(Data.login.characters);
        let html = '';

        characters.forEach((character) => {
            const index = character[0];
            const value = character[1];
            const coreCharacter = Rule.classes[value.class];
            const characterClass = coreCharacter.class;
            const characterAttribute = coreCharacter.attribute;
            const translationClass = Translation.buildPlayerClass(characterClass);
            const translationAttribute = Translation.gamePlayer[characterAttribute];
            const translationClassText = Translation.buildPlayerClassDescription(characterClass);
            const translationAttributePrimary = Translation.gamePlayer.primary_attribute;

            html += `
                <button 
                    type="button" 
                    class="ds-row ds-card--horizontal" 
                    data-id="${this.idCharacterPlay}"
                    id="${this.idPlayer}_${index}"
                >
                    <div class="ds-column ds-image">
                        <c-game-entity 
                            class="gm-alive gm-person ds-display-contents"
                            entity="person"
                            direction="down"
                            action="walk"
                        >
                        </c-game-entity>
                    </div>
                    <div class="ds-column ds-text">
                        <span>${translationClass}</span>
                        <small>
                            ${translationClassText}
                        </small>
                        <small>
                            ${translationAttributePrimary}:
                            <strong>${translationAttribute}</strong>
                        </small>
                    </div>
                </button>
             `;
        });
        return html;
    }

    drawListEmptySlots(length) {
        const translation = Translation.interfaceDefault?.create_new_character;
        const button = `
            <c-button 
                theme="green" 
                size="small" 
                label="${translation}"
                data-id="${this.idCharacterNew}"
            >
            </c-button>
        `;
        let html = '';

        for (let i = 0; i < length; i++) {
            html += `
                <div 
                    class="ds-row ds-card--horizontal" 
                    id="${this.idPlayer}_${i}"
                >
                    <div class="ds-column ds-center">
                        ${button}
                    </div>
                </div>
             `;
        }
        return html;
    }

    render() {
        const component = this.draw();

        Components.render(this.args, component);
    }
}

customElements.define('c-hud-page-select-character', HudPageSelectCharacter);
class HudPageSelectClass extends HTMLElement {
    idPlayer = 'player'
    args = {
        context: this,
        cssPrefix: 'hud-page-select-class'
    };

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.render();
        this.addEventListeners();
    }

    addEventListeners() {
        const el = this.shadowRoot.querySelectorAll('button');

        el.forEach((index) => {
            index.addEventListener('click', () => this.handleCustomize(index));
        });
    }

    draw() {
        const list = this.drawList();
        const html = `${list}`;

        return html;
    }

    drawList() {
        const characterlist = this.drawListCharacters();
        const content = Modal.drawContent(characterlist);
        const drawFooter = this.drawFooter();
        const footer = Modal.drawFooter(drawFooter);
        let html = `
            ${content}
            ${footer}
        `;

        return html;
    }

    drawListCharacters() {
        const characters = Object.entries(Rule.classes);
        let html = '';

        characters.forEach((character) => {        
            const index = character[0];
            const value = character[1];
            const characterClass = value.class;
            const characterAttribute = value.attribute;
            const translationClass = Translation.buildPlayerClass(characterClass);
            const translationAttribute = Translation.gamePlayer[characterAttribute];
            const translationClassText = Translation.buildPlayerClassDescription(characterClass);
            const translationAttributePrimary = Translation.gamePlayer.primary_attribute;

            html += `
                <button 
                    type="button" 
                    class="ds-row ds-card--horizontal" 
                    id="${this.idPlayer}_${index}"
                >
                    <div class="ds-column ds-image">
                        <c-game-entity 
                            class="gm-alive gm-person ds-display-contents"
                            entity="person"
                            direction="down"
                            action="walk"
                        >
                        </c-game-entity>
                    </div>
                    <div class="ds-column ds-text">
                        <span>${translationClass}</span>
                        <small>
                            ${translationClassText}
                        </small>
                        <small>
                            ${translationAttributePrimary}:
                            <strong>${translationAttribute}</strong>
                        </small>
                    </div>
                </button>
             `;
        });
        return html;
    }

    drawFooter() {
        const translation = Translation.interfaceDefault;
        const translationBack = translation?.back;
        const html = `
            <c-button 
                theme="grey" 
                size="small" 
                onclick="HTML.elHud.openModalSelectCharacter()"
                label="${translationBack}"
            >
            </c-button>
        `;
        return html;
    }

    handleCustomize(index) {
        HTML.elHud.openPageCustomize(index);
    }

    render() {
        const component = this.draw();

        Components.render(this.args, component);
    }
}

customElements.define('c-hud-page-select-class', HudPageSelectClass);
class HudPageSelectCustomization extends HTMLElement {
    idPlayer = 'player'
    idChangeDirection = 'change_direction'
    idCharacterPlay = 'character_play'
    args = {
        context: this,
        cssPrefix: 'hud-page-select-character'
    };

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.render();
        this.addEventListeners();
        this.setFocus();
    }

    addEventListeners() {
        const elCharacterNew = this.shadowRoot.querySelectorAll(`[data-id="${this.idChangeDirection}"]`);
        elCharacterNew.forEach((index) => {
            const target = index.getAttribute('data-direction');

            index.addEventListener('click', () => this.handleChangeDirection(target));
        });

        const elCharacterPlay = this.shadowRoot.querySelectorAll(`[data-id="${this.idCharacterPlay}"]`);
        elCharacterPlay.forEach((index) => {
            index.addEventListener('click', () => Management.play(index));
        });
    }

    addNewCharacter() {
        HTML.elHud.openModalSelectClass();
    }

    draw() {
        const list = this.drawList();
        const html = `${list}`;

        return html;
    }

    drawList() {
        const content = this.drawContent();
        const footer = this.drawMenu();
        const html = `
            ${Modal.drawContent(content)}
            ${Modal.drawFooter(footer)}
        `;

        return html;
    }

    drawContent() {
        const menu1 = this.drawMenuDirection(['top', 'bottom']);
        const menu2 = this.drawMenuDirection(['left', 'right']);
        const css = Layout.cssFormField;
        const translationPage = Translation.getTranslationPage('attributes');
        const translationEquipment = Translation.gameEquipment;
        const translationPlayer = Translation.gamePlayer;
        const customizations = Data.login.customizations;
        const buildValue = (target) => JSON.stringify(target);
        const styleClothes = buildValue({
            label: customizations.style.clothes,
            value: customizations.style.clothes,
        });
        const styleHair = buildValue({
            label: customizations.style.hair,
            value: customizations.style.hair,
        });
        const colorSkin = buildValue({
            label: customizations.color.skin,
            value: customizations.color.skin,
        });
        const colorHair = buildValue({
            label: customizations.color.hair,
            value: customizations.color.hair,
        });
        const colorEye = buildValue({
            label: customizations.color.eye,
            value: customizations.color.eye,
        });
        const html = `
            <div class="ds-row ds-page__character-customizarion">
                <div class="ds-column ds-column--1 ds-card-wrapper ds-center">
                    ${menu1}
                    <div class="ds-card ds-card--big ds-card--player">
                        <div class="ds-card__body">
                            <c-game-entity 
                                class="gm-alive gm-person ds-display-contents"
                                entity="person"
                                direction="down"
                                action="walk"
                            >
                            </c-game-entity>
                        </div>
                    </div>
                    ${menu2}
                </div>
                <div class="ds-column ds-column--2">
                    <form class="ds-form form--readonly">
                        <div class="ds-row">
                            <c-form-field
                                class="${css}"
                                label="${translationPage?.name}"
                                input-value=""
                            >
                            </c-form-field>
                        </div>
                        <div class="ds-row">
                            <c-form-select
                                class="${css}"
                                label="${translationEquipment?.clothes}"
                                options=${styleClothes}
                            >
                            </c-form-select>
                            <c-form-select
                                class="${css}"
                                label="${translationEquipment?.hair}"
                                options=${styleHair}
                            >
                            </c-form-select>
                        </div>
                        <div class="ds-row">
                            <c-form-select
                                class="${css}"
                                label="${translationPlayer?.color_eye}"
                                options=${colorEye}
                            >
                            </c-form-select>
                            <c-form-select
                                class="${css}"
                                label="${translationPlayer?.color_hair}"
                                options=${colorHair}
                            >
                            </c-form-select>
                            <c-form-select
                                class="${css}"
                                label="${translationPlayer?.color_skin}"
                                options=${colorSkin}
                            >
                            </c-form-select>
                        </div>
                    </form>
                </div>
            </div>
        `;
        return html;
    }

    drawMenu() {
        const translationBack = Translation.interfaceDefault?.back;
        const translationPlay = Translation.interfaceDefault?.play;
        const html = `
            <c-button 
                theme="grey" 
                size="small" 
                onclick="HTML.elHud.openModalSelectClass()"
                label="${translationBack}"
            >
            </c-button>
            <c-button 
                theme="green" 
                size="small" 
                label="${translationPlay}"
                data-id="${this.idCharacterPlay}"
            >
            </c-button>
        `;

        return html;
    }

    drawMenuDirection(menu) {
        let html = '<div class="ds-button-wrapper ds-row">';

        menu.forEach((index) => {
            html += `
                <c-button 
                    theme="black" 
                    size="small" 
                    data-direction="${index}"
                    data-id="${this.idChangeDirection}"
                    icon="arrow_${index}" 
                    icon-size="regular"
                >
                </c-button>
            `;
        });
        html += '</div>';
        return html;
    }

    handleChangeDirection(direction) {
        const elPerson = this.shadowRoot.querySelector('c-game-entity');

        elPerson.setAttribute('direction', direction);
    }

    render() {
        const component = this.draw();

        Components.render(this.args, component);
    }

    setFocus() {
        const elFormField = this.shadowRoot.querySelector('c-form-field');
        const el = elFormField.shadowRoot.querySelector('input');

        el.focus();
    }
}

customElements.define('c-hud-page-select-customization', HudPageSelectCustomization);
class HudPageSell extends HTMLElement {
    args = {
        context: this,
        cssPrefix: 'hud-page-sell'
    };

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.render();
        Layout.addEventListeners(this, 'button');
    }

    draw() {
        const page = 'npc';
        const list = this.drawList();
        const content = `
            <div class="ds-row ds-card-wrapper">
                ${list}
            </div>
        `;
        const contentWrapper = HudPage.drawContent(page, content);
        const footerWrapper = HudPageDetail.drawMoney();
        const html = `
            ${contentWrapper}
            ${footerWrapper}
        `;

        return html;
    }

    drawList() {
        const length = 200;
        let html = '';

        for (let i = 0; i < length; i++) {
            const props = {
                theme: 'grey',
                size: 'extra-big',
                icon: 'profile'
            };
            const icon = Layout.drawIcon(props);

            html += `
                <button 
                    type="button"
                    class="ds-card ds-card--small" 
                    data-handler="handleOpenDetails"
                    data-handler-props='["${i}"]'
                    data-kind='button'
                >
                    <div class="ds-card__body">
                        ${icon}
                    </div>
                    <div class="ds-card__footer ds-right">
                        <div class="ds-truncate">
                            1000000000000000000000
                        </div>
                    </div>
                </button>
             `;
        }
        return html;
    }

    handleOpenDetails(target) {
        const args = {
            id: target,
            context: this
        };

        Hud.openPageDetail(args);
    }

    render() {
        const component = this.draw();

        Components.render(this.args, component);
    }
}

customElements.define('c-hud-page-sell', HudPageSell);
class HudPageSettings extends HTMLElement {
    args = {
        context: this,
        cssPrefix: 'hud-page-settings'
    };

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.render();
        Layout.addEventListeners(this, 'c-button');
    }

    draw() {
        const footer = this.drawFooter();
        const page = this.getAttribute('page');
        const sound = this.drawSound();
        const translation = Translation.interface?.default;
        const content = `
            <table class="ds-table">
                <thead>
                    <tr>
                        <th>${translation?.detail}</th>
                        <th>${translation?.status}</th>
                        <th>${translation?.menu}</th>
                    </tr>
                </thead>
                <tbody>
                    ${sound}
                </tbody>
            </table>
        `;
        const contentWrapper = HudPage.drawContent(page, content);
        const footerWrapper = HudPage.drawFooter(footer);
        const html = `
            ${contentWrapper}
            ${footerWrapper}
        `;

        return html;
    }

    drawSound() {
        const items = [
            { id: 'music', translation: 'Musica' },
            { id: 'sound_effects', translation: 'Efeitos sonoros' },
        ];
        let html = '';

        items.forEach((item) => {
            const translation = item?.translation;
            const translationDefault = Translation.interface?.default;
            const progress = this.drawProgress();
            const status = Helper.getRandomBetween(0, 1);
            const button = this.drawButton(status, translationDefault, item);

            html += `
                <tr>
                    <td>${translation}</td>
                    <td>
                        ${progress}
                    </td>
                    <td>
                        <div class="ds-content__menu ds-right">
                            <c-button 
                                icon="plus" 
                                icon-size="extra-small"
                                theme="black" 
                                size="regular" 
                                data-tooltip="${translationDefault?.increase}"
                                is-proportional="true"
                                data-handler="handleIncrease"
                                data-handler-props='["${item.id}"]'
                            >
                            </c-button>
                            <c-button 
                                icon="less" 
                                icon-size="extra-small"
                                theme="black" 
                                size="regular" 
                                data-tooltip="${translationDefault?.decrease}"
                                is-proportional="true"
                                data-handler="handleDecrease"
                                data-handler-props='["${item.id}"]'
                            >
                            </c-button>
                            ${button}
                        </div>
                    </td>
                </tr>
            `;
        });
        return html;
    }

    drawButton(status, translationDefault, target) {
        const isPlay = status === 0;
        const icon = isPlay ? 'play' : 'pause';
        const translation = isPlay ? translationDefault?.play_music : translationDefault?.pause;
        const handler = isPlay ? 'handlePlay' : 'handlePause';
        const html = `
            <c-button 
                icon="${icon}" 
                icon-size="extra-small"
                theme="purple" 
                size="regular" 
                data-tooltip="${translation}"
                is-proportional="true"
                data-handler="${handler}"
                data-handler-props='["${target.id}"]'
            >
            </c-button>
        `;

        return html;
    }

    drawFooter() {
        const translation = Translation.interface?.page_setting;
        const html = `
            <c-button 
                theme="black" 
                size="small" 
                label="${translation?.change_character}"
                data-handler='handleSelectCharacter'
            >
            </c-button>
            <c-button
                theme="red" 
                size="small" 
                label="${translation?.logout}"
                data-handler='handleLogOut'
            >
            </c-button>
        `;

        return html;
    }

    drawProgress() {
        const value = Data.player.attributes.hitPoint;
        const valueMax = Data.player.attributes.hitPointMaximum;
        const tooltip = Layout.buildTextCapacity(Translation.interfaceDefault?.status, value, valueMax);
        const html = `
            <c-progress 
                value="${value}" 
                value-max="${valueMax}" 
                theme="green" 
                direction="horizontal"
                data-tooltip="${tooltip}"
            >
            </c-progress>
        `;

        return html;
    }

    handleDecrease(target) {
        console.log('HudPageSettings handleDecrease() target', target);
    }

    handleIncrease(target) {
        console.log('HudPageSettings handleIncrease() target', target);
    }

    handleLogOut() {
        console.log('HudPageSettings logOut()');
    }

    handlePlay(target) {
        console.log('HudPageSettings handlePlay() target', target);
    }

    handlePause(target) {
        console.log('HudPageSettings handlePause() target', target);
    }

    handleSelectCharacter() {
        HTML.elHud.openModalSelectCharacter();
    }

    render() {
        const component = this.draw();

        Components.render(this.args, component);
    }
}

customElements.define('c-hud-page-settings', HudPageSettings);
class HudStatus extends HTMLElement {
    args = {
        context: this,
        cssPrefix: 'hud-status'
    };
    data = {
        hitPoint: 0,
        hitPointMaximum: 0,
        manaPoint: 0,
        manaPointMaximum: 0,
        experience: 0,
        experienceNext: 0,
    };
    progress;

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.rebuildData();
        this.render();
    }

    draw() {
        let html = '';
        this.progress.forEach((index) => {
            html += `
                <c-progress 
                    id="${index.id}"
                    value="${index.value}" 
                    value-max="${index.valueMax}" 
                    theme="${index.theme}" 
                    direction="horizontal"
                    data-tooltip="${index.tooltip}"
                >
                </c-progress>
            `;
        });
        return html;
    }

    redraw() {
        this.rebuildData();
        this.translate();
        this.render();
    }

    render() {
        const component = this.draw();

        Components.render(this.args, component);
    }

    rebuildData() {
        this.progress = [
            {
                id: HTML.idHudProgressLife,
                theme: 'red',
                value: this.data.hitPoint,
                valueMax: this.data.hitPointMaximum,
                tooltip: '',
                translation: 'life'
            },
            {
                id: HTML.idHudProgressMana,
                theme: 'blue',
                value: this.data.manaPoint,
                valueMax: this.data.manaPointMaximum,
                tooltip: '',
                translation: 'mana'
            },
            {
                id: HTML.idHudProgressExperience,
                theme: 'yellow',
                value: this.data.experience,
                valueMax: this.data.experienceNext,
                tooltip: '',
                translation: 'experience'
            },
        ];
    }

    translate() {
        this.progress.forEach((index) => {
            const text = Translation.gameGeneric?.[index.translation];
            const value = index.value;
            const valueMax = index.valueMax;

            index.tooltip = Layout.buildTextCapacity(text, value, valueMax);
        });
    }
}

customElements.define('c-hud-status', HudStatus);
class Modal extends HTMLElement {
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

    static get observedAttributes() {
        return ['is-open', 'is-close-button'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue === newValue) return;
        this.render();
    }

    draw() {
        const isOpen = this.getAttribute('is-open');
        if (isOpen === 'true') this.isOpen = true;
        if (isOpen === 'false' || !isOpen) this.isOpen = false;
        if (!this.isOpen) return '';
        const buttonClose = this.drawCloseButton();
        const page = this.getAttribute('page');
        const title = this.getAttribute('page-title');
        const size = this.getAttribute('size');
        const description = this.drawDescription();
        const ribbon = Layout.drawRibbon(title);
        const pageComponent = this.drawPage(page);
        let html = `
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
        return html;
    }

    drawCloseButton() {
        const isCloseButton = this.getAttribute('is-close-button');
        if (isCloseButton === 'true') this.isCloseButton = true;
        if (isCloseButton === 'false' || !isCloseButton) this.isCloseButton = false;
        if (!this.isCloseButton) return '';
        const buttonClose = Layout.drawButtonClose({
            position: null,
            click: 'close-modal',
        });
        let html = `
            <div class="ds-content__close">
                ${buttonClose}
            </div> 
        `;
        return html;
    }

    drawDescription() {
        const description = this.getAttribute('page-description');
        if (!description) return '';

        const html = `
            <div class="ds-row ds-page__text">
                <p>${description}</p>
            </div>
        `;
        return html;
    }

    drawPage(page) {
        const html = `
            <c-hud-page-${page}
                class="ds-display-contents"
                page="${page}"
            >
            </c-hud-page-${page}>
        `;
        return html;
    }

    static drawContent(content) {
        let html = '';

        html += `
            <div class="ds-modal__content ds-scrollbar">
                <div class="ds-row">
                    <div class="ds-page__content ds-scrollbar">
                        ${content}
                    </div>
                </div>
            </div>
        `;
        return html;
    }

    static drawFooter(content) {
        let html = '';

        html += `
            <div class="ds-page__footer">
                <div class="ds-row ds-page__menu">
                    <div class="ds-button-wrapper ds-row ds-right">
                        ${content}
                    </div>
                </div>
            </div>
        `;
        return html;
    }

    render() {
        const component = this.draw();

        Components.render(this.args, component);
    }
}

customElements.define('c-modal', Modal);
class Progress extends HTMLElement {
    args = {
        context: this,
        cssPrefix: 'hud-progress'
    };

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.render();
        HTML?.elTooltipWrapper?.build(this.args);
    }

    calculateValue() {
        const value = Number(this.getAttribute('value'));
        const valueMax = Number(this.getAttribute('value-max'));
        const calc = (value / valueMax) * 100;

        return calc;
    }

    draw() {
        const theme = this.getAttribute('theme');
        const value = this.calculateValue();
        const html = `
            <div class="ds-progress ds-progress--${theme}">
                <div class="ds-progress__bar" style="width: ${value}%"></div>
            </div>
        `;

        return html;
    }

    render() {
        const component = this.draw();

        Components.render(this.args, component);
    }
}

customElements.define('c-progress', Progress);
class Tooltip extends HTMLElement {
    args = {
        context: this,
        cssPrefix: 'tooltip'
    };

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.render();
    }

    static get observedAttributes() {
        return ['value', 'position-left', 'position-top'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue === newValue) return;
        this.render();
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

    clear() {
        HTML?.elTooltipWrapper?.setAttribute('value', '');
    }

    draw() {
        const value = this.getAttribute('value');
        const left = this.getAttribute('position-left');
        const top = this.getAttribute('position-top');
        const opacity = value ? 1 : 0;
        const style = `top:${top}px; left:${left}px; opacity:${opacity};`;

        const html = `
            <div class="ds-animation--up-down-2 ds-tooltip" style="${style}" id="${HTML.idTooltip}">
                <p>${value}</p>
                <div class="ds-tooltip__arrow" id="${HTML.idTooltipArrow}">
                </div>
            </div>
        `;
        return html;
    }

    async handleMouseOver(props) {
        const elTtooltipWrapper = HTML.elTooltipWrapper;
        const tooltipText = props.tooltip;

        elTtooltipWrapper.setAttribute('value', tooltipText);
        this.setPosition(props);
    }

    handleMouseOut() {
        this.clear();
    }

    render() {
        const component = this.draw();

        Components.render(this.args, component);
    }

    setPosition(props) {
        const elTooltipWrapper = HTML.elTooltipWrapper;
        const tooltipElement = elTooltipWrapper.shadowRoot.getElementById(HTML.idTooltip);
        const tooltipRect = tooltipElement.getBoundingClientRect();
        const elTooltipArrow = elTooltipWrapper.shadowRoot.getElementById(HTML.idTooltipArrow);
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

customElements.define('c-tooltip', Tooltip);
class Transition extends HTMLElement {
    args = {
        context: this,
        cssPrefix: 'transition'
    };
    idMain = 'main';
    idContent = 'content';
    isInitial = true;
    timeout = 500;

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.updateAttributes();
        this.render();
        this.updateHTML();
    }

    static get observedAttributes() {
        return ['is-open', 'kind'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue === newValue) return;
        this.updateAttributes();
        this.redraw();
    }

    buildTip() {
        const tip = {
            title: 'title',
            subtitle: 'subtitle',
        };

        return tip;
    }

    close() {
        this.isOpen = false;
        Helper.removeClass(this.elMain, Layout.cssAnimationFadeIn);
        Helper.addClass(this.elMain, Layout.cssAnimationFadeOut);

        setTimeout(() => {
            this.setContent('');
        }, 0);
    }

    draw() {
        if (!this.isOpen) return '';
        const html = `
            <div class="ds-page__transition" id="${this.idMain}">
                <div class="ds-page__transition-content" id="${this.idContent}">
                </div>
            </div>
        `;
        return html;
    }

    drawBattle() {
        const translation = Translation.gameBattle;
        const subtitle = this.drawSubtitle(translation.battle_prepare);
        const title = this.drawTitle(translation.battle);
        const html = `${subtitle} ${title}`;

        return html;
    }

    drawBattleLost() {
        const html = `
            drawBattleLost
        `;
        return html;
    }

    drawBattleWon() {
        const html = `
            drawBattleWon
        `;
        return html;
    }

    drawLoading() {
        const loading = Layout.drawLoading({ theme: 'grey', size: 'small' });
        const textEn = 'Loa<span>ding</span>';
        const textPt = 'Carre<span>gan</span>do';
        const text = globalLanguage === 'pt' ? textPt : textEn;
        const title = this.drawTitle(text);
        const html = `${title} ${loading}`;

        return html;
    }

    drawLogo() {
        const html = `
            <div class="ds-page__transition-logo">
                <img src="${fileLogo}">
            </div>
        `;
        return html;
    }

    drawSubtitle(target) {
        const html = `
            <h2 class="ds-page__transition-text ${Layout.cssAnimationFromRight}">
                ${target}
            </h2>
        `;
        return html;
    }

    drawTip() {
        const tip = this.buildTip();
        const subtitle = this.drawSubtitle(tip.subtitle);
        const title = this.drawTitle(tip.title);
        const html = `${subtitle} ${title}`;

        return html;
    }

    drawTitle(target) {
        const html = `
            <h1 class="ds-page__transition-title ${Layout.cssAnimationFromLeft}">
                ${target}
            </h1>
        `;
        return html;
    }

    init() {
        this.isInitial = true;
    }

    open() {
        this.isOpen = true;

        if (!this.isInitial) {
            Helper.removeClass(this.elMain, Layout.cssAnimationFadeOut);
            Helper.addClass(this.elMain, Layout.cssAnimationFadeIn);
        }
    }

    redraw() {
        let content = '';

        switch (this.kind) {
            case 'battle':
                content = this.drawBattle();
                break;
            case 'won':
                content = this.drawBattleWon();
                break;
            case 'lost':
                content = this.drawBattleLost();
                break;
            case 'loading':
                content = this.drawLoading();
                break;
            case 'initial':
                this.isInitial = true;
                content = this.drawLoading();
                break;
            case 'tip':
            default:
                content = this.drawTip();
                break;
        };
        this.setContent(content);
    }

    render() {
        const component = this.draw();

        Components.render(this.args, component);
    }

    setContent(content) {
        this.elContent.innerHTML = content;
    }

    updateAttributes() {
        const isOpen = this.getAttribute('is-open');

        if (isOpen === 'true') this.open();
        if (isOpen === 'false' || !isOpen) this.close();

        const kind = this.getAttribute('kind');
        this.kind = kind;
    }

    updateHTML() {
        this.elMain = this.shadowRoot.getElementById(this.idMain);
        this.elContent = this.shadowRoot.getElementById(this.idContent);
    }
}

customElements.define('c-transition', Transition);