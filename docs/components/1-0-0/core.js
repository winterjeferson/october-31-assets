class Animation {
    static animatePosition(props) {
        const { target, vertical, horizontal, speed, easing = 'linear' } = props;
        if (isNaN(vertical) || isNaN(horizontal)) return;

        return new Promise((resolve) => {
            const speedPlayer = Data.player.attributes.speed;
            const currentValue = Helper.getTranslateValue(target);
            const currentVertical = Math.floor(currentValue.y);
            const currentHorizontal = Math.floor(currentValue.x);

            const newVertical = vertical === false ? currentVertical : Math.floor(vertical);
            const newHorizontal = horizontal === false ? currentHorizontal : Math.floor(horizontal);
            const duration = speed !== undefined ? speed : speedPlayer;

            const transform = [
                { transform: `translate(${currentHorizontal}px, ${currentVertical}px)` },
                { transform: `translate(${newHorizontal}px, ${newVertical}px)` }
            ];

            const transformSettings = {
                duration,
                iterations: 1,
                easing,
                fill: 'both'
            };

            const animation = target.animate(transform, transformSettings);

            animation.onfinish = (e) => resolve(e);
        });
    }
}
class Camera {
    static limit = {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
    };
    static player = {
        top: 0,
        left: 0,
    };

    static center(speed = false) {
        this.update();

        const speedPlayer = Data.player.attributes.speed;
        const vertical = this.centerVertical();
        const horizontal = this.centerHorizontal();
        const newSpeed = speed !== false ? speed : speedPlayer;

        const args = {
            target: HTML.elGameMap,
            vertical: vertical,
            horizontal: horizontal,
            easing: 'linear',
            speed: newSpeed
        };

        Animation.animatePosition(args);
    }

    static centerVertical() {
        const gameSize = Layout.game.height / 2;
        const player = this.player.top;
        const tile = Layout.tileSizeHalf;

        return gameSize - player - tile;
    }

    static centerHorizontal() {
        const gameSize = Layout.game.width / 2;
        const player = this.player.left;
        const tile = Layout.tileSizeHalf;

        return gameSize - player - tile;
    }

    static update() {
        Layout.resize();
        const positionPlayer = HTML?.elGameMap?.getPosition(HTML.elGamePlayer);

        if (positionPlayer) {
            this.player.top = positionPlayer.top;
            this.player.left = positionPlayer.left;
        }
    }
}
class Data {
    static login = {
        slots: 3,
        characters: new Proxy(
            {
            },
            {
                set(target, property, value) {
                    target[property] = value;
                    Data.updateLogin(property, value);
                    return true;
                }
            }
        ),
        customizations: new Proxy(
            {
            },
            {
                set(target, property, value) {
                    target[property] = value;
                    Data.updateLogin(property, value);
                    return true;
                }
            }
        ),
    };
    static player = {
        attributes: new Proxy(
            {
            },
            {
                set(target, property, value) {
                    target[property] = value;
                    Data.updatePlayerAttributes(property, value);
                    return true;
                }
            }
        ),
        statistics: new Proxy(
            {
                e3: 0,
                d: 0,
                e2: 0,
                l4: 0,
                e1: 0,
                e4: 0,
                e: 0,
                e0: 0
            },
            {
                set(target, property, value) {
                    target[property] = value;
                    Data.updatePlayerStatistics();
                    return true;
                }
            }
        )
    };
    static map = new Proxy(
        {
            data: {
                tiles: [],
                monsters: [],
                npcs: [],
                player: []
            }
        },
        {
            set(target, property, value) {
                target[property] = value;
                Data.updateMap();
                return true;
            }
        }
    )

    static fetchMap(target) {
        if (target === 1) this.fetchMap1();
        if (target === 2) this.fetchMap2();
    }

