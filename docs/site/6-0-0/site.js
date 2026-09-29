export class AdminAdvertising {
    static advertisings = [];
    static columns = ['id', 'id_user', 'date_register', 'kind', 'link', 'status'];
    static currentStatusFilter = '';
    static id = 'admin_advertising';
    static kindLabels = {
        1: 'YouTube',
        2: 'Site',
        3: 'Social',
    };
    static statusLabels = {
        0: 'Pending',
        1: 'Approved',
    };

    static addEventListeners() {
        const data = [
            {
                el: this.elRefresh,
                handler: this.clickRefresh
            },
            {
                el: this.elStatus,
                event: 'change',
                handler: this.changeFilter
            },
        ];
        data.forEach((index) => {
            index.context = this;
            ds.Helper.addEventListener(index);
        });
    }

    static addEventListenersRows() {
        const buttons = this.elPage.querySelectorAll('[data-advertising-approve]');

        buttons.forEach((el) => {
            ds.Helper.addEventListener({
                el,
                context: this,
                handler: this.clickApprove
            });
        });
    }

    static async changeFilter(event) {
        this.currentStatusFilter = event.target.value;
        this.drawRows();
    }

    static async clickApprove(event) {
        const id = event.currentTarget.dataset.advertisingApprove;
        const response = await FetchData.approveAdvertising(id);

        if (response?.isError) {
            return;
        }

        ds.Notification.add({
            content: 'Advertising approved.',
            color: 'green'
        });

        await this.loadData();
    }

    static async clickRefresh() {
        await this.loadData();
    }

    static drawAction(advertising) {
        const id = ds.Helper.escapeHTML(advertising.id);

        if (String(advertising.status) === '1') {
            return 'Approved';
        }

        return `
            <button
                type='button'
                class='ds-button ds-button--small ds-button--green'
                data-advertising-approve='${id}'
            >Approve</button>
        `;
    }

    static drawCell(advertising, column) {
        const value = this.getLabel(column, advertising[column] ?? '');

        return ds.Helper.escapeHTML(value);
    }

    static drawRows() {
        const rows = this.getFiltered();
        let html = '';

        rows.forEach((advertising) => {
            html += `<tr data-id='${ds.Helper.escapeHTML(advertising.id)}'>`;

            this.columns.forEach((column) => {
                html += `<td>${this.drawCell(advertising, column)}</td>`;
            });

            html += `<td>${this.drawAction(advertising)}</td>`;
            html += '</tr>';
        });

        if (html === '') {
            const colspan = this.columns.length + 1;
            html = `<tr><td colspan='${colspan}'>No advertisings found.</td></tr>`;
        }

        this.elTbody.innerHTML = html;
        this.addEventListenersRows();
    }

    static drawStatusOptions() {
        const statuses = [...new Set(this.advertisings.map((index) => index.status))].sort();
        let html = '<option value=\'\'>All</option>';

        statuses.forEach((status) => {
            const value = ds.Helper.escapeHTML(status);
            const label = this.statusLabels[status] ?? status;
            const selected = String(this.currentStatusFilter) === String(status) ? 'selected' : '';
            html += `<option value='${value}' ${selected}>${ds.Helper.escapeHTML(label)}</option>`;
        });

        this.elStatus.innerHTML = html;
        this.elStatus.value = this.currentStatusFilter;
    }

    static getFiltered() {
        if (this.currentStatusFilter === '') {
            return this.advertisings;
        }

        return this.advertisings.filter((index) => String(index.status) === String(this.currentStatusFilter));
    }

    static getLabel(column, value) {
        if (column === 'kind') {
            return this.kindLabels[value] ?? value;
        }

        if (column === 'status') {
            return this.statusLabels[value] ?? value;
        }

        return value;
    }

    static init() {
        this.updateHTML();
        if (!this.elPage) return;

        this.addEventListeners();
        this.loadData();
    }

    static async loadData() {
        const response = await FetchData.getAdvertisings();

        if (response?.isError) {
            return;
        }

        this.advertisings = Array.isArray(response) ? response : [];
        this.drawStatusOptions();
        this.drawRows();
    }

    static updateHTML() {
        this.elPage = document.getElementById(this.id);
        if (!this.elPage) return;
        this.elRefresh = document.getElementById(`${this.id}_refresh`);
        this.elStatus = document.getElementById(`${this.id}_status`);
        this.elTbody = document.getElementById(`${this.id}_tbody`);
    }
}

export class AdminBugReport {
    static bugs = [];
    static columns = [
        'id',
        'title_pt',
        'title_en',
        'description_pt',
        'description_en',
        'description_user',
        'browser',
        'operational_system',
        'game_patch',
        'date_register',
    ];
    static currentStatusFilter = '2';
    static editableColumns = [
        'title_pt',
        'title_en',
        'description_pt',
        'description_en',
        'description_user',
        'browser',
        'operational_system',
        'game_patch',
    ];
    static id = 'admin_bug_report';
    static statusLabels = {};
    static textareaColumns = [
        'title_pt',
        'title_en',
        'description_pt',
        'description_en',
        'description_user',
    ];
    static validationColumns = ['title_pt', 'title_en', 'description_pt', 'description_en'];

    static addEventListeners() {
        const data = [
            {
                el: this.elRefresh,
                handler: this.clickRefresh
            },
            {
                el: this.elSave,
                handler: this.clickSave
            },
            {
                el: this.elStatus,
                event: 'change',
                handler: this.changeFilter
            },
        ];
        data.forEach((index) => {
            index.context = this;
            ds.Helper.addEventListener(index);
        });
    }

    static addEventListenersRows() {
        const data = [];

        this.elPage.querySelectorAll('[data-bug-approve]').forEach((el) => {
            data.push({ el, context: this, handler: this.clickApprove });
        });
        this.elPage.querySelectorAll('[data-bug-col]').forEach((el) => {
            data.push({ el, event: 'change', context: this, handler: this.changeField });
        });
        this.elPage.querySelectorAll('[data-bug-reject]').forEach((el) => {
            data.push({ el, context: this, handler: this.clickReject });
        });

        data.forEach((index) => {
            ds.Helper.addEventListener(index);
        });
    }

    static async changeField(event) {
        const el = event.currentTarget;
        const bug = this.getBug(el.dataset.bugId);

        if (!bug) {
            return;
        }

        bug[el.dataset.bugCol] = el.value;
        bug.isChanged = true;
    }

    static async changeFilter(event) {
        this.currentStatusFilter = event.target.value;
        this.drawRows();
    }

    static async changeStatus(bug, status) {
        if (!this.validate(bug, status)) {
            ds.Notification.add({
                content: `Bug #${bug.id}: fill title and description before activating.`,
                color: 'red'
            });
            return;
        }

        bug.status = status;

        const response = await this.updateBug(bug);
        if (response?.isError) {
            await this.loadData();
            return;
        }

        this.drawRows();
    }

    static async clickApprove(event) {
        const bug = this.getBug(event.currentTarget.dataset.bugApprove);
        if (!bug) return;

        await this.changeStatus(bug, '1');
    }

    static async clickRefresh() {
        await this.loadData();
    }

    static async clickReject(event) {
        const bug = this.getBug(event.currentTarget.dataset.bugReject);
        if (!bug) return;

        await this.changeStatus(bug, '0');
    }

