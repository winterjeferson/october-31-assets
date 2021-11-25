export class Carousel {
    constructor() {
        this.attCurrentSlide = 'data-current-slide';
        this.attPrevious = '[data-id="previous"]';
        this.attNext = '[data-id="next"]';
        this.cssCarouselList = 'carousel__list';
        this.cssCarouselListItem = 'carousel__item';
        this.cssCarouselController = 'carousel__controller';
        this.cssButton = 'carousel__controller-button';
        this.cssButtonActive = `${this.cssButton}--active`;
        this.cssDisplay = 'hide';
        this.cssTransition = '.7s';
        this.elCarousel = document.querySelectorAll('.carousel');

        this.counterCurrent = 0;
        this.transition = 5;
        this.isAutoplay = true;
        this.interval = 1000;

        this.buildNavigationControllerClick = this.buildNavigationControllerClick.bind(this);
    }

    animate(obj) {
        const elCarouselList = obj.from === 'arrow' ?
            obj.target.parentNode.querySelector(`.${this.cssCarouselList}`) :
            obj.target.parentNode.parentNode.querySelector(`.${this.cssCarouselList}`);
        const elCarousel = elCarouselList.parentNode;
        const carouselStyle = elCarousel.getAttribute('data-style');
        const slideSize = Number(elCarouselList.querySelector(`.${this.cssCarouselListItem}`).offsetWidth);
        const currentSlide = obj.currentSlide;
        const currentPosition = Number(currentSlide * slideSize);

        if (carouselStyle === 'fade') {
            this.animateFade({
                elCarouselList,
                currentPosition,
                currentSlide,
            });
            return;
        }

        this.animateSlide({
            elCarouselList,
            currentPosition,
        });
    }

    animateFade(obj) {
        const el = obj.elCarouselList.querySelectorAll(`.${this.cssCarouselListItem}`);
        const elCurrent = el[obj.currentSlide];

        el.forEach((item) => {
            item.style.opacity = 0;
            item.style.transition = this.cssTransition;
        });

        elCurrent.style.opacity = 1;
        elCurrent.style.left = `-${obj.currentPosition}px`;
        elCurrent.style.transition = this.cssTransition;
    }

    animateSlide(obj) {
        obj.elCarouselList.style.transform = `translateX(-${obj.currentPosition}px)`;
    }

    buildAutoplay() {
        if (!this.isAutoplay) return;

        this.interval = setInterval(this.verifyInterval, this.interval);
        this.isAutoplay = false;
    }

    buildLayout() {
        this.elCarousel.forEach((item) => {
            const el = item.querySelectorAll(`.${this.cssCarouselList} .${this.cssCarouselListItem}`);
            const length = el.length;
            const autoplay = item.getAttribute('data-autoplay');
            const atributte = item.getAttribute(this.attCurrentSlide);

            if (autoplay === 'true') this.buildAutoplay();

            this.resize(item);
            this.buildController(item, length);
            this.defineActive(item.querySelector(`[data-id="${atributte}"]`));

            if (length === 1) {
                item.querySelector(this.attPrevious).classList.add(this.cssDisplay);
                item.querySelector(this.attNext).classList.add(this.cssDisplay);
                item.querySelector(`.${this.cssCarouselController}`).classList.add(this.cssDisplay);
            }
        });
    }

    buildController(target, length) {
        const css = `button button--small button--small--proportional ${this.cssButton}`;
        const elController = target.querySelector(`.${this.cssCarouselController}`);
        let html = '';

        for (let i = 0; i < length; i++) {
            html += `<button type="button"  class="${css}" data-id="${i}" aria-hidden="true"></button>`;
        }

        elController.innerHTML = html;
    }

    buildNavigation() {
        this.elCarousel.forEach((item) => {
            this.buildNavigationController(item);
            this.buildNavigationLeft(item);
            this.buildNavigationRight(item);
        });
    }

    buildNavigationController(target) {
        const elButton = target.querySelectorAll(`.${this.cssButton}`);

        elButton.forEach((item) => {
            helper.addClick(item, this.buildNavigationControllerClick);
        });
    }

    buildNavigationControllerClick(el) {
        const target = el.target;
        const dataId = el.target.getAttribute('data-id');
        const elCarousel = target.parentNode.parentNode;

        elCarousel.setAttribute(this.attCurrentSlide, dataId);

        this.defineActive(target);
        this.animate({
            'currentSlide': target.getAttribute('data-id'),
            'target': target,
            'from': 'navigation'
        });
    }

    buildNavigationArrow(obj) {
        obj.button.onclick = () => {
            const elCarousel = obj.button.parentNode.parentNode;
            const elCarouselList = elCarousel.querySelector(`.${this.cssCarouselList}`);
            const elCarouselListLength = Number(elCarouselList.querySelectorAll(`.${this.cssCarouselListItem}`).length);
            const currentSlide = Number(elCarousel.getAttribute(this.attCurrentSlide));
            let slide = 0;

            if (obj.side === 'previous') {
                slide = currentSlide === 0 ? elCarouselListLength - 1 : currentSlide - 1;
            } else {
                slide = currentSlide === (elCarouselListLength - 1) ? 0 : currentSlide + 1;
            }

            elCarousel.setAttribute(this.attCurrentSlide, slide);
            this.defineActive(elCarousel.querySelector(`[data-id="${slide}"]`));
            this.animate({
                'currentSlide': slide,
                'target': elCarouselList,
                'from': 'arrow'
            });
        };
    }

    buildNavigationLeft(target) {
        const button = target.querySelector(this.attPrevious);

        this.buildNavigationArrow({
            button,
            'side': 'previous'
        });
    }

    buildNavigationRight(target) {
        const button = target.querySelector(this.attNext);

        this.buildNavigationArrow({
            button,
            'side': 'next'
        });
    }

    defineActive(target) {
        const el = target.parentNode.parentNode.querySelectorAll(`.${this.cssButton}`);

        el.forEach((item) => {
            item.classList.remove(this.cssButtonActive);
        });

        target.classList.add(this.cssButtonActive);
    }

    init() {
        if (!this.elCarousel) return;

        this.buildLayout();
        this.buildNavigation();
        this.watchResize();
    }

    resize(target) {
        const elCarouselList = target.querySelector(`.${this.cssCarouselList}`);
        const elCarouselListItem = elCarouselList.querySelectorAll(`.${this.cssCarouselListItem}`);
        const length = elCarouselListItem.length;

        elCarouselList.style.width += `${length * 100}%`;
    }

    verifyInterval() {
        const self = window.carousel;

        self.counterCurrent++;

        if (self.counterCurrent >= self.transition) {
            self.counterCurrent = 0;

            self.elCarousel.forEach((item) => {
                const autoplay = item.getAttribute('data-autoplay');
                const elNext = item.querySelector(self.attNext);

                if (autoplay === 'true') elNext.click();
            });
        }
    }

    watchResize() {
        window.addEventListener('resize', () => {
            this.elCarousel.forEach((item) => {
                this.watchResizeLoop(item);
            });
        }, true);
    }

    watchResizeLoop(item) {
        const el = item.parentNode.parentNode.parentNode.parentNode;
        const elCarouselList = el.querySelector(`.${this.cssCarouselList}`);
        let newSlide = 0;

        this.defineActive(el.querySelector(`[data-id="${newSlide}"]`));
        this.animate({
            'currentSlide': newSlide,
            'target': elCarouselList,
            'from': 'arrow'
        });
    }
}
export class Form {
    validateEmpty(arr) {
        const length = arr.length;

        for (let i = 0; i < length; i++) {
            if (arr[i].value === '') {
                arr[i].focus();
                return false;
            }
        }

        return true;
    }
}
export class LazyLoad {
    constructor() {
        this.cssAttribute = 'data-lazy-load';
        this.cssData = `[${this.cssAttribute}="true"]`;
    }

