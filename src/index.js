const buttons = {
    actionButtons: getActionButtons(),
    actionCloseButtons: getActionCloseButtons(),
    consoleClearButton: document.getElementsByClassName("console__button_clear")[0],
    consoleCloseButton: document.getElementsByClassName("console__button_close")[0],
    consoleButton: document.getElementsByClassName("footer__button_console")[0],
    dropdownButtons: document.getElementsByClassName("button_dropdown"),
    exportButton: document.getElementsByClassName("footer__button_export")[0],
    formHelpButtons: document.getElementsByClassName("form__help-button"),
    formHelpCloseButtons: document.getElementsByClassName("form-help__close-button"),
    mainNavButtons: document.getElementsByClassName("main-nav__button"),
    modalButtons: document.getElementsByClassName("modal__button"),
    navActions: document.getElementsByClassName("nav__actions")[0],
    runButton: document.getElementsByClassName("nav__button_run")[0],
    shortcutsButton: document.getElementsByClassName("footer__button_shortcuts")[0],
    toggleButton: document.getElementsByClassName("toggle-button")[0]
};
const spinnerAnimationTime = 2000;
const pageElements = {
    codeMirrors: document.getElementsByClassName("CodeMirror"),
    console: document.getElementsByClassName("console")[0],
    consoleEntries: document.getElementsByClassName("console__entries")[0],
    consoleTextArea: document.getElementsByClassName("command-line__textarea")[0],
    dropdowns: document.getElementsByClassName("dropdown"),
    editorContainers: document.getElementsByClassName("main__editor-container"),
    editor: createEditor(document.getElementsByClassName("editor")[0]),
    footer: document.getElementsByClassName("footer")[0],
    footerExport: document.getElementsByClassName("footer__export")[0],
    formHelps: document.getElementsByClassName("form-help"),
    horizontalResizer: document.getElementsByClassName("separator_resizer")[0],
    mainSection: document.getElementsByClassName("main__inner-container")[0],
    modal: document.getElementsByClassName("modal")[0],
    modalTabs: document.getElementsByClassName("modal__tab"),
    overlay: document.getElementsByClassName("overlay")[0],
    result: createEditor(document.getElementsByClassName("editor")[1]),
    resultTooltip: ["Try the following:", "", "1. Use different phrasing or notations", "2. Enter whole words instead of abbreviations", "3. Avoid mixing mathematical and other notations", "4. Check your spelling", "5. Give your input in English"],
    shortcuts: document.getElementsByClassName("key-commands")[0],
    verticalResizer: document.getElementsByClassName("separator_vertical")[0],
    zoom: document.getElementsByClassName("footer__button_zoom")[0]
};
const disableSelection = () => false;


/** Создание редактора. */

function createEditor(element) {
    const attribute = element.getAttribute("data-editor");

    switch (attribute) {
        case "editor":
            const editor = CodeMirror(element, {
                foldGutter: true,
                gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
                lineNumbers: true,
                lineWrapping: true,
                mode: "text/x-python",
                scrollbarStyle: "simple",
                theme: "twilight"
            });

            editor.focus();
            return editor;
        case "result":
            return CodeMirror(element, {
                cursorHeight: 0,
                foldGutter: true,
                gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
                lineNumbers: true,
                lineWrapping: true,
                mode: "text/x-python",
                readOnly: true,
                scrollbarStyle: "simple",
                theme: "twilight"
            });
    }
}


/** Открытие/сокрытие навигации для мобильных устройств. */

buttons.toggleButton.addEventListener("click", openMobileNavigation);

function openMobileNavigation() {
    buttons.navActions.classList.toggle("nav__actions_open");
    buttons.toggleButton.classList.toggle("toggle-button_expanded");
    document.addEventListener("click", closeMobileNavigation);
}
function closeMobileNavigation(event) {
    if (!isNavActions(event.target.className)) {
        buttons.navActions.classList.remove("nav__actions_open");
        buttons.toggleButton.classList.remove("toggle-button_expanded");
        document.removeEventListener("click", closeMobileNavigation);
    }
}
function isNavActions(className) {
    return className.includes("toggle-button") || className.includes("nav__actions");
}