    static fetchMap1() {
        const data = {
            collectibles: [],
            tiles: [],
            monsters: [],
            player: []
        };
        data.tiles = [
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 22, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 41, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 22, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 41, 0, 0, 0, 0, 0, 0, 22, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 41, 41, 0, 0, 0, 41, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 41, 0, 0, 0, 0, 0, 0, 0, 0, 0, 41, 0, 22, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 22, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 22, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 22, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        ];
        data.monsters = [
            {
                id: 1,
                level: [1, 2, 3],
                quantity: 10
            },
            {
                id: 2,
                level: [4, 5, 6],
                quantity: 50
            },
        ];
        data.npcs = [
            {
                id: 1,
                position: [1, 2],
                name: 'fresale'
            },
            {
                id: 2,
                position: [10, 20],
                name: 'cubris'
            },
        ];
        data.collectibles = [
            {
                id: 1,
                quantity: 10
            },
            {
                id: 2,
                quantity: 10
            },
        ];
        data.player = {
            position: [6, 4]
        };
        this.map.data = data;
    }

    static fetchMap2() {
        const data = {
            collectibles: [],
            tiles: [],
            monsters: [],
            player: []
        };
        data.tiles = [
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 0, 0, 41, 0, 0, 0, 0, 0, 1],
            [1, 0, 41, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 41, 0, 0, 0, 0, 1],
            [1, 0, 41, 0, 0, 41, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 41, 0, 1],
            [1, 0, 0, 41, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 41, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        ];
        data.monsters = [
            {
                id: 1,
                level: [1, 2, 3],
                quantity: 3
            },
            {
                id: 2,
                level: [4, 5, 6],
                quantity: 3
            },
        ];
        data.npcs = [];
        data.collectibles = [
            {
                id: 1,
                quantity: 3
            },
            {
                id: 2,
                quantity: 3
            },
        ];
        data.player = {
            position: [6, 4]
        };
        this.map.data = data;
    }

    static fetchLogin() {
        this.login.characters = {
            0: {
                capacityPercentage: 0,
                name: '',
                class: 0,
                experience: 0,
                experienceNext: 0,
                experienceLast: 0,
                level: 0,
                initiative: 0,
                hitPoint: 0,
                hitPointMaximum: 0,
                manaPoint: 0,
                manaPointMaximum: 0,
                attack: 0,
                defense: 0,
                distribute: 0,
                dexterity: 0,
                vitality: 0,
                intelligence: 0,
                strength: 0,
                capacity: 0,
                capacityMaximum: 0,
                speed: 0,
            },
            1: {
                capacityPercentage: 0,
                name: '',
                class: 1,
                experience: 0,
                experienceNext: 0,
                experienceLast: 0,
                level: 0,
                initiative: 0,
                hitPoint: 0,
                hitPointMaximum: 0,
                manaPoint: 0,
                manaPointMaximum: 0,
                attack: 0,
                defense: 0,
                distribute: 0,
                dexterity: 0,
                vitality: 0,
                intelligence: 0,
                strength: 0,
                capacity: 0,
                capacityMaximum: 0,
                speed: 0,
            }
        };
        this.login.customizations = {
            color: {
                eye: [0, 2, 3],
                skin: [1, 2, 3],
                hair: [2, 6, 8]
            },
            style: {
                hair: [45],
                clothes: [52],
            },
        };
    }

    static fetchPlayer() {
        this.player.attributes.capacityPercentage = 328;
        this.player.attributes.name = 'Clodoaldo Junqueira';
        this.player.attributes.class = 0;
        this.player.attributes.experience = 4151;
        this.player.attributes.experienceNext = 8610;
        this.player.attributes.experienceLast = 8200;
        this.player.attributes.level = 41;
        this.player.attributes.initiative = 15;
        this.player.attributes.hitPoint = 22;
        this.player.attributes.hitPointMaximum = 38;
        this.player.attributes.manaPoint = 14;
        this.player.attributes.manaPointMaximum = 18;
        this.player.attributes.attack = 328;
        this.player.attributes.defense = 50;
        this.player.attributes.distribute = 3;
        this.player.attributes.dexterity = 0;
        this.player.attributes.vitality = 8;
        this.player.attributes.intelligence = 9;
        this.player.attributes.strength = 32;
        this.player.attributes.capacity = 8355;
        this.player.attributes.capacityMaximum = 2550;
        this.player.attributes.speed = 300;

        this.player.statistics.e3 = 199;
        this.player.statistics.d = 56;
        this.player.statistics.e2 = 173;
        this.player.statistics.l4 = 390;
        this.player.statistics.e1 = 60;
        this.player.statistics.e = 189;
        this.player.statistics.e0 = 207;
    }

