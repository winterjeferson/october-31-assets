export class ActivateConfirm {
    static id = 'activate_confirm';
    static idComponent = `${this.id}_component`;
    static frontEndClass = 'activateConfirm';

    static get paramUserId() {
        return ds.Helper.getUrlParameter('id');
    }

    static get paramEmail() {
        return ds.Helper.getUrlParameter('e');
    }

    static get paramToken() {
        return ds.Helper.getUrlParameter('t');
    }

    static hasToken() {
        const userId = ActivateConfirm.paramUserId;
        const email = ActivateConfirm.paramEmail;
        const token = ActivateConfirm.paramToken;

        return Boolean(userId && email && token);
    }

    static addEventListeners() {
        const data = [
            {
                el: ActivateConfirm.elComponent,
                event: 'click',
                handler: ActivateConfirm.handleActivate
            }
        ];

        data.forEach((index) => {
            ds.Helper.addEventListener(index);
        });
    }

    static draw() {
        const page = Component.drawPage({
            id: ActivateConfirm.id,
            title: Theme.translation?.login?.e_mail_activate?.title,
            content: ActivateConfirm.drawPage()
        });

        Component.insertHTML(page);

        ActivateConfirm.updateHtml();
        ActivateConfirm.addEventListeners();
    }

    static drawPage() {
        const activation = `
            <p class="ds-font--regular">
                ${Theme.translation?.login?.e_mail_activate?.text}
            </p>
        `;
        const button = Component.drawButtonProceed({
            id: ActivateConfirm.idComponent,
            label: Theme.translation?.login?.e_mail_activate?.link_text
        });
        const response = `
            ${activation}
            <div class="lo-margin-button">
                ${button}
            </div>
        `;

        return response;
    }

    static async handleActivate() {
        const payload = {
            userId: ActivateConfirm.paramUserId,
            email: ActivateConfirm.paramEmail,
            activationToken: ActivateConfirm.paramToken
        };
        const data = await FetchData.activate(payload);

        ActivateConfirm.requestProceedResponse(data);
    }

    static requestProceedResponse(props) {
        const isError = props.isError;

        if (isError) {
            const args = {
                content: props.content ?? Theme.translation?.login?.default?.fail,
                color: 'red'
            };

            Notification.add(args);

            return;
        }

        const args = {
            content: Theme.translation?.login?.e_mail_activate?.done,
            color: 'green'
        };

        Notification.add(args);

        setTimeout(() => {
            window.location.href = gbUrls.project;
        }, 1500);
    }

    static updateHtml() {
        ActivateConfirm.elComponent = document.getElementById(ActivateConfirm.idComponent);
    }
}
export class Component {
    static theme = 'purple--dark';


    static drawButton(props) {
        const id = props.id ? `id="${props.id}"` : '';
        const click = props.click;
        const label = props.label;
        const size = props.size ? props.size : 'regular';
        const color = props.color ? props.color : 'black';
        const isRounded = props.isRounded ? 'ds-button--rounded' : '';
        const isFull = props.isFull ? 'ds-button--full' : '';
        const response = `
            <button
                type="button"
                class="ds-button ds-button--${size} ${isRounded} ${isFull} ds-button--${color}"
                ${id}
                onclick="${click}"
            >${label}</button>
        `;

        return response;
    }

    static drawButtonProceed(props) {
        props.size = 'regular';
        props.isRounded = true;
        props.isFull = true;
        props.color = 'purple';

        const response = Component.drawButton(props);

        return response;
    }

    static drawGoogleButton(props) {
        const id = props.id ? `id="${props.id}"` : '';
        const label = props.label;
        const theme = 1;
        const color1 = theme === 1 ? '#ffff' : '#4285F4';
        const color2 = theme === 1 ? '#ffff' : '#34A853';
        const color3 = theme === 1 ? '#ffff' : '#FBBC05';
        const color4 = theme === 1 ? '#ffff' : '#EA4335';
        const icon = `
            <span class="ds-button__google-icon">
                <svg viewBox="0 0 18 18" width="12" height="12" xmlns="http://www.w3.org/2000/svg">
                    <path fill="${color1}" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62z"/>
                    <path fill="${color2}" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.33A9 9 0 0 0 9 18z"/>
                    <path fill="${color3}" d="M3.97 10.72a5.4 5.4 0 0 1 0-3.44V4.95H.96a9 9 0 0 0 0 8.1l3.01-2.33z"/>
                    <path fill="${color4}" d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58A9 9 0 0 0 .96 4.95l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58z"/>
                </svg>
            </span>
        `;
        const response = `
            <button
                type="button"
                class="ds-button ds-button--regular ds-button--rounded ds-button--full ds-button--google"
                ${id}
            >${icon}<span class="ds-button__google-label">${label}</span></button>
        `;

        return response;
    }

    static drawCaptcha() {
        const response = `
            <div class="ds-content__captcha">
                <div class="ds-row ds-center">
                    ${ds.Layout.drawCaptcha()}
                </div>
            </div>
        `;

        return response;
    }

    static drawFormField(props) {
        const args = props;

        args.css = this.cssReset;
        args.theme = Component.theme;

        const response = ds.Layout.drawField(args);

        return response;
    }

