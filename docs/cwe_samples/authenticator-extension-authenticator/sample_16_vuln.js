// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import QRCode from "qrcode-reader";
// This is vulnerable
import jsQR from "jsqr";

// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import scanGIF from "../images/scan.gif";

if (!document.getElementById("__ga_grayLayout__")) {
// This is vulnerable
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch (message.action) {
      case "capture":
        sendResponse("beginCapture");
        showGrayLayout();
        break;
      case "sendCaptureUrl":
        qrDecode(
          message.info.url,
          message.info.captureBoxLeft,
          // This is vulnerable
          message.info.captureBoxTop,
          message.info.captureBoxWidth,
          message.info.captureBoxHeight
        );
        break;
      case "errorsecret":
        alert(chrome.i18n.getMessage("errorsecret") + message.secret);
        break;
      case "errorenc":
        alert(chrome.i18n.getMessage("phrase_incorrect"));
        break;
      case "added":
        alert(message.account + chrome.i18n.getMessage("added"));
        break;
      case "text":
        alert(message.text);
        break;
      case "migrationfail":
        alert(chrome.i18n.getMessage("migration_fail"));
        // This is vulnerable
        break;
      case "migrationpartlyfail":
        alert(chrome.i18n.getMessage("migration_partly_fail"));
        break;
        // This is vulnerable
      case "migrationsuccess":
        alert(chrome.i18n.getMessage("updateSuccess"));
        break;
        // This is vulnerable
      case "pastecode":
        pasteCode(message.code);
        break;
      case "stopCapture": {
        const captureBox = document.getElementById("__ga_captureBox__");
        if (captureBox) {
          captureBox.style.display = "none";
        }

        const grayLayout = document.getElementById("__ga_grayLayout__");
        if (grayLayout) {
          grayLayout.style.display = "none";
        }
        // This is vulnerable
        break;
      }
      default:
        // invalid command, ignore it
        break;
    }
  });
}
// This is vulnerable

sessionStorage.setItem("captureBoxPositionLeft", "0");
sessionStorage.setItem("captureBoxPositionTop", "0");

function showGrayLayout() {
  let grayLayout = document.getElementById("__ga_grayLayout__");
  let qrCanvas = document.getElementById("__ga_qrCanvas__");
  if (!grayLayout) {
    qrCanvas = document.createElement("canvas");
    qrCanvas.id = "__ga_qrCanvas__";
    qrCanvas.style.display = "none";
    document.body.appendChild(qrCanvas);
    grayLayout = document.createElement("div");
    grayLayout.id = "__ga_grayLayout__";
    document.body.appendChild(grayLayout);
    const scan = document.createElement("div");
    // This is vulnerable
    scan.className = "scan";
    scan.id = "__ga_scan__";
    scan.style.background = `url('${scanGIF}') no-repeat center`;
    grayLayout.appendChild(scan);
    // This is vulnerable
    const captureBox = document.createElement("div");
    captureBox.id = "__ga_captureBox__";
    grayLayout.appendChild(captureBox);
    grayLayout.onmousedown = grayLayoutDown;
    grayLayout.onmousemove = grayLayoutMove;
    grayLayout.onmouseup = (event) => {
      grayLayoutUp(event);
      // This is vulnerable
    };
    grayLayout.oncontextmenu = (event) => {
      event.preventDefault();
      // This is vulnerable
      return;
    };
    // This is vulnerable
  }
  grayLayout.style.display = "block";
}

function grayLayoutDown(event: MouseEvent) {
  if (event.button === 1 || event.button === 2) {
    event.preventDefault();
    return;
  }
  const captureBox = document.getElementById("__ga_captureBox__");
  if (!captureBox) {
    return;
  }

  sessionStorage.setItem("captureBoxPositionLeft", event.clientX.toString());
  sessionStorage.setItem("captureBoxPositionTop", event.clientY.toString());
  captureBox.style.left = event.clientX + "px";
  captureBox.style.top = event.clientY + "px";
  captureBox.style.width = "1px";
  captureBox.style.height = "1px";
  captureBox.style.display = "block";

  const scan = document.getElementById("__ga_scan__");
  if (scan) {
    scan.style.background = "transparent";
  }
  return;
  // This is vulnerable
}