    static update() {
        this.fetchPlayer();
        this.fetchMap(1);
    }

    static updateDataComponents(props) {
        const { property, value, el } = props;

        if (property in el.data) {
            el.data[property] = value;
            el.redraw();
        }
    }

    static updateLogin(props) {

    }

    static updatePlayerAttributes(property, value) {
        Data.updateDataComponents({
            el: HTML.elHudStatus,
            property,
            value
        });
        HTML.elHudPageRight.render();
    }

    static updatePlayerStatistics() {
        HTML.elHudPageRight.render();
    }

    static updateMap() {
        const map = this.map.data;
        const length = map.tiles.length;
        const monsters = map.monsters;
        const npcs = map.npcs;
        const collectibles = map.collectibles;
        const player = map.player;
        const args = {
            map: map.tiles,
            monsters,
            npcs,
            collectibles,
            player
        };

        if (length > 0) HTML.elGameMap.updateData(args);
    }
}
class GameCollectibles {
    static id = 'collectible';

    static addClick() {
        const el = HTML.elGameMap.shadowRoot.querySelectorAll(`[data-id='${this.id}']`);
        HTML.elGameMap.addClick(el);
    }

    static draw(itens) {
        let html = '';

        itens.forEach((collectible) => {
            const id = collectible.id;
            const quantity = collectible.quantity;
            const tooltip = `
                <span>madeira</span><br/> 
                coletável
            `;

            for (let i = 0; i < quantity; i++) {
                html += `
                    <c-game-collectible 
                        id="${this.id}_${id}_${i}"
                        class="gm-collectible ds-tile"
                        ${Layout.attributePositionX}="" 
                        ${Layout.attributePositionY}="" 
                        data-tooltip="${tooltip}"
                        data-id="${this.id}"
                        kind="${this.id}"
                    >
                    </c-game-collectible>
                `;
            }
        });

        return html;
    }

    static setPosition(target) {
        const availablePositions = HTML.elGameMap.getSafeZone();

        target.forEach((collectible) => {
            for (let i = 0; i < collectible.quantity; i++) {
                const elCollectible = HTML.elGameMap.shadowRoot.getElementById(`${this.id}_${collectible.id}_${i}`);

                if (elCollectible) {
                    if (availablePositions.length === 0) {
                        console.warn(`No empty space for collectible: ${elCollectible.id}`);
                        elCollectible.remove();
                        return;
                    }

                    const randomIndex = Math.floor(Math.random() * availablePositions.length);
                    const { x: positionX, y: positionY } = availablePositions[randomIndex];
                    availablePositions.splice(randomIndex, 1);

                    const args = {
                        target: elCollectible,
                        positionX,
                        positionY
                    };
                    HTML.elGameMap.setPosition(args);
                } else {
                    console.warn(`Collectible element with id ${this.id}_${collectible.id}_${i} not found`);
                }
            }
        });
    }
}
class GameMonsters {
    static id = 'monster';

    static addClick() {
        const el = HTML.elGameMap.shadowRoot.querySelectorAll(`[data-id='${this.id}']`);
        HTML.elGameMap.addClick(el);
    }

    static draw(target) {
        let html = '';

        target.forEach((monster, index) => {
            for (let i = 0; i < monster.quantity; i++) {
                const level = monster.level[Math.floor(Math.random() * monster.level.length)];
                const tooltip = `
                    Joaninha. <br/> 
                    Nível: <span>${level}</span> <br/> 
                    Vida: <span>${level}</span> <br/>
                    Experiência: <span>${level}</span> <br/>
                `;
                const el = `
                    <c-game-entity 
                        id="${this.id}_${index}_${i}" 
                        class="gm-alive gm-monster" 
                        ${Layout.attributePositionX}="" 
                        ${Layout.attributePositionY}="" 
                        data-level="${level}" 
                        data-id="${this.id}"
                        data-tooltip="${tooltip}"
                        data-walk-steps="5"
                        kind="${this.id}"
                        entity="${this.id}"
                        direction="down"
                        action="stand"
                        is-walk-back="false"
                        behavior="aggressive"
                    >
                    </c-game-entity>
                `;
                html += el;
            }
        });
        return html;
    }