    static async clickSave() {
        const changed = this.getChanged();

        if (changed.length === 0) {
            ds.Notification.add({
                content: 'No changes to save.',
                color: 'grey'
            });
            return;
        }

        const errors = [];

        for (const bug of changed) {
            if (!this.validate(bug)) {
                errors.push(`Bug #${bug.id}: fill title and description before activating.`);
                continue;
            }

            const response = await this.updateBug(bug);

            if (response?.isError) {
                errors.push(`Bug #${bug.id}: could not save.`);
            }
        }

        if (errors.length > 0) {
            ds.Notification.add({
                content: errors.join(' | '),
                color: 'red'
            });
            await this.loadData();
            return;
        }

        ds.Notification.add({
            content: 'Changes saved.',
            color: 'green'
        });

        this.drawRows();
    }

    static drawAction(bug) {
        const id = ds.Helper.escapeHTML(bug.id);
        const status = String(bug.status);
        const approveDisabled = status === '1' ? 'disabled' : '';
        const rejectDisabled = status === '0' ? 'disabled' : '';

        return `
            <button
                type='button'
                class='ds-button ds-button--small ds-button--green'
                data-bug-approve='${id}'
                ${approveDisabled}
            >Approve</button>
            <button
                type='button'
                class='ds-button ds-button--small ds-button--red'
                data-bug-reject='${id}'
                ${rejectDisabled}
            >Reject</button>
        `;
    }

    static drawCell(bug, column) {
        const id = ds.Helper.escapeHTML(bug.id);
        const value = ds.Helper.escapeHTML(bug[column] ?? '');

        if (!this.editableColumns.includes(column)) {
            return value;
        }

        if (this.textareaColumns.includes(column)) {
            return `
                <textarea
                    class='ds-form__input'
                    rows='2'
                    data-bug-col='${column}'
                    data-bug-id='${id}'
                >${value}</textarea>
            `;
        }

        return `
            <input
                type='text'
                class='ds-form__input'
                value='${value}'
                data-bug-col='${column}'
                data-bug-id='${id}'
            />
        `;
    }

    static drawRows() {
        const rows = this.getFiltered();
        let html = '';

        rows.forEach((bug) => {
            html += `<tr data-id='${ds.Helper.escapeHTML(bug.id)}'>`;

            this.columns.forEach((column) => {
                html += `<td>${this.drawCell(bug, column)}</td>`;
            });

            html += `<td>${this.drawAction(bug)}</td>`;
            html += '</tr>';
        });

        if (html === '') {
            const colspan = this.columns.length + 1;
            html = `<tr><td colspan='${colspan}'>No bugs found.</td></tr>`;
        }

        this.elTbody.innerHTML = html;
        this.addEventListenersRows();
    }

    static drawStatusOptions() {
        let html = '<option value=\'\'>All</option>';

        Object.entries(this.statusLabels).forEach(([label, value]) => {
            const selected = String(this.currentStatusFilter) === String(value) ? 'selected' : '';
            html += `<option value='${ds.Helper.escapeHTML(value)}' ${selected}>${ds.Helper.escapeHTML(label)}</option>`;
        });

        this.elStatus.innerHTML = html;
        this.elStatus.value = this.currentStatusFilter;
    }

    static getBug(id) {
        return this.bugs.find((index) => String(index.id) === String(id));
    }

    static getChanged() {
        return this.bugs.filter((index) => index.isChanged);
    }

    static getFiltered() {
        if (this.currentStatusFilter === '') {
            return this.bugs;
        }

        return this.bugs.filter((index) => String(index.status) === String(this.currentStatusFilter));
    }

    static init() {
        this.updateHTML();
        if (!this.elPage) return;

        this.addEventListeners();
        this.loadOptions();
        this.loadData();
    }

    static async loadData() {
        const response = await FetchData.getBugs();

        if (response?.isError) {
            return;
        }

        this.bugs = Array.isArray(response) ? response : [];
        this.drawRows();
    }

    static async loadOptions() {
        const response = await FetchData.getBugOptions();

        if (response?.isError) {
            return;
        }

        this.statusLabels = response?.status || {};
        this.drawStatusOptions();
    }

    static updateHTML() {
        this.elPage = document.getElementById(this.id);
        if (!this.elPage) return;
        this.elRefresh = document.getElementById(`${this.id}_refresh`);
        this.elSave = document.getElementById(`${this.id}_save`);
        this.elStatus = document.getElementById(`${this.id}_status`);
        this.elTbody = document.getElementById(`${this.id}_tbody`);
    }

    static async updateBug(bug) {
        const fields = {};

        this.editableColumns.forEach((column) => {
            fields[column] = bug[column] ?? '';
        });

        const response = await FetchData.updateBug({
            id: bug.id,
            status: bug.status,
            fields
        });

        if (response?.isError) {
            return response;
        }

        bug.isChanged = false;

        return response;
    }

    static validate(bug, status = bug.status) {
        if (String(status) !== '1') {
            return true;
        }

        return this.validationColumns.every((column) => String(bug[column] ?? '').trim() !== '');
    }
}

export class AdminSuggestion {
    static suggestions = [];
    static columns = [
        'id',
        'title_pt',
        'title_en',
        'description_pt',
        'description_en',
        'description_user',
        'category',
        'votes',
        'game_patch',
        'date_register',
    ];
    static currentStatusFilter = '2';
    static editableColumns = [
        'title_pt',
        'title_en',
        'description_pt',
        'description_en',
        'description_user',
        'category',
        'game_patch',
    ];
    static id = 'admin_suggestion';
    static statusLabels = {};
    static textareaColumns = [
        'title_pt',
        'title_en',
        'description_pt',
        'description_en',
        'description_user',
    ];
    static validationColumns = ['title_pt', 'title_en', 'description_pt', 'description_en'];

    static addEventListeners() {
        const data = [
            {
                el: this.elRefresh,
                handler: this.clickRefresh
            },
            {
                el: this.elSave,
                handler: this.clickSave
            },
            {
                el: this.elStatus,
                event: 'change',
                handler: this.changeFilter
            },
        ];
        data.forEach((index) => {
            index.context = this;
            ds.Helper.addEventListener(index);
        });
    }

    static addEventListenersRows() {
        const data = [];

        this.elPage.querySelectorAll('[data-suggestion-approve]').forEach((el) => {
            data.push({ el, context: this, handler: this.clickApprove });
        });
        this.elPage.querySelectorAll('[data-suggestion-col]').forEach((el) => {
            data.push({ el, event: 'change', context: this, handler: this.changeField });
        });
        this.elPage.querySelectorAll('[data-suggestion-reject]').forEach((el) => {
            data.push({ el, context: this, handler: this.clickReject });
        });

        data.forEach((index) => {
            ds.Helper.addEventListener(index);
        });
    }

    static async changeField(event) {
        const el = event.currentTarget;
        const suggestion = this.getSuggestion(el.dataset.suggestionId);

        if (!suggestion) {
            return;
        }

        suggestion[el.dataset.suggestionCol] = el.value;
        suggestion.isChanged = true;
    }

    static async changeFilter(event) {
        this.currentStatusFilter = event.target.value;
        this.drawRows();
    }

    static async changeStatus(suggestion, status) {
        if (!this.validate(suggestion, status)) {
            ds.Notification.add({
                content: `Suggestion #${suggestion.id}: fill title and description before activating.`,
                color: 'red'
            });
            return;
        }

        suggestion.status = status;

        const response = await this.updateSuggestion(suggestion);
        if (response?.isError) {
            await this.loadData();
            return;
        }

        this.drawRows();
    }

    static async clickApprove(event) {
        const suggestion = this.getSuggestion(event.currentTarget.dataset.suggestionApprove);
        if (!suggestion) return;

        await this.changeStatus(suggestion, '1');
    }

    static async clickRefresh() {
        await this.loadData();
    }

    static async clickReject(event) {
        const suggestion = this.getSuggestion(event.currentTarget.dataset.suggestionReject);
        if (!suggestion) return;

        await this.changeStatus(suggestion, '0');
    }

