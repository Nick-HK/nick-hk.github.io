(async function() {
    const htmlTemplate = document.createElement("template");
    htmlTemplate.innerHTML = `
        <link rel="stylesheet" href="/css/components/nick-opened-programs.css"/>
        <div class="dv_programs_wrap" alt="">
        </div>
	`;

    if (!customElements.get('nick-opened-programs')) {
        customElements.define('nick-opened-programs', class extends HTMLElement {
            constructor() {
                super();

                const shadow = this.attachShadow({ mode: "open" });
                shadow.appendChild(htmlTemplate.content.cloneNode(true));

                this._aProgramsState = [];

                this.updateProgramBar = (event) => {
                    this.shadowRoot.querySelector("div").innerHTML = "";
                    this._aProgramsState.forEach(obj => {
                        if (obj.open){
                            let tempDiv = document.createElement("div");
                            let tempIcon = document.createElement("img");
                            let tempDes = document.createElement("div");
                            tempDes.innerHTML = obj.title;
                            tempIcon.src = obj.icon;
                            tempDiv.appendChild(tempIcon);
                            tempDiv.appendChild(tempDes);
                            tempDiv.className = "dv_program_bar"
                            tempDiv.setAttribute("data-invoked-window", obj.id);
                            if (obj.active === 1){
                                tempDiv.classList.add("active")
                            }
                            this.shadowRoot.querySelector("div").appendChild(tempDiv);
                        }
                    })
                }

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

                //Custom Double Click Handling to save the timestamp
                this.addEventListener("click", (event) => {
                    let cPath = event.composedPath();
                    let targetObj = null;
                    for (let i = 0; i < cPath.length; i++){
                        if (cPath[i].classList.contains("dv_program_bar")){
                            targetObj = cPath[i];
                            break;
                        }
                    } 

                    let e = new CustomEvent('clickaction', {
                        detail: {
                            element: {
                                id: targetObj.getAttribute("data-invoked-window")
                            }
                        }
                    });

                    this.dispatchEvent(e);
                    event.preventDefault();
                });
            }

            set openedPrograms(a) {
                this._aProgramsState = a;
                this.updateProgramBar(null);
            }

        });
    }
})();