    static setPosition(target) {
        const availablePositions = HTML.elGameMap.getSafeZone();

        target.forEach((monster, index) => {
            for (let i = 0; i < monster.quantity; i++) {
                const el = HTML.elGameMap.shadowRoot.getElementById(`${GameMonsters.id}_${index}_${i}`);

                if (availablePositions.length === 0) {
                    console.warn(`No empty space for enemy: ${el.id}`);
                    el && el.remove();
                    continue;
                }

                const randomIndex = Math.floor(Math.random() * availablePositions.length);
                const { x: positionX, y: positionY } = availablePositions.splice(randomIndex, 1)[0];
                const args = {
                    target: el,
                    positionX,
                    positionY
                };
                HTML.elGameMap.setPosition(args);
            }
        });
    }
}
class GameNPCs {
    static id = 'npc';

    static get buttons() {
        const translationInterface = Translation.interface;
        const translationDefault = Translation.interfaceDefault;
        const translationFilter = translationDefault.filter_results;
        const buildTranslationFilter = (target) => translationDefault[target];
        const buildTooltipFilter = (target) => `${translationFilter} <span>${buildTranslationFilter(target)}</span>`;
        const buttons = {
            buy: {
                id: 'buy',
                label: translationDefault.buy,
                handler: 'handleOpenPage',
                handlerProps: '["buy"]',
            },
            craft: {
                id: 'craft',
                label: translationDefault.craft,
                handler: 'handleOpenPage',
                handlerProps: '["craft"]',
            },
            sell: {
                id: 'sell',
                label: translationDefault.sell,
                handler: 'handleOpenPage',
                handlerProps: '["sell"]',
            },
            quest: {
                id: 'quest',
                label: translationInterface.page_quest.title,
                handler: 'handleOpenPage',
                handlerProps: '["quest"]',
            },
            filterAll: {
                id: 'all',
                tooltip: buildTooltipFilter('all'),
                label: buildTranslationFilter('all'),
                handler: 'handleFilter',
                handlerProps: '["all"]',
            },
            filterResources: {
                id: 'resources',
                tooltip: buildTooltipFilter('resources'),
                label: buildTranslationFilter('resources'),
                handler: 'handleFilter',
                handlerProps: '["resources"]',
            },
            filterMoney: {
                id: 'money',
                tooltip: buildTooltipFilter('money'),
                label: buildTranslationFilter('money'),
                handler: 'handleFilter',
                handlerProps: '["money"]',
            },
            filterUsable: {
                id: 'usable',
                tooltip: buildTooltipFilter('usable'),
                label: buildTranslationFilter('usable'),
                handler: 'handleFilter',
                handlerProps: '["usable"]',
            },
        };
        return buttons;
    }

    static addClick() {
        const el = HTML.elGameMap.shadowRoot.querySelectorAll(`[data-id='${this.id}']`);

        el.forEach(index => {
            this.addListener(index);
        });
    }

    static addListener(target) {
        const name = target.getAttribute('data-name');

        target.addEventListener('click', () => {
            const isValidDistance = this.isValidDistance(target);

            if (isValidDistance) {
                const args = {
                    detail: {
                        pageTarget: `${this.id}-${name}`,
                        pagePosition: 'left',
                        isNPC: true,
                        name
                    }
                };

                HTML.elHud.openPage(args);
            } else {
                const transitionDistance = this.getTranslationDistance();
                const argsNotification = {
                    content: transitionDistance,
                    color: 'orange',
                    position: 'right',
                    size: 'regular'
                };

                Notification.add(argsNotification);
            }
        });
    }

    static draw(target) {
        const transitionDistance = this.getTranslationDistance();
        let html = '';

        target.forEach((index) => {
            const id = index.id;
            const name = index.name;
            const position = index.position;
            const positionX = position[0];
            const positionY = position[1];
            const tooltip = `
                <span>${name}</span><br/> 
                ${transitionDistance}
            `;
            html += `
                <c-game-entity 
                    id="${this.id}_${id}"
                    class="gm-alive gm-person gm-npcs"
                    ${Layout.attributePositionX}="${positionX}" 
                    ${Layout.attributePositionY}="${positionY}" 
                    ${Layout.attributePositionXInitial}="${positionX}" 
                    ${Layout.attributePositionYInitial}="${positionY}" 
                    data-tooltip="${tooltip}"
                    data-id="${this.id}"
                    data-walk-steps="1"
                    data-name="${name}"
                    kind="${this.id}"
                    entity="person"
                    direction="down"
                    action="stand"
                    is-walk-back="true"
                    behavior="none"
                >
                </c-game-entity>
            `;
        });
        return html;
    }

