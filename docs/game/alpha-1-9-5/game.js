const nameSpace = 'gm'; // eslint-disable-line no-unused-vars
let deps = {}; // eslint-disable-line no-unused-vars
let ds; // eslint-disable-line no-unused-vars
let lo; // eslint-disable-line no-unused-vars
export class Analytics {
    static send(props) {
        ds.Analytics.gameEvent(props);
    }
}

export class Animation {
    static animatePosition(props) {
        const { target, vertical, horizontal, speed, easing = 'linear' } = props;

        if (isNaN(vertical) || isNaN(horizontal)) return;

        const response = new Promise((resolve) => {
            const speedPlayer = Data.player.attributes.speed;
            const currentValue = ds.Helper.getTranslateValue(target);
            const currentVertical = Math.floor(currentValue.y);
            const currentHorizontal = Math.floor(currentValue.x);

            const newVertical = vertical === false ? currentVertical : Math.floor(vertical);
            const newHorizontal = horizontal === false ? currentHorizontal : Math.floor(horizontal);
            const duration = speed !== undefined ? speed : speedPlayer;

            const buildCss = (horizontal, vertical) => `translate(${horizontal}px, ${vertical}px)`;
            const transform = [
                { transform: buildCss(currentHorizontal, currentVertical) },
                { transform: buildCss(newHorizontal, newVertical) }
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

        return response;
    }
}
export class Audio {
    static categories = ['effects', 'music'];
    static audios = {};



    static addAudio(name, src) {
        const audio = document.createElement('audio');

        audio.src = src;
        audio.loop = true;
        audio.style.display = 'none';
        audio.dataset.type = name;

        document.body.appendChild(audio);

        this.audios[name] = audio;
    }

    static buildEffectFade(props) {
        const { from = null, to = null, targetVolume = 1, duration = 1000 } = props;
        const steps = 20;
        const stepDuration = duration / steps;
        const toStep = targetVolume / steps;

        const audioFrom = ds.Helper.isString(from) ? this.getAudio(from) : from;
        const audioTo = ds.Helper.isString(to) ? this.getAudio(to) : to;

        if (audioTo) {
            audioTo.volume = 0;
            audioTo.play();
        }

        const fromStep = audioFrom ? audioFrom.volume / steps : 0;
        let i = 0;

        const interval = setInterval(() => {
            if (i >= steps) {
                clearInterval(interval);

                if (audioFrom) {
                    audioFrom.pause();
                    audioFrom.volume = targetVolume;
                }

                if (audioTo) audioTo.volume = targetVolume;

                return;
            }

            if (audioFrom) audioFrom.volume = Math.max(0, audioFrom.volume - fromStep);
            if (audioTo) audioTo.volume = Math.min(targetVolume, audioTo.volume + toStep);

            i++;
        }, stepDuration);
    }

    static buildFile(target) {
        const path = `${gbUrlAssets}audio/${gbVersion.audio}/`;
        const response = `${path + target}.mp3`;

        return response;
    }

    static buildMusic() {
        const isPlay = AudioMusic.isPlay;

        if (!isPlay) return;

        const isBattle = this.isBattle;
        const to = isBattle ? 'battle' : 'music';
        const from = isBattle ? 'music' : 'battle';
        const volume = Settings.data.music.value;
        const args = { from, to, targetVolume: volume };

        this.buildEffectFade(args);
    }

    static createAudioElements() {
        const audios = [
            { id: 'effects', src: AudioEffects.audioEffects },
            { id: 'music', src: AudioMusic.audioTorgotes },
            { id: 'battle', src: AudioMusic.audioBattle },
        ];

        audios.forEach((index) => {
            this.addAudio(index.id, index.src);
        });
    }

    static getAudio(target) {
        const response = this.audios[target];

        return response;
    }

    static get audioEffects() {
        const response = this.getAudio('effects');

        return response;
    }

    static get isBattle() {
        const response = Battle.isBattle;

        return response;
    }

    static init() {
        this.createAudioElements();
        this.updateVolumeFromSettings();
    }

    static play(target) {
        let targetFix = target;
        const isMusic = target === 'music' || target === 'battle';

        if (isMusic) {
            const isBattle = this.isBattle;

            isBattle ? targetFix = 'battle' : targetFix = 'music';
        }

        const audio = this.getAudio(targetFix);
        const isValid = audio && target !== 'effects';

        if (isValid) audio.play();
    }

    static pause(target) {
        const audio = this.getAudio(target);

        if (audio) audio.pause();
    }

    static setVolume(target, volume) {
        const audio = this.getAudio(target);

        if (audio) audio.volume = volume;
    }

    static updateVolumeFromSettings() {
        this.categories.forEach(type => {
            const config = Settings.data[type];
            const audio = this.getAudio(type);

            if (audio) {
                if (config.isPlay) {
                    const isMusic = type === 'music';

                    if (isMusic) {
                        const args = { to: audio, targetVolume: config.value };

                        this.buildEffectFade(args);
                    }
                } else {
                    audio.pause();
                }
            }
        });
    }
}
export class AudioEffects {
    static buildEffectMonster(target) {
        const time = {
            default: '#t=0.1,0.4',
            worm: '#t=6.0,6.3',
            rat: '#t=4.1,4.7',
        };
        const response = time[target] ? time[target] : time['default'];

        return response;
    }

    static buildEffectWeapon() {
        const weaponData = Data.player.equipments.weapon.il;
        const weaponArgs = { target: weaponData };
        const weaponLoot = Storage.getProperties(weaponArgs);
        const weapon = weaponData ? weaponLoot.itemLoot.kind : 0;
        const time = {
            0: '#t=0.1,0.4',
            2: '#t=1.0,1.5',
            3: '#t=2.9,3.5',
            4: '#t=2.2,2.8',
            20: '#t=5.1,5.4',
            21: '#t=5.1,5.4',
        };
        const response = time[weapon] ? time[weapon] : time[0];

        return response;
    }

    static get audioEffects() {
        const response = Audio.buildFile('sound-effect');

        return response;
    }

    static get isPlay() {
        const response = Data.settings.effects.isPlay;

        return response;
    }

    static play(target) {
        const isPlay = this.isPlay;

        if (!isPlay) return;

        const dataSet = target.dataset;
        const id = dataSet.id;
        const isPlayer = id === 'player';
        const sound = isPlayer ? this.buildEffectWeapon() : this.buildEffectMonster(dataSet.kind);
        const soundEffects = Audio.audioEffects;

        soundEffects.setAttribute('src', this.audioEffects + sound);
        soundEffects.play();
    }
}
export class AudioMusic {
    static get audioBattle() {
        const response = Audio.buildFile('theme-battle');

        return response;
    }

    static get audioTorgotes() {
        const response = Audio.buildFile('theme-torgotes');

        return response;
    }

    static get isPlay() {
        const response = Data.settings.music.isPlay;

        return response;
    }
}
export class Camera {
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
            target: HTML.elMapGame,
            vertical: vertical,
            horizontal: horizontal,
            speed: newSpeed
        };

        Animation.animatePosition(args);
    }

    static centerVertical() {
        const gameSize = Layout.game.height / 2;
        const player = this.player.top;
        const tile = ds.Layout.tileSizeHalf;
        const response = gameSize - player - tile;

        return response;
    }

    static centerHorizontal() {
        const gameSize = Layout.game.width / 2;
        const player = this.player.left;
        const tile = ds.Layout.tileSizeHalf;
        const response = gameSize - player - tile;

        return response;
    }

    static update() {
        Layout.resize();

        const positionPlayer = HTML?.elMapGame?.getPosition(HTML.elGamePlayer);

        if (!positionPlayer) return;

        this.player.top = positionPlayer.top;
        this.player.left = positionPlayer.left;
    }
}
export class Character {
    static buildEquipments(equipments, storage) {
        const response = Storage.getEquipments(storage, equipments);

        response.clothes = equipments.clothes;

        return response;
    }

    static buildEquipmentById(equipments, storage) {
        const storageById = storage?.reduce((acc, item) => {
            acc[item.id] = item;

            return acc;
        }, {});

        const response = Object.keys(equipments).reduce((acc, slot) => {
            const id = equipments[slot];

            acc[slot] = storageById?.[id] || null;

            return acc;
        }, {});

        return response;
    }

    static get characters() {
        const response = Object.entries(Data.login?.characters ?? []);

        return response;
    }

    static getItemById(props) {
        const { data, filterBy, value } = props;
        const response = data.filter(item => item[filterBy] === value)[0];

        return response;
    }

    static getEquipmentById(equipments, value) {
        const args = { data: equipments, filterBy: 'id', value };
        const response = this.getItemById(args);

        return response;
    }

    static getEquipmentIdLoreById(equipments, value) {
        const response = this.getEquipmentById(equipments, value)?.id_lore;

        return response;
    }

    static getItemQuantityByIdLore(data, il) {
        const args = { data, filterBy: 'id_lore', value: il };
        const response = this.getItemById(args)?.quantity ?? 0;

        return response;
    }

    static getStorageByCharcaterId(id) {
        const storage = Data.storage;
        const response = Object.values(storage).filter(item =>
            item.id_character === null || item.id_character === id
        );

        return response;
    }
}
export class Collectibles {
    static prefix = 'collectable';



    static addClick() {
        const el = HTML.elMapGame.shadowRoot.querySelectorAll(`[data-id='${this.prefix}']`);

        HTML.elMapGame.addClick(el);
    }

    static decode(target) {
        const response = ds.Helper.findById(Statics.collectibles, target);

        return response;
    }

    static draw(target) {
        const translationLoot = ds.Translation.gameLoot;
        const translationDefault = ds.Translation.interfaceDefault;
        const translationCollectable = translationDefault.collectable;
        let response = '';

        target.forEach((index) => {
            const idItem = index.idItem;
            const kind = this.decode(idItem);

            if (!kind) return;

            const name = kind.name;
            const translationName = ds.Helper.escapeHTML(translationLoot[name]);
            const tooltip = `
                <span>${translationName}</span>. <br/>
                ${translationCollectable}.
            `;
            const id = Layout.buildId(this.prefix, index.id);

            response += `
                <${lo.Components.collectable}
                    id="${id}"
                    class="lo-collectable ds-tile"
                    ${ds.Layout.attributePositionX}=""
                    ${ds.Layout.attributePositionY}=""
                    data-tooltip="${tooltip}"
                    data-id="${this.prefix}"
                    data-loot="${idItem}"
                    data-kind="${ds.Helper.escapeHTML(name)}"
                    kind="${this.prefix}"
                ></${lo.Components.collectable}>
            `;
        });

        return response;
    }

    static async pickUp(id) {
        const data = await FetchData.pickUpCollectable(id);

        if (!data.id) return;

        const collectable = this.decode(data.idItem);

        Analytics.send({
            event_name: 'collectible_pickup',
            collectible_id: data.id,
            item_id: data.idItem,
            item_name: collectable?.name,
        });

        const idCollectable = Layout.buildId(this.prefix, id);
        const el = HTML.elMapGame.shadowRoot.getElementById(idCollectable);

        el.remove();

        this.pickUpAddNotification();
    }

    static pickUpAddNotification() {
        const translationCollected = ds.Translation.gameGeneric?.item_collected;
        const translationCheck = ds.Translation.interface.response?.check_inventory;
        const content = `${translationCollected} ${translationCheck}`;
        const argsNotification = {
            content,
        };

        Notification.add(argsNotification);
    }

    static setPosition() {
        const elements = HTML.elMapGame.shadowRoot.querySelectorAll(`[data-id="${this.prefix}"]`);

        MapGame.setPositionEntity(elements);
    }

    static unBuildId(id) {
        const response = Layout.unBuildId(this.prefix, id);

        return response;
    }
}
export class Components {
    static get battle() {
        const response = this.#buildName('battle');

        return response;
    }

    static get characterCustomization() {
        const response = this.#buildName('character-customization');

        return response;
    }

    static get characterRotation() {
        const response = this.#buildName('character-rotation');

        return response;
    }

    static get cHud() {
        const response = this.#buildName('hud');

        return response;
    }

    static get cHudActionPoints() {
        const response = this.#buildName('hud-action-points');

        return response;
    }

    static get cHudContentMoney() {
        const response = this.#buildName('hud-content-money');

        return response;
    }

    static get cHudMenu() {
        const response = this.#buildName('hud-menu');

        return response;
    }

    static get cHudPageAbout() {
        const response = this.buildHudPageName('about');

        return response;
    }

    static get cHudPageAchievements() {
        const response = this.buildHudPageName('achievements');

        return response;
    }

    static get cHudPageAdvertising() {
        const response = this.buildHudPageName('advertising');

        return response;
    }

    static get cHudPageApplyCustomization() {
        const response = this.buildHudPageName('apply-customization');

        return response;
    }

    static get cHudPageAttributes() {
        const response = this.buildHudPageName('attributes');

        return response;
    }

    static get cHudPageBattle() {
        const response = this.buildHudPageName('battle');

        return response;
    }

    static get cHudPageBuy() {
        const response = this.buildHudPageName('buy');

        return response;
    }

    static get cHudPageBuyCustomization() {
        const response = this.buildHudPageName('buy-customization');

        return response;
    }

    static get cHudPageCombat() {
        const response = this.buildHudPageName('combat');

        return response;
    }

    static get cHudPageCraft() {
        const response = this.buildHudPageName('craft');

        return response;
    }

    static get cHudPageDeposit() {
        const response = this.buildHudPageName('deposit');

        return response;
    }

    static get cHudPageDetail() {
        const response = this.buildHudPageName('detail');

        return response;
    }

    static get cHudPageEquipments() {
        const response = this.buildHudPageName('equipments');

        return response;
    }

    static get cHudPageInventory() {
        const response = this.buildHudPageName('inventory');

        return response;
    }

    static get cHudPageMap() {
        const response = this.buildHudPageName('map');

        return response;
    }

    static get cHudPageMenu() {
        const response = this.buildHudPageName('menu');

        return response;
    }

    static get cHudPageNPC() {
        const response = this.buildHudPageName('npc');

        return response;
    }

    static get cHudPageQuest() {
        const response = this.buildHudPageName('quest');

        return response;
    }

    static get cHudPageQuests() {
        const response = this.buildHudPageName('quests');

        return response;
    }

    static get cHudPageRepairCombat() {
        return this.buildHudPageName('repair-combat');
    }

    static get cHudPageRepairMagic() {
        return this.buildHudPageName('repair-magic');
    }

    static get cHudPageSelectCharacter() {
        const response = this.buildHudPageName('select-character');

        return response;
    }

    static get cHudPageSelectClass() {
        const response = this.buildHudPageName('select-class');

        return response;
    }

    static get cHudPageSelectCustomization() {
        const response = this.buildHudPageName('select-customization');

        return response;
    }

    static get cHudPageSell() {
        const response = this.buildHudPageName('sell');

        return response;
    }

    static get cHudPageSettings() {
        const response = this.buildHudPageName('settings');

        return response;
    }

    static get cHudPageStatistics() {
        const response = this.buildHudPageName('statistics');

        return response;
    }

    static get cHudPageStore() {
        const response = this.buildHudPageName('store');

        return response;
    }

    static get cHudPageStory() {
        const response = this.buildHudPageName('story');

        return response;
    }

    static get cHudPageUser() {
        const response = this.buildHudPageName('user');

        return response;
    }

    static get cHudPageUserDeleteAccount() {
        const response = this.buildHudPageName('user-delete-account');

        return response;
    }

    static get cHudPageUserEdit() {
        const response = this.buildHudPageName('user-edit');

        return response;
    }

    static get cHudPageWithdraw() {
        const response = this.buildHudPageName('withdraw');

        return response;
    }

    static get cHudReferral() {
        const response = this.#buildName('hud-referral');

        return response;
    }

    static get cHudStatus() {
        const response = this.#buildName('hud-status');

        return response;
    }

    static get cHudTransition() {
        const response = this.#buildName('hud-transition');

        return response;
    }

    static get components() {
        const response = [
            [this.game, Game],

            [this.battle, Battle],

            [this.map, MapGame],

            [this.characterRotation, CharacterRotation],
            [this.characterCustomization, CharacterCustomization],

            [this.cHud, Hud],
            [this.cHudContentMoney, HudContentMoney],
            [this.cHudMenu, HudMenu],

            [this.cHudStatus, HudStatus],
            [this.cHudTransition, HudTransition],
            [this.cHudActionPoints, HudActionPoints],

            [this.cHudPageAbout, HudPageAbout],
            [this.cHudPageAchievements, HudPageAchievements],
            [this.cHudPageAdvertising, HudPageAdvertising],
            [this.cHudPageApplyCustomization, HudPageApplyCustomization],
            [this.cHudPageAttributes, HudPageAttributes],
            [this.cHudPageBattle, HudPageBattle],
            [this.cHudPageBuy, HudPageBuy],
            [this.cHudPageBuyCustomization, HudPageBuyCustomization],
            [this.cHudPageCombat, HudPageCombat],
            [this.cHudPageCraft, HudPageCraft],
            [this.cHudPageDetail, HudPageDetail],
            [this.cHudPageEquipments, HudPageEquipments],
            [this.cHudPageInventory, HudPageInventory],
            [this.cHudPageMap, HudPageMap],
            [this.cHudPageMenu, HudPageMenu],
            [this.cHudPageNPC, HudPageNPC],
            [this.cHudPageQuest, HudPageQuest],
            [this.cHudPageQuests, HudPageQuests],
            [this.cHudPageRepairCombat, HudPageRepairCombat],
            [this.cHudPageRepairMagic, HudPageRepairMagic],
            [this.cHudPageSelectCharacter, HudPageSelectCharacter],
            [this.cHudPageSelectClass, HudPageSelectClass],
            [this.cHudPageSelectCustomization, HudPageSelectCustomization],
            [this.cHudPageSell, HudPageSell],
            [this.cHudPageSettings, HudPageSettings],
            [this.cHudPageStatistics, HudPageStatistics],
            [this.cHudPageStore, HudPageStore],
            [this.cHudPageStory, HudPageStory],
            [this.cHudPageUser, HudPageUser],
            [this.cHudPageUserDeleteAccount, HudPageUserDeleteAccount],
            [this.cHudPageUserEdit, HudPageUserEdit],
            [this.cHudPageDeposit, HudPageDeposit],
            [this.cHudPageWithdraw, HudPageWithdraw],
            [this.cHudReferral, HudReferral],
        ];

        return response;
    }

    static get game() {
        const response = this.prefixComponent;

        return response;
    }

    static get map() {
        const response = this.#buildName('map');

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

    static buildHudPageName(page) {
        const response = this.#buildName(`hud-page-${page}`);

        return response;
    }





    static #buildName(name) {
        const response = ds.Components.buildName(this.prefixComponentDash, name);

        return response;
    }
}
export class Data {
    static storage = null;
    static miniMap = null;
    static customizations = null;
    static map = null;
    static opponent = null;
    static player = null;
    static rules = null;
    static settings = null;

    static init() {
        Data.storage = DataProxyFactory.createDeep({}, () => Data.#scheduleStorage());
        Data.miniMap = DataProxyFactory.createDeep({}, () => Data.updateMiniMap());
        Data.customizations = DataProxyFactory.createDeep({}, () => Data.updateCustomizations());
        Data.map = DataProxyFactory.createMap(() => MapGame.updateMap());

        const groupConfig = {
            onSet: args => Data.#setGroupValue(args),
            onDelete: (entity, category) => DataScheduler.batchDebounce(`${entity}.${category}`, () => Data.#runBatchMethod(entity, category))
        };

        const opponent = {
            ...groupConfig,
            basePath: 'opponent',
            properties: ['attributes']
        };

        Data.opponent = DataProxyFactory.createGroup(opponent);

        const player = {
            ...groupConfig,
            basePath: 'player',
            properties: [
                'achievements',
                'attributes',
                'buffs',
                'craft',
                'customizations',
                'equipments',
                'map',
                'quests',
                'statistics',
                'attacks',
                'defenses',
                'skills',
                'stories',
            ]
        };

        Data.player = DataProxyFactory.createGroup(player);

        const rules = {
            ...groupConfig,
            basePath: 'rules',
            properties: ['skills', 'battle', 'npcs', 'user', 'achievements', 'reward']
        };

        Data.rules = DataProxyFactory.createGroup(rules);

        const settings = {
            ...groupConfig,
            basePath: 'settings',
            properties: ['effects', 'music']
        };

        Data.settings = DataProxyFactory.createGroup(settings);
    }

    static getNextStorageKey(storage) {
        const keys = Object.keys(storage).map(Number);
        const max = keys.length ? Math.max(...keys) : -1;
        const response = String(max + 1);

        return response;
    }

    static setCustomizations(props) {
        if (!props || typeof props !== 'object') return;

        const args = {
            target: Data.customizations,
            source: props,
            wrap: value => DataProxyFactory.createDeep(value, () => Data.updateCustomizations())
        };

        Data.#clearAndRepopulate(args);

        Data.updateCustomizations();
    }

    static setData(props) {
        if (!props || typeof props !== 'object') return;

        const handlers = {
            storage: value => Data.setStorage(value),
            storageUpdated: value => Data.setStorageUpdated(value),
            statisticsUpdated: value => Data.setStatisticsUpdated(value),
            achievementsUpdated: value => Data.setAchievementsUpdated(value),
            miniMap: value => Data.setMiniMap(value),
            miniMapUpdated: value => Data.setMiniMapUpdated(value),
            customizations: value => Data.setCustomizations(value),
            equipments: value => Data.setPlayerEquipments(value),
            capacity: value => Data.setPlayerCapacity(value),
            map: value => Data.setMap(value),
            isInventoryFull: () => Data.setInventoryFull(),
            isLevelUp: value => value && Data.setLevelUp(),
            quests: value => Data.setPlayerQuests(value),
            opponent: value => value && value !== [] && Data.setOpponent(value),
            player: value => Data.setPlayer(value),
            rules: value => Data.setRules(value),
            statics: value => Statics.updateVariables(value),
            characters: value => Data.setLoginCharacters(value),
            user: value => Data.setLoginUser(value),
        };

        Object.entries(handlers).forEach(([key, fn]) => {
            if (props[key] !== undefined) fn(props[key]);
        });
    }

    static setLoginCharacters(props) {
        if (!Array.isArray(props)) return;

        Data.#ensureLoginProxy();

        Data.login.characters = props;
    }

    static setLoginUser(props) {
        if (!props || typeof props !== 'object') return;

        Data.#ensureLoginProxy();

        Object.entries(props).forEach(([key, value]) => { Data.login[key] = value; });
    }

    static async setMap(props) {
        if (!props || typeof props !== 'object') return;

        HTML.elTransition.openByKind('tip');

        await MapGame.updateDataMap({ mapData: props });

        Player.updateLayout();
        Camera.center();

        HTML.elTransition.close();
    }

    static setMiniMap(props) {
        if (!props || typeof props !== 'object') return;

        const args = {
            target: Data.miniMap,
            source: props,
            wrap: doors => DataProxyFactory.createDeep({ doors }, () => Data.updateMiniMap())
        };

        Data.#clearAndRepopulate(args);

        Data.updateMiniMap();
    }

    static setMiniMapUpdated(props) {
        if (!props || typeof props !== 'object' || Object.keys(props).length === 0) return;

        Object.entries(props).forEach(([mapId, doors]) => {
            if (Data.miniMap[mapId]) {
                Data.miniMap[mapId].doors = doors;
                return;
            }

            Data.miniMap[mapId] = DataProxyFactory.createDeep({ doors }, () => Data.updateMiniMap());
        });

        Data.updateMiniMap();
    }

    static setOpponent(props) {
        if (!props || typeof props !== 'object') return;

        const { attributes } = props;

        if (!attributes || typeof attributes !== 'object') return;

        Data.#applyNestedData(Data.opponent, { attributes });
    }

    static setPlayer(props) {
        Data.#applyNestedData(Data.player, props);
    }

    static setPlayerCapacity(props) {
        if (!props || typeof props !== 'object') return;

        const { capacity, weight } = props;
        const data = Data.player.attributes;

        if (capacity !== undefined) data.capacity = capacity;

        if (weight !== undefined) data.weight = weight;
    }

    static setAchievementsUpdated(props) {
        if (!Array.isArray(props) || props.length === 0) return;

        const translation = ds.Translation.gameAchievements;

        props.forEach((index) => {
            const title = translation?.[`a_${index}_title`];

            if (!title) return;

            const args = {
                content: title,
                color: Notification.colorDefault,
            };

            Notification.add(args);
        });

        Data.updatePlayerAchievements();
    }

    static setInventoryFull() {
        const content = ds.Translation.interface.response?.inventory_full;

        if (!content) return;

        const args = {
            content,
            color: Notification.colorError,
        };

        Notification.add(args);
    }

    static setLevelUp() {
        const content = ds.Translation.gameGeneric?.level_up;
        const level = Data.player?.attributes?.level;
        const text = `${content} ${level}`;

        const args = {
            content: text,
            color: Notification.colorDefault,
        };

        Notification.add(args);
    }

    static setPlayerEquipments(props) {
        Data.#syncProxyData(Data.player.equipments, props);

        Player.updateLayout();
    }

    static setPlayerQuests(props) {
        Data.#syncProxyData(Data.player.quests, props);
    }

    static setRules(props) {
        const { skills, battle, npcs, user, achievements, reward } = props;

        Data.#applyNestedData(Data.rules, { skills, battle, npcs, user, achievements, reward });
    }

    static setStorage(props) {
        DataScheduler.cancel('storage');

        Object.keys(Data.storage).forEach(k => delete Data.storage[k]);

        Object.entries(props).forEach(([key, value]) => {
            Data.storage[key] = DataProxyFactory.createDeep(value, () => Data.#scheduleStorage());
        });

        Data.#scheduleStorage();
    }

    static setStorageUpdated(props) {
        const args = {
            currentData: Data.storage,
            updates: props,
            getId: item => item?.id,
            onCreate: item => DataProxyFactory.createDeep(item, () => Data.#scheduleStorage()),
            onFinish: () => Data.#scheduleStorage()
        };

        Data.setUpdatedData(args);
    }

    static setStatisticsUpdated(props) {
        if (!props || typeof props !== 'object' || Object.keys(props).length === 0) return;

        const statistics = Data.player.statistics;

        Object.entries(props).forEach(([key, data]) => {
            if (typeof statistics[key] === 'object' && statistics[key] !== null) {
                statistics[key].value = data?.value ?? data;
                return;
            }

            statistics[key] = data;
        });

        Data.updatePlayerStatistics();
    }

    static setUpdatedData({ currentData, updates, getId, onCreate, onUpdate, onFinish }) {
        if (!updates || typeof updates !== 'object') return;

        Object.values(updates).forEach(updateItem => {
            if (!updateItem || typeof updateItem !== 'object') return;

            const updateId = getId(updateItem);
            const currentKey = Object.keys(currentData).find(key => getId(currentData[key]) === updateId);
            const isValid = currentKey !== undefined;

            if (isValid) {
                const currentItem = currentData[currentKey];

                Object.entries(updateItem).forEach(([key, value]) => { currentItem[key] = value; });
                onUpdate?.(currentItem, updateItem);

                return;
            }

            currentData[Data.getNextStorageKey(currentData)] = onCreate ? onCreate(updateItem) : updateItem;
        });

        onFinish?.();
    }

    static updateCustomizations() {
        // console.log('Data updateCustomizations()');
    }

    static updateDataPlayer(target) {
        const character = Data.login.characters.find(char => char.id === target);

        Object.entries(character).forEach(([index, props]) => {
            const proxyTarget = Data.player[index];

            if (!proxyTarget || typeof proxyTarget !== 'object') return;

            Object.entries(props).forEach(([key, value]) => {
                const isValid = proxyTarget[key] === undefined;

                if (isValid) proxyTarget[key] = value;
            });
        });

        Player.updateLayout();
    }

    static updateMiniMap() {
        const isElementVisible = ds.Helper.isElementVisible(HTML.elHudPageMap);

        if (!isElementVisible) return;

        HTML.elHudPageMap?.updateData?.();
    }

    static updateOpponentAttributes(property, value) {
        const args = {
            entity: 'opponent',
            category: 'attributes',
            targets: [HTML.elHudModalBattle],
            property,
            value
        };

        DataUpdater.dispatchToTargets(args);
    }

    static updatePlayerAchievements(property, value) {
        const args = {
            entity: 'player',
            category: 'achievements',
            targets: [HTML.elHudPageAchievements],
            property,
            value
        };

        DataUpdater.dispatchToTargets(args);
    }

    static updatePlayerAttributes(property, value) {
        const args = {
            entity: 'player',
            category: 'attributes',
            targets: [
                HTML.elHudStatus,
                HTML.elHudPageAttribute,
                HTML.elHudPageInventory,
                HTML.elHudModalBattle
            ],
            property,
            value
        };

        DataUpdater.dispatchToTargets(args);
    }

    static updatePlayerCustomizations() {
        Player.updateLayout();
    }

    static updatePlayerMap(property, value) {
        const args = {
            entity: 'player',
            category: 'map',
            targets: [HTML.elHudPageMap],
            property,
            value
        };

        DataUpdater.dispatchToTargets(args);
    }

    static updatePlayerQuests(property, value) {
        const args = {
            entity: 'player',
            category: 'quests',
            targets: [HTML.elHudPageQuests],
            property,
            value
        };

        DataUpdater.dispatchToTargets(args);
    }

    static updatePlayerStatistics(property, value) {
        const args = {
            entity: 'player',
            category: 'statistics',
            targets: [HTML.elHudPageStatistics],
            property: property ?? 'statistics',
            value: value ?? true,
        };

        DataUpdater.dispatchToTargets(args);
    }

    static updateRulesSkills(property, value) {
        const args = {
            el: HTML.elHudModalBattle,
            category: 'rules',
            property,
            value
        };

        DataUpdater.scheduleComponentUpdate(args);
    }

    static updateRulesAchievements() {
        const isElementVisible = ds.Helper.isElementVisible(HTML.elHudPageAchievements);

        if (!isElementVisible) return;

        HTML.elHudPageAchievements?.updateData?.();
    }

    static updateSettings(property, value) {
        const args = {
            el: HTML.elHudPageSettings,
            category: 'settings',
            property,
            value
        };

        DataUpdater.scheduleComponentUpdate(args);
    }

    static updateSettingsEffects(property, value) {
        const args = {
            el: HTML.elHudPageSettings,
            category: 'settings.effects',
            property,
            value
        };

        DataUpdater.scheduleComponentUpdate(args);
    }

    static updateSettingsMusic(property, value) {
        const args = {
            el: HTML.elHudPageSettings,
            category: 'settings.music',
            property,
            value
        };

        DataUpdater.scheduleComponentUpdate(args);
    }

    static updateStorage() {
        if (ds.Helper.isElementVisible(HTML.elHudPageInventory)) HudPageInventory?.pageDetail?.redraw();
        if (ds.Helper.isElementVisible(HTML.elHudPageEquipments)) HudPageEquipments?.pageDetail?.redraw();
        if (ds.Helper.isElementVisible(HTML.elHudPageNPC)) {
            HudPageNPC?.pageDetail?.redraw();
            HTML.elHudContentMoney?.redraw();
        }
    }



    static #applyNestedData(target, props) {
        Object.entries(props).forEach(([index, value]) => {
            const proxyTarget = target[index];
            if (!proxyTarget) return;

            if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                Object.entries(value).forEach(([key, val]) => { proxyTarget[key] = val; });

                return;
            }

            target[index] = value;
        });
    }

    static #clearAndRepopulate({ target, source, wrap }) {
        Object.keys(target).forEach(key => delete target[key]);
        Object.entries(source).forEach(([key, value]) => { target[key] = wrap(value, key); });
    }

    static #ensureLoginProxy() {
        if (Data.login) return;

        Data.login = DataProxyFactory.createDeep({}, () => { });
    }

    static #runBatchMethod(entity, category) {
        const method = `update${ds.Helper.capitalizeString(entity)}${ds.Helper.capitalizeString(category)}`;

        if (typeof Data[method] === 'function') Data[method]();
    }

    static #scheduleStorage() {
        DataScheduler.debounce('storage', () => Data.updateStorage());
    }

    static #setGroupValue({ basePath, property, target, prop, value }) {
        const isObject = typeof value === 'object' && value !== null;

        if (isObject) {
            if (!(prop in target)) target[prop] = {};

            target[prop] = DataProxyFactory.createNestedObservable(value, () => {
                DataScheduler.batchDebounce(`${basePath}.${property}`, () => Data.#runBatchMethod(basePath, property));
            });

            DataScheduler.batchDebounce(`${basePath}.${property}`, () => Data.#runBatchMethod(basePath, property));
        } else {
            target[prop] = value;

            const method = `update${ds.Helper.capitalizeString(basePath)}${ds.Helper.capitalizeString(property)}`;

            if (typeof Data[method] === 'function') Data[method](prop, value);
        }

        return true;
    }

    static #syncProxyData(data, props) {
        const nextKeys = Object.keys(props || {});

        Object.keys(data).forEach(key => { if (!nextKeys.includes(key)) delete data[key]; });
        Object.entries(props || {}).forEach(([key, value]) => { data[key] = value; });
    }
}
export class DataProxyFactory {
    static createDeep(target, onChange) {
        if (typeof target !== 'object' || target === null) return target;

        return new Proxy(target, {
            set(obj, prop, value) {
                obj[prop] = DataProxyFactory.createDeep(value, onChange);
                onChange(prop, value);

                return true;
            },
            deleteProperty(obj, prop) {
                delete obj[prop];
                onChange(prop, undefined);

                return true;
            }
        });
    }

    static createGroup({ basePath, properties, onSet, onDelete }) {
        const response = {};

        properties.forEach(property => {
            response[property] = new Proxy({}, {
                set: (target, prop, value) => onSet({ basePath, property, target, prop, value }),
                deleteProperty: (target, prop) => {
                    delete target[prop];
                    onDelete(basePath, property);
                    return true;
                }
            });
        });

        return response;
    }

    static createMap(onChange) {
        const response = new Proxy({}, {
            set(target, property, value) {
                target[property] = value;
                onChange();
                return true;
            }
        });

        return response;
    }

    static createNestedObservable(target, onSchedule) {
        const response = new Proxy(target, {
            set(obj, key, newValue) {
                obj[key] = newValue;
                onSchedule();
                return true;
            }
        });

        return response;
    }
}
export class DataScheduler {
    static #timeouts = new Map();
    static #batches = new Map();

    static batchDebounce(key, fn) {
        DataScheduler.#batches.set(key, fn);
        DataScheduler.debounce('__batch__', () => DataScheduler.#flushBatch());
    }

    static cancel(key) {
        if (!DataScheduler.#timeouts.has(key)) return;
        clearTimeout(DataScheduler.#timeouts.get(key));
        DataScheduler.#timeouts.delete(key);
    }

    static debounce(key, fn) {
        if (DataScheduler.#timeouts.has(key)) clearTimeout(DataScheduler.#timeouts.get(key));
        DataScheduler.#timeouts.set(key, setTimeout(() => {
            fn();
            DataScheduler.#timeouts.delete(key);
        }, 0));
    }


    static #flushBatch() {
        DataScheduler.#batches.forEach(fn => fn());
        DataScheduler.#batches.clear();
    }
}

export class DataUpdater {
    static #pendingUpdates = new Map();

    static dispatchToTargets(props) {
        const { entity, category, targets, property, value } = props;

        targets.forEach(el => {
            const args = {
                el,
                category: `${entity}.${category}`,
                property,
                value
            };

            DataUpdater.scheduleComponentUpdate(args);
        });
    }

    static flush() {
        DataUpdater.#pendingUpdates.forEach((updates, el) => {
            if (!el.updates) el.updates = {};

            Object.entries(updates).forEach(([category, properties]) => {
                const target = category.split('.').reduce((acc, curr) => {
                    if (!acc[curr]) acc[curr] = {};
                    return acc[curr];
                }, el.updates);

                Object.assign(target, properties);
            });

            if (typeof el?.updateData === 'function') el.updateData();
        });

        DataUpdater.#pendingUpdates.clear();
    }

    static scheduleComponentUpdate(props) {
        const { el, category, property, value } = props;

        if (!property || !el) return;

        if (!DataUpdater.#pendingUpdates.has(el)) DataUpdater.#pendingUpdates.set(el, {});

        const elementUpdates = DataUpdater.#pendingUpdates.get(el);

        if (!elementUpdates[category]) elementUpdates[category] = {};

        elementUpdates[category][property] = value;

        DataScheduler.debounce('__components__', () => DataUpdater.flush());
    }
}
export class Emoji {
    static agressive = [
        128520,
        128530,
        128544,
        128545,
        128548,
        128127,
        128128,
        128170,
    ];
    static neutral = [
        128512,
        128513,
        128514,
        128515,
        128516,
        128517,
        128518,
        128521,
        128522,
        128523,
        128524,
        128525,
        128526,
        128527,
        128535,
        128536,
        128537,
        128538,
        128539,
        128540,
        128541,
        128559,
        128563,
        128566,
        128406,
        128077,
        9996,
        129304,
        129305,
        129311,
        129655,
    ];
    static scared = [
        128519,
        128528,
        128529,
        128531,
        128532,
        128533,
        128534,
        128542,
        128543,
        128546,
        128547,
        128549,
        128550,
        128551,
        128552,
        128553,
        128554,
        128555,
        128556,
        128557,
        128558,
        128560,
        128561,
        128562,
        128565,
        128567,
        128078,
        128064,
        128169,
    ];
    static sleepy = [
        128564
    ];

    static activate(entity) {
        const emoji = this.getRandomEmoji(entity);
        this.addEmoji(entity, emoji);

        const remove = () => {
            entity.removeEventListener('mouseenter', remove);
            this.removeEmoji(entity);
        };

        entity.addEventListener('mouseenter', remove);

        setTimeout(remove, 3000);
    }

    static activateChance(entity, behavior, chance = 1) {
        const roll = Math.random() * 100;

        if (roll > chance) return;

        const list = this[behavior] ?? this.neutral;
        const index = Math.floor(Math.random() * list.length);
        const code = list[index];
        const emoji = this.buildEmoji(code);

        this.addEmoji(entity, emoji);

        setTimeout(() => {
            this.removeEmoji(entity);
        }, 2000);
    }

    static activateSleepyPlayer() {
        const player = MapGame.player;

        if (!player) return;

        this.sleepyPrevious = player.getAttribute('action');
        player.setAttribute('action', 'sleep');

        const emoji = this.buildEmoji(this.sleepy[0]);

        this.addEmoji(player, emoji);
    }

    static addEmoji(target, emoji) {
        const value = JSON.stringify(emoji);

        target.setAttribute(ds.Prefix.ATTR_EMOJI, value);
    }

    static buildEmoji(code) {
        const response = `&#${code};`;

        return response;
    }

    static buildReactionEntities() {
        const entity = this.getRandomEntity();

        if (!entity) return;

        this.activate(entity);
    }

    static getRandomEmoji(entity) {
        const behavior = entity.getAttribute(ds.Prefix.ATTR_BEHAVIOR);
        const list = this[behavior] ?? this.neutral;
        const index = Math.floor(Math.random() * list.length);
        const code = list[index];
        const response = this.buildEmoji(code);

        return response;
    }

    static getRandomEntity() {
        const data = HTML.elMapGame.map;

        if (!data || !data.monsters || !data.npcs) return;

        const monsters = data.monsters.map(m => ({
            type: ds.Prefix.MONSTER,
            id: m.id
        }));

        const npcs = data.npcs.map(n => ({
            type: 'npc',
            id: n.id
        }));

        const entities = monsters.concat(npcs);

        if (!entities.length) return null;

        const index = Math.floor(Math.random() * entities.length);
        const entity = entities[index];

        if (entity.type === ds.Prefix.MONSTER) {
            return MapGame.getMonsterById(entity.id);
        }

        return MapGame.getNPCById(entity.id);
    }

    static removeSleepyPlayer() {
        const player = MapGame.player;

        if (!player) return;

        const previous = this.sleepyPrevious ?? 'stand';

        player.setAttribute('action', previous);

        this.removeEmoji(player);
    }

    static removeEmoji(target) {
        target.removeAttribute(ds.Prefix.ATTR_EMOJI);
    }
}
export class FetchData {
    static namespaceGame = 'Game/';
    static namespaceLogin = 'Login/';
    static controller = {
        game: {
            advertising: `${this.namespaceGame}Advertising`,
            battle: `${this.namespaceGame}Battle`,
            character: `${this.namespaceGame}Character`,
            item: `${this.namespaceGame}Item`,
            map: `${this.namespaceGame}Map`,
            npc: `${this.namespaceGame}NPC`,
            store: `${this.namespaceGame}Store`,
            user: `${this.namespaceGame}User`,
        },
        login: `${this.namespaceLogin}Login`,
    };



    static async acceptQuest(props) {
        const controller = this.controller.game.npc;
        const { id, npc } = props;
        const args = {
            controller,
            action: 'acceptQuest',
            id,
            npc,
        };
        const response = await this.fetchData(args);

        return response;
    }

    static async applyCustomization(props) {
        const controller = this.controller.game.npc;
        const { npc, customizations } = props;
        const args = {
            controller,
            action: 'applyCustomization',
            npc,
            customizations
        };
        const response = await this.fetchData(args);

        return response;
    }

    static async buildBattle(props) {
        const {
            id,
        } = props;
        const controller = this.controller.game.battle;
        const args = {
            controller,
            action: 'buildBattle',
            idMonster: id,
        };
        const response = await this.fetchData(args);

        return response;
    }

    static async buyItem(props) {
        const controller = this.controller.game.npc;
        const { id, il, npc, quantity } = props;
        const args = {
            controller,
            action: 'buyItem',
            id,
            il,
            npc,
            quantity,
        };
        const response = await this.fetchData(args);

        return response;
    }

    static async buyCustomization(props) {
        const controller = this.controller.game.npc;
        const { npc, customizations } = props;
        const args = {
            controller,
            action: 'buyCustomization',
            npc,
            customizations
        };
        const response = await this.fetchData(args);

        return response;
    }

    static async changeMap(props) {
        const controller = this.controller.game.map;
        const args = {
            controller,
            action: 'changeMap',
            door: props.door,
        };
        const response = await this.fetchData(args);

        return response;
    }

    static async createNewCharacter(props) {
        const { name, customizations, classId } = props;
        const controller = this.controller.game.character;
        const args = {
            controller,
            action: 'createNewCharacter',
            name,
            customizations,
            classId
        };
        const response = await this.fetchData(args);

        return response;
    }

    static async deleteCharacter(props) {
        const { id } = props;
        const controller = this.controller.game.character;
        const args = {
            controller,
            action: 'deleteCharacter',
            id,
        };
        const response = await this.fetchData(args);

        return response;
    }

    static async createStoreTransaction(props) {
        const { packageId, paymentMethod } = props;
        const controller = this.controller.game.store;
        const args = {
            controller,
            action: 'createTransaction',
            packageId,
            paymentMethod
        };
        const response = await this.fetchData(args);

        return response;
    }

    static async getSlotPackages() {
        const controller = this.controller.game.store;
        const args = {
            controller,
            action: 'getSlotPackages'
        };
        const response = await this.fetchData(args);

        return response;
    }

    static async deleteAccount(props) {
        const { password } = props;
        const controller = this.controller.game.user;
        const args = {
            controller,
            action: 'deleteAccount',
            password
        };
        const response = await this.fetchData(args);

        return response;
    }

    static async deleteItem(props) {
        const { id, il, quantity } = props;
        const controller = this.controller.game.item;
        const args = {
            controller,
            action: 'delete',
            id,
            il,
            quantity
        };
        const response = await this.fetchData(args);

        return response;
    }

    static async depositItem(props) {
        const controller = this.controller.game.npc;
        const { id, il, npc, quantity } = props;
        const args = {
            controller,
            action: ds.Prefix.DEPOSIT,
            id,
            il,
            npc,
            quantity
        };
        const response = await this.fetchData(args);

        return response;
    }

    static async equipItem(props) {
        const { id, il } = props;
        const controller = this.controller.game.item;
        const args = {
            controller,
            action: 'equip',
            id,
            il,
        };
        const response = await this.fetchData(args);

        return response;
    }

    static async fetchData(props) {
        const response = await this.reloadOnInvalidToken(() => ds.DataLoader.fetchData(props));

        if (response) Data.setData(response);

        return response;
    }

    static async reloadOnInvalidToken(request) {
        const response = await request();

        if (response?.isError && response?.errorMessage === ds.Prefix.TOKEN_INVALID) {
            location.reload();
        }

        return response;
    }

    static async finishQuest(props) {
        const controller = this.controller.game.npc;
        const { id, npc } = props;
        const args = {
            controller,
            action: 'finishQuest',
            id,
            npc,
        };
        const response = await this.fetchData(args);

        return response;
    }

    static async getCharacter(id) {
        const controller = this.controller.game.character;
        const args = {
            controller,
            action: 'getCharacter',
            id
        };
        const response = await this.fetchData(args);

        return response;
    }

    static async getCraftReward(npc) {
        const controller = this.controller.game.npc;
        const args = {
            controller,
            action: 'getCraftReward',
            npc
        };
        const response = await this.fetchData(args);

        return response;
    }

    static async getLoginData() {
        const controller = this.controller.game.user;
        const args = {
            controller,
            action: 'getData',
        };
        const response = await this.fetchData(args);

        return response;
    }

    static async getMap(props) {
        const {
            map,
            door,
            position = 0,
        } = props;
        const controller = this.controller.game.map;
        const args = {
            controller,
            action: 'getMap',
            map,
            door,
            position
        };
        const response = await this.fetchData(args);

        return response;
    }

    static async getNPC(target) {
        const controller = this.controller.game.npc;
        const args = {
            controller,
            action: 'talk',
            name: target
        };
        const response = await this.fetchData(args);

        return response;
    }

    static async getSkill(props) {
        const { action, id, il, quantity } = props;
        const controller = this.controller.game.battle;
        const capitalizeSkill = ds.Helper.capitalizeString(action);
        const args = {
            controller,
            action: `getSkill${capitalizeSkill}`,
        };

        if (id) args.id = id;
        if (il) args.il = il;
        if (quantity) args.quantity = quantity;

        const response = await this.fetchData(args);

        return response;
    }

    static async getSkillOpponent() {
        const controller = this.controller.game.battle;
        const args = {
            controller,
            action: 'getSkillOpponent',
        };
        const response = await this.fetchData(args);

        return response;
    }

    static async getStorePackages() {
        const controller = this.controller.game.store;
        const args = {
            controller,
            action: 'getPackages',
        };
        const response = await this.fetchData(args);

        return response;
    }

    static async getStorePaymentMethods() {
        const controller = this.controller.game.store;
        const args = {
            controller,
            action: 'getPaymentMethods',
        };
        const response = await this.fetchData(args);

        return response;
    }

    static async getStoreTransactionStatus(props) {
        const controller = this.controller.game.store;
        const { transactionId, paymentMethod } = props;
        const args = {
            controller,
            action: 'getTransactionStatus',
            transactionId,
            paymentMethod,
        };
        const response = await this.fetchData(args);

        return response;
    }

    static async logOut() {
        const controller = this.controller.login;
        const args = {
            controller,
            action: 'logOut',
        };
        const response = await this.fetchData(args);

        return response;
    }

    static async pickUpCollectable(id) {
        const controller = this.controller.game.map;
        const args = {
            controller,
            action: 'pickUpCollectable',
            id
        };
        const response = await this.fetchData(args);

        return response;
    }

    static async repairCombat(props) {
        const controller = this.controller.game.npc;
        const { ids, npc } = props;
        const args = {
            controller,
            action: 'repairCombat',
            ids,
            npc,
        };
        const response = await this.fetchData(args);

        return response;
    }

    static async repairMagic(props) {
        const controller = this.controller.game.npc;
        const { ids, npc } = props;
        const args = {
            controller,
            action: 'repairMagic',
            ids,
            npc,
        };
        const response = await this.fetchData(args);

        return response;
    }

    static async sellItem(props) {
        const controller = this.controller.game.npc;
        const { id, il, npc, quantity } = props;
        const args = {
            controller,
            action: ds.Prefix.SELL,
            id,
            il,
            npc,
            quantity
        };
        const response = await this.fetchData(args);

        return response;
    }

    static async speedUpCraft(props) {
        const controller = this.controller.game.npc;
        const { npc } = props;
        const args = {
            controller,
            action: 'speedUpCraft',
            npc,
        };
        const response = await this.fetchData(args);

        return response;
    }

    static async submitAdvertising(props) {
        const controller = this.controller.game.advertising;
        const { kind, link } = props;
        const args = {
            controller,
            action: 'submit',
            kind,
            link,
        };
        const response = await this.fetchData(args);

        return response;
    }

    static async setCharacterStory(props) {
        const controller = this.controller.game.character;
        const { idCharacter, act, scene } = props;
        const args = {
            controller,
            action: 'setStory',
            idCharacter,
            act,
            scene,
        };
        const response = await this.fetchData(args);

        return response;
    }

    static async setEmail(props) {
        const { email, password } = props;
        const controller = this.controller.game.user;
        const args = {
            controller,
            action: 'setEmail',
            email,
            password
        };
        const response = await this.fetchData(args);

        return response;
    }

    static async setUsername(props) {
        const { username, password } = props;
        const controller = this.controller.game.user;
        const args = {
            controller,
            action: 'setUsername',
            username,
            password
        };
        const response = await this.fetchData(args);

        return response;
    }

    static async setPassword(props) {
        const { password, passwordNew } = props;
        const controller = this.controller.game.user;
        const args = {
            controller,
            action: 'setPassword',
            password,
            passwordNew
        };
        const response = await this.fetchData(args);

        return response;
    }

    static async setNewsletter(props) {
        const { newsletter } = props;
        const controller = this.controller.game.user;
        const args = {
            controller,
            action: 'setNewsletter',
            newsletter
        };
        const response = await this.fetchData(args);

        return response;
    }

    static async setUserDataEmail() {
        const controller = this.controller.login;
        const args = {
            controller,
            action: 'setUserEmail',
        };
        const response = await this.fetchData(args);

        return response;
    }

    static async startCraft(props) {
        const controller = this.controller.game.npc;
        const { id, il, npc, quantity } = props;
        const args = {
            controller,
            action: 'startCraft',
            id,
            il,
            npc,
            quantity,
        };
        const response = await this.fetchData(args);

        return response;
    }

    static async unequipItem(props) {
        const { id, il } = props;
        const controller = this.controller.game.item;
        const args = {
            controller,
            action: 'unequip',
            id,
            il
        };
        const response = await this.fetchData(args);

        return response;
    }

    static async useItem(props) {
        const { id, il, quantity } = props;
        const controller = this.controller.game.item;
        const args = {
            controller,
            action: 'useItem',
            id,
            il,
            quantity
        };
        const response = await this.fetchData(args);

        return response;
    }

    static async withdrawItem(props) {
        const controller = this.controller.game.npc;
        const { id, il, npc, quantity } = props;
        const args = {
            controller,
            action: ds.Prefix.WITHDRAW,
            id,
            il,
            npc,
            quantity
        };
        const response = await this.fetchData(args);

        return response;
    }

    static async openBank() {
        const controller = this.controller.game.npc;
        const args = {
            controller,
            action: 'openBank',
        };
        const response = await this.fetchData(args);

        return response;
    }
}
export class Hotkeys {
    static addEventListeners() {
        document.addEventListener('keydown', (event) => {
            if (Hotkeys.isInputFocused(event)) return;

            const key = event.key.toLowerCase();
            const isBattle = Battle.isBattle;
            const preventReload = [
                event.key === 'F5',
                event.ctrlKey && key === 'r',
                event.ctrlKey && event.shiftKey && key === 'r',
                event.ctrlKey && event.key === 'F5',
                event.ctrlKey && event.shiftKey && event.key === 'F5',
                event.metaKey && key === 'r',
                event.metaKey && event.shiftKey && key === 'r',
                event.ctrlKey && key === 'w',
                event.metaKey && key === 'w'
            ].some(Boolean);

            if (preventReload && isBattle) {
                event.preventDefault();
                event.stopPropagation();
                return;
            }

            const data = this.getData(event.key, 'key');
            const action = data?.action;
            const isGameKey = data?.isGameKey;
            const isPlaying = HTML?.elGame?.isPlaying;
            const isValid = this.isValidAction({
                isGameKey,
                isPlaying
            });

            if (isValid) this.runAction(action);
        }, true);


        window.addEventListener('beforeunload', (event) => {
            const isBattle = Battle.isBattle;

            if (!isBattle) return;

            event.preventDefault();
            event.returnValue = '';
        });
    }

    static buildAction(argsObjectAction) {
        const response = () => {
            argsObjectAction?.callback?.();
        };

        return response;
    }

    static buildActionOpenPage(page, position) {
        const response = this.buildAction({
            callback: () => {
                HTML.elHud.openPage({
                    detail: {
                        pageTarget: page,
                        pagePosition: position
                    }
                });
            }
        });

        return response;
    }

    static getAction(target) {
        const response = this.getData(target)?.action;

        return response;
    }

    static getData(target, prop = 'id') {
        const hotkeys = Statics.hotkeys;
        const response = hotkeys.find(property => property[prop] === target);

        return response;
    }

    static getKey(target) {
        const response = this.getData(target)?.key;

        return response;
    }

    static init() {
        this.addEventListeners();
    }

    static isInputFocused(event) {
        const path = event.composedPath ? event.composedPath() : [event.target, document.activeElement];

        return path.some(el => {
            if (!el || !el.tagName) return false;

            const tagName = el.tagName.toLowerCase();

            return tagName === 'input' || tagName === 'textarea' || el.isContentEditable;
        });
    }

    static isValidAction(argsObjectAction) {
        const isGameKey = argsObjectAction?.isGameKey;
        const isPlaying = argsObjectAction?.isPlaying;
        let response = true;

        if (isGameKey && !isPlaying) response = false;

        return response;
    }

    static runAction(action) {
        if (typeof action !== 'function') return;

        action();
    }
}
export class HTML {
    static idHud = 'hud';
    static idHudModal = 'hud_modal';
    static idHudMenu = 'hud_menu';
    static idTransition = 'hud_transition';
    static idHudPageLeft = 'hud_page_left';
    static idHudPageRight = 'hud_page_right';
    static idHudProgressExperience = 'hud_progress_experience';
    static idHudProgressLife = 'hud_progress_life';
    static idHudProgressMana = 'hud_progress_mana';
    static idHudStatus = 'hud_status';
    static idHudFooter = 'hud_footer';
    static idTooltipArrow = 'tooltip_arrow';
    static idGame = 'game';
    static idGameBattle = 'game_battle';
    static idGameMain = 'game_main';
    static idMapGame = 'game_map';
    static idGamePlayer = 'game_player';




    static get elGame() {
        const response = this.elHud.shadowRoot.getElementById(this.idGame);

        return response;
    }

    static get elGamePlayer() {
        const response = this.elMapGame.shadowRoot.getElementById(this.idGamePlayer);

        return response;
    }

    static get elGameBattle() {
        const response = this.elGame.shadowRoot.getElementById(this.idGameBattle);

        return response;
    }

    static get elGameMain() {
        const response = this.elGame.shadowRoot.getElementById(this.idGameMain);

        return response;
    }

    static get elHudContentMoney() {
        const dataId = `[data-id="${ds.Page.dataIdPage}"]`;
        const component = Components.cHudContentMoney;
        const response = this.elHudPageNPC.shadowRoot.querySelector(dataId)?.shadowRoot.querySelector(component);

        return response;
    }

    static get elHudPageAchievements() {
        const response = this.getPage('achievements');

        return response;
    }

    static get elHudPageAttributes() {
        const response = this.getPage('attributes');

        return response;
    }

    static get elHudPageBattle() {
        const response = this.getPage('battle');

        return response;
    }

    static get elHudPageDetail() {
        const response = this.getPage('detail');

        return response;
    }

    static get elHudPageEquipments() {
        const response = this.getPage('equipments');

        return response;
    }

    static get elHudPageInventory() {
        const response = this.getPage('inventory');

        return response;
    }

    static get elHudPageMap() {
        const response = this.getPage('map');

        return response;
    }

    static get elHudPageNPC() {
        const response = this.getPage('npc');

        return response;
    }

    static get elHudPageQuests() {
        const response = this.getPage('quests');

        return response;
    }

    static get elHudPageSettings() {
        const response = this.getPage('settings');

        return response;
    }

    static get elHudPageStatistics() {
        const response = this.getPage('statistics');

        return response;
    }

    static get elHud() {
        const response = document.getElementById(this.idHud);

        return response;
    }

    static get elHudMenu() {
        const response = this.elHud.shadowRoot.getElementById(this.idHudMenu);

        return response;
    }

    static get elHudPageLeft() {
        const response = this.elHud.shadowRoot.getElementById(this.idHudPageLeft);

        return response;
    }

    static get elHudPageRight() {
        const response = this.elHud?.shadowRoot.getElementById(this.idHudPageRight);

        return response;
    }

    static get elHudProgressExperience() {
        const response = this.elHud.shadowRoot.getElementById(this.idHudProgressExperience);

        return response;
    }

    static get elHudProgressLife() {
        const response = this.elHud.shadowRoot.getElementById(this.idHudProgressLife);

        return response;
    }

    static get elHudProgressMana() {
        const response = this.elHud.shadowRoot.getElementById(this.idHudProgressMana);

        return response;
    }

    static get elHudModal() {
        const response = this.elHud.shadowRoot.getElementById(this.idHudModal);

        return response;
    }

    static get elHudStatus() {
        const response = this.elHud.shadowRoot.getElementById(this.idHudStatus);

        return response;
    }

    static get elHudFooter() {
        const response = this.elHud.shadowRoot.getElementById(this.idHudFooter);

        return response;
    }

    static get elMapGame() {
        const response = this.elGame.shadowRoot.getElementById(this.idMapGame);

        return response;
    }

    static get elMapGameTiles() {
        const response = this.elMapGame.shadowRoot.getElementById(this.idMapGame);

        return response;
    }

    static get elTransition() {
        const response = this.elHud.shadowRoot.getElementById(this.idTransition);

        return response;
    }

    static getPage(page) {
        const length = ds.Components.prefixComponent.length;
        const component = Components.buildHudPageName(page).slice(length);
        const response = this.elHud.shadowRoot.querySelector(`[page="${component}"]`);

        return response;
    }
}
export class Interval {
    static interval = 1000;
    static idleTime = 60000;

    static countEmoji = 0;

    static lastActivity = Date.now();
    static lastActivityEvent = 0;

    static sleepyActive = false;

    static init() {
        this.registerActivity();

        setInterval(() => {
            this.update();
        }, this.interval);
    }

    static registerActivity() {
        const update = () => {
            const now = Date.now();

            if (now - this.lastActivityEvent < 500) return;

            this.lastActivityEvent = now;
            this.lastActivity = now;

            if (this.sleepyActive) {
                this.sleepyActive = false;
                Emoji.removeSleepyPlayer();
            }
        };

        document.addEventListener('pointermove', update);
        document.addEventListener('keydown', update);
        document.addEventListener('mousedown', update);
    }

    static update() {
        if (Battle.isBattle) return;

        this.updateEmoji();
        this.updateSleepy();
    }

    static updateEmoji() {
        this.countEmoji++;

        if (this.countEmoji < 5) return;

        this.countEmoji = 0;

        Emoji.buildReactionEntities();
    }

    static updateSleepy() {
        const idleTime = Date.now() - this.lastActivity;

        if (idleTime < this.idleTime) return;
        if (this.sleepyActive) return;

        this.sleepyActive = true;

        Emoji.activateSleepyPlayer();
    }
}
export class Layout {
    static game = {
        height: 0,
        width: 0
    };
    static screen = {
        height: 0,
        width: 0
    };
    static idSeparator = '_';



    static addEventListeners() {
        window.addEventListener('resize', () => {
            this.resize();
            Camera.center();
            ds.Tooltip?.elTooltipWrapper?.handleMouseOut();
        });
    }

    static buildCardItem(props) {
        const { item, id, index, isPrice, isFooter } = props;
        const durabilityStorage = Storage.getItemDurabilityById(id);
        const quantityItem = Storage.buildItem(index).quantity;
        const itemTarget = item?.id_lore ? item.id_lore : item;
        const itemId = id ?? item?.id ?? item?.id_lore ?? index?.id ?? index?.[0] ?? itemTarget;
        const argsItem = {
            target: itemTarget,
            quantity: quantityItem
        };
        const itemProperties = Storage.getProperties(argsItem);
        const isDurability = itemProperties?.isDurability;
        const quantity = argsItem.quantity;
        const itemData = {
            isDurability,
            quantity,
            id: itemId,
            item: itemProperties?.idLore ?? itemTarget,
            id_lore: itemProperties?.idLore ?? itemTarget,
            idLore: itemProperties?.idLore ?? itemTarget,
            kind: itemProperties?.itemLoot?.kind,
        };
        const dataHandlerProps = `[${ds.Helper.buildJSONToHTML(itemData)}]`;
        const argsIcon = { item, isDurability, durabilityStorage };
        const icon = lo.HTML.drawLoot(argsIcon);
        const args = { dataHandlerProps, icon, quantity, isPrice, isFooter };
        const response = this.drawCardItem(args);

        return response;
    }

    static buildEffectTime(seconds) {
        const translation = ds.Translation.gameGeneric;
        let value = seconds;
        let label = translation?.time_second;

        const secondsMinute = 60;
        const secondsHour = 3600;
        const secondsDay = 86400;
        const hasDayTranslation = !!translation?.time_day;

        if (value >= secondsDay && hasDayTranslation) {
            value = Math.floor(value / secondsDay);
            label = translation.time_day;
        } else if (value >= secondsHour) {
            value = Math.floor(value / secondsHour);
            label = translation?.time_hour ?? label;
        } else if (value >= secondsMinute) {
            value = Math.floor(value / secondsMinute);
            label = translation?.time_minute ?? label;
        }

        const unit = label.replace('(s)', '');
        const response = `${value} ${value === 1 ? unit : `${unit}s`}`;

        return response;
    }

    static buildId(id, index) {
        const response = `${id + this.idSeparator + index}`;

        return response;
    }

    static changeThemeButton(button, theme = ds.Layout.theme.menuDefault) {
        const response = Statics.buttons[button];

        response.theme = theme;

        return response;
    }

    static drawButtonComponent(props) {
        const { id, label, handler, handlerProps, theme, isDisabled = false } = props;
        const componentButton = ds.Components.componentButton;
        const response = `
            <${componentButton}
                data-id="${id}"
                theme="${theme}"
                size="small"
                label="${label}"
                data-handler="${handler}"
                data-handler-props='${handlerProps}'
                data-kind='button'
                is-disabled="${isDisabled}"
            ></${componentButton}>
        `;

        return response;
    }

    static drawCardItem(props) {
        const {
            icon,
            quantity,
            dataHandlerProps,
            isPrice,
            isFooter = true
        } = props;
        const cssCard = ds.Layout.theme.card;
        const coin = isPrice ? '<span class="ds-color-black--light">$</span> ' : '';
        const footerHTML = `
            <div class="ds-card__footer ds-right">
                <div class="ds-truncate">
                    ${coin}
                    ${quantity}
                </div>
            </div>
        `;
        const footer = isFooter ? footerHTML : '';
        const response = `
            <button
                class="ds-card--small gm-card__item ${cssCard}"
                type="button"
                data-handler="handleOpenDetails"
                data-handler-props='${dataHandlerProps}'
                data-kind='button'
            >
                <div class="ds-card__header">
                </div>
                <div class="ds-card__body">
                    ${icon}
                </div>
                ${footer}
            </button>
        `;

        return response;
    }

    static drawCardItemList(items, isShowMoney = true) {
        let cards = '';

        items.forEach((index) => {
            const il = index.id_lore;
            const id = index.id;
            const argsItem = {
                target: il,
                quantity: index.quantity
            };
            const itemProperties = Storage.getProperties(argsItem);
            const kind = itemProperties.itemLoot.kind;
            const isMoney = isShowMoney ? false : Storage.getItemKind(kind).isMoney;
            if (!isMoney) {
                const args = {
                    item: il,
                    index,
                    id
                };
                cards += this.buildCardItem(args);
            }
        });

        const response = this.drawCardWrapper(cards);

        return response;
    }

    static drawCardWrapper(items) {
        const response = `
            <div class="ds-row ds-card-wrapper">
                ${items}
            </div>
        `;

        return response;
    }

    static drawEmpty(text) {
        const content = text ? text : ds.Translation.gameGeneric.no_data_yet;
        const response = `
            <div class="ds-row gm-text-empty gm-text-destak">
                ${content}
            </div>
        `;

        return response;
    }

    static drawEmptyContent() {
        const translation = ds.Translation.interfaceDefault.no_items;
        const response = this.drawEmpty(translation);

        return response;
    }

    static drawEmptyQuest() {
        const translation = ds.Translation.getTranslationPage('quest').empty;
        const response = this.drawEmpty(translation);

        return response;
    }

    static drawSubtitle(text) {
        const response = `
            <div class="ds-row ds-center">
                <h2 class="ds-title">${text}</h2>
            </div>
        `;

        return response;
    }

    static drawTable(header, content) {
        const contentTr = this.drawTableTr(header);
        const css = ds.Layout.theme.table;
        const response = `
            <table class="${css}">
                <thead>
                    ${contentTr}
                </thead>
                <tbody>
                    ${content}
                </tbody>
            </table>
        `;

        return response;
    }

    static drawTableTr(content) {
        const response = `<tr>${content}</tr>`;

        return response;
    }

    static drawTextItemQuantity(target, quantity) {
        const item = Storage.getProperties({ target });
        const itemName = item.translationName;
        const text = `${itemName} (${quantity}). `;
        const response = ds.Layout.buildSpan(text);

        return response;
    }

    static resize() {
        this.game.width = HTML.elGame?.offsetWidth;
        this.game.height = HTML.elGame?.offsetHeight;
        this.screen.width = window.innerWidth;
        this.screen.height = window.innerHeight;
    }

    static toggleButtonDisabled(isEnabled, button) {
        if (!button) return;

        if (isEnabled) {
            button.removeAttribute(ds.Prefix.ATTR_IS_DISABLED);
        } else {
            button.setAttribute(ds.Prefix.ATTR_IS_DISABLED, 'true');
        }
    }

    static replaceInText(text, isRuleLayout = false) {
        const ruleList = Data.rules;
        const args = {
            text,
            isRuleLayout,
            ruleList,
        };
        const response = ds.Helper.replaceInText(args);

        return response;
    }

    static unBuildId(prefix, id) {
        const lenght = prefix.length + this.idSeparator.length;
        const response = id.substring(lenght);

        return response;
    }
}
export class Management {
    static temp = {};

    static applyTranslation() {
        HTML.elHudStatus.updateData?.();
        HTML.elHudMenu.updateData?.();
    }

    static async buildGameByCharacterId(id) {
        HTML.elGame.setIsPlaying(true);
        HTML.elTransition.openByKind('tip');

        const characterData = await FetchData.getCharacter(id);

        const args = {
            character: id,
            map: characterData.map,
            door: 0
        };

        const isDeathPenalty = characterData.player.isDeathPenalty ?? false;

        if (isDeathPenalty) {
            Battle.showDeathPenalty();
        }

        await MapGame.updateDataMap(args);

        Player.id = id;

        Data.updateDataPlayer(id);

        Camera.center();

        HTML.elTransition.close();

        Tutorial.showAct1Scene1();
    }

    static init(props) {
        deps = props;
        ds = deps.ds;
        lo = deps.lo;

        ds.Helper.addEventListenerDOM(this);
        ds.Tooltip.init();
        ds.Notification.init();
        ds.Analytics.load();

        Data.init();

        Layout.addEventListeners();

        this.initComponents();
    }

    static initClasses() {
        HTML.elTransition?.init();
        Hotkeys.init();
        Settings.init();
        Interval.init();
    }

    static initComponents() {
        const component = Components.cHud;
        const html = `
            <${component}
                id="${HTML.idHud}"
            ></${component}>
        `;
        const args = { html };
        ds.Components.insert(args);

        ds.Components.init(Components.components);
    }

    static async handleLoaded() {
        this.initClasses();

        await Statics.update();

        await this.translate();

        await FetchData.getLoginData();

        HTML.elHud?.openModalSelectCharacter(false);
        this.removeTransition();
    }

    static removeTransition() {
        setTimeout(() => {
            if (HTML.elTransition) HTML.elTransition.isInitial = false;
            if (HTML.elHud) HTML.elHud.close(HTML.elTransition);
        }, HTML.elTransition?.timeout);
    }

    static play(event) {
        const id = event?.currentTarget?.id ?? event;

        ds.Page.currentFilter = undefined;

        HTML.elHudModal.setAttribute('is-close-button', true);

        HTML.elHud.closeModal();
        HTML.elHud.closeHudPages();

        Audio.init();

        const character = Data.login?.characters?.find(c => c.id === Number(id));

        Analytics.send({
            event_name: 'game_start',
            character_id: id,
            character_level: character?.attributes?.level,
            character_class: character?.attributes?.class,
        });

        Management.buildGameByCharacterId(Number(id));
    }

    static async translate() {
        await ds.Translation.translate('game');
        await ds.Translation.translate('dialog');
        await ds.Translation.translate('interface');
        await ds.Translation.translate('login');

        this.applyTranslation();
    }
}
export class Monsters {
    static prefix = 'monster';



    static addClick() {
        const el = HTML.elMapGame.shadowRoot.querySelectorAll(`[data-id='${this.prefix}']`);

        HTML.elMapGame.addClick(el);
    }

    static getById(id) {
        const response = ds.Helper.findById(ds.Modules.monsters, id);

        return response;
    }

    static draw(target) {
        const translationMonster = ds.Translation.gameMonster;
        const translationLevel = ds.Translation.interface.page_attribute.level;
        let response = '';

        target.forEach((index) => {
            const attributes = index.attributes;
            const behavior = attributes.behavior;
            const level = index.level;
            const monsterData = this.getById(index.idMonster);
            const kind = monsterData?.translation;
            const walk = monsterData?.walk;
            const translationName = translationMonster[kind];
            const tooltip = `
                ${ds.Helper.escapeHTML(translationName)}. <br/>
                ${translationLevel}: <span>${level}</span>
            `;
            const id = Layout.buildId(this.prefix, index.id);
            const el = `
                <${lo.Components.entity}
                    id="${id}"
                    class="gm-alive gm-monster"
                    ${ds.Layout.attributePositionX}=""
                    ${ds.Layout.attributePositionY}=""
                    data-level="${level}"
                    data-id="${this.prefix}"
                    data-kind="${ds.Helper.escapeHTML(kind)}"
                    data-tooltip="${tooltip}"
                    data-behavior="${behavior}"
                    data-walk-steps="${walk}"
                    data-speed="${attributes.speed ?? 300}"
                    kind="${this.prefix}"
                    entity="${this.prefix}"
                    direction="down"
                    action="stand"
                    is-walk-back="false"
                    tabindex="-1"
                ></${lo.Components.entity}>
            `;

            response += el;
        });

        return response;
    }

    static setPosition() {
        const elements = HTML.elMapGame.shadowRoot.querySelectorAll(`[data-id="${this.prefix}"]`);

        MapGame.setPositionEntity(elements);
    }

    static unBuildId(id) {
        const response = Layout.unBuildId(this.prefix, id);

        return response;
    }
}
export class Notification {
    static colorDefault = 'orange';
    static colorError = 'red';





    static add(props) {
        const {
            content,
            color = Notification.colorDefault,
            position = 'right',
            size = 'regular'
        } = props;

        if (Notification.#isContentVisible(content)) return;

        const args = {
            content,
            color,
            position,
            size
        };

        ds.Notification.add(args);
    }





    static #isContentVisible(content) {
        const items = document.querySelectorAll('.ds-notification__text');

        for (const item of items) {
            if (item.textContent.trim() === content) return true;
        }

        return false;
    }
}
export class NPCs {
    static prefix = 'npc';



    static addClick() {
        const el = HTML.elMapGame.shadowRoot.querySelectorAll(`[kind='${this.prefix}']`);

        el.forEach(index => {
            this.addListener(index);
        });
    }

    static addListener(target) {
        const name = target.getAttribute('data-name');
        const id = target.getAttribute('data-id');

        target.addEventListener('click', () => {
            const isValidDistance = this.isValidDistance(target);

            if (isValidDistance) {
                if (this.isInMaintenance(name)) {
                    this.showMaintenanceError();

                    return;
                }

                HudPageNPC.id = Number(id);

                const args = {
                    detail: {
                        pageTarget: `${this.prefix}-${name}`,
                        pagePosition: 'left',
                        isNPC: true,
                        name
                    }
                };
                HTML.elHud.openPage(args);
            } else {
                this.showDistanceError();
            }
        });
    }

    static buildPosition(target) {
        const response = target.npcs.map(index => ({
            id: index.id_npc,
            position: [
                index.position_x,
                index.position_y
            ]
        }));

        return response;
    }

    static draw(target) {
        let response = '';

        target.forEach((index) => {
            const dataId = index.id;
            const id = Layout.buildId(this.prefix, index.id);
            const position = index.position;
            const positionX = position[0];
            const positionY = position[1];
            const customizations = ds.Helper.buildJSONToHTML(index.customizations);
            const equipments = ds.Helper.buildJSONToHTML(index.equipments);
            const name = ds.Helper.escapeHTML(index.name);
            const tooltip = `${name}`;
            const steps = index.steps;
            const walkRadius = index.walkRadius;

            response += `
                <${lo.Components.entity}
                    id="${id}"
                    class="gm-alive gm-person gm-npcs"
                    ${ds.Layout.attributePositionX}="${positionX}"
                    ${ds.Layout.attributePositionY}="${positionY}"
                    ${ds.Layout.attributePositionXInitial}="${positionX}"
                    ${ds.Layout.attributePositionYInitial}="${positionY}"
                    data-tooltip="${tooltip}"
                    data-id="${dataId}"
                    data-walk-steps="${steps}"
                    data-speed="300"
                    data-name="${name}"
                    data-walk-radius="${walkRadius}"
                    kind="${this.prefix}"
                    entity="person"
                    direction="down"
                    action="stand"
                    is-walk-back="true"
                    customizations=${customizations}
                    equipments=${equipments}
                    tabindex="-1"
                ></${lo.Components.entity}>
            `;
        });

        return response;
    }

    static getData(id) {
        const response = ds.Modules.npcs.find(index => index.id === Number(id));

        return response;
    }

    static getTranslationDistance() {
        const response = ds.Translation.dialogDefault?.need_be_close;

        return response;
    }

    static getTranslationMaintenance() {
        const response = ds.Translation.dialogDefault?.npc_unavailable;

        return response;
    }

    static get isBankLevel() {
        const levelRequired = Data.rules.npcs.bank.level;
        const levelCharacter = Player.attributes.level;
        let response = false;

        if (levelCharacter >= levelRequired) return true;

        return response;
    }

    static isInMaintenance(name) {
        const maintenance = Data.rules?.npcs?.maintenanceNPCS;

        if (!maintenance) return false;

        const response = Boolean(maintenance[name?.toLowerCase()]);

        return response;
    }

    static isValidDistance(target) {
        const getAtt = (attribute) => ds.Layout[`attributePosition${attribute}`];
        const getValue = (index, attribute) => Number(index.getAttribute(getAtt(attribute)));
        const player = HTML.elGamePlayer;
        const targetX = getValue(target, 'X');
        const targetY = getValue(target, 'Y');
        const playerX = getValue(player, 'X');
        const playerY = getValue(player, 'Y');
        const distanceDefault = 5;
        const distanceX = Math.abs(targetX - playerX);
        const distanceY = Math.abs(targetY - playerY);
        const isDistanceX = distanceX <= distanceDefault;
        const isDistanceY = distanceY <= distanceDefault;
        const response = isDistanceX && isDistanceY;

        return response;
    }

    static setPosition(target) {
        target.forEach((index) => {
            const id = index.id;
            const el = HTML.elMapGame.shadowRoot.getElementById(`${this.prefix}_${id}`);
            const args = {
                target: el,
                positionX: el.getAttribute(ds.Layout.attributePositionX),
                positionY: el.getAttribute(ds.Layout.attributePositionY)
            };

            HTML.elMapGame.setPosition(args);
        });
    }

    static showDistanceError() {
        const transitionDistance = this.getTranslationDistance();
        const argsNotification = {
            content: transitionDistance,
            color: 'orange',
            position: 'right',
            size: 'regular'
        };

        ds.Notification.add(argsNotification);
    }

    static showMaintenanceError() {
        const translation = this.getTranslationMaintenance();
        const argsNotification = {
            content: translation,
            color: 'orange',
            position: 'right',
            size: 'regular'
        };

        ds.Notification.add(argsNotification);
    }

    static updateDataNPC(map) {
        const npcs = map.npcs;

        npcs.forEach((index) => {
            const id = index.id;
            const data = NPCs.getData(id);

            index.name = data?.name;
            index.customizations = data?.customizations;
            index.equipments = data?.equipments;
            index.steps = data?.steps;
            index.walkRadius = data?.walk_radius;
        });

        return map;
    }

    static validateBankLevel() {
        const isValid = this.isBankLevel;

        if (!isValid) {
            const translation = ds.Translation.gameGeneric.level_bank;
            const content = Layout.replaceInText(translation);
            const argsNotification = {
                content,
                color: 'red'
            };

            Notification.add(argsNotification);
        }

        return isValid;
    }
}
export class PageCustomizations extends HTMLElement {
    _selectedKeys = new Set();
    static _selectsMap = new Map();

    addEventListenersCustomization() {
        const elCustomization = ds.Helper.getElementByDataId(
            this.shadowRoot,
            HudPageSelectCustomization.idCharacterCustomization
        );

        elCustomization.addEventListener(CharacterCustomization.eventCustomizationChange, (event) => {
            this.handleCustomizationChange(event.detail);
            this.trackSelectedKey(event.detail);
            this.updateFieldPrice(elCustomization);
            this.toggleActionButton();
        });
    }

    countSelectedOptions() {
        const elCustomization = ds.Helper.getElementByDataId(
            this.shadowRoot,
            HudPageSelectCustomization.idCharacterCustomization
        );
        const selects = elCustomization?.shadowRoot?.querySelectorAll('select') ?? [];
        const response = [...selects].filter(el => el.value !== '').length;

        return response;
    }

    static drawButton(button) {
        const response = Layout.drawButtonComponent(button);

        return response;
    }

    static drawNPC(button, action) {
        this.setData();

        const customizations = CharacterCustomization.getData(action);
        const componentCustomization = Components.characterCustomization;
        const componentRotation = Components.characterRotation;
        const content = `
            <div class="ds-row gm-character-customizarion">
                <div class="ds-column gm-column--1 ds-card-wrapper">
                    <${componentRotation}
                        class="gm-character"
                    ></${componentRotation}>
                </div>
                <div class="ds-column gm-column--2">
                    <${componentCustomization}
                        data="${customizations}"
                        data-id="${HudPageSelectCustomization.idCharacterCustomization}"
                    ></${componentCustomization}>
                    <div class="ds-row ds-right">
                        ${button}
                    </div>
                </div>
            </div>
        `;
        const response = HudPageNPC.drawWrapper(content);

        return response;
    }

    static get cost() {
        const response = Data.rules.npcs.customization.cost;

        return response;
    }

    get totalCost() {
        const response = this.cost * this._selectedKeys.size;

        return response;
    }

    static get selectsValue() {
        const els = [...PageCustomizations._selectsMap.entries()];
        const response = els.map(([id, value]) => ({ id, value }));

        return response;
    }

    async handleAction(fetchFn) {
        if (!this.isAffordable()) return;

        this.elActionButton.setAttribute(ds.Prefix.ATTR_IS_DISABLED, 'true');

        const args = {
            npc: HudPageNPC.id,
            customizations: PageCustomizations.selectsValue
        };

        const dataFetch = await fetchFn(args);

        this.elActionButton.setAttribute(ds.Prefix.ATTR_IS_DISABLED, 'false');

        if (!dataFetch) return;

        return dataFetch;
    }

    handleCustomizationChange({ key, value }) {
        const componentRotation = Components.characterRotation;
        const elRotation = this.shadowRoot.querySelector(componentRotation);

        if (!elRotation) return;

        elRotation.updateCustomizations({ key, value });
    }

    isAffordable() {
        const response = this.inventoryDiamonds >= this.totalCost;

        return response;
    }

    resetCustomizations() {
        const elCustomization = ds.Helper.getElementByDataId(
            this.shadowRoot,
            HudPageSelectCustomization.idCharacterCustomization
        );

        this.resetSelects(elCustomization);

        CharacterRotation.customizations = CharacterRotation.customizationsCurrent;
        CharacterRotation.equipments = CharacterRotation.equipmentsCurrent;

        const componentRotation = Components.characterRotation;
        const elRotation = this.shadowRoot.querySelector(componentRotation);

        if (elRotation) elRotation.render();

        this.updateFieldPrice(elCustomization);
        this.toggleActionButton();
    }

    resetSelects(elCustomization) {
        const selects = elCustomization?.shadowRoot?.querySelectorAll(
            ds.Components.componentSelect
        ) ?? [];

        selects.forEach((elSelect) => {
            elSelect.setValue('');
        });

        this._selectedKeys.clear();

        PageCustomizations.resetMap();
    }

    static resetMap() {
        PageCustomizations._selectsMap.clear();
    }

    static setData() {
        CharacterRotation.customizations = Player.customizations;
        CharacterRotation.customizationsCurrent = Player.customizations;

        CharacterRotation.equipments = Player.equipmentsForHTML;
        CharacterRotation.equipmentsCurrent = Player.equipmentsForHTML;
    }

    toggleActionButton() {
        const hasSelection = PageCustomizations._selectsMap.size > 0;
        const isEnabled = hasSelection && this.isAffordable();

        Layout.toggleButtonDisabled(isEnabled, this.elActionButton);
    }

    trackSelectedKey({ key, value }) {
        const isValid = value !== '' && value !== null && value !== undefined;

        if (isValid) {
            this._selectedKeys.add(key);

            PageCustomizations._selectsMap.set(key, value);
        } else {
            this._selectedKeys.delete(key);

            PageCustomizations._selectsMap.delete(key);
        }
    }

    updateFieldPrice(elCustomization) {
        const el = elCustomization.shadowRoot.getElementById(CharacterCustomization.idFieldPrice);

        if (!el) return;

        el.setAttribute('input-value', this.totalCost);
    }
}
export class PageDetail {
    static calculateQuantity(lootId, isDurability) {
        const quantity = isDurability ? 1 : Player.getStorageQuantity(lootId);
        const response = {
            min: 1,
            max: quantity,
        };

        return response;
    }

    static calculateQuantityBuy(price, payWith) {
        const currency = Player.getInventoryByCurrency(payWith);
        let max = 0;

        if (price > 0 && currency > 0) {
            max = Math.floor(currency / price);
        }

        const response = {
            min: max > 0 ? 1 : 0,
            max
        };

        return response;
    }

    static calculateQuantityWithdraw(lootId, isDurability) {
        const quantity = isDurability ? 1 : Player.getBankStorageById(lootId);
        const response = {
            min: 1,
            max: quantity,
        };

        return response;
    }

    static get isBuy() {
        const response = HudPageDetail.npcAction === ds.Prefix.BUY;

        return response;
    }

    static get isCraft() {
        const response = HudPageDetail.npcAction === ds.Prefix.CRAFT;

        return response;
    }

    static get isDeposit() {
        const response = HudPageDetail.npcAction === ds.Prefix.DEPOSIT;

        return response;
    }

    static get isSell() {
        const response = HudPageDetail.npcAction === ds.Prefix.SELL;

        return response;
    }

    static get isWithdraw() {
        const response = HudPageDetail.npcAction === ds.Prefix.WITHDRAW;

        return response;
    }
}
export class PageDetailCraft {
    static idDrawReward = 'draw_reward';
    static isWaitingBack = false;
    static isReward = false;

    static buildTime(root) {
        const time = PageDetailCraft.getTimeRemaining;

        this._timerInterval = setInterval(() => {
            const el = root.querySelector('[data-craft-timer]');
            if (!el) return;
            el.textContent = PageDetailCraft.getTimeRemaining;

            const elSpeedUp = root.querySelector(`[data-id="${Statics.buttons.speedUpCraft.id}"]`);
            if (elSpeedUp) {
                elSpeedUp.setAttribute('label', PageDetailCraft.buildSpeedUpLabel());
                ds.Layout.setButtonDisabled(elSpeedUp, Player.inventoryDiamonds < PageDetailCraft.speedUpDiamonds);
            }

            if (PageDetailCraft.isCraftDone) {
                el.textContent = '00:00';
                elSpeedUp?.remove();

                clearInterval(this._timerInterval);
                this._timerInterval = null;

                PageDetailCraft.buildTimeAddButton(el, root);
            }
        }, 1000);

        setTimeout(() => {
            const elSpeedUp = root.querySelector(`[data-id="${Statics.buttons.speedUpCraft.id}"]`);

            if (!elSpeedUp) return;

            elSpeedUp.addEventListener('click', () => {
                PageDetailCraft.speedUp(root);
            });
        }, 50);

        const response = this.drawTimer(time);

        return response;
    }

    static buildTimeAddButton(el, root) {
        const button = Layout.drawButtonComponent(Statics.buttons.back);

        ds.Components.insert({
            el: el.parentNode.parentNode,
            position: 'afterend',
            html: button
        });

        const insertedButton = root.querySelector(`[data-id="${Statics.buttons.back.id}"]`);

        if (insertedButton) {
            insertedButton.addEventListener('click', () => {
                HudPageNPC.pageDetail.handleCraftRewardBack();
            });
        }
    }

    static buildTimeText(seconds) {
        const defaultString = '00:00';

        if (!seconds || seconds <= 0) return defaultString;

        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secondes = seconds % 60;

        const buildString = (data) => String(data).padStart(2, '0');

        if (hours > 0) {
            const hh = buildString(hours);
            const mm = buildString(minutes);
            const ss = buildString(secondes);

            return `${hh}:${mm}:${ss}`;
        }

        const mm = buildString(minutes);
        const ss = buildString(secondes);
        const response = `${mm}:${ss}`;

        return response;
    }

    static buildSpeedUp() {
        const isDisabled = Player.inventoryDiamonds < PageDetailCraft.speedUpDiamonds;
        const button = {
            ...Statics.buttons.speedUpCraft,
            label: PageDetailCraft.buildSpeedUpLabel(),
            isDisabled,
        };
        const response = Layout.drawButtonComponent(button);

        return response;
    }

    static buildSpeedUpLabel() {
        const quantity = PageDetailCraft.speedUpDiamonds;
        const translationDefault = ds.Translation.interfaceDefault;
        const translationLoot = ds.Translation.gameLoot;
        const label = translationDefault?.speed_up;
        const diamond = translationLoot?.diamond;
        const value = `${quantity} ${diamond}`;
        const response = `${label} (${value})`;

        return response;
    }

    static calculateQuantity(recipe) {
        let max = Infinity;

        for (const part of recipe) {
            const have = Player.getInventoryByIl(part.id);
            if (have < part.quantity) return { min: 0, max: 0 };
            const possible = Math.floor(have / part.quantity);
            if (possible < max) max = possible;
        }

        const min = max > 0 ? 1 : 0;
        const response = {
            min,
            max
        };

        return response;
    }

    static drawRecipe(data, quantity = 1) {
        PageDetailCraft.isWaitingBack = false;

        if (!data) return '';

        let items = this.drawCards(data, quantity);
        const subtitle = Layout.drawSubtitle(this.translationDefault?.recipe);
        const content = Layout.drawCardWrapper(items);
        const response = `
            ${subtitle}
            ${content}
        `;

        return response;
    }

    static async drawReward(npc) {
        PageDetailCraft.isWaitingBack = true;

        const data = await FetchData.getCraftReward(npc);
        const items = this.drawCards(data.craftResult);
        const subtitle = Layout.drawSubtitle(this.translationDefault?.reward);
        const content = Layout.drawCardWrapper(items);
        const text = this.translationGameCraft?.done_text;

        PageDetailCraft.isReward = true;

        const resultItems = this.normalizeItems(data.craftResult);
        const resultSummary = resultItems.map(item => `${item.id}:${item.quantity}`).join(',');

        Analytics.send({
            event_name: 'craft_reward',
            npc: npc,
            result_items: resultSummary,
        });

        const translation = ds.Translation.interface.response;
        const checkInventory = translation.check_inventory;
        const args = {
            content: checkInventory,
        };

        Notification.add(args);

        const response = `
            ${subtitle}
            <div class="ds-row">
                <p>${text}</p>
            </div>
            <div class="ds-row gm-detail">
                ${content}
            </div>
        `;

        return response;
    }

    static drawCards(data, quantity = 1) {
        const items = this.normalizeItems(data);
        let response = '';

        items.forEach(({ id, quantity: baseQuantity }) => {
            const argsCard = {
                item: id,
                index: [id, baseQuantity * quantity]
            };

            response += Layout.buildCardItem(argsCard);
        });

        return response;
    }

    static drawTimer(time) {
        PageDetailCraft.isWaitingBack = true;

        const title = this.translation.is_crafting_title;
        const text = this.translation.is_crafting_text;
        const subtitle = Layout.drawSubtitle(title);
        const speedUp = this.buildSpeedUp();

        const response = `
            <div class="ds-row gm-detail">
                <div class="ds-row">
                    ${subtitle}
                </div>
                <div class="ds-row">
                    ${text}
                </div>
                <div class="ds-row">
                    <span data-craft-timer class="gm-text-destak">
                        ${time}
                    </span>
                </div>
                <div class="ds-row ds-center">
                    ${speedUp}
                </div>
            </div>
        `;

        return response;
    }

    static get currentCraft() {
        const response = [];
        const craftList = this.craftList;

        craftList.forEach((index) => {
            const idNPC = index.id_npc;
            const idNPCCurrent = HudPageNPC.id;

            const isFound = idNPC === idNPCCurrent;
            if (isFound) response.push(index);
        });

        return response;
    }

    static get isCraftDone() {
        const craft = this.currentCraft[0];

        if (!craft) return false;

        const now = ds.Helper.getNow();

        return craft.end <= now;
    }

    static get isCraftingNPC() {
        let response = false;

        const craftList = this.currentCraft;
        const isValid = craftList.length > 0;

        if (isValid) response = true;

        return response;
    }

    static get craftList() {
        const response = Data.player.craft;

        return response;
    }

    static get getTimeRemaining() {
        const response = this.buildTimeText(this.getTimeRemainingSeconds);

        return response;
    }

    static get getTimeRemainingSeconds() {
        const craft = this.currentCraft[0];

        if (!craft) return 0;

        const now = ds.Helper.getNow();
        const diff = craft.end - now;
        const response = diff > 0 ? diff : 0;

        return response;
    }

    static get speedUpDiamonds() {
        const seconds = this.getTimeRemainingSeconds;
        const hours = Math.ceil(seconds / 3600);
        const response = hours > 0 ? hours : 1;

        return response;
    }

    static get translationDefault() {
        const response = ds.Translation.interfaceDefault;

        return response;
    }

    static get translationGameCraft() {
        const response = ds.Translation.gameCraft;

        return response;
    }

    static normalizeItems(data) {
        if (Array.isArray(data)) {
            return data.map(item => ({
                id: item.id,
                quantity: item.quantity
            }));
        }

        return Object.entries(data).map(([id, quantity]) => ({
            id,
            quantity
        }));
    }

    static async speedUp(root) {
        const npc = HudPageNPC.name;
        const elSpeedUp = root.querySelector(`[data-id="${Statics.buttons.speedUpCraft.id}"]`);

        if (Player.inventoryDiamonds < PageDetailCraft.speedUpDiamonds) {
            if (elSpeedUp) elSpeedUp.setAttribute(ds.Prefix.ATTR_IS_DISABLED, 'true');
            return;
        }

        if (elSpeedUp) elSpeedUp.setAttribute(ds.Prefix.ATTR_IS_DISABLED, 'true');

        const response = await FetchData.speedUpCraft({ npc });

        if (response?.isError) {
            if (elSpeedUp) elSpeedUp.removeAttribute(ds.Prefix.ATTR_IS_DISABLED);
            return;
        }

        clearInterval(this._timerInterval);
        this._timerInterval = null;

        HudPageNPC.pageDetail.renderCraft();
    }

    static get translation() {
        const response = ds.Translation.gameCraft;

        return response;
    }
}
export class PageDetailMenu {
    static itemProperties;
    static lastPageData;



    static addButtonBack(buttons) {
        buttons.push(Statics.buttons.back);
    }

    static addButtonBuy(buttons) {
        const isBuy = PageDetail.isBuy;
        const isFromNPC = HudPageDetail.isFromNPC;
        const isValid = isBuy && isFromNPC;

        if (isValid) {
            const button = Layout.changeThemeButton(ds.Prefix.BUY);

            buttons.push(button);
        }
    }

    static addButtonCraft(buttons) {
        const isCraft = PageDetail.isCraft;
        const isCraftDone = PageDetailCraft.isCraftDone;
        const isCraftingNPC = PageDetailCraft.isCraftingNPC;
        const isWaitingBack = PageDetailCraft.isWaitingBack;
        const isFromNPC = HudPageDetail.isFromNPC;
        const isValid = isCraft && !isCraftDone && !isCraftingNPC && isFromNPC && !isWaitingBack;

        if (isValid) {
            const button = Layout.changeThemeButton(ds.Prefix.CRAFT);

            buttons.push(button);
        }
    }

    static addButtonDelete(buttons) {
        const isFromNpc = HudPageDetail?.isFromNPC;
        const pagePrefix = HudPageEquipments?.pageDetail?.args?.cssPrefix;
        const from = Hud?.pageDetail?.from;
        const isFromEquipments = from === `gm-${pagePrefix}`;
        const isValid = !isFromNpc && !isFromEquipments;

        if (isValid) buttons.push(Statics.buttons.delete);
    }

    static addButtonDeposit(buttons) {
        const isDeposit = PageDetail.isDeposit;

        if (isDeposit) {
            const button = Layout.changeThemeButton(ds.Prefix.DEPOSIT);

            buttons.push(button);
        }
    }

    static addButtonEquip(buttons) {
        const isFromNPC = HudPageDetail.isFromNPC;
        const isValid = this.itemProperties.isEquipment && !isFromNPC;

        if (isValid) {
            const isPageEquipments = this.lastPageData.from.includes('equipments');
            const button = isPageEquipments
                ? Statics.buttons.unequip
                : Statics.buttons.equip;

            buttons.push(button);
        }
    }

    static addButtonSell(buttons) {
        const isSell = PageDetail.isSell;
        const isFromNPC = HudPageDetail.isFromNPC;
        const isValid = isSell && isFromNPC;

        if (isValid) {
            const button = Layout.changeThemeButton(ds.Prefix.SELL);

            buttons.push(button);
        }
    }

    static addButtonUse(buttons) {
        const isFromNPC = HudPageDetail.isFromNPC;
        const isValid = this.itemProperties.isUsable && !isFromNPC;

        if (isValid) buttons.push(Statics.buttons.use);
    }

    static addButtonWithdraw(buttons) {
        const isValid = PageDetail.isWithdraw;

        if (isValid) {
            const button = Layout.changeThemeButton(ds.Prefix.WITHDRAW);

            buttons.push(button);
        }
    }

    static drawMenu(itemProperties, lastPageData) {
        let response = '';
        const buttons = [];

        this.itemProperties = itemProperties;
        this.lastPageData = lastPageData;

        this.addButtonBack(buttons);
        this.addButtonBuy(buttons);
        this.addButtonCraft(buttons);
        this.addButtonDelete(buttons);
        this.addButtonDeposit(buttons);
        this.addButtonEquip(buttons);
        this.addButtonSell(buttons);
        this.addButtonUse(buttons);
        this.addButtonWithdraw(buttons);

        buttons.forEach(button => {
            response += Layout.drawButtonComponent(button);
        });

        return response;
    }
}
export class Pathfinding {
    static findPath(map, start, end) {
        const cameFrom = new Map();
        const gScore = new Map();

        gScore.set(this.getCoordToIndex(start), 0);

        const openSet = [{ position: start, fScore: this.heuristic(start, end) }];
        const visited = new Set();

        while (openSet.length > 0) {
            openSet.sort((a, b) => a.fScore - b.fScore);

            const { position: current } = openSet.shift();

            if (current[0] === end[0] && current[1] === end[1]) {
                return this.reconstructPath(cameFrom, current);
            }

            visited.add(this.getCoordToIndex(current));

            for (const neighbor of this.getNeighbors(current, map)) {
                if (visited.has(this.getCoordToIndex(neighbor))) {
                    continue;
                }

                const tentativeGScore = gScore.get(this.getCoordToIndex(current)) + 1;

                if (tentativeGScore < (gScore.get(this.getCoordToIndex(neighbor)) || Infinity)) {
                    cameFrom.set(this.getCoordToIndex(neighbor), current);
                    gScore.set(this.getCoordToIndex(neighbor), tentativeGScore);

                    const fScore = tentativeGScore + this.heuristic(neighbor, end);
                    if (!openSet.some(item => item.position[0] === neighbor[0] && item.position[1] === neighbor[1])) {
                        openSet.push({ position: neighbor, fScore });
                    }
                }
            }
        }

        return null;
    }

    static getCoordToIndex([x, y]) {
        const response = `${x},${y}`;

        return response;
    }

    static getNeighbors([x, y], map) {
        const response = [];
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
                response.push([nx, ny]);
            }
        }

        return response;
    }

    static heuristic(a, b) {
        const response = Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);
        return response;
    }

    static isWalkable([x, y], map) {
        const response = map[y] && map[y][x] === 0;

        return response;
    }

    static reconstructPath(cameFrom, current) {
        const response = [current];
        const visited = new Set([this.getCoordToIndex(current)]);

        while (cameFrom.has(this.getCoordToIndex(current))) {
            const currentIndex = this.getCoordToIndex(current);
            current = cameFrom.get(currentIndex);

            if (visited.has(this.getCoordToIndex(current))) return null;

            visited.add(this.getCoordToIndex(current));
            response.unshift(current);
        }

        return response;
    }
}
export class Player {
    static id;

    static buildPosition(target) {
        const currentPosition = target.playerPosition;
        const response = {
            position: [
                currentPosition.position_x,
                currentPosition.position_y
            ]
        };

        return response;
    }

    static draw() {
        const response = `
            <${lo.Components.entity}
                id="${HTML.idGamePlayer}"
                class="gm-alive gm-alive"
                entity="person"
                ${ds.Layout.attributePositionX}=""
                ${ds.Layout.attributePositionY}=""
                direction="down"
                action="stand"
                tabindex="-1"
            ></${lo.Components.entity}>
        `;

        return response;
    }

    static get attacks() {
        const response = this.player.attacks;

        return response;
    }

    static get attributes() {
        const response = this.player.attributes;

        return response;
    }

    static get bank() {
        const response = Data.bank;

        return response;
    }

    static get bankReceive() {
        const response = Storage.getDataFiltered(2);

        return response;
    }

    static get bankStorage() {
        const response = Storage.getDataFiltered(1);

        return response;
    }

    static get buffs() {
        const response = this.player.buffs;

        return response;
    }

    static get customizations() {
        const response = this.player.customizations;

        return response;
    }

    static get defenses() {
        const response = this.player.defenses;

        return response;
    }

    static get inventory() {
        const data = Storage.getDataFiltered(0);
        const response = ds.Helper.sortData(data, 'id_lore');

        return response;
    }

    static get inventoryConsumables() {
        const response = Storage.getUsables(this.inventory);

        return response;
    }

    static get equipments() {
        const response = this.player.equipments;

        return response;
    }

    static get equipmentsInStorage() {
        const response = Storage.getDataFiltered(3);

        return response;
    }

    static get equipmentsForHTML() {
        const storage = this.equipmentsInStorage;
        const response = Character.buildEquipments(this.equipments, storage);

        return response;
    }

    static get player() {
        const response = Data.player;

        return response;
    }

    static get quests() {
        const response = this.player.quests;

        return response;
    }

    static get statistics() {
        const response = this.player.statistics;

        return response;
    }

    static get stories() {
        const response = this.player.stories;

        return response;
    }

    static getBankStorageById(id) {
        const data = this.bankStorage;
        const response = Character.getItemQuantityByIdLore(data, id);

        return response;
    }

    static getBankStorageQuantity(id) {
        const response = this.getBankStorageById(id);

        return response;
    }

    static getInventoryByCurrency(payWith) {
        const isGold = payWith === Statics.idItems.gold;
        const response = isGold ? this.inventoryGold : this.inventoryDiamonds;

        return response;
    }

    static getInventoryByIl(id) {
        const data = this.inventory;
        const response = Character.getItemQuantityByIdLore(data, id);

        return response;
    }

    static get inventoryDiamonds() {
        const id = Statics.idItems['diamond'];
        const response = this.getInventoryByIl(id);

        return response;
    }

    static get inventoryGold() {
        const id = Statics.idItems['gold'];
        const response = this.getInventoryByIl(id);

        return response;
    }

    static getStorageQuantity(id) {
        const response = this.getInventoryByIl(id);

        return response;
    }

    static setPosition(target) {
        const args = {
            target: HTML.elGamePlayer,
            positionX: target[0],
            positionY: target[1]
        };

        HTML.elMapGame.setPosition(args);
    }

    static updateCustomizations() {
        const value = this.customizations;

        lo.Entity.setCustomizations(HTML.elGamePlayer, value);
    }

    static updateEquipments() {
        const equipments = this.equipmentsForHTML;

        lo.Entity.setEquipments(HTML.elGamePlayer, equipments);
    }

    static updateLayout() {
        this.updateCustomizations();
        this.updateEquipments();
    }
}
export class Quest {
    static buildFullQuestList(isFromNPC) {
        const npcs = ds.Modules.npcs;
        let response = [];

        npcs.forEach(npc => {
            const questsNPC = npc.quests;

            if (questsNPC) {
                questsNPC.forEach(quest => {
                    const statusQuest = this.buildQuestStatus(quest, isFromNPC);
                    const isDone = statusQuest.isDone;
                    const isKnown = statusQuest.isKnown;
                    const action = statusQuest.action;
                    const translation = this.getQuestTranslationById(quest);
                    const title = this.getTitle(translation);
                    const description = this.getDescription(quest);
                    const args = {
                        idQuest: quest,
                        idNPC: npc.id,
                        requester: npc.name,
                        isKnown,
                        title,
                        description,
                        isDone,
                        action
                    };

                    if (isFromNPC) {
                        response.push(args);
                    } else {
                        if (isKnown) response.push(args);
                    }
                });
            }
        });

        return response;
    }

    static buildQuestListByNPC(id) {
        const quests = this.buildFullQuestList(true);
        const response = quests.filter(quest => quest.idNPC === id);

        return response;
    }

    static buildQuestStatus(quest, isFromNPC) {
        const drawButton = (target) => Layout.drawButtonComponent(target);
        const questsPalyer = Player.quests;
        const currentQuest = questsPalyer[quest];
        const isDone = currentQuest === 1 ?? false;
        const isKnown = currentQuest !== undefined;
        const icon = ds.HTML.drawDivCentered(ds.HTML.drawIconStatus(isDone));
        const isAccept = !isDone && !isKnown && isFromNPC;
        const isFinish = !isDone && isKnown && isFromNPC;
        let action;

        if (isAccept) {
            const buttonAccept = this.buildQuestStatusButton(quest, ds.Prefix.ACCEPT);

            action = drawButton(buttonAccept);
        } else if (isFinish) {
            const buttonFinish = this.buildQuestStatusButton(quest, ds.Prefix.FINISH);

            action = drawButton(buttonFinish);
        } else {
            action = icon;
        }

        const response = {
            isDone,
            isKnown,
            action
        };

        return response;
    }

    static buildQuestStatusButton(index, action) {
        const button = Statics.buttons[action];
        const handler = `["${index}"]`;

        button.handlerProps = handler;
        button.id = Layout.buildId(action, index);

        const isFinish = action === ds.Prefix.FINISH;

        if (isFinish) button.isDisabled = this.buildQuestStatusButtonDisabled(index);

        return button;
    }

    static buildQuestStatusButtonDisabled(index) {
        const needs = this.getQuestData(index, ds.Prefix.NEEDS) ?? [];
        const inventory = Player.inventory;
        const length = needs.length;
        let response = false;

        for (let i = 0; i < length; i++) {
            const index = needs[i];
            const id = index.id;
            const quantity = index.quantity;
            const isInvalid = (inventory[id] ?? 0) < quantity;

            if (isInvalid) {
                response = true;
                break;
            }
        }

        return response;
    }

    static get quests() {
        const response = ds.Modules.quests;

        return response;
    }

    static get translation() {
        const response = ds.Translation.gameQuest;

        return response;
    }

    static getQuestTranslationById(index) {
        const response = this.quests[index].translation;

        return response;
    }

    static getDescription(index) {
        const translation = this.getQuestTranslationById(index);
        const prefix = this.getPrefix(translation);
        const description = this.translation?.[`${prefix}description`];
        const needs = this.getNeeds(index);
        const rewards = this.getRewards(index);
        const response = `
            ${description}
            ${needs}
            ${rewards}
        `;

        return response;
    }

    static getQuestData(index, property) {
        const response = this.quests[index][property];

        return response;
    }

    static getQuestDataText(index, property) {
        const data = this.getQuestData(index, property);
        let response = '';

        if (data) {
            const translation = this.translation[property];
            response += `${translation} `;

            data.forEach((item) => {
                const isItem = item.kind === 1;
                if (isItem) {
                    const id = item.id;
                    const quantity = item.quantity;

                    response += Layout.drawTextItemQuantity(id, quantity);
                }
            });
        }

        return response;
    }

    static getNeeds(index) {
        const response = this.getQuestDataText(index, ds.Prefix.NEEDS);

        return response;
    }

    static getRewards(index) {
        const response = this.getQuestDataText(index, ds.Prefix.REWARDS);

        return response;
    }

    static getPrefix(index) {
        const response = `quest_${index}_`;

        return response;
    }

    static getTitle(index) {
        const prefix = this.getPrefix(index);
        const response = this.translation?.[`${prefix}title`];

        return response;
    }
}
export class Settings {
    static prefix = 'settings';
    static properties = ['isPlay', 'value'];
    static valueMaximum = 1;
    static valueModifier = Settings.valueMaximum / 5;




    static get data() {
        const data = ds.Storage.getValue(this.prefix);
        const response = data ? JSON.parse(data) : undefined;
        return response;
    }

    static init() {
        let data = this.data;

        if (!data) {
            this.setDataInitial();
            data = this.data;
        }

        Audio.categories.forEach((target) => {
            this.properties.forEach((property) => {
                const value = data[target][property];
                const args = {
                    target,
                    property,
                    value
                };
                this.setProperty(args);
            });
        });
    }

    static isDecreaseDisabled(target) {
        const data = this.data[target][this.properties[1]];
        const response = data <= this.valueModifier;

        return response;
    }

    static isIncreaseDisabled(target) {
        const data = this.data[target][this.properties[1]];

        const response = data >= this.valueMaximum;
        return response;
    }

    static setIsPlay(props) {
        const { value, target } = props;
        const property = this.properties[0];
        const args = {
            target,
            property,
            value
        };

        this.setProperty(args);
    }

    static setValue(props) {
        const { action, target } = props;
        const property = this.properties[1];
        const isIncrease = action === 'increase';
        const data = this.data;
        const dataValue = data[target][property];
        const value = isIncrease ? dataValue + this.valueModifier : dataValue - this.valueModifier;
        const valueMax = this.valueMaximum;
        const mathIncrease = value > valueMax ? this.valueMaximum : value;
        const mathDecrease = value <= 0 ? 0 : value;
        const mathResponse = isIncrease ? mathIncrease : mathDecrease;
        const args = {
            target,
            property,
            value: mathResponse
        };

        this.setProperty(args);
    }

    static setDataInitial() {
        const value = {
            effects: {
                isPlay: true,
                value: 1
            },
            music: {
                isPlay: true,
                value: 1
            }
        };

        this.setStorage(value);
    }

    static setProperty(props) {
        const { target, property, value } = props;

        Data.settings[target][property] = value;

        const data = this.data;

        data[target][property] = value;
        this.setStorage(data);

        const isMusic = target === 'music';
        const isValue = property === 'value';

        if (isValue) {
            Audio.setVolume(target, value);

            if (isMusic) Audio.setVolume('battle', value);
        }

        const isPlay = property === 'isPlay';

        if (isPlay) {
            value ? Audio.play(target) : Audio.pause(target);

            if (isMusic) value ? Audio.play('battle') : Audio.pause('battle');
        }
    }

    static setStorage(value) {
        const target = this.prefix;
        const args = {
            target: target,
            value: JSON.stringify(value)
        };

        ds.Storage.setValue(args);
    }
}
export class Statics {
    static timePerCharacter = gbIsLocalHost ? 0 : 40;
    static isGuest = true;
    static isNewbie = false;
    static idMapDivisionPadixa = 25;
    static temp = {
        page: '',
        itemData: {
            item: undefined,
            isDurability: undefined,
            isEquipment: undefined,
            isTooltip: undefined,
            kind: undefined,
        }
    };

    static actions = [
        {
            id: 0,
            label: 'buy'
        },
        {
            id: 1,
            label: 'sell'
        },
        {
            id: 2,
            label: 'quest'
        },
        {
            id: 3,
            label: 'craft'
        },
        {
            id: 4,
            label: 'apply'
        },
        {
            id: 5,
            label: 'buyCustomization'
        },
        {
            id: 6,
            label: 'deposit'
        },
        {
            id: 7,
            label: 'withdraw'
        },
        {
            id: 9,
            label: 'repairMagic'
        },
        {
            id: 10,
            label: 'repairCombat'
        }
    ];

    static backgroundBattle = [
        23, 24, 23, 24, 23,
        1, 1, 1, 1, 1,
        1, 1, 1, 1, 1,
        1, 1, 1, 1, 1,
        1, 1, 1, 1, 1,
        1, 1, 1, 1, 1,
        23, 25, 26, 23, 23,
    ];

    static get buttons() {
        const translationInterface = ds.Translation?.interface;
        const translationDefault = ds.Translation?.interfaceDefault;
        const translationLogin = ds.Translation?.loginDefault;
        const buildTranslationFilter = (target) => translationDefault?.[target];
        const theme = ds.Layout.theme;
        const themeDefault = theme.menuDefault;
        const themeProceed = theme.menuProceed;
        const themeDanger = theme.menuDanger;
        const themeTab = theme.menuTab;
        const buttons = {
            accept: {
                id: 'accept',
                label: translationDefault?.accept,
                handler: 'handleAccept',
                handlerProps: '["accept"]',
                theme: themeProceed
            },
            apply: {
                id: 'apply',
                label: translationDefault?.apply,
                handler: 'handleApply',
                handlerProps: '["apply"]',
                theme: themeDefault
            },
            back: {
                id: 'back',
                label: translationDefault?.back,
                handler: 'handleBack',
                handlerProps: '["back"]',
                theme: themeDefault
            },
            cancel: {
                id: 'cancel',
                label: translationDefault?.cancel,
                handler: 'handleCancel',
                handlerProps: '["cancel"]',
                theme: themeDefault
            },
            buy: {
                id: 'buy',
                label: translationDefault?.buy,
                handler: 'handleBuy',
                handlerProps: '["buy"]',
                theme: themeDefault
            },
            continue: {
                id: 'continue',
                label: translationDefault?.continue,
                handler: 'handleContinue',
                handlerProps: '["craft"]',
                theme: themeDefault
            },
            craft: {
                id: 'craft',
                label: translationDefault?.craft,
                handler: 'handleCraft',
                handlerProps: '["craft"]',
                theme: themeDefault
            },
            deposit: {
                id: 'deposit',
                label: translationDefault?.deposit,
                handler: 'handleDeposit',
                handlerProps: '["deposit"]',
                theme: themeDefault
            },
            delete: {
                id: 'delete',
                label: translationDefault?.delete,
                handler: 'handleDelete',
                handlerProps: '["delete"]',
                theme: themeDanger
            },
            deleteAccount: {
                id: 'deleteAccount',
                label: translationDefault?.delete_account,
                handler: 'handleDeleteAccount',
                handlerProps: '["delete"]',
                theme: themeDanger
            },
            equip: {
                id: 'equip',
                label: translationDefault?.equip,
                handler: 'handleEquip',
                handlerProps: '["equip"]',
                theme: themeDefault
            },
            finish: {
                id: 'finish',
                label: translationDefault?.finish,
                handler: 'handleFinish',
                handlerProps: '["finish"]',
                theme: themeProceed
            },
            repair: {
                id: 'repair',
                label: translationDefault?.repair,
                handler: 'handleRepair',
                handlerProps: '["repair"]',
                theme: themeDefault
            },
            repairAll: {
                id: 'repair-all',
                label: translationDefault?.repair_all,
                handler: 'handleRepairAll',
                handlerProps: '["repairAll"]',
                theme: themeDefault
            },
            sell: {
                id: 'sell',
                label: translationDefault?.sell,
                handler: 'handleSell',
                handlerProps: '["sell"]',
                theme: themeDefault
            },
            speedUpCraft: {
                id: 'speedUpCraft',
                label: 'XXXXX',
                handler: 'handleSpeedUpCraft',
                handlerProps: '["speedUpCraft"]',
                theme: themeProceed
            },
            unequip: {
                id: 'unequip',
                label: translationDefault?.unequip,
                handler: 'handleUnequip',
                handlerProps: '["unequip"]',
                theme: themeDefault
            },
            use: {
                id: 'use',
                label: translationDefault?.use,
                handler: 'handleUse',
                handlerProps: '["use"]',
                theme: themeDefault
            },
            quest: {
                id: 'quest',
                label: translationInterface?.page_quest.title,
                handler: 'handleOpenPage',
                handlerProps: '["quest"]',
                theme: themeDefault
            },
            filterAbout: {
                id: 'gm-hud-page-about',
                label: translationDefault?.about,
                handler: 'handleOpenPage',
                handlerProps: '["gm-hud-page-about"]',
                theme: themeTab
            },
            filterAll: {
                id: 'all',
                label: buildTranslationFilter('all'),
                handler: 'handleFilter',
                handlerProps: '["all"]',
                theme: themeTab
            },
            filterApply: {
                id: 'gm-hud-page-apply-customization',
                label: buildTranslationFilter('apply'),
                handler: 'handleOpenPage',
                handlerProps: '["gm-hud-page-apply-customization"]',
                theme: themeTab
            },
            filterBuy: {
                id: 'gm-hud-page-buy',
                label: translationDefault?.buy,
                handler: 'handleOpenPage',
                handlerProps: '["gm-hud-page-buy"]',
                theme: themeTab
            },
            filterBuyCustomization: {
                id: 'gm-hud-page-buy-customization',
                label: translationDefault?.buy,
                handler: 'handleOpenPage',
                handlerProps: '["gm-hud-page-buy-customization"]',
                theme: themeTab
            },
            filterCollectable: {
                id: 'collectable',
                label: buildTranslationFilter('collectable'),
                handler: 'handleFilter',
                handlerProps: '["collectable"]',
                theme: themeTab
            },
            filterCombat: {
                id: 'gm-hud-page-combat',
                label: translationDefault?.combat,
                handler: 'handleOpenPage',
                handlerProps: '["gm-hud-page-combat"]',
                theme: themeTab
            },
            filterCraft: {
                id: 'gm-hud-page-craft',
                label: translationDefault?.craft,
                handler: 'handleOpenPage',
                handlerProps: '["gm-hud-page-craft"]',
                theme: themeTab
            },
            filterDeposit: {
                id: 'gm-hud-page-deposit',
                label: buildTranslationFilter('deposit'),
                handler: 'handleOpenPage',
                handlerProps: '["gm-hud-page-deposit"]',
                theme: themeTab
            },
            filterEquipment: {
                id: 'equipment',
                label: buildTranslationFilter('equipment'),
                handler: 'handleFilter',
                handlerProps: '["equipment"]',
                theme: themeTab
            },
            filterMoney: {
                id: 'money',
                label: buildTranslationFilter('money'),
                handler: 'handleFilter',
                handlerProps: '["money"]',
                theme: themeTab
            },
            filterQuest: {
                id: 'gm-hud-page-quest',
                label: translationInterface?.page_quest.title,
                handler: 'handleOpenPage',
                handlerProps: '["gm-hud-page-quest"]',
                theme: themeTab
            },
            filterRepairCombat: {
                id: 'gm-hud-page-repair-combat',
                label: translationDefault?.repair,
                handler: 'handleOpenPage',
                handlerProps: '["gm-hud-page-repair-combat"]',
                theme: themeTab
            },
            filterRepairMagic: {
                id: 'gm-hud-page-repair-magic',
                label: translationDefault?.repair,
                handler: 'handleOpenPage',
                handlerProps: '["gm-hud-page-repair-magic"]',
                theme: themeTab
            },
            filterSell: {
                id: 'gm-hud-page-sell',
                label: translationDefault?.sell,
                handler: 'handleOpenPage',
                handlerProps: '["gm-hud-page-sell"]',
                theme: themeTab
            },
            filterStatistics: {
                id: 'gm-hud-page-statistics',
                label: translationDefault?.statistics,
                handler: 'handleOpenPage',
                handlerProps: '["gm-hud-page-statistics"]',
                theme: themeTab
            },
            filterResources: {
                id: 'resources',
                label: buildTranslationFilter('resources'),
                handler: 'handleFilter',
                handlerProps: '["resources"]',
                theme: themeTab
            },
            filterUsable: {
                id: 'usable',
                label: buildTranslationFilter('usable'),
                handler: 'handleFilter',
                handlerProps: '["usable"]',
                theme: themeTab
            },
            filterUser: {
                id: 'gm-hud-page-user',
                label: translationLogin?.user,
                handler: 'handleOpenPage',
                handlerProps: '["gm-hud-page-user"]',
                theme: themeTab
            },
            filterWithdraw: {
                id: 'gm-hud-page-withdraw',
                label: buildTranslationFilter('withdraw'),
                handler: 'handleOpenPage',
                handlerProps: '["gm-hud-page-withdraw"]',
                theme: themeTab
            },
            mainAchievements: {
                id: `${HTML.idHudMenu}_achievements`,
                pageTarget: 'achievements',
                icon: 'achievements',
                translation: 'achievements',
                label: translationInterface?.page_achievement.title,
            },
            mainAttributes: {
                id: `${HTML.idHudMenu}_attributes`,
                pageTarget: 'attributes',
                icon: 'profile',
                translation: 'attributes',
                label: translationInterface?.page_attribute.title,
            },
            mainEquipments: {
                id: `${HTML.idHudMenu}_equipments`,
                pageTarget: 'equipments',
                icon: 'equipments',
                translation: 'equipments',
                label: translationInterface?.page_equipments.title,
            },
            mainInventory: {
                id: `${HTML.idHudMenu}_inventory`,
                pageTarget: 'inventory',
                icon: 'inventory',
                translation: 'inventory',
                label: translationInterface?.page_inventory.title,
            },
            mainMap: {
                id: `${HTML.idHudMenu}_map`,
                pageTarget: 'map',
                icon: 'map',
                translation: 'map',
                label: translationInterface?.page_map.title,
            },
            mainMenu: {
                id: `${HTML.idHudMenu}_menu`,
                pageTarget: 'menu',
                icon: 'menu',
                translation: 'menu',
                css: 'ds-hide--tablet',
                label: translationInterface?.page_menu.title,
            },
            mainQuests: {
                id: `${HTML.idHudMenu}_quests`,
                pageTarget: 'quests',
                icon: 'quests',
                translation: 'quests',
                label: translationInterface?.page_quest.title,
            },
            mainSettings: {
                id: `${HTML.idHudMenu}_settings`,
                pageTarget: 'settings',
                icon: 'settings',
                translation: 'settings',
                label: translationInterface?.page_setting.title,
            },
            mainStore: {
                id: `${HTML.idHudMenu}_store`,
                pageTarget: 'store',
                icon: 'store',
                translation: 'store',
                label: translationInterface?.page_store?.title,
            },
            withdraw: {
                id: 'withdraw',
                label: translationDefault?.withdraw,
                handler: 'handleWithdraw',
                handlerProps: '["withdraw"]',
                theme: themeDefault
            },
        };

        return buttons;
    }

    static get buttonsMainMenu() {
        const buttons = [
            Statics?.buttons?.mainAttributes,
            Statics?.buttons?.mainEquipments,
            Statics?.buttons?.mainInventory,
            Statics?.buttons?.mainMap,
            Statics?.buttons?.mainQuests,
            Statics?.buttons?.mainAchievements,
            Statics?.buttons?.mainStore,
            Statics?.buttons?.mainSettings,
        ];

        return buttons;
    }

    static crafts = [
        {
            id: 0,
            label: 'wood'
        },
        {
            id: 1,
            label: 'plant'
        },
        {
            id: 2,
            label: 'fabric'
        },
        {
            id: 3,
            label: 'drawWell'
        },
        {
            id: 4,
            label: 'witch'
        },
        {
            id: 5,
            label: 'stone'
        }
    ];

    static classes = {
        0: {
            class: 'warrior',
            attribute: 'strength',
            customizations: {
                clothes: 52,
                eye: 2,
                hair: 2,
                skin: 3
            },
            equipments: {
                boot: 61,
                face: 49,
                gloves: 28,
                hair: 45,
                helmet: 23,
                shield: 32,
                pants: 35,
                weapon: 14
            }
        },
        1: {
            class: 'wizard',
            attribute: 'intelligence',
            customizations: {
                clothes: 53,
                eye: 4,
                hair: 7,
                skin: 0
            },
            equipments: {
                boot: 61,
                hair: 48,
                helmet: 51,
                pants: 35,
                weapon: 81
            }
        },
        2: {
            class: 'hunter',
            attribute: 'dexterity',
            customizations: {
                clothes: 52,
                eye: 0,
                hair: 6,
                skin: 2
            },
            equipments: {
                armor: 29,
                boot: 61,
                hair: 46,
                skin: 52,
                pants: 35,
                weapon: 84
            }
        },
        3: {
            class: 'merchant',
            attribute: 'vitality',
            customizations: {
                clothes: 53,
                eye: 6,
                hair: 5,
                skin: 1
            },
            equipments: {
                armor: 29,
                boot: 61,
                hair: 47,
                skin: 53,
                pants: 35,
                weapon: 17
            }
        }
    };

    static collectibles = [
        {
            id: 108,
            name: 'plant_bamboo'
        },
        {
            id: 116,
            name: 'plant_fiber'
        },
        {
            id: 129,
            name: 'limestone'
        },
    ];

    static equipments = [];

    static hotkeys = [
        {
            id: 'attributes',
            key: 'a',
            action: Hotkeys.buildActionOpenPage('attributes', 'right'),
            isGameKey: true
        },
        {
            id: 'settings',
            key: 'c',
            action: Hotkeys.buildActionOpenPage('settings', 'right'),
            isGameKey: true
        },
        {
            id: 'inventory',
            key: 'i',
            action: Hotkeys.buildActionOpenPage('inventory', 'right'),
            isGameKey: true
        },
        {
            id: 'equipments',
            key: 'e',
            action: Hotkeys.buildActionOpenPage('equipments', 'right'),
            isGameKey: true
        },
        {
            id: 'map',
            key: 'm',
            action: Hotkeys.buildActionOpenPage('map', 'right'),
            isGameKey: true
        },
        {
            id: 'quests',
            key: 'q',
            action: Hotkeys.buildActionOpenPage('quests', 'right'),
            isGameKey: true
        },
        {
            id: 'achievements',
            key: 'd',
            action: Hotkeys.buildActionOpenPage('achievements', 'right'),
            isGameKey: true
        },
        {
            id: 'store',
            key: 's',
            action: Hotkeys.buildActionOpenPage('store', 'right'),
            isGameKey: true
        },
        {
            id: 'useMana',
            key: 't',
            action: Hotkeys.buildAction({
                callback: () => gameMenu.useItem(5)
            }),
            isGameKey: true
        },
        {
            id: 'useLife',
            key: 'u',
            action: Hotkeys.buildAction({
                callback: () => gameMenu.useItem(11)
            }),
            isGameKey: true
        },
        {
            id: 'useRejuvenation',
            key: 'y',
            action: Hotkeys.buildAction({
                callback: () => gameMenu.useItem(8)
            }),
            isGameKey: true
        },
        // {
        //     id: 'attackPhysical',
        //     key: '1',
        //     action: Hotkeys.buildAction({
        //         callback: () => gameBattleSkill.attackPhysical()
        //     }),
        //     isGameKey: true
        // },
        // {
        //     id: 'attackByClass',
        //     key: '3',
        //     action: Hotkeys.buildAction({
        //         callback: () => gameBattleSkill.attackByClass()
        //     }),
        //     isGameKey: true
        // },
        // {
        //     id: 'attackRun',
        //     key: '4',
        //     action: Hotkeys.buildAction({
        //         callback: () => gameBattleSkill.run()
        //     }),
        //     isGameKey: true
        // },
        {
            id: 'esc',
            key: 'Escape',
            action: Hotkeys.buildAction({
                callback: () => {
                    HTML.elHud.closeHudPages();
                    HTML.elHud.closeModal();
                }
            }),
            isGameKey: false
        },
    ];

    static idItems = {
        gold: 4,
        diamond: 76
    };

    static link = {
        blog: gbUrlsSite.blog,
        discord: gbUrls.discord,
        facebook: gbUrls.facebook,
        instagram: gbUrls.instagram,
        youtube: gbUrls.youtube,
    };

    static get skills() {
        const prefix = 'lo-animation-skill-';
        const skillDefault = `${prefix}punch`;
        const response = [
            {
                id: 'attackColdTouch',
                css: skillDefault,
                isMoving: false,
            },
            {
                id: 'attackCoinThrow',
                css: `${prefix}coin-throw`,
                isMoving: true,
            },
            {
                id: 'attackFireball',
                css: `${prefix}fireball`,
                isMoving: true,
            },
            {
                id: 'attackFireTouch',
                css: skillDefault,
                isMoving: false,
            },
            {
                id: 'attackLightningTouch',
                css: skillDefault,
                isMoving: false,
            },
            {
                id: 'attackMelee',
                css: skillDefault,
                isMoving: false,
            },
            {
                id: 'attackMeleeDouble',
                css: skillDefault,
                isMoving: true,
            },
            {
                id: 'attackMultipleArrows',
                css: `${prefix}arrow`,
                isMoving: true,
            },
            {
                id: 'attackPoisonTouch',
                css: skillDefault,
                isMoving: false,
            },
            {
                id: 'attackThrowWeapon',
                css: `${prefix}throw-weapon`,
                isMoving: true,
            },
        ];

        return response;
    }

    static async update() {
        await ds.Modules.getItems();
        await ds.Modules.getTiles();
        await ds.Modules.getNPCs();
        await ds.Modules.getMonsters();
        await ds.Modules.getQuests();
        await ds.Modules.getAchievements();
    }

    static async updateVariables(data) {
        if (data.equipments) this.equipments = data.equipments;
        if (data.stories) this.stories = data.stories;

        if (data.itemsKind) {
            ds.Modules.itemsKind = data.itemsKind;
            ds.Modules.equipmentsId = data.itemsKind
                .filter(item => item.translation.startsWith('equipment_'))
                .map(item => item.id);
        }
    }
}
export class Storage {
    static get storage() {
        const response = Character.getStorageByCharcaterId(Player.id);

        return response;
    }

    static getDataFiltered(target) {
        const storage = this.storage;

        if (!Array.isArray(storage)) {
            return [];
        }

        const isBankStored = target === 1 || target === 2;
        const belongsToCharacter = (item) => item.id_character === Player.id;
        const isFromBank = (item) => isBankStored && item.id_character === null;

        const response = storage.filter(item =>
            item.stored_at === target && (belongsToCharacter(item) || isFromBank(item))
        );

        return response;
    }

    static getEquipments(storage, ids) {
        const response = Object.fromEntries(
            Object.entries(ids).map(([key, id]) => {
                const item = Character.getEquipmentById(storage, id);
                return [key, item ? item.id_lore : null];
            })
        );

        return response;
    }

    static buildItem(target) {
        if (!target) return;

        let item;
        let quantity;

        if (target.id_lore) {
            item = target.id_lore;
            quantity = target.quantity;
        } else {
            if (target[1]) {
                const index = target[1];

                item = index?.il ? index : Number(target[0]);
                quantity = index?.il ? 1 : index;
            } else {
                item = target.il;
                quantity = target.quantity;
            }
        }

        const response = {
            item,
            quantity
        };

        return response;
    }

    static getItemById(id) {
        const data = Data.storage;
        const response = Object.values(data).filter(item => item.id === id)[0];

        return response;
    }

    static getItemDurabilityById(id) {
        const response = this.getItemById(id)?.durability;

        return response;
    }

    static getIdByTranslation(translation) {
        const data = ds.Modules.itemsKind.find(el => el.translation === translation);
        const response = data ? data.id : null;

        return response;
    }

    static getItemKind(index) {
        let response = {
            isResources: false,
            isMoney: false,
            isUsable: false,
            isCollectable: false,
        };

        const translation = this.getTranslationKindById(index);

        if (translation === 'resources') response.isResources = true;
        if (translation === 'money') response.isMoney = true;
        if (translation === 'usable') response.isUsable = true;
        if (translation === 'collectable') response.isCollectable = true;

        return response;
    }

    static getProperties(props) {
        const {
            id,
            target,
            quantity = 1
        } = props;

        if (!target) return;

        const itemLoot = ds.Helper.findById(ds.Modules.items, Number(target));
        const isDurability = itemLoot.durability > 0;
        const translationItemLoot = itemLoot?.translation;
        const translationEquipment = ds.Translation?.gameEquipment?.[translationItemLoot];
        const translationLoot = ds.Translation.gameLoot;
        const translationLootItem = translationLoot?.[translationItemLoot];
        const translationName = translationEquipment ? translationEquipment : translationLootItem;
        const translationDescription = translationLoot?.[`${translationItemLoot}_description`];

        const translationNameLabel = ds.Translation.getTranslationPage('attributes').name;
        const translationQuantity = ds.Translation.interfaceDefault.amount;
        const weight = itemLoot?.weight ? itemLoot?.weight : 1;
        const kind = itemLoot?.kind;
        const isSameKind = (target) => Storage.getIdByTranslation(target) === kind;
        const isUsable = isSameKind('usable');
        const isMoney = isSameKind('money');
        const isResources = isSameKind('resources');
        const isCollectable = isSameKind('collectable');
        const isEquipment = this.isEquipment(kind);
        const response = {
            id,
            isDurability,
            isEquipment,
            isMoney,
            isUsable,
            isResources,
            isCollectable,
            itemLoot,
            translationName,
            translationDescription,
            translationNameLabel,
            translationQuantity,
            weight,
            quantity,
            idLore: target,
        };

        return response;
    }

    static getUsables(data) {
        let response = [];

        data.forEach((index) => {
            const args = {
                id: index.id,
                target: index.id_lore,
                quantity: index.quantity
            };
            const properties = this.getProperties(args);
            const isUsable = properties.isUsable;

            if (isUsable) response.push(properties);
        });

        return response;
    }

    static getTranslationById = (id) => {
        const item = ds.Helper.findById(ds.Modules.items, Number(id));
        const response = item ? item.translation : null;

        return response;
    };

    static getTranslationKindById = (id) => {
        const item = ds.Modules.itemsKind.find(el => el.id === id);
        const response = item ? item.translation : null;

        return response;
    };

    static isEquipment(id) {
        const response = ds.Modules.equipmentsId.includes(id);

        return response;
    }
}
export class Translation {
    static buildTitlePrice(payment) {
        const detail = ds.Translation.getTranslationPage('detail');
        const label = detail.price;
        const translationLoot = this.translation.gameLoot;
        const translationBronze = translationLoot.coin_bronze;
        const translationDiamond = translationLoot.diamond;
        const payWith = payment === Statics.idItems.gold ? translationBronze : translationDiamond;
        const response = `${label}: (${payWith})`;

        return response;
    }

    static buildTitlePriceDiamond() {
        const response = Translation.buildTitlePrice(76);

        return response;
    }

    static buildRewardText(value) {
        const translationLoot = this.translation.gameLoot;
        const diamond = translationLoot.diamond;
        const response = `${value} (${diamond})`;

        return response;
    }

    static buildTitlePriceGold() {
        const response = Translation.buildTitlePrice(4);

        return response;
    }

    static get customizationDescription() {
        const response = this.translation?.interface?.page_select_customization?.description;

        return response;
    }

    static get customizationTitle() {
        const response = this.translation?.interface?.page_select_customization?.description;

        return response;
    }

    static get translation() {
        const response = ds.Translation;

        return response;
    }
}
export class Tutorial {
    static getIdByActAndScene(act, scene) {
        const ids = Statics.stories;

        for (const [id, story] of Object.entries(ids)) {
            const isMatch = story.act === act && story.scene === scene;

            if (isMatch) {
                return Number(id);
            }
        }

        return null;
    }

    static hasStories(ids) {
        const stories = Player.stories;

        if (!stories) {
            return false;
        }

        const playerStoryIds = Object.values(stories).map(story => story.id);
        const response = ids.every(id => playerStoryIds.includes(id));

        return response;
    }

    static isShowModal(act, scene) {
        const sceneId = this.getIdByActAndScene(act, scene);
        const stories = Player.stories;

        if (!stories) return true;

        const response = !(sceneId in stories);

        return response;
    }

    static showTutorial(act, scene) {
        HTML.elHud.openModalStory(act, scene);
    }

    static showScene(act, scene) {
        const isShowStory = this.isShowModal(act, scene);

        if (isShowStory) this.showTutorial(act, scene);
    }

    static showAct1Scene1() {
        this.showScene(1, 1);
    }

    static showAct1Scene2() {
        this.showScene(1, 2);
    }

    static showAct1Scene3(idMap) {
        const isLastMap = idMap === Statics.idMapDivisionPadixa;
        const hasRequiredStories = this.hasStories([1, 2]);
        const isValid = isLastMap && hasRequiredStories;

        if (isValid) this.showScene(1, 3);
    }
}
export class Walk {
    static lastStep = { x: 0, y: 0 };
    static isWalking = false;
    static cancelCurrentWalk = false;



    static getOccupation(props) {
        const { el, x, y } = props;
        const isPlayer = this.isPlayer(el);

        if (!isPlayer) return;

        const occupation = HTML.elMapGame.getOccupation(x, y);

        if (!occupation || !occupation.target) {
            console.warn(`No valid target at (${x}, ${y})`);
            return;
        }

        const target = occupation.target;
        const kind = target.getAttribute('kind');

        if (kind === Monsters.prefix) {
            this.cancelCurrentWalk = true;
            HTML.elGameBattle.build(target);
        }
        if (kind === Collectibles.prefix) {
            const id = Layout.unBuildId(Collectibles.prefix, target.id);
            Collectibles.pickUp(id);
        }
    }

    static isPlayer(el) {
        const response = el === HTML.elGamePlayer;

        return response;
    }

    static updateEntityState(el, direction, action) {
        el.setAttribute('direction', direction);
        el.setAttribute('action', action);
    }

    static verifyDirection(element, nextStep) {
        const currentX = Number(element.getAttribute(ds.Prefix.ATTR_DATA_POSITION_X));

        if (nextStep.x > currentX) return 'right';
        if (nextStep.x < currentX) return 'left';

        const currentY = Number(element.getAttribute(ds.Prefix.ATTR_DATA_POSITION_Y));

        if (nextStep.y > currentY) return 'down';
        if (nextStep.y < currentY) return 'up';

        return 'down';
    }

    static async walk(props) {
        const { el, positionXFrom, positionXTo, positionYTo, positionYFrom } = props;
        const isPlayer = this.isPlayer(el);
        const isBattle = HTML.elGameBattle.isBattle;

        if (!isPlayer && isBattle) return;

        if (this.isWalking && isPlayer) {
            this.cancelCurrentWalk = true;
            return;
        }

        const xFrom = isPlayer ? Number(el.getAttribute(ds.Prefix.ATTR_DATA_POSITION_X)) : Number(positionXFrom);
        const yFrom = isPlayer ? Number(el.getAttribute(ds.Prefix.ATTR_DATA_POSITION_Y)) : Number(positionYFrom);
        const xTo = Number(positionXTo);
        const yTo = Number(positionYTo);

        const path = HTML.elMapGame.findPath({
            start: [xFrom, yFrom],
            end: [xTo, yTo]
        });

        const isInvalid = !path || path.length === 0;

        if (isInvalid) return;

        const isShift = path[0][0] === xFrom && path[0][1] === yFrom;

        if (isShift) path.shift();

        el.setAttribute('data-path', JSON.stringify(path));

        if (isPlayer) {
            this.cancelCurrentWalk = false;
            this.isWalking = true;
        }

        if (path.length > 0) {
            const direction = this.verifyDirection(el, { x: path[0][0], y: path[0][1] });
            this.updateEntityState(el, direction, 'walk');
        }

        const walkArgs = {
            el,
            path,
            positionXFrom: xFrom,
            positionYFrom: yFrom
        };

        await this.walkLoop(walkArgs);
    }
    static walkClick(evet) {
        const el = evet.target;
        const dataset = el.dataset;
        const positionXTo = Number(dataset.positionX);
        const positionYTo = Number(dataset.positionY);
        const args = {
            el: HTML.elGamePlayer,
            positionXTo,
            positionYTo
        };

        Walk.walk(args);
    }

    static async walkLoop(props) {
        const { el } = props;
        const isPlayer = this.isPlayer(el);
        let path = JSON.parse(el.getAttribute('data-path'));
        let direction = '';

        while (path.length > 0) {
            const isInvalid = isPlayer && this.cancelCurrentWalk;

            if (isInvalid) break;

            const nextStep = { x: path[0][0], y: path[0][1] };

            direction = this.verifyDirection(el, nextStep);
            this.updateEntityState(el, direction, 'walk');

            path.shift();
            el.setAttribute('data-path', JSON.stringify(path));

            await this.walkAnimation({ el, direction }, [nextStep.x, nextStep.y]);

            const isLastStep = path.length === 0;
            const args = {
                el,
                x: nextStep.x,
                y: nextStep.y,
                isLastStep
            };

            this.getOccupation(args);
        }

        if (isPlayer) this.walkEndPlayer(props);

        this.updateEntityState(el, direction, 'stand');
    }

    static walkEndPlayer(props) {
        this.isWalking = false;

        const { el } = props;
        const tilePositionX = Number(el.getAttribute(ds.Prefix.ATTR_DATA_POSITION_X));
        const tilePositionY = Number(el.getAttribute(ds.Prefix.ATTR_DATA_POSITION_Y));
        const elMap = HTML.elMapGame.elMap;
        const args = {
            map: elMap,
            x: tilePositionX,
            y: tilePositionY
        };
        const elTile = ds.MapGame.getTileByPosition(args);
        const elTileId = elTile.getAttribute('data-id');
        const doorIndex = HTML.elMapGame.map.doors.indexOf(elTileId);
        const isDoor = doorIndex !== -1;

        if (isDoor) MapGame.changeMap(doorIndex);
    }

    static walkAnimation(props, walkTo) {
        const { el } = props;
        const isPlayer = this.isPlayer(el);

        if (isPlayer) this.walkMoveMap(props);

        const animationDuration = Data.player.attributes.speed
            || Number(el.getAttribute('data-speed'))
            || 300;

        const tileSize = ds.Layout.tileSize;

        el.setAttribute(ds.Layout.attributePositionX, walkTo[0]);
        el.setAttribute(ds.Layout.attributePositionY, walkTo[1]);

        return Animation.animatePosition({
            target: el,
            vertical: walkTo[1] * tileSize,
            horizontal: walkTo[0] * tileSize,
            speed: animationDuration
        });
    }

    static walkMoveMap(props) {
        const { direction } = props;
        const currentValue = ds.Helper.getTranslateValue(HTML.elMapGame);
        const tileSize = ds.Layout.tileSize;
        let horizontal = currentValue.x;
        let vertical = currentValue.y;

        if (direction === 'left') horizontal += tileSize;
        if (direction === 'right') horizontal -= tileSize;
        if (direction === 'up') vertical += tileSize;
        if (direction === 'down') vertical -= tileSize;

        const args = {
            target: HTML.elMapGame,
            vertical,
            horizontal,
            speed: Data.player.attributes.speed
        };

        Animation.animatePosition(args);

        Camera.center();
    }
}

export class BaseComponent extends HTMLElement {
    #controller = null;

    connectedCallback() {
        this.render();
        this.rebindListeners();
    }

    rebindListeners() {
        this.#controller?.abort();
        this.#controller = new AbortController();
        this.addEventListeners(this.#controller.signal);
    }

    render() {}

    addEventListeners() {}
}
export class Battle extends HTMLElement {
    args = {
        context: this,
    };
    monster;
    static monsterData;
    static isBattle = false;
    turnCurrent;
    turnLast;



    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.render();
    }



    get isTurnPlayer() {
        const response = this.turnCurrent === ds.Prefix.PLAYER;

        return response;
    }

    async build(target) {
        if (!target) return;

        HTML.elTransition.openByKind('battle');

        const id = Monsters.unBuildId(target.getAttribute('id'));
        const args = { id };
        const dataFetch = await FetchData.buildBattle(args);

        if (!dataFetch) return;

        this.buildMonster(target, dataFetch);
        Battle.isBattle = true;
        this.modifyLayout();
        this.turnCurrent = dataFetch.turn;
        Audio.buildMusic();

        const monsterLevel = target.getAttribute('data-level');
        const playerLevel = Data.player?.attributes?.level;

        Analytics.send({
            event_name: 'battle_start',
            monster_id: id,
            monster_level: monsterLevel,
            player_level: playerLevel,
        });

        setTimeout(() => {
            HTML.elTransition.close();
            HTML.elHud.openModalBattle(target);
            Data.setData(dataFetch);
        }, HTML.elTransition.timeout3);
    }

    async buildMonster(target, data) {
        Battle.monsterData = data;
        this.monster = target;
    }

    draw() {
        const response = '';

        return response;
    }

    async getTurn() {
        const response = FetchData.getTurn();

        return response;
    }

    modifyLayout() {
        const css = 'gm-bars-overlay';
        const isBattle = Battle.isBattle;
        const elHudFooter = HTML.elHudFooter;
        const elHudMenu = HTML.elHudMenu;

        if (isBattle) {
            ds.Helper.addClass(elHudFooter, css);
            elHudMenu.disableButtons();
        } else {
            ds.Helper.removeClass(elHudFooter, css);
            elHudMenu.enableButtons();
        }
    }

    render() {
        const component = this.draw();

        ds.Components.render(this.args, component);
    }

    removeMonster() {
        const id = this.monster.getAttribute('id');
        const el = HTML.elMapGame.shadowRoot.getElementById(id);

        el?.remove();
    }

    static showDeathPenalty() {
        const translation = ds.Translation.gameBattle;
        const abandoned = translation.abandoned;
        const battleLose = translation.lose;
        const text = `${abandoned} ${battleLose}`;
        const rule = Layout.replaceInText(text);

        const argsNotification = {
            color: 'red',
            content: rule,
        };

        Notification.add(argsNotification);
    }

    unbuild() {
        Battle.isBattle = false;

        this.modifyLayout();
        this.removeMonster();

        HTML.elHud.close(HTML.elHudModal);

        Audio.buildMusic();
    }
}
export class CharacterCustomization extends HTMLElement {
    args = {
        context: this,
    };
    idFieldName = 'name';
    static idFieldPrice = 'field_price';
    static eventNameChange = 'nameChange';
    static eventCustomizationChange = 'customizationChange';



    constructor() {
        super();

        this.attachShadow({ mode: 'open' });

        this.render();
        this.addEventListeners();
    }



    addEventListeners() {
        if (this.isFullContent) {
            this.elFieldNameInput.addEventListener('input', () => {
                this.dispatchNameChange();
            });
        }

        this.addEventListenersSelects();
    }

    addEventListenersSelects() {
        const componentSelect = ds.Components.componentSelect;
        const selects = this.shadowRoot.querySelectorAll(componentSelect);

        selects.forEach((select) => {
            select.addEventListener('change', (event) => {
                this.dispatchCustomizationChange(event);
            });
        });
    }

    buildDrawData() {
        const translationEquipment = ds.Translation.gameEquipment;
        const translationPlayer = ds.Translation.gamePlayer;

        const raw = this.getAttribute('data');
        const parsed = raw
            ? JSON.parse(decodeURIComponent(raw))
            : {};

        const clothes = this.buildItems({
            list: parsed.clothesDefault || []
        });

        const hair = this.buildItems({
            list: parsed.hairDefault || []
        });

        const response = {
            clothes: this.drawSelect({
                id: 'clothes',
                css: ds.Layout.cssFormField,
                label: translationEquipment?.clothes,
                options: this.buildOptions(clothes),
                key: 'clothes'
            }),
            hair: this.drawSelect({
                id: 'hair_equipment',
                css: ds.Layout.cssFormField,
                label: translationEquipment?.hair,
                options: this.buildOptions(hair),
                key: 'hair_equipment'
            }),
            eye: this.drawSelect({
                id: 'eye',
                css: ds.Layout.cssFormField,
                label: translationPlayer?.color_eye,
                options: this.buildOptions(
                    this.buildTranslatedOptions({
                        list: parsed.colors || []
                    })
                ),
                key: 'eye'
            }),
            skin: this.drawSelect({
                id: 'skin',
                css: ds.Layout.cssFormField,
                label: translationPlayer?.color_skin,
                options: this.buildOptions(
                    this.buildTranslatedOptions({
                        list: parsed.skins || []
                    })
                ),
                key: 'skin'
            }),
            hairColor: this.drawSelect({
                id: 'hair',
                css: ds.Layout.cssFormField,
                label: translationPlayer?.color_hair,
                options: this.buildOptions(
                    this.buildTranslatedOptions({
                        list: parsed.colors || []
                    })
                ),
                key: 'hair'
            })
        };

        return response;
    }

    buildItems(args) {
        const response = args.list.map((id, index) => {
            const itemData = ds.Helper.findById(
                ds.Modules.items,
                Number(id)
            );

            const translation = ds.Translation.gameCustomization?.[itemData.translation] || itemData.translation;
            const args = {
                label: `${translation} ${index + 1}`,
                id_customization: id
            };

            return args;
        });

        return response;
    }

    buildOptions(list) {
        const response = JSON.stringify({
            label: list.map(item => item.label),
            value: list.map(item => item.id_customization)
        });

        return response;
    }

    buildTranslatedOptions(args) {
        const response = args.list.map(item => ({
            ...item,
            label: ds.Translation.gameCustomization?.[item.label] || item.label
        }));

        return response;
    }

    dispatchCustomizationChange(event) {
        const key = event.target.getAttribute('data-key');
        const value = event.detail.value;
        const customEvent = new CustomEvent(CharacterCustomization.eventCustomizationChange, {
            bubbles: true,
            composed: true,
            detail: { key, value }
        });

        this.dispatchEvent(customEvent);
    }

    dispatchNameChange() {
        const event = new CustomEvent(CharacterCustomization.eventNameChange, {
            bubbles: true,
            composed: true
        });

        this.dispatchEvent(event);
    }

    draw() {
        const data = this.buildDrawData();
        const content = this.drawContent(data);

        const response = `
            <form class="ds-form form--readonly">
                ${content}
            </form>
        `;

        return response;
    }

    drawContent(data) {
        let response = '';

        if (this.isFullContent) response += this.drawContentFull(data);

        response += this.drawContentColors(data);

        return response;
    }

    drawContentColors(data) {
        let response = '';
        const { eye, skin, hairColor } = data;

        if (this.isFullContent) {
            response = `
                <div class="ds-row">
                    ${eye}
                    ${skin}
                    ${hairColor}
                </div>
            `;
        } else {
            const label = Translation.buildTitlePrice();
            const fieldPrice = ds.Layout.drawField({
                label,
                value: 0,
                id: CharacterCustomization.idFieldPrice
            });

            response = `
                <div class="ds-row">
                    <div class="ds-row">
                        ${eye}
                        ${skin}
                    </div>
                    <div class="ds-row">
                        ${hairColor}
                    </div>
                    <div class="ds-row">
                        ${fieldPrice}
                    </div>
                </div>
            `;
        }

        return response;
    }

    drawContentFull(data) {
        const { clothes, hair } = data;
        const elName = this.drawNameField();
        const response = `
            ${elName}
            <div class="ds-row">
                ${clothes}
                ${hair}
            </div>
        `;

        return response;
    }

    drawNameField() {
        const css = ds.Layout.cssFormField;
        const translationPage = ds.Translation.getTranslationPage('attributes');
        const componentFormField = ds.Components.componentFormField;
        const wrapper = ds.Layout.theme.form;
        const response = `
            <div class="ds-row">
                <${componentFormField}
                    class="${css} ds-row"
                    label="${translationPage?.name}"
                    id="${this.idFieldName}"
                    input-value=""
                    css-wrapper="${wrapper}"
                ></${componentFormField}>
            </div>
        `;

        return response;
    }

    drawSelect(props) {
        const { id, css, label, options, key } = props;
        const componentSelect = ds.Components.componentSelect;
        const wrapper = ds.Layout.theme.dropDownFull;
        const response = `
            <${componentSelect}
                id="${id}"
                class="${css}"
                label="${label}"
                options='${options}'
                data-key="${key}"
                css-wrapper="${wrapper}"
            ></${componentSelect}>
        `;

        return response;
    }

    static getData(action) {
        const statics = lo.Statics;
        const allColors = statics.colors;
        const allSkins = statics.skins;
        const owned = Data.customizations;
        const ownedSet = new Set(
            Object.values(owned).map(item => `${item.kind}_${item.id_customization}`)
        );
        const buildItem = (item) => `${item.kind}_${item.id_customization}`;
        const filterApply = (list) => list.filter(item => ownedSet.has(buildItem(item)));
        const filterBuy = (list) => list.filter(item => !ownedSet.has(buildItem(item)));
        const filter = action === 'apply' ? filterApply : filterBuy;
        const filtered = {
            clothesDefault: statics.clothesDefault,
            hairDefault: statics.hairDefault,
            colors: filter(allColors),
            skins: filter(allSkins)
        };
        const response = encodeURIComponent(JSON.stringify(filtered));

        return response;
    }

    get elFieldName() {
        const response = this.shadowRoot.getElementById(this.idFieldName);

        return response;
    }

    get elFieldNameInput() {
        const response = this?.elFieldName?.shadowRoot.querySelector('input');

        return response;
    }

    getFieldNameValue() {
        const response = ds.FormField.getInputValueByTarget(this.elFieldName);

        return response;
    }

    get isFullContent() {
        const dataContent = this.getAttribute('data-content');
        const response = dataContent === 'full';

        return response;
    }

    render() {
        const component = this.draw();

        ds.Components.render(this.args, component);
    }
}
export class CharacterRotation extends HTMLElement {
    args = {
        context: this,
    };
    idChangeDirection = 'change_direction';
    static customizations;
    static customizationsCurrent;
    static equipments;
    static equipmentsCurrent;



    constructor() {
        super();

        this.attachShadow({ mode: 'open' });

        CharacterRotation.equipments.helmet = null;
        CharacterRotation.equipments.eyes = null;

        this.render();
        this.addEventListeners();
        this.setInitialDirection();
    }



    addEventListeners() {
        const data = [];
        const elCharacterNew = this.buttons;

        elCharacterNew.forEach((el) => {
            const args = {
                el,
                handler: this.handleChangeDirection
            };

            data.push(args);
        });

        data.forEach((index) => {
            index.context = this;

            ds.Helper.addEventListener(index);
        });

        const componentButton = ds.Components.componentButton;

        ds.Layout.addEventListeners(this, componentButton);
    }

    draw() {
        const character = this.drawCharacter();
        const response = `
            ${character}
        `;

        return response;
    }

    drawCharacter() {
        const customizations = CharacterRotation.customizations;
        const equipments = CharacterRotation.equipments;
        const customizationsClass = ds.Helper.buildJSONToHTML(customizations);
        const equipmentsClass = ds.Helper.buildJSONToHTML(equipments);
        const menu1 = this.drawMenuDirection(['up', 'down']);
        const menu2 = this.drawMenuDirection(['left', 'right']);
        const theme = ds.Layout.theme.card;
        const response = `
            ${menu1}
            <div class="ds-card--big gm-card--player ${theme} gm-character-rotation">
                <div class="ds-card__body">
                    <${lo.Components.entity}
                        entity="person"
                        direction="down"
                        action="walk"
                        customizations=${customizationsClass}
                        equipments=${equipmentsClass}
                        tabindex="-1"
                    ></${lo.Components.entity}>
                </div>
            </div>
            ${menu2}
        `;

        return response;
    }

    drawMenuDirection(menu) {
        const theme = ds.Layout.theme;
        const themeButton = theme.menuDefault;
        const themeSize = theme.menuSize;
        const themeIcon = theme.menuDefaultIcon;
        let response = '<div class="ds-button-wrapper ds-row">';

        menu.forEach((index) => {
            const isDisabled = index === 'down';
            const componentButton = ds.Components.componentButton;

            response += `
                <${componentButton}
                    theme="${themeButton}"
                    size="${themeSize}"
                    data-direction="${index}"
                    data-id="${this.idChangeDirection}"
                    icon="arrow_${index}"
                    icon-size="regular"
                    icon-theme="${themeIcon}"
                    ${ds.Prefix.ATTR_IS_DISABLED}="${isDisabled}"
                ></${componentButton}>
            `;
        });

        response += '</div>';

        return response;
    }

    get buttons() {
        const response = this.shadowRoot.querySelectorAll(`[data-id="${this.idChangeDirection}"]`);

        return response;
    }

    handleChangeDirection(event) {
        const target = event.currentTarget;
        const direction = target.getAttribute('data-direction');
        const elPerson = this.shadowRoot.querySelector(lo.Components.entity);

        this.removeDisabledDirectionButtons();
        this.setDisabledDirectionButton(target);

        elPerson.setAttribute('direction', direction);
    }

    removeDisabledDirectionButtons() {
        const elButtons = this.buttons;

        elButtons.forEach((elButton) => {
            elButton.removeAttribute(ds.Prefix.ATTR_IS_DISABLED);
        });
    }

    render() {
        const component = this.draw();

        ds.Components.render(this.args, component);
    }

    setDisabledDirectionButton(elButton) {
        elButton.setAttribute(ds.Prefix.ATTR_IS_DISABLED, 'true');
    }

    setInitialDirection() {
        const elButton = this.shadowRoot.querySelector('[data-direction="down"]');

        this.setDisabledDirectionButton(elButton);
    }

    updateCustomizations({ key, value }) {
        const customizationKeys = { eye: true, skin: true, hair: true };
        const equipmentKeys = { hair_equipment: 'hair', clothes: 'clothes' };

        const isReset = value === '' || value === null || value === undefined;

        if (customizationKeys[key]) {
            CharacterRotation.customizations = {
                ...CharacterRotation.customizations,
                [key]: isReset
                    ? CharacterRotation.customizationsCurrent?.[key]
                    : Number(value)
            };
        }

        if (equipmentKeys[key]) {
            const equipmentKey = equipmentKeys[key];

            CharacterRotation.equipments = {
                ...CharacterRotation.equipments,
                [equipmentKey]: isReset
                    ? CharacterRotation.equipmentsCurrent[equipmentKey]
                    : Number(value)
            };
        }

        this.render();
        this.addEventListeners();
        this.setInitialDirection();
    }
}
export class Game extends HTMLElement {
    args = {
        context: this,
    };
    isPlaying = false;
    static cssContentPosition = 'ds-content-position';



    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.render();
    }



    draw() {
        const componentBattle = Components.battle;
        const componentMap = Components.map;
        const response = `
            <main
                id="${HTML.idGameMain}"
                class="${Game.cssContentPosition}"
            >
                <${componentBattle}
                    id="${HTML.idGameBattle}"
                    class="${Game.cssContentPosition}"
                ></${componentBattle}>
                <${componentMap}
                    id="${HTML.idMapGame}"
                    class="${Game.cssContentPosition} ${ds.Layout.cssAnimationPrepare}"
                ></${componentMap}>
            </main>
        `;

        return response;
    }

    static drawBackground(background) {
        const css = `${Game.cssContentPosition} gm-map-background--${background}`;

        HTML.elGameMain.setAttribute('class', css);
    }

    render() {
        const component = this.draw();

        ds.Components.render(this.args, component);
    }

    setIsPlaying(value) {
        this.isPlaying = value;
    }

    setOfuscated(value) {
        const css = 'gm--obfuscated';
        const elGame = HTML.elGameMain;

        if (value) return ds.Helper.addClass(elGame, css);

        ds.Helper.removeClass(elGame, css);
    }
}
export class Hud extends HTMLElement {
    args = {
        context: this,
    };
    pagePrefix = 'gm-hud-page-';
    static pageDetail;



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

    static clearTooltip() {
        ds.Tooltip.clear();
    }

    close(el) {
        el.setAttribute(ds.Layout.attributeOpen, 'false');
        this.setGameObfuscated();
        Hud.clearTooltip();
        HTML.elHudMenu.setActive();
    }

    closeModal() {
        const isCLoseButton = HTML.elHudModal.getAttribute('is-close-button');
        const isValid = isCLoseButton !== 'false';

        if (isValid) this.close(HTML.elHudModal);
    }

    closeModalWithoutButton() {
        this.close(HTML.elHudModal);
    }

    closeHudPage(props) {
        const { pagePosition } = props.detail;
        const el = Hud.getElHudPage(pagePosition);

        this.close(el);
        this.setPage(el, null);
    }

    closeHudPages() {
        const pages = ['right', 'left'];

        pages.forEach((page) => {
            const el = Hud.getElHudPage(page);
            this.close(el);
        });
    }

    draw() {
        const componentTransition = Components.cHudTransition;
        const componentGame = Components.game;
        const componentStatus = Components.cHudStatus;
        const componentMenu = Components.cHudMenu;
        const componentModal = ds.Components.componentModal;
        const componentPage = ds.Components.componentPage;
        const response = `
            <${componentTransition}
                id="${HTML.idTransition}"
                ${ds.Layout.attributeOpen}="true"
                kind="loading"
            ></${componentTransition}>
            <div class="gm-hud gm-hud__background">
                <div class="gm-hud-size gm-hud-camera gm-hud-camera-shadow">
                    <${componentModal}
                        id="${HTML.idHudModal}"
                        page-title=""
                        page-description=""
                        size=""
                        ${ds.Layout.attributeOpen}="false"
                        is-close-button="false"
                        page=""
                        class="ds-display-contents"
                    ></${componentModal}>
                    <div class="gm-hud__content">
                        <${componentPage}
                            id="${HTML.idHudPageLeft}"
                            class="ds-page-height"
                            position="left"
                            ${ds.Layout.attributeOpen}="false"
                        ></${componentPage}>
                        <${componentPage}
                            id="${HTML.idHudPageRight}"
                            class="ds-page-height"
                            position="right"
                            ${ds.Layout.attributeOpen}="false"
                        ></${componentPage}>
                        <${componentGame}
                            id="${HTML.idGame}"
                            class="ds-page-height gm"
                        ></${componentGame}>
                    </div>
                    <div
                        class="gm-hud__footer"
                        id="${HTML.idHudFooter}"
                    >
                        <section class="ds-content__navigation ds-content-theme--navigation">
                            <${componentStatus}
                                id="${HTML.idHudStatus}"
                                class="ds-content__bars"
                            ></${componentStatus}>
                            <${componentMenu}
                                id="${HTML.idHudMenu}"
                                class="ds-content__menu ds-right"
                            ></${componentMenu}>
                        </section>
                    </div>
                </div>
            </div>
        `;

        return response;
    }

    static getElHudPage(target) {
        const capitalize = ds.Helper.capitalizeString(target);
        const response = HTML[`elHudPage${capitalize}`];

        return response;
    }

    open(el) {
        el?.setAttribute(ds.Layout.attributeOpen, 'true');

        this.setGameObfuscated();
    }

    openPage(props) {
        const {
            context,
            pageTarget,
            pagePosition,
            isNPC,
            name
        } = props.detail;
        const elPage = Hud.getElHudPage(pagePosition);
        const isOpened = elPage?.getAttribute(ds.Layout.attributeOpen) === 'true';
        const isSamePage = elPage?.getAttribute('page') === pageTarget;
        const isValid = !isOpened || !isSamePage;

        if (isValid) {
            this.setPage(elPage, pageTarget);
            this.open(elPage);
            this.openPageTexts(elPage, pageTarget);

            if (isNPC) {
                this.setPageNpc(name);
                elPage.setAttribute('data-npc', name);
            }

            Hud.pageDetail = props.detail;

            HTML.elHudMenu.setActive(context);
        } else if (isOpened && isSamePage) {
            this.closeHudPage({ detail: { pagePosition } });
        }
    }

    static openPageDetail(props) {
        const { id, context, backFilter } = props;
        const pagePosition = context.parentNode?.parentNode?.parentNode?.getAttribute('data-position');
        const elPage = Hud.getElHudPage(pagePosition);
        const npc = elPage?.getAttribute('data-npc');
        const from = npc ? `npc-${npc}` : context.getAttribute('page');
        const pageTarget = 'detail';
        const isNPC = npc ? true : false;
        const args = {
            detail: {
                item: id,
                page: elPage,
                pageTarget,
                pagePosition,
                from,
                isDetail: true,
                isNPC,
                name: npc,
                backFilter
            }
        };

        Statics.temp.itemData = id;

        HudPageDetail.setDataFrom(props);

        Hud.clearTooltip();

        if (elPage) elPage.lastPage = args.detail;

        HTML.elHud.openPage(args);
        HTML.elHud.setPage(elPage, pageTarget);
    }

    openPageTexts(elPage, pageTarget) {
        const isPrefix = pageTarget?.startsWith(this.pagePrefix);
        const page = isPrefix ? pageTarget?.slice(this.pagePrefix.length) : pageTarget;
        const translation = ds.Translation.getTranslationPage(page);
        const title = translation?.title;

        if (title) elPage.setTitle(title);

        const text = translation?.description;

        if (text) elPage.setText(text);
    }

    openPageChangeModal(props) {
        HTML.elGame.setIsPlaying(false);
        HTML.elHudModal.setAttribute('is-close-button', true);

        this.closeHudPages();
        this.closeModal();
        this.openModal(props);
    }

    openModal(props) {
        const {
            target,
            title,
            description = '',
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

    openModalBattle() {
        const args = {
            target: 'battle',
            title: ds.Translation.gameBattle?.battle,
            size: 'extra-small',
            isCloseButton: false,
        };

        this.openPageChangeModal(args);
    }

    openModalCustomize() {
        const props = {
            target: 'select-customization',
            title: Translation.customizationTitle,
            description: Translation.customizationDescription,
            size: 'big',
            isCloseButton: false
        };

        this.openPageChangeModal(props);
    }

    openModalSelectClass() {
        const props = {
            target: 'select-class',
            title: ds.Translation.interfaceDefault?.select_class,
            description: ds.Translation?.interface?.page_select_class?.description,
            size: 'small',
            isCloseButton: false,
        };

        this.openPageChangeModal(props);
    }

    openModalSelectCharacter(isCloseButton = true) {
        const props = {
            target: 'select-character',
            title: ds.Translation.interface?.page_select_character?.title,
            description: ds.Translation.interface?.page_select_character?.description,
            size: 'small',
            isCloseButton,
        };

        this.openPageChangeModal(props);
    }

    openModalStory(act, scene) {
        const translation = ds.Translation.gameStory;
        const title = translation[`act_${act}_scene_${scene}_title`];
        const props = {
            target: 'story',
            title,
            size: 'regular',
            isCloseButton: false
        };

        HudPageStory.act = act;
        HudPageStory.scene = scene;

        this.openPageChangeModal(props);
    }

    openModalUserEdit() {
        const translation = ds.Translation.loginDefault;
        const content = HudPageUserEdit.content;
        const title = translation[content];
        const props = {
            target: 'user-edit',
            title,
            size: 'small',
            isCloseButton: true
        };

        this.openPageChangeModal(props);
    }

    openModalUserDeleteAccount() {
        const translation = ds.Translation.interfaceDefault;
        const title = translation.delete_account;
        const props = {
            target: 'user-delete-account',
            title,
            size: 'small',
            isCloseButton: true
        };

        this.openPageChangeModal(props);
    }

    render() {
        const component = this.draw();

        ds.Components.render(this.args, component);
    }

    setPage(el, page) {
        const normalizedPage = page?.startsWith('npc-')
            ? 'npc'
            : page;

        const pageName = normalizedPage?.startsWith(this.pagePrefix)
            ? normalizedPage
            : `${this.pagePrefix}${normalizedPage}`;

        el?.setAttribute('page', pageName);
    }

    setPageNpc(target) {
        const el = HTML.elHudPageLeft;

        el.setTitle(target);

        const dialogs = ds.Translation.dialog[target];
        const index = Math.floor(Math.random() * 4) + 1;
        const text = dialogs[`dialog_${index}`];
        const defaultText = dialogs.default;
        const fullText = `${text}\n\n${defaultText}`;
        const translation = Layout.replaceInText(fullText, true);

        el.setText(translation);
    }

    setGameObfuscated() {
        const isPageRight = HTML?.elHudPageRight.getAttribute(ds.Layout.attributeOpen) === 'true';
        const isPageLeft = HTML?.elHudPageLeft.getAttribute(ds.Layout.attributeOpen) === 'true';
        const isModal = HTML.elHudModal?.getAttribute(ds.Layout.attributeOpen) === 'true';
        let isOfuscated = false;

        if (isPageRight) isOfuscated = true;
        if (isPageLeft) isOfuscated = true;
        if (isModal) isOfuscated = true;

        HTML.elGame.setOfuscated(isOfuscated);
    }
}
export class HudActionPoints extends HTMLElement {
    args = {
        context: this,
    };
    static attributeActionPoints = 'data-action-points';



    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.render();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        const isInvalid = oldValue === newValue;

        if (isInvalid) return;

        this.render();
    }

    static get observedAttributes() {
        const response = [HudActionPoints.attributeActionPoints, 'data-tooltip'];

        return response;
    }



    draw() {
        const actionPoints = this.getAttribute(HudActionPoints.attributeActionPoints) ?? 0;
        const response = `
            <span class="gm-content__action-points">
                <span class="gm-content__action-value">
                    ${actionPoints}
                </span>
            </span>
        `;

        return response;
    }

    render() {
        const component = this.draw();

        ds.Components.render(this.args, component);
        ds.Tooltip?.elTooltipWrapper?.build(this.args);
    }
}
export class HudContentMoney extends HTMLElement {
    #args = {
        context: this,
    };



    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.render();
    }




    render() {
        const component = this.#draw();

        ds.Components.render(this.#args, component);
    }

    redraw() {
        this.render();
    }



    #draw() {
        const ids = Statics.idItems;
        const idGold = ids.gold;
        const idDiamond = ids.diamond;
        const golds = Player.inventoryGold;
        const diamonds = Player.inventoryDiamonds;
        const argsIconGold = { item: idGold, isDurability: false };
        const iconGold = lo.HTML.drawLoot(argsIconGold);
        const argsIconDiamond = { item: idDiamond, isDurability: false };
        const iconDiamond = lo.HTML.drawLoot(argsIconDiamond);
        const drawItem = (icon, value) => `
            ${icon}
            <span class="gm-label">${value}</span>
        `;
        const translation = ds.Translation.interfaceDefault.in_your_inventory;
        const response = `
            <div class="ds-row ds-center gm-content-money">
                ${translation}:
                ${drawItem(iconGold, golds)}
                ${drawItem(iconDiamond, diamonds)}
            </div>
        `;

        return response;
    }
}
export class HudMenu extends HTMLElement {
    args = {
        context: this,
    };



    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.render();
    }



    get buttonFirst() {
        const response = this.buttons[0];

        return response;
    }

    get buttons() {
        const componentButton = ds.Components.componentButton;
        const response = this.shadowRoot.querySelectorAll(componentButton);

        return response;
    }

    buildTooltip(page) {
        const getTranslationTitle = (target) => ds.Translation.getTranslationPage(target)?.title;
        const title = getTranslationTitle(page);
        const hotkey = Hotkeys.getKey(page);
        const response = title ? ds.Translation.buildTextAndHotkey(title, hotkey) : '';

        return response;
    }

    enableButtons() {
        this.setActiveButtons(false);
    }

    disableButtons() {
        this.setActiveButtons(true);
    }

    draw() {
        let response = '';

        Statics.buttonsMainMenu.forEach((index) => {
            const buttonArgs = {
                id: index.id || '',
                icon: index.icon,
                target: index.pageTarget,
                css: index.css + ' ds-hide--mobile',
                tooltip: this.buildTooltip(index.translation)
            };

            response += this.drawButton(buttonArgs);
        });

        const buttonMenu = Statics.buttons.mainMenu;
        const buttonMenuArgs = {
            id: buttonMenu.id,
            icon: buttonMenu.icon,
            target: buttonMenu.pageTarget,
            css: buttonMenu.css
        };

        response += this.drawButton(buttonMenuArgs);

        return response;
    }

    drawButton(props) {
        const {
            id,
            icon,
            target,
            css,
            tooltip
        } = props;
        const componentButton = ds.Components.componentButton;
        let response = `
            <${componentButton}
                id="${id}"
                icon="${icon}"
                icon-size="big"
                theme="outline--white"
                size="extra-big"
                is-proportional="true"
                is-disabled="false"
                page-target="${target}"
                page-position="right"
                click="open-hud-page"
                css-custom="${css}"
                css-wrapper="gm-style"
                data-kind="button"
        `;

        if (tooltip) response += `data-tooltip="${tooltip}"`;

        response += `></${componentButton}>`;

        return response;
    }

    render() {
        const component = this.draw();

        ds.Components.render(this.args, component);
    }

    setActive(target = undefined) {
        if (target) {
            ds.Layout.setActiveButton(target);
        } else {
            const elButton = this.buttonFirst;

            ds.Layout.setActiveButton(elButton, false);
        }
    }

    setActiveButtons(action) {
        this.buttons.forEach((index) => {
            index.setAttribute(ds.Prefix.ATTR_IS_DISABLED, action);
        });
    }

    updateData() {
        this.render();
    }
}
export class HudPageAbout extends HTMLElement {
    args = {
        context: this,
    };



    constructor() {
        super();

        this.attachShadow({ mode: 'open' });

        this.render();
    }



    draw() {
        const translation = ds.Translation.getTranslationPage('attributes');
        const drawAttributes = this.drawAttributes(translation);
        const drawAbout = this.drawAbout(translation);
        const content = `
            ${drawAbout}
            ${drawAttributes}
        `;
        const response = HudPageAttributes.drawPage(content);

        return response;
    }

    drawAbout(translation) {
        const data = Player.attributes;
        const className = Statics.classes[data?.class].class;
        const translationClass = ds.Translation.buildPlayerClass(className);
        const experience = HudPageAttributes.formatExperience(data.experience);
        const experienceNext = HudPageAttributes.formatExperience(data.experienceNext);
        const fields = [
            {
                label: translation?.name,
                value: data.name,
                isReadOnly: true

            },
            {
                label: translation?.level,
                value: data.level,
                isReadOnly: true
            },
            {
                label: translation?.class,
                value: translationClass,
                isReadOnly: true
            },
            {
                label: translation?.life,
                value: data.hitPoints,
                isReadOnly: true
            },
            {
                label: translation?.life_maximum,
                value: data.hitPointsMaximum,
                isReadOnly: true
            },
            {
                label: translation?.mana,
                value: data.manaPoints,
                isReadOnly: true
            },
            {
                label: translation?.mana_maximum,
                value: data.manaPointsMaximum,
                isReadOnly: true
            },
            {
                label: translation?.experience,
                value: experience,
                isReadOnly: true
            },
            {
                label: translation?.experience_next,
                value: experienceNext,
                isReadOnly: true
            },
            {
                label: translation?.initiative,
                value: data.initiative,
                isReadOnly: true
            },
        ];
        const fieldName = ds.Layout.drawField(fields[0]);
        const fieldLevel = ds.Layout.drawField(fields[1]);
        const fieldClass = ds.Layout.drawField(fields[2]);
        const fieldLife = ds.Layout.drawField(fields[3]);
        const fieldLifeMaximum = ds.Layout.drawField(fields[4]);
        const fieldMana = ds.Layout.drawField(fields[5]);
        const fieldManaMaximum = ds.Layout.drawField(fields[6]);
        const fieldExperience = ds.Layout.drawField(fields[7]);
        const fieldExperienceNext = ds.Layout.drawField(fields[8]);
        const fieldInitiative = ds.Layout.drawField(fields[9]);
        const response = `
            <div class="ds-row">
                ${fieldName}
                ${fieldClass}
            </div>
            <div class="ds-row">
                ${fieldLife}
                ${fieldLifeMaximum}
            </div>
            <div class="ds-row">
                ${fieldMana}
                ${fieldManaMaximum}
            </div>
            <div class="ds-row">
                ${fieldLevel}
                ${fieldInitiative}
            </div>
            <div class="ds-row">
                ${fieldExperience}
                ${fieldExperienceNext}
            </div>
        `;

        return response;
    }

    drawAttributes(translation) {
        const data = Player.attributes;
        const subtitle = Layout.drawSubtitle(translation?.title);
        const fields = [
            {
                label: translation?.vitality,
                value: data.vitality,
                isReadOnly: true
            },
            {
                label: translation?.strength,
                value: data.strength,
                isReadOnly: true
            },
            {
                label: translation?.intelligence,
                value: data.intelligence,
                isReadOnly: true
            },
            {
                label: translation?.dexterity,
                value: data.dexterity,
                isReadOnly: true
            },
        ];
        const fieldVitality = ds.Layout.drawField(fields[0]);
        const fieldStrength = ds.Layout.drawField(fields[1]);
        const fieldIntelligence = ds.Layout.drawField(fields[2]);
        const fieldDexterity = ds.Layout.drawField(fields[3]);
        const response = `
            ${subtitle}
            <div class="ds-row">
                ${fieldVitality}
                ${fieldStrength}
            </div>
            <div class="ds-row">
                ${fieldIntelligence}
                ${fieldDexterity}
            </div>
        `;

        return response;
    }

    render() {
        const component = this.draw();

        ds.Components.render(this.args, component);
    }
}
export class HudPageAchievements extends HTMLElement {
    args = {
        context: this,
    };



    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.render();
    }



    draw() {
        const page = this.getAttribute('page');
        const list = this.drawList();
        const response = ds.Page.drawContent(page, list);

        return response;
    }

    drawList() {
        const translation = ds.Translation.interfaceDefault;
        const list = this.drawListItems();
        const cssTable = ds.Layout.theme.table;
        const response = `
            <table class="${cssTable}">
                <thead>
                    <tr>
                        ${ds.HTML.drawTH(translation?.title)}
                        ${ds.HTML.drawTH(translation?.description)}
                        ${ds.HTML.drawTH(translation?.reward)}
                        ${ds.HTML.drawTH(translation?.progress)}
                        ${ds.HTML.drawTH(translation?.status)}
                    </tr>
                </thead>
                <tbody>
                    ${list}
                </tbody>
            </table>
        `;

        return response;
    }

    drawListItems() {
        const translation = ds.Translation.gameAchievements;
        const achievements = Object.entries(this.dataLore);
        let response = '';

        achievements.forEach((achievement) => {
            const index = achievement[0];
            const value = achievement[1];

            const status = this.getDataPlayerByIndex(index);
            if (status) {
                const isDone = status.d === 1 || status.d === true || status.isDone === true;
                const icon = ds.HTML.drawDivCentered(ds.HTML.drawIconStatus(isDone));
                const prefix = `a_${index}`;
                const title = translation?.[`${prefix}_title`];
                const description = translation?.[`${prefix}_text`];
                const descriptionRule = this.drawListItemsReplaceRule(description, index);
                const reward = this.drawReward(index);
                const drawS = (text) => ds.HTML.drawS(isDone, text);

                const progressArgs = {
                    index,
                    data: value,
                    status
                };
                const progress = this.drawProgress(progressArgs);

                response += `
                    <tr>
                        ${ds.HTML.drawTD(drawS(title))}
                        ${ds.HTML.drawTD(drawS(descriptionRule))}
                        ${ds.HTML.drawTD(drawS(reward))}
                        ${ds.HTML.drawTD(progress, true)}
                        ${ds.HTML.drawTD(icon, true)}
                    </tr>
                `;
            }
        });

        return response;
    }

    drawListItemsReplaceRule(text, index) {
        const needs = this.getNeedsByIndex(index);

        if (!needs) return text;

        const response = Layout.replaceInText(text);

        return response;
    }

    drawProgress(props) {
        const { index, status } = props;
        const data = this.dataLore[index];
        const kind = data?.kind;
        const needs = data?.needs ?? [];

        const isTask = kind === 1;
        const ruleCost = Data.rules?.achievements?.[index]?.cost;
        const valueMax = isTask
            ? needs.length
            : (ruleCost ?? needs[0]?.quantity ?? 1);
        const isDone = status.d === 1 || status.d === true || status.isDone === true;
        const value = isDone
            ? valueMax
            : Math.min(Number(status.n) || 0, valueMax);
        const percentage = Math.round(ds.Helper.calculatePercentage(value, valueMax) * 100) / 100;
        const statusText = ds.Translation.interfaceDefault?.status;
        const tooltip = `${statusText}: <span>${percentage}</span>%`;
        const componentProgress = ds.Components.componentProgress;
        const response = `
            <${componentProgress}
                value="${value}"
                value-max="${valueMax}"
                theme="green"
                direction="horizontal"
                data-tooltip="${tooltip}"
                css-wrapper="gm-style"
            ></${componentProgress}>
        `;

        return response;
    }

    drawReward(index) {
        let response = '';
        const ruleRewards = Data.rules?.achievements?.[index]?.rewards;
        const rewards = ruleRewards ?? this.dataLore[index]?.rewards;

        if (!rewards) return response;

        rewards.forEach(reward => {
            const id = reward.id_item;
            const quantity = reward.quantity;

            response += Layout.drawTextItemQuantity(id, quantity);
        });

        return response;
    }

    get dataPlayer() {
        const response = Data.player.achievements;

        return response;
    }

    getDataPlayerByIndex(index) {
        const data = this.dataPlayer;
        const response = data[index];

        return response;
    }

    get dataLore() {
        const response = ds.Modules.achievements;

        return response;
    }

    getNeedsByIndex(index) {
        const data = ds.Modules.achievements;
        const response = data[index]?.needs;

        return response;
    }

    render() {
        const component = this.draw();

        ds.Components.render(this.args, component);

        Analytics.send({
            event_name: 'achievement_view',
        });
    }

    updateData() {
        this.render();
    }
}
export class HudPageAdvertising extends HTMLElement {
    args = {
        context: this,
    };
    kind = '';
    static idLink = 'link';



    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
        Promise.resolve().then(() => this.setPageTexts());
    }

    addEventListeners() {
        const componentButton = ds.Components.componentButton;
        const componentSelect = ds.Components.componentSelect;
        const elSelect = this.shadowRoot?.querySelector(componentSelect);

        if (elSelect) elSelect.addEventListener('change', (event) => this.handleSelectKind(event));

        ds.Layout.addEventListeners(this, componentButton);
        this.addFieldEventListeners();
    }

    addFieldEventListeners() {
        this.elLink?.addEventListener('input', () => this.updateButtonState());
    }

    draw() {
        const subtitle = Layout.drawSubtitle(this.translation.subtitle);
        const description = this.drawText(this.translation.description);
        const fieldKind = this.drawKind();
        const fieldLink = this.drawField(HudPageAdvertising.idLink);
        const button = this.drawButton();
        const backButton = this.drawBackButton();
        const content = `
            ${subtitle}
            ${description}
            <form class="ds-form">
                <div class="ds-row">
                    ${fieldKind}
                </div>
                <div class="ds-row">
                    ${fieldLink}
                </div>
            </form>
            <div class="ds-row ds-right ds-button-wrapper">
                ${backButton}
                ${button}
            </div>
        `;
        const response = HudPageAttributes.drawPage(content);

        return response;
    }

    drawButton() {
        const componentButton = ds.Components.componentButton;
        const theme = ds.Layout.theme.menuProceed;
        const response = `
            <${componentButton}
                label="${this.translation.submit}"
                size="small"
                theme="${theme}"
                data-handler="handleSubmit"
                data-handler-props='[]'
                data-kind="button"
                is-disabled="true"
            ></${componentButton}>
        `;

        return response;
    }

    drawBackButton() {
        const componentButton = ds.Components.componentButton;
        const theme = ds.Layout.theme;
        const themeButton = theme.menuDefault;
        const themeSize = theme.menuSize;
        const response = `
            <${componentButton}
                label="${this.translation.back}"
                size="${themeSize}"
                theme="${themeButton}"
                page-target="store"
                page-position="right"
                click="open-hud-page"
                data-kind="button"
            ></${componentButton}>
        `;

        return response;
    }

    drawField(id) {
        const args = {
            id,
            css: 'ds-column ds-form__field',
            label: this.translation[id],
            value: '',
            isReadOnly: false,
            type: 'text'
        };
        const response = ds.Layout.drawField(args);

        return response;
    }

    drawKind() {
        const componentSelect = ds.Components.componentSelect;
        const rewards = Data.rules?.reward?.advertising ?? {};
        const theme = ds.Layout.theme;
        const select = theme.selectDefault;
        const options = {
            label: [
                `${Layout.replaceInText(this.translation.kindYoutube)} - ${Translation.buildRewardText(rewards.youtube ?? 0)}`,
                `${Layout.replaceInText(this.translation.kindSite)} - ${Translation.buildRewardText(rewards.site ?? 0)}`,
                `${Layout.replaceInText(this.translation.kindSocial)} - ${Translation.buildRewardText(rewards.social ?? 0)}`,
            ],
            value: [1, 2, 3],
        };
        const response = `
            <${componentSelect}
                label="${this.translation.type}"
                options='${JSON.stringify(options)}'
                theme="${select}"
            ></${componentSelect}>
        `;

        return response;
    }

    drawText(text) {
        const paragrath = Layout.replaceInText(text);
        const response = `
            <div class="ds-row ds-page__text ds-modal-text">
                <p>${paragrath}</p>
            </div>
        `;

        return response;
    }

    get elButton() {
        const response = this.shadowRoot.querySelector('[data-handler="handleSubmit"]');

        return response;
    }

    get elLink() {
        const response = this.getElById(HudPageAdvertising.idLink);

        return response;
    }

    getElById(id) {
        const response = this.shadowRoot.getElementById(id);

        return response;
    }

    get isEnabled() {
        if (this.isLimitReached) return false;

        const link = this.getInputValueByTarget(this.elLink);
        const response = !!this.kind && !!link;

        return response;
    }

    get page() {
        const response = this.getRootNode()?.host;

        return response;
    }

    get count() {
        const response = Number(Data.rules?.reward?.advertising?.count ?? 0);

        return response;
    }

    get day() {
        const response = Data.rules?.reward?.advertising?.day ?? '';

        return response;
    }

    get isLimitReached() {
        const limit = this.limit;
        const count = this.count;
        const day = this.day;
        const now = ds.Helper.getNow();
        const isWithinWindow = !!day && (now - day) < 86400;
        const response = isWithinWindow && count >= limit;

        return response;
    }

    get limit() {
        const response = Number(Data.rules?.reward?.advertising?.quantity ?? 0);

        return response;
    }

    getInputValueByTarget(target) {
        const response = ds.FormField.getInputValueByTarget(target);

        return response;
    }

    handleSelectKind(event) {
        this.kind = event?.detail?.value || '';

        this.updateButtonState();
    }

    async handleSubmit() {
        if (!this.isEnabled) return;

        const link = this.getInputValueByTarget(this.elLink);

        const response = await FetchData.submitAdvertising({
            kind: this.kind,
            link,
        });

        if (response?.isError) {
            ds.Notification.add({
                content: this.translation.limit,
            });

            return;
        }

        ds.Notification.add({
            content: this.translation.submitted,
        });

        this.kind = '';

        this.render();
    }

    render() {
        const component = this.draw();

        ds.Components.render(this.args, component);

        this.addEventListeners();
        this.updateButtonState();
    }

    setPageTexts() {
        const page = this.page;

        if (page?.setTitle) page.setTitle(this.translation.title);
        if (page?.setText) page.setText('');
    }

    toggleButtonDisabled(isEnabled) {
        const button = this.elButton;

        if (!button) return;

        if (isEnabled) {
            button.removeAttribute(ds.Prefix.ATTR_IS_DISABLED);
        } else {
            button.setAttribute(ds.Prefix.ATTR_IS_DISABLED, 'true');
        }
    }

    updateButtonState() {
        this.toggleButtonDisabled(this.isEnabled);
    }

    get translation() {
        const translationDefault = ds.Translation.interfaceDefault;
        const page = ds.Translation.getTranslationPage('advertising');
        const fallback = {
            title: page.title,
            description: page.description,
            subtitle: page.title_advertising,
            type: page.type,
            kindYoutube: page.youtube,
            kindSite: page.website_article,
            kindSocial: page.social_post,
            link: translationDefault.link,
            submit: translationDefault.send,
            back: translationDefault.back,
            submitted: page.sent,
            limit: page.limit,
        };
        const response = { ...fallback, ...page };

        return response;
    }
}

export class HudPageApplyCustomization extends PageCustomizations {
    args = {
        context: this,
    };



    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        PageCustomizations.resetMap();

        this.render();
        this.addEventListeners();
        this.toggleActionButton();
    }



    addEventListeners() {
        const componentButton = ds.Components.componentButton;

        ds.Layout.addEventListeners(this, componentButton);
        this.addEventListenersCustomization();
    }

    draw() {
        const buttonDefault = Layout.changeThemeButton('apply');
        const button = Layout.drawButtonComponent(buttonDefault);
        const response = PageCustomizations.drawNPC(button, this.id);

        return response;
    }

    get action() {
        const response = ds.Prefix.APPLY_CUSTOMIZATION;

        return response;
    }

    get cost() {
        const response = PageCustomizations.cost.apply;

        return response;
    }

    get elActionButton() {
        const response = ds.Helper.getElementByDataId(this.shadowRoot, this.id);

        return response;
    }

    get id() {
        const response = Statics.buttons.apply.id;

        return response;
    }

    get inventoryDiamonds() {
        const response = Player.inventoryDiamonds;

        return response;
    }

    async handleApply() {
        const dataFetch = await this.handleAction(FetchData.applyCustomization.bind(FetchData));

        if (!dataFetch) return;

        Analytics.send({
            event_name: 'customization_apply',
            npc: HudPageNPC.id,
            items: PageCustomizations.selectsValue.map(s => `${s.id}:${s.value}`).join(','),
        });

        this.resetCustomizations();
    }

    render() {
        HudPageDetail.npcAction = this.action;

        const component = this.draw();

        ds.Components.render(this.args, component);
        ds.Layout.addEventListeners(this, 'button');
    }
}
export class HudPageAttributes extends HTMLElement {
    args = {
        context: this,
    };



    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.render();
    }



    draw() {
        const page = this.getAttribute('page');
        const content = '';
        const response = ds.Page.drawContent(page, content);

        return response;
    }


    static drawPage(content) {
        const page = HudPageAttributes.page;
        const html = `
            <form class="ds-form ds-form--readonly">
                ${content}
            </form>
        `;
        const response = ds.Page.drawContent(page, html);

        return response;
    }

    drawMenu() {
        const buttons = [
            Statics.buttons.filterAbout,
            Statics.buttons.filterCombat,
            Statics.buttons.filterStatistics,
            Statics.buttons.filterUser,
        ];
        const page = HudPageAttributes.page;

        page.setMenu({ buttons });

        this.buttons = buttons;

        const elButtons = page.elMenuButtons;

        elButtons[0].click();
    }

    static formatExperience(experience) {
        const response = experience.toLocaleString('pt-BR');

        return response;
    }

    static get page() {
        const response = HTML.elHudPageRight;

        return response;
    }

    render() {
        const component = this.draw();

        ds.Components.render(this.args, component);

        this.drawMenu();
    }
}
export class HudPageBattle extends HTMLElement {
    args = {
        context: this,
    };
    cssHideMenu = 'gm-battle__hide';
    id = 'gm_battle';
    idSubMenu = `${this.id}_submenu`;
    idSkill = `${this.id}_skill`;
    idSkillEffect = `${this.id}_skill_effect`;
    idSkillValue = `${this.id}_skill_value`;
    idPlayer = `${this.id}_player`;
    idMonster = `${this.id}_monster`;
    idUseItem = 'actionUseItem';
    skillData;
    elProgress = {};
    prefixSkillMove = 'lo-animation-skill-move--';
    prefixSkillEffect = 'gm-battle__skill-effect--';
    casters = ['player', 'opponent'];
    caster;
    #isMenuEnabled;



    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.render();
    }



    addEventListeners() {
        const data = [];
        const elSubMenu = this.shadowRoot.getElementById(this.idSubMenu);
        const elSubMenuButtons = elSubMenu.querySelectorAll('button');

        elSubMenuButtons.forEach((el) => {
            const args = {
                el,
                handler: HudPageBattle.handleUse
            };
            data.push(args);
        });

        data.forEach((index) => {
            index.context = this;
            ds.Helper.addEventListener(index);
        });

        const componentButton = ds.Components.componentButton;

        ds.Layout.addEventListeners(this, componentButton);
    }

    animateSkill(props) {
        const skillsToRemove = this.getSkillToRemove();

        ds.Helper.removeClass(this.elBattleSkillEffect, skillsToRemove);

        return new Promise((resolve) => {
            const isSuccess = props.isSuccess ?? false;
            const css = this.cssLastSkill;
            const cssFail = this.cssLastSkillFail;
            const cssSkillEffect = this.getSkillEffectCss(this.caster);

            ds.Helper.addClass(this.elBattleSkillEffect, cssSkillEffect);

            setTimeout(() => {
                ds.Helper.addClass(this.elBattleSkillValue, css);
                if (!isSuccess) ds.Helper.addClass(this.elBattleSkillValue, cssFail);
            }, 150);

            setTimeout(() => {
                ds.Helper.removeClass(this.elBattleSkill, css);
                ds.Helper.removeClass(this.elBattleSkillValue, css);
                ds.Helper.removeClass(this.elBattleSkillEffect, cssSkillEffect);
                if (!isSuccess) ds.Helper.removeClass(this.elBattleSkillValue, cssFail);

                resolve();
            }, HTML.elTransition?.timeout);
        });
    }

    buildEmojiFail() {
        const isPlayer = this.isPlayer(this.caster);
        const entity = isPlayer ? this.elBattlePlayer : this.elBattleMonster;

        Emoji.activateChance(entity, ds.Prefix.SCARED, 50);
    }

    buildWinnerScreen(data) {
        const winner = data.winner;
        const isPlayer = this.isPlayer(winner);
        const kind = isPlayer ? ds.Prefix.WIN : ds.Prefix.LOSE;
        const monster = HTML.elGameBattle.monster;
        const monsterId = Monsters.unBuildId(monster?.getAttribute('id'));
        const monsterLevel = monster?.getAttribute('data-level');
        const playerLevel = Data.player?.attributes?.level;
        const lootItems = data.loot ? Object.entries(data.loot).map(([id, qty]) => `${id}:${qty}`).join(',') : '';

        Analytics.send({
            event_name: 'battle_end',
            result: kind,
            monster_id: monsterId,
            monster_level: monsterLevel,
            player_level: playerLevel,
            loot: lootItems,
        });

        HTML.elTransition.loot = data.loot;
        HTML.elTransition.openByKind(kind);

        HTML.elGameBattle.unbuild();
    }

    async buildTurn() {
        await this.updateProgresses();

        const isTurnPlayer = this.isTurnPlayer;

        if (isTurnPlayer) {
            this.isMenuEnabled = true;
        } else {
            this.isMenuEnabled = false;

            await this.getSkillOpponent();
        }
    }

    buildTurnData(data) {
        HTML.elGameBattle.turnLast = this.turnCurrent;
        this.skillData = data;
        HTML.elGameBattle.turnCurrent = data.turn;
    }

    draw() {
        const menu = this.drawMenu();
        const submenu = this.drawSubMenu();
        const player = this.drawPlayer();
        const monster = this.drawMonster();
        const skill = this.drawSkill();
        const skillEffect = this.drawSkillEffect();
        const skillValue = this.drawSkillValue();
        const background = this.drawBackground();
        const progreesMonster = this.drawProgress('monster');
        const footer = `
            <div class="ds-row ds-center gm-battle__footer">
                <div class="ds-row ds-center gm-battle__submenu ${this.cssHideMenu}" id="${this.idSubMenu}">
                    <div class="ds-row ds-center gm-battle__padding ds-scrollbar">
                        ${submenu}
                    </div>
                </div>
                <div class="ds-row ds-center ds-content__menu">
                    ${menu}
                </div>
            </div>
        `;
        const response = `
            <div class="ds-modal__content">
                <div class="ds-row ds-center gm-battle__background">
                    <div class="gm-battle__background gm-battle__theme">
                        ${background}
                    </div>
                    ${progreesMonster}
                    ${monster}
                    ${skill}
                    ${skillEffect}
                    ${skillValue}
                    ${player}
                </div>
            </div>
            ${footer}
        `;

        return response;
    }

    drawBackground() {
        let response = '';

        Statics.backgroundBattle.forEach((index) => {
            const tile = ds.Helper.findById(ds.Modules.tiles, index);
            const css = tile.css;

            response += `
                <div class="ds-tile lo-${css}"></div>
            `;
        });

        return response;
    }

    drawEntityDistance(value) {
        const response = `${ds.Layout.tileSize * value}px`;

        return response;
    }

    drawMenu() {
        let response = '';
        const buttons = this.drawMenuData();

        buttons.forEach((index) => {
            const id = index.id;
            const isUseItem = id === this.idUseItem;
            const action = isUseItem ? 'setSubMenu' : 'handleSkill';
            const argsHandler = { action: id };
            const handlerProps = `[${ds.Helper.buildJSONToHTML(argsHandler)}]`;

            const componentButton = ds.Components.componentButton;
            response += `
                <${componentButton}
                    id="${id}"
                    icon="${index.icon}"
                    icon-size="big"
                    theme="${index.theme}"
                    size="extra-big"
                    data-tooltip=""
                    data-kind="button"
                    data-handler="${action}"
                    data-handler-props='${handlerProps}'
                    is-proportional="true"
                ></${componentButton}>
            `;
        });

        return response;
    }

    drawMenuData() {
        const response = [];

        this.skills.forEach((index) => {
            const id = index.id;
            const data = ds.Layout.getIconDataById(id);
            const args = {
                id,
                icon: data.icon,
                tooltip: data.tooltip,
                theme: data.theme,
            };

            response.push(args);
        });

        return response;
    }

    drawMonster() {
        const monster = this.monster;
        const kind = monster.getAttribute('data-kind');
        const level = monster.getAttribute('data-level');
        const response = `
            <${lo.Components.entity}
                id="${this.idMonster}"
                class="gm-alive gm-monster"
                data-level="${level}"
                data-id="monster"
                data-kind="${kind}"
                kind="monster"
                entity="monster"
                direction="down"
                action="stand"
                style="top: ${this.drawEntityDistance(2)}"
                tabindex="-1"
            ></${lo.Components.entity}>
        `;

        return response;
    }

    drawPlayer() {
        const data = Player.equipmentsForHTML;
        const equipments = ds.Helper.buildJSONToHTML(data);
        const response = `
            <${lo.Components.entity}
                id="${this.idPlayer}"
                class="gm-alive gm-person"
                data-id="player"
                entity="person"
                direction="up"
                action="stand"
                style="bottom: ${this.drawEntityDistance(1)}"
                equipments=${equipments}
                tabindex="-1"
            ></${lo.Components.entity}>
        `;

        return response;
    }

    drawProgress(target) {
        let response = '<div class="gm-battle__progress">';
        const bars = [
            {
                id: 'life',
                theme: 'red',
            },
            {
                id: 'mana',
                theme: 'blue',
            },
        ];

        bars.forEach((index) => {
            const id = index.id;
            const theme = index.theme;
            const componentProgress = ds.Components.componentProgress;

            response += `
                 <${componentProgress}
                    id="progress_${id}_${target}"
                    value="0"
                    value-max="0"
                    theme="${theme}"
                    direction="horizontal"
                    border="battle"
                    css-wrapper="gm-style-battle"
                ></${componentProgress}>
            `;
        });

        response += '</div>';

        return response;
    }

    drawSkill() {
        const response = `
            <div
                id="${this.idSkill}"
                class="gm-battle__skill"
                style="top: ${this.drawEntityDistance(3.0)}"
            >
                <h4 class="title"></h4>
            </div>
        `;

        return response;
    }

    drawSkillEffect() {
        const response = `
            <div
                id="${this.idSkillEffect}"
                class="gm-battle__skill-effect"
            >
            </div>
        `;

        return response;
    }

    drawSkillValue() {
        const response = `
            <div
                id="${this.idSkillValue}"
                class="gm-battle__skill-value"
                style="top: ${this.drawEntityDistance(2.5)}"
            >
                <h2 class="title"></h2>
            </div>
        `;

        return response;
    }

    drawSubMenu() {
        const buttons = this.drawSubMenuData();
        const theme = ds.Layout.theme.menuDefault;
        let response = '';

        buttons.forEach((index) => {
            const cssArgs = {
                theme: theme,
                isProportional: true,
                size: 'big',
                cssPrefix: 'button',
                cssCustom: 'ds-padding-reset'
            };
            const css = ds.Layout.buildCss(cssArgs);

            response += `
                <button
                  type="button"
                  data-id="${index.id}"
                  data-id-lore="${index.idLore}"
                  ${css}
                >
                    <span class="gm-loot--small">
                        ${index.icon}
                    </span>
                </button>
            `;
        });

        return response;
    }

    drawSubMenuData() {
        const response = [];

        const excludedIdLore = [
            161
        ];

        Player.inventoryConsumables.forEach((index) => {
            const idLore = index.idLore ?? index.target;

            if (excludedIdLore.includes(idLore)) return;

            const argsIcon = {
                item: index.itemLoot.id,
                isDurability: index.isDurability
            };
            const icon = lo.HTML.drawLoot(argsIcon);
            const consumableArgs = {
                id: index.id,
                idLore,
                icon
            };

            response.push(consumableArgs);
        });

        return response;
    }

    async fetchSkill(props) {
        const { action } = props;
        const data = await FetchData.getSkill(props);

        if (data?.isError) {
            this.isMenuEnabled = true;

            return;
        }

        this.buildTurnData(data);

        const capitalizeTarget = ds.Helper.capitalizeString(action);
        const methodName = `use${capitalizeTarget}`;
        const args = {
            caster: ds.Prefix.PLAYER,
            data
        };

        this[methodName]?.(args);
    }

    get buttons() {
        const componentButton = ds.Components.componentButton;
        const response = this.shadowRoot.querySelectorAll(componentButton);

        return response;
    }

    get currentTurn() {
        const response = HTML.elGameBattle.turnCurrent;

        return response;
    }

    get isMenuEnabled() {
        const response = this.#isMenuEnabled;

        return response;
    }

    get isTurnPlayer() {
        const response = HTML.elGameBattle.isTurnPlayer;

        return response;
    }

    get isConsumablesInInventory() {
        const loot = this.loot;
        let response = false;

        loot.forEach((index) => {
            const item = Storage.buildItem(index).item;
            const properties = {
                target: item
            };
            const propertiesItem = Storage.getProperties(properties);
            const getTranslationById = Storage.getTranslationById(propertiesItem.itemLoot.kind);
            const isConsumable = getTranslationById === 'usable';

            if (isConsumable) response = true;
        });

        return response;
    }

    get monster() {
        const response = HTML.elGameBattle.monster;

        return response;
    }

    get skills() {
        const data = Data.player.skills;
        const response = Object.values(data);

        return response;
    }

    get subMenu() {
        const response = this.shadowRoot.querySelector('.gm-battle__submenu');

        return response;
    }

    getSkillEffectCss(caster) {
        const id = this.skillData.skill.id;
        const effects = Statics.skills;
        let skillCss = effects.filter((index) => {
            return index.id === id;
        });
        const isSkill = skillCss.length > 0;
        let response = [];

        if (isSkill) {
            const skill = skillCss[0];

            if (skill) response.push(skill.css);

            if (skill.isMoving) {
                response.push(
                    `${this.prefixSkillMove + caster}`,
                );
            }
        }

        response.push(`${this.prefixSkillEffect + caster}`);

        return response;
    }

    getSkillToRemove() {
        const effects = Statics.skills;
        let response = [];

        this.casters.forEach((index) => {
            response.push(`${this.prefixSkillMove + index}`);
            response.push(`${this.prefixSkillEffect + index}`);
        });

        effects.forEach((index) => {
            response.push(index.css);
        });

        return response;
    }

    getCurrentButton(target) {
        const response = this.shadowRoot.getElementById(target);

        return response;
    }

    async getSkillOpponent() {
        const data = await FetchData.getSkillOpponent();

        if (data?.isError) return;

        this.buildTurnData(data);

        const args = {
            caster: ds.Prefix.OPPONENT,
            data
        };

        this.useSkill(args);
    }

    async handleSkill(props) {
        const { action, id, idLore } = props;
        const isDisabled = this.isButtonDisabled(action);

        if (isDisabled) return;

        this.isMenuEnabled = false;

        this.setSubMenu('hide');

        const args = { action };

        if (idLore) args.il = idLore;
        if (id) args.id = id;

        await this.fetchSkill(args);
    }

    static handleUse(event) {
        const target = event.currentTarget;
        const id = Number(target.dataset.id);
        const idLore = Number(target.dataset.idLore);
        const action = this.idUseItem;
        const args = {
            action,
            id,
            idLore
        };

        this.handleSkill(args);
    }

    isButtonDisabled(target) {
        const el = this.getCurrentButton(target);
        const response = el.getAttribute(ds.Prefix.ATTR_IS_DISABLED) === 'true';

        return response;
    }

    isCasterPlayer(caster) {
        const response = caster === ds.Prefix.PLAYER;

        return response;
    }

    isPlayer(target) {
        const response = target === ds.Prefix.PLAYER;

        return response;
    }

    isSkillRun(data) {
        const response = data.skill?.id === ds.Prefix.ACTION_RUN;

        return response;
    }

    isConsumableRuleInvalid(button) {
        const isUseItem = button.id === this.idUseItem;
        const response = isUseItem && Player.inventoryConsumables <= 0;

        return response;
    }

    isItemRule(key) {
        const response = key === ds.Prefix.ITEMS;

        return response;
    }

    async move(props) {
        const { target, direction } = props;
        const isUp = direction === 'up';
        const directionOpposite = isUp ? 'down' : 'up';
        const args = {
            target,
            vertical: isUp ? -ds.Layout.tileSize : ds.Layout.tileSize,
            horizontal: 0,
            speed: 300
        };

        target.setAttribute('action', 'walk');
        target.setAttribute('direction', direction);

        await Animation.animatePosition(args);

        args.vertical = 0;
        target.setAttribute('direction', directionOpposite);

        AudioEffects.play(target);

        await Animation.animatePosition(args);

        target.setAttribute('action', 'stand');
        target.setAttribute('direction', direction);
    }

    async moveCaster(target) {
        const isPlayer = this.isPlayer(target);
        const args = {
            target: isPlayer ? this.elBattlePlayer : this.elBattleMonster,
            direction: isPlayer ? 'up' : 'down',
        };

        await this.move(args);
    }

    render() {
        const component = this.draw();

        ds.Components.render(this.args, component);

        this.addEventListeners();

        this.isMenuEnabled = false;

        this.updateHTML();

        this.buildTurn();

        this.updateMenuTooltips();
    }

    setAttributes(props) {
        const { data } = props;

        Data.setData(data);
    }

    async setMenuToggle() {
        const buttons = this.buttons;
        const menuDisabled = !await this.isMenuEnabled;
        const length = buttons.length;

        for (let i = 0; i < length; i++) {
            const button = buttons[i];
            let isDisabled = menuDisabled;

            if (!isDisabled) isDisabled = await this.setMenuToggleRules(button, false);

            button.setAttribute(ds.Prefix.ATTR_IS_DISABLED, isDisabled);
        }
    }

    async setMenuToggleRules(button, isDisabled) {
        const ruleList = await Data.rules.skills;
        const rules = ruleList[button.id]?.cost ?? [];
        let response = isDisabled;

        Object.entries(rules).forEach(([key, value]) => {
            if (this.isItemRule(key)) {
                if (!this.validateItems(value)) response = true;
                return;
            }

            if (!this.validateAttribute(key, value)) response = true;
        });

        if (this.isConsumableRuleInvalid(button)) response = true;

        return response;
    }

    async setSkillValue(props, usage) {
        const response = new Promise((resolve) => {
            const { caster, data } = props;
            const isCasterPlayer = this.isCasterPlayer(caster);
            const css = isCasterPlayer ? 'lo-animation-damage--right' : 'lo-animation-damage--left';
            const cssFail = 'gm-battle__skill-value--fail';
            const isSuccess = usage.isSuccess === true;
            const translationSkill = ds.Translation.gameSkill;
            const translationTitle = translationSkill[`${data.skill.translation}_title`];

            this.elBattleSkillText.innerHTML = translationTitle;

            const isSkillRun = this.isSkillRun(data);
            let damage = usage.damage ?? 0;
            const isInvalid = !isSuccess || usage.damage === 0;

            if (isInvalid) {
                damage = translationSkill.fail;
                this.buildEmojiFail();
            } else if (isSkillRun) {
                damage = translationSkill.success;
            }

            this.elBattleSkillValueText.innerHTML = damage;

            ds.Helper.addClass(this.elBattleSkill, css);

            this.cssLastSkill = css;
            this.cssLastSkillFail = cssFail;

            resolve();
        });

        return response;
    }

    set isMenuEnabled(value) {
        if (this.#isMenuEnabled === value) return;

        this.#isMenuEnabled = value;
        this.setMenuToggle(value);
    }

    setSubMenu(action) {
        const target = this.subMenu;
        const css = this.cssHideMenu;
        const actionShow = 'show';
        const actionHide = 'hide';
        const isDisabled = this.isButtonDisabled(this.idUseItem);

        if (isDisabled) return;

        const isTurnPlayer = HTML.elGameBattle.isTurnPlayer;

        if (!isTurnPlayer) return;

        const isOpen = !target.classList.contains(css);

        if (isOpen && action !== actionShow) action = actionHide;

        switch (action) {
            case actionHide:
                return ds.Helper.addClass(target, css);
            case 'toggle':
                return ds.Helper.toggleClass(target, css);
            default:
            case actionShow:
                return ds.Helper.removeClass(target, css);
        }
    }

    updateData() {
        this.updateProgresses();
        this.updateMenuTooltips();
    }

    updateHTML() {
        this.elBattlePlayer = this.shadowRoot.getElementById(`${this.idPlayer}`);
        this.elBattleMonster = this.shadowRoot.getElementById(`${this.idMonster}`);
        this.elBattleSkill = this.shadowRoot.getElementById(`${this.idSkill}`);
        this.elBattleSkillEffect = this.shadowRoot.getElementById(`${this.idSkillEffect}`);
        this.elBattleSkillText = this.elBattleSkill.querySelector('.title');
        this.elBattleSkillValue = this.shadowRoot.getElementById(`${this.idSkillValue}`);
        this.elBattleSkillValueText = this.elBattleSkillValue.querySelector('.title');

        this.elProgress.life = this.shadowRoot.getElementById('progress_life_monster');
        this.elProgress.mana = this.shadowRoot.getElementById('progress_mana_monster');
    }

    updateMenuTooltips() {
        const ruleList = Data.rules.skills;
        const ruleTranslation = ds.Translation.gameSkill;
        const buttons = this.buttons;

        buttons.forEach((button) => {
            const id = button.id;
            const data = ds.Layout.getIconDataById(id);

            if (!data) return;

            const args = {
                text: data.tooltip,
                isRule: true,
                ruleList,
                ruleTranslation
            };
            const tooltip = ds.Helper.replaceInText(args);

            button.setAttribute('data-tooltip', tooltip);
        });
    }

    updateProgress(props) {
        const { target, value, valueMax } = props;
        const translation = ds.Translation.getTranslationPage('attributes');
        const text = translation.life;
        const tooltipArgs = {
            text,
            value,
            valueMax
        };
        const tooltip = ds.Layout.buildTextCapacity(tooltipArgs);
        const elProgress = this.elProgress[target];

        elProgress.setAttribute('value', value);
        elProgress.setAttribute('value-max', valueMax);
        elProgress.setAttribute('data-tooltip', tooltip);
    }

    async updateProgresses() {
        const data = await Data.opponent.attributes;

        if (!data) return;

        const progresses = [
            {
                target: 'life',
                value: data.hitPoints,
                valueMax: data.hitPointsMaximum,
            },
            {
                target: 'mana',
                value: data.manaPoints,
                valueMax: data.manaPointsMaximum,
            },
        ];

        progresses.forEach((index) => {
            this.updateProgress(index);
        });
    }

    useActionRun(props) {
        const { data } = props;
        const skill = data.skillUsage[0];
        const isSuccess = skill.isSuccess ?? false;

        if (isSuccess) this.unbuildBattle();

        this.useSkill(props);
    }

    useActionUseItem(props) {
        this.useSkill(props);
    }

    useAttackCoinThrow(props) {
        this.useSkill(props);
    }

    useAttackFireball(props) {
        this.useSkill(props);
    }

    useAttackMelee(props) {
        this.useSkill(props);
    }

    useAttackMeleeDouble(props) {
        this.useSkill(props);
    }

    useAttackThrowWeapon(props) {
        this.useSkill(props);
    }

    useAttackMultipleArrows(props) {
        this.useSkill(props);
    }

    async useSkill(props) {
        const { caster, data } = props;
        const movePromise = this.moveCaster(caster);
        const isSkillRun = this.isSkillRun(data);
        const isPlayer = this.isPlayer(caster);
        let isSuccess = false;
        let isPassTurn = true;

        this.caster = caster;

        const isWinner = !data?.isError && data.winner !== null;

        if (isWinner) {
            isPassTurn = false;

            setTimeout(() => {
                this.buildWinnerScreen(data);
            }, HTML.elTransition?.timeout);
        }

        const usages = data.skillUsage;
        const length = usages?.length;

        for (let i = 0; i < length; i++) {
            const usage = usages[i];

            await this.setSkillValue(props, usage);
            await this.animateSkill(usage);

            isSuccess = usage.isSuccess;

            if (isSkillRun && isSuccess) isPassTurn = false;
        }

        await movePromise;

        this.setAttributes(props);

        const isOpponentRun = !isPlayer && isSkillRun && isSuccess;
        if (isOpponentRun) return this.unbuildBattle();

        if (isPassTurn) await this.buildTurn();
    }

    unbuildBattle() {
        setTimeout(() => {
            HTML.elGameBattle.unbuild();
        }, HTML.elTransition?.timeout);
    }

    validateAttribute(attribute, requiredValue) {
        const currentValue = Data.player[ds.Prefix.ATTRIBUTES][attribute] ?? 0;
        const response = currentValue >= requiredValue;

        return response;
    }

    validateItems(requiredItems) {
        if (!Array.isArray(requiredItems)) return false;

        const inventory = Player.inventory;
        const response = requiredItems.every((ruleItem) => {
            const currentQuantity = Character.getItemQuantityByIdLore(inventory, ruleItem.id);
            const isValid = currentQuantity >= ruleItem.quantity;

            return isValid;
        });

        return response;
    }
}
export class HudPageBuy extends HTMLElement {
    args = {
        context: this,
    };



    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.render();
    }



    draw() {
        const items = HudPageNPC.sells;
        const list = HudPageNPC.drawItemsList(items);
        const response = HudPageNPC.drawWrapper(list);

        return response;
    }

    get action() {
        const response = ds.Prefix.BUY;

        return response;
    }

    handleOpenDetails(id) {
        const args = {
            id,
            context: this,
            npcAction: this.action,
        };

        HudPageDetail.itemId = undefined;

        HudPageNPC.handleOpenDetails(args);
    }

    render() {
        HudPageDetail.npcAction = this.action;

        const component = this.draw();

        ds.Components.render(this.args, component);

        ds.Layout.addEventListeners(this, 'button');
    }
}
export class HudPageBuyCustomization extends PageCustomizations {
    args = {
        context: this,
    };



    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        PageCustomizations.resetMap();

        this.render();
        this.addEventListeners();
        this.toggleActionButton();
    }



    addEventListeners() {
        const componentButton = ds.Components.componentButton;

        ds.Layout.addEventListeners(this, componentButton);

        this.addEventListenersCustomization();
    }

    draw() {
        const buttonDefault = Layout.changeThemeButton('buy');
        const button = Layout.drawButtonComponent(buttonDefault);
        const response = PageCustomizations.drawNPC(button, this.id);

        return response;
    }

    get action() {
        const response = ds.Prefix.BUY_CUSTOMIZATION;

        return response;
    }

    get cost() {
        const response = PageCustomizations.cost.buy;

        return response;
    }

    get id() {
        const response = Statics.buttons.buy.id;

        return response;
    }

    get elActionButton() {
        const response = ds.Helper.getElementByDataId(this.shadowRoot, this.id);

        return response;
    }

    get inventoryDiamonds() {
        const response = Player.inventoryDiamonds;

        return response;
    }

    async handleBuy() {
        const dataFetch = await this.handleAction(FetchData.buyCustomization.bind(FetchData));

        if (!dataFetch) return;

        Analytics.send({
            event_name: 'customization_buy',
            npc: HudPageNPC.id,
            items: PageCustomizations.selectsValue.map(s => `${s.id}:${s.value}`).join(','),
        });

        this.resetCustomizations();
    }

    render() {
        HudPageDetail.npcAction = this.action;

        const component = this.draw();

        ds.Components.render(this.args, component);
        ds.Layout.addEventListeners(this, 'button');
    }
}
export class HudPageCombat extends HTMLElement {
    args = {
        context: this,
    };
    static ids = {
        buffs: 'buffs',
    };
    static timer;





    constructor() {
        super();

        this.attachShadow({ mode: 'open' });

        this.render();
        this.startTimer();
    }

    disconnectedCallback() {
        HudPageCombat.stopTimer();
    }





    draw() {
        const translation = ds.Translation.getTranslationPage('attributes');
        const drawAttacks = this.drawAttacks(translation);
        const drawDefenses = this.drawDefenses(translation);
        const drawBuffs = this.drawBuffs();
        const content = `
            ${drawAttacks}
            ${drawDefenses}
            ${drawBuffs}
        `;
        const response = HudPageAttributes.drawPage(content);

        return response;
    }

    drawAttacks(translation) {
        const data = Player.attacks;
        const subtitle = Layout.drawSubtitle(translation?.attacks);
        const args = {
            translation,
            data,
            subtitle
        };
        const response = this.drawContent(args);

        return response;
    }

    drawBuff(buff, remaining) {
        const css = ds.Layout.cssFormField;
        const translation = ds.Translation.gameBuffs;
        const label = translation?.[buff];
        const time = Layout.buildEffectTime(remaining);
        const componentFormField = ds.Components.componentFormField;
        const response = `
            <div class="ds-row">
                <${componentFormField}
                    class="${css}"
                    label="${label}"
                    input-value="${time}"
                ></${componentFormField}>
            </div>
        `;

        return response;
    }

    drawBuffs() {
        const translation = ds.Translation.interfaceDefault.buffs;
        const subtitle = Layout.drawSubtitle(translation);
        const content = this.drawBuffsContent();
        const response = `
            ${subtitle}
            <div
                class="ds-row"
                data-id="${HudPageCombat.ids.buffs}"
            >
                ${content}
            </div>
        `;

        return response;
    }

    drawBuffsContent() {
        const buffs = Player.buffs ?? {};
        const now = Math.floor(Date.now() / 1000);
        let response = '';

        for (const [buff, data] of Object.entries(buffs)) {
            const remaining = (data?.end ?? 0) - now;

            if (remaining > 0) {
                response += this.drawBuff(buff, remaining);
            }
        }

        if (!response) {
            const text = ds.Translation.gameGeneric?.no_data_yet;

            response = `
                 <div class="ds-row">
                    <p class="ds-center">${text}</p>
                </div>
            `;
        }

        return response;
    }

    drawContent(props) {
        const { translation, data, subtitle } = props;
        const fields = [
            {
                label: translation?.melee,
                value: data.melee,
                isReadOnly: true
            },
            {
                label: translation?.fire,
                value: data.fire,
                isReadOnly: true
            },
            {
                label: translation?.cold,
                value: data.cold,
                isReadOnly: true
            },
            {
                label: translation?.lightning,
                value: data.lightning,
                isReadOnly: true
            },
            {
                label: translation?.poison,
                value: data.poison,
                isReadOnly: true
            },
        ];
        const fieldMelee = ds.Layout.drawField(fields[0]);
        const fieldFire = ds.Layout.drawField(fields[1]);
        const fieldCold = ds.Layout.drawField(fields[2]);
        const fieldLightning = ds.Layout.drawField(fields[3]);
        const fieldPoison = ds.Layout.drawField(fields[4]);
        const response = `
            ${subtitle}
            <div class="ds-row">
                ${fieldMelee}
                ${fieldFire}
                ${fieldCold}
            </div>
            <div class="ds-row">
                ${fieldLightning}
                ${fieldPoison}
            </div>
        `;

        return response;
    }

    drawDefenses(translation) {
        const data = Player.defenses;
        const subtitle = Layout.drawSubtitle(translation?.defenses);
        const args = {
            translation,
            data,
            subtitle
        };
        const response = this.drawContent(args);

        return response;
    }

    render() {
        const component = this.draw();

        ds.Components.render(this.args, component);
    }

    startTimer() {
        HudPageCombat.stopTimer();

        HudPageCombat.timer = setInterval(() => {
            this.updateBuffs();
        }, 1000);
    }

    static stopTimer() {
        if (HudPageCombat.timer) {
            clearInterval(HudPageCombat.timer);
        }

        HudPageCombat.timer = null;
    }

    updateBuffs() {
        const id = HudPageCombat.ids.buffs;
        const el = this.shadowRoot.querySelector(`[data-id="${id}"]`);

        if (!el) return;

        el.innerHTML = this.drawBuffsContent();
    }
}

export class HudPageCraft extends HTMLElement {

    args = {
        context: this,
    };



    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.render();
    }



    async draw() {
        const content = await this.drawContent();
        const response = HudPageNPC.drawWrapper(content);

        return response;
    }

    async drawContent() {
        let response = '';
        const isContentDefault =
            !HudPageCraft.isShowTime &&
            !HudPageCraft.isCraftingNPC &&
            !HudPageCraft.isShowReward;

        if (isContentDefault) {
            const items = HudPageNPC.crafts;

            response = HudPageNPC.drawItemsList(items);
        }

        const isContentShowTime = HudPageCraft.isShowTime;

        if (isContentShowTime) response = PageDetailCraft.buildTime(this.shadowRoot);

        if (HudPageCraft.isShowReward) response = await PageDetailCraft.drawReward(HudPageNPC.name);

        return response;
    }

    get action() {
        const response = ds.Prefix.CRAFT;

        return response;
    }

    static get isContentReward() {
        const response = HudPageCraft.isShowReward && !PageDetailCraft.isReward;

        return response;
    }

    static get isCraftDone() {
        const response = PageDetailCraft.isCraftDone;

        return response;
    }

    static get isCraftingNPC() {
        const response = PageDetailCraft.isCraftingNPC;

        return response;
    }

    static get isShowTime() {
        const response =
            PageDetail.isCraft &&
            HudPageCraft.isCraftingNPC &&
            !HudPageCraft.isCraftDone;

        return response;
    }

    static get isShowReward() {
        const response =
            PageDetail.isCraft &&
            HudPageCraft.isCraftingNPC &&
            HudPageCraft.isCraftDone;

        return response;
    }

    handleOpenDetails(id) {
        const args = {
            id,
            context: this,
            npcAction: this.action,
        };

        HudPageNPC.handleOpenDetails(args);
    }

    async render() {
        HudPageDetail.npcAction = this.action;

        const component = await this.draw();

        ds.Components.render(this.args, component);

        ds.Layout.addEventListeners(this, 'button');
    }
}
export class HudPageDeposit extends HTMLElement {
    args = {
        context: this,
    };



    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.render();
    }



    draw() {
        const items = Player.inventory;
        const length = items.length;
        const content = length > 0 ? Layout.drawCardItemList(items) : Layout.drawEmptyContent();
        const response = HudPageNPC.drawWrapper(content);

        return response;
    }

    get action() {
        const response = ds.Prefix.DEPOSIT;

        return response;
    }

    handleOpenDetails(id) {
        const args = {
            id,
            context: this,
            npcAction: this.action,
        };

        HudPageDetail.itemId = id.id;

        HudPageNPC.handleOpenDetails(args);
    }

    async render() {
        const isValid = NPCs.validateBankLevel();

        if (!isValid) return;

        HudPageDetail.npcAction = this.action;

        await FetchData.openBank();

        const component = this.draw();

        ds.Components.render(this.args, component);

        ds.Layout.addEventListeners(this, 'button');
    }
}
export class HudPageDetail extends HTMLElement {
    args = {
        context: this,
    };
    itemProperties;
    static isFromNPC;
    static npcAction;
    static pageDetail;
    static lastPage;
    static ids = {
        field: {
            quantity: 'field_quantity',
            price: 'field_price',
            time: 'field_time',
        }
    };
    static method;
    static methods = {
        equipItem: 'equipItem',
        unequipItem: 'unequipItem',
    };
    static currentButton;
    static itemId;



    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        HudPageDetail.pageDetail = this;
        HudPageDetail.lastPage = this.parentNode.parentNode.parentNode;
        this.render();
    }




    buildFieldValue(key, value) {
        let response = value;

        const isPercentage = key === 'recovery_percentage';
        if (isPercentage) response = `${value}%`;

        const isEffectTime = key === 'effect_time';
        if (isEffectTime) response = Layout.buildEffectTime(value);

        return response;
    }

    buildHandlerArgs() {
        const response = {
            id: HudPageDetail.itemId ?? this.itemProperties?.id,
            il: this.itemLoreId,
            npc: this.lastPageDataName,
            quantity: this.getQuantityValue()
        };

        return response;
    }

    buildItemProperties(itemData) {
        const normalizedItemData = typeof itemData === 'object' && itemData !== null
            ? itemData
            : { id: itemData, item: itemData, quantity: 1 };

        const buildItem = Storage.buildItem(normalizedItemData);
        const itemId = normalizedItemData?.id ?? normalizedItemData?.item ?? normalizedItemData?.target ?? buildItem?.item;
        let idLore = normalizedItemData?.id_lore ?? normalizedItemData?.idLore ?? normalizedItemData?.target ?? normalizedItemData?.item ?? buildItem?.item;
        const isValid = !idLore && itemId;

        if (isValid) {
            const itemFromModules = ds.Helper.findById(ds.Modules.items, Number(itemId));

            if (itemFromModules?.id) idLore = itemFromModules.id;

            if (!idLore) {
                const storageEntry = Storage.getDataFiltered(0).find((entry) => entry.id === itemId);

                idLore = storageEntry?.id_lore;
            }
        }

        if (!idLore) {
            throw new Error(`HudPageDetail: idLore não encontrado no itemData: ${JSON.stringify(normalizedItemData)}`);
        }

        const args = {
            id: itemId,
            target: idLore,
            quantity: normalizedItemData?.quantity ?? buildItem?.quantity ?? 1
        };

        normalizedItemData.isTooltip = false;
        this.itemProperties = Storage.getProperties(args);
    }

    buildResponseMessage(target, isCheckInventory) {
        const translation = ds.Translation.interface.response;
        const currentMessage = translation[target];
        const checkInventory = translation.check_inventory;

        let response = `${currentMessage}`;

        if (isCheckInventory) response += ` ${checkInventory}`;

        return response;
    }

    calculateQuantity() {
        const id = this.itemPropertiesLoot.id;
        const isDurability = this.itemProperties.isDurability;
        let response = 0;

        const isBuy = PageDetail.isBuy;

        if (isBuy) {
            const price = this.priceBuy;
            const payWith = this.itemPropertiesLoot.pay_with;

            response = PageDetail.calculateQuantityBuy(price, payWith);
        }

        const isCraft = PageDetail.isCraft;

        if (isCraft) {
            const recipe = this.itemPropertiesLoot.craftRecipe;

            response = PageDetailCraft.calculateQuantity(recipe);
        }

        const isWithdraw = PageDetail.isWithdraw;

        if (isWithdraw) response = PageDetail.calculateQuantityWithdraw(id, isDurability);

        const isSell = PageDetail.isSell;
        const isDeposit = PageDetail.isDeposit;
        const isQuantity = isDeposit || isSell;

        if (isQuantity) response = PageDetail.calculateQuantity(id, isDurability);

        return response;
    }

    calculatePriceFromQuantity(quantity) {
        const isBuy = PageDetail.isBuy;
        const itemPropertiesLoot = this.itemPropertiesLoot;
        const price = itemPropertiesLoot.price;
        let unitPrice = isBuy ? itemPropertiesLoot.priceBuy : price;

        const isSell = PageDetail.isSell;
        const maximumDurability = itemPropertiesLoot.durability ?? 0;

        if (isSell && maximumDurability > 0) {
            const currentDurability = Storage.getItemDurabilityById(this.itemProperties.id) ?? 0;
            const scaledPrice = Math.ceil(price * currentDurability / maximumDurability);

            unitPrice = Math.max(1, scaledPrice);
        }

        let total = unitPrice * quantity;

        const merchantTradeBonus = Data.rules.npcs.merchantTradeBonus ?? 0;
        const isMerchant = Statics.classes[Player.attributes?.class]?.class === 'merchant';

        if (isMerchant && merchantTradeBonus > 0) {
            const factor = isBuy ? (1 - merchantTradeBonus) : (1 + merchantTradeBonus);
            total = Math.ceil(total * factor);
        }

        return total;
    }

    async draw() {
        this.buildItemProperties(this.itemData);

        this.setTexts();

        const page = this.getAttribute('page');
        const content = await this.drawContent();
        const contentWrapper = ds.Page.drawContent(page, content);

        const footer = PageDetailMenu.drawMenu(this.itemProperties, this.lastPageData);
        const footerWrapper = ds.Page.drawFooter(footer);

        const response = `
            ${contentWrapper}
            ${footerWrapper}
        `;

        return response;
    }

    async drawContent() {
        const isShowTime = HudPageCraft.isShowTime;
        const isReward = HudPageCraft.isShowReward;

        if (isShowTime || isReward) this.setText('');

        if (isShowTime) return PageDetailCraft.buildTime(this.shadowRoot);

        if (HudPageCraft.isContentReward) {
            return await PageDetailCraft.drawReward(HudPageNPC.name);
        }

        return this.drawContentDefault();
    }

    drawContentDefault() {
        const fields = this.drawFields();
        const icon = this.drawIcon();
        const craftRecipe = PageDetail.isCraft ? PageDetailCraft.drawRecipe(this.craftRecipe, this.getQuantityValue()) : '';
        const descriptionText = this.itemProperties.translationDescription;
        const description = descriptionText ? `
            <div class="ds-row">
                <p class="gm-description">${descriptionText}</p>
            </div>
        ` : '';
        const response = `
            <div class="ds-row gm-detail">
                <div class="ds-row">
                    <div class="ds-column gm-detail__image">
                        ${icon}
                    </div>
                    <div class="ds-column">
                        <form class="ds-form ds-form--readonly">
                            ${description}
                            <div class="ds-row">
                                ${fields}
                            </div>
                        </form>
                    </div>
                </div>
                ${craftRecipe}
            </div>
        `;

        return response;
    }

    drawField(props) {
        const {
            label,
            value,
            dataId,
            isReadOnly = true,
            type = 'text'
        } = props;
        const componentFormField = ds.Components.componentFormField;
        const escape = ds.Helper.escapeHTML;
        const css = ds.Layout.theme.form;
        const response = `
            <div class="ds-row">
                <${componentFormField}
                    class="ds-row ds-column ds-form__field"
                    label="${escape(label)}"
                    input-value="${escape(value)}"
                    is-read-only="${isReadOnly}"
                    data-id="${escape(dataId)}"
                    type="${escape(type)}"
                    css-wrapper="${css}"
                >
                </${componentFormField}>
            </div>
        `;

        return response;
    }

    drawIcon() {
        const data = {
            ...this.itemData,
            ...this.itemProperties,
            id: this.itemProperties?.id ?? this.itemData?.id,
            item: this.itemProperties?.idLore ?? this.itemProperties?.target ?? this.itemData?.id_lore ?? this.itemData?.item,
            itemLoot: this.itemProperties?.itemLoot ?? this.itemData?.itemLoot,
            quantity: this.itemProperties?.quantity ?? this.itemData?.quantity,
            isDurability: this.itemProperties?.isDurability ?? this.itemData?.isDurability,
            kind: this.itemProperties?.itemLoot?.kind ?? this.itemData?.kind,
        };

        const durabilityStorage = Storage.getItemDurabilityById(data.id);

        data.durabilityStorage = durabilityStorage;

        const response = lo.HTML.drawLoot(data);

        return response;
    }

    static drawMoney() {
        const component = Components.cHudContentMoney;
        const html = `
            <${component}
                class="ds-display-flex ds-center"
            >
            </${component}>
        `;
        const response = ds.Page.drawFooter(html);

        return response;
    }

    drawFields() {
        const {
            translationName,
            translationNameLabel,
            translationQuantity,
            quantity,
            itemLoot
        } = this.itemProperties;
        let response = '';

        response += this.drawFieldName(translationNameLabel, translationName);

        for (const [key, value] of Object.entries(itemLoot)) {
            const isValid = key !== 'priceBuy' && key !== 'pay_with';
            if (isValid) {
                const fields = this.drawFieldValid(key, value);
                response += fields;
            }
        }

        response += this.drawFieldPrice(itemLoot);
        response += this.drawFieldTime();
        response += this.drawFieldQuantity(translationQuantity, quantity);

        return response;
    }

    drawFieldName(label, value) {
        const response = this.drawField({ label, value });

        return response;
    }

    drawFieldQuantity(label, value) {
        let response = '';
        const pageFrom = this.lastPageData.from;
        const isEquipments = pageFrom.includes('equipments');
        const isRule = !isEquipments;

        if (isRule) {
            response = this.drawField({
                label,
                value,
                dataId: HudPageDetail.ids.field.quantity,
                isReadOnly: false,
                type: 'number'
            });
        }

        return response;
    }

    drawFieldPrice(itemLoot) {
        const label = Translation.buildTitlePrice(itemLoot.pay_with);
        const isRule = PageDetail.isBuy || PageDetail.isSell;
        let response = '';

        if (isRule) {
            const quantity = 1;
            const price = this.calculatePriceFromQuantity(quantity);

            response = this.drawField({
                label,
                value: price,
                dataId: HudPageDetail.ids.field.price
            });
        }

        return response;
    }

    drawFieldTime() {
        let response = '';
        const isCraft = PageDetail.isCraft;

        if (isCraft) {
            const label = PageDetailCraft.translation?.is_crafting_text;
            const value = PageDetailCraft.buildTimeText(this.craftTime * this.getQuantityValue());

            response = this.drawField({
                label,
                value,
                dataId: HudPageDetail.ids.field.time
            });
        }

        return response;
    }

    drawFieldValid(key, value) {
        let response = '';
        const invalids = [
            'id',
            'id_craft',
            'css_item',
            'css_person',
            'css_tile',
            'translation',
            'durability',
            'kind',
            'craftTime',
            'craftRecipe',
            'craftResult',
            'price'
        ];
        const isValid =
            !invalids.includes(key) &&
            value !== '' &&
            value !== 0 &&
            value !== null &&
            value !== undefined;

        if (isValid) {
            const translation = this.transitionPage;
            const fieldValue = this.buildFieldValue(key, value);
            response += this.drawField({
                label: translation[key],
                value: fieldValue
            });
        }

        return response;
    }

    async fetchData(props) {
        const { method, responseText, isCheckInventory } = props;

        const args = this.buildHandlerArgs();
        const response = await FetchData[`${method}`](args);

        if (response) this.handleClickFinish(response, responseText, isCheckInventory);

        return response;
    }

    get buttonBack() {
        const response = ds.Helper.getElementByDataId(this.shadowRoot, 'back');

        return response;
    }

    get buttonBuy() {
        const response = ds.Helper.getElementByDataId(this.shadowRoot, 'buy');

        return response;
    }

    get buttonCraft() {
        const response = ds.Helper.getElementByDataId(this.shadowRoot, 'craft');

        return response;
    }

    get buttonSell() {
        const response = ds.Helper.getElementByDataId(this.shadowRoot, 'sell');

        return response;
    }

    get craftRecipe() {
        const response = this.itemProperties.itemLoot.craftRecipe;

        return response;
    }

    get craftTime() {
        const response = this.itemPropertiesLoot.craftTime;

        return response;
    }

    get isEquipment() {
        const response = this.itemProperties.isEquipment;

        return response;
    }

    get itemData() {
        const response = Statics.temp.itemData;

        return response;
    }

    get page() {
        const response = this.lastPageData.page;

        return response;
    }

    get lastPageData() {
        const el = HudPageDetail.lastPage;
        const dataPosition = el.getAttribute('data-position');
        const page = Hud.getElHudPage(dataPosition);
        const response = page.lastPage;

        return response;
    }

    get transitionPage() {
        const response = ds.Translation.getTranslationPage('detail');

        return response;
    }

    get lastPageDataName() {
        const response = this.lastPageData.name;

        return response;
    }

    get itemLoreId() {
        const response = this.itemProperties.idLore;

        return response;
    }

    get itemPropertiesLoot() {
        const response = this.itemProperties.itemLoot;

        return response;
    }

    get priceBuy() {
        const response = this.itemPropertiesLoot.priceBuy;

        return response;
    }

    getQuantityValue() {
        const id = HudPageDetail.ids.field.quantity;
        const elQuantity = ds.Helper.getElementByDataId(this.shadowRoot, id);

        if (!elQuantity) return 1;

        const response = Number(elQuantity.getAttribute(ds.Prefix.ATTR_INPUT_VALUE));

        return response > 0 ? response : 1;
    }

    handleBack() {
        const data = this.lastPageData;
        const {
            pagePosition,
            page,
            from,
            isNPC,
            name,
            backFilter
        } = data;

        if (isNPC && backFilter) HudPageNPC.nextTab = backFilter;

        const args = {
            detail: {
                page,
                pageTarget: from,
                pagePosition,
                from,
                isNPC,
                name
            }
        };

        HTML.elHud.openPage(args);
    }

    async handleBuy(dataId) {
        const args = {
            target: dataId,
            method: 'buyItem',
            responseText: 'bought',
            isCheckInventory: true
        };

        Analytics.send({
            event_name: 'npc_buy',
            item_id: this.itemProperties?.id,
            item_name: this.itemProperties?.translationName,
            npc: this.lastPageDataName,
        });

        await this.handleClick(args);
    }

    async handleClick(props) {
        const { target, method } = props;
        const elButton = ds.Helper.getElementByDataId(this.shadowRoot, target);
        const isButtonDisabled = ds.Layout.isButtonDisabled(elButton);

        if (isButtonDisabled) return;

        HudPageDetail.method = method;
        HudPageDetail.currentButton = elButton;
        HudPageDetail.setCurrentButtonDisabled(true);

        return await this.fetchData(props);
    }

    static setCurrentButtonDisabled(action) {
        const elButton = HudPageDetail.currentButton;
        ds.Layout.setButtonDisabled(elButton, action);
    }

    async handleCraft(dataId) {
        const args = {
            target: dataId,
            method: 'startCraft',
            responseText: 'crafted',
            isCheckInventory: false
        };

        Analytics.send({
            event_name: 'craft_start',
            item_id: this.itemProperties?.id,
            item_name: this.itemProperties?.translationName,
            npc: this.lastPageDataName,
        });

        const data = await this.handleClick(args);

        if (data.isError) return;

        this.buttonBack.click();
    }

    async handleDelete(dataId) {
        const title = ds.Translation.interfaceDefault.delete;
        const text = ds.Translation.interfaceDefault.delete_confirm;
        const isConfirm = await ds.ConfirmationHandler.open({
            title,
            text,
        });

        if (!isConfirm) return;

        Analytics.send({
            event_name: 'item_delete',
            item_id: this.itemProperties?.id,
            item_name: this.itemProperties?.translationName,
        });

        const args = {
            target: dataId,
            method: 'deleteItem',
            responseText: 'deleted',
            isCheckInventory: true
        };

        await this.handleClick(args);
    }

    async handleDeposit(dataId) {
        const args = {
            target: dataId,
            method: 'depositItem',
            responseText: 'deposited',
            isCheckInventory: false
        };

        Analytics.send({
            event_name: 'npc_deposit',
            item_id: this.itemProperties?.id,
            item_name: this.itemProperties?.translationName,
            npc: this.lastPageDataName,
        });

        await this.handleClick(args);
    }

    async handleWithdraw(dataId) {
        const args = {
            target: dataId,
            method: 'withdrawItem',
            responseText: 'withdrawn',
            isCheckInventory: true
        };

        Analytics.send({
            event_name: 'npc_withdraw',
            item_id: this.itemProperties?.id,
            item_name: this.itemProperties?.translationName,
            npc: this.lastPageDataName,
        });

        await this.handleClick(args);
    }

    async handleEquip(dataId) {
        const args = {
            target: dataId,
            method: HudPageDetail.methods.equipItem,
            responseText: 'equipped',
            isCheckInventory: false
        };

        Analytics.send({
            event_name: 'item_equip',
            item_id: this.itemProperties?.id,
            item_name: this.itemProperties?.translationName,
        });

        await this.handleClick(args);
    }

    handleClickFinish(response, translation, isCheckInventory) {
        const content = this.buildResponseMessage(translation, isCheckInventory);
        const args = {
            content,
        };

        const isError = response.isError;
        if (!isError) Notification.add(args);

        HudPageDetail.setCurrentButtonDisabled(false);

        this.setButtonDisabled();
        this.handleClickFinishGoBack();
    }

    handleClickFinishGoBack() {
        const isFromNpc = HudPageDetail.isFromNPC;
        const method = HudPageDetail.method;
        const isUnequipItem = method === HudPageDetail.methods.unequipItem;
        let isClickBack = false;
        let quantity = 0;

        if (!isFromNpc) {
            const inventory = Player.inventory;
            quantity = inventory[this.itemId];
        }

        if (!quantity || isUnequipItem) isClickBack = true;
        if (isClickBack) this.buttonBack.click();
    }

    async handleSell(dataId) {
        const args = {
            target: dataId,
            method: 'sellItem',
            responseText: 'sold_item',
            isCheckInventory: true
        };

        Analytics.send({
            event_name: 'npc_sell',
            item_id: this.itemProperties?.id,
            item_name: this.itemProperties?.translationName,
            npc: this.lastPageDataName,
        });

        await this.handleClick(args);
    }

    async handleUnequip(dataId) {
        const args = {
            target: dataId,
            method: HudPageDetail.methods.unequipItem,
            responseText: 'unequipped',
            isCheckInventory: true
        };

        Analytics.send({
            event_name: 'item_unequip',
            item_id: this.itemProperties?.id,
            item_name: this.itemProperties?.translationName,
        });

        await this.handleClick(args);
    }

    async handleUse(target) {
        const args = {
            target,
            method: 'useItem',
            responseText: 'used',
            isCheckInventory: false
        };

        Analytics.send({
            event_name: 'item_use',
            item_id: this.itemProperties?.id,
            item_name: this.itemProperties?.translationName,
        });

        await this.handleClick(args);
    }

    observeQuantityChanges(elQuantity) {
        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.type === 'attributes' &&
                    mutation.attributeName === ds.Prefix.ATTR_INPUT_VALUE) {
                    this.updatePriceField();
                    this.updateTimeField();
                    this.updateCraftRecipe();
                }
            }
        });

        observer.observe(elQuantity, {
            attributes: true
        });
    }

    async render() {
        const component = await this.draw();

        ds.Components.render(this.args, component);

        const componentButton = ds.Components.componentButton;

        ds.Layout.addEventListeners(this, componentButton);

        this.setQuantityField();

        this.setButtosDisabled();
    }

    setButtonDisabled() {
        const button = HudPageDetail.currentButton;
        const dataId = button.getAttribute('data-id');
        const capitalizeDataId = ds.Helper.capitalizeString(dataId);
        const method = `setButtonDisabled${capitalizeDataId}`;
        const isValid = typeof this[method] === 'function';

        if (isValid) this[method]();
    }

    static setDataFrom(props) {
        const { isFromNPC, npcAction } = props;

        HudPageDetail.isFromNPC = isFromNPC;
        HudPageDetail.npcAction = npcAction;
    }

    setQuantityField() {
        const id = HudPageDetail.ids.field.quantity;
        const elQuantity = ds.Helper.getElementByDataId(this.shadowRoot, id);

        if (!elQuantity) return;

        const quantity = this.calculateQuantity();
        const resolvedQuantity = this.itemProperties?.quantity ?? this.itemData?.quantity ?? 1;

        const valueMin = HudPageDetail.isFromNPC ? quantity.min : 1;
        elQuantity.setAttribute(ds.Prefix.ATTR_INPUT_VALUE, valueMin);

        const valueMax = HudPageDetail.isFromNPC ? quantity.max : resolvedQuantity;
        elQuantity.setAttribute(ds.Prefix.ATTR_INPUT_MAX, valueMax);

        elQuantity.setAttribute(ds.Prefix.ATTR_INPUT_MIN, 1);

        elQuantity.shadowRoot.querySelector('input').focus();

        this.updatePriceField();
        this.updateTimeField();

        this.observeQuantityChanges(elQuantity);
    }

    setButtosDisabled() {
        this.setButtonDisabledBuy();
        this.setButtonDisabledCraft();
        this.setButtonDisabledDeposit();
        this.setButtonDisabledSell();
        this.setButtonDisabledWithdraw();
    }

    setButtonDisabledBuy() {
        const price = this.calculatePriceFromQuantity(1);
        const currency = Player.getInventoryByCurrency(this.itemPropertiesLoot.pay_with);
        const isDisabled = price > currency;

        ds.Layout.setButtonDisabled(this.buttonBuy, isDisabled);
    }

    setButtonDisabledByNotHaving(data) {
        const itemId = this.itemId;
        const isItem = data[itemId];

        ds.Layout.setButtonDisabled(HudPageDetail.currentButton, !isItem);
    }

    setButtonDisabledCraft() {
        let isDisabled = false;
        const recipe = this.craftRecipe;

        if (!recipe) {
            isDisabled = true;
        } else {
            const quantitySelected = this.getQuantityValue();
            const { max } = PageDetailCraft.calculateQuantity(recipe);
            const isRule = max === 0 || quantitySelected > max;
            if (isRule) isDisabled = true;
        }

        const isCraftingNPC = PageDetailCraft.isCraftingNPC;

        if (isCraftingNPC) isDisabled = true;

        ds.Layout.setButtonDisabled(HudPageDetail.currentButton, isDisabled);
    }

    setButtonDisabledDeposit() {
        this.setButtonDisabledByNotHaving(Player.inventory);
    }

    setButtonDisabledSell() {
        this.setButtonDisabledByNotHaving(Player.inventory);
    }

    setButtonDisabledWithdraw() {
        this.setButtonDisabledByNotHaving(Player.bankStorage);
    }

    setText(text) {
        this.page?.setText(text);
    }

    setTexts() {
        const transition = ds.Translation.interfaceDefault;
        this.page?.setTitle(transition.detail);
        this.setText(transition.detail_description);
    }

    updatePriceField() {
        const quantity = this.getQuantityValue();
        const price = this.calculatePriceFromQuantity(quantity);

        const id = HudPageDetail.ids.field.price;
        const elPrice = ds.Helper.getElementByDataId(this.shadowRoot, id);

        if (!elPrice) return;

        elPrice.setAttribute(ds.Prefix.ATTR_INPUT_VALUE, price);
    }

    updateTimeField() {
        const isCraft = PageDetail.isCraft;

        if (!isCraft) return;

        const quantity = this.getQuantityValue();
        const value = PageDetailCraft.buildTimeText(this.craftTime * quantity);

        const id = HudPageDetail.ids.field.time;
        const elTime = ds.Helper.getElementByDataId(this.shadowRoot, id);

        if (!elTime) return;

        elTime.setAttribute(ds.Prefix.ATTR_INPUT_VALUE, value);
    }

    updateCraftRecipe() {
        const isCraft = PageDetail.isCraft;

        if (!isCraft) return;

        const quantity = this.getQuantityValue();
        const recipe = this.craftRecipe;

        if (!recipe) return;

        const elPageDetail = this.shadowRoot.querySelector('.gm-detail');

        if (!elPageDetail) return;

        const existingSubtitle = elPageDetail.querySelector('.ds-title');

        if (existingSubtitle) {
            const subtitleRow = existingSubtitle.closest('.ds-row');
            const cardRow = subtitleRow.nextElementSibling;

            if (cardRow) cardRow.remove();
            subtitleRow.remove();
        }

        const recipeHtml = PageDetailCraft.drawRecipe(recipe, quantity);

        elPageDetail.insertAdjacentHTML('beforeend', recipeHtml);
    }
}
export class HudPageEquipments extends HTMLElement {
    args = {
        context: this,
    };
    static pageDetail;



    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.render();
        HudPageEquipments.pageDetail = this;
    }



    draw() {
        const page = this.getAttribute('page');
        let html = '<div class="gm-equipment">';

        Statics.equipments.forEach((index) => {
            if (index !== 'clothes') html += this.drawItem(index);
        });
        html += '</div>';

        const contentWrapper = ds.Page.drawContent(page, html);

        return contentWrapper;
    }

    drawItem(index) {
        const equipments = Player.equipmentsInStorage;
        const equipmentsData = Player.equipments;
        const id = equipmentsData?.[index];
        const item = Character.getEquipmentIdLoreById(equipments, id);
        const quantity = 1;
        const kind = index;
        const argsItem = {
            target: item,
            quantity
        };
        const itemProperties = Storage.getProperties(argsItem);
        const isDurability = itemProperties?.isDurability;
        const itemData = {
            id,
            isDurability,
            quantity,
            item: itemProperties?.idLore,
            kind: itemProperties?.itemLoot?.kind
        };
        const dataHandlerProps = `[${ds.Helper.buildJSONToHTML(itemData)}]`;
        const isEquipment = item && item?.length !== 0 ? true : false;
        const durabilityStorage = Storage.getItemDurabilityById(id);
        const args = {
            item,
            isDurability,
            isEquipment,
            kind,
            isTooltip: !isEquipment,
            id,
            durabilityStorage
        };
        const icon = lo.HTML.drawLoot(args);
        const translation = ds.Translation.gameEquipment[index];
        const tooltip = isEquipment ? '' : `data-tooltip="${translation}"`;
        const theme = ds.Layout.theme.card;
        let response = `
            <button
                class="ds-card--small ${theme} gm-equipment__${index}"
                type="button"
                ${tooltip}
        `;

        if (itemProperties) {
            response += `
                data-handler="handleOpenDetails"
                data-handler-props='${dataHandlerProps}'
            `;
        }

        response += `
            >
                <div class="ds-card__header">
                </div>
                <div class="ds-card__body">
                    ${icon}
                </div>
                <div class="ds-card__footer">
                </div>
            </button>
        `;

        return response;
    }

    handleOpenDetails(target) {
        const args = {
            id: target,
            context: this,
            isFromNPC: false,
            backFilter: this.getAttribute('page')
        };

        HudPageDetail.itemId = target.id;

        Hud.openPageDetail(args);
    }

    redraw() {
        this.render();
    }

    render() {
        const component = this.draw();

        ds.Components.render(this.args, component);
        ds.Layout.addEventListeners(this, 'button');

        const elements = this.shadowRoot.querySelectorAll('[data-tooltip]');

        elements.forEach(el => {
            ds.Tooltip?.elTooltipWrapper?.build({ context: el });
        });
    }

    updateData() {
        this.render();
    }
}
export class HudPageInventory extends HTMLElement {
    args = {
        context: this,
    };
    activeContentDetault = 'all';
    activeContent = this.activeContentDetault;
    itemKinds = [];
    static pageDetail;



    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        HudPageInventory.pageDetail = this;
        this.redraw();
    }



    buildItemKinds(props) {
        const { item, quantityItem } = props;
        const argsItem = {
            target: item,
            quantity: quantityItem
        };
        const itemProperties = Storage.getProperties(argsItem);
        const kind = itemProperties.itemLoot.kind;
        const isKind = this.itemKinds.includes(kind);

        if (!isKind) this.itemKinds.push(kind);
    }

    draw() {
        const footer = this.drawFooter();
        const page = this.getAttribute('page');

        const items = Player.inventory;
        const length = items.length;
        const content = length > 0 ? this.drawList(items) : Layout.drawEmptyContent();

        const contentWrapper = ds.Page.drawContent(page, content);
        const footerWrapper = ds.Page.drawFooter(footer, false);
        const response = `
            ${contentWrapper}
            ${footerWrapper}
        `;

        this.drawMenu();

        return response;
    }

    drawMenu() {
        let buttons = [];
        const itemKinds = this.itemKinds;
        const isKinds = itemKinds.length > 0;
        if (!isKinds) return;

        buttons.push(Statics.buttons.filterAll);

        let isEquipment = false;
        let isUsable = false;
        let isResources = false;
        let isMoney = false;
        let isCollectable = false;

        itemKinds.forEach((index) => {
            const isIndexEquipment = Storage.isEquipment(index);
            if (isIndexEquipment) isEquipment = true;

            const kind = Storage.getItemKind(index);

            if (kind.isResources) isResources = true;
            if (kind.isMoney) isMoney = true;
            if (kind.isUsable) isUsable = true;
            if (kind.isCollectable) isCollectable = true;
        });

        const buttonsStatics = Statics.buttons;

        if (isEquipment) buttons.push(buttonsStatics.filterEquipment);
        if (isResources) buttons.push(buttonsStatics.filterResources);
        if (isMoney) buttons.push(buttonsStatics.filterMoney);
        if (isUsable) buttons.push(buttonsStatics.filterUsable);
        if (isCollectable) buttons.push(buttonsStatics.filterCollectable);

        HTML.elHudPageRight.setMenu({ buttons });
    }

    drawList(items) {
        const filtered = items.filter(index => this.isSameActiveContent(index));

        this.prepareKinds(filtered);

        const response = Layout.drawCardItemList(filtered, true);

        return response;
    }

    drawFooter() {
        const translation = ds.Translation.interfaceDefault;
        const translationCapacity = translation?.capacity;
        const progress = this.drawProgress(translationCapacity);
        const response = `
            <span class="gm-label">${translationCapacity}:</span>
            ${progress}
        `;

        return response;
    }

    drawProgress(translationCapacity) {
        const data = Data.player.attributes;
        const value = data.weight;
        const valueMax = data.capacity;
        const args = {
            value,
            valueMax,
        };
        const theme = ds.Layout.buildProgressColor(args);
        const tooltipArgs = {
            text: translationCapacity,
            value,
            valueMax,
            isPercentage: false
        };
        const tooltipArgs2 = {
            value,
            valueMax,
            isPercentage: true
        };
        const tooltip1 = ds.Layout.buildTextCapacity(tooltipArgs);
        const tooltip2 = ds.Layout.buildTextCapacity(tooltipArgs2);
        const tooltip = `${tooltip1} - ${tooltip2}`;
        const componentProgress = ds.Components.componentProgress;
        const response = `
            <${componentProgress}
                value="${value}"
                value-max="${valueMax}"
                theme="${theme}"
                direction="horizontal"
                data-tooltip="${tooltip}"
                class="ds-display-flex ds-full-width"
                css-wrapper="gm-style"
                class="ds-display-flex ds-progress"
            ></${componentProgress}>
        `;

        return response;
    }

    isSameActiveContent(target) {
        const activeContent = this.activeContent;
        const isFilterAll = activeContent === this.activeContentDetault;
        let response = false;

        if (isFilterAll) {
            response = true;
        } else {
            const itemId = target.id_lore;
            const itemData = ds.Helper.findById(ds.Modules.items, Number(itemId));
            const itemKind = itemData.kind;
            const isEquipment = Storage.isEquipment(itemKind);

            if (activeContent === itemKind) response = true;
            if (isEquipment && activeContent === 'equipment') response = true;
        }

        return response;
    }

    handleFilter(target) {
        const kind = Storage.getIdByTranslation(target);
        this.activeContent = kind ? kind : target;
        this.render();
    }

    handleOpenDetails(target) {
        const args = {
            id: target,
            context: this,
            isFromNPC: false,
            backFilter: this.getAttribute('page')
        };

        HudPageDetail.itemId = target.id;

        Hud.openPageDetail(args);
    }

    prepareKinds(items) {
        items.forEach((entry) => {
            const itemLoot = Storage.buildItem(entry);
            const item = itemLoot.item;
            const quantityItem = itemLoot.quantity;
            const args = {
                item,
                quantityItem
            };

            this.buildItemKinds(args);
        });
    }

    updateData() {
        this.redraw();
    }

    redraw() {
        this.itemKinds = [];
        this.activeContent = this.activeContentDetault;
        this.render();
    }

    render() {
        const component = this.draw();

        ds.Components.render(this.args, component);
        ds.Layout.addEventListeners(this, 'button');
    }
}
export class HudPageMap extends HTMLElement {
    args = {
        context: this,
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
            <div class="ds-row ds-center">
                <h2 class="ds-title">
                    ${this.data.name}
                </h2>
            </div>
            <div class="ds-page__${this.args}">
                <div class="gm-mini-map">
                    ${list}
                </div>
            </div>
        `;
        const contentWrapper = ds.Page.drawContent(page, content);
        const response = `
            ${contentWrapper}
        `;

        return response;
    }

    drawList() {
        const cssTilePrefix = 'gm-mini-map__tile--';
        const playerMap = Data.miniMap;
        const length = Data.map.data.mapsTotal;
        let response = '';

        for (let i = 0; i < length; i++) {
            const target = i + 1;
            const tileData = playerMap?.[target];
            const isVisited = tileData !== undefined;
            const cssTile = isVisited ? `${cssTilePrefix}green` : `${cssTilePrefix}disabled`;

            response += `
                <div
                    class="gm-mini-map__tile ${cssTile}"
                    id="mini_map_tile_${target}"
                >
            `;

            const isCurrent = this.data.idMiniMap === target;

            if (isCurrent) response += this.drawPointer();

            response += this.drawDoors(tileData, target);
            response += '</div>';
        }

        return response;
    }

    drawDoors(tileData, target) {
        const visitedDoors = Object
            .values(tileData?.doors || {})
            .flat();

        const isDoor1 = visitedDoors.includes(1);
        const isDoor2 = visitedDoors.includes(2);
        const isDoor3 = visitedDoors.includes(3);
        const isDoor4 = visitedDoors.includes(4);

        let response = '';

        const drawDoor = (target, position) => `
            <div
                id="mini_map_tile_door_${position}_${target}"
                class="gm-mini-map__door-${position}"
            ></div>
        `;

        if (isDoor1) response += drawDoor(target, 'top');
        if (isDoor2) response += drawDoor(target, 'left');
        if (isDoor3) response += drawDoor(target, 'right');
        if (isDoor4) response += drawDoor(target, 'bottom');

        return response;
    }

    drawPointer() {
        const props = {
            theme: 'black',
            size: 'extra-big',
            icon: 'map'
        };
        const icon = ds.HTML.drawIcon(props);
        const response = `
            <div class="gm-mini-map__pointer ds-animation--up-down">
                ${icon}
            </div>
        `;

        return response;
    }

    get data() {
        const response = Data.map.data;

        return response;
    }

    render() {
        const component = this.draw();

        ds.Components.render(this.args, component);
    }

    updateData() {
        this.render();
    }
}
export class HudPageMenu extends HTMLElement {
    args = {
        context: this,
    };



    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.render();
    }



    draw() {
        let response = `
            <div class="ds-button-wrapper ds-menu-vertical">
        `;

        Statics.buttonsMainMenu.forEach((index) => {
            const buttonArgs = {
                id: index.id || '',
                target: index.pageTarget,
                css: index.css + ' ds-button--full',
                label: index.label
            };
            response += this.drawButton(buttonArgs);
        });

        response += '</div>';

        return response;
    }

    drawButton(props) {
        const {
            id,
            target,
            css,
            label
        } = props;
        const componentButton = ds.Components.componentButton;
        const theme = ds.Layout.theme;
        const themeButton = theme.menuDefault;
        const themeSize = theme.menuSize;
        const response = `
            <${componentButton}
                id="${id}"
                theme="${themeButton}"
                size="${themeSize}"
                is-proportional="true"
                is-full="true"
                page-target="${target}"
                page-position="right"
                click="open-hud-page"
                css-custom="${css}"
                data-kind="button"
                label="${label}"
            ></${componentButton}>
        `;

        return response;
    }

    render() {
        const component = this.draw();

        ds.Components.render(this.args, component);
    }
}
export class HudPageNPC extends HTMLElement {
    args = {
        context: this,
    };
    pageId = 'npc';
    buttons = [];
    itemKinds = [];
    static id;
    static name;
    static nextTab;
    static pageDetail;



    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        HudPageNPC.pageDetail = this;
        this.render();

        const nextTab = HudPageNPC.nextTab;
        const index = nextTab
            ? this.buttons.findIndex((button) => button?.id === nextTab)
            : -1;

        this.clickButtonByIndex(index >= 0 ? index : 0);

        HudPageNPC.nextTab = null;
    }



    buildActions(data) {
        const actions = Statics.actions;
        const buttons = Statics.buttons;
        const response = [];

        data.forEach(index => {
            const action = ds.Helper.findById(actions, index);

            if (action) {
                const label = action?.label;
                const capitalized = ds.Helper.capitalizeString(label);
                const button = buttons[`filter${capitalized}`];

                response.push(button);
            }
        });

        this.buttons = response;
    }

    clickButtonByIndex(index) {
        const length = this.buttons.length;
        const isNotValid = length === 0 || index >= length;

        if (isNotValid) return;

        const elButton = this.page.elMenuButtons;

        elButton?.[index]?.click();
    }

    draw() {
        const page = this.getAttribute('page');
        const content = '';
        const contentWrapper = ds.Page.drawContent(page, content);
        const response = `
            ${contentWrapper}
        `;

        return response;
    }

    drawMenu() {
        const buttons = this.buttons;

        this.page.setMenu({ buttons });
    }

    static drawItemsList(items) {
        let response = '';

        items.forEach((index) => {
            const price = ds.Layout.symbol.infinity;
            const itemFormatted = [`${index}`, price];
            const itemLoot = Storage.buildItem(itemFormatted);
            const item = itemLoot.item;
            const args = {
                item,
                index: itemFormatted,
            };
            response += Layout.buildCardItem(args);
        });

        return response;
    }

    static drawWrapper(list, page = 'npc') {
        const content = Layout.drawCardWrapper(list);
        const contentWrapper = ds.Page.drawContent(page, content);
        const footerWrapper = HudPageDetail.drawMoney();
        const response = `
            ${contentWrapper}
            ${footerWrapper}
        `;

        return response;
    }

    getData() {
        const id = HudPageNPC.id;
        const data = NPCs.getData(id);

        HudPageNPC.name = data.name;

        const actions = data.actions;

        if (actions) this.buildActions(actions);

        const sells = data.sells;

        if (sells) HudPageNPC.sells = sells;

        const quests = data.quests;

        if (quests) HudPageNPC.quests = quests;

        const crafts = data.crafts;

        if (crafts) HudPageNPC.crafts = crafts;
    }

    get page() {
        const response = HTML.elHudPageLeft;

        return response;
    }

    static handleOpenDetails(props) {
        const { context, id, npcAction } = props;
        const args = {
            id,
            context,
            isFromNPC: true,
            npcAction,
            backFilter: context.getAttribute('page')
        };

        Hud.openPageDetail(args);
    }

    handleCraftRewardBack() {
        PageDetailCraft.isReward = false;

        this.renderCraft();
    }

    redraw() {
        this.render();

        const page = this.page.elContent?.getAttribute('page');
        const elButton = this.page.getActiveButton(page);

        if (Layout.setActiveButton) Layout.setActiveButton(elButton);
    }

    render() {
        const component = this.draw();

        ds.Components.render(this.args, component);

        this.getData();
        this.drawMenu();
        this.talk();
    }

    renderCraft() {
        this.render();

        this.page.elMenuButtons.forEach((el) => {
            const isFound = el.dataset.id === Statics.buttons.filterCraft.id;

            if (isFound) el.click();
        });
    }

    async talk() {
        const name = HudPageNPC.name;
        const response = await FetchData.getNPC(name);
        const isRestored = response?.status_restored;

        Analytics.send({
            event_name: 'npc_talk',
            npc_name: name,
        });

        if (!isRestored) return;

        const dialogs = ds.Translation.dialog[name];
        const text = dialogs?.status_restored;

        if (text) {
            const args = { content: text };

            Notification.add(args);
        }
    }
}
export class HudPageQuest extends HTMLElement {
    args = {
        context: this,
    };
    static currentButton;
    static pageDetail;



    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        HudPageQuest.pageDetail = this;
        this.render();
    }



    buildResponseMessage(target) {
        const translation = ds.Translation.interface.response;
        const response = translation[target];

        return response;
    }

    draw() {
        const list = this.drawList();
        const content = `
            ${list}
        `;
        const response = HudPageNPC.drawWrapper(content);

        return response;
    }

    drawList() {
        const translation = ds.Translation.interfaceDefault;
        const header = `
            ${ds.HTML.drawTH(translation?.quest)}
            ${ds.HTML.drawTH(translation?.description)}
            ${ds.HTML.drawTH(translation?.action)}
        `;
        const content = this.drawListItems();
        const response = Layout.drawTable(header, content);

        return response;
    }

    drawListItems() {
        const quests = Quest.buildQuestListByNPC(HudPageNPC.id);
        let response = '';

        quests.forEach(quest => {
            const isDone = quest.isDone;
            const title = HudPageQuest.drawListItemContent(isDone, quest.title);
            const description = HudPageQuest.drawListItemContent(isDone, quest.description);
            const action = ds.HTML.drawTD(quest.action, true);
            const content = `
                ${title}
                ${description}
                ${action}
            `;

            response += Layout.drawTableTr(content);
        });

        return response;
    }

    static drawListItemContent(isDone, text) {
        const response = ds.HTML.drawTD(ds.HTML.drawS(isDone, text));

        return response;
    }

    async fetchData(props) {
        const { method, responseText } = props;

        this.handleClickFinish(responseText);

        const response = await FetchData[`${method}`](props);

        return response;
    }

    async handleAccept(id) {
        const args = {
            id,
            target: Layout.buildId(Statics.buttons.accept.id, id),
            method: 'acceptQuest',
            responseText: 'quest_accepted',
            npc: HudPageNPC.id
        };

        Analytics.send({
            event_name: 'quest_accept',
            quest_id: id,
            npc_id: HudPageNPC.id,
        });

        await this.handleClick(args);
    }

    async handleClick(props) {
        const { target } = props;
        const elButton = ds.Helper.getElementByDataId(this.shadowRoot, target);
        const isButtonDisabled = ds.Layout.isButtonDisabled(elButton);

        if (isButtonDisabled) return;

        HudPageQuest.currentButton = elButton;
        HudPageQuest.setCurrentButtonDisabled(true);
        await this.fetchData(props);
        HudPageQuest.pageDetail.render();
    }

    handleClickFinish(translation) {
        const content = this.buildResponseMessage(translation);
        const args = {
            content,
        };

        Notification.add(args);

        HudPageQuest.setCurrentButtonDisabled(false);
    }

    async handleFinish(id) {
        const args = {
            id,
            target: Layout.buildId(Statics.buttons.finish.id, id),
            method: 'finishQuest',
            responseText: 'quest_completed',
            npc: HudPageNPC.id
        };

        Analytics.send({
            event_name: 'quest_finish',
            quest_id: id,
            npc_id: HudPageNPC.id,
        });

        await this.handleClick(args);
    }

    async render() {
        HudPageDetail.npcAction = Quest.action;

        const component = await this.draw();

        ds.Components.render(this.args, component);

        const componentButton = ds.Components.componentButton;

        ds.Layout.addEventListeners(this, componentButton);
    }

    static setCurrentButtonDisabled(action) {
        const elButton = HudPageQuest.currentButton;

        ds.Layout.setButtonDisabled(elButton, action);
    }
}
export class HudPageQuests extends HTMLElement {
    args = {
        context: this,
    };



    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.render();
    }

    draw() {
        const page = this.getAttribute('page');
        const list = this.drawList();
        const listEmpty = Layout.drawEmpty();
        const isContent = ds.Helper.isObjectContent(Player.quests);
        const content = isContent ? list : listEmpty;
        const response = ds.Page.drawContent(page, content);

        return response;
    }

    drawList() {
        const translation = ds.Translation.interfaceDefault;
        const header = `
            ${ds.HTML.drawTH(translation?.quest)}
            ${ds.HTML.drawTH(translation?.description)}
            ${ds.HTML.drawTH(translation?.requester)}
            ${ds.HTML.drawTH(translation?.status)}
        `;
        const content = this.drawListItems();
        const response = Layout.drawTable(header, content);

        return response;
    }

    drawListItems() {
        const quests = Quest.buildFullQuestList(false);
        let response = '';

        quests.forEach(quest => {
            const isDone = quest.isDone;
            const title = HudPageQuest.drawListItemContent(isDone, quest.title);
            const description = HudPageQuest.drawListItemContent(isDone, quest.description);
            const requester = HudPageQuest.drawListItemContent(isDone, quest.requester);
            const action = ds.HTML.drawTD(quest.action, true);

            const content = `
                ${title}
                ${description}
                ${requester}
                ${action}
            `;
            response += Layout.drawTableTr(content);
        });

        return response;
    }

    render() {
        HudPageDetail.npcAction = 'quests';

        const component = this.draw();

        ds.Components.render(this.args, component);
    }

    updateData() {
        this.render();
    }
}
export class HudPageRepair extends HudPageNPC {
    args = {
        context: this,
    };
    ids = [];
    itemKinds = [];
    static fieldPrice = 'field_repair_price';




    constructor() {
        super();
    }




    addEventListeners() {
        ds.Layout.addEventListeners(this, 'button');
        ds.Layout.addEventListeners(this, ds.Components.componentButton);
    }

    buildItems() {
        const items = Player.equipmentsInStorage;
        const response = [];

        items.forEach((index) => {
            const itemLore = this.getItemLore(index);
            const isKind = this.itemKinds.includes(itemLore?.kind);
            const isDamaged = this.isDamaged(index, itemLore);

            if (isKind && isDamaged) response.push(index);
        });

        return response;
    }

    calculatePrice(index) {
        const item = Storage.getItemById(index.id);
        const itemLore = this.getItemLore(index);
        const maximumDurability = itemLore?.durability;
        const currentDurability = item?.durability;
        const missingDurability = maximumDurability - currentDurability;
        const isInvalid = missingDurability <= 0 || maximumDurability <= 0;

        if (isInvalid) return 0;

        const priceBuy = itemLore?.priceBuy;
        const response = Math.ceil(priceBuy * missingDurability / maximumDurability);

        return response;
    }

    calculateTotalPrice(ids = this.ids) {
        const items = this.buildItems();
        let response = 0;

        items.forEach((index) => {
            const isSelected = ids.includes(index.id);
            if (isSelected) response += this.calculatePrice(index);
        });

        return response;
    }

    draw() {
        const description = ds.Translation.getTranslationPage('repair')?.description;
        const items = this.buildItems();
        const list = items.length > 0 ? this.drawItemsList(items) : Layout.drawEmptyContent();
        const price = this.calculateTotalPrice();
        const field = this.drawField({
            label: Translation.buildTitlePriceGold(),
            value: price,
            dataId: HudPageRepair.fieldPrice
        });
        const footer = this.drawFooter();
        const html = `
            <div class="ds-row ds-margin-bottom--big">
                ${description}
            </div>
            ${list}
            ${field}
            ${footer}
        `;
        const response = HudPageNPC.drawWrapper(html);

        return response;
    }

    drawField(props) {
        const { label, value, dataId } = props;
        const componentFormField = ds.Components.componentFormField;
        const escape = ds.Helper.escapeHTML;
        const wrapper = ds.Layout.theme.form;
        const response = `
            <${componentFormField}
                class="ds-row ds-margin-top-bottom--extra-big"
                label="${escape(label)}"
                input-value="${escape(value)}"
                is-read-only="true"
                data-id="${escape(dataId)}"
                type="text"
                css-wrapper="${wrapper}"
            >
            </${componentFormField}>
        `;

        return response;
    }

    drawFooter() {
        const button = Statics.buttons.repair;
        const buttonAll = Statics.buttons.repairAll;
        const action = Layout.drawButtonComponent({
            id: button.id,
            label: button.label,
            handler: button.handler,
            handlerProps: button.handlerProps,
            theme: button.theme
        });
        const actionAll = Layout.drawButtonComponent({
            id: buttonAll.id,
            label: buttonAll.label,
            handler: buttonAll.handler,
            handlerProps: buttonAll.handlerProps,
            theme: buttonAll.theme
        });
        const content = `
            ${action}
            ${actionAll}
        `;
        const response = ds.Page.drawFooter(content);

        return response;
    }

    drawItemCard(index) {
        const id = index.id;
        const item = Storage.getItemById(id);
        const itemLore = this.getItemLore(index);
        const isDurability = itemLore?.durability > 0;
        const durabilityStorage = item?.durability;
        const icon = lo.HTML.drawLoot({
            item: index.id_lore,
            isDurability,
            durabilityStorage,
            id
        });
        const price = this.calculatePrice(index);
        const isSelected = this.ids.includes(id);
        const theme = ds.Layout.theme.card;
        const cssActive = isSelected ? `${theme}--active` : '';
        const response = `
            <button
                class="gm-card__item ds-card--small ${theme} ${cssActive}"
                type="button"
                data-id="${id}"
                data-handler="handleSelect"
                data-handler-props='["${id}"]'
                data-kind='button'
            >
                <div class="ds-card__header">
                </div>
                <div class="ds-card__body">
                    ${icon}
                </div>
                <div class="ds-card__footer ds-right">
                    <div class="ds-truncate">${price}</div>
                </div>
            </button>
        `;

        return response;
    }

    drawItemsList(items) {
        let response = '';

        items.forEach((index) => {
            response += this.drawItemCard(index);
        });

        return response;
    }

    async fetchRepair() {
        const method = this.isMagic ? 'repairMagic' : 'repairCombat';
        const args = {
            ids: this.ids,
            npc: HudPageNPC.id,
        };
        const response = await FetchData[method](args);

        if (response?.isError) return;

        Analytics.send({
            event_name: 'npc_repair',
            items: this.ids,
            npc_id: HudPageNPC.id,
        });

        const translation = ds.Translation.interface.response.repaired;
        const argsNotification = { content: translation };

        Notification.add(argsNotification);

        this.ids = [];

        this.render();
    }

    get action() {
        const response = this.getAttribute('action');

        return response;
    }

    get isMagic() {
        const response = this.action === 'repairMagic';

        return response;
    }

    get translation() {
        const response = ds.Translation.interfaceDefault;

        return response;
    }

    getItemLore(index) {
        const response = ds.Helper.findById(ds.Modules.items, Number(index.id_lore));

        return response;
    }

    async handleRepair() {
        const isInvalid = this.ids.length === 0;
        if (isInvalid) return;

        await this.fetchRepair();
    }

    async handleRepairAll() {
        const items = this.buildItems();
        const isInvalid = items.length === 0;
        if (isInvalid) return;

        this.ids = items.map((index) => index.id);

        await this.fetchRepair();
    }

    handleSelect(id) {
        const idNumber = Number(id);
        const isSelected = this.ids.includes(idNumber);

        if (isSelected) {
            const index = this.ids.indexOf(idNumber);
            this.ids.splice(index, 1);
        } else {
            this.ids.push(idNumber);
        }

        this.render();
    }

    isDamaged(index, itemLore) {
        const item = Storage.getItemById(index.id);
        const maximumDurability = itemLore?.durability;
        const currentDurability = item?.durability;
        const isDurability = maximumDurability > 0;
        const isDamaged = currentDurability < maximumDurability;
        const response = isDurability && isDamaged;

        return response;
    }

    render() {
        const component = this.draw();

        ds.Components.render(this.args, component);

        this.addEventListeners();
        this.setButtonDisabled();
    }

    setButtonDisabled() {
        const items = this.buildItems();
        const allIds = items.map((index) => index.id);
        const button = Statics.buttons.repair;
        const buttonAll = Statics.buttons.repairAll;
        const elButton = ds.Helper.getElementByDataId(this.shadowRoot, button.id);
        const elButtonAll = ds.Helper.getElementByDataId(this.shadowRoot, buttonAll.id);
        const price = this.calculateTotalPrice();
        const priceAll = this.calculateTotalPrice(allIds);
        const gold = Player.inventoryGold;
        const isDisabled = this.ids.length === 0 || price > gold;
        const isDisabledAll = allIds.length === 0 || priceAll > gold;

        ds.Layout.setButtonDisabled(elButton, isDisabled);
        ds.Layout.setButtonDisabled(elButtonAll, isDisabledAll);
    }
}

export class HudPageRepairCombat extends HudPageRepair {
    itemKinds = [
        5,
        6,
        7,
        8,
        9,
        14,
        16,
        17,
        18,
        19,
        21,
    ];




    get action() {
        const response = 'repairCombat';

        return response;
    }
}

export class HudPageRepairMagic extends HudPageRepair {
    itemKinds = [
        10,
        11,
        12,
    ];




    get action() {
        const response = 'repairMagic';

        return response;
    }
}

export class HudPageSelectCharacter extends BaseComponent {
    args = {
        context: this,
    };
    idPlayer = 'player';
    idCharacterNew = 'character_new';
    idCharacterPlay = 'character_play';



    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }




    addEventListeners(signal) {
        const data = [];
        const elCharacterNew = ds.Helper.getElementsByDataId(this.shadowRoot, this.idCharacterNew);

        elCharacterNew.forEach((el) => {
            const args = {
                el,
                handler: this.addNewCharacter
            };

            data.push(args);
        });

        const elCharacterPlay = ds.Helper.getElementsByDataId(this.shadowRoot, this.idCharacterPlay);

        elCharacterPlay.forEach((el) => {
            const args = {
                el,
                handler: Management.play
            };

            data.push(args);
        });

        data.forEach((index) => {
            ds.Helper.addEventListener({ ...index, context: this, signal });
        });

        const elCharacterDelete = this.shadowRoot.querySelectorAll('[click="delete-character"]');

        elCharacterDelete.forEach((el) => {
            el.addEventListener('click', (event) => event.stopPropagation(), { signal });
        });

        this.addEventListener('delete-character', this.handleDelete.bind(this), { signal });
    }

    addNewCharacter() {
        HTML.elHud.openModalSelectClass();
    }

    draw() {
        const list = this.drawList();
        const response = `${list}`;

        return response;
    }

    drawList() {
        const lengthCharacters = Character.characters.length;
        const lengthSlots = (Data.login?.slots ?? 0) - lengthCharacters;

        let html = this.drawListCharacters();

        if (lengthSlots > 0) html += this.drawListEmptySlots(lengthSlots);

        const response = ds.Modal.drawContent(html);

        return response;
    }

    drawListCharacters() {
        let response = '';

        Character.characters.forEach((character) => {
            const value = character[1];
            const id = value.id;
            const translationDelete = ds.Translation.interfaceDefault.delete;
            const customizations = ds.Helper.buildJSONToHTML(value.customizations);
            const storage = Character.getStorageByCharcaterId(id);
            const equipments = Character.buildEquipments(value.equipments, storage);
            const equipmentsJson = ds.Helper.buildJSONToHTML(equipments);
            const args = {
                position: 'right',
                click: 'delete-character',
                size: 'extra-small',
                sizeIcon: 'extra-small',
                tooltip: translationDelete,
                dataId: id,
                isRounded: false
            };
            const buttonDelete = ds.Button.drawButtonClose(args);

            const attributes = value.attributes;

            const translationPage = ds.Translation.getTranslationPage('attributes');
            const translationLevel = `${translationPage.level}: `;
            const name = attributes.name;
            const level = `${translationLevel} ${ds.Layout.buildSpan(attributes.level)}`;

            const characterClass = Statics.classes[attributes.class].class;
            const translationClass = ds.Translation.buildPlayerClass(characterClass);

            const experience = HudPageAttributes.formatExperience(attributes.experience);
            const translationExperience = `${translationPage.experience}: ${ds.Layout.buildSpan(experience)}`;
            const componentEntity = lo.Components.entity;
            const cssCard = ds.Layout.theme.card;

            response += `
                <button
                    type="button"
                    data-id="${this.idCharacterPlay}"
                    id="${id}"
                    class="ds-row ds-card--horizontal gm-card--horizontal ${cssCard}"
                >
                    <div class="ds-column ds-image">
                        <${componentEntity}
                            class="gm-alive gm-person ds-display-contents"
                            entity="person"
                            direction="down"
                            action="walk"
                            customizations=${customizations}
                            equipments=${equipmentsJson}
                            tabindex="-1"
                        ></${componentEntity}>
                    </div>
                    <div class="ds-column ds-text">
                        <div class="gm-button__delete-character">
                            ${buttonDelete}
                        </div>
                        <span>${ds.Helper.escapeHTML(name)}</span>
                        <small>${translationClass}</small>
                        <small>${level}</small>
                        <small>${translationExperience}</small>
                    </div>
                </button>
             `;
        });

        return response;
    }

    drawListEmptySlots(extraSlots) {
        const translation = ds.Translation.interfaceDefault?.create_new_character;
        const componentButton = ds.Components.componentButton;
        const theme = ds.Layout.theme;
        const buttonTheme = theme.menuSuccess;
        const size = 'regular';
        const button = `
            <${componentButton}
                theme="${buttonTheme}"
                size="${size}"
                label="${translation} (${extraSlots})"
                data-id="${this.idCharacterNew}"
                data-character-id="${this.idPlayer}"
                is-full="true"
            ></${componentButton}>
        `;
        const response = `
            <div
                class="ds-row ds-card ds-card--grey ds-card--horizontal"
                id="${this.idPlayer}"
            >
                <div class="ds-row">
                    ${button}
                </div>
            </div>
        `;

        return response;
    }

    async deleteCharacter(id) {
        const args = { id };
        const data = await FetchData.deleteCharacter(args);

        Analytics.send({
            event_name: 'character_delete',
            character_id: id,
        });

        if (data.characters) this.redraw();
    }

    async handleDelete(event) {
        const title = ds.Translation.interfaceDefault.delete;
        const text = ds.Translation.interfaceDefault.delete_confirm;
        const args = {
            title,
            text,
        };
        const isConfirm = await ds.ConfirmationHandler.open(args);

        if (!isConfirm) return;

        const id = event.detail.context.dataset.id;

        this.deleteCharacter(id);
    }

    redraw() {
        this.render();
        this.rebindListeners();
    }

    render() {
        const component = this.draw();

        ds.Components.render(this.args, component);
    }
}
export class HudPageSelectClass extends HTMLElement {
    args = {
        context: this,
    };
    idPlayer = 'player';
    static selectedClass;



    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.render();
        this.addEventListeners();
    }



    addEventListeners() {
        const data = [];
        const el = this.shadowRoot.querySelectorAll('button');

        el.forEach((el) => {
            const args = {
                el,
                handler: this.handleCustomize
            };
            data.push(args);
        });

        data.forEach((index) => {
            index.context = this;
            ds.Helper.addEventListener(index);
        });

        const componentButton = ds.Components.componentButton;

        ds.Layout.addEventListeners(this, componentButton);
    }

    draw() {
        const list = this.drawList();
        const response = `
            ${list}
        `;

        return response;
    }

    drawList() {
        const characterlist = this.drawListCharacters();
        const content = ds.Modal.drawContent(characterlist);
        const drawFooter = this.drawFooter();
        const footer = ds.Modal.drawFooter(drawFooter);
        const response = `
            ${content}
            ${footer}
        `;

        return response;
    }

    drawListCharacters() {
        let response = '';
        const characters = Object.entries(Statics.classes);

        characters.forEach((character) => {
            const index = character[0];
            const value = character[1];
            const characterClass = value.class;
            const translationClass = ds.Translation.buildPlayerClass(characterClass);
            const translationAttribute = this.drawListCharactersAttribute(characterClass);
            const translationClassText = ds.Translation.buildPlayerClassDescription(characterClass);
            const translationAttributePrimary = ds.Translation.gamePlayer.primary_attribute;
            const customizations = ds.Helper.buildJSONToHTML(value.customizations);
            const equipments = ds.Helper.buildJSONToHTML(value.equipments);
            const cssCard = ds.Layout.theme.card;

            response += `
                <button
                    type="button"
                    class="ds-row ds-card--horizontal gm-card--horizontal ${cssCard}"
                    id="${this.idPlayer}_${index}"
                    data-class="${index}"
                >
                    <div class="ds-column ds-image">
                        <${lo.Components.entity}
                            class="gm-alive gm-person ds-display-contents"
                            entity="person"
                            direction="down"
                            action="walk"
                            customizations=${customizations}
                            equipments=${equipments}
                            tabindex="-1"
                        ></${lo.Components.entity}>
                    </div>
                    <div class="ds-column ds-text">
                        <span>${translationClass}</span>
                        <small>
                            ${translationClassText}
                        </small>
                        <small>
                            ${translationAttributePrimary}:
                            <span>${translationAttribute}</span>
                        </small>
                    </div>
                </button>
             `;
        });

        return response;
    }

    drawListCharactersAttribute(target) {
        const attribute = Object.values(Statics.classes).find(index => index.class === target).attribute;
        const translationPage = ds.Translation.getTranslationPage('attributes');
        const response = translationPage[attribute];

        return response;
    }

    drawFooter() {
        const translationBack = ds.Translation.interfaceDefault?.back;
        const componentButton = ds.Components.componentButton;
        const theme = ds.Layout.theme;
        const buttonTheme = theme.menuDefault;
        const size = theme.menuSize;
        const response = `
            <${componentButton}
                theme="${buttonTheme}"
                size="${size}"
                data-handler="handleBack"
                label="${translationBack}"
            ></${componentButton}>
        `;

        return response;
    }

    handleBack() {
        HTML.elHud.openModalSelectCharacter(false);
    }

    handleCustomize(event) {
        const target = event.currentTarget;
        const selectedClass = Number(target.getAttribute('data-class'));
        const data = Statics.classes[selectedClass];

        HudPageSelectClass.selectedClass = selectedClass;

        CharacterRotation.customizations = { ...data.customizations };
        CharacterRotation.equipments = { ...data.equipments };

        CharacterRotation.equipments.armor = null;
        CharacterRotation.equipments.boot = null;
        CharacterRotation.equipments.face = null;
        CharacterRotation.equipments.gloves = null;
        CharacterRotation.equipments.pants = null;
        CharacterRotation.equipments.shield = null;
        CharacterRotation.equipments.weapon = null;

        HTML.elHud.openModalCustomize();
    }

    render() {
        const component = this.draw();

        ds.Components.render(this.args, component);
    }
}
export class HudPageSelectCustomization extends PageCustomizations {
    idPlayer = 'player';
    idCharacterPlay = 'character_play';
    static idCharacterCustomization = 'character_customization';
    static idCharacterCurrent;
    args = {
        context: this,
    };



    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.render();
        this.addEventListeners();
        this.setFocus();
        this.togglePlayButton();

        setTimeout(() => {
            this.selectFirstCustomizationOptions();
        }, 0);
    }



    addEventListeners() {
        const data = [];
        const elCharacterPlay = ds.Helper.getElementByDataId(this.shadowRoot, this.idCharacterPlay);
        const argsPlay = { el: elCharacterPlay, handler: this.handlePlay };

        data.push(argsPlay);

        data.forEach((index) => {
            index.context = this;
            ds.Helper.addEventListener(index);
        });

        const componentButton = ds.Components.componentButton;

        ds.Layout.addEventListeners(this, componentButton);

        const elCustomization = ds.Helper.getElementByDataId(this.shadowRoot, HudPageSelectCustomization.idCharacterCustomization);

        elCustomization.addEventListener(CharacterCustomization.eventNameChange, () => {
            this.togglePlayButton();
        });

        elCustomization.addEventListener(CharacterCustomization.eventCustomizationChange, () => {
            this.togglePlayButton();
        });

        this.addEventListenersCustomization();
    }

    draw() {
        const content = this.drawContent();
        const footer = this.drawMenu();
        const response = `
            ${ds.Modal.drawContent(content)}
            ${ds.Modal.drawFooter(footer)}
        `;

        return response;
    }

    drawContent() {
        const customizations = CharacterCustomization.getData('apply');
        const componentRotation = Components.characterRotation;
        const componentCustomization = Components.characterCustomization;
        const response = `
            <div class="ds-row gm-character-customizarion">
                <div class="ds-column gm-column--1 ds-card-wrapper ds-center">
                    <${componentRotation}
                        class="gm-character"
                    ></${componentRotation}>
                </div>
                <div class="ds-column gm-column--2">
                    <${componentCustomization}
                        data="${customizations}"
                        data-content="full"
                        data-id="${HudPageSelectCustomization.idCharacterCustomization}"
                    ></${componentCustomization}>
                </div>
            </div>
        `;

        return response;
    }

    drawMenu() {
        const translation = ds.Translation.interfaceDefault;
        const translationBack = translation?.back;
        const translationPlay = translation?.play;
        const componentButton = ds.Components.componentButton;
        const theme = ds.Layout.theme;
        const buttonThemeSuccess = theme.menuSuccess;
        const buttonThemeBack = theme.menuDefault;
        const size = theme.menuSize;
        const response = `
            <${componentButton}
                theme="${buttonThemeBack}"
                size="${size}"
                data-handler="handleBack"
                label="${translationBack}"
            ></${componentButton}>
            <${componentButton}
                theme="${buttonThemeSuccess}"
                size="${size}"
                label="${translationPlay}"
                data-id="${this.idCharacterPlay}"
                ${ds.Prefix.ATTR_IS_DISABLED}="true"
            ></${componentButton}>
        `;

        return response;
    }

    get elButtonPlay() {
        const response = ds.Helper.getElementByDataId(this.shadowRoot, this.idCharacterPlay);

        return response;
    }

    get elCharacterCustomization() {
        const response = ds.Helper.getElementByDataId(this.shadowRoot, HudPageSelectCustomization.idCharacterCustomization);

        return response;
    }

    get name() {
        const response = this.elCharacterCustomization.getFieldNameValue();

        return response;
    }

    handleBack() {
        HTML.elHud.openModalSelectClass();
    }

    async handlePlay() {
        const isValid = this.isFieldNameValid();

        if (!isValid) return;

        const args = {
            name: this.name,
            customizations: PageCustomizations.selectsValue,
            classId: HudPageSelectClass.selectedClass
        };
        const response = await FetchData.createNewCharacter(args);

        if (response.isError) return;

        Analytics.send({
            event_name: 'character_create',
            character_class: HudPageSelectClass.selectedClass,
            character_name: this.name,
        });

        const id = response.custom.id;

        Management.play(id);
    }

    isCustomizationsValid() {
        const selects = this.elCharacterCustomization.shadowRoot.querySelectorAll(ds.Components.componentSelect);

        const response = [...selects].every((select) => select.value !== '');

        return response;
    }

    isFieldNameValid() {
        const value = this.name;
        const response = value.length > 3;

        return response;
    }

    render() {
        const component = this.draw();

        ds.Components.render(this.args, component);
    }

    selectFirstCustomizationOptions() {
        const selects = this.elCharacterCustomization.shadowRoot.querySelectorAll(
            ds.Components.componentSelect
        );

        selects.forEach((select) => {
            const options = JSON.parse(select.getAttribute('options'));
            const firstValue = options?.value?.[0];

            if (firstValue === undefined) return;

            select.setValue(firstValue);
        });
    }

    setFocus() {
        this.elCharacterCustomization.elFieldNameInput.focus();
    }

    togglePlayButton() {
        const isEnabled = this.isFieldNameValid() && this.isCustomizationsValid();

        Layout.toggleButtonDisabled(isEnabled, this.elButtonPlay);
    }
}
export class HudPageSell extends HTMLElement {
    args = {
        context: this,
    };



    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.render();
    }



    draw() {
        const data = Player.inventory;
        const length = data.length;
        const content = length > 0 ? Layout.drawCardItemList(data, false) : Layout.drawEmptyContent();
        const response = HudPageNPC.drawWrapper(content);

        return response;
    }

    get action() {
        const response = ds.Prefix.SELL;

        return response;
    }

    handleOpenDetails(item) {
        const args = {
            id: item,
            context: this,
            npcAction: this.action,
        };

        HudPageDetail.itemId = item.id;

        HudPageNPC.handleOpenDetails(args);
    }

    render() {
        HudPageDetail.npcAction = this.action;

        const component = this.draw();

        ds.Components.render(this.args, component);

        ds.Layout.addEventListeners(this, 'button');
    }
}
export class HudPageSettings extends HTMLElement {
    args = {
        context: this,
    };
    updates = {
        settings: {
            all: true,
        }
    };
    translationPage;
    items = [];



    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        this.translationPage = ds.Translation.getTranslationPage('settings');
        this.items = [
            {
                id: 'music',
                translation: this.translationPage.music
            },
            {
                id: 'effects',
                translation: this.translationPage.sound_effect
            }
        ];

        this.render();
    }



    draw() {
        const page = this.getAttribute('page');
        const sound = this.drawSound();
        const translation = ds.Translation.interface?.default;
        const tabs = this.drawTabs();
        const cssTable = ds.Layout.theme.table;
        const content = `
            <div class="ds-row">
                <table class="${cssTable}">
                    <thead>
                        <tr>
                            ${ds.HTML.drawTH(translation?.detail)}
                            ${ds.HTML.drawTH(translation?.status)}
                            ${ds.HTML.drawTH(translation?.menu)}
                        </tr>
                    </thead>
                    <tbody>
                        ${sound}
                    </tbody>
                </table>
            </div>
            ${tabs}
        `;
        const contentWrapper = ds.Page.drawContent(page, content);
        const response = `
            ${contentWrapper}
        `;

        return response;
    }

    drawButton(props) {
        const {
            icon,
            theme = ds.Components.componentButton,
            tooltip,
            handler,
            handlerProps,
            isDisabled = false
        } = props;
        const componentButton = ds.Components.componentButton;
        const response = `
            <${componentButton}
                icon="${icon}"
                icon-size="extra-small"
                theme="${theme}"
                size="regular"
                data-tooltip="${tooltip}"
                is-proportional="true"
                data-handler="${handler}"
                data-handler-props='${JSON.stringify(handlerProps)}'
                ${isDisabled ? ds.Prefix.ATTR_IS_DISABLED + '="true"' : ''}
            ></${componentButton}>
        `;

        return response;
    }

    drawProgress(target) {
        const data = this.getData(target);
        const value = data.value;
        const valueMax = 1;
        const tooltipaArgs = {
            text: ds.Translation.interfaceDefault?.status,
            value,
            valueMax,
            isPercentage: true
        };
        const tooltip = ds.Layout.buildTextCapacity(tooltipaArgs);
        const componentProgress = ds.Components.componentProgress;
        const response = `
            <${componentProgress}
                data-target="${target}"
                value="${value}"
                value-max="${valueMax}"
                theme="green"
                direction="horizontal"
                data-tooltip="${tooltip}"
                css-wrapper="gm-style"
            ></${componentProgress}>
        `;

        return response;
    }

    drawSound() {
        let response = '';

        this.items.forEach((item) => {
            const id = item.id;
            const translation = item.translation;
            const translationDefault = ds.Translation.interface?.default;
            const progress = this.drawProgress(id);
            const isIncreaseDisabled = Settings.isIncreaseDisabled(id);
            const isDecreaseDisabled = Settings.isDecreaseDisabled(id);
            const theme = ds.Layout.theme.menuDefault;
            const argsDecrease = {
                icon: 'less',
                theme,
                tooltip: translationDefault?.decrease,
                handler: 'handleDecrease',
                handlerProps: [id],
                isDisabled: isDecreaseDisabled
            };
            const buttonDecrease = this.drawButton(argsDecrease);
            const argsIncrease = {
                icon: 'plus',
                theme,
                tooltip: translationDefault?.increase,
                handler: 'handleIncrease',
                handlerProps: [id],
                isDisabled: isIncreaseDisabled
            };
            const buttonIncrease = this.drawButton(argsIncrease);
            const data = this.getData(id);
            const themePlayPause = ds.Layout.theme.menuDefault;
            const argsPlayPause = {
                icon: data.isPlay ? 'pause' : 'play',
                theme: themePlayPause,
                tooltip: data.isPlay ? translationDefault?.pause : translationDefault?.play_music,
                handler: data.isPlay ? 'handlePause' : 'handlePlay',
                handlerProps: [id]
            };
            const buttonPlayPause = this.drawButton(argsPlayPause);
            const menu = `
                <div class="ds-content__menu ds-right" id="menu_${id}">
                    ${buttonDecrease}
                    ${buttonIncrease}
                    ${buttonPlayPause}
                </div>
            `;

            response += `
                <tr>ds-middle
                    ${ds.HTML.drawTD(translation, true)}
                    ${ds.HTML.drawTD(progress, true)}
                    ${ds.HTML.drawTD(menu, true)}
                </tr>
            `;
        });

        return response;
    }

    drawTabs() {
        const componentButton = ds.Components.componentButton;
        const componentSuggestion = ds.Components.componentSuggestion;
        const componentBugReport = ds.Components.componentBugReport;
        const translationSuggestion = ds.Translation.getTranslationPage('suggestion')?.title || '';
        const translationBugReport = ds.Translation.getTranslationPage('bug_report')?.title || '';
        const cssTab = ds.Layout.theme.menuTab;
        const cssForm = ds.Layout.theme.form;
        const buttonTheme = ds.Layout.theme.menuDefault;
        const tabSuggestion = `
            <${componentButton}
                label="${translationSuggestion}"
                theme="${cssTab}"
                size="small"
                css-custom="ds-tab__button"
                data-handler="handleTab"
                data-handler-props='["suggestion"]'
                data-kind="button"
                is-active="true"
            ></${componentButton}>
        `;
        const tabBugReport = `
            <${componentButton}
                label="${translationBugReport}"
                theme="${cssTab}"
                size="small"
                css-custom="ds-tab__button"
                data-handler="handleTab"
                data-handler-props='["bug-report"]'
                data-kind="button"
            ></${componentButton}>
        `;
        const panelSuggestion = `
            <div class="gm-tab__panel" data-tab="suggestion" is-active="true">
                <${componentSuggestion}
                    class="ds-display-contents"
                    theme="game"
                    css-wrapper="gm-style ${cssForm}"
                    button-theme="${buttonTheme}"
                    button-size="small"
                ></${componentSuggestion}>
            </div>
        `;
        const panelBugReport = `
            <div class="gm-tab__panel ds-display-none" data-tab="bug-report">
                <${componentBugReport}
                    class="ds-display-contents"
                    theme="game"
                    css-wrapper="gm-style ${cssForm}"
                    button-theme="${buttonTheme}"
                    button-size="small"
                ></${componentBugReport}>
            </div>
        `;
        const response = `
            <div class="ds-row ds-button-wrapper ds-center ds-tab ds-margin-top--big">
                ${tabSuggestion}
                ${tabBugReport}
            </div>
            <div class="ds-row">
                ${panelSuggestion}
                ${panelBugReport}
            </div>
        `;

        return response;
    }

    getData(target) {
        const response = Data.settings[target];

        return response;
    }

    handleDecrease(target) {
        const args = {
            action: 'decrease',
            target
        };

        this.setValue(args);
        this.updateData();
    }

    handleIncrease(target) {
        const args = {
            action: 'increase',
            target
        };

        this.setValue(args);
        this.updateData();
    }

    handlePause(target) {
        const args = {
            target,
            value: false
        };

        this.setIsPlay(args);
    }

    handlePlay(target) {
        const args = {
            target,
            value: true
        };

        this.setIsPlay(args);
    }

    handleTab(target) {
        const buttons = this.shadowRoot.querySelectorAll(`${ds.Components.componentButton}[data-handler="handleTab"]`);

        buttons.forEach((button) => {
            const props = button.getAttribute('data-handler-props') || '';
            const isActive = props.includes(target);

            button.setAttribute(ds.Layout.attributeActive, isActive ? 'true' : 'false');
        });

        const panels = this.shadowRoot.querySelectorAll('.gm-tab__panel');

        panels.forEach((panel) => {
            const isActive = panel.getAttribute('data-tab') === target;

            if (isActive) {
                panel.classList.remove(ds.Layout.cssDisplay);
            } else {
                panel.classList.add(ds.Layout.cssDisplay);
            }
        });
    }

    render() {
        const component = this.draw();

        ds.Components.render(this.args, component);

        const componentButton = ds.Components.componentButton;

        ds.Layout.addEventListeners(this, componentButton);
    }

    redrawButtons() {
        this.items.forEach(item => {
            const target = item.id;
            const menu = this.shadowRoot.querySelector(`#menu_${target}`);

            if (!menu) return;

            const translationDefault = ds.Translation.interface?.default;
            const data = this.getData(target);
            const argsDecrease = {
                icon: 'less',
                theme: ds.Layout.theme.menuDefault,
                tooltip: translationDefault?.decrease,
                handler: 'handleDecrease',
                handlerProps: [target],
                isDisabled: Settings.isDecreaseDisabled(target)
            };
            const argsIncrease = {
                icon: 'plus',
                theme: ds.Layout.theme.menuDefault,
                tooltip: translationDefault?.increase,
                handler: 'handleIncrease',
                handlerProps: [target],
                isDisabled: Settings.isIncreaseDisabled(target)
            };
            const themePlayPause = ds.Layout.theme.menuDefault;
            const argsPlayPause = {
                icon: data.isPlay ? 'pause' : 'play',
                theme: themePlayPause,
                tooltip: data.isPlay ? translationDefault?.pause : translationDefault?.play_music,
                handler: data.isPlay ? 'handlePause' : 'handlePlay',
                handlerProps: [target]
            };

            const html = `
                ${this.drawButton(argsDecrease)}
                ${this.drawButton(argsIncrease)}
                ${this.drawButton(argsPlayPause)}
            `;

            menu.innerHTML = html;
        });

        const componentButton = ds.Components.componentButton;

        ds.Layout.addEventListeners(this, componentButton, this.shadowRoot);
    }

    redrawProgress() {
        this.items.forEach(item => {
            const target = item.id;
            const data = this.getData(target);
            const value = data.value;
            const valueMax = 1;
            const componentProgress = ds.Components.componentProgress;
            const el = this.shadowRoot.querySelector(`${componentProgress}[data-target="${target}"]`);

            if (!el) return;

            el.setAttribute('value', value);

            const tooltipArgs = {
                text: ds.Translation.interfaceDefault?.status,
                value,
                valueMax,
                isPercentage: true
            };
            const tooltip = ds.Layout.buildTextCapacity(tooltipArgs);

            el.setAttribute('data-tooltip', tooltip);
        });
    }

    setIsPlay(props) {
        Settings.setIsPlay(props);
        this.updates.settings = Data.settings;
        this.redrawButtons();

        Analytics.send({
            event_name: 'settings_change',
            setting_target: props.target,
            setting_value: props.value,
        });
    }

    setValue(props) {
        Settings.setValue(props);
        this.redrawButtons();
    }

    updateData() {
        this.updates.settings = Data.settings;
        this.redrawProgress();
    }
}
export class HudPageStatistics extends HTMLElement {
    args = {
        context: this,
    };



    constructor() {
        super();

        this.attachShadow({ mode: 'open' });

        this.render();
    }



    draw() {
        const translation = ds.Translation.getTranslationPage('statistics');
        const totalEnemiesStatistics = this.totalEnemiesStatistics;
        const subtitle = totalEnemiesStatistics > 1
            ? Layout.drawSubtitle(translation?.total_enemies)
            : '';
        const drawEnemyFields = this.drawEnemyFields();
        const drawSum = this.drawSum(translation);
        const content = `
            ${subtitle}
            ${drawEnemyFields}
            ${drawSum}
        `;
        const response = HudPageAttributes.drawPage(content);

        return response;
    }

    drawEnemyFields() {
        const fields = this.enemyFields;
        const response = this.drawRows(fields, 3);

        return response;
    }

    drawRows(fields, maxPerRow) {
        const rows = [];
        const length = fields.length;

        for (let i = 0; i < length; i += maxPerRow) {
            const fieldsRow = fields.slice(i, i + maxPerRow);
            const html = `
                <div class="ds-row">
                    ${fieldsRow.join('')}
                </div>
            `;

            rows.push(html);
        }

        const response = rows.join('');

        return response;
    }

    drawSum(translation) {
        const statistics = Player.statistics;
        const translationLoot = ds.Translation.gameLoot;

        const totalEnemies = Object.entries(statistics)
            .filter(([key]) => key.startsWith('enemy_'))
            .reduce((total, [, data]) => {
                return total + (data?.value ?? 0);
            }, 0);

        const subtitle = Layout.drawSubtitle(translation?.total);

        const fields = [
            ds.Layout.drawField({
                label: translation?.total_enemies,
                value: totalEnemies,
                isReadOnly: true
            }),
            ds.Layout.drawField({
                label: translation?.deaths,
                value: statistics?.deaths?.value ?? 0,
                isReadOnly: true
            }),
            ds.Layout.drawField({
                label: translation?.total_gold,
                value: statistics?.collect_gold?.value ?? 0,
                isReadOnly: true
            }),
            ds.Layout.drawField({
                label: translation?.total_diamonds,
                value: statistics?.collect_diamond?.value ?? 0,
                isReadOnly: true
            }),
            ds.Layout.drawField({
                label: translationLoot?.plant_bamboo,
                value: statistics?.collect_wood?.value ?? 0,
                isReadOnly: true
            }),
            ds.Layout.drawField({
                label: translationLoot?.plant_fiber,
                value: statistics?.collect_fiber?.value ?? 0,
                isReadOnly: true
            }),
            ds.Layout.drawField({
                label: translationLoot?.limestone,
                value: statistics?.collect_limestone?.value ?? 0,
                isReadOnly: true
            })
        ];

        const response = `
            ${subtitle}
            ${this.drawRows(fields, 2)}
        `;

        return response;
    }

    get enemyFields() {
        const statistics = Player.statistics;
        const translationMonster = ds.Translation.gameMonster;
        const monsters = ds.Modules.monsters;
        const response = [];

        Object.entries(statistics).forEach(([key, data]) => {
            if (!key.startsWith('enemy_')) {
                return;
            }

            const idMonster = Number(key.replace('enemy_', ''));
            const monster = monsters.find((item) => item.id === idMonster);

            if (!monster) {
                return;
            }

            const label = translationMonster?.[monster.translation] ?? monster.translation;
            const args = {
                label,
                value: data.value,
                isReadOnly: true
            };
            
            response.push({
                label,
                field: ds.Layout.drawField(args)
            });
        });

        response.sort((a, b) => {
            return a.label.localeCompare(b.label);
        });

        const responseFields = response.map((item) => {
            return item.field;
        });

        return responseFields;
    }

    get totalEnemiesStatistics() {
        const statistics = Player.statistics;

        const response = Object.keys(statistics)
            .filter((key) => {
                return key.startsWith('enemy_');
            })
            .length;

        return response;
    }

    render() {
        const component = this.draw();

        ds.Components.render(this.args, component);
    }

    updateData() {
        this.render();
    }
}
export class HudPageStore extends HTMLElement {
    args = {
        context: this,
    };
    packages = [];
    slotPackages = [];
    paymentMethod = '';
    paymentMethodDefault = '';
    paymentMethods = [];
    selectedPackage;
    transaction;
    transactionStatus = '';



    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
        this.updateData();
    }



    addEventListeners() {
        ds.Layout.addEventListeners(this, ds.Components.componentButton);
    }

    buildDefaultPaymentMethod() {
        const methods = this.paymentMethods.map((method) => method.method);
        const isDefaultAvailable = methods.includes(this.paymentMethodDefault);

        if (isDefaultAvailable) return this.paymentMethodDefault;

        const response = methods?.[0] || '';

        return response;
    }

    async createTransaction(packageId, paymentWindow) {
        const response = await FetchData.createStoreTransaction({
            packageId,
            paymentMethod: this.paymentMethod,
        });

        if (response?.isError) {
            paymentWindow?.close();
            return;
        }

        this.transaction = response.transaction;
        this.transactionStatus = this.transaction.status;

        this.render();

        const paymentUrl = this.transaction.payment?.paymentUrl;

        if (paymentUrl) {
            if (paymentWindow) {
                paymentWindow.opener = null;
                paymentWindow.location.href = paymentUrl;
            } else {
                window.open(paymentUrl, '_blank', 'noopener');
            }
        } else {
            paymentWindow?.close();
        }
    }

    draw() {
        const subtitle = Layout.drawSubtitle(this.translation.packages);
        const subtitleSlot = Layout.drawSubtitle(this.translation.slotTitle);
        const packages = this.drawPackages();
        const slotPackages = this.drawSlotPackages();
        const freeDiamonds = this.drawFreeDiamonds();
        const content = `
            ${subtitle}
            ${packages}
            <div class="ds-row">
                ${subtitleSlot}
            </div>
            <div class="ds-row ds-margin-bottom--big">
                ${slotPackages}
            </div>
            <div class="ds-row">
                ${freeDiamonds}
            </div>
        `;
        const response = HudPageAttributes.drawPage(content);

        return response;
    }

    drawFreeDiamonds() {
        const componentButton = ds.Components.componentButton;
        const titleAdvertising = Layout.drawSubtitle(this.translation.titleAdvertising);
        const theme = ds.Layout.theme;
        const themeButton = theme.menuDefault;
        const themeSize = theme.menuSize;
        const response = `
            <div class="ds-row">
                <${Components.cHudReferral}
                    css-wrapper="gm-style"
                    class="ds-full-width"
                ></${Components.cHudReferral}>
            </div>
            <div class="ds-row">
                ${titleAdvertising}
            </div>
            <div class="ds-row">
                <div class="ds-column ds-column--full">
                    <p>${Layout.replaceInText(this.translation.freeDiamondsText)}</p>
                </div>
                <${componentButton}
                    label="${this.translation.earn}"
                    size="${themeSize}"
                    theme="${themeButton}"
                    page-target="advertising"
                    page-position="right"
                    click="open-hud-page"
                    data-kind="button"
                ></${componentButton}>
            </div>
        `;

        return response;
    }

    formatPrice(value) {
        return this.formatValue(this.translation.price, value);
    }

    formatQuantity(value) {
        return this.formatValue(this.translation.quantity, value);
    }

    formatValue(label, value) {
        return `<small>${label}: <span class="gm-price">${value}</span></small>`;
    }

    drawCard({ icon, label, price, buttonLabel, buttonProps }) {
        const componentButton = ds.Components.componentButton;
        const css = ds.Layout.theme.menuSuccess;
        const button = `
            <${componentButton}
                label="${buttonLabel}"
                size="small"
                theme="${css}"
                data-handler="handleBuy"
                data-handler-props='["${buttonProps}"]'
                data-kind="button"
            ></${componentButton}>
        `;
        const cssCard = ds.Layout.theme.card;
        const response = `
            <div class="ds-column ${cssCard} ds-card--regular">
                <div class="ds-card__header">
                </div>
                <div class="ds-card__body ds-row ds-center">
                    <div class="ds-row ds-center">
                        <div class="ds-padding--regular">
                            ${icon}
                        </div>
                    </div>
                    <div class="ds-row ds-center">
                        ${label}
                    </div>
                    <div class="ds-row ds-center">
                        <p class="ds-truncate">${price}</p>
                    </div>
                </div>
                <div class="ds-card__footer ds-row ds-center">
                    ${button}
                </div>
            </div>
        `;

        return response;
    }

    drawPackage(packageData) {
        const idDiamond = Statics.idItems.diamond;
        const iconArgs = { item: idDiamond, isDurability: false };
        const icon = lo.HTML.drawLoot(iconArgs);
        const price = ds.Layout.buildCurrencyText({
            language: gbLanguage,
            value: packageData.price,
        });
        const response = this.drawCard({
            icon,
            label: this.formatQuantity(packageData.diamonds),
            price: this.formatPrice(price),
            buttonLabel: this.translation.buy,
            buttonProps: packageData.id,
        });

        return response;
    }

    drawPackages() {
        if (!this.packages.length) return Layout.drawEmptyContent();

        const cards = this.packages.map((packageData) => {
            return this.drawPackage(packageData);
        }).join('');
        const response = `
            <div class="ds-row ds-center ds-card-wrapper">
                ${cards}
            </div>
        `;

        return response;
    }

    drawSlotPackage(packageData) {
        const characterIcon = `
            <div class="ds-center">
                <${lo.Components.entity}
                    entity="person"
                    direction="down"
                    action="walk"
                    tabindex="-1"
                ></${lo.Components.entity}>
            </div>
        `;
        const price = ds.Layout.buildCurrencyText({
            language: gbLanguage,
            value: packageData.price,
        });
        const slotLabel = this.translation['slot_' + packageData.slots] || packageData.slots;
        const response = this.drawCard({
            icon: characterIcon,
            label: this.formatQuantity(slotLabel),
            price: this.formatPrice(price),
            buttonLabel: this.translation.buy,
            buttonProps: packageData.id,
        });

        return response;
    }

    drawSlotPackages() {
        if (!this.slotPackages.length) return Layout.drawEmptyContent();

        const cards = this.slotPackages.map((packageData) => {
            return this.drawSlotPackage(packageData);
        }).join('');
        const response = `
            <div class="ds-row ds-center ds-card-wrapper">
                ${cards}
            </div>
        `;

        return response;
    }

    get page() {
        const response = this.getRootNode()?.host;

        return response;
    }

    get translation() {
        const translation = ds.Translation.getTranslationPage('store');
        const translationAdvertising = ds.Translation.getTranslationPage('advertising');
        const translationDefault = ds.Translation?.interfaceDefault;
        const fallback = {
            title: translation.title,
            titleFree: translationAdvertising.title,
            titleAdvertising: translation.advertising_title,
            descriptionFree: translationAdvertising.description,
            packages: translation.packages,
            slotTitle: translation.slot_title,
            slot_1: translation.slot_1,
            slot_3: translation.slot_3,
            slot_5: translation.slot_5,
            diamonds: ds.Translation.gameLoot.diamond,
            freeDiamondsText: translationAdvertising.description,
            buy: translationDefault.buy,
            earn: translationDefault.earn,
            price: ds.Translation.getTranslationPage('detail').price,
            quantity: translationDefault.amount,
        };
        const page = ds.Translation?.getTranslationPage('store');
        const response = { ...fallback, ...page };

        return response;
    }

    handleBuy(packageId) {
        this.selectedPackage = packageId;
        this.paymentMethod = this.buildDefaultPaymentMethod();

        const paymentWindow = window.open('', '_blank');
        this.createTransaction(packageId, paymentWindow);
    }

    handleCheckStatus() {
        const transaction = this.transaction;

        if (!transaction) return;

        FetchData.getStoreTransactionStatus({
            transactionId: transaction.transactionId,
            paymentMethod: transaction.paymentMethod,
        })
            .then((response) => {
                if (response?.isError) return;

                this.transactionStatus = response.transactionStatus.status;

                this.render();
            });
    }

    render() {
        const component = this.draw();

        ds.Components.render(this.args, component);

        this.addEventListeners();
    }

    setPageTexts() {
        const page = this.page;

        if (page?.setTitle) page.setTitle(this.translation.title);
        if (page?.setText) page.setText(this.translation.description || '');
    }
    async updateData() {
        const responses = await Promise.all([
            FetchData.getStorePackages(),
            FetchData.getStorePaymentMethods(),
            FetchData.getSlotPackages(),
        ]);
        const packagesData = responses[0];
        const methodsData = responses[1];
        const slotData = responses[2];

        if (packagesData?.isError || methodsData?.isError) return;

        this.packages = packagesData.packages;
        this.paymentMethods = methodsData.paymentMethods;
        this.paymentMethodDefault = methodsData.paymentMethodDefault;
        this.paymentMethod = this.buildDefaultPaymentMethod();

        if (!slotData?.isError) {
            this.slotPackages = slotData.packages;
        }

        this.setPageTexts();
        this.render();
    }
}

export class HudPageStory extends HTMLElement {
    args = {
        context: this,
    };
    static act;
    static scene;



    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.render();
        this.addEventListeners();
    }



    addEventListeners() {
        const componentButton = ds.Components.componentButton;

        ds.Layout.addEventListeners(this, componentButton);
    }

    draw() {
        const translation = ds.Translation.gameStory;
        const text = this.drawScene(translation);
        const contentHTML = `
            <div class="ds-column">
                ${text}
            </div>
        `;
        const content = ds.Modal.drawContent(contentHTML);
        const drawFooter = this.drawFooter();
        const footer = ds.Modal.drawFooter(drawFooter);
        const response = `
            ${content}
            ${footer}
        `;

        return response;
    }

    drawScene(translation) {
        const prefix = `act_${HudPageStory.act}_scene_${HudPageStory.scene}_text_`;
        let response = '';
        let i = 1;

        while (translation[`${prefix}${i}`]) {
            response += `<p>${translation[`${prefix}${i}`]}</p>`;
            i++;
        }

        return response;
    }

    drawFooter() {
        const translationBack = ds.Translation.interfaceDefault?.continue;
        const componentButton = ds.Components.componentButton;
        const theme = ds.Layout.theme;
        const themeButton = theme.menuDefault;
        const themeSize = theme.menuSize;

        const response = `
            <${componentButton}
                theme="${themeButton}"
                size="${themeSize}"
                data-handler="handleContinue"
                label="${translationBack}"
            ></${componentButton}>
        `;

        return response;
    }

    async handleContinue() {
        const args = {
            idCharacter: Player.id,
            act: HudPageStory.act,
            scene: HudPageStory.scene,
        };

        await FetchData.setCharacterStory(args);

        HTML.elHud.closeModalWithoutButton();
    }

    render() {
        HudPageDetail.npcAction = this.action;

        const component = this.draw();

        ds.Components.render(this.args, component);
    }
}
export class HudPageUser extends HTMLElement {
    args = {
        context: this,
    };
    static idUsername = 'username';
    static idEmail = 'email';
    static idPassword = 'password';
    static idNewsletter = 'newsletter';



    constructor() {
        super();

        this.attachShadow({ mode: 'open' });

        this.render();
    }



    addEventListeners() {
        const componentButton = ds.Components.componentButton;

        ds.Layout.addEventListeners(this, componentButton);

        const elNewsletter = this.shadowRoot.getElementById(HudPageUser.idNewsletter);

        if (elNewsletter) {
            elNewsletter.addEventListener('change', (event) => this.handleNewsletter(event));
        }
    }

    draw() {
        const translation = this.translation;
        const data = Data.login;
        const css = 'ds-form__field--no-margin';
        const fieldUsername = ds.Layout.drawField({
            label: translation.username,
            value: data.username,
            isReadOnly: true,
            css
        });
        const fieldEmail = ds.Layout.drawField({
            label: translation.email,
            value: data.email,
            isReadOnly: true,
            css
        });
        const fieldPassword = ds.Layout.drawField({
            label: translation.password,
            value: '******',
            isReadOnly: true,
            css
        });
        const fieldNewsletter = this.drawNewsletter();
        const buttonEditUsername = this.drawButton(HudPageUser.idUsername);
        const buttonEditEmail = this.drawButton(HudPageUser.idEmail);
        const buttonEditPassword = this.drawButton(HudPageUser.idPassword);
        const buttonDeleteAccount = Layout.drawButtonComponent(Statics.buttons.deleteAccount);
        const translationPageSettings = ds.Translation.interface?.page_setting;
        const theme = ds.Layout.theme;
        const themeButton = theme.menuDefault;
        const themeSize = theme.menuSize;
        const content = `
            <div class="ds-row">
                ${fieldUsername}
                ${buttonEditUsername}
            </div>
            <div class="ds-row">
                ${fieldEmail}
                ${buttonEditEmail}
            </div>
            <div class="ds-row">
                ${fieldPassword}
                ${buttonEditPassword}
            </div>
            <div class="ds-row">
                ${fieldNewsletter}
            </div>
            <div class="ds-row ds-right ds-button-wrapper">
                <${this.componentButton}
                    theme="${themeButton}"
                    size="${themeSize}"
                    label="${translationPageSettings?.change_character}"
                    data-handler='handleSelectCharacter'
                ></${this.componentButton}>
                    <${this.componentButton}
                    theme="${themeButton}"
                    size="${themeSize}"
                    label="${translationPageSettings?.logout}"
                    data-handler='handleLogOut'
                ></${this.componentButton}>
                ${buttonDeleteAccount}
            </div>
        `;
        const response = HudPageAttributes.drawPage(content);

        return response;
    }

    get componentButton() {
        const response = ds.Components.componentButton;

        return response;
    }

    drawNewsletter() {
        const label = this.translation.sign_up_accept_newsletter;
        const isChecked = Data.login?.newsletter ? 'checked' : '';
        const formCss = ds.Layout.theme.form;
        const response = `
            <div class="ds-form__field ${formCss}">
                <div class="ds-form__option">
                    <input id="${HudPageUser.idNewsletter}" type="checkbox" ${isChecked}>
                    <label for="${HudPageUser.idNewsletter}" class="ds-checkbox-label ds-font--extra-small">${label}</label>
                </div>
            </div>
        `;

        return response;
    }
    get translation() {
        const response = ds.Translation.loginDefault;

        return response;
    }

    drawButton(id) {
        const argsHandler = { id };
        const handlerProps = `[${ds.Helper.buildJSONToHTML(argsHandler)}]`;
        const response = `
            <${this.componentButton}
                id="${id}"
                size="extra-small"
                is-proportional="true"
                css-custom="ds-button--over gm-button--over"
                data-kind="button"
                theme="transparent"
                icon="edit"
                icon-theme="black"
                icon-size="big"
                data-handler="handleEdit"
                data-handler-props='${handlerProps}'
            ></${this.componentButton}>
        `;

        return response;
    }

    handleDeleteAccount() {
        HTML.elHud.openModalUserDeleteAccount();
    }

    handleEdit(target) {
        const id = target.id;

        HudPageUserEdit.content = id;
        HTML.elHud.openModalUserEdit(id);
    }

    handleNewsletter(event) {
        const isChecked = event.target.checked;

        FetchData.setNewsletter({ newsletter: isChecked ? 1 : 0 });
    }

    async handleLogOut() {
        const response = await FetchData.logOut();

        if (response) window.location.reload();
    }

    handleSelectCharacter() {
        HTML.elHud.openModalSelectCharacter();
    }

    render() {
        const component = this.draw();

        ds.Components.render(this.args, component);

        this.addEventListeners();
    }
}
export class HudPageUserDeleteAccount extends HTMLElement {
    args = {
        context: this,
    };
    static idPassword = 'password_delete';



    constructor() {
        super();

        this.attachShadow({ mode: 'open' });

        this.render();
    }



    addEventListeners() {
        const componentButton = ds.Components.componentButton;

        ds.Layout.addEventListeners(this, componentButton);
        this.addFieldEventListeners();
    }

    draw() {
        const translation = this.translationInterface;
        const text = translation.confirm_action;
        const paragraph = Layout.replaceInText(text);
        const fieldPassword = this.drawField();
        const buttonContinue = this.drawButtonContinue();
        const buttonCancel = this.drawButtonCancel();
        const response = `
            <div class="ds-row ds-page__text ds-modal-text">
                <p>${paragraph}</p>
            </div>
            ${fieldPassword}
            <div class="ds-row ds-right ds-button-wrapper">
                ${buttonCancel}
                ${buttonContinue}
            </div>
        `;

        return response;
    }

    drawButtonCancel() {
        const response = Layout.drawButtonComponent(Statics.buttons.cancel);

        return response;
    }

    drawButtonContinue() {
        const button = Layout.changeThemeButton('continue');

        button.isDisabled = true;

        const response = Layout.drawButtonComponent(button);

        return response;
    }

    drawField() {
        const args = {
            id: HudPageUserDeleteAccount.idPassword,
            css: 'ds-row',
            label: this.translationLogin.password,
            value: '',
            isReadOnly: false,
            type: 'password'
        };
        const field = ds.Layout.drawField(args);
        const response = `
            <div class="ds-row">
                ${field}
            </div>
        `;

        return response;
    }

    async handleCancel() {
        HTML.elHud.closeModal();
    }

    async handleContinue() {
        const password = this.getInputValueByTarget(this.elPassword);

        this.toggleButtonDisabled(false);

        const response = await FetchData.deleteAccount({ password });

        if (response.isError) {
            this.notifyError();
            this.toggleButtonDisabled(true);
        } else {
            window.location.reload();
        }
    }

    notify(content, color = Notification.colorDefault) {
        const argsNotification = {
            content,
            color
        };

        Notification.add(argsNotification);
    }

    notifyError() {
        const translation = this.translationLogin.password_incorrect;

        this.notify(translation, Notification.colorError);
    }

    getInputValueByTarget(target) {
        const response = ds.FormField.getInputValueByTarget(target);

        return response;
    }

    get isEnabled() {
        const response = ds.Validation.validatePassword(this.elPassword);

        return response;
    }

    get translationInterface() {
        const response = ds.Translation.interfaceDefault;

        return response;
    }

    get translationLogin() {
        const response = ds.Translation.loginDefault;

        return response;
    }

    render() {
        const component = this.draw();

        ds.Components.render(this.args, component);

        this.addEventListeners();
        this.updateButtonState();
    }




    addFieldEventListeners() {
        const field = this.elPassword;

        field?.addEventListener('input', () => this.updateButtonState());
    }

    get elButton() {
        const response = this.shadowRoot.querySelectorAll(ds.Components.componentButton);

        return response;
    }

    get elPassword() {
        const response = this.getElById(HudPageUserDeleteAccount.idPassword);

        return response;
    }

    getElById(id) {
        const response = this.shadowRoot.getElementById(id);

        return response;
    }

    toggleButtonDisabled(isEnabled) {
        const buttons = this.elButton;

        if (!buttons) return;

        buttons.forEach((button) => {
            if (!button) return;

            if (isEnabled) {
                button.removeAttribute(ds.Prefix.ATTR_IS_DISABLED);
            } else {
                button.setAttribute(ds.Prefix.ATTR_IS_DISABLED, 'true');
            }
        });
    }

    updateButtonState() {
        const isEnabled = this.isEnabled;

        const buttons = this.elButton;

        if (!buttons) return;

        buttons.forEach((button) => {
            if (!button) return;

            const isContinue = button.getAttribute('data-handler') === 'handleContinue';

            if (isContinue) {
                if (isEnabled) {
                    button.removeAttribute(ds.Prefix.ATTR_IS_DISABLED);
                } else {
                    button.setAttribute(ds.Prefix.ATTR_IS_DISABLED, 'true');
                }
            }
        });
    }
}

export class HudPageUserEdit extends HTMLElement {
    args = {
        context: this,
    };
    static content;
    static idEmail = 'email';
    static idUsername = 'username_visible';
    static idpassword = 'password_old';
    static idPasswordNew = 'password_new';
    static idPasswordConfirm = 'password_confirm';
    static idPasswordComponent = 'password_reset';


    constructor() {
        super();

        this.attachShadow({ mode: 'open' });

        this.render();
    }



    addEventListeners() {
        const componentButton = ds.Components.componentButton;

        ds.Layout.addEventListeners(this, componentButton);
        this.addFieldEventListeners();
        this.addComponentListeners();
    }

    get argsEmail() {
        const response = {
            email: this.getInputValueByTarget(this.elEmail),
            password: this.getInputValueByTarget(this.getElById('password')),
        };

        return response;
    }

    get argsUsername() {
        const response = {
            username: this.getInputValueByTarget(this.elUsername),
            password: this.getInputValueByTarget(this.elPasswordConfirm),
        };

        return response;
    }

    addComponentListeners() {
        if (this.capitalizedContent !== 'Password') return;

        const component = this.getElById(HudPageUserEdit.idPasswordComponent);

        if (component) {
            component.addEventListener('passwordResetSubmit', (event) => this.handlePasswordSubmit(event));
        }
    }

    async handlePasswordSubmit(event) {
        const { currentPassword, password } = event.detail;
        const args = {
            password: currentPassword,
            passwordNew: password
        };
        const response = await FetchData.setPassword(args);

        if (response.isError) {
            this.notifyChangedErrorPassword();
        } else {
            this.notifyChangedPassword();
        }
    }

    get capitalizedContent() {
        const response = ds.Helper.capitalizeString(HudPageUserEdit.content);

        return response;
    }

    draw() {
        const capitalizeContent = this.capitalizedContent;
        const content = this[`draw${capitalizeContent}`]();
        const button = this.isSelfButton ? this.drawButton() : '';
        const response = `
            ${content}
            <div class="ds-row ds-right">
                ${button}
            </div>
        `;

        return response;
    }

    get isSelfButton() {
        const response = this.capitalizedContent !== 'Password';

        return response;
    }

    drawButton() {
        const button = Statics.buttons.continue;

        button.isDisabled = true;

        const response = Layout.drawButtonComponent(button);

        return response;
    }

    drawEmail() {
        const fieldEmail = this.drawField({ translation: HudPageUserEdit.idEmail });
        const fieldPassword = this.drawField({ translation: 'password', type: 'password' });
        const response = `
            ${fieldEmail}
            ${fieldPassword}
        `;

        return response;
    }

    drawField(props) {
        const args = {
            id: props.translation,
            css: 'ds-row',
            label: this.translation[props.translation],
            value: '',
            isReadOnly: false,
            type: props.type || 'text',
            rule: props.rule,
            hint: props.hint,
            iconTheme: ds.Layout.theme.menuDefaultIcon,
        };

        const field = ds.Layout.drawField(args);
        const response = `
            <div class="ds-row">
                ${field}
            </div>
        `;

        return response;
    }

    drawPassword() {
        const response = `
            <${ds.Components.componentPasswordReset}
                id="${HudPageUserEdit.idPasswordComponent}"
                mode="session"
            ></${ds.Components.componentPasswordReset}>
        `;

        return response;
    }

    drawText(text) {
        const paragrath = Layout.replaceInText(text);
        const response = `
            <div class="ds-row ds-page__text ds-modal-text">
                <p>${paragrath}</p>
            </div>
        `;

        return response;
    }

    drawUsername() {
        const cost = Data.rules.user.username.cost;
        const payWith = Data.rules.user.username.pay_with;
        const costText = Layout.drawTextItemQuantity(payWith, cost);
        const text = `${this.translation.username_change} ${costText}`;
        const paragraph = this.drawText(text);
        const fieldOld = this.drawField({ translation: HudPageUserEdit.idUsername, type: 'text' });
        const fieldPassword = this.drawField({ translation: HudPageUserEdit.idPasswordConfirm, type: 'password' });
        const response = `
            ${paragraph}
            ${fieldOld}
            ${fieldPassword}
        `;

        return response;
    }

    async handleContinue() {
        const capitalizeContent = this.capitalizedContent;
        const args = this[`args${capitalizeContent}`];

        this.toggleButtonDisabled(false);

        const response = await FetchData[`set${capitalizeContent}`](args);

        if (response.isError) {
            this[`notifyChangedError${capitalizeContent}`]();
        } else {
            this[`notifyChanged${capitalizeContent}`]();
        }
    }

    notify(content, color = Notification.colorDefault) {
        const argsNotification = {
            content,
            color
        };

        Notification.add(argsNotification);
    }

    notifyChangedEmail() {
        const translation = this.translation.email_sent;

        this.notify(translation);
    }

    notifyChangedPassword() {
        const translation = this.translation.password_changed;

        this.notify(translation);
    }

    notifyChangedUsername() {
        const translation = this.translation.username_changed;

        this.notify(translation);
    }

    notifyChangedErrorEmail() {
        const translation = this.translation.email_error;

        this.notify(translation, Notification.colorError);
    }

    notifyChangedErrorPassword() {
        const translation = this.translation.password_error;

        this.notify(translation, Notification.colorError);
    }

    notifyChangedErrorUsername() {
        const translation = this.translation.username_error;

        this.notify(translation, Notification.colorError);
    }

    getInputValueByTarget(target) {
        const response = ds.FormField.getInputValueByTarget(target);

        return response;
    }

    get isEnabledEmail() {
        const isEmailValid = ds.Validation.validateEmail(this.elEmail);
        const isPasswordValid = ds.Validation.validatePassword(this.getElById('password'));
        const response = isEmailValid && isPasswordValid;

        return response;
    }

    get isEnabledUsername() {
        const diamondsInInventory = Player.inventoryDiamonds;
        const diamondsRequired = Data.rules.user.username.cost;
        const isUsernameValid = ds.Validation.validateUsername(this.elUsername);
        const isPasswordValid = ds.Validation.validatePassword(this.elPasswordConfirm);
        const response = isUsernameValid && isPasswordValid && diamondsInInventory >= diamondsRequired;

        return response;
    }

    render() {
        const component = this.draw();

        ds.Components.render(this.args, component);

        this.addEventListeners();
        this.updateButtonState();
    }

    get translation() {
        const response = ds.Translation.loginDefault;

        return response;
    }




    addFieldEventListeners() {
        const capitalizeContent = this.capitalizedContent;
        const fields = this.fieldsByContent[capitalizeContent];

        fields.forEach((field) => {
            field?.addEventListener('input', () => this.updateButtonState());
        });
    }

    get elButton() {
        const response = this.shadowRoot.querySelector(ds.Components.componentButton);

        return response;
    }

    get elEmail() {
        const response = this.getElById(HudPageUserEdit.idEmail);

        return response;
    }

    get elPasswordConfirm() {
        const response = this.getElById(HudPageUserEdit.idPasswordConfirm);

        return response;
    }

    get elUsername() {
        const response = this.getElById(HudPageUserEdit.idUsername);

        return response;
    }

    get fieldsByContent() {
        const response = {
            Email: [this.elEmail, this.getElById('password')],
            Password: [],
            Username: [this.elUsername, this.elPasswordConfirm],
        };

        return response;
    }

    getElById(id) {
        const response = this.shadowRoot.getElementById(id);

        return response;
    }

    toggleButtonDisabled(isEnabled) {
        const button = this.elButton;

        if (!button) return;

        if (isEnabled) {
            button.removeAttribute(ds.Prefix.ATTR_IS_DISABLED);
        } else {
            button.setAttribute(ds.Prefix.ATTR_IS_DISABLED, 'true');
        }
    }

    updateButtonState() {
        const capitalizeContent = this.capitalizedContent;
        const isEnabled = this[`isEnabled${capitalizeContent}`];

        this.toggleButtonDisabled(isEnabled);
    }
}
export class HudPageWithdraw extends HTMLElement {
    args = {
        context: this,
    };



    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.render();
    }



    draw() {
        const data = Player.bankStorage;
        const length = data.length;
        const content = length > 0 ? Layout.drawCardItemList(data) : Layout.drawEmptyContent();
        const response = HudPageNPC.drawWrapper(content);

        return response;
    }

    get action() {
        const response = ds.Prefix.WITHDRAW;

        return response;
    }

    handleOpenDetails(id) {
        const args = {
            id,
            context: this,
            npcAction: this.action,
        };

        HudPageDetail.itemId = id.id;

        HudPageNPC.handleOpenDetails(args);
    }

    async render() {
        const isValid = NPCs.validateBankLevel();

        if (!isValid) return;

        HudPageDetail.npcAction = this.action;

        await FetchData.openBank();

        const component = await this.draw();

        ds.Components.render(this.args, component);

        ds.Layout.addEventListeners(this, 'button');
    }
}
export class HudReferral extends HTMLElement {
    args = {
        context: this,
    };
    static idReferral = 'referral';



    constructor() {
        super();

        this.attachShadow({ mode: 'open' });

        this.render();
    }



    addEventListeners() {
        const componentButton = ds.Components.componentButton;

        ds.Layout.addEventListeners(this, componentButton);
    }

    draw() {
        const subtitle = Layout.drawSubtitle(this.translation.title);
        const description = Layout.replaceInText(this.translation.description);
        const field = ds.Layout.drawField({
            label: this.translation.link,
            value: this.referralLink,
            isReadOnly: true
        });
        const button = Layout.drawButtonComponent({
            id: HudReferral.idReferral,
            label: this.translation.copy,
            handler: 'handleCopyLink',
            handlerProps: '[]',
            theme: ds.Layout.theme.menuDefault
        });
        const content = `
            <div class="ds-row">
                ${subtitle}
            </div>
            <div class="ds-row">
                <p class="ds-paragrath">${description}</p>
            </div>
            <div class="ds-row">
                <div class="ds-column ds-column--full">
                    ${field}
                </div>
                <div class="ds-column ds-center ds-column__button">
                    ${button}
                </div>
            </div>
        `;

        return content;
    }

    async handleCopyLink() {
        try {
            await navigator.clipboard.writeText(this.referralLink);
        } catch {
            return;
        }

        Notification.add({
            content: this.translation.copied,
        });
    }

    render() {
        const component = this.draw();

        ds.Components.render(this.args, component);

        this.addEventListeners();
    }

    get referralLink() {
        const response = `${gbUrls.project}login/?ref=${Data.login.id}`;

        return response;
    }

    get translation() {
        const response = ds.Translation.getTranslationPage('referral');

        return response;
    }
}
export class HudStatus extends HTMLElement {
    args = {
        context: this,
    };
    progress;
    updates = {
        player: {
            attributes: {},
            statistics: {}
        }
    };
    tooltipActionPoints;



    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.initializeData();
        this.render();
    }



    draw() {
        const actionPoints = this.updates.player.attributes.actionPoints ?? 0;
        const componentAction = Components.cHudActionPoints;
        let response = `
            <div class="ds-row">
                <div class="ds-column gm-status-center">
                    <${componentAction}
                        data-action-points="${actionPoints}"
                        data-tooltip=""
                    >
                    </${componentAction}>
                </div>
                <div class="ds-column gm-status-center">
        `;

        this.progress.forEach((index) => {
            const componentProgress = ds.Components.componentProgress;

            response += `
                <${componentProgress}
                    id="${index.id}"
                    value="${index.value}"
                    value-max="${index.valueMax}"
                    theme="${index.theme}"
                    direction="horizontal"
                    data-tooltip="${index.tooltip}"
                    css-wrapper="gm-style"
                ></${componentProgress}>
            `;
        });

        response += `
                </div>
            </div>
        `;

        return response;
    }

    initializeData() {
        this.updates.player.attributes = Data.player.attributes;
        this.rebuildData();
        this.translate();
    }

    rebuildData() {
        const translationPage = ds.Translation.getTranslationPage('attributes');
        const data = this.updates.player.attributes;
        this.progress = [
            {
                id: HTML.idHudProgressLife,
                theme: 'red',
                value: data.hitPoints,
                valueMax: data.hitPointsMaximum,
                text: translationPage?.life
            },
            {
                id: HTML.idHudProgressMana,
                theme: 'blue',
                value: data.manaPoints,
                valueMax: data.manaPointsMaximum,
                text: translationPage?.mana
            },
            {
                id: HTML.idHudProgressExperience,
                theme: 'yellow',
                valueTooltip: data.experience,
                valueTooltipMax: data.experienceNext,
                value: data.experience - data.experienceCurrent,
                valueMax: data.experienceNext - data.experienceCurrent,
                text: translationPage?.experience
            },
        ];

        if (!this.tooltipActionPoints) {
            const tooltip = ds.Translation.interfaceDefault?.action_points;
            const componentAction = Components.cHudActionPoints;

            this.tooltipActionPoints = tooltip;
            this.shadowRoot.querySelector(componentAction)?.setAttribute('data-tooltip', `${tooltip}`);
        }
    }

    render() {
        const component = this.draw();

        ds.Components.render(this.args, component);
    }

    translate() {
        this.progress.forEach((index) => {
            const { text, value, valueMax, valueTooltip, valueTooltipMax } = index;
            const isExperience = index.id === HTML.idHudProgressExperience;

            const tooltipArgs = {
                text,
                value: isExperience ? valueTooltip : value,
                valueMax: isExperience ? valueTooltipMax : valueMax,
                isPercentage: false
            };

            const tooltipArgs2 = {
                value,
                valueMax,
                isPercentage: true
            };

            const tooltip = ds.Layout.buildTextCapacity(tooltipArgs);
            const tooltip2 = ds.Layout.buildTextCapacity(tooltipArgs2);

            index.tooltip = `${tooltip} - ${tooltip2}`;
        });
    }

    updateActionPoints(actionPoints) {
        const componentAction = Components.cHudActionPoints;
        const el = this.shadowRoot.querySelector(componentAction);

        if (el) el.setAttribute('data-action-points', actionPoints);
    }

    updateData() {
        this.updates.player.attributes = Data.player.attributes;
        this.rebuildData();
        this.translate();

        this.progress.forEach((progressData) => {
            const el = this.shadowRoot.getElementById(progressData.id);

            if (el) {
                el.setAttribute('value', progressData.value);
                el.setAttribute('value-max', progressData.valueMax);
                el.setAttribute('data-tooltip', progressData.tooltip);
            }
        });

        const actionPoints = this.updates.player.attributes.actionPoints ?? 0;

        this.updateActionPoints(actionPoints);
    }
}
export class HudTransition extends HTMLElement {
    args = {
        context: this,
    };
    idMain = 'main';
    idContent = 'content';
    idVersion = 'version';
    idLoading = 'loading';
    isInitial = true;
    timeout = 500;
    timeout2 = this.timeout * 2;
    timeout3 = this.timeout * 3;
    timeoutHalf = this.timeout / 2;
    timeClose = 0;
    title = '';
    subtitle = '';
    loot;
    static tipPool = [];



    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.updateAttributes();
        this.render();
        this.updateHTML();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue === newValue) return;
        this.changeAttributes();
    }

    static get observedAttributes() {
        const response = [ds.Layout.attributeOpen, 'kind'];

        return response;
    }




    addEventListeners() {
        const data = [];
        const componentButton = ds.Components.componentButton;
        const elButtons = this.shadowRoot.querySelectorAll(componentButton);

        elButtons.forEach((el) => {
            const args = {
                el,
                handler: this.close.bind(this)
            };
            data.push(args);
        });

        data.forEach((index) => {
            index.context = this;
            ds.Helper.addEventListener(index);
        });
    }

    buildMessage(props) {
        const { title, subtitle } = props;

        this.title = title;
        this.subtitle = subtitle;
        this.setAttribute(ds.Layout.attributeOpen, true);
        this.setAttribute('kind', 'message');

        const timeoutCustom = this.calculateTimeout({ title, subtitle });
        setTimeout(() => {
            this.setAttribute(ds.Layout.attributeOpen, false);
        }, timeoutCustom);
    }

    buildTip() {
        const tips = ds.Translation.gameTip;
        const isGuest = Statics.isGuest;
        const isNewbie = Statics.isNewbie;

        if (HudTransition.tipPool.length === 0) {
            const pool = this.buildTipGetAvailableTipKeys(tips, isGuest);

            HudTransition.tipPool = this.buildTipPrioritizeNewbieTip(pool, isNewbie);
        }

        const key = HudTransition.tipPool.shift();
        let title = tips[`${key}_title`];
        let subtitle = tips[`${key}_subtitle`];

        ({ title, subtitle } = this.buildTipWrapWithLinkIfMatch(key, title, subtitle));

        const args = { title, subtitle };
        this.timeClose = this.calculateTimeout(args);

        const response = { title, subtitle };

        return response;
    }

    buildTipGetAvailableTipKeys(tips, isGuest) {
        const seen = new Set();
        const response = [];
        const keys = Object.keys(tips);
        const length = keys.length;

        for (let i = 0; i < length; i++) {
            const key = keys[i];

            if (!key.endsWith('_title')) continue;

            const prefix = key.slice(0, -6);

            if (seen.has(prefix)) continue;

            const subtitleKey = `${prefix}_subtitle`;

            if (!tips[subtitleKey]) continue;
            if (!isGuest && prefix === 'do_login') continue;

            seen.add(prefix);
            response.push(prefix);
        }

        return response;
    }

    buildTipPrioritizeNewbieTip(pool, isNewbie) {
        if (!isNewbie) return ds.Helper.shuffle(pool);

        const index = pool.indexOf('walk_end');

        if (index !== -1) {
            pool.splice(index, 1);
            return ['walk_end', ...ds.Helper.shuffle(pool)];
        }

        return ds.Helper.shuffle(pool);
    }

    buildTipWrapWithLinkIfMatch(key, title, subtitle) {
        const links = Statics.link;
        const linkKeys = Object.keys(links);
        const length = linkKeys.length;

        for (let i = 0; i < length; i++) {
            const linkKey = linkKeys[i];

            if (key.includes(linkKey)) {
                const href = links[linkKey];
                const aOpen = `<a href="${href}" class=" ds-link ds-link--transparent" target="_blank" rel="noopener noreferrer">`;
                const aClose = '</a>';
                const response = {
                    title: `${aOpen}${title}${aClose}`,
                    subtitle: `${aOpen}${subtitle}${aClose}`,
                };

                return response;
            }
        }

        const args = { title, subtitle };

        return args;
    }

    calculateTimeout(props) {
        const timePerCharacter = Statics.timePerCharacter;
        const { title, subtitle } = props;
        const titleLength = title ? title.length : 0;
        const subtitleLength = subtitle ? subtitle.length : 0;
        const response = (titleLength + subtitleLength) * timePerCharacter;

        return response;
    }

    changeAttributes() {
        this.updateAttributes();
        this.redraw();
    }

    close() {
        setTimeout(() => {
            this.isOpen = false;
            ds.Helper.removeClass(this.elMain, ds.Layout.cssAnimationFadeIn);
            ds.Helper.addClass(this.elMain, ds.Layout.cssAnimationFadeOut);

            queueMicrotask(() => {
                this.setContent('');
            });
        }, this.timeClose);
    }

    draw() {
        if (!this.isOpen) return '';

        const html = `
            <div class="gm-transition ${ds.Layout.cssAnimationPrepare}" id="${this.idMain}">
                <div class="gm-transition__container">
                    <div id="${this.idContent}"></div>
                </div>
                <div
                    class="gm-version"
                    id="${this.idVersion}"
                ></div>
            </div>
        `;

        return html;
    }

    drawBattle() {
        const translation = ds.Translation.gameBattle;
        const subtitle = translation.battle_prepare;
        const title = translation.battle;
        const args = {
            title,
            subtitle
        };
        const response = this.drawContent(args);

        return response;
    }

    drawBattleLose() {
        const translation = ds.Translation.gameBattle;
        const subtitle = translation.lose;
        const title = translation.lose_title;
        const button = this.drawButtonClose();
        const subtitleFixed = Layout.replaceInText(subtitle, true);
        const args = {
            title,
            subtitle: subtitleFixed,
            button
        };
        const response = this.drawContent(args);

        return response;
    }

    drawBattleWin() {
        const translation = ds.Translation.gameBattle;
        const subtitle = translation.win;
        const title = translation.win_title;
        const content = this.drawBattleWinLoot();
        const button = this.drawButtonClose();
        const args = {
            title,
            subtitle,
            content,
            button
        };
        const response = this.drawContent(args);

        return response;
    }

    drawBattleWinLoot() {
        const itens = Object.entries(this.loot);
        const themeCard = this.theme.card;
        let response = '<div class="ds-row ds-center ds-card-wrapper">';

        itens.forEach((index) => {
            const item = Storage.buildItem(index).item;
            const argsIcon = { item, isDurability: false };
            const icon = lo.HTML.drawLoot(argsIcon);
            const quantity = index[1];

            response += `
                <div
                    class="${themeCard} ds-card--small"
                >
                    <div class="ds-card__header">
                    </div>
                    <div class="ds-card__body">
                        ${icon}
                    </div>
                    <div class="ds-card__footer ds-right">
                        <div class="ds-truncate">
                            ${quantity}
                        </div>
                    </div>
                </div>
            `;
        });

        response += '</div>';

        return response;
    }

    drawButtonClose() {
        const translation = ds.Translation.interfaceDefault.continue;
        const componentButton = ds.Components.componentButton;
        const themeButton = this.theme.menuDefault;
        const themeSize = 'regular';
        const response = `
            <${componentButton}
                theme="${themeButton}"
                size="${themeSize}"
                data-kind="button"
                label="${translation}"
            ></${componentButton}>
        `;

        return response;
    }

    drawContent(props) {
        const {
            subtitle,
            title,
            content = undefined,
            button = undefined,
        } = props;
        const buildContent = (target, css) =>
            target ?
                `
                    <div class="ds-row ds-center gm-transition__${css}">
                        ${target}
                    </div>
                `
                : '';
        const elLoading = this.drawLoadingIcon();
        const subtitleHTML = this.drawSubtitle(subtitle);
        const titleHTML = this.drawTitle(title);
        const contentHTML = buildContent(content, 'content');
        const buttonHTML = buildContent(button, 'button');
        const response = `
            <div class="ds-row">
                ${subtitleHTML}
            </div>
            <div class="ds-row">
                ${titleHTML}
            </div>
            ${contentHTML}
            ${buttonHTML}
            ${elLoading}
        `;

        return response;
    }

    drawMessage() {
        const subtitle = this.subtitle;
        const title = this.title;
        const args = {
            title,
            subtitle
        };
        const response = this.drawContent(args);

        return response;
    }

    drawLoading() {
        const textEn = 'Loa<span>ding</span>';
        const textPt = 'Carre<span>gan</span>do';
        const text = gbLanguage === 'pt' ? textPt : textEn;
        const title = this.drawTitle(text);
        const response = `
            ${title}
        `;

        return response;
    }

    drawLoadingIcon() {
        const args = {
            theme: 'purple',
            size: 'small',
            id: this.idLoading
        };
        const response = ds.HTML.drawLoading(args);

        return response;
    }

    drawSubtitle(target) {
        const response = `
            <h2 class="gm-transition__text ${ds.Layout.cssAnimationPrepare} ${ds.Layout.cssAnimationFromRight}">
                ${target}
            </h2>
        `;

        return response;
    }

    drawTip() {
        const tip = this.buildTip();
        const subtitle = this.drawSubtitle(tip.subtitle);
        const title = this.drawTitle(tip.title);
        const response = `
            ${subtitle}
            ${title}
        `;

        return response;
    }

    drawTitle(target) {
        const response = `
            <h1 class="ds-title gm-transition__title ${ds.Layout.cssAnimationPrepare} ${ds.Layout.cssAnimationFromLeft}">
                ${target}
            </h1>
        `;
        return response;
    }

    get theme() {
        const response = ds.Layout.theme;

        return response;
    }

    init() {
        this.isInitial = true;
    }

    open() {
        this.isOpen = true;

        if (!this.isInitial) {
            ds.Helper.removeClass(this.elMain, ds.Layout.cssAnimationFadeOut);
            ds.Helper.addClass(this.elMain, ds.Layout.cssAnimationFadeIn);
        }
    }

    openByKind(kind = 'loading') {
        this.setAttribute(ds.Layout.attributeOpen, true);
        this.setAttribute('kind', kind);
        this.open();
        this.changeAttributes();
    }

    redraw() {
        let content = '';
        let isLoading = true;

        this.timeClose = 0;

        switch (this.kind) {
            case 'battle':
                content = this.drawBattle();
                isLoading = false;
                break;
            case 'initial':
                this.isInitial = true;
                content = this.drawLoading();
                break;
            case 'loading':
                content = this.drawLoading();
                break;
            case 'lose':
                content = this.drawBattleLose();
                isLoading = false;
                break;
            case 'message':
                content = this.drawMessage();
                break;
            case 'tip':
            default:
                content = this.drawTip();
                break;
            case 'win':
                content = this.drawBattleWin();
                isLoading = false;
                break;
        }

        this.setContent(content, isLoading);
    }

    render() {
        const component = this.draw();

        ds.Components.render(this.args, component);
    }

    setContent(content, isLoading) {
        const elLoading = this.drawLoadingIcon();
        let html = content;

        if (isLoading) html += elLoading;

        this.elContent.innerHTML = html;

        const versionTranslation = ds.Translation.gameGeneric?.game_version || '';
        const version = `
            ${versionTranslation} <span>${gbVersion.game}</span>
        `;
        this.elVersion.innerHTML = version;

        this.addEventListeners();
    }

    updateAttributes() {
        const isOpen = this.getAttribute(ds.Layout.attributeOpen);

        if (isOpen === 'true') this.open();
        if (isOpen === 'false' || !isOpen) this.close();

        const kind = this.getAttribute('kind');

        this.kind = kind;
    }

    updateHTML() {
        this.elMain = this.shadowRoot.getElementById(this.idMain);
        this.elContent = this.shadowRoot.getElementById(this.idContent);
        this.elVersion = this.shadowRoot.getElementById(this.idVersion);
    }
}
export class MapGame extends HTMLElement {
    args = {
        context: this,
    };
    map = {};
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
    movementQueue = [];
    movementRunning = false;
    occupationMap = null;
    movementLoop = null;



    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }




    addEventListeners() {
        const data = [];
        const elButtons = HTML.elMapGameTiles.querySelectorAll('button');

        elButtons.forEach((el) => {
            const args = {
                el,
                handler: Walk.walkClick
            };
            data.push(args);
        });

        data.forEach((index) => {
            index.context = this;
            ds.Helper.addEventListener(index);
        });
    }

    addClick(el) {
        el.forEach(index => {
            index.addEventListener('click', () => {
                const positionX = ds.Helper.getPositionX(index);
                const positionY = ds.Helper.getPositionY(index);
                const currentX = HTML.elGamePlayer.getAttribute(ds.Layout.attributePositionX);
                const currentY = HTML.elGamePlayer.getAttribute(ds.Layout.attributePositionY);
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

    buildMapDoors() {
        const args = {
            tiles: ds.Modules.tiles,
            map: HTML.elMapGameTiles
        };
        const doors = ds.MapGame.buildDoors(args);

        this.map.doors = doors;
    }

    static async buildDataMap(target) {
        if (!target) return;

        const tilesById = new Map(
            ds.Modules.tiles.map(t => [t.id, t])
        );
        const tiles = Array.from({ length: target.height }, (_, row) =>
            target.tiles.slice(row * target.width, (row + 1) * target.width)
        );
        const pathWalk = tiles.map(row =>
            row.map(id => {
                const tile = tilesById.get(id);
                return tile && tile.is_walk ? 0 : 1;
            })
        );
        const pathSpawn = tiles.map(row =>
            row.map(id => {
                const tile = tilesById.get(id);
                return tile && tile.is_walk && !tile.is_door ? 0 : 1;
            })
        );
        const pathMonster = tiles.map(row =>
            row.map(id => {
                const tile = tilesById.get(id);
                return tile && tile.is_walk && !tile.is_door ? 0 : 1;
            })
        );
        const response = {
            tiles,
            pathWalk,
            pathSpawn,
            pathMonster
        };

        return response;
    }

    buildOccupationMap() {
        const map = new Map();
        const register = (el) => {
            const x = ds.Helper.getPositionX(el);
            const y = ds.Helper.getPositionY(el);
            map.set(`${x}:${y}`, el);
        };

        register(HTML.elGamePlayer);

        this.map.npcs.forEach(npc => {
            const el = MapGame.getNPCById(npc.id);
            if (el) register(el);
        });

        this.map.monsters.forEach(monster => {
            const el = MapGame.getMonsterById(monster.id);
            if (el) register(el);
        });

        this.occupationMap = map;
    }

    static async changeMap(target) {
        HTML.elTransition.openByKind('tip');
        const data = HTML.elMapGame.map;
        const currentMapId = data.idMap;
        const currentCityId = data.idCity;
        const args = {
            character: 0,
            map: data.idMap,
            door: target,
            isChangeMap: true
        };
        await this.updateDataMap(args);

        const newMap = Data.map?.data;
        const newMapId = newMap?.idMap;
        const newCityId = newMap?.idCity;

        Analytics.send({
            event_name: 'map_change',
            map_from: currentMapId,
            map_to: newMapId,
            city_from: currentCityId,
            city_to: newCityId,
        });

        Player.updateLayout();

        Tutorial.showAct1Scene2();

        Camera.center();

        HTML.elTransition.close();
    }

    draw() {
        const tiles = this.map.tiles;
        const lines = tiles.length;
        const columns = tiles[0].length;
        const widthMath = columns * ds.Layout.tileSize;
        const width = ds.Layout.buildPixel(widthMath);
        const heightMath = lines * ds.Layout.tileSize;
        const height = ds.Layout.buildPixel(heightMath);
        const player = Player.draw();
        const nPC = NPCs.draw(this.map.npcs);
        const collectable = Collectibles.draw(this.map.collectibles);
        const monsters = Monsters.draw(this.map.monsters);
        let response = `
            ${player}
            ${nPC}
            ${monsters}
            ${collectable}
            <div
                id="${HTML.idMapGame}"
                class="gm-map"
                style="width: ${width}; height: ${height};"
                tabindex="-1"
            >
        `;

        response += this.drawTiles(tiles);
        response += '</div>';

        this.map.width = widthMath;
        this.map.height = heightMath;

        return response;
    }

    drawTiles(map) {
        let response = '';

        map.forEach((line, lineIndex) => {
            line.forEach((column, columnIndex) => {
                const props = {
                    id: `tile-${lineIndex}-${columnIndex}`,
                    tileId: column,
                    positionX: columnIndex,
                    positionY: lineIndex,
                    tiles: ds.Modules.tiles
                };

                response += ds.MapGame.drawTile(props);
            });
        });

        return response;
    }

    enqueueEntities(entities, idGenerator) {
        entities.forEach((entity, index) => {
            this.movementQueue.push({
                entity,
                index,
                idGenerator
            });
        });
    }

    findPath(props) {
        const { start, end } = props;
        const map = this.map.pathWalk;
        const response = Pathfinding.findPath(map, start, end);

        return response;
    }

    getBehavior(el) {
        const response = el.getAttribute('data-behavior') || 'neutral';

        return response;
    }

    getDistance(props) {
        const { candidateX, candidateY, playerPositionX, playerPositionY } = props;
        const response = Math.abs(candidateX - playerPositionX) + Math.abs(candidateY - playerPositionY);

        return response;
    }

    static getEntityById(id) {
        const response = HTML.elMapGame.shadowRoot.getElementById(id);

        return response;
    }

    static getMonsterById(target) {
        const id = Layout.buildId(Monsters.prefix, target);
        const response = MapGame.getEntityById(id);

        return response;
    }

    static getNPCById(target) {
        const id = Layout.buildId(NPCs.prefix, target);
        const response = MapGame.getEntityById(id);

        return response;
    }

    get elMap() {
        const response = MapGame.getEntityById(HTML.idMapGame);

        return response;
    }

    static get player() {
        const response = MapGame.getEntityById(HTML.idGamePlayer);

        return response;
    }

    getOccupation(x, y) {
        const response = {
            target: undefined,
            positionX: 0,
            positionY: 0,
        };
        const playerElement = HTML.elGamePlayer;
        const playerX = ds.Helper.getPositionX(playerElement);
        const playerY = ds.Helper.getPositionY(playerElement);

        if (playerX === x && playerY === y) {
            response.target = playerElement;
            response.positionX = playerX;
            response.positionY = playerY;
        }

        for (const npc of this.map.npcs) {
            const elNPC = this.shadowRoot.getElementById(`${NPCs.prefix}_${npc.id}`);

            if (elNPC) {
                const npcX = ds.Helper.getPositionX(elNPC);
                const npcY = ds.Helper.getPositionY(elNPC);

                if (npcX === x && npcY === y) {
                    response.target = elNPC;
                    response.positionX = npcX;
                    response.positionY = npcY;
                }
            }
        }

        this.map.monsters.forEach((index => {
            const id = Layout.buildId(Monsters.prefix, index.id);
            const elMonster = this.shadowRoot.getElementById(id);
            if (elMonster) {
                const monsterX = ds.Helper.getPositionX(elMonster);
                const monsterY = ds.Helper.getPositionY(elMonster);

                if (monsterX === x && monsterY === y) {
                    response.target = elMonster;
                    response.positionX = monsterX;
                    response.positionY = monsterY;
                }
            }
        }));

        const collectibles = this.shadowRoot.querySelectorAll('.lo-collectable');

        for (const collectable of collectibles) {
            const collectableX = ds.Helper.getPositionX(collectable);
            const collectableY = ds.Helper.getPositionY(collectable);

            if (collectableX === x && collectableY === y) {
                response.target = collectable;
                response.positionX = collectableX;
                response.positionY = collectableY;
            }
        }

        return response;
    }

    getPosition(target) {
        if (!target) return;

        const dataX = ds.Helper.getPositionX(target);
        const dataY = ds.Helper.getPositionY(target);
        const math = (target) => target * ds.Layout.tileSize;
        const response = {
            top: math(dataY),
            left: math(dataX),
        };

        return response;
    }

    getNextStepByBehavior(props) {
        const {
            element,
            currentPositionX,
            currentPositionY,
            playerPositionX,
            playerPositionY
        } = props;
        const behavior = this.getBehavior(element);

        if (behavior === 'neutral') return null;

        let response = null;
        let bestDistance = behavior === 'scared' ? -Infinity : Infinity;

        for (let i = 0; i < this.directionsLength; i++) {
            const direction = this.directions[i];
            const candidateX = currentPositionX + direction.dx;
            const candidateY = currentPositionY + direction.dy;

            if (!this.isValidNextPosition(candidateX, candidateY)) continue;
            if (!this.isWithinNpcRange(element, candidateX, candidateY)) continue;

            const args = {
                candidateX,
                candidateY,
                playerPositionX,
                playerPositionY
            };
            const distanceToPlayer = this.getDistance(args);

            if (
                (behavior === 'scared' && distanceToPlayer > bestDistance) ||
                (behavior === 'agressive' && distanceToPlayer < bestDistance)
            ) {
                bestDistance = distanceToPlayer;
                response = { x: candidateX, y: candidateY };
            }
        }

        return response;
    }

    getSafeZone() {
        const response = [];
        const elPlayer = MapGame.player;
        const playerX = ds.Helper.getPositionX(elPlayer);
        const playerY = ds.Helper.getPositionY(elPlayer);
        const npcPositions = this.map.npcs.map(npc => ({
            x: Number(npc.position[0]),
            y: Number(npc.position[1])
        }));

        this.map.pathSpawn.forEach((row, y) => {
            row.forEach((cell, x) => {
                const withinPlayerZone = x >= playerX - this.safeDistance && x <= playerX + this.safeDistance &&
                    y >= playerY - this.safeDistance && y <= playerY + this.safeDistance;

                const withinNpcZone = npcPositions.some(npcPos =>
                    x >= npcPos.x - this.safeDistance && x <= npcPos.x + this.safeDistance &&
                    y >= npcPos.y - this.safeDistance && y <= npcPos.y + this.safeDistance
                );

                if (cell === 0 &&
                    !(x === playerX && y === playerY) &&
                    !withinPlayerZone &&
                    !withinNpcZone
                ) {
                    response.push({ x, y });
                }
            });
        });

        return response;
    }

    isMovingRandom() {
        const response = Math.random() < 0.3;

        return response;
    }

    isOccupied(x, y) {
        const response = this.occupationMap?.has(`${x}:${y}`) ?? false;

        return response;
    }

    isValidNextPosition(x, y) {
        if (!this.isWithinMapBounds(x, y)) return false;
        if (this.map.pathMonster[y]?.[x] !== 0) return false;
        if (this.getOccupation(x, y).target) return false;

        return true;
    }

    isWithinMapBounds(x, y) {
        const response = x >= 0 && y >= 0 && x < this.map.width && y < this.map.height;

        return response;
    }

    getEntityElement(entity, index, idGenerator) {
        const id = idGenerator(entity, index, 0);
        const response = this.shadowRoot.getElementById(id);

        return response;
    }

    getInitialPosition(element) {
        const response = {
            x: Number(element.getAttribute('data-position-x-initial')),
            y: Number(element.getAttribute('data-position-y-initial'))
        };

        return response;
    }

    getMaxWalkSteps(element) {
        const stepsAttr = Number(element.getAttribute('data-walk-steps')) || 1;
        const response = (Math.random() * stepsAttr | 0) + 1;

        return response;
    }

    getRandomStep(position, element) {
        const direction = this.directions[Math.random() * this.directionsLength | 0];
        const nextX = position.x + direction.dx;
        const nextY = position.y + direction.dy;

        if (!this.isWithinMapBounds(nextX, nextY)) return null;
        if (this.map.pathMonster[nextY]?.[nextX] !== 0) return null;
        if (this.getOccupation(nextX, nextY).target) return null;
        if (!this.isWithinNpcRange(element, nextX, nextY)) return null;

        const response = { x: nextX, y: nextY };

        return response;
    }

    getRandomSubset(list, max) {
        const response = [...list].sort(() => Math.random() - 0.5);

        return response.slice(0, max);
    }

    getWalkRadius(element) {
        const radius = Number(element.getAttribute('data-walk-radius'));
        const response = Number.isFinite(radius) ? radius : 1;

        return response;
    }

    isWithinNpcRange(element, x, y) {
        if (element.getAttribute('kind') !== 'npc') return true;

        const radius = this.getWalkRadius(element);

        if (radius <= 0) return false;

        const initial = this.getInitialPosition(element);
        const distance =
            Math.abs(x - initial.x) +
            Math.abs(y - initial.y);

        const response = distance <= 2;

        return response;
    }

    async moveSingleEntity({ entity, index, idGenerator }) {
        const element = this.getEntityElement(entity, index, idGenerator);

        if (!element || !this.isMovingRandom()) return;

        const playerX = ds.Helper.getPositionX(HTML.elGamePlayer);
        const playerY = ds.Helper.getPositionY(HTML.elGamePlayer);

        let position = {
            x: ds.Helper.getPositionX(element),
            y: ds.Helper.getPositionY(element)
        };

        const behavior = element.getAttribute('data-behavior') || 'neutral';
        const maxSteps = this.getMaxWalkSteps(element);

        for (let step = 0; step < maxSteps; step++) {
            if (this.tryStartBattleIfAggressive(
                element,
                behavior,
                position,
                playerX,
                playerY
            )) {
                return;
            }

            const next =
                this.getNextStepByBehavior({
                    element,
                    currentPositionX: position.x,
                    currentPositionY: position.y,
                    playerPositionX: playerX,
                    playerPositionY: playerY
                }) ||
                this.getRandomStep(position, element);

            if (!next) break;

            position = next;
        }

        const args = {
            el: element,
            positionXFrom: ds.Helper.getPositionX(element),
            positionYFrom: ds.Helper.getPositionY(element),
            positionXTo: position.x,
            positionYTo: position.y
        };

        await Walk.walk(args);
    }

    processMovementQueue() {
        if (this.movementRunning) return;

        this.movementRunning = true;

        const step = async () => {
            if (Battle.isBattle || this.movementQueue.length === 0) {
                this.movementRunning = false;
                return;
            }

            const item = this.movementQueue.shift();

            await this.moveSingleEntity(item);

            requestAnimationFrame(step);
        };

        requestAnimationFrame(step);
    }

    render() {
        const component = this.draw();

        ds.Components.render(this.args, component);

        this.buildMapDoors();

        Player.setPosition(this.map.player.position);

        this.map.availablePositions = this.getSafeZone();

        NPCs.setPosition(this.map.npcs);
        Monsters.setPosition();
        Collectibles.setPosition();

        this.startRandomMovementCycle();

        this.addEventListeners();

        Monsters.addClick();
        NPCs.addClick();
        Collectibles.addClick();
    }

    setPosition(props) {
        const calculate = (target) => Number(target) * ds.Layout.tileSize;
        const { target, positionX, positionY, speed } = props;
        const left = calculate(positionX);
        const top = calculate(positionY);
        const transition = speed !== undefined ? `${speed}ms` : '.5s';
        const style = `transform: translate(${left}px, ${top}px); transition: ${transition};`;

        target.setAttribute('style', style);
        target.setAttribute(ds.Layout.attributePositionX, positionX);
        target.setAttribute(ds.Layout.attributePositionY, positionY);
    }

    static setPositionEntity(elements) {
        const elMap = HTML.elMapGame;
        const availablePositions = elMap.map.availablePositions;

        elements.forEach(el => {
            if (!el) return;

            const length = availablePositions.length;
            if (length === 0) {
                el.remove();
                return;
            }

            const index = Math.floor(Math.random() * length);
            const position = availablePositions.splice(index, 1)[0];

            elMap.setPosition({
                target: el,
                positionX: position.x,
                positionY: position.y
            });
        });
    }

    startRandomMovementCycle() {
        clearTimeout(this.movementLoop);

        const delay = Math.floor(Math.random() * (10000 - 3000)) + 3000;

        this.movementLoop = setTimeout(() => {
            this.buildOccupationMap();

            this.enqueueEntities(
                this.map.monsters,
                (monster) => Layout.buildId(Monsters.prefix, monster.id)
            );

            this.enqueueEntities(
                this.map.npcs,
                (npc) => `${NPCs.prefix}_${npc.id}`
            );

            this.processMovementQueue();

            this.startRandomMovementCycle();
        }, delay);
    }

    tryStartBattleIfAggressive(element, behavior, position, playerX, playerY) {
        const isAgressive =
            behavior === 'agressive' &&
            Math.abs(position.x - playerX) <= 1 &&
            Math.abs(position.y - playerY) <= 1;

        if (isAgressive) {
            HTML.elGameBattle.build(element);

            return true;
        }

        return false;
    }

    updateData(map) {
        this.map = map;

        this.render();
    }

    static async updateDataMap(props) {
        const { isChangeMap, mapData } = props;
        const map = mapData ?? (isChangeMap ? await FetchData.changeMap(props) : await FetchData.getMap(props));

        if (!map || map.isError) return;

        const builtMapData = await MapGame.buildDataMap(map);
        if (!builtMapData) return;

        Tutorial.showAct1Scene3(map.idMap);

        map.tiles = builtMapData.tiles;
        map.pathWalk = builtMapData.pathWalk;
        map.pathSpawn = builtMapData.pathSpawn;
        map.pathMonster = builtMapData.pathMonster;
        map.player = Player.buildPosition(map);
        map.npcs = NPCs.buildPosition(map);

        Data.map.data = NPCs.updateDataNPC(map);
    }

    static updateMap() {
        const map = Data.map.data;
        const {
            monsters,
            npcs,
            collectibles,
            player,
            tiles,
            pathWalk,
            pathSpawn,
            pathMonster,
            background,
            idMap,
            idCity
        } = map;
        const args = {
            tiles,
            pathWalk,
            pathSpawn,
            pathMonster,
            monsters,
            npcs,
            collectibles,
            player,
            idMap,
            idCity
        };
        const length = tiles.length;

        if (length <= 0) return;

        Game.drawBackground(background);
        HTML.elMapGame.updateData(args);
    }
}