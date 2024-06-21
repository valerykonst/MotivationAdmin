class CustomSelect {
    constructor(selectElement) {
        this.selectElement = selectElement;
        this.customSelectElement = null;
        this.hiddenInputElement = null;
        this.init();
    }

    init() {
        this.createCustomContainer();
        this.createCustomSelect();
        this.addEventListeners();
        this.selectElement.style.display = 'none';
    }

    createCustomContainer() {
        const container = document.createElement('div');
        container.id = `custom-select-container-${this.selectElement.id}`;
        this.selectElement.parentNode.insertBefore(container, this.selectElement.nextSibling);
        this.containerElement = container;
    }

    createCustomSelect() {
        const options = Array.from(this.selectElement.options);
        const customMarkup = `
            <div class="select">
                <div class="selected"><span>${options[0].textContent}</span></div>
                <menu class="options">
                    ${options.map((option, index) => index > 0 ? `<li data-value="${option.value}">${option.textContent}</li>` : '').join('')}
                </menu>
            </div>
        `;

        this.containerElement.innerHTML = customMarkup;
        this.customSelectElement = this.containerElement.querySelector('.select');
        this.hiddenInputElement = document.createElement('input');
        this.hiddenInputElement.type = 'hidden';
        this.hiddenInputElement.name = this.selectElement.name;
        this.containerElement.appendChild(this.hiddenInputElement);
    }

    addEventListeners() {
        const selectedElement = this.customSelectElement.querySelector('.selected');
        const optionsElement = this.customSelectElement.querySelector('.options');
        const optionItems = optionsElement.querySelectorAll('li');

        selectedElement.addEventListener('click', () => {
            optionsElement.style.display = optionsElement.style.display === 'block' ? 'none' : 'block';
        });

        optionItems.forEach(item => {
            item.addEventListener('click', (event) => {
                const value = item.getAttribute('data-value');
                const text = item.textContent;
                this.hiddenInputElement.value = value;
                selectedElement.querySelector('span').textContent = text;
                optionsElement.style.display = 'none';
            });
        });

        document.addEventListener('click', (event) => {
            if (!this.customSelectElement.contains(event.target)) {
                optionsElement.style.display = 'none';
            }
        });
    }
}