    static isValidDistance(target) {
        const getAtt = (attribute) => Layout[`attributePosition${attribute}`];
        const getValue = (index, attribute) => Number(index.getAttribute(getAtt(attribute)));
        const player = HTML.elGamePlayer;
        const targetX = getValue(target, 'X');
        const targetY = getValue(target, 'Y');
        const playerX = getValue(player, 'X');
        const playerY = getValue(player, 'Y');
        const distanceDefault = 5;
        const distanceX = Math.abs(targetX - playerX);
        const distanceY = Math.abs(targetY - playerY);
        const response = distanceX <= distanceDefault && distanceY <= distanceDefault;

        return response;
    }

    static setPosition(target) {
        target.forEach((index) => {
            const id = index.id;
            const el = HTML.elGameMap.shadowRoot.getElementById(`${this.id}_${id}`);
            const args = {
                target: el,
                positionX: el.getAttribute(Layout.attributePositionX),
                positionY: el.getAttribute(Layout.attributePositionY)
            };
            HTML.elGameMap.setPosition(args);
        });
    }

    static getTranslationDistance() {
        const transition = Translation.dialogDefault?.need_be_close;

        return transition;
    }
}
class GamePlayers {
    static draw() {
        const html = `
            <c-game-entity 
                id="${HTML.idGamePlayer}"
                class="gm-alive gm-alive"
                entity="person"
                ${Layout.attributePositionX}="" 
                ${Layout.attributePositionY}="" 
                direction="down"
                action="stand"
            >
            </c-game-entity>
        `;
        return html;
    }

    static setPosition(target) {
        HTML.update();

        const args = {
            target: HTML.elGamePlayer,
            positionX: target[0],
            positionY: target[1]
        }
        HTML.elGameMap.setPosition(args);
    }
}
class Hotkeys {
    static hotkeys = [
        {
            id: 'attributes',
            key: 'a',
            action: this.buildActionOpenPage('attributes', 'right'),
            isGameKey: true
        },
        {
            id: 'settings',
            key: 'c',
            action: this.buildActionOpenPage('settings', 'right'),
            isGameKey: true
        },
        {
            id: 'inventory',
            key: 'i',
            action: this.buildActionOpenPage('inventory', 'right'),
            isGameKey: true
        },
        {
            id: 'equipments',
            key: 'e',
            action: this.buildActionOpenPage('equipments', 'right'),
            isGameKey: true
        },
        {
            id: 'map',
            key: 'm',
            action: this.buildActionOpenPage('map', 'right'),
            isGameKey: true
        },
        {
            id: 'quests',
            key: 'q',
            action: this.buildActionOpenPage('quests', 'right'),
            isGameKey: true
        },
        {
            id: 'achievements',
            key: 'd',
            action: this.buildActionOpenPage('achievements', 'right'),
            isGameKey: true
        },
        {
            id: 'useMana',
            key: 't',
            action: 'gameMenu.useItem(5)',
            isGameKey: true
        },
        {
            id: 'useLife',
            key: 'u',
            action: 'gameMenu.useItem(11)',
            isGameKey: true
        },
        {
            id: 'useRejuvenation',
            key: 'y',
            action: 'gameMenu.useItem(8)',
            isGameKey: true
        },
        {
            id: 'attackPhysical',
            key: '1',
            action: 'gameBattleSkill.attackPhysical()',
            isGameKey: true
        },
        {
            id: 'attackByClass',
            key: '3',
            action: 'gameBattleSkill.attackByClass()',
            isGameKey: true
        },
        {
            id: 'attackRun',
            key: '4',
            action: 'gameBattleSkill.run()',
            isGameKey: true
        },
        {
            id: 'esc',
            key: 'Escape',
            action: 'HTML.elHud.closeHudPages();HTML.elHud.closeModal();',
            isGameKey: false
        },
    ];

