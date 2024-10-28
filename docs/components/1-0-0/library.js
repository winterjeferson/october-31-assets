class Components {
    static buildAttribute(props) {
        const label = props.label;
        const value = props.value;

        if (!value) return '';
        return `${label}="${value}"`;
    }

    static buildCss(props) {
        const context = props.context;
        const prefix = `ds-${props.cssPrefix}`;
        const attributeTheme = context.getAttribute('theme');
        const attributeIsProportional = context.getAttribute('is-proportional');
        const attributeIsRounded = context.getAttribute('is-rounded');
        const attributeSize = context.getAttribute('size');

        const rounded = attributeIsRounded ? `${prefix}--rounded` : '';
        const proportional = attributeIsProportional ? `${prefix}--proportional` : '';
        const theme = attributeTheme ? `${prefix}--${attributeTheme}` : '';
        const size = attributeSize ? `${prefix}--${attributeSize}` : '';
        const value = `${prefix} ${theme} ${size} ${proportional} ${rounded}`;
        const args = {
            label: 'class',
            value,
        };
        return this.buildAttribute(args);
    }

    static dispatch(props) {
        const event = props.event;
        const context = props.context;
        const detail = props;

        context.dispatchEvent(new CustomEvent(event, {
            detail,
            bubbles: true,
            composed: true
        }));
    }

    static loadStyles(shadowRoot, file = fileDesignSystem) {
        const globalStyles = Array.from(document.styleSheets).find(
            sheet => sheet.href && sheet.href.includes(file)
        );
        const isValid = globalStyles && shadowRoot;
        let style = '';

        if (isValid) {
            try {
                const cssRules = Array.from(globalStyles.cssRules).map(rule => rule.cssText).join(' ');

                style = cssRules;
            } catch (error) {
                console.error('Failed to apply global styles:', error);
            }
        }
        return style;
    }

    static render(props, component) {
        const shadowRoot = props.context.shadowRoot;
        const styles = this.loadStyles(shadowRoot);
        const response = `<style>${styles}</style>${component}`;

        shadowRoot.innerHTML = response;
    }
}