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
    }

    build() {
        if (this.elCarousel.length < 1) {
            return;
        }

        this.buildLayout();
        this.buildNavigation();
        this.watchResize();
    }

    buildAutoplay() {
        if (this.isAutoplay) {
            this.interval = setInterval(this.verifyInterval, 1000);
            this.isAutoplay = false;
        }
    }

    buildLayout() {
        const self = this;

        Array.prototype.forEach.call(this.elCarousel, (item) => {
            let length = item.querySelectorAll(`.${self.cssCarouselList} .${this.cssCarouselListItem}`).length;
            let autoplay = item.getAttribute('data-autoplay');

            if (autoplay === 'true') {
                self.buildAutoplay();
            }

            self.resizeLayout(item);
            self.buildLayoutController(item, length);
            self.defineActive(item.querySelector('[data-id="' + item.getAttribute(self.attCurrentSlide) + '"]'));

            if (length === 1) {
                item.querySelector(self.attPrevious).classList.add(self.cssDisplay);
                item.querySelector(self.attNext).classList.add(self.cssDisplay);
                item.querySelector(`.${self.cssCarouselController}`).classList.add(self.cssDisplay);
            }
        });
    }

    watchResize() {
        const self = this;

        window.onresize = () => {
            Array.prototype.forEach.call(self.elCarousel, (item) => {
                let el = item.parentNode.parentNode.parentNode.parentNode;
                let elCarouselList = el.querySelector(`.${self.cssCarouselList}`);
                let newSlide = 0;

                self.defineActive(el.querySelector(`[data-id="${newSlide}"]`));
                self.animate({
                    'currentSlide': newSlide,
                    'target': elCarouselList,
                    'from': 'arrow'
                });
            });
        };
    }

    buildLayoutController(target, length) {
        const css = `button button--small button--small--proportional ${this.cssButton}`;
        let concat = '';

        for (let i = 0; i < length; i++) {
            concat += `
                <button type="button" class="${css}" data-id="${i}" aria-hidden="true"></button>
            `;
        }

        target.querySelector(`.${this.cssCarouselController}`).innerHTML = concat;
    }

    buildNavigation() {
        Array.prototype.forEach.call(this.elCarousel, (item) => {
            this.buildNavigationController(item);
            this.buildNavigationArrowLeft(item);
            this.buildNavigationArrowRight(item);
        });
    }

    buildNavigationController(target) {
        const button = target.querySelectorAll(`.${this.cssButton}`);

        Array.prototype.forEach.call(button, (item) => {
            item.onclick = () => {
                this.defineActive(item);
                this.animate({
                    'currentSlide': item.getAttribute('data-id'),
                    'target': item,
                    'from': 'navigation'
                });
            };
        });
    }

    buildNavigationArrow(obj) {
        const self = this;

        obj.button.onclick = () => {
            const elCarousel = obj.button.parentNode.parentNode;
            const elCarouselList = elCarousel.querySelector(`.${self.cssCarouselList}`);
            const elCarouselListLength = Number(elCarouselList.querySelectorAll(`.${this.cssCarouselListItem}`).length);
            const currentSlide = Number(elCarousel.getAttribute(self.attCurrentSlide));
            let slide = 0;

            if (obj.side === 'previous') {
                slide = currentSlide === 0 ? elCarouselListLength - 1 : currentSlide - 1;
            } else {
                slide = currentSlide === (elCarouselListLength - 1) ? 0 : currentSlide + 1;
            }

            elCarousel.setAttribute(self.attCurrentSlide, slide);
            self.defineActive(elCarousel.querySelector(`[data-id="${slide}"]`));
            self.animate({
                'currentSlide': slide,
                'target': elCarouselList,
                'from': 'arrow'
            });
        };
    }

    buildNavigationArrowLeft(target) {
        const button = target.querySelector(this.attPrevious);

        this.buildNavigationArrow({
            button,
            'side': 'previous'
        });
    }

    buildNavigationArrowRight(target) {
        const button = target.querySelector(this.attNext);

        this.buildNavigationArrow({
            button,
            'side': 'next'
        });
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

        switch (carouselStyle) {
            case 'fade':
                this.animateFade({
                    elCarouselList,
                    currentPosition,
                    currentSlide,
                });
                break;
            default:
                this.animateSlide({
                    elCarouselList,
                    currentPosition,
                });
                break;
        }
    }

    animateFade(obj) {
        const el = obj.elCarouselList.querySelectorAll(`.${this.cssCarouselListItem}`);

        Array.prototype.forEach.call(el, (item) => {
            item.style.opacity = 0;
            item.style.transition = this.cssTransition;
        });

        el[obj.currentSlide].style.opacity = 1;
        el[obj.currentSlide].style.left = `-${obj.currentPosition}px`;
        el[obj.currentSlide].style.transition = this.cssTransition;
    }

    animateSlide(obj) {
        obj.elCarouselList.style.transform = `translateX(-${obj.currentPosition}px)`;
    }

    verifyInterval() {
        const self = window.carousel;

        self.counterCurrent++;

        if (self.counterCurrent >= self.transition) {
            self.counterCurrent = 0;

            Array.prototype.forEach.call(self.elCarousel, (item) => {
                const autoplay = item.getAttribute('data-autoplay');

                if (autoplay === 'true') {
                    item.querySelector(self.attNext).click();
                }
            });
        }
    }

    defineActive(target) {
        const el = target.parentNode.parentNode.querySelectorAll(`.${this.cssButton}`);

        Array.prototype.forEach.call(el, (item) => {
            item.classList.remove(this.cssButtonActive);
        });

        target.classList.add(this.cssButtonActive);
    }

    resizeLayout(target) {
        const elCarouselList = target.querySelector(`.${this.cssCarouselList}`);
        const elCarouselListItem = elCarouselList.querySelectorAll(`.${this.cssCarouselListItem}`);
        const length = elCarouselListItem.length;

        elCarouselList.style.width += `${length * 100}%`;
    }
}
export class Helper {
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

