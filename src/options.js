document.addEventListener('DOMContentLoaded', function () {
    loadPreferences();

    document.getElementById('optionsForm').addEventListener('submit', function (event) {
        event.preventDefault();
        savePreferences();
    });
});

async function loadPreferences() {
    const accounts = await browser.accounts.list(false);
    const imapAccounts = accounts.filter(a => a.type === 'imap');
    const form = document.getElementById('optionsForm');

    for (const account of imapAccounts) {
        await createCheckbox(account);
    }

    async function createCheckbox(account) {
        const row = document.createElement('div');
        const label = document.createElement('label');
        const input = document.createElement('input');

        input.type = 'checkbox';
        input.name = account.name;
        input.value = 'enabled';
        label.appendChild(input);
        label.appendChild(document.createTextNode(account.name));
        row.appendChild(label);
        form.appendChild(row);

        const result = await browser.storage.sync.get(account.id);
        input.checked = result[account.id] === true;
    }
}

async function savePreferences() {
    const preferences = {};
    const accounts = await browser.accounts.list(false);
    const imapAccounts = accounts.filter(a => a.type === 'imap');
    const form = document.getElementById('optionsForm');

    imapAccounts.forEach(account => {
        const input = form.querySelector(`input[name="${account.name}"]`);
        preferences[account.id] = input ? input.checked : false;
    });

    await browser.storage.sync.set(preferences);
    console.log('Preferences saved:', preferences);
}