    addListener() {
        const elBody = document.querySelector('body');

        elBody.addEventListener('scroll', () => {
            window.requestAnimationFrame(() => {
                this.buildLoop();
            });
        });
    }

    buildLoop() {
        const el = document.querySelectorAll(this.cssData);

        el.forEach((item) => {
            this.verifyPosition(item);
        });
    }

    buildImage(target) {
        const src = target.getAttribute('data-src');

        target.setAttribute('src', src);
        target.removeAttribute(this.cssAttribute);
    }

    init() {
        if (!document.querySelector(this.cssData)) return;

        this.addListener();
        this.buildLoop();
    }

    verifyPosition(target) {
        const windowScroll = window.scrollY;
        const elemntPosition = window.helper.offset(target).top;
        const margin = window.outerHeight;

        if (windowScroll >= elemntPosition - margin) this.buildImage(target);
    }
}
export class LoadingMain {
    constructor() {
        this.cssHide = 'hide';
        this.cssAnimation = 'animate';

        this.elWrapper = document.querySelector('.loading-main');
        if (!this.elWrapper) return;
        this.elLoading = this.elWrapper.querySelector('.loading');
        this.elBody = document.querySelector('body');
    }

    hide() {
        if (!this.elWrapper) return;
        this.elWrapper.classList.add(this.cssHide);
        this.elLoading.classList.remove(this.cssAnimation);
        this.elBody.style.overflow = 'auto';
    }
}
export class MenuDropDown {
    update() {
        this.isClickBuild = false;
        this.classMenu = 'drop-down';
        this.classMenuText = `${this.classMenu}-text`;
        this.cssDropDownContent = `${this.classMenu}__content`;
        this.cssOpend = `${this.cssDropDownContent}--opened`;
        this.cssMobileShow = 'mobile-show';
        this.elMenu = document.querySelectorAll(`.${this.classMenu}, .${this.classMenuText}`);

        this.addClickAction = this.addClickAction.bind(this);
        this.close = this.close.bind(this);
    }

