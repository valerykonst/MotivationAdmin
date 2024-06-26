/*
 To use custom input for instance do

    HTML:
    <div class="input-box">
        <label for="phrase-author">Автор</label>
        <div id="phrase-author" data-type="single" data-name="phrase_author" data-placeholder="Приклад: Haruki Murakami"></div>
    </div>
    <div class="input-box">
        <div id="phrase-category" data-type="multiple" data-name="phrase_category" data-placeholder="+ Підкатегорія"></div>
        <span class="info">Цитата повинна бути прив’язана до підкатегорії</span>
    </div>

    JS:
    <script>
        const authorSuggestions = ["CEO", "Quality Assurance Tester", "Public Relations Officer", "Compliance Officer"];
        const categorySuggestions = ["UI", "UX", "Html", "JavaScript", "TypeScript", "Communication", "Problem Solving", "Leadership", "Time Management"];

        new CustomInput(document.getElementById('phrase-author'), authorSuggestions);
        new CustomInput(document.getElementById('phrase-category'), categorySuggestions);
    </script>
*/

class CustomInput {
    constructor(container, suggestions) {
        this.container = container;
        this.type = container.getAttribute('data-type');
        this.placeholder = container.getAttribute('data-placeholder');
        this.hiddenInputName = container.getAttribute('data-name');
        this.suggestions = suggestions;
        this.selectedItems = [];
        this.highlightedIndex = -1;

        this.init();
    }

    init() {
        this.container.classList.add('custom-input');
        
        this.input = document.createElement('input');
        this.input.type = 'text';
        this.input.placeholder = this.placeholder;
        this.container.appendChild(this.input);

        this.hiddenInput = document.createElement('input');
        this.hiddenInput.type = 'hidden';
        this.hiddenInput.name = this.hiddenInputName;
        this.container.appendChild(this.hiddenInput);

        if (this.type === 'multiple') {
            this.tagsContainer = document.createElement('div');
            this.tagsContainer.classList.add('tags');
            this.container.insertBefore(this.tagsContainer, this.input);
        }

        this.dropdown = document.createElement('div');
        this.dropdown.classList.add('dropdown');
        this.container.appendChild(this.dropdown);

        this.input.addEventListener('input', this.onInput.bind(this));
        this.input.addEventListener('keydown', this.onKeyDown.bind(this));
        this.input.addEventListener('focus', this.onFocus.bind(this));
        this.input.addEventListener('blur', this.onBlur.bind(this));
    }

    onInput(event) {
        const value = event.target.value.toLowerCase();
        this.dropdown.innerHTML = '';
        this.highlightedIndex = -1;

        const filteredSuggestions = this.suggestions.filter(suggestion => 
            suggestion.toLowerCase().includes(value)
        );

        filteredSuggestions.forEach((suggestion, index) => {
            const suggestionItem = document.createElement('div');
            suggestionItem.textContent = suggestion;
            suggestionItem.addEventListener('click', () => {
                this.addItem(suggestion);
            });
            this.dropdown.appendChild(suggestionItem);
        });
    }

    onKeyDown(event) {
        const items = Array.from(this.dropdown.children);
        if (event.key === 'ArrowDown') {
            this.highlightedIndex = (this.highlightedIndex + 1) % items.length;
            this.updateHighlight(items);
        } else if (event.key === 'ArrowUp') {
            this.highlightedIndex = (this.highlightedIndex - 1 + items.length) % items.length;
            this.updateHighlight(items);
        } else if (event.key === 'Enter') {
            if (this.highlightedIndex > -1) {
                this.addItem(items[this.highlightedIndex].textContent);
            } else if (this.input.value) {
                this.addItem(this.input.value);
            }
        } else if (event.key === 'Escape') {
            this.dropdown.innerHTML = '';
        }
    }

    onFocus(event) {
        this.input.closest(".input-box").classList.add('focus')
    }

    onBlur(event) {
        setTimeout(() => {
            const value = event.target.value.toLowerCase();
            if(!value && this.tagsContainer.innerHTML === '') {
                this.input.closest(".input-box").classList.remove('focus')
            }
        }, 500)
    }

    updateHighlight(items) {
        items.forEach((item, index) => {
            if (index === this.highlightedIndex) {
                item.classList.add('highlighted');
            } else {
                item.classList.remove('highlighted');
            }
        });
    }

    addItem(item) {
        if (this.type === 'single') {
            this.input.value = item;
            this.hiddenInput.value = item;
            this.dropdown.innerHTML = '';
        } else if (this.type === 'multiple' && !this.selectedItems.includes(item)) {
            this.selectedItems.push(item);

            const tag = document.createElement('div');
            tag.classList.add('tag');

            const tagName = document.createElement('span');
            tagName.textContent = item;
            tag.appendChild(tagName);

            const removeBtn = document.createElement('span');
            //removeBtn.textContent = 'x';
            removeBtn.classList.add('remove-tag');
            removeBtn.addEventListener('click', () => {
                this.removeItem(item);
            });
            tag.appendChild(removeBtn);

            this.tagsContainer.appendChild(tag);

            this.input.value = '';
            this.dropdown.innerHTML = '';

            this.updateHiddenInput();
        }
    }

    removeItem(item) {
        this.selectedItems = this.selectedItems.filter(i => i !== item);
        this.renderTags();
        this.updateHiddenInput();
        if(this.tagsContainer.innerHTML === '') {
            this.input.closest(".input-box").classList.remove('focus')
        }
    }

    renderTags() {
        this.tagsContainer.innerHTML = '';
        this.selectedItems.forEach(item => {
            const tag = document.createElement('div');
            tag.classList.add('tag');

            const tagName = document.createElement('span');
            tagName.textContent = item;
            tag.appendChild(tagName);

            const removeBtn = document.createElement('span');
            //removeBtn.textContent = 'x';
            removeBtn.classList.add('remove-tag');
            removeBtn.addEventListener('click', () => {
                this.removeItem(item);
            });
            tag.appendChild(removeBtn);

            this.tagsContainer.appendChild(tag);
        });
    }

    updateHiddenInput() {
        this.hiddenInput.value = this.selectedItems.join(',');
    }
}