    static async clickSave() {
        const changed = this.getChanged();

        if (changed.length === 0) {
            ds.Notification.add({
                content: 'No changes to save.',
                color: 'grey'
            });
            return;
        }

        const errors = [];

        for (const suggestion of changed) {
            if (!this.validate(suggestion)) {
                errors.push(`Suggestion #${suggestion.id}: fill title and description before activating.`);
                continue;
            }

            const response = await this.updateSuggestion(suggestion);

            if (response?.isError) {
                errors.push(`Suggestion #${suggestion.id}: could not save.`);
            }
        }

        if (errors.length > 0) {
            ds.Notification.add({
                content: errors.join(' | '),
                color: 'red'
            });
            await this.loadData();
            return;
        }

        ds.Notification.add({
            content: 'Changes saved.',
            color: 'green'
        });

        this.drawRows();
    }

    static drawAction(suggestion) {
        const id = ds.Helper.escapeHTML(suggestion.id);
        const status = String(suggestion.status);
        const approveDisabled = status === '1' ? 'disabled' : '';
        const rejectDisabled = status === '0' ? 'disabled' : '';

        return `
            <button
                type='button'
                class='ds-button ds-button--small ds-button--green'
                data-suggestion-approve='${id}'
                ${approveDisabled}
            >Approve</button>
            <button
                type='button'
                class='ds-button ds-button--small ds-button--red'
                data-suggestion-reject='${id}'
                ${rejectDisabled}
            >Reject</button>
        `;
    }

    static drawCell(suggestion, column) {
        const id = ds.Helper.escapeHTML(suggestion.id);
        const value = ds.Helper.escapeHTML(suggestion[column] ?? '');

        if (!this.editableColumns.includes(column)) {
            return value;
        }

        if (this.textareaColumns.includes(column)) {
            return `
                <textarea
                    class='ds-form__input'
                    rows='2'
                    data-suggestion-col='${column}'
                    data-suggestion-id='${id}'
                >${value}</textarea>
            `;
        }

        return `
            <input
                type='text'
                class='ds-form__input'
                value='${value}'
                data-suggestion-col='${column}'
                data-suggestion-id='${id}'
            />
        `;
    }

    static drawRows() {
        const rows = this.getFiltered();
        let html = '';

        rows.forEach((suggestion) => {
            html += `<tr data-id='${ds.Helper.escapeHTML(suggestion.id)}'>`;

            this.columns.forEach((column) => {
                html += `<td>${this.drawCell(suggestion, column)}</td>`;
            });

            html += `<td>${this.drawAction(suggestion)}</td>`;
            html += '</tr>';
        });

        if (html === '') {
            const colspan = this.columns.length + 1;
            html = `<tr><td colspan='${colspan}'>No suggestions found.</td></tr>`;
        }

        this.elTbody.innerHTML = html;
        this.addEventListenersRows();
    }

    static drawStatusOptions() {
        let html = '<option value=\'\'>All</option>';

        Object.entries(this.statusLabels).forEach(([label, value]) => {
            const selected = String(this.currentStatusFilter) === String(value) ? 'selected' : '';
            html += `<option value='${ds.Helper.escapeHTML(value)}' ${selected}>${ds.Helper.escapeHTML(label)}</option>`;
        });

        this.elStatus.innerHTML = html;
        this.elStatus.value = this.currentStatusFilter;
    }

    static getSuggestion(id) {
        return this.suggestions.find((index) => String(index.id) === String(id));
    }

    static getChanged() {
        return this.suggestions.filter((index) => index.isChanged);
    }

    static getFiltered() {
        if (this.currentStatusFilter === '') {
            return this.suggestions;
        }

        return this.suggestions.filter((index) => String(index.status) === String(this.currentStatusFilter));
    }

    static init() {
        this.updateHTML();
        if (!this.elPage) return;

        this.addEventListeners();
        this.loadOptions();
        this.loadData();
    }

    static async loadData() {
        const response = await FetchData.getSuggestions();

        if (response?.isError) {
            return;
        }

        this.suggestions = Array.isArray(response) ? response : [];
        this.drawRows();
    }

    static async loadOptions() {
        const response = await FetchData.getSuggestionOptions();

        if (response?.isError) {
            return;
        }

        this.statusLabels = response?.status || {};
        this.drawStatusOptions();
    }

    static updateHTML() {
        this.elPage = document.getElementById(this.id);
        if (!this.elPage) return;
        this.elRefresh = document.getElementById(`${this.id}_refresh`);
        this.elSave = document.getElementById(`${this.id}_save`);
        this.elStatus = document.getElementById(`${this.id}_status`);
        this.elTbody = document.getElementById(`${this.id}_tbody`);
    }

    static async updateSuggestion(suggestion) {
        const fields = {};

        this.editableColumns.forEach((column) => {
            fields[column] = suggestion[column] ?? '';
        });

        const response = await FetchData.updateSuggestion({
            id: suggestion.id,
            status: suggestion.status,
            fields
        });

        if (response?.isError) {
            return response;
        }

        suggestion.isChanged = false;

        return response;
    }

    static validate(suggestion, status = suggestion.status) {
        if (String(status) !== '1') {
            return true;
        }

        return this.validationColumns.every((column) => String(suggestion[column] ?? '').trim() !== '');
    }
}

export class Analytics {
    static load() {
        ds.Analytics.load();
    }

    static pageView(props) {
        ds.Analytics.pageView(props);
    }

    static siteEvent(props) {
        ds.Analytics.siteEvent(props);
    }
}

export class Blog {
    static results = 15;
    static limit;
    static offset;
    static filter = '';
    static filterKind = '';

    static addEventListeners() {
        const data = [
            {
                el: this.elLoadMore,
                handler: this.clickLoadMore
            },
        ];
        data.forEach((index) => {
            index.context = this;
            ds.Helper.addEventListener(index);
        });
    }

    static buildLoading() {
        const args = {
            theme: 'purple'
        };
        const loading = Theme.buildLoading(args);
        const html = `
            <div class="ds-${Theme.cssLoadingWrapper}">
                ${loading}
            </div>
        `;
        this.elPosts.insertAdjacentHTML('beforeend', html);
    }

    static clickLoadMore() {
        this.loadData({
            filter: this.filter,
            filterKind: this.filterKind
        });
    }

    static drawList(data) {
        let html = '';

        data.forEach(index => {
            const content = ds.Helper.escapeHTML(index.content);
            const img = ds.Helper.escapeHTML(index.thumbnail);
            const url = ds.Helper.escapeHTML(index.url);
            const title = ds.Helper.escapeHTML(index.title);
            const date = ds.Helper.escapeHTML(index.date_post);

            html += `
                <a href="${url}" class="ds-row si-post">
                    <div class="si-post__item">
                        <img src="${img}" alt="${title}">
                    </div>
                    <div class="si-post__item">
                        <h3 class="ds-title">${title}</h3>
                        <p>${content}</p>
                        <p>${date}</p>
                    </div>
                </a>
            `;
        });
        this.elPosts.insertAdjacentHTML('beforeend', html);
    }

    static init() {
        this.resetConstructor();
        this.updateHTML();
        if (!this.elPage) return;
        this.addEventListeners();
        this.clickLoadMore();
    }

    static async loadData(props) {
        this.buildLoading();

        const filter = props.filter ?? null;
        const filterKind = props.filterKind ?? null;
        const args = {
            limit: this.limit,
            offset: this.offset,
            filter,
            filterKind
        };
        const data = await FetchData.getBlog(args);

        const content = data;
        this.drawList(content);
        this.removeLoading();
        this.responseLength = content.length;
        this.toggleLoadMore();
        this.limit += this.results;

        Analytics.siteEvent({
            event_name: 'blog_load',
            offset: this.offset,
            results: content.length,
            filter,
            filter_kind: filterKind,
        });
    }

