/*                  Извлечение данных                  */

function extractData (target, data) {
    return target.getAttribute(data);
}
function disableSelection () {
    return false;
}


/*                  Работа кнопки Run                  */

const runButton = document.getElementsByClassName("nav__button_run")[0];

runButton.addEventListener("click", rotateButton);

function rotateButton () {
    if (window.matchMedia("(min-width: 767px) and (min-height: 440px)").matches) {
        runButton.disabled = true;
        runButton.addEventListener("animationend", rotateButtonCallback);
        runButton.classList.add("nav__button_loading");
    }
}
function rotateButtonCallback () {
    runButton.classList.remove("nav__button_loading");
    runButton.removeEventListener("animationend", rotateButtonCallback);
    runButton.disabled = false;
}


/*                  Открытие/сокрытие навигации для мобильных устройств                  */

const toggleButton = document.getElementsByClassName("toggle-button")[0];
const navActions = document.getElementsByClassName("nav__actions")[0];

toggleButton.addEventListener("click", navActionsOpen);

function navActionsOpen () {
    document.addEventListener("click", navActionsClose);
    toggleButton.classList.toggle("toggle-button_expanded");
    navActions.classList.toggle("nav__actions_open")
}
function navActionsClose (event) {
    if (!isNavActions(event.target.className)) {
        document.removeEventListener("click", navActionsClose);
        toggleButton.classList.remove("toggle-button_expanded");
        navActions.classList.remove("nav__actions_open")
    }
}
function isNavActions (className) {
    return className.includes("toggle-button") || className.includes("nav__actions");
}


/*                  Открытие/сокрытие модального окна                  */

const actionButtons =  getActionButtons();
const actionCloseButtons = getActionCloseButtons();
const modal = document.getElementsByClassName("modal")[0];

function getActionButtons () {
    const navButtonAction = Array.from(document.getElementsByClassName("nav__button_settings"));
    const mainButtonAction = Array.from(document.getElementsByClassName("main__button_settings"));

    return navButtonAction.concat(mainButtonAction);
}
function getActionCloseButtons () {
    const headerCloseButton = Array.from(document.getElementsByClassName("modal-header__close-button"));
    const footerCloseButton = Array.from(document.getElementsByClassName("modal-footer__close-input"));

    return headerCloseButton.concat(footerCloseButton);
}

actionButtons.forEach((button) => button.addEventListener("click", modalOpen));

function modalOpen (event) {
    overlayDisplay(modalClose);
    actionCloseButtons.forEach((button) => button.addEventListener("click", modalClose));
    modalTabSelect(event.target);
    modal.classList.add("modal_open");
}
function modalTabSelect (target) {
    if (target.hasAttribute("data-settings")) {
        const data = extractData(target, "data-settings");

        switch (data) {
            case "editor":
                changeActive(modalButtons[0], modalTabs[0]);
                break;
            case "result":
                changeActive(modalButtons[1], modalTabs[1]);
                break;
            case "graph" :
                changeActive(modalButtons[0], modalTabs[0]);
                break;
        }
    }
}
function modalClose () {
    overlayHide(modalClose);
    actionCloseButtons.forEach((button) => button.removeEventListener("click", modalClose));
    modal.classList.remove("modal_open");
}


/*                  Переключение между вкладками модального окна                  */

const modalButtons = document.getElementsByClassName("modal__button");
const modalTabs = document.getElementsByClassName("modal__tab");
let activeButton = modalButtons[0];
let activeTab = modalTabs[0];

Array.from(modalButtons).forEach((link) => link.addEventListener("click", modalButtonMapping));

function modalButtonMapping (event) {
    switch (event.target) {
        case modalButtons[0]:
            changeActive(modalButtons[0], modalTabs[0]);
            break;
        case modalButtons[1]:
            changeActive(modalButtons[1], modalTabs[1]);
            break;
    }
}
function changeActive (button, tab) {
    activeButton.classList.remove("modal__button_active");
    activeButton = button;
    activeButton.classList.add("modal__button_active");

    activeTab.classList.remove("modal__tab_active");
    activeTab = tab;
    activeTab.classList.add("modal__tab_active");
}


/*                  Открытие/сокрытие подсказок                  */

const formHelpButtons = document.getElementsByClassName("form__help-button");
const formHelpCloseButtons = document.getElementsByClassName("form-help__close-button");
const formsHelp = document.getElementsByClassName("form-help");
let previousFormHelp = null, formHelp = null;

Array.from(formHelpButtons).forEach((button) => button.addEventListener("click", formHelpDisplay));
Array.from(formHelpCloseButtons).forEach((button) => button.addEventListener("click", formHelpHide));

