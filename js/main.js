// This is used for state managment and functinos control

let aIconSrc = ["/img/icons/profile.png", "/img/icons/blogs.png", "/img/icons/photos.png", "/img/icons/mail.png", "/img/icons/msn.png", "/img/icons/about.png"];
let aIconDes = ["Profile", "Blogs", "Photos", "Mail", "MSN", "About"];
let aClickActions = ["profileClick()", "blogsClick()", "photosClick()", "mailClickAction()", "msnClick()", "aboutClick();"];

// State managment for opened windows
let windowsState = [
    {
        id: "window-profile",
        title: "Profile",
        icon: "/img/icons/profile.png",
        open: 0,
        active: 0,
        element: "<nick-window-profile/>",
        clickActions: "profileClick()",
        width: 800,
        height: 400,
    },
    {
        id: "window-blogs",
        title: "Blogs",
        icon: "/img/icons/blogs.png",
        open: 0,
        active: 0,
        element: "",
        clickActions: "blogsClick()",
        width: 1000,
        height: 800,
    },
    {
        id: "window-photos",
        title: "Photos",
        icon: "/img/icons/photos.png",
        open: 0,
        active: 0,
        element: "",
        clickActions: "photosClick()",
        width: 1000,
        height: 800,
    },
    {
        id: "",
        title: "Email",
        icon: "/img/icons/mail.png",
        open: 0,
        active: 0,
        element: "",
        clickActions: "mailClickAction()",
        width: 1000,
        height: 800,
    },
    {
        id: "window-msn",
        title: "MSN",
        icon: "/img/icons/msn.png",
        open: 0,
        active: 0,
        element: "",
        clickActions: "msnClick()",
        width: 1000,
        height: 800,
    },
    {
        id: "window-about",
        title: "About",
        icon: "/img/icons/about.png",
        open: 0,
        active: 0,
        element: "<nick-window-about/>",
        clickActions: "aboutClick()",
        width: 400,
        height: 150,
    },
];

window.addEventListener("DOMContentLoaded", (event) => {
    //Click outside of body
    document.body.addEventListener('click', (event) => {
        let curTarget = event.target;
        let aIcons = document.querySelectorAll('nick-desktop-icon');
        for (let icon of aIcons) {
            if (curTarget !== icon) {
                icon.isHighlighted = false;
            }
        }
        let startMenu = document.querySelector("nick-start-menu");
        let startButton = document.querySelector(".start-button")
        if (curTarget !== startMenu && curTarget !== startButton) {
            startMenu.isOpen = false;
        }
    });

    //Initialize Icons and Windows
    let windows = document.querySelectorAll("nick-window");
    for (let i = 0; i < windowsState.length; i++){
        let tempIcon = document.createElement("nick-desktop-icon");
        tempIcon.icon_src = windowsState[i].icon;
        tempIcon.title = windowsState[i].title;
        tempIcon.setAttribute("dbclickaction", aClickActions[i]);
        document.querySelector("#desktop_icons").appendChild(tempIcon);
        tempIcon.evtInit(event);

        let tempWindow = windows[i];
        tempWindow.id = windowsState[i].id;
        tempWindow.title = windowsState[i].title;
        tempWindow.content = windowsState[i].element;
        let windowBoundary = {
            top: document.querySelector("#wrap").getBoundingClientRect().top, 
            right: document.querySelector("#wrap").getBoundingClientRect().right,
            bottom: document.querySelector("#wrap").getBoundingClientRect().bottom - 31,
            left: document.querySelector("#wrap").getBoundingClientRect().left,
        }
        tempWindow.boundary = windowBoundary;
        tempWindow.height = windowsState[i].height;
        tempWindow.width = windowsState[i].width;
        tempWindow.setAttribute("onwindowsclick", "setActiveWindows(event)"); 
        tempWindow.setAttribute("onwindowsclose", "updateOpenedWindows(event)"); 
        tempWindow.setAttribute("onwindowsminimize", "updateMinimizeWindows(event)");
        document.querySelector("#all_windows").appendChild(tempWindow);
        tempWindow.evtInit(event);
        tempWindow.closeWindow(event);
    }

    //Initialize Menu
    let oStartMenu = document.querySelector("nick-start-menu");
    oStartMenu.aIconSrc = aIconSrc;
    oStartMenu.aIconDes = aIconDes;
    oStartMenu.aActions = aClickActions;
    document.querySelector("nick-start-menu").evtInit(event);

    //Initialize Programs Bar
    let oProgramBar = document.querySelector("nick-opened-programs");
    oProgramBar.evtInit(event);

});

let updateClock = () => {
    var now = new Date();
    var hours = now.getHours();
    var minutes = String(now.getMinutes()).padStart(2, '0'); // Pad with leading zero if necessary
    var meridian = hours >= 12 ? 'PM' : 'AM'; // Determine AM or PM
    hours = hours % 12 || 12; // Convert to 12-hour format
    var timeString = hours + ':' + minutes + ' ' + meridian;
    document.getElementById('clock').textContent = timeString;
}

setInterval(updateClock, 1000);

let setActiveWindows = (event) => {
    resetActiveState();
    let aWindows = document.querySelectorAll("nick-window");
    aWindows.forEach(window=> {
        if (event.detail.element.id !== window.id){
            window.zindex = 1;
        } else {
            window.zindex = 999;
            window.activeWindow(event);
        }
    })
    windowsState.forEach(obj => {
        if (obj.id === event.detail.element.id){
            obj.active = 1;
        }
    })
    updateProgramsBar();
}

let resetActiveState = () => {
    windowsState.forEach(obj => {
        obj.active = 0;
    })
}

let updateOpenedWindows = (event) => {
    resetActiveState();
    windowsState.forEach(obj => {
        if (obj.id === event.detail.element.id){
            obj.open = 0;
            obj.active = 0;
        }
    })
    updateProgramsBar();
}

let updateMinimizeWindows = (event) => {
    resetActiveState();
    windowsState.forEach(obj => {
        if (obj.id === event.detail.element.id){
            obj.open = 1;
            obj.active = 0;
        }
    })
    updateProgramsBar();
}

let updateProgramsBar = () => {
    document.querySelector("nick-opened-programs").openedPrograms = windowsState;
}

// Bunch of click actions
let startMenuClick = (event) => {
    document.querySelector("nick-start-menu").isOpen = null;
}

let profileClick = (event) => {
    resetActiveState();
    let profileWindow = document.querySelector("nick-window#window-profile");
    profileWindow.activeWindow(event);
    profileWindow.zindex = 999;
    windowsState[0].open = 1;
    windowsState[0].active = 1;
    updateProgramsBar();
}

let blogsClick = (event) => {
    alert("TODO");
    // document.querySelector("nick-window#window-profile").activeWindow(event);
}

let photosClick = (event) => {
    alert("TODO");
    // document.querySelector("nick-window#window-profile").activeWindow(event);
}

let mailClickAction = (event) => {
    window.location = "mailto:ntwnick@gmail.com";
}

let msnClick = (event) => {
    alert("TODO");
    // document.querySelector("nick-window#window-profile").activeWindow(event);
}

let aboutClick = (event) => {
    resetActiveState();
    let aboutWindow = document.querySelector("nick-window#window-about");
    aboutWindow.activeWindow(event);
    aboutWindow.zindex = 999;
    windowsState[5].open = 1;
    windowsState[5].active = 1;
    updateProgramsBar();
}
