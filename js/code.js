function solve(){
    var equations = editor.getValue();
    var json = JSON.stringify({"equations": equations, "guess_values": guess_values, "settings": settings});
    $.ajax({
        type: 'POST',
        url: "/cgi-bin/INLES/parseEq.cgi",
        datatype : "application/json",
        data: {"json": json},
        success: function(response){

            if(response.success){

                var solution = "";
                guess_values = response.solution;
                for(var key in response.solution){
                    solution += key + ": " + response.solution[key] + "\n";
                }
                $('#solution_text').val(solution);

            } else {
                $('#solution_text').val(response.error);
                guess_values = response.guess_values;
            }
            createGuessTable();
        }
    });

    document.getElementById("defaultOpen").click();
}

function updateGuess(key, value){
    guess_values[key] = parseFloat(value);
}

function createGuessTable(){
    var guess = "<button onclick='resetGuess()'>Reset</button><br><table style='width:100%'>";
    for(var key in guess_values){
        guess += "<tr><td>"+ key + "</td><td><input type='number' step=any onchange=" + '"' + "updateGuess('"+key+"',this.value)" + '"' + " value='" + guess_values[key] + "'></td></tr>";
    }
    guess += "</table>";
    $('#Guess').html(guess);
}

function resetGuess(){
    for(var key in guess_values){
        guess_values[key] = 1.0;
    }

    createGuessTable();
}

function setSetting(name, value){
    settings[name] = value;
}

function saveFile() {
    var filename = "equations.txt";
    var type = ".txt";
    var equations = editor.getValue();
    var json = JSON.stringify({"equations": equations, "guess_values": guess_values, "settings": settings});
    var file = new Blob([json], {type: type});
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else { // Others
        var a = document.createElement("a"),
            url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 0);
    }
}

function setSettings(){
    if(settings["rads"] == 1){
        $('#settings_trig_rad').prop('checked',true);
    } else {
        $('#settings_trig_deg').prop('checked',true);
    }
    $('#settings_xtol').val(settings["xtol"]);
    $('#settings_iter').val(settings["iter"]);
    $('#settings_fd_step').val(settings["fd_step"]);
    $('#settings_decimal').val(settings["decimal"]);
}

function loadFile(evt){
    //Retrieve the first (and only!) File from the FileList object
    var f = evt.target.files[0];

    if (f) {
        var r = new FileReader();
        r.onload = function(e) {
            var contents = e.target.result;
            var data = JSON.parse(contents);
            settings = data["settings"];
            guess_values = data["guess_values"];
            editor.setValue(data["equations"]);
            createGuessTable();
            setSettings();
        }
        r.readAsText(f);
    } else {
        alert("Failed to load file!");
    }
}

function openTab(evt, tabName) {
    // Declare all variables
    var i, tabcontent, tablinks;

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}

/*                  Открытие/сокрытие навигации для мобильных устройств                  */

const toggleButton = document.getElementsByClassName("toggle-button")[0];
const navActions = document.getElementsByClassName("nav__actions")[0];

toggleButton.addEventListener("click", navActionsOpen);

function navActionsOpen() {
    toggleButton.classList.toggle("toggle-button_expanded");
    navActions.classList.toggle("nav__actions_open")
    document.addEventListener("click", navActionsClose);
}
function navActionsClose(event) {
    if(!isNavActions(event.target.className)) {
        toggleButton.classList.remove("toggle-button_expanded");
        navActions.classList.remove("nav__actions_open")
        document.removeEventListener("click", navActionsClose);
    }
}
function isNavActions(className) {
    return className.includes("toggle-button") || className.includes("nav__actions");
}


/*                  Открытие/сокрытие модального окна                  */

const actionButtons =  getActionButtons();
const actionCloseButtons = getActionCloseButtons();
const modal = document.getElementsByClassName("modal")[0];

function getActionButtons() {
    let navButtonAction = Array.from(document.getElementsByClassName("nav__button_settings"));
    let mainButtonAction = Array.from(document.getElementsByClassName("main__button_action"));
    return navButtonAction.concat(mainButtonAction);
}
function getActionCloseButtons() {
    let headerCloseButton = Array.from(document.getElementsByClassName("modal-header__close-button"));
    let footerCloseButton = Array.from(document.getElementsByClassName("modal-footer__close-input"));
    return headerCloseButton.concat(footerCloseButton);
}

actionButtons.forEach((button) => button.addEventListener("click", modalOpen));

function modalOpen() {
    overlayDisplay(modalClose);
    actionCloseButtons.forEach((button) => button.addEventListener("click", modalClose));
    modal.classList.add("modal_open");
}
function modalClose() {
    overlayHide(modalClose);
    actionCloseButtons.forEach((button) => button.removeEventListener("click", modalClose));
    modal.classList.remove("modal_open");
}


/*                  Переключение между вкладками модального окна                  */

const modalButton = document.getElementsByClassName("modal__button");
const modalTabs = document.getElementsByClassName("modal__tab");
let activeLink = modalButton[0];
let activeTab = modalTabs[0];

Array.from(modalButton).forEach((link) => link.addEventListener("click", linkIdentify));

function linkIdentify(event) {
    switch (event.target) {
        case modalButton[0]:
            changeActive(modalButton[0], modalTabs[0]);
            break;
        case modalButton[1]:
            changeActive(modalButton[1], modalTabs[1]);
            break;
    }
}
function changeActive(link, tab) {
    activeLink.classList.remove("modal__button_active");
    activeLink = link;
    activeLink.classList.add("modal__button_active");

    activeTab.classList.remove("modal__tab_active");
    activeTab = tab;
    activeTab.classList.add("modal__tab_active");
}


