(async function() {
    const htmlTemplate = document.createElement("template");
    htmlTemplate.innerHTML = `
        <link rel="stylesheet" href="/css/components/nick-desktop-icon.css"/>
        <div class="dv_icon" alt="">
            <div class="dv_icon_img">
                <img src="">
            </div>
            <!-- ICONS -->
            <!-- CENTER ALIGN DESCRIPTION-->
            <div class="dv_icon_des">
                <span></span>
            </div>
        </div>
	`;

    if (!customElements.get('nick-desktop-icon')) {
        customElements.define('nick-desktop-icon', class extends HTMLElement {
            constructor() {
                super();

                const shadow = this.attachShadow({ mode: "open" });
                shadow.appendChild(htmlTemplate.content.cloneNode(true));

                this._iconSrc = "";
                this._iconDes = "";
                this._bIsHighlighted = false;
                this._clickTimestamp;

                this.highlight = (bHighlight) => {
                    if (bHighlight) {
                        this._bIsHighlighted = true;
                        this.shadowRoot.querySelector('div').classList.add("desk-icon-click");
                    } else {
                        this._bIsHighlighted = false;
                        this.shadowRoot.querySelector('div').classList.remove("desk-icon-click");
                    }
                }

                this.evtInit = (event) => {
                    this.shadowRoot.querySelector('img').src = this._iconSrc;
                    this.shadowRoot.querySelector('.dv_icon_des > span').innerHTML = this._iconDes;
                    this.registerCustomEvents(this, "dbclickaction");
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

                //Custom Double Click Handling to save the timestamp
                this.addEventListener("click", (event) => {
                    let currentTimeStamp = new Date().getTime();
                    if (!this._clickTimestamp){
                        this._clickTimestamp = currentTimeStamp;
                        this.highlight(true);
                    } else if (currentTimeStamp - this._clickTimestamp < 200) {
                        let e = new CustomEvent('dbclickaction');
                        this.dispatchEvent(e);
                        this.highlight(false);
                    } else {
                        this.highlight(true);
                    }
                    this._clickTimestamp = currentTimeStamp;
                });
            }

            set icon_src(s) {
                this._iconSrc = s;
            }

            set title(s) {
                this._iconDes = s;
            }

            set isHighlighted(b) {
                this.highlight(b);
            }

            get isHighlighted() {
                return this._bIsHighlighted;
            }
        });
    }
})();