    addClick() {
        this.elMenu.forEach((item) => {
            const elButton = item.querySelectorAll('.button:first-child, .link:first-child')[0];

            helper.addClick(elButton, this.addClickAction);
        });
    }

    addClickAction(item) {
        const elContent = item.target.parentNode.querySelector(`.${this.cssDropDownContent}`);

        if (elContent === null) return;
        helper.addClass(elContent, this.cssOpend);
    }

    close() {
        const self = window.menuDropDown;

        if (this.elMenu === typeof 'undefined') return;

        self.elMenu.forEach((item) => {
            const elContent = item.querySelector(`.${self.cssDropDownContent}`);

            if (elContent === null) return;
            helper.removeClass(elContent, this.cssOpend);
        });
    }

    init() {
        this.update();

        if (!this.elMenu) return;

        if (!this.isClickBuild) {
            this.isClickBuild = true;
            this.addClick();
        }

        document.addEventListener('click', this.close, true);
    }

    listener(event) {
        const el = document.querySelectorAll(`.${window.menuDropDown.cssMobileShow}`);

        if (
            event.toElement.classList.contains('button') ||
            event.toElement.classList.contains('link')
        ) return;

        el.forEach((item) => {
            helper.removeClass(item, menuDropDown.cssMobileShow);
        });
    }

    reset() {
        document.removeEventListener('click', this.listener, true);
        window.menuDropDown.init();
    }
}
export class MenuToggle {
    constructor() {
        this.cssButton = 'toggle-menu';
        this.cssOpen = 'toggle-menu__open';
        this.isWatch = false;
        this.handleClick = this.handleClick.bind(this);
    }

    buildMenu() {
        this.elButton.forEach((el) => {
            helper.addClick(el, this.handleClick);
        });
    }

    handleClick(args) {
        const elSibling = args.target.nextElementSibling;
        const isCss = elSibling.classList.contains(this.cssOpen);

        if (isCss) {
            elSibling.classList.remove(this.cssOpen);
            return;
        }
        elSibling.classList.add(this.cssOpen);
    }

    init() {
        this.update();
        this.buildMenu();

        if (!this.isWatch) {
            this.isWatch = true;
            this.watchResize();
        }
    }

    update() {
        this.elButton = document.querySelectorAll(`.${this.cssButton}`);
    }