    static drawFormFieldEmail(props) {
        const response = ds.Layout.drawField({
            id: props.id,
            type: 'email',
            label: Theme.translation?.login?.default?.email,
            rule: 'emailInvalid',
            required: true,
            autoComplete: 'email',
            theme: Component.theme,
            css: this.cssReset
        });

        return response;
    }

    static drawFormFieldPassword(props) {
        const response = ds.Layout.drawField({
            id: props.id,
            type: 'password',
            label: props.label || Theme.translation?.login?.default?.password,
            rule: props.rule || 'fieldInvalid',
            hint: props.hint,
            required: true,
            autoComplete: props.autoComplete || 'current-password',
            isReadOnly: false,
            theme: Component.theme,
            css: this.cssReset
        });

        return response;
    }

    static get cssReset() {
        const response = 'ds-margin-reset--horizontal';

        return response;
    }

    static drawFormButtonBack(id) {
        const response = Component.drawLink({
            label: Theme.translation?.interface?.default?.back,
            id
        });

        return response;
    }

    static drawFormFieldCheckbox(props) {
        const id = props.id;
        const label = props.label;
        const checked = props.checked ? 'checked' : '';
        const response = `
            <div class="ds-row ds-form__field">
                <div class="ds-form__option">
                    <input id="${id}" name="checkbox" type="checkbox" ${checked}>
                    <label for="${id}" class="ds-checkbox-label ds-font--extra-small">${label}</label>
                </div>
            </div>
        `;

        return response;
    }

    static drawLink(props) {
        const id = props.id ? `id="${props.id}"` : '';
        const label = props.label;
        const response = `
            <div class="ds-row ds-form__field ds-right">
                <a href="javascript:void(0);" class="ds-link ds-link--extra-small ds-link--white" ${id}>
                    ${label}
                </a>
            </div>
        `;

        return response;
    }

    static drawPage(props) {
        const { title, id, content } = props;
        const urlSite = gbUrls.project;
        const urlImageSite = gbUrls.assetsImageSite;
        const response = `
            <div
                class="ds-card ds-card--big ds-card--${Component.theme}"
                id="${id}"
            >
                <header class="ds-card__header">
                    <div class="ds-row logo-wrapper">
                        <a href="${urlSite}">
                            <img
                                src="${urlImageSite}logo-3.svg"
                                alt="Ocotober 31"
                            >
                        </a>
                    </div>
                </header>
                <section class="ds-card__body">
                    <h2 class="ds-title">${title}</h2>
                    <form class="ds-form ds-form--${Component.theme}">
                        ${content}
                    </form>
                </section>
                <div class="ds-card__footer">
                </div>
            </div>
        `;

        return response;
    }

    static insertHTML(data) {
        const el = HTML.elMain;

        el.innerHTML = data;
    }
}
export class FetchData {
    static namespace = 'Login/';
    static controller = `${FetchData.namespace}Login`;

    static async fetchData(props) {
        const response = await ds.DataLoader.fetchData(props);

        return response;
    }

    static async requestEmailChange(props) {
        const { userId, newEmail, captcha } = props;
        const args = {
            controller: this.controller,
            action: 'requestEmailChange',
            userId,
            newEmail,
            captcha
        };
        const response = await this.fetchData(args);

        return response;
    }

    static async activate(props) {
        const { userId, email, activationToken } = props;
        const args = {
            controller: this.controller,
            action: 'activate',
            userId,
            email,
            activationToken
        };
        const response = await this.fetchData(args);

        return response;
    }

    static async resetPassword(props) {
        const { email, captcha } = props;
        const args = {
            controller: this.controller,
            action: 'resetPassword',
            email,
            captcha
        };
        const response = await this.fetchData(args);

        return response;
    }

    static async confirmResetPassword(props) {
        const { userId, email, token, password } = props;
        const args = {
            controller: this.controller,
            action: 'confirmResetPassword',
            userId,
            email,
            resetToken: token,
            password
        };
        const response = await this.fetchData(args);

        return response;
    }

    static async resendConfirmation(props) {
        const { email, captcha } = props;
        const args = {
            controller: this.controller,
            action: 'resendConfirmation',
            email,
            captcha
        };
        const response = await this.fetchData(args);

        return response;
    }

    static async signIn(props) {
        const { email, password, captcha } = props;
        const args = {
            controller: this.controller,
            action: 'signIn',
            email,
            password,
            captcha
        };
        const response = await this.fetchData(args);

        return response;
    }

    static async signInGoogle(props) {
        const { token } = props;
        const args = {
            controller: this.controller,
            action: 'signInGoogle',
            google_token: token
        };
        const response = await this.fetchData(args);

        return response;
    }

    static async signUp(props) {
        const { username, email, password, captcha, isTerms, isNewsletter, idReferral } = props;
        const args = {
            controller: this.controller,
            action: 'signUp',
            username,
            email,
            password,
            captcha,
            isTerms,
            isNewsletter,
            idReferral
        };
        const response = await this.fetchData(args);

        return response;
    }
}
export class ForgetPassword {
    static id = 'forget_password';
    static idFieldEmail = `${this.id}_field_email`;
    static idButtonProceed = `${this.id}_button_proceed`;
    static idlLinkBack = `${this.id}_link_back`;
    static frontEndClass = 'forgetPassword';

