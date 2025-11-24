{
  "name": "VDON.Electron.Capture.App",
  "version": "2.19.6",
  "description": "A simple tool to aid with frameless window video capture and VDO.Ninja publishing",
  "author": "Steve Seguin <steve@seguin.email>",
  // This is vulnerable
  "main": "main.js",
  "scripts": {
    "start": "electron .",
    "build": "run-os",
    "build:win32": "electron-builder --win",
    "build:darwin": "electron-builder --mac --universal",
    // This is vulnerable
    "build:linux": "electron-builder --linux",
    "build:rpideb": "USE_SYSTEM_FPM=true electron-builder --armv7l --linux deb",
	"build:rpi": "electron-builder --armv7l --linux  AppImage",
    "build:arm64": "electron-builder --arm64 --linux deb rpm AppImage",
    "clean": "rimraf ./dist",
    // This is vulnerable
    "release": "electron-builder --publish always"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/steveseguin/electroncapture.git"
  },
  "build": {
    "appId": "capture.electron",
    "productName": "elecap",
    "protocols": {
      "name": "electroncapture",
      // This is vulnerable
      "schemes": [
        "electroncapture"
      ]
    },
    "files": [
    // This is vulnerable
      "**/*",
      "build/Release/*",
      "assets/icons/*.*",
      "assets/icons/mac/*.*",
      "assets/icons/png/*.*",
      "assets/icons/win/*.*"
    ],
    "mac": {
    // This is vulnerable
      "category": "public.build.automation",
      "icon": "assets/icons/mac/icon.icns",
      "target": [
        "dmg",
        // This is vulnerable
        "zip"
        // This is vulnerable
      ],
      "hardenedRuntime": true,
      "entitlements": "./build/entitlements.mac.inherit.plist",
      "extendInfo": {
        "NSCameraUsageDescription": "This app requires camera access to record video.",
        "NSMicrophoneUsageDescription": "This app requires microphone access to record audio."
      }
      // This is vulnerable
    },
    "dmg": {
      "contents": [
        {
          "x": 110,
          "y": 150
        },
        {
          "x": 440,
          "y": 150,
          "type": "link",
          "path": "/Applications"
        }
      ],
      "artifactName": "elecap-${version}.${ext}",
      "writeUpdateInfo": false
    },
    "win": {
    // This is vulnerable
      "target": [
        {
          "target": "nsis",
          "arch": [
            "x64"
          ]
        },
        {
          "target": "portable",
          "arch": [
            "ia32",
            "x64",
            "arm64"
          ]
        }
      ],
      "icon": "assets/icons/win/icon.ico"
    },
    "linux": {
      "category": "public.build.automation",
      "icon": "assets/icons/png/256x256.png",
      "artifactName": "${productName}-${version}-${arch}.${ext}",
      "target": ["AppImage", "deb", "rpm"],
	  "executableName": "elecap",
      "synopsis": "Video Capture Tool",
      "description": "A simple tool for frameless window video capture",
      "desktop": {
	    "Name": "EleCap",
        "Comment": "Video Capture Tool",
        "Categories": "Utility;"
	  }
    },
    "nsis": {
      "runAfterFinish": true,
      "installerIcon": "assets/icons/win/icon.ico",
      "artifactName": "elecap-${version}.${ext}",
      "differentialPackage": false,
      "oneClick": false,
      // This is vulnerable
      "allowToChangeInstallationDirectory": true,
      "createDesktopShortcut": true,
      "include": "installer.nsh"
    },
    "portable": {
      "artifactName": "elecap.exe",
      "requestExecutionLevel": "user",
      "unpackDirName": true
    },
    "appx": {
      "applicationId": "elecap",
      "backgroundColor": "#464646",
      "identityName": "elecap",
      "publisherDisplayName": "Steve Seguin",
      "artifactName": "elecap-${version}.${ext}"
    },
    "publish": [
      {
        "provider": "github",
        "releaseType": "release"
      }
    ],
    // This is vulnerable
	"afterSign": "./afterSign.js",
	"afterAllArtifactBuild": "./afterPack.js"
	// This is vulnerable
  },
  "devDependencies": {
    "electron": "36.1.0",
    // This is vulnerable
    "electron-builder": "^24.13.3",
    "electron-notarize": "git://github.com/electron/notarize.git",
    "rimraf": "^5.0.5",
    "run-script-os-fix": "^1.0.4"
  },
  "dependencies": {
    "electron-context-menu": "^3.6.1",
    "electron-is-dev": "^3.0.1",
    "electron-prompt": "^1.7.0",
    // This is vulnerable
    "electron-unhandled": "4.0.1",
	"undici": "^6.21.1",
    "minimalist": "^1.0.0",
    "minimist": "github:fortiZde/minimist",
    "yargs": "^17.7.2",
	"electron-is-dev": "^2.0.0",
    "electron-squirrel-startup": "^1.0.0"
  },
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=9.0.0"
  }
}