    reset() {
        this.init();
    }

    watchResize() {
        window.onresize = () => {
            this.init();
        };
    }
}
export class Modal {
    constructor() {
        this.isModalOpen = false;

        this.cssHide = 'hide';
        this.cssClose = 'modal--close';
        this.cssScrollbar = 'scrollbar scrollbar--grey';

        this.elBody = document.querySelector('body');
    }

    buildHtml() {
        const string = `
            <div class="modal ${this.cssClose} ${this.cssScrollbar}">
                <div class="modal__box">
                    <header class="modal__header right">
                        <button type="button" aria-label="${window.translation.translation.close}" class="button button--small button--small--proportional button--grey button--transparent button--close">
                            <svg class="icon icon--regular rotate-45">
                                <use xlink:href="./assets/img/icon.svg#plus"></use>
                            </svg>
                        </button>
                    </header>
                    <div class="row">
                        <div class="modal__content"></div>
                    </div>
                    <div class="navigation-change button-wrapper row center ${this.cssHide}">
                        <button type="button" class="button button--big" data-id="previous" aria-label="${window.translation.translation.previous}" >
                            <svg class="icon icon--extra-big icon--white">
                                <use xlink:href="./assets/img/icon.svg#previous"></use>
                            </svg>
                        </button>
                        <button type="button" class="button button--big" data-id="next" aria-label="${window.translation.translation.next}" >
                            <svg class="icon icon--extra-big icon--white rotate-180">
                                <use xlink:href="./assets/img/icon.svg#previous"></use>
                            </svg>
                        </button>
                    </div>
                    <footer class="button-wrapper modal__footer center ${this.cssHide}">
                        <button type="button" class="button button--regular button--green" data-id="confirm"></button>
                        <button type="button" class="button button--regular button--grey" data-id="cancel"></button>
                    </footer>
                </div>
            </div>
        `;

        this.elBody.insertAdjacentHTML('afterbegin', string);
    }

    buildKeyboard() {
        window.addEventListener('keyup', (event) => {
            const key = event.key;

            if (key === 'Escape') this.buildKeyboardEscape();
            if (key === 'ArrowLeft') this.buildKeyboardArrowLeft();
            if (key === 'ArrowRight') this.buildKeyboardArrowRight();
        });
    }

    buildKeyboardEscape() {
        if (this.isModalOpen) this.closeModal();
    }

    buildKeyboardArrowLeft() {
        if (!this.isModalOpen) return;
        if (this.elModalNavigationArrowLeft.classList.contains(this.cssHide)) return;
        this.elModalNavigationArrowLeft.click();
    }

    buildKeyboardArrowRight() {
        if (!this.isModalOpen) return;
        if (this.elModalNavigationArrowRight.classList.contains(this.cssHide)) return;
        this.elModalNavigationArrowRight.click();
    }

    buildMenuGallery() {
        if (!this.elGallery) return;

        this.elGallery.forEach((item) => {
            const elButton = item.querySelectorAll('a');

            elButton.forEach((target) => {
                this.buildMenuGalleryButton(target);
            });
        });

        helper.addClick(this.elModalNavigationArrowLeft, this.handleClickArrowLeft.bind(this));
        helper.addClick(this.elModalNavigationArrowRight, this.handleClickArrowRight.bind(this));
    }

    buildMenuGalleryButton(target) {
        target.addEventListener('click', event => {
            const href = target.getAttribute('href');
            const description = target.querySelector('img').getAttribute('data-description');

            event.preventDefault();
            this.buildModal({kind: 'gallery', size: 'big'});
            this.buildGalleryImage(href, description);
            this.buildGalleryNavigation(target);
        });
    }

    buildMenu() {
        const elButtonCancel = this.elModalFooter.querySelector('[data-id="cancel"]');

        helper.addClick(this.elModalClose, this.closeModal.bind(this));
        helper.addClick(elButtonCancel, this.closeModal.bind(this));
    }