function formHelpDisplay (event) {
    const data = extractData(event.target, "data-form-help");

    formHelp = formHelpMapping(data, formsHelp);
    if (previousFormHelp !== null && previousFormHelp !== formHelp) {
        previousFormHelpHide(previousFormHelp);
    }
    formHelp.classList.toggle("form-help_display");
    previousFormHelp = formHelp;
}
function previousFormHelpHide () {
    previousFormHelp.classList.remove("form-help_display");
}
function formHelpHide () {
    formHelp.classList.remove("form-help_display");
}
function formHelpMapping (data, formsHelp) {
    switch (data) {
        case "trigonometry-mode":
            return formsHelp[0];
        case "x-tolerance":
            return formsHelp[1];
        case "max-iterations":
            return formsHelp[2]
        case "finite-difference-step":
            return formsHelp[3];
        case "decimal-places":
            return formsHelp[4];
        case "input-a":
            return formsHelp[5];
    }
}


/*                  Переключение между вкладками для мобильных устройств                  */

const mainNavButtons = document.getElementsByClassName("main-nav__button");
const editors = document.getElementsByClassName("main__editor-container");
let selectedButton = mainNavButtons[0];
let selectedEditor = editors[0];

Array.from(mainNavButtons).forEach((button) => button.addEventListener("click", buttonMapping));

function buttonMapping (event) {
    switch (event.target) {
        case mainNavButtons[0]:
            changeSelected(mainNavButtons[0], editors[0]);
            break;
        case mainNavButtons[1]:
            changeSelected(mainNavButtons[1], editors[1]);
            break;
        case mainNavButtons[2]:
            changeSelected(mainNavButtons[2], editors[2]);
            break;
    }
}
function changeSelected (button, editor) {
    selectedButton.classList.remove("main-nav__button_selected");
    selectedButton = button;
    selectedButton.classList.add("main-nav__button_selected");

    selectedEditor.classList.remove("main__editor-container_selected");
    selectedEditor = editor;
    selectedEditor.classList.add("main__editor-container_selected");
}


/*                  Изменение размеров окна редактора                 */ /* TODO: Дописать. Отключение кнопки. Переписать для процентов */

let previousElement, nextElement;
const horizontalResizer = document.getElementsByClassName("separator_resizer")[0];
let originalMousePositionX, previousElementWidth, nextElementWidth;

horizontalResizer.addEventListener("mousedown", mouseStartX);

function mouseStartX (event) {
    document.body.focus();
    document.body.onselectstart = disableSelection;

    previousElement = event.target.previousElementSibling;
    nextElement = event.target.nextElementSibling;

    originalMousePositionX = event.pageX;
    previousElementWidth = width(previousElement);
    nextElementWidth = width(nextElement);

    document.addEventListener("mousemove", mouseDragX);
    document.addEventListener("mouseup", mouseStopX)
}
function width (element) {
    return parseFloat(document.defaultView.getComputedStyle(element).width);
}
function mouseDragX (event) {
    const dx = (event.pageX - originalMousePositionX) || 0;
    previousElement.style.width = (previousElementWidth + dx) + "px";
    nextElement.style.width = (nextElementWidth - dx) + "px";

    const separatorTitle = document.getElementsByClassName("separator__title")[0]
    if (previousElementWidth + dx < 150) {
        separatorTitle.classList.add("separator__title_vertical");
    } else {
        separatorTitle.classList.remove("separator__title_vertical");
    }
}
function mouseStopX () {
    document.removeEventListener("mousemove", mouseDragX);
    document.removeEventListener("mouseup", mouseStopX);
}


/*                  Открытие/сокрытие выпадающего меню                  */

const dropdownButtons = document.getElementsByClassName("button_dropdown");
const dropdowns = document.getElementsByClassName("dropdown");
let previousDropdown = null, dropdown = null;

Array.from(dropdownButtons).forEach((button) => button.addEventListener("click", dropdownVisualise));

function dropdownVisualise (event) {
    const data = extractData(event.target, "data-dropdown");

    dropdown = dropdownMapping(data, dropdowns);
    if (previousDropdown !== null && previousDropdown !== dropdown) {
        previousDropdownHide();
    }
    dropdown.classList.toggle("dropdown_dropped");
    document.addEventListener("click", dropdownHide);
    previousDropdown = dropdown;
}
function previousDropdownHide () {
    previousDropdown.classList.remove("dropdown_dropped");
    document.removeEventListener("click", dropdownHide);
}
function dropdownHide (event) {
    if (!isDropdownButton(event.target)) {
        dropdown.classList.remove("dropdown_dropped");
        document.removeEventListener("click", dropdownHide);
    }
}
function dropdownMapping (data, dropdowns) {
    switch (data) {
        case "editor":
            return dropdowns[0];
        case "result":
            return dropdowns[1];
        case "graph":
            return dropdowns[2];
    }
}
function isDropdownButton (target) {
    return target.hasAttribute("data-dropdown");
}


/*                  Открытие/сокрытие консоли                  */

const consoleButton = document.getElementsByClassName("footer__button_console")[0];
const consoleCloseButton = document.getElementsByClassName("console__button_close")[0];
const console = document.getElementsByClassName("console")[0];
const verticalResizer = document.getElementsByClassName("separator_vertical")[0];
let consoleSectionMinHeight;