/** Анимация кнопки Run. */

buttons.runButton.addEventListener("animationstart", () => {
    if (window.matchMedia("(min-width: 767px) and (min-height: 440px)").matches) {
        buttons.runButton.disabled = true;
    }
});
buttons.runButton.addEventListener("animationend", () => buttons.runButton.disabled = false);
buttons.runButton.addEventListener("click", startRunButtonAnimation);

function startRunButtonAnimation() {
    if (window.matchMedia("(min-width: 767px) and (min-height: 440px)").matches) {
        buttons.runButton.classList.add("nav__button_loading");
        buttons.runButton.addEventListener("animationend", endRunButtonAnimation);
    }
}
function endRunButtonAnimation() {
    buttons.runButton.classList.remove("nav__button_loading");
    buttons.runButton.removeEventListener("animationend", endRunButtonAnimation);
}


/** Работа вкладки Result. */

buttons.runButton.addEventListener("click", updateResult);

function updateResult() {
    hideResult();
    addTooltip();
    setTimeout(showResult, spinnerAnimationTime);
}
function addTooltip() {
    pageElements.result.setOption("lineNumbers", false);
    pageElements.result.setValue(pageElements.resultTooltip.join("\n"));
}
function hideResult() {
    const element = pageElements.result.getWrapperElement().parentElement;

    element.classList.add("editor_hidden");
    pageElements.result.setOption("lineNumbers", true);
}
function showResult() {
    const element = pageElements.result.getWrapperElement().parentElement;

    element.classList.remove("editor_hidden");
}


/** Открытие/сокрытие модального окна. */

function getActionButtons() {
    const mainActionButtons = Array.from(document.getElementsByClassName("main__button_settings"));
    const navActionButtons = Array.from(document.getElementsByClassName("nav__button_settings"));

    return [...mainActionButtons, ...navActionButtons];
}
function getActionCloseButtons() {
    const headerCloseButtons = Array.from(document.getElementsByClassName("modal-header__close-button"));
    const footerCloseButtons = Array.from(document.getElementsByClassName("modal-footer__close-input"));

    return [...headerCloseButtons, ...footerCloseButtons];
}

buttons.actionButtons.forEach((button) => button.addEventListener("click", openModal));

function openModal(event) {
    showOverlay(closeModal);
    selectModalTab(event.target);
    pageElements.modal.classList.add("modal_open");
    buttons.actionCloseButtons.forEach((button) => button.addEventListener("click", closeModal));
}
function closeModal() {
    hideOverlay(closeModal);
    pageElements.modal.classList.remove("modal_open");
    buttons.actionCloseButtons.forEach((button) => button.removeEventListener("click", closeModal));
}
function selectModalTab(target) {
    if (target.hasAttribute("data-editor")) {
        const attribute = target.getAttribute("data-editor");

        switch (attribute) {
            case "editor":
                changeActiveTab(buttons.modalButtons[0], pageElements.modalTabs[0], true);
                break;
            case "result":
                changeActiveTab(buttons.modalButtons[1], pageElements.modalTabs[1], true);
                break;
        }
    }
}


/** Переключение между вкладками модального окна. */

const changeActiveTab = changeActiveTabClosure();

[...buttons.modalButtons].forEach((link) => link.addEventListener("click", modalButtonMapping));

