class textfit extends HTMLElement {
    constructor() {
        super();

//        this.addEventListener('input',()=>this.render()); // contenteditable
        this.addEventListener('blur',()=>this.render()); // contenteditable
        //addEventListener('load',render); // e.g. font switch
        if (window.ResizeObserver) {
            this._rObserver = new ResizeObserver(() => this.render() );
        }

        this._observer = new IntersectionObserver((entries)=>{
            entries[0].isIntersecting ? this._animate(this._start, this._end) : this._reset();
        });
    }

    connectedCallback() {
        this.render();
//        this._rObserver && this._rObserver.observe(this);
    }
    disconnectedCallback() {
        this._rObserver.disconnect(this)
    }

    render(){
        const font = getComputedStyle(this).getPropertyValue('font-family');
        const canvas = document.createElement('canvas');
        const c2d = canvas.getContext('2d');
        c2d.direction = 'ltr';
        c2d.font = '1px ' + font;
        const text = this.innerText;
        const firstChar = text[0];
        const lastChar = text[text.length-1];
        console.log()
        const left = c2d.measureText(firstChar).actualBoundingBoxLeft;
        const right = c2d.measureText(lastChar).actualBoundingBoxRight;



        this.style.marginLeft = left + 'em';
        //this.style.marginRight = -right+left + 'em';
        //this.style.width = 'calc(100% + '+(right-left)+'em)';
        //this.style.top = -c2d.measureText('T').actualBoundingBoxAscent + 'em';

        // todo: remove "side bearing"
        // (canvas measureText?)
        // https://stackoverflow.com/questions/60347194/how-to-fit-text-to-a-precise-width-on-html-canvas

        this.style.fontSize = '';
        const style = getComputedStyle(this);
        const originalWidth = this.clientWidth; // how wide is the content, with the smallest font-size possible

        //let maxSize = parseFloat(style.fontSize);
        let maxSize = 400;
        const minSize = parseFloat(style.getPropertyValue('--u1-textfit-font-size-min') || 12);
        this.style.fontSize = minSize+'px';

        let runs = 0;
        let activeSize = minSize;

        let min = minSize;
        let max = maxSize;

        while (++runs < 20) {

            const tooWide = this.scrollWidth > originalWidth;
//            const tooHigh = this.scrollHeight > (this.clientHeight + 1);
//            const tooBig = tooWide || tooHigh;
//            if (!tooBig) {
            if (!tooWide) {
                min = activeSize;
                activeSize = (activeSize + max) / 2;
            } else { // to big
                max = activeSize;
                activeSize = (activeSize + min) / 2;
            }
            this.style.fontSize = activeSize + 'px';
            if (maxSize - activeSize < 0.1) return;
        }
    }

    //customProperty(property) { return getComputedStyle(this).getPropertyValue('--u1-carousel-' + property); }
}


function format(el, val){
    return new Intl.NumberFormat(undefined, {
        style: 'decimal',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(val);
}

customElements.define('u1-textfit', textfit)



/*
c1.onElement('[c1-text-fit1]',{immediate:function(el){ 'use strict'

	function render(e){
		el.style.fontSize = '';
		var style = getComputedStyle(el);
		var maxSize = parseFloat(style.fontSize);
		var minSize = style.getPropertyValue('--font-size-min') || 12;
		el.style.fontSize = minSize+'px';
		var originalWidth = el.clientWidth; // how wide is the content, with the smallest font-size possible

		var runs = 0;
		var activeSize = minSize;

		var min = minSize;
		var max = maxSize;

		while (++runs < 20) {
			var tooWide = el.clientWidth > originalWidth;
			var tooHigh = el.scrollHeight > (el.clientHeight + 1);
			var tooBig = tooWide || tooHigh;
			if (!tooBig) {
				min = activeSize;
				activeSize = (activeSize + max) / 2;
			} else { // to big
				max = activeSize;
				activeSize = (activeSize + min) / 2;
			}
			el.style.fontSize = activeSize + 'px';
			if (maxSize - activeSize < 0.1) return;
		}
	}
	render();
	el.addEventListener('input',render); // contenteditable
	addEventListener('load',render); // e.g. font switch
	if (window.ResizeObserver) {
		const rO = new ResizeObserver(render);
		rO.observe(el);
	}
}})
*/