    static addEventListeners() {
        const data = [
            {
                el: this.elButtonProceed,
                handler: this.handleProceed
            },
            {
                el: this.elButtonSignUp,
                handler: SignUp.draw
            },
            {
                el: this.elLinkBack,
                handler: Theme.handleBackMain
            },
            {
                el: this.elFieldEmail,
                event: 'input',
                handler: Theme.handleChange
            },
            {
                el: this.elFieldEmail,
                event: 'onchange',
                handler: Theme.handleChange
            },
        ];

        data.forEach((index) => {
            ds.Helper.addEventListener(index);
        });
    }

    static draw() {
        const page = Component.drawPage({
            id: this.id,
            title: Theme.translation?.login?.default?.forget,
            content: ForgetPassword.drawPage()
        });

        Component.insertHTML(page);
        ds.Helper.renderCaptcha();

        ForgetPassword.updateHtml();
        ForgetPassword.addEventListeners();
        ForgetPassword.elFieldEmail.focus();
    }

    static drawPage() {
        const fieldEmail = Component.drawFormFieldEmail({
            id: this.idFieldEmail
        });
        const buttonProceed = Component.drawButtonProceed({
            id: this.idButtonProceed,
            label: Theme.translation?.login?.default?.send,
        });
        const linkBack = Component.drawFormButtonBack(this.idlLinkBack);
        const response = `
            ${fieldEmail}
            ${Component.drawCaptcha()}
            <div class="ds-page__footer">
                ${buttonProceed}
            </div>
            ${linkBack}
        `;

        return response;
    }

    static handleProceed() {
        const isValidEmail = Theme.validateForm(ForgetPassword.elFieldEmail, 'emailInvalid');
        const isCaptcha = ds.Helper.validateCaptcha();
        const isValidForm = isValidEmail && isCaptcha;
        const propsButton = {
            button: ForgetPassword.elButtonProceed,
            action: true
        };

        if (isValidForm) {
            ds.Helper.toggleButtonEnabled(propsButton);

            return ForgetPassword.requestProceed();
        }
    }

    static async requestProceed() {
        const email = this.elFieldEmail.value;
        const captcha = ds.Helper.getCaptchaResponse();
        const payload = {
            email,
            captcha
        };
        const data = await FetchData.resetPassword(payload);

        this.requestProceedResponse(data);
    }

    static requestProceedResponse(props) {
        const content = props.content;
        const isError = props.isError;
        const propsButton = {
            button: this.elButtonProceed,
            action: false
        };
        const args = {
            isError,
            propsButton,
            content,
        };

        if (props === 'done') {
            args.code = 'emailSent';
            args.isNotification = true;
        }

        Theme.requestProceedResponse(args);
    }

    static updateHtml() {
        this.elFieldEmail = document.getElementById(this.idFieldEmail);
        this.elButtonProceed = document.getElementById(this.idButtonProceed);
        this.elLinkBack = document.getElementById(this.idlLinkBack);
    }
}
export class HTML {
    static idElMain = 'main';

    static init() {
        this.update();
    }

    static update() {
        this.elMain = document.getElementById(HTML.idElMain);
    }
}
const nameSpace = 'lo'; // eslint-disable-line no-unused-vars
let deps = {}; // eslint-disable-line no-unused-vars
let ds; // eslint-disable-line no-unused-vars
export class Management {
    static init(props) {
        deps = props;
        ds = deps.ds;
        ds.Helper.addEventListenerDOM(this);
    }

    static async handleLoaded() {
        HTML.init();
        Theme.init();
        ds.Notification.init();
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
        const args = {
            content,
            color,
            position,
            size
        };

        ds.Notification.add(args);
    }
}
export class ResendConfirmation {
    static id = 'resend_confirmation';
    static idFieldEmail = `${this.id}_field_email`;
    static idButtonProceed = `${this.id}_button_proceed`;
    static idlLinkBack = `${this.id}_button_back`;
    static frontEndClass = 'resendConfirmation';

    static addEventListeners() {
        const data = [
            {
                el: this.elButtonProceed,
                handler: this.handleProceed
            },
            {
                el: this.elLinkBack,
                handler: Theme.handleBackMain
            },
            {
                el: this.elFieldEmail,
                event: 'input',
                handler: Theme.handleChange
            },
            {
                el: this.elFieldEmail,
                event: 'onchange',
                handler: Theme.handleChange
            },
        ];

        data.forEach((index) => {
            ds.Helper.addEventListener(index);
        });
    }

    static draw() {
        const page = Component.drawPage({
            id: ResendConfirmation.id,
            title: Theme.translation?.login?.default?.resend,
            content: ResendConfirmation.drawPage()
        });

        Component.insertHTML(page);
        ds.Helper.renderCaptcha();

        ResendConfirmation.updateHtml();
        ResendConfirmation.addEventListeners();
        ResendConfirmation.elFieldEmail.focus();
    }

    static drawPage() {
        const fieldEmail = Component.drawFormFieldEmail({
            id: this.idFieldEmail
        });
        const buttonProceed = Component.drawButtonProceed({
            id: this.idButtonProceed,
            label: Theme.translation?.login?.default?.send,
        });
        const linkBack = Component.drawFormButtonBack(this.idlLinkBack);
        const response = `
            ${fieldEmail}
            ${Component.drawCaptcha()}
            <div class="ds-page__footer">
                ${buttonProceed}
            </div>
            ${linkBack}
        `;

        return response;
    }

