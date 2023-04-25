(async function() {
    const htmlTemplate = document.createElement("template");
    var htmlResponse=await fetch("/htm/nick-window-about.htm")
    htmlTemplate.innerHTML= await htmlResponse.text();

    if (!customElements.get('nick-window-about')) {
        customElements.define('nick-window-about', class extends HTMLElement {
            constructor() {
                super();

                const shadow = this.attachShadow({ mode: "open" });
                shadow.appendChild(htmlTemplate.content.cloneNode(true));

                this._aProgramsState = [];

                this.evtInit = (event) => {
                    this.registerCustomEvents(this, "clickaction");
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

        });
    }
})();