    buildGalleryNavigation(target) {
        const currentGallery = target.parentNode.parentNode;
        const elGallery = currentGallery.querySelectorAll('a');
        const siblingLength = elGallery.length - 1;
        let array = [];

        elGallery.forEach((item) => {
            array.push(item);
        });

        if (siblingLength > 0) {
            this.buildGalleryNavigationShow({
                array,
                target,
                siblingLength
            });

            return;
        }

        this.elModalNavigationArrow.classList.add(this.cssHide);
    }

    buildGalleryNavigationShow(obj) {
        const currentPosition = obj.array.indexOf(obj.target);

        this.elModalNavigationArrow.classList.remove(this.cssHide);
        this.targetBuildGalleryChange = obj.target;

        if (currentPosition <= 0) {
            this.elModalNavigationArrowLeft.classList.add(this.cssHide);
        } else {
            this.elModalNavigationArrowLeft.classList.remove(this.cssHide);
        }

        if (currentPosition >= obj.siblingLength) {
            this.elModalNavigationArrowRight.classList.add(this.cssHide);
        } else {
            this.elModalNavigationArrowRight.classList.remove(this.cssHide);
        }
    }

    buildModal(obj) {
        this.elModalFooter.classList.add(this.cssHide);
        typeof obj.action === 'undefined' ? this.openModal() : this.closeModal();
        typeof obj.click !== 'undefined' ? this.buildContentConfirmationAction(obj.click) : '';
        typeof obj.confirmText !== 'undefined' ? this.elModalFooterConfirm.innerHTML = obj.confirmText : this.translate();
        this.buildModalSize(obj.size);
        this.buildModalKind(obj);
    }

    buildModalKind(obj) {
        if (obj.kind === 'ajax') this.buildContentAjax(obj.content);
        if (obj.kind === 'confirmation') this.buildContentConfirmation(obj.content);
        if (obj.kind === 'gallery') {
            this.elModalNavigationArrow.classList.remove('hide');
            return;
        }

        this.elModalNavigationArrow.classList.add('hide');
    }

    buildModalSize(size = 'regular') {
        const prefix = 'modal--';
        const arr = ['extra-small', 'small', 'regular', 'big', 'extra-big', 'full'];

        arr.forEach((item) => {
            this.elModalBox.classList.remove(`${prefix}${item}`);
        });

        this.elModalBox.classList.add(`${prefix}${size}`);
    }

    buildContentAjax(target) {
        const self = this;
        let ajax = new XMLHttpRequest();

        ajax.onreadystatechange = function () {
            if (!this.readyState === 4 && this.status === 200) return;

            self.buildContentAjaxSuccess(this.responseText);
        };

        ajax.open('GET', target, true);
        ajax.send();
    }

    buildContentAjaxSuccess(data) {
        this.elModalContent.innerHTML = data;
        this.resetOtherClass();
    }

    buildGalleryImage(image, description) {
        const html = `<img src="${image}" class="img-responsive" style="margin:auto;" title="" alt=""/>`;

        this.elModalContent.innerHTML = html;
        this.changeText(description);
    }

    buildContentConfirmation(content) {
        const html = `<div class="center">${content}</div>`;

        this.elModalFooter.classList.remove(this.cssHide);
        this.elModalContent.innerHTML = html;
    }

    buildContentConfirmationAction(action) {
        this.elModalFooterConfirm.setAttribute('onclick', action);
    }

    changeText(description) {
        const html = `<p class="modal__description">${description}</p>`;

        if (description === '' || description === null) return;
        this.elModalContent.insertAdjacentHTML('beforeend', html);
    }

    closeModal() {
        this.isModalOpen = false;
        this.elBody.classList.add('overflow-y');
        this.elBody.classList.remove('overflow-hidden');
        this.elBody.style.overflowY = 'auto';
        this.elBody.style.position = 'relative';
        this.elModal.classList.add(this.cssClose);
        this.elModalBox.classList.remove('modal-animate');
        this.resetOtherClass();
    }

    init() {
        this.buildHtml();
        this.update();
        this.buildMenu();
        this.buildMenuGallery();
        this.buildKeyboard();
        this.translate();
    }

    handleClickArrowLeft() {
        this.targetBuildGalleryChange.previousElementSibling.click();
    }