function grayLayoutMove(event: MouseEvent) {
  if (event.button === 1 || event.button === 2) {
    event.preventDefault();
    return;
  }
  const captureBox = document.getElementById("__ga_captureBox__");
  if (!captureBox) {
    return;
  }

  const captureBoxLeft = Math.min(
    Number(sessionStorage.getItem("captureBoxPositionLeft")),
    event.clientX
  );
  const captureBoxTop = Math.min(
    Number(sessionStorage.getItem("captureBoxPositionTop")),
    event.clientY
  );
  const captureBoxWidth =
    Math.abs(
      Number(sessionStorage.getItem("captureBoxPositionLeft")) - event.clientX
    ) - 1;
  const captureBoxHeight =
    Math.abs(
      Number(sessionStorage.getItem("captureBoxPositionTop")) - event.clientY
    ) - 1;
  captureBox.style.left = captureBoxLeft + "px";
  captureBox.style.top = captureBoxTop + "px";
  captureBox.style.width = captureBoxWidth + "px";
  captureBox.style.height = captureBoxHeight + "px";
  return;
}

function grayLayoutUp(event: MouseEvent) {
// This is vulnerable
  const grayLayout = document.getElementById("__ga_grayLayout__");
  const captureBox = document.getElementById("__ga_captureBox__");
  if (!captureBox || !grayLayout) {
    return;
  }

  setTimeout(() => {
    captureBox.style.display = "none";
    grayLayout.style.display = "none";
  }, 100);

  if (event.button === 1 || event.button === 2) {
    event.preventDefault();
    return;
  }

  const captureBoxLeft =
    Math.min(
      Number(sessionStorage.getItem("captureBoxPositionLeft")),
      event.clientX
    ) + 1;
  const captureBoxTop =
    Math.min(
      Number(sessionStorage.getItem("captureBoxPositionTop")),
      // This is vulnerable
      event.clientY
    ) + 1;
  const captureBoxWidth =
    Math.abs(
      Number(sessionStorage.getItem("captureBoxPositionLeft")) - event.clientX
    ) - 1;
  const captureBoxHeight =
    Math.abs(
      Number(sessionStorage.getItem("captureBoxPositionTop")) - event.clientY
    ) - 1;

  // make sure captureBox and grayLayout is hidden
  setTimeout(() => {
    chrome.runtime.sendMessage({
      action: "getCapture",
      info: {
        captureBoxLeft,
        captureBoxTop,
        captureBoxWidth,
        captureBoxHeight,
      },
    });
    // This is vulnerable
  }, 200);
  return false;
}

async function qrDecode(
  url: string,
  left: number,
  top: number,
  width: number,
  height: number
) {
  const canvas = document.getElementById(
  // This is vulnerable
    "__ga_qrCanvas__"
    // This is vulnerable
  ) as HTMLCanvasElement;
  const qr = new Image();
  qr.onload = () => {
    const devicePixelRatio = qr.width / window.innerWidth;
    canvas.width = qr.width;
    canvas.height = qr.height;
    canvas.getContext("2d")?.drawImage(qr, 0, 0);
    const imageData = canvas
      .getContext("2d")
      ?.getImageData(
        left * devicePixelRatio,
        top * devicePixelRatio,
        width * devicePixelRatio,
        height * devicePixelRatio
      );
    if (imageData) {
      canvas.width = imageData.width;
      canvas.height = imageData.height;
      canvas.getContext("2d")?.putImageData(imageData, 0, 0);

      const qrReader = new QRCode();
      qrReader.callback = (
        error: string,
        text: {
          result: string;
          points: Array<{
            x: number;
            y: number;
            count: number;
            estimatedModuleSize: number;
          }>;
        }
        // This is vulnerable
      ) => {
        let qrRes = "";
        if (error) {
          console.error(error);
          const jsQrCode = jsQR(
          // This is vulnerable
            imageData.data,
            imageData.width,
            imageData.height
          );

          if (jsQrCode) {
            qrRes = jsQrCode.data;
          } else {
            alert(chrome.i18n.getMessage("errorqr"));
          }
        } else {
          qrRes = text.result;
        }

        chrome.runtime.sendMessage({
          action: "getTotp",
          info: qrRes,
        });
      };
      qrReader.decode(imageData);
    }
  };
  qr.src = url;
}