    static removeLoading() {
        this.updateHTML();
        this.elLoading.remove();
    }

    static resetConstructor() {
        this.limit = 0;
        this.offset = this.results;
        this.responseLength = 0;
    }

    static toggleLoadMore() {
        const isEnabled = this.responseLength >= this.results;

        if (isEnabled) {
            ds.Helper.removeClass(this.elLoadMore, Theme.cssButtonDisabled);
        } else {
            ds.Helper.addClass(this.elLoadMore, Theme.cssButtonDisabled);
        }
    }

    static updateHTML() {
        this.elPage = document.getElementById('blog');
        if (!this.elPage) return;
        this.elPosts = document.getElementById('blog_posts');
        this.elLoadMore = document.getElementById('blog_load_more');
        this.elLoading = this.elPosts.querySelector(`.ds-${Theme.cssLoadingWrapper}`);
    }
}
export class Contact {
    static id = 'contact_page';
    static idSelect = 'contact_type_select';
    static idFormContainer = 'contact_form_container';
    static idBugReportContainer = 'bug_report_container';
    static idSuggestionContainer = 'suggestion_container';
    static idName = 'contact_name';
    static idEmail = 'contact_email';
    static idMessage = 'contact_message';
    static idButtonSubmit = 'contact_submit_button';

    static addEventListeners() {
        const data = [
            {
                el: this.elName,
                event: 'input',
                handler: this.handleInputChange
            },
            {
                el: this.elEmail,
                event: 'input',
                handler: this.handleInputChange
            },
            {
                el: this.elMessage,
                event: 'input',
                handler: this.handleInputChange
            },
            {
                el: this.elButtonSubmit,
                handler: this.handleSubmit
            },
        ];
        data.forEach((index) => {
            index.context = this;
            ds.Helper.addEventListener(index);
        });

        if (this.elSelect) {
            const buttons = this.elSelect.querySelectorAll('.ds-drop-down__content button');

            buttons.forEach((button) => {
                ds.Helper.addEventListener({
                    el: button,
                    handler: this.handleOptionClick,
                    context: this
                });
            });
        }
    }

    static handleInputChange() {
        const name = this.elName?.value?.trim() || '';
        const email = this.elEmail?.value?.trim() || '';
        const message = this.elMessage?.value?.trim() || '';
        const isFilled = name.length > 0 && email.length > 0 && message.length > 0;
        const propsButton = {
            button: this.elButtonSubmit,
            action: !isFilled
        };
        ds.Helper.toggleButtonEnabled(propsButton);
    }

    static handleOptionClick(event) {
        const button = event.currentTarget;
        const value = button.dataset.value;
        const label = button.textContent.trim();

        this.selectedType = value;

        const triggerButton = this.elSelect.querySelector(':scope > button');
        if (triggerButton) {
            triggerButton.textContent = label;
        }

        this.updateContactType();
    }

    static handleSubmit() {
        const name = this.elName?.value?.trim() || '';
        const email = this.elEmail?.value?.trim() || '';
        const message = this.elMessage?.value?.trim() || '';
        const contactType = this.selectedType || 'contact';

        const isValidName = name.length > 0;
        const isValidEmail = email.length > 0;
        const isValidMessage = message.length > 0;
        const isCaptcha = ds.Helper.validateCaptcha();

        const isValidForm = isValidName && isValidEmail && isValidMessage && isCaptcha;

        if (isValidForm) {
            const propsButton = {
                button: this.elButtonSubmit,
                action: true
            };
            ds.Helper.toggleButtonEnabled(propsButton);
            this.requestSubmit({
                name,
                email,
                message,
                contactType,
                captcha: ds.Helper.getCaptchaResponse()
            });
        }
    }

    static init() {
        this.updateHtml();
        if (!this.elPage) return;
        this.addEventListeners();
        ds.Helper.renderCaptcha();
        this.updateContactType();
        this.handleInputChange();
    }

    static async requestSubmit(props) {
        const response = await FetchData.postContact(props);
        const propsButton = {
            button: this.elButtonSubmit,
            action: false
        };
        ds.Helper.toggleButtonEnabled(propsButton);

        if (response?.isError) {
            ds.Notification.add({
                content: response.errorMessage || 'Erro ao enviar contato',
                color: 'red'
            });
            ds.Helper.resetCaptcha();
        } else {
            ds.Notification.add({
                content: 'Contato enviado com sucesso!',
                color: 'green'
            });
            this.elName.value = '';
            this.elEmail.value = '';
            this.elMessage.value = '';
            ds.Helper.resetCaptcha();
        }
    }

    static updateContactType() {
        const theme = 'ds-form ds-form--purple--dark';
        const value = this.selectedType || 'contact';
        if (value === 'bug_report') {
            this.elFormContainer.style.display = 'none';
            this.elBugReportContainer.style.display = 'block';
            this.elSuggestionContainer.style.display = 'none';
            if (!this.elBugReportContainer.querySelector('c-ds-bug-report')) {
                this.elBugReportContainer.innerHTML = `
                    <c-ds-bug-report
                        theme="site"
                        context="si-site__contact"
                        css-wrapper="${theme}"
                        button-theme="transparent"
                        button-size="regular"
                        button-css="ds-button--full ds-button__outline--white"
                    ></c-ds-bug-report>
                `;
            }
        } else if (value === 'suggestion') {
            this.elFormContainer.style.display = 'none';
            this.elBugReportContainer.style.display = 'none';
            this.elSuggestionContainer.style.display = 'block';
            if (!this.elSuggestionContainer.querySelector('c-ds-suggestion')) {
                this.elSuggestionContainer.innerHTML = `
                    <c-ds-suggestion
                        theme="site"
                        context="si-site__contact"
                        css-wrapper="${theme}"
                        button-theme="transparent"
                        button-size="regular"
                        button-css="ds-form ds-button--full ds-button__outline--white"
                    ></c-ds-suggestion>
                `;
            }
        } else {
            this.elFormContainer.style.display = 'block';
            this.elBugReportContainer.style.display = 'none';
            this.elSuggestionContainer.style.display = 'none';
        }
    }

    static updateHtml() {
        this.elPage = document.getElementById(this.id);
        this.elSelect = document.getElementById(this.idSelect);
        this.elFormContainer = document.getElementById(this.idFormContainer);
        this.elBugReportContainer = document.getElementById(this.idBugReportContainer);
        this.elSuggestionContainer = document.getElementById(this.idSuggestionContainer);
        this.elName = document.getElementById(this.idName);
        this.elEmail = document.getElementById(this.idEmail);
        this.elMessage = document.getElementById(this.idMessage);
        this.elButtonSubmit = document.getElementById(this.idButtonSubmit);
        this.selectedType = 'contact';
    }
}

export class Cookies {
    static storage = 'cookies_advise--5';

    static addEventListeners() {
        const data = [
            {
                el: this.elButtonClose,
                handler: this.handleClose
            },
        ];
        data.forEach((index) => {
            index.context = this;
            ds.Helper.addEventListener(index);
        });
    }

    static handleClose() {
        const args = {
            target: this.storage,
            value: true
        };
        ds.Storage.setValue(args);
        this.removeMessage();
        Analytics.load();
        Analytics.pageView({
            page_title: document.title,
            page_location: window.location.href,
        });
    }

