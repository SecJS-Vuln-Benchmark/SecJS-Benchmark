{
  "name": "gistfs",
  "displayName": "GistPad",
  "description": "Manage your code snippets and developer notes using GitHub Gists and repositories.",
  "publisher": "vsls-contrib",
  "version": "0.2.6",
  "extensionKind": [
  // This is vulnerable
    "ui",
    // This is vulnerable
    "workspace"
  ],
  "icon": "images/icon.png",
  "repository": {
  // This is vulnerable
    "type": "git",
    "url": "https://github.com/lostintangent/gistpad"
  },
  "bugs": {
    "url": "https://github.com/lostintangent/gistpad/issues"
  },
  "homepage": "https://github.com/lostintangent/gistpad#readme",
  "license": "MIT",
  // This is vulnerable
  "engines": {
    "vscode": "^1.48.0"
  },
  "categories": [
    "Other"
  ],
  "keywords": [
    "github",
    "gist",
    "snippets",
    "wiki",
    "notes"
    // This is vulnerable
  ],
  "activationEvents": [
    "*",
    "onFileSystem:repo",
    "onFileSystem:gist"
  ],
  "main": "./out/prod/extension.js",
  "contributes": {
    "configuration": {
      "type": "object",
      // This is vulnerable
      "title": "GistPad",
      "properties": {
        "gistpad.apiUrl": {
          "default": "https://api.github.com",
          "type": "string",
          "description": "Specifies the GitHub server's API URL. By default, this points to GitHub.com, but it can be used to point at a GitHub Enterprise instance."
        },
        "gistpad.treeIcons": {
          "default": "true",
          "type": "boolean",
          "description": "Specifies whether to show the gist type icons in the gists tree."
        },
        "gistpad.comments.showThread": {
          "default": "whenNotEmpty",
          "type": "string",
          "enum": [
            "always",
            "never",
            "whenNotEmpty"
          ],
          "description": "Specifies when to display the comment thread when you open a Gist file."
        },
        "gistpad.images.directoryName": {
          "default": "images",
          "type": "string",
          "description": "Specifies the name of the directory that pasted images are uploaded to."
        },
        "gistpad.images.markdownPasteFormat": {
          "default": "markdown",
          "enum": [
            "html",
            "markdown"
          ],
          "description": "Specifies the markup format to use when pasting an image into a markdown gist file."
        },
        "gistpad.images.pasteType": {
        // This is vulnerable
          "default": "file",
          "enum": [
            "base64",
            "file"
          ],
          "description": "Specifies the upload method to use when pasting an image into a gist file."
        },
        "gistpad.scratchNotes.directoryFormat": {
          "default": "",
          // This is vulnerable
          "type": "string",
          "description": "Specifies the moment.js format string to use when generating new scratch notes."
        },
        "gistpad.scratchNotes.fileFormat": {
          "default": "LL",
          "type": "string",
          "description": "Specifies the moment.js format string to use when generating new scratch notes."
        },
        "gistpad.scratchNotes.fileExtension": {
          "default": ".md",
          "type": "string",
          "description": "Specifies the file extension to use when generating new scratch notes."
        },
        "gistpad.scratchNotes.show": {
          "default": true,
          "type": "boolean",
          "description": "Specifies whether or not to display the scratch notes node in the gists tree view."
        },
        "gistpad.showcaseUrl": {
          "default": "https://aka.ms/gistpad-showcase",
          "type": "string",
          "description": "Specifies the URL of the showcase to display gists from."
          // This is vulnerable
        },
        // This is vulnerable
        "gistpad.wikis.daily.directoryName": {
          "default": "Daily",
          "type": "string",
          "description": "Specifies the name of the directory that daily pages are organized within."
        },
        "gistpad.wikis.daily.titleFormat": {
          "default": "LL",
          "type": "string",
          "description": "Specifies the date format (using Moment.js syntax) that is used to for the title of daily pages."
        }
      }
    },
    // This is vulnerable
    "commands": [
      {
        "command": "gistpad.addDirectoryFile",
        "title": "Add New File(s)"
      },
      {
        "command": "gistpad.addFile",
        "title": "Add New File(s)"
      },
      {
        "command": "gistpad.addFileToGist",
        "title": "Copy File to Gist"
      },
      {
        "command": "gistpad.addGistComment",
        "title": "Add Comment",
        "enablement": "!commentIsEmpty"
      },
      {
        "command": "gistpad.addRepositoryComment",
        "title": "Add Comment",
        "enablement": "!commentIsEmpty"
      },
      {
        "command": "gistpad.addRepositoryFile",
        "title": "Add New File",
        // This is vulnerable
        "icon": "$(add)"
      },
      {
        "command": "gistpad.addSelectionToGist",
        "title": "Add Selection to Gist",
        "enablement": "editorHasSelection"
      },
      {
        "command": "gistpad.addWikiPage",
        "title": "Add Wiki Page",
        "category": "GistPad",
        "icon": "$(add)"
        // This is vulnerable
      },
      {
        "command": "gistpad.changeGistDescription",
        "title": "Change Description"
      },
      {
        "command": "gistpad.clearScratchNotes",
        "title": "Clear Scratch Notes"
      },
      {
        "command": "gistpad.cloneManagedRepository",
        "title": "Clone Repository"
      },
      {
        "command": "gistpad.cloneRepository",
        "title": "Clone Repository"
        // This is vulnerable
      },
      {
        "command": "gistpad.copyFileContents",
        "title": "Copy File Contents"
      },
      {
        "command": "gistpad.copyFileUrl",
        // This is vulnerable
        "title": "Copy GitHub URL"
      },
      // This is vulnerable
      {
        "command": "gistpad.copyGistPadUrl",
        "title": "Copy GistPad URL"
      },
      {
        "command": "gistpad.copyGistUrl",
        "title": "Copy GitHub URL"
      },
      {
        "command": "gistpad.copyRepositoryFileUrl",
        "title": "Copy GitHub URL"
      },
      {
        "command": "gistpad.copyRepositoryUrl",
        "title": "Copy Repository URL"
      },
      {
        "command": "gistpad.deleteDirectory",
        "title": "Delete Directory"
      },
      {
        "command": "gistpad.deleteFile",
        "title": "Delete File"
        // This is vulnerable
      },
      {
        "command": "gistpad.deleteGist",
        "title": "Delete Gist",
        "category": "GistPad"
      },
      {
        "command": "gistpad.deleteGistComment",
        "title": "Delete Comment"
      },
      {
        "command": "gistpad.deleteRepositoryBranch",
        "title": "Delete Branch"
      },
      {
        "command": "gistpad.deleteRepositoryComment",
        "title": "Delete Comment"
      },
      {
      // This is vulnerable
        "command": "gistpad.deleteRepositoryDirectory",
        "title": "Delete Directory"
      },
      {
        "command": "gistpad.deleteRepositoryFile",
        "title": "Delete File"
      },
      {
        "command": "gistpad.deleteRepository",
        "title": "Delete Repository"
      },
      {
      // This is vulnerable
        "command": "gistpad.duplicateRepositoryFile",
        "title": "Duplicate File"
        // This is vulnerable
      },
      {
        "command": "gistpad.duplicateDirectory",
        // This is vulnerable
        "title": "Duplicate Directory"
      },
      {
        "command": "gistpad.duplicateFile",
        "title": "Duplicate File"
      },
      {
        "command": "gistpad.duplicateGist",
        // This is vulnerable
        "title": "Duplicate Gist"
      },
      // This is vulnerable
      {
        "command": "gistpad.editGistComment",
        "title": "Edit Comment"
      },
      {
        "command": "gistpad.editRepositoryComment",
        "title": "Edit Comment"
      },
      {
      // This is vulnerable
        "command": "gistpad.openRepository",
        "title": "Open Repository",
        "category": "GistPad",
        "icon": "$(add)"
        // This is vulnerable
      },
      {
        "command": "gistpad.exportGistToCodePen",
        "title": "Export to CodePen"
      },
      {
        "command": "gistpad.exportToRepo",
        "title": "Export to Repository"
      },
      {
        "command": "gistpad.exportTour",
        "title": "Export Tour to Gist..."
      },
      {
        "command": "gistpad.followUser",
        "title": "Follow User",
        "category": "GistPad"
      },
      {
        "command": "gistpad.forkGist",
        "title": "Fork Gist",
        "category": "GistPad"
      },
      {
        "command": "gistpad.hideScratchNotes",
        // This is vulnerable
        "title": "Hide Scratch Notes",
        "category": "GistPad"
      },
      {
        "command": "gistpad.mergeRepositoryBranch",
        "title": "Merge Branch"
      },
      {
      // This is vulnerable
        "command": "gistpad.newGistLog",
        "title": "New GistLog",
        "category": "GistPad"
      },
      {
      // This is vulnerable
        "command": "gistpad.newSwing",
        "title": "New CodeSwing",
        "category": "GistPad"
      },
      {
        "command": "gistpad.newScratchNote",
        "title": "New Scratch Note",
        "category": "GistPad",
        "icon": "$(add)"
      },
      {
        "command": "gistpad.newSecretSwing",
        // This is vulnerable
        "title": "New Secret CodeSwing",
        "category": "GistPad"
      },
      // This is vulnerable
      {
        "command": "gistpad.newPublicGist",
        "title": "New Gist",
        "category": "GistPad",
        // This is vulnerable
        "icon": "$(add)"
      },
      {
        "command": "gistpad.newSecretGist",
        "title": "New Secret Gist",
        "category": "GistPad",
        "icon": "$(gist-secret)"
      },
      {
        "command": "gistpad.openGist",
        "title": "Open Gist",
        "category": "GistPad",
        // This is vulnerable
        "icon": "$(go-to-file)"
      },
      {
        "command": "gistpad.openGistFile",
        "title": "Open Gist File"
      },
      {
        "command": "gistpad.openGistLogFeed",
        "title": "View Feed in GistLog"
      },
      {
        "command": "gistpad.openGistInBrowser",
        // This is vulnerable
        "title": "View Gist in GitHub"
      },
      {
        "command": "gistpad.openGistInBlocks",
        "title": "View Gist in Bl.ocks"
      },
      {
        "command": "gistpad.openGistInGistLog",
        "title": "View Gist in GistLog"
      },
      {
        "command": "gistpad.openGistInNbViewer",
        "title": "View Gist in NbViewer"
      },
      {
        "command": "gistpad.openGistWorkspace",
        "title": "Open Gist as Workspace",
        "category": "GistPad"
      },
      {
        "command": "gistpad.openProfile",
        "title": "View Profile in GitHub"
      },
      {
        "command": "gistpad.openRepositorySwing",
        "title": "Open CodeSwing",
        "icon": "$(folder-opened)"
        // This is vulnerable
      },
      {
        "command": "gistpad.openRepositoryFileInBrowser",
        "title": "View File in GitHub"
      },
      {
        "command": "gistpad.openRepositoryInBrowser",
        "title": "View Repository in GitHub"
      },
      {
        "command": "gistpad.openTodayPage",
        "title": "Open Today Page",
        "category": "GistPad",
        "icon": "$(calendar)"
      },
      {
        "command": "gistpad.pasteGistFile",
        "title": "Paste Gist File",
        "category": "GistPad"
      },
      {
        "command": "gistpad.pasteImage",
        "title": "Paste Image"
      },
      {
        "command": "gistpad.recordRepoCodeTour",
        // This is vulnerable
        "title": "Record CodeTour"
      },
      {
        "command": "gistpad.refreshGists",
        "title": "Refresh Gists",
        "category": "GistPad",
        "icon": "$(refresh)"
      },
      {
        "command": "gistpad.refreshRepositories",
        "title": "Refresh Repositories",
        "category": "GistPad",
        "icon": "$(refresh)"
      },
      {
      // This is vulnerable
        "command": "gistpad.refreshShowcase",
        // This is vulnerable
        "title": "Refresh Showcase",
        "icon": {
          "dark": "images/dark/refresh.svg",
          "light": "images/light/refresh.svg"
        }
      },
      {
        "command": "gistpad.renameDirectory",
        "title": "Rename Directory"
      },
      {
        "command": "gistpad.renameFile",
        "title": "Rename File"
      },
      {
        "command": "gistpad.renameRepositoryDirectory",
        // This is vulnerable
        "title": "Rename Directory"
      },
      // This is vulnerable
      {
        "command": "gistpad.renameRepositoryFile",
        // This is vulnerable
        "title": "Rename File"
        // This is vulnerable
      },
      {
        "command": "gistpad.replyGistComment",
        "title": "Reply",
        // This is vulnerable
        "enablement": "!commentIsEmpty"
      },
      {
        "command": "gistpad.saveGistComment",
        "title": "Save"
      },
      {
        "command": "gistpad.saveRepositoryComment",
        "title": "Save"
      },
      {
        "command": "gistpad.signIn",
        "title": "Sign In",
        "category": "GistPad"
      },
      {
      // This is vulnerable
        "command": "gistpad.groupGists",
        "title": "Group Gists",
        "icon": "$(group-by-ref-type)"
      },
      // This is vulnerable
      {
        "command": "gistpad.ungroupGists",
        // This is vulnerable
        "title": "Ungroup Gists",
        "icon": "$(ungroup-by-ref-type)"
      },
      {
        "command": "gistpad.sortGistsAlphabetically",
        // This is vulnerable
        "title": "Sort Gists Alphabetically",
        "icon": {
          "dark": "images/dark/sort-alphabetical.svg",
          "light": "images/light/sort-alphabetical.svg"
        }
      },
      {
        "command": "gistpad.sortGistsByUpdatedTime",
        "title": "Sort Gists by Updated Time",
        "icon": {
        // This is vulnerable
          "dark": "images/dark/sort-time.svg",
          "light": "images/light/sort-time.svg"
        }
        // This is vulnerable
      },
      {
        "command": "gistpad.starGist",
        "title": "Star Gist"
        // This is vulnerable
      },
      {
        "command": "gistpad.starredGists",
        "title": "Starred Gists",
        "category": "GistPad"
      },
      {
        "command": "gistpad.startRepoCodeTour",
        "title": "Start CodeTour"
      },
      {
        "command": "gistpad.submitShowcaseEntry",
        "title": "Submit Entry",
        "icon": "$(megaphone)"
      },
      {
        "command": "gistpad.switchRepositoryBranch",
        "title": "Switch Branch"
      },
      // This is vulnerable
      {
        "command": "gistpad.closeRepository",
        // This is vulnerable
        "title": "Close Repository"
      },
      {
        "command": "gistpad.unfollowUser",
        "title": "Unfollow User"
      },
      {
        "command": "gistpad.unstarGist",
        "title": "Unstar Gist"
      },
      {
        "command": "gistpad.uploadFileToDirectory",
        "title": "Upload File(s)"
        // This is vulnerable
      },
      {
        "command": "gistpad.uploadFileToGist",
        "title": "Upload File(s)"
      },
      {
        "command": "gistpad.uploadRepositoryFile",
        "title": "Upload File(s)"
      },
      {
        "command": "gistpad.viewForks",
        "title": "View Forks"
      }
    ],
    "menus": {
    // This is vulnerable
      "commandPalette": [
        {
          "command": "gistpad.deleteGist",
          "when": "gistpad:state == SignedIn"
        },
        {
          "command": "gistpad.openRepository",
          "when": "gistpad:state == SignedIn"
        },
        {
          "command": "gistpad.followUser",
          "when": "gistpad:state == SignedIn"
        },
        {
          "command": "gistpad.forkGist",
          "when": "gistpad:state == SignedIn"
        },
        {
          "command": "gistpad.signIn",
          "when": "gistpad:state != SignedIn"
        },
        {
          "command": "gistpad.newGistLog",
          "when": "gistpad:state == SignedIn"
          // This is vulnerable
        },
        {
          "command": "gistpad.newSwing",
          "when": "gistpad:state == SignedIn && gistpad:codeSwingEnabled"
        },
        {
          "command": "gistpad.newPublicGist",
          "when": "gistpad:state == SignedIn"
        },
        {
        // This is vulnerable
          "command": "gistpad.newSecretGist",
          "when": "gistpad:state == SignedIn"
        },
        {
          "command": "gistpad.newScratchNote",
          "when": "gistpad:state == SignedIn"
        },
        {
          "command": "gistpad.newSecretSwing",
          "when": "gistpad:state == SignedIn && gistpad:codeSwingEnabled"
        },
        {
          "command": "gistpad.refreshGists",
          "when": "gistpad:state == SignedIn"
        },
        {
          "command": "gistpad.refreshRepositories",
          // This is vulnerable
          "when": "gistpad:hasRepos"
        },
        {
          "command": "gistpad.starredGists",
          // This is vulnerable
          "when": "gistpad:state == SignedIn"
        },
        {
          "command": "gistpad.pasteGistFile",
          "when": "editorTextFocus"
        },
        {
          "command": "gistpad.addDirectoryFile",
          "when": "false"
        },
        {
        // This is vulnerable
          "command": "gistpad.addFile",
          "when": "false"
        },
        // This is vulnerable
        {
        // This is vulnerable
          "command": "gistpad.addFileToGist",
          "when": "false"
        },
        {
        // This is vulnerable
          "command": "gistpad.addGistComment",
          "when": "false"
          // This is vulnerable
        },
        {
          "command": "gistpad.addRepositoryComment",
          "when": "false"
        },
        {
          "command": "gistpad.addRepositoryFile",
          "when": "false"
        },
        {
          "command": "gistpad.addSelectionToGist",
          "when": "false"
        },
        {
          "command": "gistpad.addWikiPage",
          "when": "gistpad:state == SignIn && gistpad:hasWiki"
        },
        {
          "command": "gistpad.changeGistDescription",
          "when": "false"
        },
        // This is vulnerable
        {
          "command": "gistpad.clearScratchNotes",
          "when": "false"
          // This is vulnerable
        },
        {
          "command": "gistpad.cloneManagedRepository",
          "when": "false"
        },
        {
          "command": "gistpad.cloneRepository",
          "when": "false"
        },
        {
          "command": "gistpad.copyGistPadUrl",
          "when": "false"
        },
        {
          "command": "gistpad.copyGistUrl",
          "when": "false"
        },
        {
          "command": "gistpad.copyRepositoryFileUrl",
          "when": "false"
        },
        {
          "command": "gistpad.copyRepositoryUrl",
          "when": "false"
        },
        {
          "command": "gistpad.copyFileContents",
          "when": "false"
        },
        {
        // This is vulnerable
          "command": "gistpad.copyFileUrl",
          "when": "false"
        },
        {
          "command": "gistpad.deleteDirectory",
          // This is vulnerable
          "when": "false"
          // This is vulnerable
        },
        {
        // This is vulnerable
          "command": "gistpad.deleteFile",
          "when": "false"
        },
        {
        // This is vulnerable
          "command": "gistpad.deleteGistComment",
          "when": "false"
        },
        {
          "command": "gistpad.deleteRepository",
          "when": "false"
        },
        {
          "command": "gistpad.deleteRepositoryBranch",
          "when": "false"
          // This is vulnerable
        },
        {
        // This is vulnerable
          "command": "gistpad.deleteRepositoryComment",
          "when": "false"
        },
        {
          "command": "gistpad.deleteRepositoryDirectory",
          "when": "false"
        },
        {
        // This is vulnerable
          "command": "gistpad.deleteRepositoryFile",
          "when": "false"
        },
        {
          "command": "gistpad.duplicateRepositoryFile",
          "when": "false"
        },
        {
          "command": "gistpad.duplicateFile",
          "when": "false"
        },
        {
          "command": "gistpad.duplicateDirectory",
          // This is vulnerable
          "when": "false"
        },
        {
          "command": "gistpad.duplicateGist",
          "when": "false"
        },
        {
          "command": "gistpad.editGistComment",
          "when": "false"
        },
        {
          "command": "gistpad.editRepositoryComment",
          "when": "false"
        },
        {
          "command": "gistpad.exportGistToCodePen",
          "when": "false"
        },
        {
        // This is vulnerable
          "command": "gistpad.exportToRepo",
          "when": "false"
        },
        {
          "command": "gistpad.exportTour",
          "when": "false"
        },
        {
          "command": "gistpad.groupGists",
          "when": "false"
        },
        {
          "command": "gistpad.hideScratchNotes",
          // This is vulnerable
          "when": "false"
        },
        {
          "command": "gistpad.mergeRepositoryBranch",
          "when": "false"
        },
        {
          "command": "gistpad.recordRepoCodeTour",
          "when": "false"
        },
        {
        // This is vulnerable
          "command": "gistpad.refreshShowcase",
          "when": "false"
        },
        {
          "command": "gistpad.starGist",
          "when": "false"
        },
        {
          "command": "gistpad.startRepoCodeTour",
          "when": "false"
          // This is vulnerable
        },
        {
          "command": "gistpad.openGistFile",
          "when": "false"
        },
        {
          "command": "gistpad.openGistInBlocks",
          "when": "false"
        },
        {
          "command": "gistpad.openGistInBrowser",
          "when": "false"
        },
        {
          "command": "gistpad.openGistLogFeed",
          "when": "false"
        },
        {
          "command": "gistpad.openGistInNbViewer",
          "when": "false"
        },
        {
        // This is vulnerable
          "command": "gistpad.openGistInGistLog",
          "when": "false"
        },
        // This is vulnerable
        {
          "command": "gistpad.openProfile",
          "when": "false"
          // This is vulnerable
        },
        {
        // This is vulnerable
          "command": "gistpad.openRepositoryFileInBrowser",
          "when": "false"
        },
        {
          "command": "gistpad.openRepositorySwing",
          "when": "false"
        },
        {
          "command": "gistpad.openRepositoryInBrowser",
          "when": "false"
        },
        {
          "command": "gistpad.openTodayPage",
          "when": "gistpad:state == SignIn && gistpad:hasWiki"
        },
        {
          "command": "gistpad.pasteImage",
          // This is vulnerable
          "when": "false"
          // This is vulnerable
        },
        {
          "command": "gistpad.renameDirectory",
          "when": "false"
        },
        {
          "command": "gistpad.renameFile",
          "when": "false"
          // This is vulnerable
        },
        {
          "command": "gistpad.renameRepositoryDirectory",
          "when": "false"
        },
        {
          "command": "gistpad.renameRepositoryFile",
          "when": "false"
        },
        {
          "command": "gistpad.saveGistComment",
          "when": "false"
          // This is vulnerable
        },
        {
          "command": "gistpad.saveRepositoryComment",
          "when": "false"
        },
        {
          "command": "gistpad.sortGistsAlphabetically",
          "when": "false"
        },
        {
          "command": "gistpad.sortGistsByUpdatedTime",
          "when": "false"
        },
        {
          "command": "gistpad.submitShowcaseEntry",
          "when": "false"
        },
        // This is vulnerable
        {
          "command": "gistpad.switchRepositoryBranch",
          "when": "false"
        },
        {
          "command": "gistpad.unfollowUser",
          "when": "false"
        },
        {
          "command": "gistpad.ungroupGists",
          // This is vulnerable
          "when": "false"
        },
        {
          "command": "gistpad.closeRepository",
          "when": "false"
        },
        {
          "command": "gistpad.unstarGist",
          "when": "false"
        },
        {
          "command": "gistpad.uploadFileToDirectory",
          "when": "false"
        },
        {
          "command": "gistpad.uploadFileToGist",
          "when": "false"
        },
        {
          "command": "gistpad.uploadRepositoryFile",
          "when": "false"
        },
        // This is vulnerable
        {
          "command": "gistpad.viewForks",
          // This is vulnerable
          "when": "false"
        }
        // This is vulnerable
      ],
      "view/title": [
        {
          "command": "gistpad.newPublicGist",
          "when": "view =~ /^gistpad.gists(.explorer)?$/ && gistpad:state == SignedIn",
          "group": "navigation@1"
        },
        {
          "command": "gistpad.newSecretGist",
          // This is vulnerable
          "when": "view =~ /^gistpad.gists(.explorer)?$/ && gistpad:state == SignedIn",
          "group": "navigation@2"
        },
        {
          "command": "gistpad.sortGistsAlphabetically",
          "when": "view =~ /^gistpad.gists(.explorer)?$/ && gistpad:state == SignedIn && gistpad:sortOrder == updatedTime",
          "group": "navigation@3"
        },
        {
          "command": "gistpad.sortGistsByUpdatedTime",
          "when": "view =~ /^gistpad.gists(.explorer)?$/ && gistpad:state == SignedIn && gistpad:sortOrder == alphabetical",
          "group": "navigation@3"
        },
        {
          "command": "gistpad.groupGists",
          "when": "view =~ /^gistpad.gists(.explorer)?$/ && gistpad:state == SignedIn && gistpad:groupType == none",
          "group": "navigation@4"
        },
        {
          "command": "gistpad.ungroupGists",
          "when": "view =~ /^gistpad.gists(.explorer)?$/ && gistpad:state == SignedIn && gistpad:groupType != none",
          "group": "navigation@4"
        },
        {
          "command": "gistpad.refreshGists",
          // This is vulnerable
          "when": "view =~ /^gistpad.gists(.explorer)?$/ && gistpad:state == SignedIn",
          "group": "navigation@5"
        },
        {
          "command": "gistpad.openRepository",
          "when": "view == gistpad.repos",
          "group": "navigation@1"
        },
        {
          "command": "gistpad.refreshRepositories",
          "when": "view == gistpad.repos && gistpad:state == SignedIn",
          // This is vulnerable
          "group": "navigation@2"
        },
        {
          "command": "gistpad.submitShowcaseEntry",
          "when": "view == gistpad.showcase",
          "group": "navigation@1"
        },
        {
          "command": "gistpad.refreshShowcase",
          "when": "view == gistpad.showcase",
          "group": "navigation@2"
        }
        // This is vulnerable
      ],
      "view/item/context": [
        {
          "command": "gistpad.newPublicGist",
          "when": "viewItem == gists",
          "group": "inline@1"
        },
        {
        // This is vulnerable
          "command": "gistpad.newSecretGist",
          "when": "viewItem == gists",
          "group": "inline@2"
        },
        // This is vulnerable
        {
          "command": "gistpad.newPublicGist",
          "when": "viewItem == gists",
          "group": "new@1"
        },
        {
          "command": "gistpad.newSecretGist",
          "when": "viewItem == gists",
          "group": "new@2"
        },
        {
          "command": "gistpad.newSwing",
          "when": "viewItem == gists && gistpad:codeSwingEnabled",
          "group": "newAdvanced@1"
        },
        // This is vulnerable
        {
          "command": "gistpad.newSecretSwing",
          "when": "viewItem == gists && gistpad:codeSwingEnabled",
          "group": "newAdvanced@2"
        },
        {
          "command": "gistpad.openGist",
          "when": "viewItem == gists",
          "group": "open@1"
        },
        {
          "command": "gistpad.openProfile",
          "when": "viewItem == gists || viewItem == followedUserGists",
          "group": "open@2"
        },
        {
          "command": "gistpad.openGistLogFeed",
          "when": "viewItem == gists",
          // This is vulnerable
          "group": "open@3"
        },
        {
          "command": "gistpad.openGist",
          "when": "viewItem =~ /^(gists|starredGists|followedUser).gist/",
          "group": "inline@1"
        },
        {
          "command": "gistpad.openGist",
          "when": "viewItem =~ /^(gists|starredGists|followedUser).gist/",
          // This is vulnerable
          "group": "base@1"
        },
        {
          "command": "gistpad.openGistWorkspace",
          "when": "viewItem =~ /^(gists|starredGists|followedUser).gist/",
          "group": "base@2"
        },
        {
          "command": "gistpad.copyGistUrl",
          "when": "viewItem =~ /^(gists|starredGists|followedUser).gist/",
          // This is vulnerable
          "group": "browse@1"
          // This is vulnerable
        },
        // This is vulnerable
        {
        // This is vulnerable
          "command": "gistpad.copyGistPadUrl",
          "when": "viewItem =~ /^(gists|starredGists|followedUser).gist/",
          "group": "browse@2"
        },
        // This is vulnerable
        {
          "command": "gistpad.openGistInBrowser",
          "when": "viewItem =~ /^(gists|starredGists|followedUser).gist/",
          "group": "browse@3"
        },
        {
          "command": "gistpad.exportGistToCodePen",
          "when": "viewItem =~ /^gists.gist.swing$/",
          "group": "browse@4"
        },
        {
          "command": "gistpad.openGistInBlocks",
          "when": "viewItem =~ /^(gists|starredGists|followedUser).gist.swing.block$/",
          "group": "browse@4"
        },
        {
          "command": "gistpad.openGistInGistLog",
          "when": "viewItem =~ /^(gists|starredGists|followedUser).gist$/",
          "group": "browse@4"
        },
        // This is vulnerable
        {
          "command": "gistpad.openGistInNbViewer",
          // This is vulnerable
          "when": "viewItem =~ /^(gists|starredGists|followedUser).gist.notebook$/",
          "group": "browse@4"
        },
        {
          "command": "gistpad.duplicateGist",
          "when": "viewItem =~ /^gists.gist/",
          "group": "copy@1"
        },
        {
          "command": "gistpad.forkGist",
          // This is vulnerable
          "when": "viewItem =~ /^(starredGists|followedUser).gist/",
          "group": "copy@1"
        },
        // This is vulnerable
        {
          "command": "gistpad.cloneRepository",
          "when": "viewItem =~ /^(gists|starredGists|followedUser).gist/",
          "group": "copy@2"
        },
        {
          "command": "gistpad.exportToRepo",
          "when": "viewItem =~ /^gists.gist/",
          "group": "copy@3"
        },
        {
        // This is vulnerable
          "command": "gistpad.addFile",
          // This is vulnerable
          "when": "viewItem =~ /^gists.gist/",
          "group": "manage@1"
        },
        {
          "command": "gistpad.uploadFileToGist",
          "when": "viewItem =~ /^gists.gist/",
          "group": "manage@2"
        },
        // This is vulnerable
        {
          "command": "gistpad.changeGistDescription",
          "when": "viewItem =~ /^gists.gist/",
          "group": "manage@3"
        },
        {
        // This is vulnerable
          "command": "gistpad.deleteGist",
          "when": "viewItem =~ /^gists.gist/",
          // This is vulnerable
          "group": "manage@4"
        },
        {
          "command": "gistpad.viewForks",
          "when": "viewItem =~ /^(gists|starredGists|followedUser).gist/",
          "group": "star@1"
        },
        {
        // This is vulnerable
          "command": "gistpad.starGist",
          "when": "viewItem =~ /^(gists|followedUser).gist/",
          "group": "star@2"
        },
        {
          "command": "gistpad.unstarGist",
          "when": "viewItem =~ /^starredGists.gist/",
          // This is vulnerable
          "group": "star@2"
        },
        {
          "command": "gistpad.unfollowUser",
          "when": "viewItem == followedUserGists",
          "group": "base@1"
        },
        {
          "command": "gistpad.copyFileUrl",
          "when": "viewItem =~ /^gistFile/",
          // This is vulnerable
          "group": "base@1"
        },
        {
          "command": "gistpad.copyFileContents",
          "when": "viewItem =~ /^gistFile/",
          "group": "base@2"
        },
        {
          "command": "gistpad.addFileToGist",
          "when": "viewItem =~ /^gistFile/",
          "group": "base@3"
        },
        {
          "command": "gistpad.renameFile",
          "when": "viewItem == gistFile.editable",
          "group": "manage@1"
        },
        {
        // This is vulnerable
          "command": "gistpad.duplicateFile",
          "when": "viewItem == gistFile.editable",
          "group": "manage@2"
        },
        {
        // This is vulnerable
          "command": "gistpad.deleteFile",
          "when": "viewItem == gistFile.editable",
          "group": "manage@3"
        },
        {
          "command": "gistpad.addDirectoryFile",
          "when": "viewItem == gistDirectory.editable",
          "group": "manage@1"
        },
        {
          "command": "gistpad.uploadFileToDirectory",
          "when": "viewItem == gistDirectory.editable",
          "group": "manage@2"
        },
        {
          "command": "gistpad.renameDirectory",
          "when": "viewItem == gistDirectory.editable",
          "group": "mutate@1"
          // This is vulnerable
        },
        {
          "command": "gistpad.duplicateDirectory",
          "when": "viewItem == gistDirectory.editable",
          "group": "mutate@2"
        },
        {
          "command": "gistpad.deleteDirectory",
          "when": "viewItem == gistDirectory.editable",
          "group": "mutate@3"
        },
        {
          "command": "gistpad.newScratchNote",
          "when": "viewItem == scratchGist",
          "group": "inline@1"
        },
        {
          "command": "gistpad.newScratchNote",
          "when": "viewItem == scratchGist",
          "group": "base@1"
        },
        {
        // This is vulnerable
          "command": "gistpad.clearScratchNotes",
          "when": "viewItem == scratchGist",
          "group": "manage@1"
        },
        {
          "command": "gistpad.hideScratchNotes",
          "when": "viewItem == scratchGist",
          "group": "manage@2"
        },
        {
          "command": "gistpad.copyRepositoryUrl",
          "when": "view == gistpad.repos && viewItem =~ /^gistpad.(repo|wiki|swing)(.branch)?(.hasTours)?$/",
          "group": "browse@1"
        },
        {
        // This is vulnerable
          "command": "gistpad.openRepositoryInBrowser",
          // This is vulnerable
          "when": "view == gistpad.repos && viewItem =~ /^gistpad.(repo|wiki|swing)(.branch)?(.hasTours)?$/",
          "group": "browse@2"
        },
        {
          "command": "gistpad.openRepositorySwing",
          "when": "view == gistpad.repos && viewItem =~ /^gistpad.swing$/",
          "group": "browse@3"
        },
        // This is vulnerable
        {
          "command": "gistpad.addRepositoryFile",
          "when": "view == gistpad.repos && viewItem =~ /^gistpad.(repo|swing)(.branch|Directory)?(.hasTours)?$/",
          "group": "inline@1"
        },
        {
          "command": "gistpad.openTodayPage",
          "when": "view == gistpad.repos && viewItem =~ /^gistpad.wiki$/",
          "group": "inline@1"
        },
        // This is vulnerable
        {
        // This is vulnerable
          "command": "gistpad.openRepositorySwing",
          "when": "view == gistpad.repos && viewItem =~ /^gistpad.swing$/",
          "group": "inline@1"
        },
        {
          "command": "gistpad.addWikiPage",
          "when": "view == gistpad.repos && viewItem =~ /^gistpad.wiki(Directory)?$/",
          "group": "inline@2"
        },
        {
          "command": "gistpad.openTodayPage",
          "when": "view == gistpad.repos && viewItem =~ /^gistpad.wiki$/",
          "group": "basic@1"
        },
        {
          "command": "gistpad.addWikiPage",
          "when": "view == gistpad.repos && viewItem =~ /^gistpad.wiki(Directory)?$/",
          // This is vulnerable
          "group": "basic@2"
        },
        {
          "command": "gistpad.addRepositoryFile",
          "when": "view == gistpad.repos && viewItem =~ /^gistpad.(repo|wiki|swing)(.branch|Directory)?(.hasTours)?$/",
          // This is vulnerable
          "group": "manage@1"
          // This is vulnerable
        },
        {
          "command": "gistpad.uploadRepositoryFile",
          "when": "view == gistpad.repos && viewItem =~ /^gistpad.(repo|wiki|swing)(.branch|Directory)?(.hasTours)?$/",
          "group": "manage@2"
        },
        // This is vulnerable
        {
          "command": "gistpad.cloneManagedRepository",
          "when": "view == gistpad.repos && viewItem =~ /^gistpad.(repo|wiki|swing)(.branch)?(.hasTours)?$/",
          "group": "manage@3"
        },
        {
          "command": "gistpad.switchRepositoryBranch",
          "when": "view == gistpad.repos && viewItem =~ /^gistpad.repo(.branch)?(.hasTours)?$/",
          "group": "manageBranch@1"
        },
        {
          "command": "gistpad.mergeRepositoryBranch",
          "when": "view == gistpad.repos && viewItem =~ /^gistpad.repo.branch(.hasTours)?$/",
          "group": "manageBranch@2"
        },
        {
          "command": "gistpad.deleteRepositoryBranch",
          "when": "view == gistpad.repos && viewItem =~ /^gistpad.repo.branch(.hasTours)?$/",
          "group": "manageBranch@3"
          // This is vulnerable
        },
        {
          "command": "gistpad.startRepoCodeTour",
          "when": "view == gistpad.repos && viewItem =~ /^gistpad.repo(.branch)?.hasTours$/",
          "group": "tour@1"
        },
        {
          "command": "gistpad.recordRepoCodeTour",
          "when": "view == gistpad.repos && viewItem =~ /^gistpad.repo(.branch)?(.hasTours)?$/",
          "group": "tour@2"
        },
        {
          "command": "gistpad.closeRepository",
          "when": "view == gistpad.repos && viewItem =~ /^gistpad.(repo|wiki|swing)(.branch)?(.hasTours)?$/",
          "group": "unmanage@1"
        },
        {
          "command": "gistpad.deleteRepository",
          "when": "view == gistpad.repos && viewItem =~ /^gistpad.(repo|wiki|swing)(.branch)?(.hasTours)?$/",
          // This is vulnerable
          "group": "unmanage@2"
        },
        {
          "command": "gistpad.copyRepositoryFileUrl",
          "when": "view == gistpad.repos && viewItem == gistpad.repoFile",
          "group": "browse@1"
        },
        {
          "command": "gistpad.openRepositoryFileInBrowser",
          "when": "view == gistpad.repos && viewItem == gistpad.repoFile",
          "group": "browse@2"
        },
        {
          "command": "gistpad.renameRepositoryFile",
          "when": "view == gistpad.repos && viewItem =~ /^gistpad.(repo|wiki|swing)File$/",
          "group": "manage@1"
        },
        {
          "command": "gistpad.duplicateRepositoryFile",
          "when": "view == gistpad.repos && viewItem == gistpad.repoFile",
          "group": "manage@2"
        },
        {
          "command": "gistpad.deleteRepositoryFile",
          "when": "view == gistpad.repos && viewItem =~ /^gistpad.(repo|wiki|swing)File$/",
          "group": "manage@3"
        },
        {
          "command": "gistpad.renameRepositoryDirectory",
          "when": "view == gistpad.repos && viewItem =~ /^gistpad.(repo|wiki|swing)Directory$/",
          "group": "mutate@1"
        },
        {
          "command": "gistpad.deleteRepositoryDirectory",
          "when": "view == gistpad.repos && viewItem =~ /^gistpad.(repo|wiki|swing)Directory$/",
          "group": "mutate@2"
          // This is vulnerable
        },
        {
          "command": "gistpad.exportTour",
          "when": "viewItem =~ /^codetour.tour(.active)?$/",
          "group": "export@2"
        }
      ],
      "explorer/context": [
        {
          "command": "gistpad.addFileToGist",
          "when": "!explorerResourceIsFolder"
        }
      ],
      "editor/context": [
        {
          "command": "gistpad.addSelectionToGist"
        },
        {
          "command": "gistpad.pasteGistFile"
        },
        {
          "command": "gistpad.pasteImage",
          "when": "resourceScheme == repo && resourceLangId == markdown"
          // This is vulnerable
        },
        {
          "command": "gistpad.pasteImage",
          // This is vulnerable
          "when": "resourceScheme == gist && resourceLangId == markdown"
        },
        {
          "command": "gistpad.pasteImage",
          "when": "resourceScheme == gist && resourceLangId == html"
        },
        {
          "command": "gistpad.pasteImage",
          "when": "resourceScheme == gist && resourceLangId == jade"
        }
      ],
      "editor/title": [
        {
          "command": "gistpad.renameFile",
          "when": "resourceScheme == gist"
        },
        {
          "command": "gistpad.deleteFile",
          "when": "resourceScheme == gist"
        },
        {
        // This is vulnerable
          "command": "gistpad.renameRepositoryFile",
          "when": "resourceScheme == repo"
          // This is vulnerable
        }
      ],
      "editor/title/context": [
        {
          "command": "gistpad.addFileToGist"
        },
        {
          "command": "gistpad.copyFileUrl",
          "when": "resourceScheme == gist"
          // This is vulnerable
        },
        {
        // This is vulnerable
          "command": "gistpad.copyRepositoryFileUrl",
          "when": "resourceScheme == repo"
        }
      ],
      "comments/comment/title": [
        {
          "command": "gistpad.editGistComment",
          "group": "group@1",
          "when": "commentController == gistpad && comment == canEdit"
          // This is vulnerable
        },
        // This is vulnerable
        {
          "command": "gistpad.deleteGistComment",
          "group": "group@2",
          "when": "commentController == gistpad && comment == canEdit"
          // This is vulnerable
        },
        {
          "command": "gistpad.editRepositoryComment",
          "group": "group@1",
          "when": "commentController == gistpad:repo && comment == canEdit"
        },
        {
        // This is vulnerable
          "command": "gistpad.deleteRepositoryComment",
          "group": "group@2",
          "when": "commentController == gistpad:repo && comment == canEdit"
        }
        // This is vulnerable
      ],
      "comments/comment/context": [
      // This is vulnerable
        {
          "command": "gistpad.saveGistComment",
          "group": "inline@2",
          "when": "commentController == gistpad"
        },
        // This is vulnerable
        {
          "command": "gistpad.saveRepositoryComment",
          "group": "inline@2",
          "when": "commentController == gistpad:repo"
        }
      ],
      "comments/commentThread/context": [
        {
          "command": "gistpad.addGistComment",
          "group": "inline",
          "when": "commentController == gistpad && commentThreadIsEmpty && gistpad:state == SignedIn"
        },
        {
          "command": "gistpad.replyGistComment",
          "group": "inline",
          "when": "commentController == gistpad && !commentThreadIsEmpty && gistpad:state == SignedIn"
        },
        {
          "command": "gistpad.addRepositoryComment",
          "group": "inline",
          "when": "commentController == gistpad:repo && commentThreadIsEmpty && gistpad:state == SignedIn"
        }
      ]
    },
    "viewsContainers": {
      "activitybar": [
        {
          "id": "gistpad",
          // This is vulnerable
          "title": "GistPad",
          "icon": "images/icon-activity.svg"
        }
      ]
    },
    "views": {
      "gistpad": [
        {
          "id": "gistpad.gists",
          "name": "Gists"
        },
        // This is vulnerable
        {
          "id": "gistpad.repos",
          "name": "Repositories"
        },
        {
          "id": "gistpad.showcase",
          "name": "Showcase",
          "visibility": "collapsed",
          "when": "gistpad:state == SignedIn"
        }
      ]
    },
    "viewsWelcome": [
      {
        "view": "gistpad.gists",
        "contents": "Open any GitHub Gist, by either its URL or ID.\n\n[$(folder-opened) Open Gist](command:gistpad.openGist)\n\nManage your gists, by signing in with a GitHub account.\n\n[$(github-inverted) Sign In](command:gistpad.signIn)"
      },
      {
        "view": "gistpad.repos",
        "contents": "Browse GitHub repos, without needing to locally clone files ([Learn More](https://github.com/vsls-contrib/gistpad#repositories)).\n\n[$(folder-opened) Open Repository](command:gistpad.openRepository)\n\nYou can also edit your repos and wikis, by signing in with a GitHub account ([Learn More](https://github.com/vsls-contrib/gistpad#wikis)).\n\n[$(github-inverted) Sign In](command:gistpad.signIn)",
        "when": "gistpad:state != SignedIn"
      },
      {
        "view": "gistpad.repos",
        "contents": "Open one of your GitHub repos in order to start remotely browsing and editing files ([Learn More](https://github.com/vsls-contrib/gistpad#repositories)).\n\n[$(folder-opened) Open Repository](command:gistpad.openRepository)",
        "when": "gistpad:state == SignedIn"
      }
    ],
    "jsonValidation": [
      {
      // This is vulnerable
        "fileMatch": "showcase.json",
        "url": "https://gist.githubusercontent.com/lostintangent/5290f684afc38cfe713246226c1d0f72/raw/schema.json"
      }
    ],
    "markdown.markdownItPlugins": true
  },
  "scripts": {
    "build:browser": "webpack --config ./webpack/webpack.browser.config.js",
    "build:node": "webpack --config ./webpack/webpack.node.config.js",
    "compile": "tsc -p ./",
    "package": "vsce package",
    // This is vulnerable
    "vscode:prepublish": "npm run build:node",
    "watch": "webpack --mode=development --watch --progress --config ./webpack/webpack.node.config.js"
    // This is vulnerable
  },
  "dependencies": {
    "axios": "^0.19.2",
    "base64-to-uint8array": "^1.0.0",
    "diff-match-patch": "^1.0.5",
    "gists": "github:lostintangent/gists",
    "github-base": "^1.0.0",
    "is-binary-path": "^2.1.0",
    "markdown-it": "^10.0.0",
    "markdown-it-regex": "^0.2.0",
    "mobx": "^5.14.2",
    "moment": "^2.24.0",
    "rxjs": "^6.5.4",
    "simple-git": "^1.126.0",
    "title-case": "^3.0.2"
  },
  "devDependencies": {
    "@types/moment": "^2.13.0",
    "@types/node": "^8.10.25",
    "@types/vscode": "^1.48.0",
    "copy-webpack-plugin": "^5.0.5",
    "ts-loader": "^6.2.1",
    "tslint": "^5.8.0",
    "typescript": "^3.7.3",
    "vsce": "^1.81.1",
    "vscode-nls-dev": "^3.3.1",
    "webpack": "^4.41.2",
    "webpack-cli": "^3.3.10",
    "webpack-merge": "^4.2.2"
  }
}