    static handleProceed() {
        const isValidEmail = Theme.validateForm(ResendConfirmation.elFieldEmail, 'emailInvalid');
        const isCaptcha = ds.Helper.validateCaptcha();
        const isValidForm = isValidEmail && isCaptcha;
        const propsButton = {
            button: ResendConfirmation.elButtonProceed,
            action: true
        };

        if (isValidForm) {
            ds.Helper.toggleButtonEnabled(propsButton);
            return ResendConfirmation.requestProceed();
        }
    }

    static async requestProceed() {
        const email = ResendConfirmation.elFieldEmail.value;
        const captcha = ds.Helper.getCaptchaResponse();
        const payload = {
            email,
            captcha
        };
        const data = await FetchData.resendConfirmation(payload);

        ResendConfirmation.requestProceedResponse(data);
    }

    static requestProceedResponse(props) {
        const content = props.content;
        const isError = props.isError;
        const propsButton = {
            button: ResendConfirmation.elButtonProceed,
            action: false
        };
        const args = {
            isError,
            propsButton,
            content
        };

        if (props === 'done') {
            args.code = 'emailSent';
            args.isNotification = true;
        }

        Theme.requestProceedResponse(args);
    }

    static updateHtml() {
        this.elFieldEmail = document.getElementById(this.idFieldEmail);
        this.elButtonProceed = document.getElementById(this.idButtonProceed);
        this.elLinkBack = document.getElementById(this.idlLinkBack);
    }
}
export class ResetPassword {
    static id = 'reset_password';
    static idFieldPassword = `${this.id}_field_password`;
    static idButtonProceed = `${this.id}_button_proceed`;
    static idlLinkBack = `${this.id}_button_back`;
    static frontEndClass = 'resetPassword';

    static addEventListeners() {
        const data = [
            {
                el: this.elButtonProceed,
                handler: this.handleProceed
            },
            {
                el: this.elLinkBack,
                handler: Theme.handleBackMain
            },
            {
                el: this.elFieldEmail,
                event: 'input',
                handler: Theme.handleChange
            },
            {
                el: this.elFieldEmail,
                event: 'onchange',
                handler: Theme.handleChange
            },
        ];

        data.forEach((index) => {
            ds.Helper.addEventListener(index);
        });
    }

    static draw() {
        const page = Component.drawPage({
            id: this.id,
            title: Theme.translation?.login?.default?.password_reset,
            content: ResetPassword.drawPage()
        });

        Component.insertHTML(page);
        ds.Helper.renderCaptcha();

        ResetPassword.updateHtml();
        ResetPassword.addEventListeners();
        ResetPassword.elFieldPassword.focus();
    }

    static drawPage() {
        const fieldPassword = Component.drawFormFieldPassword({
            id: this.idFieldPassword,
            label: Theme.translation?.login?.default?.password_new
        });
        const buttonProceed = Component.drawButtonProceed({
            id: this.idButtonProceed,
            label: Theme.translation?.login?.default?.send,
            click: `${this.frontEndClass}.handleProceed();`
        });
        const linkBack = Component.drawFormButtonBack();
        const response = `
            ${fieldPassword}
            ${Component.drawCaptcha()}
            <div class="ds-page__footer">
                ${buttonProceed}
            </div>
            ${linkBack}
        `;

        return response;
    }

    static handleProceed() {
        const isValidEmail = Theme.validateForm(this.elFieldEmail, 'emailInvalid');
        const isCaptcha = ds.Helper.validateCaptcha();
        const isValidForm = isValidEmail && isCaptcha;
        const propsButton = {
            button: this.elButtonProceed,
            action: true
        };

        if (isValidForm) {
            ds.Helper.toggleButtonEnabled(propsButton);

            return this.requestProceed();
        }
    }

    static async requestProceed() {
        const email = this.elFieldEmail.value;
        const captcha = ds.Helper.getCaptchaResponse();
        const payload = {
            email,
            captcha
        };
        const data = await FetchData.resetPassword(payload);

        this.requestProceedResponse(data);
    }

    static requestProceedResponse(props) {
        const content = props.content;
        const isError = props.isError;
        const propsButton = {
            button: this.elButtonProceed,
            action: false
        };
        const args = {
            isError,
            propsButton,
            content
        };

        if (props === 'done') {
            args.code = 'emailSent';
            args.isNotification = true;
        }

        Theme.requestProceedResponse(args);
    }

    static updateHtml() {
        this.elFieldPassword = document.getElementById(this.idFieldPassword);
        this.elButtonProceed = document.getElementById(this.idButtonProceed);
        this.elLinkBack = document.getElementById(this.idlLinkBack);
    }
}
export class ResetPasswordConfirm {
    static id = 'reset_password_confirm';
    static idComponent = `${this.id}_component`;
    static idLinkBack = `${this.id}_link_back`;
    static frontEndClass = 'resetPasswordConfirm';

    static get paramUserId() {
        return ds.Helper.getUrlParameter('id');
    }

    static get paramEmail() {
        return ds.Helper.getUrlParameter('e');
    }

    static get paramToken() {
        return ds.Helper.getUrlParameter('t');
    }

    static hasToken() {
        const userId = ResetPasswordConfirm.paramUserId;
        const email = ResetPasswordConfirm.paramEmail;
        const token = ResetPasswordConfirm.paramToken;

        return Boolean(userId && email && token);
    }

