function Tabzy(selector, option) {
    this.container = document.querySelector(selector);
    if (!this.container) {
        console.error(
            `Tabzy: No container found for the selector: '${selector}'`
        );
        return;
    }
    this.tabs = Array.from(this.container.querySelectorAll("li a"));
    if (!this.tabs.length) {
        console.error(`Tabzy: No tabs found inside the container`);
        return;
    }

    this.panels = this.tabs
        .map((tab) => {
            const panel = document.querySelector(tab.getAttribute("href"));
            if (!panel) {
                console.error(
                    `Tabzy: No panel found for the selector: '${tab.getAttribute(
                        "href"
                    )}'`
                );
            }
            return panel;
        })
        .filter(Boolean);
    if (this.tabs.length !== this.panels.length) return;
    this.opt = Object.assign({
        remember: false,
    }, options)

    this._init();
}
Tabzy.prototype._init = function () {
    // let tabToActivate = null;

    // 1.local storage
    // const savedTab = localStorage.getItem('tabzy--active');

    // if(savedTab) {
    //     tabToActivate = this.tabs.find(tab => tab.getAttribute('href') === savedTab);
    // } else {
    //     tabToActivate = this.tabs[0];
    // }

    // 2. locaton hash
    const hash = location.hash;
    const tab =
        (this.opt.remember && hash && this.tabs.find((tab) => tab.getAttribute("href") === hash)) ||
        this.tabs[0];
    this._activateTab(tab);

    this.tabs.forEach((tab) => {
        tab.onclick = (event) => this._handleTabClick(event, tab);
    });
};

Tabzy.prototype._handleTabClick = function (event, tab) {
    event.preventDefault();

    this._activateTab(tab);
};

Tabzy.prototype._activateTab = function (tab) {
    this.tabs.forEach((tab) => {
        tab.closest("li").classList.remove("tabzy--active");
    });

    tab.closest("li").classList.add("tabzy--active");

    this.panels.forEach((panel) => (panel.hidden = true));

    const panelActive = document.querySelector(tab.getAttribute("href"));
    panelActive.hidden = false;

    // localStorage.setItem('tabzy--active', tab.getAttribute('href'));

    if(this.opt.remember) {
        history.replaceState(null, null, tab.getAttribute("href"));
    }
};

Tabzy.prototype.switchTab = function (input) {
    let tabToActivate = null;

    console.log(input);
    if (typeof input === "string") {
        tabToActivate = this.tabs.find(
            (tab) => tab.getAttribute("href") === input
        );

        if (!tabToActivate) {
            console.error(`Tabzy: No panel found with ID: '${input}'`);
            return;
        }
    } else if (this.tabs.includes(input)) {
        tabToActivate = input;
    }

    if (!tabToActivate) {
        console.error(`Tabzy: Invalid Input: '${input}'`);
        return;
    }
    this._activateTab(tabToActivate);
};

Tabzy.prototype.destroy = function () {
    this.tabs.forEach((tab) => {
        tab.closest("li").classList.remove("tabzy--active");
    });

    this.panels.forEach((panel) => {
        panel.hidden = false;
    });

    this.tabs.forEach((tab) => {
        tab.onclick = (e) => e.preventDefault();
    });

    this.container = null;
    this.tabs = null;
    this.panels = null;
};