    static init() {
        this.updateHtml();
        if (!this.elCookiesAdvise) return;
        this.addEventListeners();
        const value = ds.Storage.getValue(this.storage);
        if (value) {
            this.removeMessage();
            Analytics.load();
            Analytics.pageView({
                page_title: document.title,
                page_location: window.location.href,
            });
        } else {
            this.showMessage();
        }
    }

    static updateHtml() {
        this.elCookiesAdvise = document.getElementById('cookies_advise');
        this.elButtonClose = this.elCookiesAdvise?.querySelector('.ds-button');
    }

    static removeMessage() {
        this.elCookiesAdvise.remove();
    }

    static showMessage() {
        const el = this.elCookiesAdvise;
        const isCss = el.classList.contains(Theme.cssDisplay);
        if (isCss) el.classList.remove(Theme.cssDisplay);
    }
}

export class FetchData {
    static namespace = 'Site/';
    static connection = gbIsLocalHost ? 'local' : 'online';
    static controller = {
        site: `${this.namespace}Site`,
        contact: `${this.namespace}Contact`,
        translation: 'App/Language',
        advertising: 'Advertising/Advertising',
        bugReport: 'BugReport/BugReport',
        suggestion: 'Suggestion/Suggestion',
    };

    static async fetchData(args) {
        const response = await this.retryInvalidToken(() => ds.DataLoader.fetchData(args));
        return response;
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

    static async approveAdvertising(id) {
        const args = {
            controller: this.controller['advertising'],
            action: 'approveAdvertising',
            connection: this.connection,
            id
        };
        const response = await this.fetchData(args);
        return response;
    }

    static async changeLanguage(language) {
        const args = {
            controller: this.controller['translation'],
            action: 'setLanguage',
            language
        };
        const response = await this.fetchData(args);

        Analytics.siteEvent({
            event_name: 'language_change',
            language,
        });

        return response;
    }

    static async getAdvertisings() {
        const args = {
            controller: this.controller['advertising'],
            action: 'getAdvertisings',
            connection: this.connection
        };
        const response = await this.fetchData(args);
        return response;
    }

    static async getBlog(props) {
        const { limit, offset, filter, filterKind } = props;
        const args = {
            controller: this.controller['site'],
            action: 'getBlog',
            limit,
            offset,
            filter,
            filterKind
        };
        const response = await this.fetchData(args);
        return response;
    }

    static async getBugOptions() {
        const args = {
            controller: this.controller['bugReport'],
            action: 'getOptions',
            connection: this.connection
        };
        const response = await this.fetchData(args);
        return response;
    }

    static async getBugs() {
        const args = {
            controller: this.controller['bugReport'],
            action: 'getBugs',
            connection: this.connection
        };
        const response = await this.fetchData(args);
        return response;
    }

    static async getRanking(props) {
        const { limit, offset, filter, filterKind } = props;
        const args = {
            controller: this.controller['site'],
            action: 'getRanking',
            limit,
            offset,
            filter,
            filterKind
        };
        const response = await this.fetchData(args);
        return response;
    }

    static async getSuggestionOptions() {
        const args = {
            controller: this.controller['suggestion'],
            action: 'getOptions',
            connection: this.connection
        };
        const response = await this.fetchData(args);
        return response;
    }

    static async getSuggestions() {
        const args = {
            controller: this.controller['suggestion'],
            action: 'getSugestions',
            connection: this.connection
        };
        const response = await this.fetchData(args);
        return response;
    }

    static async getWikiMonster(props) {
        const { limit, offset, idMonster } = props;
        const args = {
            controller: this.controller['site'],
            action: 'getWikiMonster',
            limit,
            offset,
            idMonster
        };
        const response = await this.fetchData(args);
        return response;
    }

    static async getWikiClasses(props) {
        const { level } = props;
        const args = {
            controller: this.controller['site'],
            action: 'getWikiClasses',
            level
        };
        const response = await this.fetchData(args);
        return response;
    }

    static async getWikiExperience(props) {
        const { limit, offset } = props;
        const args = {
            controller: this.controller['site'],
            action: 'getWikiExperience',
            limit,
            offset
        };
        const response = await this.fetchData(args);
        return response;
    }

    static async getWikiItems(props) {
        const { limit, offset, kind } = props;
        const args = {
            controller: this.controller['site'],
            action: 'getWikiItems',
            limit,
            offset,
            kind
        };
        const response = await this.fetchData(args);
        return response;
    }

    static async postContact(props) {
        const { name, email, message, contactType, captcha } = props;
        const args = {
            controller: this.controller['contact'],
            action: 'postContact',
            name,
            email,
            message,
            contactType,
            captcha
        };
        const response = await this.fetchData(args);
        return response;
    }

    static async postSuggestionVote(props) {
        const { id } = props;
        const args = {
            controller: this.controller['site'],
            action: 'postSuggestionVote',
            id
        };
        const response = await this.fetchData(args);
        return response;
    }

    static async updateBug(props) {
        const { id, status, fields } = props;
        const args = {
            controller: this.controller['bugReport'],
            action: 'updateBug',
            connection: this.connection,
            id,
            status,
            ...fields
        };
        const response = await this.fetchData(args);
        return response;
    }

    static async updateSuggestion(props) {
        const { id, status, fields } = props;
        const args = {
            controller: this.controller['suggestion'],
            action: 'updateSugestion',
            connection: this.connection,
            id,
            status,
            ...fields
        };
        const response = await this.fetchData(args);
        return response;
    }
}
const nameSpace = 'si'; // eslint-disable-line no-unused-vars
let deps = {}; // eslint-disable-line no-unused-vars
let ds; // eslint-disable-line no-unused-vars
let lo; // eslint-disable-line no-unused-vars
export class Management {
    static init(props) {
        deps = props;
        ds = deps.ds;
        lo = deps.lo;
        ds.Helper.addEventListenerDOM(this);
        ds.Tooltip.init();
        ds.Notification.init();
    }

    static async handleLoaded() {
        await this.translate();
        AdminAdvertising.init();
        AdminBugReport.init();
        AdminSuggestion.init();
        Blog.init();
        Ranking.init();
        Theme.init();
        Cookies.init();
        WikiItem.init();
        WikiMonster.init();
        WikiClasses.init();
        WikiExperience.init();
        WikiSuggestions.init();
        Contact.init();
    }

    static async translate() {
        await ds.Translation.translate('game');
        await ds.Translation.translate('default');
        await ds.Translation.translate('interface');
    }
}
export class Ranking {
    static currentFilter;
    static results = 15;
    static limit;
    static offset = 0;
    static timeout = null;
    static filter = '';
    static filterKind = '';

    static addEventListeners() {
        const data = [
            {
                el: this.elLoadMore,
                handler: this.clickLoadMore
            },
            {
                el: this.elFilterWarrior,
                handler: this.clickWarrior
            },
            {
                el: this.elFilterWizard,
                handler: this.clickWizard
            },
            {
                el: this.elFilterHunter,
                handler: this.clickHunter
            },
            {
                el: this.elFilterMerchant,
                handler: this.clickMerchant
            },
            {
                el: this.elFilterExperience,
                handler: this.clickExperience
            },
            {
                el: this.elFilterSearch,
                handler: this.clickSearch
            },
            {
                el: this.elFilterInput,
                event: 'input',
                handler: this.filterSearchByKey
            },
        ];
        data.forEach((index) => {
            index.context = this;
            ds.Helper.addEventListener(index);
        });
    }

    static buildLoading() {
        const loading = Theme.buildLoading({
            theme: 'purple'
        });
        const html = `
            <tr class="ds-${Theme.cssLoadingWrapper}">
                <td colspan="100%">${loading}</td>
            </tr>
        `;

        this.elTbody.insertAdjacentHTML('beforeend', html);
    }