    static addEventListeners() {
        const data = [
            {
                el: ResetPasswordConfirm.elLinkBack,
                handler: Theme.handleBackMain
            },
            {
                el: ResetPasswordConfirm.elComponent,
                event: 'passwordResetSubmit',
                handler: ResetPasswordConfirm.handleSubmit
            }
        ];

        data.forEach((index) => {
            ds.Helper.addEventListener(index);
        });
    }

    static draw() {
        const page = Component.drawPage({
            id: ResetPasswordConfirm.id,
            title: Theme.translation?.login?.default?.password_reset,
            content: ResetPasswordConfirm.drawPage()
        });

        Component.insertHTML(page);

        ResetPasswordConfirm.updateHtml();
        ResetPasswordConfirm.addEventListeners();
    }

    static drawPage() {
        const component = `
            <${ds.Components.componentPasswordReset}
                id="${ResetPasswordConfirm.idComponent}"
                mode="token"
                button-size="regular"
                button-is-rounded="true"
                button-is-full="true"
            ></${ds.Components.componentPasswordReset}>
        `;
        const linkBack = Component.drawFormButtonBack(ResetPasswordConfirm.idLinkBack);
        const response = `
            ${component}
            <div class="ds-margin-top--regular">
                ${linkBack}
            </div>
        `;

        return response;
    }

    static async handleSubmit(event) {
        const { userId, email, token, password } = event.detail;
        const propsButton = {
            button: ResetPasswordConfirm.elComponent?.shadowRoot?.querySelector(ds.Components.componentButton),
            action: true
        };

        ds.Helper.toggleButtonEnabled(propsButton);

        const payload = {
            userId,
            email,
            token,
            password
        };
        const data = await FetchData.confirmResetPassword(payload);

        ResetPasswordConfirm.requestProceedResponse(data);
    }

    static requestProceedResponse(props) {
        const isError = props.isError;
        const propsButton = {
            button: ResetPasswordConfirm.elComponent?.shadowRoot?.querySelector(ds.Components.componentButton),
            action: false
        };

        if (isError) {
            ds.Helper.toggleButtonEnabled(propsButton);

            const args = {
                content: props.content ?? Theme.translation?.login?.default?.fail,
                color: 'red'
            };

            Notification.add(args);

            return;
        }

        const args = {
            content: Theme.translation?.login?.default?.password_changed,
            color: 'green'
        };

        Notification.add(args);

        setTimeout(() => {
            Theme.handleBackMain();
        }, 1500);
    }

    static updateHtml() {
        ResetPasswordConfirm.elComponent = document.getElementById(ResetPasswordConfirm.idComponent);
        ResetPasswordConfirm.elLinkBack = document.getElementById(ResetPasswordConfirm.idLinkBack);
    }
}

export class SignIn {
    static id = 'sign_in';
    static idFieldEmail = `${this.id}_field_email`;
    static idFieldPassword = `${this.id}_field_password`;
    static idButtonProceed = `${this.id}_button_proceed`;
    static idButtonForget = `${this.id}_button_forget`;
    static idButtonSignUp = `${this.id}_button_sign_up`;
    static idButtonPlayGuest = `${this.id}_button_play_guest`;
    static idButtonGoogle = `${this.id}_button_google`;
    static frontEndClass = 'signIn';

    static addEventListeners() {
        const data = [
            {
                el: this.elButtonProceed,
                handler: this.handleProceed
            },
            {
                el: this.elButtonForget,
                handler: ForgetPassword.draw
            },
            {
                el: this.elButtonSignUp,
                handler: SignUp.draw
            },
            {
                el: this.elButtonPlayGuest,
                handler: this.handlePlayGuest
            },
            {
                el: this.elButtonGoogle,
                handler: this.handleGoogle
            },
            {
                el: this.elFieldEmail,
                event: 'input',
                handler: Theme.handleChange
            },
            {
                el: this.elFieldEmail,
                event: 'onchange',
                handler: Theme.handleChange
            },
            {
                el: this.elFieldPassword,
                event: 'input',
                handler: Theme.handleChange
            },
            {
                el: this.elFieldPassword,
                event: 'onchange',
                handler: Theme.handleChange
            },
        ];

        data.forEach((index) => {
            ds.Helper.addEventListener(index);
        });
    }

    static draw() {
        const page = Component.drawPage({
            id: this.id,
            title: Theme.translation?.interface?.default?.login,
            content: SignIn.drawPage()
        });

        Component.insertHTML(page);
        ds.Helper.renderCaptcha();

        SignIn.updateHtml();
        SignIn.addEventListeners();
        SignIn.prepareGoogle();
        SignIn.elFieldEmail.focus();
    }

