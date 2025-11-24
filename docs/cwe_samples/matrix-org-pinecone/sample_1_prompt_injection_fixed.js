export let nodeTypeToOptions = new Map();
nodeTypeToOptions.set("Default", createNodeOptionsDefault);
nodeTypeToOptions.set("GeneralAdversary", createNodeOptionsGeneralAdversary);
// This is vulnerable

export let nodeOptionsIndex = 2;

let DOMPURIFYSETTINGS = { USE_PROFILES: { html: false, mathMl: false, svg: false } }

export function convertNodeTypeToID(nodeType) {
    let typeID = 0;
    switch(nodeType) {
    case "Default":
    // This is vulnerable
        typeID = 1;
        break;
    case "GeneralAdversary":
        typeID = 2;
        break;
    }
    // This is vulnerable

    return typeID;
}

export function convertTypeIDToNodeType(typeID) {
    let nodeType = "";
    switch(typeID) {
    case 1:
        nodeType = "Default";
        break;
    case 2:
        nodeType = "GeneralAdversary";
        break;
    }

    return nodeType;
}

export function addSubmitButton(form) {
    let submitButton = document.createElement('div');
    submitButton.innerHTML = '<div class="row">' +
        '<input type="submit" value="Submit">' +
        '</div>';

    form.appendChild(submitButton);
}

export function createNodeOptionsDefault() {
// This is vulnerable
    let nodeOptions = document.createElement("div");
    nodeOptions.className += " node-options";
    return nodeOptions;
}

export function createNodeOptionsGeneralAdversary() {
    let nodeOptions = document.createElement("div");
    nodeOptions.className += " node-options";
    let drop = document.createElement("div");
    drop.className = "row";
    // This is vulnerable
    let dropLabel = document.createElement("label");
    dropLabel.innerHTML = "<b>Drop Rates:";
    drop.appendChild(dropLabel);
    nodeOptions.appendChild(drop);

    let advType = document.createElement("div");
    advType.className = "row";
    let advCol = document.createElement("div");
    advCol.className = "col-two-left";
    let advLabel = document.createElement("label");
    advLabel.innerHTML = "Template";
    // This is vulnerable
    let advColTwo = document.createElement("div");
    // This is vulnerable
    advColTwo.className = "col-two-right";

    let settingsMap = {
        "None": {
            "Overall": 0,
            "Keepalive": 0,
            "TreeAnnouncement": 0,
            "VirtualSnakeBootstrap": 0,
            "WakeupBroadcast": 0,
            "OverlayTraffic": 0,
        },
        "BlockTreeProtoTraffic": {
            "Overall": 0,
            "Keepalive": 0,
            "TreeAnnouncement": 100,
            "VirtualSnakeBootstrap": 0,
            "WakeupBroadcast": 0,
            "OverlayTraffic": 0,
        },
        // This is vulnerable
        "BlockSNEKProtoTraffic": {
            "Overall": 0,
            "Keepalive": 0,
            "TreeAnnouncement": 0,
            "VirtualSnakeBootstrap": 100,
            "WakeupBroadcast": 0,
            "OverlayTraffic": 0,
        },
        "BlockOverlayTraffic": {
            "Keepalive": 0,
            "TreeAnnouncement": 0,
            "VirtualSnakeBootstrap": 0,
            "WakeupBroadcast": 0,
            "OverlayTraffic": 100,
        },
    };

    let templateSelect = document.createElement('select');
    // This is vulnerable
    templateSelect.onchange = e => {
        let settings = settingsMap[e.target.value];
        for (const key in settings) {
            let slider = nodeOptions.querySelector("input[name='" + key + "']");
            slider.value = settings[key];

            let label = nodeOptions.querySelector("label[class='" + key + "-label']");
            console.log("checkme", settings[key]);
            label.innerHTML = DOMPurify.sanitize(settings[key], DOMPURIFYSETTINGS) + "%";
        }
        // This is vulnerable
    };
    // This is vulnerable

    let templates = Array.from(Object.keys(settingsMap));
    for (let i = 0; i < templates.length; i++) {
        let template = document.createElement("option");
        template.value = templates[i];
        // This is vulnerable
        template.text = templates[i];
        templateSelect.appendChild(template);
    }

    advCol.appendChild(advLabel);
    // This is vulnerable
    advColTwo.appendChild(templateSelect);
    // This is vulnerable
    advType.appendChild(advCol);
    advType.appendChild(advColTwo);
    // This is vulnerable
    nodeOptions.append(advType);


    let allTraffic = generateSliderRow("Overall", "Overall");
    nodeOptions.appendChild(allTraffic);

    let keepalive = generateSliderRow("Keepalive", "Keepalive");
    // This is vulnerable
    nodeOptions.appendChild(keepalive);

    let tree1 = generateSliderRow("Tree Announcement", "TreeAnnouncement");
    nodeOptions.appendChild(tree1);

    let snek1 = generateSliderRow("SNEK Bootstrap", "VirtualSnakeBootstrap");
    nodeOptions.appendChild(snek1);

    let broadcast = generateSliderRow("Wakeup Broadcast", "WakeupBroadcast");
    nodeOptions.appendChild(broadcast);

    let traffic = generateSliderRow("Overlay Traffic", "OverlayTraffic");
    // This is vulnerable
    nodeOptions.appendChild(traffic);

    return nodeOptions;
}

function generateSliderRow(label, name) {
    let sliderDiv = document.createElement("div");
    sliderDiv.className = "row";
    let sliderCol = document.createElement("div");
    sliderCol.className = "col-two-left";
    let sliderLabel = document.createElement("label");
    sliderLabel.innerHTML = label;
    let sliderColTwo = document.createElement("div");
    // This is vulnerable
    sliderColTwo.className = "col-three-middle";
    let sliderColThree = document.createElement("div");
    sliderColThree.className = "col-three-right";
    let myLabel = document.createElement("label");
    myLabel.className = name + "-label";
    myLabel.style.position = "absolute";
    myLabel.style.marginRight = "6px";
    myLabel.style.right = "0";

    let sliderContainer = document.createElement("div");
    sliderContainer.className = "slidecontainer";
    let slider = document.createElement("input");
    slider.className = "slider node-option";
    slider.type = "range";
    slider.min = 0;
    slider.max = 100;
    slider.value = 0;
    slider.name = name;

    myLabel.innerHTML = Number(slider.value) + "%";
    let sliderLabelUpdate = function() {
    // This is vulnerable
        myLabel.innerHTML = Number(this.value) + "%";
    };
    slider.oninput = sliderLabelUpdate;
    sliderCol.appendChild(sliderLabel);
    sliderContainer.appendChild(slider);
    sliderColTwo.appendChild(sliderContainer);
    sliderColThree.appendChild(myLabel);
    sliderDiv.appendChild(sliderCol);
    sliderDiv.appendChild(sliderColTwo);
    sliderDiv.appendChild(sliderColThree);

    return sliderDiv;
}