/*                  Переключение между вкладками для мобильных устройств                  */

const mainNavButtons = document.getElementsByClassName("main-nav__button");
const editors = document.getElementsByClassName("main__editor-container");
let selectedButton = mainNavButtons[0];
let selectedEditor = editors[0];

Array.from(mainNavButtons).forEach((button) => button.addEventListener("click", buttonIdentify));

function buttonIdentify(event) {
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
function changeSelected(button, editor) {
    selectedButton.classList.remove("main-nav__button_selected");
    selectedButton = button;
    selectedButton.classList.add("main-nav__button_selected");

    selectedEditor.classList.remove("main__editor-container_selected");
    selectedEditor = editor;
    selectedEditor.classList.add("main__editor-container_selected");
}


/*                  Открытие/сокрытие выпадающего меню                  */

const dropdownButtons = document.getElementsByClassName("button_dropdown");
const dropdowns = document.getElementsByClassName("dropdown");
let number = undefined;

Array.from(dropdownButtons).forEach((button) => button.addEventListener("click", dropdownVisualise));

function dropdownVisualise(event) {
    number = buttonNumber(event.target);
    dropdowns[number].classList.toggle("dropdown_dropped");
    document.addEventListener("click", dropdownHide);
}
function dropdownHide(event) {
    if(!isDropdownButton(event.target)) {
        dropdowns[number].classList.remove("dropdown_dropped");
        document.removeEventListener("click", dropdownHide);
    }
}
function buttonNumber(target) {
    return target.getAttribute("data-dropdown-button-number");
}
function isDropdownButton(target) {
    return target.hasAttribute("data-dropdown-button-number");
}


/*                  Открытие/сокрытие консоли                  */

const consoleButton = document.getElementsByClassName("footer__button_console")[0];
const consoleCloseButton = document.getElementsByClassName("console__button_close")[0];
const console = document.getElementsByClassName("console")[0];
const verticalResizer = document.getElementsByClassName("main__vertical-resizer")[0];

consoleButton.addEventListener("click", consoleDisplay);
consoleCloseButton.addEventListener("click", consoleHide);

function consoleDisplay() {
    console.classList.toggle("console_display");
    verticalResizer.classList.toggle("main__vertical-resizer_console-close");
}
function consoleHide() {
    console.classList.remove("console_display");
    verticalResizer.classList.add("main__vertical-resizer_console-close");
}


/*                  Открытие/сокрытие shortcuts                  */

const shortcutsButton = document.getElementsByClassName("footer__button_shortcuts")[0];
const shortcuts = document.getElementsByClassName("key-commands")[0];

shortcutsButton.addEventListener("click", shortcutsDisplay);

function shortcutsDisplay() {
    overlayDisplay(shortcutsHide);
    shortcuts.classList.add("key-commands_display");
}
function shortcutsHide() {
    overlayHide(shortcutsHide);
    shortcuts.classList.remove("key-commands_display");
}


/*                  Открытие/сокрытие Footer export                  */

const exportButton = document.getElementsByClassName("footer__button_export")[0];
const footerExport = document.getElementsByClassName("footer__export")[0];

exportButton.addEventListener("click", exportVisualise);

function exportVisualise() {
    footerExport.classList.toggle("export_visible");
    document.addEventListener("click", exportHide);
}
function exportHide(event) {
    if(!isExport(event.target.className)) {
        footerExport.classList.remove("export_visible");
        document.removeEventListener("click", exportHide);
    }
}
function isExport(className) {
    return className.includes("export");
}


/*                  Открытие/сокрытие overlay                  */

const overlay = document.getElementsByClassName("overlay")[0];

function overlayDisplay(callback) {
    overlay.classList.add("overlay_display");
    overlay.addEventListener("click", callback);
}
function overlayHide(callback) {
    overlay.classList.remove("overlay_display");
    overlay.removeEventListener("click", callback);
}


/*                  Изменение размеров окна                  */

const resizer = document.getElementsByClassName("main__horizontal-resizer_result")[0]; //Изменить
const firstEditor = document.getElementsByClassName("main__editor-container")[0];
const secondEditor = document.getElementsByClassName("main__editor-container")[1];
let originalMousePosition, firstEditorWidth, secondEditorWidth = undefined;

resizer.addEventListener("mousedown", mouseStart);

function mouseStart(event) {
    document.body.focus();
    document.body.onselectstart = disableSelection;

    originalMousePosition = event.pageX;
    firstEditorWidth = width(firstEditor);
    secondEditorWidth = width(secondEditor);

    document.addEventListener("mousemove", mouseDrag);
    document.addEventListener("mouseup", mouseStop)
}
function width(element) {
    return parseFloat(document.defaultView.getComputedStyle(element).width);
}
function mouseDrag(event) {
    let dx = (event.pageX - originalMousePosition) || 0;
    firstEditor.style.width = (firstEditorWidth + dx) + "px";
    secondEditor.style.width = (secondEditorWidth - dx) + "px";
}
function mouseStop() {
    document.body.onselectstart = enableSelection;
    document.removeEventListener("mousemove", mouseDrag);
    document.removeEventListener("mouseup", mouseStop);
}
function disableSelection() {
    return false;
}
function enableSelection() {
    return true;
}