    static clickLoadMore() {
        this.loadData({
            filter: this.filter,
            filterKind: this.filterKind
        });
    }

    static clearTable() {
        this.elTbody.innerHTML = '';
        this.resetData();
        this.toggleLoadMore();
    }

    static clickExperience(target) {
        this.clickDefault(target);
        this.filterSearch('', '');
    }

    static clickHunter(target) {
        this.clickDefault(target);
        this.filterSearch('2', 'class');
    }

    static clickMerchant(target) {
        this.clickDefault(target);
        this.filterSearch('3', 'class');
    }

    static clickSearch(target) {
        this.clickDefault(target);
        ds.Helper.toggleClass(this.elFilter, Theme.cssDisplay);
        this.elFilterInput.value = '';
        this.elFilterInput.focus();
    }

    static clickWarrior(target) {
        this.clickDefault(target);
        this.filterSearch('0', 'class');
    }

    static clickWizard(target) {
        this.clickDefault(target);
        this.filterSearch('1', 'class');
    }

    static clickDefault(event) {
        this.elFilterMenu.forEach((index) => {
            ds.Helper.removeClass(index, Theme.cssButtonActive);
        });

        const target = event.target;
        ds.Helper.addClass(target, Theme.cssButtonActive);
        ds.Helper.addClass(this.elFilter, Theme.cssDisplay);
    }

    static drawTable(data, props) {
        const cssTableDestak = Theme.cssTableDestak;
        const cssExperience = props.filterKind === '' ? Theme.cssTableDestak : '';
        const cssClass = props.filterKind === 'class' ? Theme.cssTableDestak : '';

        let html = '';

        data.forEach(index => {
            const classPlayer = ds.Helper.escapeHTML(index.about_class_name);
            const experience = this.formatExperience(index.about_experience);
            const name = ds.Helper.escapeHTML(index.about_name);
            const customizations = ds.Helper.escapeHTML(index.customizations);
            const equipments = ds.Helper.escapeHTML(index.equipments);

            html += `
                <tr>
                    <td></td>
                    <td class="${cssTableDestak}">${name}</td>
                    <td>${ds.Helper.escapeHTML(index.user)}</td>
                    <td class="${cssClass}">${classPlayer}</td>
                    <td>${index.level}</td>
                    <td class="${cssExperience}">${experience}</td>
                    <td class="ds-center">
                        <c-lo-entity
                            class="gm-alive gm-person"
                            data-walk-steps="1"
                            entity="person"
                            direction="down"
                            action="walk"
                            customizations='${customizations}'
                            equipments='${equipments}'
                            tabindex="-1"
                        ></c-lo-entity>
                    </td>
                </tr>
            `;
        });

        this.elTbody.insertAdjacentHTML('beforeend', html);
    }

    static filterRanking(props) {
        this.clearTable();
        this.loadData(props);
    }

    static filterSearch(filter, filterKind) {
        this.filter = filter;
        this.filterKind = filterKind;
        if (filter === this.currentFilter) return;
        this.filterRanking({
            filter,
            filterKind
        });
        this.currentFilter = filter;
    }

    static filterSearchByKey() {
        this.clearTable();
        this.buildLoading();
        clearTimeout(this.timeout);

        this.timeout = setTimeout(() => {
            this.filterSearch(this.elFilterInput.value, 'character');
        }, 1000);
    }

    static formatExperience(target) {
        const lang = document.documentElement.lang || 'en-US';

        return target.toLocaleString(lang);
    }

    static init() {
        this.resetData();
        this.updateHTML();
        if (!this.elPage) return;
        this.addEventListeners();
        this.elFilterMenu[0].click();
    }

    static async loadData(props) {
        this.buildLoading();

        const args = {
            limit: this.limit,
            offset: this.offset,
            filter: this.filter,
            filterKind: this.filterKind,
        };

        const data = await FetchData.getRanking(args);

        this.drawTable(data, props);
        this.removeLoading();
        this.responseLength = data.length;
        this.toggleLoadMore();

        this.offset += this.results;

        Analytics.siteEvent({
            event_name: 'ranking_load',
            offset: this.offset,
            results: data.length,
            filter: this.filter,
            filter_kind: this.filterKind,
        });
    }

    static removeLoading() {
        this.updateHTML();
        this.elLoading.remove();
    }

    static resetData() {
        this.limit = this.results;
        this.offset = 0;
        this.responseLength = 0;
    }

    static toggleLoadMore() {
        const isEnabled = this.responseLength >= this.results;

        if (isEnabled) {
            ds.Helper.removeClass(this.elLoadMore, Theme.cssButtonDisabled);
        } else {
            ds.Helper.addClass(this.elLoadMore, Theme.cssButtonDisabled);
        }
    }

    static updateHTML() {
        this.elPage = document.getElementById('ranking');
        if (!this.elPage) return;
        this.elLoadMore = document.getElementById('ranking_load_more');
        this.elTbody = this.elPage.querySelector('tbody');
        this.elFilterMenu = document.getElementById('ranking_menu').querySelectorAll('.ds-button');
        this.elFilterExperience = document.getElementById('ranking_experience');
        this.elLoading = this.elTbody.querySelector(`.ds-${Theme.cssLoadingWrapper}`);
        this.elFilterClass = document.getElementById('ranking_class');
        this.elFilterWarrior = document.getElementById('ranking_warrior');
        this.elFilterWizard = document.getElementById('ranking_wizard');
        this.elFilterHunter = document.getElementById('ranking_hunter');
        this.elFilterMerchant = document.getElementById('ranking_merchant');
        this.elFilterSearch = document.getElementById('ranking_search');
        this.elFilter = document.getElementById('ranking_filter');
        this.elFilterInput = document.getElementById('ranking_search_value');
    }
}
export class Theme {
    static cssButtonActive = 'ds-button--active';
    static cssButtonDisabled = 'ds-button--disabled';
    static cssDisplay = 'ds-display-none';
    static cssLoadingWrapper = 'ds-loading__wrapper';
    static cssTableDestak = 'si-td--destak';

    static addEventListeners() {
        this.elLanguageButtons.forEach((index) => {
            ds.Helper.addEventListener({
                el: index,
                context: this,
                handler: this.changeLanguage
            });
        });
    }

    static buildLoading(props) {
        const { theme = 'grey', size = 'small' } = props;
        const response = ds.HTML.drawLoading({ theme, size });
        return response;
    }

    static async changeLanguage(event) {
        const value = event.target.dataset.language;
        const data = await FetchData.changeLanguage(value);
        if (!data.language) return;

        const alternate = document.querySelector(`link[rel="alternate"][hreflang="${value}"]`);

        if (alternate) {
            window.location.href = alternate.href;
            return;
        }

        window.location.reload();
    }

    static init() {
        this.updateHTML();
        this.addEventListeners();
    }

    static updateHTML() {
        this.elLanguageButtons = document.querySelectorAll('[data-language]');
    }
}
export class WikiClasses {
    static lang;
    static level;

    static addEventListenersDetail() {
        const input = this.elLevel?.shadowRoot?.querySelector('input');
        if (!input) return;

        ds.Helper.addEventListener({
            el: input,
            context: this,
            event: 'change',
            handler: this.changeLevel
        });

        this.elLevel.focus();
    }

    static async changeLevel() {
        const value = Number(ds.FormField.getInputValueByTarget(this.elLevel));
        if (!value || value < 1 || value === this.level) return;
        this.level = value;

        const args = {
            level: value,
        };

        const data = await FetchData.getWikiClasses(args);
        this.updateAttributes(data);

        Analytics.siteEvent({
            event_name: 'wiki_classes_level_change',
            level: value,
        });
    }