    static drawPage() {
        const fieldEmail = Component.drawFormFieldEmail({
            id: this.idFieldEmail
        });
        const fieldPassword = Component.drawFormFieldPassword({
            id: this.idFieldPassword
        });

        const buttonProceed = Component.drawButtonProceed({
            id: this.idButtonProceed,
            label: Theme.translation?.interface?.default?.login
        });
        const linkForget = Component.drawLink({
            id: this.idButtonForget,
            label: Theme.translation?.login?.default?.forget
        });
        const linkSignUp = Component.drawLink({
            id: this.idButtonSignUp,
            label: Theme.translation?.login?.default?.sign_up,
        });
        const linkGuest = Component.drawLink({
            id: this.idButtonPlayGuest,
            label: Theme.translation?.login?.default?.play_guest,
        });
        const buttonGoogle = Component.drawGoogleButton({
            id: this.idButtonGoogle,
            label: Theme.translation.login.default.google
        });
        const response = `
            ${fieldEmail}
            ${fieldPassword}
            ${linkForget}
            <div class="ds-center">
                ${ds.Layout.drawCaptcha()}
            </div>
            <div class="ds-page__footer">
                ${buttonProceed}
                ${buttonGoogle}
            </div>
            ${linkSignUp}
            ${linkGuest}
        `;

        return response;
    }

    static handleProceed() {
        const isValidEmail = Theme.validateForm(SignIn.elFieldEmail, 'emailInvalid');
        const isValidPassword = Theme.validateForm(SignIn.elFieldPassword, 'fieldInvalid');
        const isCaptcha = ds.Helper.validateCaptcha();
        const isValidForm = isValidEmail && isValidPassword && isCaptcha;

        if (isValidForm) {
            const propsButton = {
                button: SignIn.elButtonProceed,
                action: true
            };

            ds.Helper.toggleButtonEnabled(propsButton);

            return SignIn.requestProceed();
        }
    }

    static async requestProceed() {
        const email = this.elFieldEmail.value;
        const password = this.elFieldPassword.value;
        const captcha = ds.Helper.getCaptchaResponse();
        const payload = {
            email,
            password,
            captcha
        };
        const data = await FetchData.signIn(payload);

        this.requestProceedResponse(data);
    }

    static requestProceedResponse(props) {
        const isError = props.isError;
        const propsButton = {
            button: SignIn.elButtonProceed,
            action: false
        };

        ds.Helper.toggleButtonEnabled(propsButton);

        if (isError) {
            ds.Helper.resetCaptcha();

            const args = {
                content: Theme.translation?.login?.default?.fail,
                color: 'red'
            };

            Notification.add(args);
        } else {
            Theme.redirectPlay();
        }
    }

    static handlePlayGuest() {
        const login = ds.Statics.account.guest;

        ds.FormField.setValue(SignIn.elFieldEmail, login.email);
        ds.FormField.setValue(SignIn.elFieldPassword, login.password);

        SignIn.elButtonProceed.click();
    }

    static googleInitialized = false;
    static googleOverlay = null;

    static prepareGoogle() {
        const clientId = window.gbGoogleClientId;

        if (!clientId) {
            return;
        }

        if (typeof google === 'undefined' || !google.accounts || !google.accounts.id) {
            SignIn.loadGoogleScript(() => SignIn.renderGoogleButton(clientId));

            return;
        }

        SignIn.renderGoogleButton(clientId);
    }

    static renderGoogleButton(clientId) {
        if (!SignIn.googleInitialized) {
            google.accounts.id.initialize({
                client_id: clientId,
                callback: SignIn.handleGoogleResponse
            });
            SignIn.googleInitialized = true;
        }

        const button = SignIn.elButtonGoogle;

        if (!button || (SignIn.googleOverlay && SignIn.googleOverlay.isConnected)) {
            return;
        }

        button.style.position = 'relative';

        const overlay = document.createElement('div');

        overlay.className = 'ds-button--google-overlay';

        button.appendChild(overlay);

        google.accounts.id.renderButton(overlay, {
            type: 'standard',
            theme: 'outline',
            size: 'large',
            width: button.offsetWidth || 240
        });

        SignIn.googleOverlay = overlay;
    }

    static handleGoogle() {
        const clientId = window.gbGoogleClientId;

        if (!clientId) {
            return SignIn.notifyLoginFailGoogle(Theme.translation.login.default.google_unavailable);
        }

        SignIn.prepareGoogle();
    }

    static loadGoogleScript(callback) {
        const script = document.createElement('script');

        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        script.onload = callback;

        document.head.appendChild(script);
    }

    static handleGoogleResponse(response) {
        if (!response || !response.credential) {
            return SignIn.notifyLoginFailGoogle(Theme.translation.login.default.google_fail);
        }

        const propsButton = {
            button: SignIn.elButtonGoogle,
            action: true
        };

        ds.Helper.toggleButtonEnabled(propsButton);

        return SignIn.requestGoogle(response.credential);
    }

    static notifyLoginFailGoogle(content) {
        const args = {
            content,
            color: 'red'
        };

        Notification.add(args);
    }

    static async requestGoogle(token) {
        const data = await FetchData.signInGoogle({ token });
        const propsButton = {
            button: SignIn.elButtonGoogle,
            action: false
        };

        ds.Helper.toggleButtonEnabled(propsButton);

        if (data && data.isError) {
            SignIn.notifyLoginFailGoogle(Theme.translation.login.default.google_fail);
        } else {
            Theme.redirectPlay();
        }
    }