consoleButton.addEventListener("click", consoleDisplay);
consoleCloseButton.addEventListener("click", consoleHide);

function consoleDisplay () {
    console.classList.toggle("console_display");
    verticalResizer.classList.toggle("separator_console-open");
    consoleSectionMinHeight = document.getElementsByClassName("console__actions-container")[0].offsetHeight;
}
function consoleHide () {
    console.classList.remove("console_display");
    verticalResizer.classList.remove("separator_console-open");
}


/*                  Работа консоли                  */ /* TODO: Console parser. Добавить прокрутку после ввода */

const consoleCommands = [];
const consoleClearButton = document.getElementsByClassName("console__button_clear")[0];
const consoleEntries = document.getElementsByClassName("console__entries")[0];
const consoleTextArea = document.getElementsByClassName("command-line__textarea")[0];

consoleClearButton.addEventListener("click", clearConsole);
consoleTextArea.addEventListener("keypress", consoleInput);

function clearConsole () {
    const entries = document.getElementsByClassName("console__message");

    Array.from(entries).forEach((currentValue) => currentValue.parentNode.removeChild(currentValue));
}
function consoleInput (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        addEntries(consoleTextArea.value);
        consoleTextArea.value = "";
    }
}
function addEntries (value) {
    const message = createMessage("echo", value);
    consoleEntries.appendChild(message);

    if (true) {
        let errorMessage = createMessage("error", value);
        consoleEntries.appendChild(errorMessage);
    }
}
function createMessage (type, value) {
    const message = document.createElement("pre");

    switch (type) {
        case "echo":
            message.classList.add("console__message", "console__message_echo");
            message.textContent = value;
            break;
        case "error":
            message.classList.add("console__message", "console__message_error");
            message.textContent = '"' + value + ' is not defined"';
            break;
        case "log":
            message.classList.add("console__message", "console__message_log");
            message.textContent = value;
            break;
    }
    return message;
}


/*                  Изменение размеров окна консоли                  */

const mainSection = document.getElementsByClassName("main__inner-container")[0];
const mainSectionMinHeight = parseFloat(window.getComputedStyle(mainSection).minHeight);
let originalMousePositionY, mainSectionHeight, consoleSectionHeight;

verticalResizer.addEventListener("mousedown", mouseStartY);

function mouseStartY (event) {
    document.body.focus();
    document.body.onselectstart = disableSelection;

    previousElement = event.target.previousElementSibling;
    nextElement = event.target.nextElementSibling;

    originalMousePositionY = event.pageY;
    mainSectionHeight = getElementHeight(previousElement);
    consoleSectionHeight = getElementHeight(nextElement);

    document.addEventListener("mousemove", mouseDragY);
    document.addEventListener("mouseup", mouseStopY)
}
function getElementHeight (element) {
    return parseFloat(window.getComputedStyle(element).height);
}
function mouseDragY (event) {
    const dy = (event.pageY - originalMousePositionY) || 0;

    if (consoleSectionHeight - dy > consoleSectionMinHeight && mainSectionHeight + dy > mainSectionMinHeight) {
        previousElement.style.height = (mainSectionHeight + dy) + "px";
        nextElement.style.height = (consoleSectionHeight - dy) + "px";
    }
}
function mouseStopY () {
    document.removeEventListener("mousemove", mouseDragY);
    document.removeEventListener("mouseup", mouseStopY);
}


/*                  Открытие/сокрытие Export                  */

const exportButton = document.getElementsByClassName("footer__button_export")[0];
const footerExport = document.getElementsByClassName("footer__export")[0];

exportButton.addEventListener("click", exportVisualise);

function exportVisualise () {
    document.addEventListener("click", exportHide);
    footerExport.classList.toggle("export_visible");
}
function exportHide (event) {
    if (!isExport(event.target.className)) {
        document.removeEventListener("click", exportHide);
        footerExport.classList.remove("export_visible");
    }
}
function isExport (className) {
    return className.includes("export");
}


/*                  Открытие/сокрытие Shortcuts                  */

const shortcutsButton = document.getElementsByClassName("footer__button_shortcuts")[0];
const shortcuts = document.getElementsByClassName("key-commands")[0];

shortcutsButton.addEventListener("click", shortcutsDisplay);

function shortcutsDisplay () {
    overlayDisplay(shortcutsHide);
    shortcuts.classList.add("key-commands_display");
}
function shortcutsHide () {
    overlayHide(shortcutsHide);
    shortcuts.classList.remove("key-commands_display");
}


/*                  Открытие/сокрытие overlay                  */

const overlay = document.getElementsByClassName("overlay")[0];

function overlayDisplay (callback) {
    overlay.addEventListener("click", callback);
    overlay.classList.add("overlay_display");
}
function overlayHide (callback) {
    overlay.removeEventListener("click", callback);
    overlay.classList.remove("overlay_display");
}


/* TODO: Добавить изменение размеров шрифта */