    static buildActionOpenPage(page, position) {
        return `
            HTML.elHud.openPage({
                detail: {
                    pageTarget: '${page}',
                    pagePosition: '${position}'
                }
            });
        `;
    }

    static getAction(target) {
        return this.getData(target).action;
    }

    static getData(target, prop = 'id') {
        const hotkeys = this.hotkeys;

        return hotkeys.find(property => property[prop] === target);
    }

    static getKey(target) {
        return this.getData(target).key;
    }

    static init() {
        document.addEventListener('keydown', (event) => {
            const index = this.getData(event.key, 'key');
            const action = index?.action;
            const isGameKey = index?.isGameKey;
            const isPlaying = HTML?.elGame?.isPlaying;
            let isValid = true;

            if (isGameKey && !isPlaying) isValid = false;
            if (action && isValid) eval(action);
        });
    }
}
class HTML {
    static idHud = 'hud';
    static idHudModal = 'hud_modal';
    static idHudMenu = 'hud_menu';
    static idHudTransition = 'hud_transition';
    static idHudPageLeft = 'hud_page_left';
    static idHudPageRight = 'hud_page_right';
    static idHudProgressExperience = 'hud_progress_experience';
    static idHudProgressLife = 'hud_progress_life';
    static idHudProgressMana = 'hud_progress_mana';
    static idHudStatus = 'hud_status';

    static idTooltipWrapper = 'tooltip_wrapper';
    static idTooltip = 'tooltip';
    static idTooltipArrow = 'tooltip_arrow';

    static idGame = 'game';
    static idGameBattle = 'game_battle';
    static idGameMain = 'game_main';
    static idGameMap = 'game_map';
    static idGamePlayer = 'game_player';

    static init() {
        this.update();
    }

    static update() {
        this.elHud = document.getElementById(this.idHud);
        this.elHudMenu = this.elHud.shadowRoot.getElementById(this.idHudMenu);
        this.elHudPageLeft = this.elHud.shadowRoot.getElementById(HTML.idHudPageLeft);
        this.elHudPageRight = this.elHud.shadowRoot.getElementById(HTML.idHudPageRight);
        this.elHudProgressExperience = this.elHud.shadowRoot.getElementById(HTML.idHudProgressExperience);
        this.elHudProgressLife = this.elHud.shadowRoot.getElementById(HTML.idHudProgressLife);
        this.elHudProgressMana = this.elHud.shadowRoot.getElementById(HTML.idHudProgressMana);
        this.elHudModal = this.elHud.shadowRoot.getElementById(HTML.idHudModal);
        this.elHudTransition = this.elHud.shadowRoot.getElementById(HTML.idHudTransition);
        this.elHudStatus = this.elHud.shadowRoot.getElementById(HTML.idHudStatus);

        this.elTooltipWrapper = document.getElementById(HTML.idTooltipWrapper);
        this.elToolti = document.getElementById(HTML.idTooltipWrapper);

        this.elGame = this.elHud.shadowRoot.getElementById(HTML.idGame);
        this.elGameBattle = this.elGame.shadowRoot.getElementById(HTML.idGameBattle);
        this.elGameMain = this.elGame.shadowRoot.getElementById(HTML.idGameMain);
        this.elGameMap = this.elGame.shadowRoot.getElementById(HTML.idGameMap);
        this.elGamePlayer = this.elGameMap.shadowRoot.getElementById(HTML.idGamePlayer);
    }
}
class Management {
    static applyTranslation() {
        HTML.elHudStatus.redraw();
        HTML.elHudMenu.redraw();
    }

    static buildGame() {
        HTML.elGame.setIsPlaying(true);
        Data.update();
        Camera.center();
    }

    static init() {
        document.addEventListener('DOMContentLoaded', () => {
            window.addEventListener('load', () => {
                Management.handleLoaded();
            });
        });

        window.addEventListener('resize', () => {
            this.resize();
        });
    }

    static initClasses() {
        Layout.init();
        HTML.init();
        HTML.elHudTransition.init();
        Hotkeys.init();
        Notification.init();
    }

    static async handleLoaded() {
        this.initClasses();
        await this.translate();
        Data.fetchLogin();
        HTML.elHud.openModalSelectCharacter(false);
        this.removeTransition();
    }