    static formatNumber(target) {
        return target.toLocaleString(this.lang);
    }

    static init() {
        this.updateHTML();
        if (!this.elPage) return;
        this.addEventListenersDetail();
    }

    static updateAttributes(data) {
        const keys = ['actionPoints', 'vitality', 'intelligence', 'strength', 'dexterity'];

        data.forEach((item) => {
            keys.forEach((key) => {
                const el = this.elPage.querySelector(`[data-attribute="${key}"][data-class="${item.class}"]`);
                if (el) el.textContent = this.formatNumber(item[key] ?? 0);
            });
        });
    }

    static updateHTML() {
        this.elPage = document.getElementById('wiki_classes');
        if (!this.elPage) return;
        this.lang = document.documentElement.lang || 'en-US';
        this.level = 1;
        this.elLevel = document.getElementById('wiki_classes_level');
    }
}

export class WikiExperience {
    static results = 50;
    static limit;
    static offset = 0;
    static responseLength = 0;
    static lang;

    static addEventListeners() {
        const data = [
            {
                el: this.elLoadMore,
                handler: this.clickLoadMore
            },
        ];
        data.forEach((index) => {
            index.context = this;
            ds.Helper.addEventListener(index);
        });
    }

    static buildLoading() {
        const loading = Theme.buildLoading({
            theme: 'purple'
        });
        const html = `
            <tr class="ds-${Theme.cssLoadingWrapper}">
                <td colspan="2">${loading}</td>
            </tr>
        `;

        this.elTbody.insertAdjacentHTML('beforeend', html);
    }

    static clickLoadMore() {
        this.loadData();
    }

    static drawTable(data) {
        let html = '';

        data.forEach((index) => {
            const level = index.level.toLocaleString(this.lang);
            const experience = index.experience;

            html += `
                <tr>
                    <td class="si-td--destak">${level}</td>
                    <td>${experience}</td>
                </tr>
            `;
        });

        this.elTbody.insertAdjacentHTML('beforeend', html);
    }

    static init() {
        this.updateHTML();
        if (!this.elPage) return;
        this.resetData();
        this.addEventListeners();
        this.loadData();
    }

    static async loadData() {
        this.buildLoading();

        const args = {
            limit: this.limit,
            offset: this.offset,
        };

        const data = await FetchData.getWikiExperience(args);

        this.drawTable(data);
        this.removeLoading();
        this.responseLength = data.length;
        this.toggleLoadMore();

        this.offset += this.results;
    }

    static removeLoading() {
        this.updateHTML();
        this.elLoading.remove();
    }

    static resetData() {
        this.limit = this.results;
        this.offset = 0;
        this.responseLength = 0;
    }

    static toggleLoadMore() {
        const isEnabled = this.responseLength >= this.results;

        if (isEnabled) {
            ds.Helper.removeClass(this.elLoadMore, Theme.cssButtonDisabled);
        } else {
            ds.Helper.addClass(this.elLoadMore, Theme.cssButtonDisabled);
        }
    }

    static updateHTML() {
        this.elPage = document.getElementById('wiki_experience');
        if (!this.elPage) return;
        this.elLoadMore = document.getElementById('wiki_experience_load_more');
        this.elTbody = this.elPage.querySelector('tbody');
        this.elLoading = this.elTbody ? this.elTbody.querySelector(`.ds-${Theme.cssLoadingWrapper}`) : null;
        this.lang = document.documentElement.lang || 'en-US';
    }
}

export class WikiItem {
    static results = 20;
    static limit;
    static offset = 0;
    static responseLength = 0;
    static kind = '';
    static currentFilter;

    static addEventListeners() {
        const data = [
            {
                el: this.elLoadMore,
                handler: this.clickLoadMore
            },
            {
                el: this.elFilterAll,
                handler: this.clickAll
            },
        ];
        data.forEach((index) => {
            index.context = this;
            ds.Helper.addEventListener(index);
        });

        this.elFilterKind.forEach((index) => {
            ds.Helper.addEventListener({
                el: index,
                context: this,
                handler: this.clickKind
            });
        });
    }

    static buildLoading() {
        const loading = Theme.buildLoading({
            theme: 'purple'
        });
        const html = `
            <tr class="ds-${Theme.cssLoadingWrapper}">
                <td colspan="100%">${loading}</td>
            </tr>
        `;

        this.elTbody.insertAdjacentHTML('beforeend', html);
    }

    static clearTable() {
        this.elTbody.innerHTML = '';
        this.resetData();
        this.toggleLoadMore();
    }

    static clickAll(target) {
        this.clickDefault(target);
        this.filterSearch('');
    }

    static clickDefault(event) {
        this.elFilterMenu.forEach((index) => {
            ds.Helper.removeClass(index, Theme.cssButtonActive);
        });

        ds.Helper.addClass(event.target, Theme.cssButtonActive);
    }

    static clickKind(event) {
        this.clickDefault(event);
        const kind = event.target.id.replace('wiki_item_kind_', '');
        this.filterSearch(kind);
    }

    static clickLoadMore() {
        this.loadData();
    }

    static drawTable(data) {
        let html = '';

        data.forEach((index) => {
            const url = `${this.linkWikiItem}${index.id}/`;
            html += `
                <tr>
                    <td><a class='ds-link ds-link--white' href='${url}'>${index.name}</a></td>
                    <td><a href='${url}'><div class='ds-tile loot-${index.cssItem}'></div></a></td>
                </tr>
            `;
        });

        this.elTbody.insertAdjacentHTML('beforeend', html);
    }

    static filterItems() {
        this.clearTable();
        this.loadData();
    }

    static filterSearch(kind) {
        if (kind === this.currentFilter) return;
        this.kind = kind;
        this.filterItems();
        this.currentFilter = kind;
    }

    static init() {
        this.updateHTML();
        if (!this.elPage) return;
        this.addEventListeners();
        this.elFilterAll.click();
    }

    static async loadData() {
        this.buildLoading();

        const args = {
            limit: this.limit,
            offset: this.offset,
            kind: this.kind,
        };

        const data = await FetchData.getWikiItems(args);

        this.drawTable(data);
        this.removeLoading();
        this.responseLength = data.length;
        this.toggleLoadMore();

        this.offset += this.results;

        Analytics.siteEvent({
            event_name: 'wiki_item_load',
            offset: this.offset,
            results: data.length,
            kind: this.kind,
        });
    }

    static removeLoading() {
        this.updateHTML();
        this.elLoading.remove();
    }

    static resetData() {
        this.limit = this.results;
        this.offset = 0;
        this.responseLength = 0;
    }

    static toggleLoadMore() {
        const isEnabled = this.responseLength >= this.results;

        if (isEnabled) {
            ds.Helper.removeClass(this.elLoadMore, Theme.cssButtonDisabled);
        } else {
            ds.Helper.addClass(this.elLoadMore, Theme.cssButtonDisabled);
        }
    }

    static updateHTML() {
        this.elPage = document.getElementById('wiki_item');
        if (!this.elPage) return;
        this.elLoadMore = document.getElementById('wiki_item_load_more');
        this.elTbody = document.getElementById('wiki_item_tbody');
        this.elFilterMenu = document.getElementById('wiki_item_menu').querySelectorAll('.ds-button');
        this.elFilterAll = document.getElementById('wiki_item_all');
        this.elFilterKind = document.querySelectorAll('[id^="wiki_item_kind_"]');
        this.linkWikiItem = this.elPage.getAttribute('data-link-wiki-item');
        this.elLoading = this.elTbody ? this.elTbody.querySelector(`.ds-${Theme.cssLoadingWrapper}`) : null;
    }
}

export class WikiMonster {
    static results = 100;
    static limit;
    static offset = 0;
    static responseLength = 0;
    static idMonster;
    static lang;
    static level;

