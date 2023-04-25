(async function() {
    const htmlTemplate = document.createElement("template");
    htmlTemplate.innerHTML = `
        <link rel="stylesheet" href="/css/components/nick-start-menu.css"/>
        <div class="start-menu" style="display: none;">
            <div class="start-menu-windows-version">
                <span id="windows_version"></span>
            </div>
            <div class="start-menu-programs" style="margin-left: 23px;">
            </div>
        </div>
	`;

    if (!customElements.get('nick-start-menu')) {
        customElements.define('nick-start-menu', class extends HTMLElement {
            constructor() {
                super();

                const shadow = this.attachShadow({ mode: "open" });
                shadow.appendChild(htmlTemplate.content.cloneNode(true));

                this._aIconSrc = [];
                this._aIconDes = [];
                this._aActions = [];
                this._bIsOpened = false;
                this._sWindowsVersion = "";

                this.invoke = (b) => {
                    if (b !== null){
                        this._bIsOpened = b;
                    } else {
                        this._bIsOpened = !this._bIsOpened;
                    }
                    this.shadowRoot.querySelector('div').style.display = this._bIsOpened ? "": "none";
                }

                this.evtInit = (event) => {

                    //Windows Version
                    this._sWindowsVersion = this.getAttribute("windows_version");
                    this.shadowRoot.querySelector("#windows_version").innerHTML = this._sWindowsVersion;

                    //Create division dynamically
                    let dProgramsContainer = this.shadowRoot.querySelector(".start-menu-programs");
                    for (let i = 0; i < this._aIconSrc.length; i++){
                        let tempDiv = document.createElement("div");
                        let tempIcon = document.createElement("img");
                        let tempDesDiv = document.createElement("div");
                        tempDesDiv.className = "start-menu-item-des";
                        tempIcon.src = this._aIconSrc[i];
                        tempDesDiv.innerHTML = this._aIconDes[i];
                        tempDiv.appendChild(tempIcon);
                        tempDiv.appendChild(tempDesDiv);
                        tempDiv.onclick = ()=>{
                            eval(this._aActions[i])
                            this.invoke(false);
                        };
                        dProgramsContainer.appendChild(tempDiv);
                    }

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

            set aIconSrc(a) {
                this._aIconSrc = a;
            }

            set aIconDes(a) {
                this._aIconDes = a;
            }

            set aActions(a) {
                this._aActions = a;
            }

            set isOpen(b) {
                this.invoke(b);
            }

            get isOpen() {
                return this._bIsOpened;
            }

            get windows_version() {
                return this._sWindowsVersion;
            }
        });
    }
})();