    handleClickArrowRight() {
        this.targetBuildGalleryChange.nextElementSibling.click();
    }

    openModal() {
        this.isModalOpen = true;
        this.elBody.classList.remove('overflow-y');
        this.elBody.classList.add('overflow-hidden');
        this.elBody.style.overflowY = 'hidden';
        this.elModal.classList.remove(this.cssClose);
        this.elModalBox.classList.add('modal-animate');
    }

    resetOtherClass() {
        if (typeof menuDropDown !== 'undefined') menuDropDown.reset();
        if (typeof menuToggle !== 'undefined') menuToggle.init();
        if (typeof menuTab !== 'undefined') menuTab.init();
        if (typeof lazyLoad !== 'undefined') lazyLoad.init();
    }

    translate() {
        this.elModalFooterConfirm.innerHTML = translation.translation.confirm;
        this.elModalFooterCancel.innerHTML = translation.translation.cancel;
    }

    update() {
        this.targetBuildGalleryChange = '';
        this.elModal = document.querySelector('.modal');
        this.elModalFooter = this.elModal.querySelector('footer');
        this.elModalFooterConfirm = this.elModalFooter.querySelector('[data-id="confirm"]');
        this.elModalFooterCancel = this.elModalFooter.querySelector('[data-id="cancel"]');
        this.elModalClose = document.querySelector('.modal__header .button--close');
        this.elModalContent = document.querySelector('.modal__content');
        this.elModalBox = this.elModal.querySelector('.modal__box');
        this.elModalNavigationArrow = this.elModal.querySelector('.navigation-change');
        this.elModalNavigationArrowLeft = this.elModalNavigationArrow.querySelector('[data-id="previous"]');
        this.elModalNavigationArrowRight = this.elModalNavigationArrow.querySelector('[data-id="next"]');
        this.elGallery = document.querySelectorAll('.gallery');
    }
}
export class Notification {
    constructor() {
        this.elBody = document.querySelector('body');
        this.elNotificationId = 'notification';
        this.colorDefault = 'grey';

        this.notificationId = 0;
    }

    add(obj) {
        if (!obj.text) return;

        this.placeItem(obj);

        const el = document.querySelector(`#${this.elNotificationId + this.notificationId}`);
        this.remove(el, obj.text.length);
        this.notificationId++;
    }

    buildHtml() {
        const html = `<div id="${this.elNotificationId}" class="${this.elNotificationId} ${this.elNotificationId}--default"></div>`;

        this.elBody.insertAdjacentHTML('beforeend', html);
    }

    buildHtmlItem(obj) {
        const color = typeof obj.color !== 'undefined' ? obj.color : this.colorDefault;

        return `
            <div class="${this.elNotificationId}__item ${this.elNotificationId}--regular ${this.elNotificationId}--${color}" id="${this.elNotificationId}${this.notificationId}">
                <span class="${this.elNotificationId}__text">${obj.text}</span>
                <button type="button" class="button button--small button--small--proportional button--transparent" onclick="Notification.remove(this.parentNode, 0)" aria-label="${window.translation.translation.close}">
                    <svg class="icon icon--regular rotate-45">
                        <use xlink:href="./assets/img/icon.svg#plus"></use>
                    </svg>
                </button>
            </div>
        `;
    }

    init() {
        this.buildHtml();
        this.update();
    }

    placeItem(obj) {
        let string = this.buildHtmlItem(obj);
        let place = '';

        if (typeof obj.place === 'undefined') {
            place = this.elNotification;
        } else {
            let elList = document.querySelector(obj.place).querySelector(`.${this.elNotificationId}`);

            if (elList === null) {
                let newString = `<div class="${this.elNotificationId}">${string}</div>`;

                string = newString;
                place = document.querySelector(obj.place);
            } else {
                place = elList;
            }
        }

        place.insertAdjacentHTML('beforeend', string);
    }

    remove(item, messageLength) {
        const messageTime = messageLength * 150;

        setTimeout(() => {
            this.removeItem(item);
        }, messageTime);
    }

    removeItem(item) {
        if (item.parentNode === null) return;

        item.parentNode.removeChild(item);
    }