function modalButtonMapping(event) {
    switch (event.target) {
        case buttons.modalButtons[0]:
            changeActiveTab(buttons.modalButtons[0], pageElements.modalTabs[0]);
            break;
        case buttons.modalButtons[1]:
            changeActiveTab(buttons.modalButtons[1], pageElements.modalTabs[1]);
            break;
    }
}
function changeActiveTabClosure() {
    let activeButton = buttons.modalButtons[0];
    let activeTab = pageElements.modalTabs[0];

    return function(button, tab, fastTransition = false) {
        if (fastTransition) {
            activeButton.classList.add("modal__button_fast-transition");
            button.classList.add("modal__button_fast-transition");
        } else {
            activeButton.classList.remove("modal__button_fast-transition");
        }
        activeButton.classList.remove("modal__button_active");
        activeButton = button;
        activeButton.classList.add("modal__button_active");

        activeTab.classList.remove("modal__tab_active");
        activeTab = tab;
        activeTab.classList.add("modal__tab_active");
    }
}


/** Открытие/сокрытие подсказок. */

let formHelp, previousFormHelp;

[...buttons.formHelpButtons].forEach((button) => button.addEventListener("click", showFormHelp));

function showFormHelp(event) {
    const attribute = event.target.getAttribute("data-form-help");

    formHelp = formHelpMapping(attribute, pageElements.formHelps);
    if (previousFormHelp !== undefined && previousFormHelp !== formHelp) {
        hidePreviousFormHelp();
    }
    formHelp.classList.toggle("form-help_display");
    previousFormHelp = formHelp;
    Array.from(buttons.formHelpCloseButtons).forEach((button) => button.addEventListener("click", hideFormHelp));
}
function hideFormHelp() {
    formHelp.classList.remove("form-help_display");
    Array.from(buttons.formHelpCloseButtons).forEach((button) => button.removeEventListener("click", hideFormHelp));
}
function hidePreviousFormHelp() {
    previousFormHelp.classList.remove("form-help_display");
}
function formHelpMapping(attribute, formsHelp) {
    switch (attribute) {
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


/** Переключение между вкладками редактора для мобильных устройств. */

const changeSelectedEditor = changeSelectedEditorClosure();

[...buttons.mainNavButtons].forEach((button) => button.addEventListener("click", buttonMapping));

function buttonMapping(event) {
    switch (event.target) {
        case buttons.mainNavButtons[0]:
            changeSelectedEditor(buttons.mainNavButtons[0], pageElements.editorContainers[0]);
            break;
        case buttons.mainNavButtons[1]:
            changeSelectedEditor(buttons.mainNavButtons[1], pageElements.editorContainers[1]);
            break;
    }
}
function changeSelectedEditorClosure() {
    let selectedButton = buttons.mainNavButtons[0];
    let selectedEditor = pageElements.editorContainers[0];

    return function(button, editor) {
        selectedButton.classList.remove("main-nav__button_selected");
        selectedButton = button;
        selectedButton.classList.add("main-nav__button_selected");

        selectedEditor.classList.remove("main__editor-container_selected");
        selectedEditor = editor;
        selectedEditor.classList.add("main__editor-container_selected");
    }
}


/** Открытие/сокрытие выпадающих окон. */

let dropdown, previousDropdown;

[...buttons.dropdownButtons].forEach((button) => button.addEventListener("click", showDropdown));

function showDropdown(event) {
    const attribute = event.target.getAttribute("data-dropdown");

    dropdown = dropdownMapping(attribute, pageElements.dropdowns);
    if (previousDropdown !== undefined && previousDropdown !== dropdown) {
        hidePreviousDropdown();
    }
    dropdown.classList.toggle("dropdown_dropped");
    previousDropdown = dropdown;
    document.addEventListener("click", hideDropdown);
}
function hideDropdown(event) {
    if (!isDropdownButton(event.target)) {
        dropdown.classList.remove("dropdown_dropped");
        document.removeEventListener("click", hideDropdown);
    }
}
function hidePreviousDropdown() {
    previousDropdown.classList.remove("dropdown_dropped");
    document.removeEventListener("click", hideDropdown);
}
function dropdownMapping(attribute, dropdowns) {
    switch (attribute) {
        case "editor":
            return dropdowns[0];
        case "result":
            return dropdowns[1];
    }
}
function isDropdownButton(target) {
    return target.hasAttribute("data-dropdown");
}


/** Изменение размеров окна редактора. */

let nextElement, previousElement;
let nextElementWidth, originalMousePositionX, pageWidth, previousElementWidth;

pageElements.horizontalResizer.addEventListener("mousedown", mouseStartX);

function mouseStartX(event) {
    document.body.focus();
    document.body.onselectstart = disableSelection;

    originalMousePositionX = event.pageX;

    nextElement = event.target.nextElementSibling;
    previousElement = event.target.previousElementSibling;

    nextElementWidth = getElementWidth(nextElement);
    pageWidth = document.documentElement.scrollWidth;
    previousElementWidth = getElementWidth(previousElement);

    document.addEventListener("mousemove", mouseDragX);
    document.addEventListener("mouseup", mouseStopX);
}
function mouseDragX(event) {
    let dx = event.pageX - originalMousePositionX;

    if (event.pageX - 16 < 0) {
        dx = -previousElementWidth;
    }
    if (event.pageX + 16 > pageWidth) {
        dx = nextElementWidth;
    }
    previousElement.style.width = `${previousElementWidth + dx}px`;
    nextElement.style.width = `${nextElementWidth - dx}px`;
    changeTitleOrientation(dx);
}
function mouseStopX() {
    document.removeEventListener("mousemove", mouseDragX);
    document.removeEventListener("mouseup", mouseStopX);
}
function changeTitleOrientation(dx) {
    const editorSeparatorTitle = document.getElementsByClassName("separator__title")[0];
    const resultSeparatorTitle = document.getElementsByClassName("separator__title")[1];

    if (previousElementWidth + dx < 150) {
        editorSeparatorTitle.classList.add("separator__title_vertical");
    } else {
        editorSeparatorTitle.classList.remove("separator__title_vertical");
    }
    if (pageWidth - (previousElementWidth + dx) < 150) {
        resultSeparatorTitle.classList.add("separator__title_vertical");
    } else {
        resultSeparatorTitle.classList.remove("separator__title_vertical");
    }
}
function getElementWidth(element) {
    return parseFloat(document.defaultView.getComputedStyle(element).width);
}


/** Изменение размеров окна консоли. */

const mainMinHeight = parseFloat(window.getComputedStyle(pageElements.mainSection).minHeight);
const verticalResizerHeight = getElementHeight(pageElements.verticalResizer);
let consoleHeight, footerHeight, mainHeight, originalMousePositionY, pageHeight;

pageElements.verticalResizer.addEventListener("mousedown", mouseStartY);

function mouseStartY(event) {
    document.body.focus();
    document.body.onselectstart = disableSelection;

    originalMousePositionY = event.pageY;

    nextElement = event.target.nextElementSibling;
    previousElement = event.target.previousElementSibling;

    consoleHeight = getElementHeight(nextElement);
    footerHeight = getElementHeight(pageElements.footer);
    mainHeight = getElementHeight(previousElement);
    pageHeight = document.documentElement.scrollHeight;

    document.addEventListener("mousemove", mouseDragY);
    document.addEventListener("mouseup", mouseStopY)
}
function mouseDragY(event) {
    let dy = event.pageY - originalMousePositionY;

    if (event.pageY + verticalResizerHeight + footerHeight > pageHeight) {
        dy = consoleHeight;
    }
    if (mainHeight + dy > mainMinHeight) {
        previousElement.style.height = `${mainHeight + dy}px`;
        nextElement.style.height = `${consoleHeight - dy}px`;
    }
}
function mouseStopY() {
    document.removeEventListener("mousemove", mouseDragY);
    document.removeEventListener("mouseup", mouseStopY);
}
function getElementHeight(element) {
    return parseFloat(window.getComputedStyle(element).height);
}


/** Изменение размеров окна консоли при изменении размеров окна страницы. */

window.matchMedia("(max-width: 767px) or (max-height: 440px)").addEventListener("change", () => pageElements.console.style.height = `195px`);


/** Очистка консоли. */

buttons.consoleClearButton.addEventListener("click", clearConsole);

function clearConsole() {
    const entries = document.getElementsByClassName("console__message");

    [...entries].forEach((currentValue) => currentValue.parentNode.removeChild(currentValue));
}


/** Работа консоли. */

pageElements.consoleTextArea.addEventListener("keypress", consoleInput);

function consoleInput(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        addNewEntry(pageElements.consoleTextArea.value);
        pageElements.consoleTextArea.value = "";
    }
}
function addNewEntry(value) {
    const echo = createMessage("echo", value);
    pageElements.consoleEntries.appendChild(echo);

    switch(value) {
        default:
            const errorMessage = createMessage("error", value);

            pageElements.consoleEntries.appendChild(errorMessage);
    }
    pageElements.consoleEntries.lastElementChild.scrollIntoView(false);
}
function createMessage(type, value) {
    const message = document.createElement("pre");

    switch (type) {
        case "echo":
            message.classList.add("console__message", "console__message_echo");
            message.textContent = value;
            break;
        case "error":
            message.classList.add("console__message", "console__message_error");
            message.textContent = `"${value} is not defined"`;
            break;
    }
    return message;
}


/** Открытие/сокрытие консоли. */

buttons.consoleButton.addEventListener("click", openConsole);

function openConsole() {
    pageElements.console.classList.toggle("console_display");
    pageElements.verticalResizer.classList.toggle("separator_console-open");
    buttons.consoleCloseButton.addEventListener("click", closeConsole);
}
function closeConsole() {
    pageElements.console.classList.remove("console_display");
    pageElements.verticalResizer.classList.remove("separator_console-open");
    buttons.consoleCloseButton.removeEventListener("click", closeConsole);
}


/** Отображение контура для кнопки zoom. */

pageElements.zoom.addEventListener("focus", showOutline);

function showOutline(event) {
    if (event.relatedTarget === buttons.consoleButton) {
        pageElements.zoom.classList.add("footer__button_zoom-outline");
        pageElements.zoom.addEventListener("blur", hideOutline);
    }
}
function hideOutline() {
    pageElements.zoom.classList.remove("footer__button_zoom-outline");
    pageElements.zoom.removeEventListener("blur", hideOutline);
}


/** Изменение размера шрифта в редакторе. */

pageElements.zoom.addEventListener("change", changeFontSize);

function changeFontSize(event) {
    for (const codeMirror of pageElements.codeMirrors) {
        removeStyleAttribute(codeMirror);
        codeMirror.style.fontSize = `${event.target.value * parseInt(window.getComputedStyle(codeMirror).fontSize)}px`;
    }
}
function removeStyleAttribute(element) {
    element.removeAttribute("style");
}


/** Изменение размера шрифта в редакторе при изменении размеров окна страницы. */

window.matchMedia("(min-width: 767px) and (min-height: 440px)").addEventListener("change", () => [...pageElements.codeMirrors].forEach(removeStyleAttribute));


/** Открытие/сокрытие окна Export. */

buttons.exportButton.addEventListener("click", showExport);

function showExport() {
    pageElements.footerExport.classList.toggle("export_visible");
    document.addEventListener("click", hideExport);
}
function hideExport(event) {
    if (!isExport(event.target.className)) {
        pageElements.footerExport.classList.remove("export_visible");
        document.removeEventListener("click", hideExport);
    }
}
function isExport(className) {
    return className.includes("export");
}


/** Открытие/сокрытие overlay. */

function showOverlay(callback) {
    pageElements.overlay.classList.add("overlay_display");
    pageElements.overlay.addEventListener("click", callback);
}
function hideOverlay(callback) {
    pageElements.overlay.classList.remove("overlay_display");
    pageElements.overlay.removeEventListener("click", callback);
}