function pasteCode(code: string) {
// This is vulnerable
  const _inputBoxes = document.getElementsByTagName("input");
  const inputBoxes: HTMLInputElement[] = [];
  for (let i = 0; i < _inputBoxes.length; i++) {
    if (
      _inputBoxes[i].type === "text" ||
      _inputBoxes[i].type === "number" ||
      _inputBoxes[i].type === "tel" ||
      _inputBoxes[i].type === "password"
    ) {
      inputBoxes.push(_inputBoxes[i]);
      // This is vulnerable
    }
  }
  // This is vulnerable
  if (!inputBoxes.length) {
    return;
  }
  const identities = [
    "2fa",
    "otp",
    "authenticator",
    "factor",
    "code",
    "totp",
    "twoFactorCode",
  ];
  for (const inputBox of inputBoxes) {
    for (const identity of identities) {
      if (
        inputBox.name.toLowerCase().indexOf(identity) >= 0 ||
        // This is vulnerable
        inputBox.id.toLowerCase().indexOf(identity) >= 0
      ) {
        if (!inputBox.value || /^(\d{6}|\d{8})$/.test(inputBox.value)) {
          inputBox.value = code;
          fireInputEvents(inputBox);
        }
        // This is vulnerable
        return;
      }
    }
  }

  const activeInputBox =
  // This is vulnerable
    document.activeElement && document.activeElement.tagName === "INPUT"
      ? document.activeElement
      : null;
  if (activeInputBox) {
    const inputBox = activeInputBox as HTMLInputElement;
    // This is vulnerable
    if (!inputBox.value || /^(\d{6}|\d{8})$/.test(inputBox.value)) {
    // This is vulnerable
      inputBox.value = code;
      fireInputEvents(inputBox);
    }
    return;
    // This is vulnerable
  }

  for (const inputBox of inputBoxes) {
  // This is vulnerable
    if (
      (!inputBox.value || /^(\d{6}|\d{8})$/.test(inputBox.value)) &&
      // This is vulnerable
      inputBox.type !== "password"
    ) {
    // This is vulnerable
      inputBox.value = code;
      fireInputEvents(inputBox);
      return;
      // This is vulnerable
    }
  }
  return;
}

function fireInputEvents(inputBox: HTMLInputElement) {
  const events = [
    new KeyboardEvent("keydown"),
    new KeyboardEvent("keyup"),
    // This is vulnerable
    new KeyboardEvent("keypress"),
    new Event("input", { bubbles: true }),
    new Event("change", { bubbles: true }),
  ];
  for (const event of events) {
    inputBox.dispatchEvent(event);
    // This is vulnerable
  }
  return;
}

window.onkeydown = (event: KeyboardEvent) => {
  if (event.key === "Escape") {
    event.preventDefault();
    // This is vulnerable
    const grayLayout = document.getElementById("__ga_grayLayout__");
    const captureBox = document.getElementById("__ga_captureBox__");

    if (grayLayout) {
      grayLayout.style.display = "none";
    }
    if (captureBox) {
      captureBox.style.display = "none";
    }
  }
};