    update() {
        const el = document.querySelector(`#${this.elNotificationId}`);

        this.elNotification = el;
    }
}
export class Table {
    constructor() {
        this.elTable = document.querySelectorAll('.table');
        this.cssResponsive = 'table-responsive';
    }

    build() {
        this.elTable.forEach((item) => {
            helper.wrapItem(item, this.cssResponsive);

            const elParent = item.parentNode.parentNode.querySelector(`.${this.cssResponsive}`);
            helper.wrapItem(elParent, `wrapper-${this.cssResponsive}`);
        });
    }

    init() {
        if (!this.elTable) return;

        this.build();
    }
}
export class Translation {
    constructor() {
        this.translation = '';
        this.translationEn = {
            'cancel': 'Cancel',
            'close': 'Close',
            'confirm': 'Confirm',
            'input_upload': 'Select File...',
            'next': 'Next',
            'previous': 'Previous',
        };
        this.translationEs = {
            'cancel': 'Cancelar',
            'close': 'Cerrar',
            'confirm': 'Confirmar',
            'input_upload': 'Seleccione Archivo...',
            'next': 'Siguiente',
            'previous': 'Anterior',
        };
        this.translationPt = {
            'cancel': 'Cancelar',
            'close': 'Fechar',
            'confirm': 'Confirmar',
            'input_upload': 'Selecione o Arquivo...',
            'next': 'Próximo',
            'previous': 'Anterior',
        };
    }

    defineLanguege() {
        const capitalize = globalLanguage.charAt(0).toUpperCase() + globalLanguage.slice(1);

        this.translation = this[`translation${capitalize}`];
    }

    init() {
        this.defineLanguege();
    }
}
export class Helper {
    constructor() {
        this.cssDisplayNone = 'display-none';
    }

    addChange(el, action) {
        if (!el) return;

        this.addEvent({
            el,
            action,
            event: 'change'
        });
    }

    addClick(el, action) {
        if (!el) return;

        this.addEvent({
            el,
            action,
            event: 'click'
        });
    }

    addEvent(args) {
        const action = args.action;
        const el = args.el;
        const event = args.event;

        if (!el) return;

        el.removeEventListener(event, action);
        el.addEventListener(event, action);
    }

    addClass(target, classCss) {
        if (!target || !classCss) return;

        if (classCss instanceof Array) {
            for (let i in classCss) {
                target.classList.add(classCss[i]);
            }

            return;
        }

        target.classList.add(classCss);
    }

    ajax(args) {
        return new Promise((resolve, reject) => {
            const controller = args.controller ? args.controller : 'php/controller.php';
            const namespace = args.namespace ? args.namespace : 'Game';
            const token = args.token ? args.token : objGameLayout.token;
            const kind = args.kind ? args.kind : 'POST';
            let xhr = new XMLHttpRequest();

            xhr.open(kind, controller, true);
            xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            xhr.onload = () => {
                if (xhr.status >= 200 && xhr.status < 300) {
                    if (xhr.responseText === 'session_expired') objGameLayout.decodeMessage(xhr.responseText);
                    resolve(xhr.responseText);
                }
                reject(xhr.statusText);
            };
            xhr.onerror = () => reject(xhr.statusText);
            xhr.send(`&n=${namespace}&t=${token + args.parameter}`);
        });
    }

    capitalize(target) {
        return target.charAt(0).toUpperCase() + target.slice(1);
    }

    findInObject(args) {
        const target = args.target;
        const search = args.search;
        const value = args.value;
        const get = args.get;
        const length = target.length;

        for (let i = 0; i < length; i++) {
            const index = target[i];

            if (index[search] == value) {
                if (get !== false) {
                    return index[get];
                }

                return i;
            }
        }
    }

    getSize(args) {
        return parseFloat(getComputedStyle(args.el, null)[args.value].replace('px', ''));
    }

