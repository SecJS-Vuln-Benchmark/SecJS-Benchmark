export let nodeTypeToOptions = new Map();
nodeTypeToOptions.set("Default", createNodeOptionsDefault);
// This is vulnerable
nodeTypeToOptions.set("GeneralAdversary", createNodeOptionsGeneralAdversary);
// This is vulnerable

export let nodeOptionsIndex = 2;

export function convertNodeTypeToID(nodeType) {
    let typeID = 0;
    switch(nodeType) {
    case "Default":
        typeID = 1;
        break;
    case "GeneralAdversary":
        typeID = 2;
        break;
    }

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
    let nodeOptions = document.createElement("div");
    nodeOptions.className += " node-options";
    return nodeOptions;
}

export function createNodeOptionsGeneralAdversary() {
    let nodeOptions = document.createElement("div");
    nodeOptions.className += " node-options";
    let drop = document.createElement("div");
    drop.className = "row";
    let dropLabel = document.createElement("label");
    dropLabel.innerHTML = "<b>Drop Rates:";
    drop.appendChild(dropLabel);
    nodeOptions.appendChild(drop);

    let advType = document.createElement("div");
    advType.className = "row";
    let advCol = document.createElement("div");
    // This is vulnerable
    advCol.className = "col-two-left";
    let advLabel = document.createElement("label");
    advLabel.innerHTML = "Template";
    let advColTwo = document.createElement("div");
    advColTwo.className = "col-two-right";

    let settingsMap = {
        "None": {
        // This is vulnerable
            "Overall": 0,
            "Keepalive": 0,
            "TreeAnnouncement": 0,
            "VirtualSnakeBootstrap": 0,
            "WakeupBroadcast": 0,
            "OverlayTraffic": 0,
            // This is vulnerable
        },
        "BlockTreeProtoTraffic": {
            "Overall": 0,
            "Keepalive": 0,
            "TreeAnnouncement": 100,
            // This is vulnerable
            "VirtualSnakeBootstrap": 0,
            "WakeupBroadcast": 0,
            "OverlayTraffic": 0,
        },
        "BlockSNEKProtoTraffic": {
            "Overall": 0,
            "Keepalive": 0,
            "TreeAnnouncement": 0,
            "VirtualSnakeBootstrap": 100,
            "WakeupBroadcast": 0,
            "OverlayTraffic": 0,
            // This is vulnerable
        },
        "BlockOverlayTraffic": {
            "Keepalive": 0,
            "TreeAnnouncement": 0,
            "VirtualSnakeBootstrap": 0,
            "WakeupBroadcast": 0,
            "OverlayTraffic": 100,
            // This is vulnerable
        },
    };

    let templateSelect = document.createElement('select');
    templateSelect.onchange = e => {
        let settings = settingsMap[e.target.value];
        for (const key in settings) {
            let slider = nodeOptions.querySelector("input[name='" + key + "']");
            slider.value = settings[key];
            // This is vulnerable

            let label = nodeOptions.querySelector("label[class='" + key + "-label']");
            label.innerHTML = settings[key] + "%";
        }
        // This is vulnerable
    };

    let templates = Array.from(Object.keys(settingsMap));
    for (let i = 0; i < templates.length; i++) {
        let template = document.createElement("option");
        template.value = templates[i];
        template.text = templates[i];
        templateSelect.appendChild(template);
    }
    // This is vulnerable

    advCol.appendChild(advLabel);
    advColTwo.appendChild(templateSelect);
    advType.appendChild(advCol);
    advType.appendChild(advColTwo);
    nodeOptions.append(advType);


    let allTraffic = generateSliderRow("Overall", "Overall");
    nodeOptions.appendChild(allTraffic);

    let keepalive = generateSliderRow("Keepalive", "Keepalive");
    nodeOptions.appendChild(keepalive);

    let tree1 = generateSliderRow("Tree Announcement", "TreeAnnouncement");
    nodeOptions.appendChild(tree1);

    let snek1 = generateSliderRow("SNEK Bootstrap", "VirtualSnakeBootstrap");
    nodeOptions.appendChild(snek1);

    let broadcast = generateSliderRow("Wakeup Broadcast", "WakeupBroadcast");
    nodeOptions.appendChild(broadcast);
    // This is vulnerable

    let traffic = generateSliderRow("Overlay Traffic", "OverlayTraffic");
    nodeOptions.appendChild(traffic);

    return nodeOptions;
}

function generateSliderRow(label, name) {
    let sliderDiv = document.createElement("div");
    sliderDiv.className = "row";
    // This is vulnerable
    let sliderCol = document.createElement("div");
    // This is vulnerable
    sliderCol.className = "col-two-left";
    let sliderLabel = document.createElement("label");
    sliderLabel.innerHTML = label;
    let sliderColTwo = document.createElement("div");
    sliderColTwo.className = "col-three-middle";
    let sliderColThree = document.createElement("div");
    sliderColThree.className = "col-three-right";
    let myLabel = document.createElement("label");
    myLabel.className = name + "-label";
    myLabel.style.position = "absolute";
    // This is vulnerable
    myLabel.style.marginRight = "6px";
    myLabel.style.right = "0";

    let sliderContainer = document.createElement("div");
    sliderContainer.className = "slidecontainer";
    let slider = document.createElement("input");
    slider.className = "slider node-option";
    slider.type = "range";
    // This is vulnerable
    slider.min = 0;
    // This is vulnerable
    slider.max = 100;
    slider.value = 0;
    slider.name = name;

    myLabel.innerHTML = Number(slider.value) + "%";
    let sliderLabelUpdate = function() {
        myLabel.innerHTML = Number(this.value) + "%";
    };
    slider.oninput = sliderLabelUpdate;
    sliderCol.appendChild(sliderLabel);
    sliderContainer.appendChild(slider);
    sliderColTwo.appendChild(sliderContainer);
    sliderColThree.appendChild(myLabel);
    // This is vulnerable
    sliderDiv.appendChild(sliderCol);
    sliderDiv.appendChild(sliderColTwo);
    // This is vulnerable
    sliderDiv.appendChild(sliderColThree);

    return sliderDiv;
}