    offset(element) {
        let rect = element.getBoundingClientRect();
        const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const obj = {
            'top': rect.top + scrollTop,
            'left': rect.left + scrollLeft,
        };

        return obj;
    }

    verifyUrlRoute(target) {
        const arrFolder = window.location.pathname.split('/');

        if (arrFolder.indexOf(target) > -1) {
            return true;
        } else {
            return false;
        }
    }

    wrapItem(target, cssClass) {
        const wrapper = document.createElement('div');

        wrapper.className = cssClass;
        target.parentNode.insertBefore(wrapper, target);
        wrapper.appendChild(target);
    }
}
export class LazyLoad {
    constructor() {
        this.cssAttribute = 'data-lazy-load';
        this.cssData = `[${this.cssAttribute}="true"]`;
    }

    build() {
        if (!document.querySelector(this.cssData)) return;

        this.addListener();
        this.buildLoop();
    }

    addListener() {
        document.querySelector('body').addEventListener('scroll', () => {
            window.requestAnimationFrame(() => {
                this.buildLoop();
            });
        });
    }

    buildLoop() {
        const el = document.querySelectorAll(this.cssData);

        [...el].forEach.call(el, (item) => {
            this.verifyPosition(item);
        });
    }

    verifyPosition(target) {
        const windowScroll = window.scrollY;
        const elemntPosition = window.helper.offset(target).top;
        const margin = window.outerHeight;

        if (windowScroll >= elemntPosition - margin) {
            this.buildImage(target);
        }
    }

    buildImage(target) {
        target.setAttribute('src', target.getAttribute('data-src'));
        target.removeAttribute(this.cssAttribute);
    }
}
export class LoadingMain {
    constructor() {
        this.cssHide = 'hide';
        this.cssAnimation = 'animate';

        this.elWrapper = document.querySelector('.loading-main');
        this.elLoading = this.elWrapper.querySelector('.loading');
        this.elBody = document.querySelector('body');
    }