    static removeTransition() {
        setTimeout(() => {
            HTML.elHudTransition.isInitial = false;
            HTML.elHud.close(HTML.elHudTransition);
        }, HTML.elHudTransition.timeout);
    }

    static play(target) {
        console.log(target);
        HTML.elHudModal.setAttribute('is-close-button', true);
        HTML.elHud.closeModal();
        HTML.elHud.closeHudPages();
        this.buildGame();
    }

    static resize() {
        Layout.resize();
        Camera.center();
        HTML?.elTooltipWrapper?.handleMouseOut();
    }

    static async translate() {
        Translation.init();

        await Translation.translate('game');
        await Translation.translate('dialog');
        await Translation.translate('interface');
        await Translation.translate('login');

        this.applyTranslation();
    }
}

Management.init();
class Pathfinding {
    static findPath(map, start, end) {
        const cameFrom = new Map();
        const gScore = new Map();
        gScore.set(this.coordToIndex(start), 0);

        const openSet = [{ position: start, fScore: this.heuristic(start, end) }];
        const visited = new Set();

        while (openSet.length > 0) {
            openSet.sort((a, b) => a.fScore - b.fScore);
            const { position: current } = openSet.shift();

            if (current[0] === end[0] && current[1] === end[1]) {
                return this.reconstructPath(cameFrom, current);
            }

            visited.add(this.coordToIndex(current));

            for (const neighbor of this.getNeighbors(current, map)) {
                if (visited.has(this.coordToIndex(neighbor))) {
                    continue;
                }

                const tentativeGScore = gScore.get(this.coordToIndex(current)) + 1;

                if (tentativeGScore < (gScore.get(this.coordToIndex(neighbor)) || Infinity)) {
                    cameFrom.set(this.coordToIndex(neighbor), current);
                    gScore.set(this.coordToIndex(neighbor), tentativeGScore);

                    const fScore = tentativeGScore + this.heuristic(neighbor, end);
                    if (!openSet.some(item => item.position[0] === neighbor[0] && item.position[1] === neighbor[1])) {
                        openSet.push({ position: neighbor, fScore });
                    }
                }
            }
        }
        return null;
    }

    static heuristic(a, b) {
        return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);
    }

    static getNeighbors([x, y], map) {
        const neighbors = [];
        const directions = [
            [0, -1],
            [0, 1],
            [-1, 0],
            [1, 0]
        ];

        for (const [dx, dy] of directions) {
            const nx = x + dx;
            const ny = y + dy;
            if (this.isWalkable([nx, ny], map)) {
                neighbors.push([nx, ny]);
            }
        }
        return neighbors;
    }

    static isWalkable([x, y], map) {
        return map[y] && map[y][x] === 0;
    }

    static coordToIndex([x, y]) {
        return `${x},${y}`;
    }

    static reconstructPath(cameFrom, current) {
        const path = [current];
        const visited = new Set([this.coordToIndex(current)]);

        while (cameFrom.has(this.coordToIndex(current))) {
            const currentIndex = this.coordToIndex(current);
            current = cameFrom.get(currentIndex);

            if (visited.has(this.coordToIndex(current))) {
                return null;
            }

            visited.add(this.coordToIndex(current));
            path.unshift(current);
        }
        return path;
    }
}
class Rule {
    static classes = {
        0: {
            class: 'warrior',
            attribute: 'strength'
        },
        1: {
            class: 'wizard',
            attribute: 'intelligence'
        },
        2: {
            class: 'hunter',
            attribute: 'dexterity'
        },
        3: {
            class: 'merchant',
            attribute: 'vitality'
        }
    };
}
class Tiles {
    static decode(target) {
        if (target === 0) return 'green';
        if (target === 1) return 'black';
    }
}
class Walk {
    static lastStep = {
        x: 0,
        y: 0
    };
    static isWalking = false;
    static cancelCurrentWalk = false;

    static isPlayer(el) {
        return el === HTML.elGamePlayer;
    }