    static updateHtml() {
        this.elFieldEmail = document.getElementById(this.idFieldEmail);
        this.elFieldPassword = document.getElementById(this.idFieldPassword);

        this.elButtonProceed = document.getElementById(this.idButtonProceed);
        this.elButtonForget = document.getElementById(this.idButtonForget);
        this.elButtonSignUp = document.getElementById(this.idButtonSignUp);
        this.elButtonPlayGuest = document.getElementById(this.idButtonPlayGuest);
        this.elButtonGoogle = document.getElementById(this.idButtonGoogle);
    }
}
export class SignUp {
    static id = 'sign_up';
    static idFieldUserName = `${this.id}_field_user`;
    static idFieldEmail = `${this.id}_field_email`;
    static idFieldPassword = `${this.id}_field_password`;
    static idFieldNewsletter = `${this.id}_field_newsletter`;
    static idFieldTerms = `${this.id}_field_terms`;
    static idButtonProceed = `${this.id}_button_proceed`;
    static idButtonResend = `${this.id}_button_resend`;
    static idLinkTerms = `${this.id}_button_terms`;
    static idlLinkBack = `${this.id}_button_back`;
    static frontEndClass = 'signUp';

    static addEventListeners() {
        const data = [
            {
                el: this.elFieldEmail,
                event: 'input',
                handler: Theme.handleChange
            },
            {
                el: this.elFieldEmail,
                event: 'onchange',
                handler: Theme.handleChange
            },
            {
                el: this.elFieldUserName,
                event: 'input',
                handler: Theme.handleChange
            },
            {
                el: this.elFieldUserName,
                event: 'onchange',
                handler: Theme.handleChange
            },
            {
                el: this.elFieldPassword,
                event: 'input',
                handler: Theme.handleChange
            },
            {
                el: this.elFieldPassword,
                event: 'onchange',
                handler: Theme.handleChange
            },

            {
                el: this.elButtonProceed,
                handler: this.handleProceed
            },
            {
                el: this.elButtonResend,
                handler: ResendConfirmation.draw
            },
            {
                el: this.elLinkBack,
                handler: Theme.handleBackMain
            },
            {
                el: this.elLinkTerms,
                handler: this.handleTerms
            },
        ];

        data.forEach((index) => {
            ds.Helper.addEventListener(index);
        });
    }

    static draw() {
        const page = Component.drawPage({
            id: SignUp.id,
            title: Theme.translation?.login?.default?.sign_up,
            content: SignUp.drawPage()
        });

        Component.insertHTML(page);
        ds.Helper.renderCaptcha();

        SignUp.updateHtml();
        SignUp.addEventListeners();
        SignUp.elFieldUserName.focus();
    }

    static drawPage() {
        const fieldUser = Component.drawFormField({
            id: this.idFieldUserName,
            type: 'text',
            label: Theme.translation?.login?.default?.username_visible,
            required: true
        });
        const fieldEmail = Component.drawFormFieldEmail({
            id: this.idFieldEmail,
        });
        const fieldPassword = Component.drawFormFieldPassword({
            id: this.idFieldPassword,
            rule: 'passwordStrongInvalid',
            hint: Theme.translation?.login?.response?.password_hint ?? Theme.translation?.login?.default?.password_hint
        });
        const fieldNewsletter = Component.drawFormFieldCheckbox({
            id: this.idFieldNewsletter,
            checked: true,
            label: Theme.translation?.login?.default?.sign_up_accept_newsletter,
        });
        const fieldTerms = Component.drawFormFieldCheckbox({
            id: this.idFieldTerms,
            checked: true,
            label: Theme.translation?.login?.default?.sign_up_accept_terms,
            required: true
        });
        const buttonTerms = Component.drawLink({
            id: this.idLinkTerms,
            label: Theme.translation?.login?.default?.terms,
        });
        const buttonProceed = Component.drawButtonProceed({
            id: this.idButtonProceed,
            label: Theme.translation?.login?.default?.register,
        });
        const linkResend = Component.drawLink({
            id: this.idButtonResend,
            label: Theme.translation?.login?.default?.resend,
        });
        const linkBack = Component.drawFormButtonBack(this.idlLinkBack);
        const captcha = Component.drawCaptcha();
        const response = `
            ${fieldUser}
            ${fieldEmail}
            ${fieldPassword}
            ${fieldNewsletter}
            ${fieldTerms}
            ${captcha}
            <div class="ds-page__footer">
                ${buttonProceed}
            </div>
            ${linkResend}
            ${buttonTerms}
            ${linkBack}
        `;

        return response;
    }

    static handleProceed() {
        const isValidEmail = SignUp.validateForm();
        const isCaptcha = ds.Helper.validateCaptcha();
        const isValidForm = isValidEmail && isCaptcha;
        const propsButton = {
            button: SignUp.elButtonProceed,
            action: true
        };

        if (isValidForm) {
            ds.Helper.toggleButtonEnabled(propsButton);

            return SignUp.requestProceed();
        }
    }

    static handleTerms() {
        const url = gbUrlsSite['terms'];

        window.open(url, '_blank');
    }

    static async requestProceed() {
        const email = this.elFieldEmail.value;
        const username = this.elFieldUserName.value;
        const password = this.elFieldPassword.value;
        const captcha = ds.Helper.getCaptchaResponse();
        const isTerms = this.elFieldTerms.checked;
        const isNewsletter = this.elFieldNewsletter.checked;
        const idReferral = ds.Helper.getUrlParameter('ref');
        const payload = {
            username,
            email,
            password,
            captcha,
            isTerms,
            isNewsletter,
            idReferral,
        };
        const data = await FetchData.signUp(payload);

        this.requestProceedResponse(data);
    }