    hide() {
        this.elWrapper.classList.add(this.cssHide);
        this.elLoading.classList.remove(this.cssAnimation);
        this.elBody.style.overflow = 'auto';
    }
}
export class Modal {
    constructor() {
        this.isModalOpen = false;

        this.cssHide = 'hide';
        this.cssClose = 'modal--close';

        this.elBody = document.querySelector('body');
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

    build() {
        this.buildHtml();
        this.update();
        this.buildMenu();
        this.buildMenuGallery();
        this.buildKeyboard();
        this.buildTranslation();
    }

    buildHtml() {
        const string = `
            <div class="modal ${this.cssClose}">
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

    buildTranslation() {
        this.elModalFooterConfirm.innerHTML = window.translation.translation.confirm;
        this.elModalFooterCancel.innerHTML = window.translation.translation.cancel;
    }

    buildKeyboard() {
        window.addEventListener('keyup', (event) => {
            if (event.key === 'Escape') {
                if (this.isModalOpen) {
                    this.closeModal();
                }
            }

            if (event.key === 'ArrowLeft') {
                if (!this.isModalOpen) {
                    return;
                }
                if (this.elModalNavigationArrowLeft.classList.contains(this.cssHide)) {
                    return;
                } else {
                    this.elModalNavigationArrowLeft.click();
                }
            }

            if (event.key === 'ArrowRight') {
                if (!this.isModalOpen) {
                    return;
                }
                if (this.elModalNavigationArrowRight.classList.contains(this.cssHide)) {
                    return;
                } else {
                    this.elModalNavigationArrowRight.click();
                }
            }
        });
    }

    buildMenuGallery() {
        if (!this.elGallery) {
            return;
        }

        Array.prototype.forEach.call(this.elGallery, (item) => {
            let button = item.querySelectorAll('a');

            Array.prototype.forEach.call(button, (itemBt) => {
                itemBt.addEventListener('click', (event) => {
                    event.preventDefault();
                    this.buildModal('gallery', false, 'full');
                    this.buildGalleryImage(itemBt.getAttribute('href'), itemBt.querySelector('img').getAttribute('data-description'));
                    this.buildGalleryNavigation(itemBt);
                });
            });
        });

        this.elModalNavigationArrowLeft.addEventListener('click', () => {
            this.targetBuildGalleryChange.previousElementSibling.click();
        });

        this.elModalNavigationArrowRight.addEventListener('click', () => {
            this.targetBuildGalleryChange.nextElementSibling.click();
        });
    }

    buildMenu() {
        this.elModalClose.addEventListener('click', () => {
            this.closeModal();
        });

        document.addEventListener('click', (event) => {
            let isButton = event.target.matches('button *, a *');

            if (isButton) {
                return;
            }
        });

        this.elModalFooter.querySelector('[data-id="cancel"]').addEventListener('click', () => {
            this.closeModal();
        });
    }

    buildGalleryNavigation(target) {
        let array = [];
        let currentGallery = target.parentNode.parentNode;
        let siblingLength = currentGallery.querySelectorAll('a').length - 1;

        Array.prototype.forEach.call(currentGallery.querySelectorAll('a'), (item) => {
            array.push(item);
        });

        let currentPosition = array.indexOf(target);

        if (siblingLength > 0) {
            this.elModalNavigationArrow.classList.remove(this.cssHide);
            this.targetBuildGalleryChange = target;

            if (currentPosition <= 0) {
                this.elModalNavigationArrowLeft.classList.add(this.cssHide);
            } else {
                this.elModalNavigationArrowLeft.classList.remove(this.cssHide);
            }

            if (currentPosition >= siblingLength) {
                this.elModalNavigationArrowRight.classList.add(this.cssHide);
            } else {
                this.elModalNavigationArrowRight.classList.remove(this.cssHide);
            }

        } else {
            this.elModalNavigationArrow.classList.add(this.cssHide);
        }
    }

    buildModal(obj) {
        this.elModalFooter.classList.add(this.cssHide);
        typeof obj.action === 'undefined' ? this.openModal() : this.closeModal();
        typeof obj.click !== 'undefined' ? this.buildContentConfirmationAction(obj.click) : '';
        this.buildModalSize(obj.size);
        this.buildModalKind(obj);
    }

    buildModalKind(obj) {
        if (obj.kind === 'ajax') {
            this.buildContentAjax(obj.content);
        }

        if (obj.kind === 'confirmation') {
            this.buildContentConfirmation(obj.content);
        }

        switch (obj.kind) {
            case 'gallery':
                this.elModalNavigationArrow.classList.remove('hide');
                break;
            default:
                this.elModalNavigationArrow.classList.add('hide');
                break;
        }
    }

    openModal() {
        this.isModalOpen = true;
        this.elBody.classList.remove('overflow-y');
        this.elBody.classList.add('overflow-hidden');
        this.elBody.style.overflowY = 'hidden';
        this.elModal.classList.remove(this.cssClose);
        this.elModalBox.classList.add('modal-animate');
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

    buildModalSize(size = 'regular') {
        const prefix = 'modal--';
        const arr = ['extra-small', 'small', 'regular', 'big', 'extra-big', 'full'];

        Array.prototype.forEach.call(arr, (item) => {
            this.elModalBox.classList.remove(`${prefix}${item}`);
        });

        this.elModalBox.classList.add(`${prefix}${size}`);
    }

    buildContentAjax(target) {
        let self = this;
        let ajax = new XMLHttpRequest();

        ajax.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                self.elModalContent.innerHTML = this.responseText;
                self.resetOtherClass();
            }
        };

        ajax.open('GET', target, true);
        ajax.send();
    }

    buildGalleryImage(image, description) {
        const stringImage = `<img src="${image}" class="img-responsive" style="margin:auto;" title="" alt=""/>`;

        this.elModalContent.innerHTML = stringImage;
        this.changeText(description);
    }

    buildContentConfirmation(content) {
        const string = `<div class="center">${content}</div>`;

        this.elModalFooter.classList.remove(this.cssHide);
        this.elModalContent.innerHTML = string;
    }

    buildContentConfirmationAction(action) {
        this.elModalFooterConfirm.setAttribute('onclick', action);
    }

    changeText(description) {
        if (description === '' || description === null) {
            return;
        }

        const string = `<p class="modal__description">${description}</p>`;

        if (typeof description !== typeof 'undefined') {
            this.elModalContent.insertAdjacentHTML('beforeend', string);
        }
    }

    resetOtherClass() {
        if (typeof window.menuDropDown !== 'undefined') {
            window.menuDropDown.reset();
        }

        if (typeof window.menuToggle !== 'undefined') {
            window.menuToggle.build();
        }

        if (typeof window.menuTab !== 'undefined') {
            window.menuTab.build();
        }

        if (typeof window.lazyLoad !== 'undefined') {
            window.lazyLoad.build();
        }
    }
}
export class Table {
    constructor() {
        this.elTable = document.querySelectorAll('.table');
        this.cssResponsive = 'table-responsive';
    }

    build() {
        if (this.elTable.length < 1) {
            return;
        }

        this.buildResponsive();
    }

    buildResponsive() {
        Array.prototype.forEach.call(this.elTable, (item) => {
            window.helper.wrapItem(item, this.cssResponsive);
            window.helper.wrapItem(item.parentNode.parentNode.querySelector(`.${this.cssResponsive}`), `wrapper-${this.cssResponsive}`);
        });
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

    build() {
        this.defineLanguege();
    }

    defineLanguege() {
        const capitalize = globalLanguage.charAt(0).toUpperCase() + globalLanguage.slice(1);

        this.translation = this[`translation${capitalize}`];
    }
}