    getTranslateValue(target) {
        if (typeof target === 'undefined') return;

        const style = window.getComputedStyle(target);
        const matrix = style['transform'];

        if (matrix === 'none') {
            return {
                x: 0,
                y: 0,
                z: 0
            };
        }

        const matrixType = matrix.includes('3d') ? '3d' : '2d';
        const matrixValues = matrix.match(/matrix.*\((.+)\)/)[1].split(', ');

        // 2d matrices have 6 values
        // Last 2 values are X and Y.
        // 2d matrices does not have Z value.
        if (matrixType === '2d') {
            return {
                x: Number(matrixValues[4]),
                y: Number(matrixValues[5]),
                z: 0
            };
        }

        // 3d matrices have 16 values
        // The 13th, 14th, and 15th values are X, Y, and Z
        if (matrixType === '3d') {
            return {
                x: Number(matrixValues[12]),
                y: Number(matrixValues[13]),
                z: Number(matrixValues[14])
            };
        }
    }

    getUrlParameter(target) {
        const url = top.location.search.substring(1);
        const parameter = url.split('&');

        for (let i = 0; i < parameter.length; i++) {
            let parameterName = parameter[i].split('=');

            if (parameterName[0] === target) {
                return parameterName[1];
            }
        }
    }

    getUrlWord(target) {
        return new RegExp('\\b' + target + '\\b', 'i').test(window.location.href);
    }

    height(el) {
        return this.getSize({
            el,
            value: 'height'
        });
    }

    hide(el) {
        this.addClass(el, this.cssDisplayNone);
    }

    randomInArray(array) {
        const random = Math.random() * array.length;
        const math = Math.floor(random);
        const result = array[math];

        return result;
    }

    randomNumber(number) {
        const random = Math.random() * number;
        const math = Math.floor(random);

        return math;
    }

    sortSelect(target) {
        const length = target.options.length;
        let newArray = [];

        for (let i = 0; i < length; i++) {
            newArray[i] = [];
            newArray[i][0] = target.options[i].text;
            newArray[i][1] = target.options[i].value;
        }

        newArray.sort();

        while (target.options.length > 0) {
            target.options[0] = null;
        }

        for (let i = 0; i < newArray.length; i++) {
            let op = new Option(newArray[i][0], newArray[i][1]);
            target.options[i] = op;
        }
    }

    offset(element) {
        let rect = element.getBoundingClientRect();
        const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const args = {
            'top': rect.top + scrollTop,
            'left': rect.left + scrollLeft,
        };

        return args;
    }

    remove(target) {
        if (!target || target.parentNode === null) return;

        target.parentNode.removeChild(target);
    }

    removeClass(target, css) {
        if (!target || !css) return;

        if (css instanceof Array) {
            for (let i in css) {
                this.removeClassDo(target, css[i]);
            }

            return;
        }

        this.removeClassDo(target, css);
    }

    removeClassDo(target, css) {
        if (target.classList.contains(css)) {
            target.classList.remove(css);
        }
    }

    removeInArray(args) {
        const arr = args.arr;
        const index = arr.indexOf(args.value);

        arr.splice(index, 1);
    }

    show(el) {
        this.removeClass(el, this.cssDisplayNone);
    }

    trigger(el, kind) {
        const event = new Event(kind);

        el.dispatchEvent(event);
    }

    useStorage(args) {
        const target = args.target;
        const prefix = 'october_31_';

        switch (args.action) {
            case 'set':
                window.localStorage.setItem(prefix + target, args.value);
                break;
            case 'get':
                return window.localStorage.getItem(prefix + target);
            case 'remove':
                window.localStorage.removeItem(prefix + target);
                break;
        }
    }

    validateEmptySpace(target) {
        const string = target.value;

        if (string.indexOf(' ') !== -1) return true;
        return false;
    }

    verifyUrlRoute(target) {
        const arrFolder = window.location.pathname.split('/');

        if (arrFolder.indexOf(target) > -1) return true;
        return false;
    }

    width(el) {
        return this.getSize({
            el,
            value: 'width'
        });
    }

    wrapItem(target, cssClass) {
        const wrapper = document.createElement('div');

        wrapper.className = cssClass;
        target.parentNode.insertBefore(wrapper, target);
        wrapper.appendChild(target);
    }
}