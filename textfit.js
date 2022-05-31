class textfit extends HTMLElement {
    constructor() {
        super();

        let shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.innerHTML = `
        <style>
        slot { display:block; }
        </style>
        <slot></slot>
        `;
        this.slotEl = shadowRoot.querySelector('slot');

        this.addEventListener('input',()=>this.render()); // contenteditable
        addEventListener('load',this.render()); // e.g. font switch
        if (window.ResizeObserver) {
            this._rObserver = new ResizeObserver(() => this.render() );
        }

    }

    connectedCallback() {
        this.render();
        this._rObserver && this._rObserver.observe(this);
    }
    disconnectedCallback() {
        this._rObserver.disconnect(this)
    }

    render(){
        const font = getComputedStyle(this).getPropertyValue('font-family');
        const weight = getComputedStyle(this).getPropertyValue('font-weight');
        const fStyle = getComputedStyle(this).getPropertyValue('font-style');
        const canvas = document.createElement('canvas');
        const c2d = canvas.getContext('2d');
        c2d.direction = 'ltr';
        c2d.font = fStyle + ' ' + weight + ' 100px ' + font;
        const text = this.innerText;
        const measure = c2d.measureText(text);
        const left  = measure.actualBoundingBoxLeft;
        const right = measure.actualBoundingBoxRight;
        //const ascent = measure.actualBoundingBoxAscent;
        //const descent = measure.actualBoundingBoxDescent;

        this.slotEl.style.marginLeft = left/100 + 'em';

        const widthAt100px = right + left;
        const space = this.clientWidth; // how wide is the content, with the smallest font-size possible
        let fs = (space / widthAt100px) * 100

        this.style.setProperty('--gen-font-size', fs+'px');
    }
}

customElements.define('u1-textfit', textfit)