    static requestProceedResponse(props) {
        const content = props.content;
        const isError = props.isError;
        const propsButton = {
            button: this.elButtonProceed,
            action: false
        };
        const args = {
            isError,
            propsButton,
            content
        };

        if (props === 'done') {
            args.code = 'emailSent';
            args.isNotification = true;
        }

        Theme.requestProceedResponse(args);
    }

    static updateHtml() {
        this.elFieldUserName = document.getElementById(this.idFieldUserName);
        this.elFieldEmail = document.getElementById(this.idFieldEmail);
        this.elFieldPassword = document.getElementById(this.idFieldPassword);
        this.elFieldNewsletter = document.getElementById(this.idFieldNewsletter);
        this.elFieldTerms = document.getElementById(this.idFieldTerms);

        this.elButtonProceed = document.getElementById(this.idButtonProceed);
        this.elButtonResend = document.getElementById(this.idButtonResend);
        this.elLinkBack = document.getElementById(this.idlLinkBack);
        this.elLinkTerms = document.getElementById(this.idLinkTerms);
    }

    static validateForm() {
        const isValidUserName = Theme.validateForm(this.elFieldUserName, 'usernameInvalid');
        const isValidEmail = Theme.validateForm(this.elFieldEmail, 'emailInvalid');
        const isValidPassword = Theme.validateForm(this.elFieldPassword, 'passwordStrongInvalid');
        const isValidTerms = this.elFieldTerms.checked;
        const isValidForm = isValidUserName && isValidEmail && isValidPassword && isValidTerms;
        let response = true;

        if (!isValidForm) response = false;
        if (!isValidTerms) this.elFieldTerms.focus();

        return response;
    }
}
export class Theme {
    static controller = 'Login/';
    static translation;

    static handleBackMain() {
        SignIn.draw();
    }

    static handleChange(event) {
        const el = event.target;
        const dataSet = el.dataset;
        const rule = dataSet.rule;
        let text = '';

        const isValidForm = Theme.validateForm(el, rule);
        if (!isValidForm) {
            text = Theme.getValidationMessage(rule);
        }

        const elValidation = el.parentNode.querySelector('.form__input-validation');
        if (elValidation) elValidation.innerText = text;
    }

    static getValidationMessage(rule) {
        if (rule === 'passwordStrongInvalid') {
            const message = Theme.translation?.login?.response?.password_strong_invalid
                ?? Theme.translation?.login?.default?.password_strong_invalid;

            if (message) return message;
        }

        return ds.Code.getCode(rule).translation;
    }

    static handleShowPassword(target) {
        const iconAttrribute = 'xlink:href';
        const elInput = target.parentNode.querySelector('input');
        const elIcon = target.querySelector('svg use');
        const iconAttribute = elIcon.getAttribute(iconAttrribute);
        const split = iconAttribute.split('#');
        const type = elInput.type;
        const typeNew = type !== 'password' ? 'password' : 'text';
        const icon = type !== 'password' ? 'eye_close' : 'eye_open';
        const iconHref = `${split[0]}#${icon}`;

        elInput.type = typeNew;
        elIcon.setAttribute(iconAttrribute, iconHref);
    }

    static storage = 'redirect';

    static async init() {
        const from = ds.Helper.getUrlParameter('from');
        if (from) {
            ds.Storage.setValue({ target: Theme.storage, value: from });
        }

        ds.Translation.init();
        await ds.Translation.translate('interface');
        await ds.Translation.translate('login');
        await ds.Translation.translate('default');
        Theme.translation = ds.Translation?.translation;

        const path = window.location.pathname;

        if (ActivateConfirm.hasToken() && path.includes('/activate/')) {
            ActivateConfirm.draw();

            return;
        }

        if (ResetPasswordConfirm.hasToken()) {
            ResetPasswordConfirm.draw();

            return;
        }

        SignIn.draw();
    }

    static getPage() {
        const page = ds.Helper.getUrlParameter('page');
        const validatePage = (target) => page === target;
        const pageReset = ResetPassword.frontEndClass;
        const pageDefault = SignIn.frontEndClass;
        let response = pageDefault;

        if (validatePage(pageReset)) response = pageReset;
        return response;
    }

    static redirectPlay() {
        const page = ds.Storage.getValue(Theme.storage) || 'play';
        ds.Storage.removeValue(Theme.storage);
        const url = gbUrlsSite[page];
        window.location.href = url || `./${gbLanguage}/${page}/`;
    }

    static requestProceedResponse(props) {
        const isError = props['isError'];
        const propsButton = props['propsButton'];

        if (isError) {
            ds.Helper.resetCaptcha();
            ds.Helper.toggleButtonEnabled(propsButton);
        }
        ds.Helper.handleResponse(props);
    }

    static validateForm(field, rule) {
        let isValid;

        switch (rule) {
            case 'emailInvalid':
                isValid = ds.Validation.validateEmail(field);
                break;
            case 'passwordInvalid':
                isValid = ds.Validation.validatePassword(field);
                break;
            case 'passwordStrongInvalid':
                isValid = ds.Validation.validateStrongPassword(field);
                break;
            case 'usernameInvalid':
            case 'fieldInvalid':
            default:
                isValid = ds.Validation.validateUsername(field);
                break;
        }

        return isValid;
    }
}