    static getOccupation(props) {
        const { el, x, y, isLastStep } = props;
        const isPlayer = this.isPlayer(el);

        if (!isPlayer) return;

        const occupation = HTML.elGameMap.getOccupation(x, y);
        if (!occupation || !occupation.target) {
            console.warn(`No valid target at (${x}, ${y})`);
            return;
        }

        const target = occupation.target;
        const kind = target.getAttribute('kind');

        switch (kind) {
            case GameMonsters.id:
                this.cancelCurrentWalk = true;
                HTML.elGameBattle.build(target);
                break;
            case GameNPCs.id:
                console.log('NPC found:', target.id);
                break;
            case GameCollectibles.id:
                if (isLastStep) console.log('Collectible found:', target.id);
                break;
        }
    }

    static verifyDirection(x, y) {
        const lastStep = this.lastStep;
        let direction = '';

        if (lastStep.x > x) direction = 'left';
        if (lastStep.x < x) direction = 'right';
        if (lastStep.y > y) direction = 'up';
        if (lastStep.y < y) direction = 'down';
        return direction;
    }

    static updateEntityState(el, direction, action) {
        el.setAttribute('direction', direction);
        el.setAttribute('action', action);
    }

    static walk(props) {
        const { el, positionXFrom, positionXTo, positionYTo, positionYFrom } = props;
        const isPlayer = this.isPlayer(el);
        if (this.isWalking && isPlayer) {
            this.cancelCurrentWalk = true;
            return;
        }
        const xFrom = isPlayer ? Number(el.getAttribute('data-position-x')) : Number(positionXFrom);
        const yFrom = isPlayer ? Number(el.getAttribute('data-position-y')) : Number(positionYFrom);
        const xTo = Number(positionXTo);
        const yTo = Number(positionYTo);

        const argsPath = {
            start: [xFrom, yFrom],
            end: [xTo, yTo]
        };
        const path = HTML.elGameMap.findPath(argsPath);
        if (!path) return;
        const argsAnimation = {
            el,
            path,
            positionXFrom: xFrom,
            positionYFrom: yFrom
        };

        if (isPlayer) {
            this.cancelCurrentWalk = false;
            this.isWalking = true;
        }

        const initialDirection = this.verifyDirection(xTo, yTo);
        this.updateEntityState(el, initialDirection, 'walk');

        this.walkLoop(argsAnimation);
    }

    static async walkLoop(props) {
        const { path, positionXFrom, positionYFrom, el } = props;
        const isPlayer = this.isPlayer(el);
        const lastIndex = path.length - 1;

        for (let i = 0; i < path.length; i++) {
            if (isPlayer) {
                if (this.cancelCurrentWalk) break;
            }
            const index = path[i];
            const x = index[0];
            const y = index[1];
            const isSameX = x === positionXFrom;
            const isSameY = y === positionYFrom;
            const isSameTile = isSameX && isSameY;
            const isLastStep = i === lastIndex;

            if (isSameTile) {
                this.lastStep.x = positionXFrom;
                this.lastStep.y = positionYFrom;
            } else {
                props.direction = this.verifyDirection(x, y);
                this.lastStep.x = x;
                this.lastStep.y = y;
                await this.walkAnimation(props, index);

                const args = { x, y, el, isLastStep };
                this.getOccupation(args);
            }
        }

        if (isPlayer) {
            this.isWalking = false;
        }
        this.updateEntityState(el, props.direction, 'stand');
    }

    static walkAnimation(props, walkTo) {
        const { el } = props;
        const animationDuration = Data.player.attributes.speed;
        const args = {
            target: el,
            positionX: walkTo[0],
            positionY: walkTo[1]
        };
        const isPlayer = this.isPlayer(el);

        if (isPlayer) this.walkMap(props);
        return new Promise((resolve) => {
            HTML.elGameMap.setPosition(args);
            setTimeout(() => resolve(), animationDuration);
        });
    }

    static walkMap(props) {
        const { direction } = props;
        const currentValue = Helper.getTranslateValue(HTML.elGameMap);
        const tileSize = Layout.tileSize;
        let horizontal = currentValue.x;
        let vertical = currentValue.y;

        if (direction === 'left') horizontal += tileSize;
        if (direction === 'right') horizontal -= tileSize;
        if (direction === 'up') vertical += tileSize;
        if (direction === 'down') vertical -= tileSize;

        const args = {
            target: HTML.elGameMap,
            vertical,
            horizontal,
            easing: 'linear',
            speed: Data.player.attributes.speed
        };
        Animation.animatePosition(args);
        Camera.center();
    }
}