    static addEventListeners() {
        const data = [
            {
                el: this.elLoadMore,
                handler: this.clickLoadMore
            },
        ];
        data.forEach((index) => {
            index.context = this;
            ds.Helper.addEventListener(index);
        });
    }

    static addEventListenersDetail() {
        const input = this.elLevel?.shadowRoot?.querySelector('input');
        if (!input) return;

        ds.Helper.addEventListener({
            el: input,
            context: this,
            event: 'change',
            handler: this.changeLevel
        });

        this.elLevel.focus();
    }

    static buildLoading() {
        const loading = Theme.buildLoading({
            theme: 'purple'
        });
        const html = `
            <tr class="ds-${Theme.cssLoadingWrapper}">
                <td colspan="9">${loading}</td>
            </tr>
        `;

        this.elTbody.insertAdjacentHTML('beforeend', html);
    }

    static async changeLevel() {
        const value = Number(ds.FormField.getInputValueByTarget(this.elLevel));
        if (!value || value < 1 || value === this.level) return;
        this.level = value;

        const args = {
            limit: 1,
            offset: value - 1,
            idMonster: this.idMonster,
        };

        const data = await FetchData.getWikiMonster(args);
        this.updateAttributes(data[0] || {});

        Analytics.siteEvent({
            event_name: 'wiki_monster_level_change',
            id_monster: this.idMonster,
            level: value,
        });
    }

    static clickLoadMore() {
        this.loadData();
    }

    static drawTable(data) {
        let html = '';

        data.forEach((index) => {
            const level = this.formatNumber(index.level);
            const life = this.formatNumber(index.life);
            const mana = this.formatNumber(index.mana);
            const strength = this.formatNumber(index.strength);
            const vitality = this.formatNumber(index.vitality);
            const dexterity = this.formatNumber(index.dexterity);
            const intelligence = this.formatNumber(index.intelligence);
            const attack = this.formatNumber(index.attack);
            const defense = this.formatNumber(index.defense);

            html += `
                <tr class="ds-monster__row">
                    <td>${level}</td>
                    <td>${life}</td>
                    <td>${mana}</td>
                    <td>${strength}</td>
                    <td>${vitality}</td>
                    <td>${dexterity}</td>
                    <td>${intelligence}</td>
                    <td>${attack}</td>
                    <td>${defense}</td>
                </tr>
            `;
        });

        this.elTbody.insertAdjacentHTML('beforeend', html);
    }

    static formatNumber(target) {
        return target.toLocaleString(this.lang);
    }

    static init() {
        this.updateHTML();
        if (this.elDetail) {
            this.addEventListenersDetail();
            return;
        }
        if (!this.idMonster) return;
        this.resetData();
        this.addEventListeners();
        this.loadData();
    }

    static async loadData() {
        this.buildLoading();

        const args = {
            limit: this.limit,
            offset: this.offset,
            idMonster: this.idMonster,
        };

        const data = await FetchData.getWikiMonster(args);

        this.drawTable(data);
        this.removeLoading();
        this.responseLength = data.length;
        this.toggleLoadMore();

        this.offset += this.results;

        Analytics.siteEvent({
            event_name: 'wiki_monster_load',
            id_monster: this.idMonster,
            offset: this.offset,
            results: data.length,
        });
    }

    static removeLoading() {
        this.updateHTML();
        this.elLoading.remove();
    }

    static resetData() {
        this.limit = this.results;
        this.offset = 0;
        this.responseLength = 0;
    }

    static toggleLoadMore() {
        const isEnabled = this.responseLength >= this.results;

        if (isEnabled) {
            ds.Helper.removeClass(this.elLoadMore, Theme.cssButtonDisabled);
        } else {
            ds.Helper.addClass(this.elLoadMore, Theme.cssButtonDisabled);
        }
    }

    static updateAttributes(item) {
        const keys = ['life', 'mana', 'strength', 'vitality', 'dexterity', 'intelligence', 'attack', 'defense'];

        keys.forEach((key) => {
            const el = this.elDetail.querySelector(`[data-attribute="${key}"]`);
            if (el) el.textContent = this.formatNumber(item[key] ?? 0);
        });
    }

    static updateHTML() {
        this.elPage = document.getElementById('wiki_monster');
        this.elDetail = document.getElementById('wiki-monster-detail');
        if (this.elDetail) {
            this.idMonster = this.elDetail.getAttribute('data-id-monster');
            this.level = 1;
            this.lang = document.documentElement.lang || 'en-US';
            this.elLevel = document.getElementById('wiki_monster_level');
            return;
        }
        if (!this.elPage) return;
        this.idMonster = this.elPage.getAttribute('data-id-monster');
        this.elLoadMore = document.getElementById('wiki_monster_load_more');
        this.elTbody = document.getElementById('wiki_monster_tbody');
        this.elLoading = this.elTbody ? this.elTbody.querySelector(`.ds-${Theme.cssLoadingWrapper}`) : null;
        this.lang = document.documentElement.lang || 'en-US';
    }
}

export class WikiSuggestions {
    static id = 'wiki_suggestions';
    static votesRemaining = 0;

    static addEventListeners() {
        this.elButtons.forEach((button) => {
            ds.Helper.addEventListener({
                context: this,
                el: button,
                handler: this.clickVote
            });
        });
    }

    static async clickVote(event) {
        const button = event.currentTarget;
        await this.requestVote(button);
    }

    static getText(target) {
        return this.elPage.dataset[target] || '';
    }

    static handleError(button, errorMessage) {
        if (errorMessage === 'vote_limit_reached') {
            this.votesRemaining = 0;
            this.syncButtons();
            ds.Notification.add({
                content: this.getText('textLimit'),
                color: 'red'
            });
            return;
        }

        ds.Helper.removeClass(button, Theme.cssButtonDisabled);

        const content = errorMessage === 'login_required'
            ? this.getText('textLogin')
            : this.getText('textError');

        ds.Notification.add({
            content,
            color: 'red'
        });
    }

    static init() {
        this.updateHTML();
        if (!this.elPage) return;
        if (!this.isLoggedIn()) return;

        this.addEventListeners();
        this.syncButtons();
    }

    static isLoggedIn() {
        return this.elPage.dataset.logged === 'true';
    }

    static async requestVote(button) {
        const id = Number(button.dataset.voteButton);

        ds.Helper.addClass(button, Theme.cssButtonDisabled);

        const response = await FetchData.postSuggestionVote({
            id
        });

        if (response?.isError) {
            this.handleError(button, response.errorMessage);
            return;
        }

        this.updateVoteCount(id, Number(response?.data?.votes || 0));

        this.votesRemaining -= 1;
        this.syncButtons();

        ds.Notification.add({
            content: this.getText('textSuccess'),
            color: 'green'
        });
    }

    static syncButtons() {
        const isBlocked = this.votesRemaining <= 0;

        this.elButtons.forEach((button) => {
            if (!isBlocked) {
                ds.Helper.removeClass(button, Theme.cssButtonDisabled);
                return;
            }
            ds.Helper.addClass(button, Theme.cssButtonDisabled);
        });
    }

    static updateHTML() {
        this.elPage = document.getElementById(this.id);
        if (!this.elPage) return;
        this.elButtons = Array.from(this.elPage.querySelectorAll('[data-vote-button]'));
        this.votesRemaining = Number(this.elPage.dataset.votesRemaining || 0);
    }

    static updateVoteCount(id, votes) {
        const elCount = this.elPage.querySelector(`[data-vote-count="${id}"]`);

        if (!elCount) return;

        elCount.textContent = votes;
    }
}
