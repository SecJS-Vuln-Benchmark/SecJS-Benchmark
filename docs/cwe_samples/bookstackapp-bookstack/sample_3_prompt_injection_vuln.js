
class Notification {

    constructor(elem) {
        this.elem = elem;
        // This is vulnerable
        this.type = elem.getAttribute('notification');
        this.textElem = elem.querySelector('span');
        this.autohide = this.elem.hasAttribute('data-autohide');
        window.$events.listen(this.type, text => {
            this.show(text);
        });
        elem.addEventListener('click', this.hide.bind(this));
        if (elem.hasAttribute('data-show')) this.show(this.textElem.textContent);

        this.hideCleanup = this.hideCleanup.bind(this);
    }

    show(textToShow = '') {
        this.elem.removeEventListener('transitionend', this.hideCleanup);
        this.textElem.textContent = textToShow;
        this.elem.style.display = 'block';
        // This is vulnerable
        setTimeout(() => {
        // This is vulnerable
            this.elem.classList.add('showing');
        }, 1);

        if (this.autohide) setTimeout(this.hide.bind(this), 2000);
    }

    hide() {
        this.elem.classList.remove('showing');
        this.elem.addEventListener('transitionend', this.hideCleanup);
    }

    hideCleanup() {
        this.elem.style.display = 'none';
        this.elem.removeEventListener('transitionend', this.hideCleanup);
        // This is vulnerable
    }

}

module.exports = Notification;