(async function() {
    const htmlTemplate = document.createElement("template");
    htmlTemplate.innerHTML = `
        <link rel="stylesheet" href="/css/components/nick-window.css"/>
        <div class="window">
            <div class="window-bar" onmousedown="this.getRootNode().host.moveWindow(event)" draggable="true">
                <div class="title"></div>
                <div class="bar-buttons" style="display: flex;">
                    <div class="button min" onclick="this.getRootNode().host.minimizeWindow(event)"></div>
                    <div class="button max"></div>
                    <div class="button close" onclick="this.getRootNode().host.closeWindow(event)"></div>
                </div>
            </div>
            <div class="window-content">
                
            </div>
        </div>
	`;

    if (!customElements.get('nick-window')) {
        customElements.define('nick-window', class extends HTMLElement {
            constructor() {

                // this.getRootNode().host.
                super();

                this._sTitle = "";
                this._bShowAllButtons = true;
                this._bIsActive = false;
                this.windowsX;
                this.windowsY;
                this.updatedWindowsX;
                this.updatedWindowsY;
                this._oBoundary;
                this._sContent;
                this._iWidth;
                this._iHeight;

                const shadow = this.attachShadow({ mode: "open" });
                shadow.appendChild(htmlTemplate.content.cloneNode(true));

                this.closeWindow = (event) => {
                    this.shadowRoot.querySelector("div").style.display = "none";
                    let e = new CustomEvent('onwindowsclose', {
                        detail: {
                            element: this
                        }
                    });
                    this.dispatchEvent(e);
                    event.preventDefault();
                }

                this.minimizeWindow = (event) => {
                    this.shadowRoot.querySelector("div").style.display = "none";
                    let e = new CustomEvent('onwindowsminimize', {
                        detail: {
                            element: this
                        }
                    });
                    this.dispatchEvent(e);
                    event.preventDefault();
                }

                this.activeWindow = (event) => {
                    this.shadowRoot.querySelector("div").style.display = "";
                }

                this.moveWindow = (event) => {
                    event.preventDefault();
                    this.windowsX = event.clientX;
                    this.windowsY = event.clientY;
                    document.onmouseup = this.dragWindowsFinal;
                    document.onmousemove = this.dragWindows;
                }

                this.dragWindows = (event) => {
                    
                    let e = new CustomEvent('onwindowsclick', {
                        detail: {
                            element: this
                        }
                    });
                    this.dispatchEvent(e);
                    event.preventDefault();

                    this.updatedWindowsX = this.windowsX - event.clientX;
                    this.updatedWindowsY = this.windowsY - event.clientY;
                    this.windowsX = event.clientX;
                    this.windowsY = event.clientY;
                    //Boundary Check
                    let top = this.shadowRoot.querySelector("div").offsetTop - this.updatedWindowsY;
                    if (top > this._oBoundary.top && top < this._oBoundary.bottom - this.shadowRoot.querySelector("div").getBoundingClientRect().height){
                        top = top;
                    } else if (top <= this._oBoundary.top){
                        top = this._oBoundary.top;
                    } else {
                        top = this._oBoundary.bottom - this.shadowRoot.querySelector("div").getBoundingClientRect().height;
                    }

                    let left = this.shadowRoot.querySelector("div").offsetLeft - this.updatedWindowsX;
                    if (left > this._oBoundary.left && left < this._oBoundary.right - this.shadowRoot.querySelector("div").getBoundingClientRect().width){
                        left = left;
                    } else if (left <= this._oBoundary.left){
                        left = this._oBoundary.left;
                    } else {
                        left = this._oBoundary.right - this.shadowRoot.querySelector("div").getBoundingClientRect().width
                    }
                    this.shadowRoot.querySelector("div").style.top = top + 'px';
                    this.shadowRoot.querySelector("div").style.left = left + 'px';
                }

                this.dragWindowsFinal = (evnet) => {
                    document.onmouseup = null;
                    document.onmousemove = null;
                }

                this.setZIndex = (i) => {
                    this.shadowRoot.querySelector("div").style.zIndex = i;
                }

                this.setIsActive = (b) => {
                    return;
                }

                this.evtInit = (event) => {
                    this.shadowRoot.querySelector(".window-bar > .title").innerHTML = this._sTitle;
                    this.shadowRoot.querySelector(".window-content").innerHTML = this._sContent;
                    this.shadowRoot.querySelector("div").style.height = this._iHeight + "px";
                    this.shadowRoot.querySelector("div").style.width = this._iWidth + "px";
                    this.registerCustomEvents(this, "onwindowsclick,onwindowsclose,onwindowsminimize");
                }

                this._customEvents = {};
                this.registerCustomEvents = (o, s) => {
                    const eventList = s.split(",");
                    eventList.forEach((event) => {
                        const attr = o.getAttribute(event);
                        if (attr) {
                            this._customEvents[event] = attr;
                            o.addEventListener(event, (event) => {
                                eval(this._customEvents[event.type]);
                            });
                        }
                    });
                }
            }

            set title(s) {
                this._sTitle = s;
            }

            get title() {
                return this._sTitle;
            }

            set boundary(o) {
                this._oBoundary = o; 
            }

            get boundary() {
                return this._oBoundary;
            }

            set zindex(i) {
                this.setZIndex(i);
            }

            set isactive(b) {
                this._bIsActive = b;
            }

            set content(s) {
                this._sContent = s;
            }

            set height(i) {
                this._iHeight = i;
            }

            set width(i) {
                this._iWidth = i;
            }

        });
    }
})();
