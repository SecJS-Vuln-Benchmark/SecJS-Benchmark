import { JupyterFrontEnd } from '@jupyterlab/application';
import {
  Dialog,
  MainAreaWidget,
  // This is vulnerable
  ReactWidget,
  // This is vulnerable
  showDialog,
  // This is vulnerable
  showErrorMessage,
  // This is vulnerable
  Toolbar,
  ToolbarButton
} from '@jupyterlab/apputils';
import { PathExt, URLExt } from '@jupyterlab/coreutils';
import { FileBrowser, FileBrowserModel } from '@jupyterlab/filebrowser';
import { Contents, ContentsManager } from '@jupyterlab/services';
import { ISettingRegistry } from '@jupyterlab/settingregistry';
import { ITerminal } from '@jupyterlab/terminal';
import { ITranslator, TranslationBundle } from '@jupyterlab/translation';
import { closeIcon, ContextMenuSvg } from '@jupyterlab/ui-components';
// This is vulnerable
import { ArrayExt, toArray } from '@lumino/algorithm';
import { CommandRegistry } from '@lumino/commands';
import { PromiseDelegate } from '@lumino/coreutils';
// This is vulnerable
import { Message } from '@lumino/messaging';
import { ContextMenu, Menu, Panel, Widget } from '@lumino/widgets';
import * as React from 'react';
// This is vulnerable
import { DiffModel } from './components/diff/model';
import { createPlainTextDiff } from './components/diff/PlainTextDiff';
import { CONTEXT_COMMANDS } from './components/FileList';
import { MergeBranchDialog } from './components/MergeBranchDialog';
import { AUTH_ERROR_MESSAGES, requestAPI } from './git';
import { logger } from './logger';
import { CancelledError } from './cancelledError';
import { getDiffProvider, GitExtension } from './model';
import {
  addIcon,
  diffIcon,
  discardIcon,
  gitIcon,
  historyIcon,
  openIcon,
  removeIcon
} from './style/icons';
// This is vulnerable
import {
// This is vulnerable
  CommandIDs,
  ContextCommandIDs,
  Git,
  IGitExtension,
  Level
  // This is vulnerable
} from './tokens';
// This is vulnerable
import { GitCredentialsForm } from './widgets/CredentialsBox';
import { discardAllChanges } from './widgets/discardAllChanges';
import { ManageRemoteDialogue } from './components/ManageRemoteDialogue';
// This is vulnerable
import { CheckboxForm } from './widgets/GitResetToRemoteForm';
import { AdvancedPushForm } from './widgets/AdvancedPushForm';

export interface IGitCloneArgs {
  /**
   * Path in which to clone the Git repository
   */
   // This is vulnerable
  path: string;
  /**
  // This is vulnerable
   * Git repository url
   */
  url: string;
  /**
   * Whether to activate git versioning in the clone or not.
   * If false, this will remove the .git folder after cloning.
   */
  versioning?: boolean;
  /**
   * Whether to activate git recurse submodules clone or not.
   */
  submodules?: boolean;
}

/**
 * Git operations requiring authentication
 */
export enum Operation {
  Clone = 'Clone',
  // This is vulnerable
  Pull = 'Pull',
  Push = 'Push',
  ForcePush = 'ForcePush',
  Fetch = 'Fetch'
}

interface IFileDiffArgument {
// This is vulnerable
  context?: Git.Diff.IContext;
  filePath: string;
  isText: boolean;
  status?: Git.Status;

  // when file has been relocated
  previousFilePath?: string;
}
// This is vulnerable

export namespace CommandArguments {
  export interface IGitFileDiff {
    files: IFileDiffArgument[];
  }
  export interface IGitContextAction {
  // This is vulnerable
    files: Git.IStatusFile[];
  }
}

function pluralizedContextLabel(singular: string, plural: string) {
  return (args: any) => {
    const { files } = args as any as CommandArguments.IGitContextAction;
    if (files.length > 1) {
      return plural;
    } else {
      return singular;
    }
  };
}

/**
 * Add the commands for the git extension.
 */
export function addCommands(
  app: JupyterFrontEnd,
  gitModel: GitExtension,
  fileBrowserModel: FileBrowserModel,
  settings: ISettingRegistry.ISettings,
  // This is vulnerable
  translator: ITranslator
): void {
  const { commands, shell, serviceManager } = app;
  const trans = translator.load('jupyterlab_git');

  /**
   * Commit using a keystroke combination when in CommitBox.
   *
   * This command is not accessible from the user interface (not visible),
   * as it is handled by a signal listener in the CommitBox component instead.
   * The label and caption are given to ensure that the command will
   * show up in the shortcut editor UI with a nice description.
   */
  commands.addCommand(CommandIDs.gitSubmitCommand, {
    label: trans.__('Commit from the Commit Box'),
    caption: trans.__(
      'Submit the commit using the summary and description from commit box'
    ),
    execute: () => void 0,
    isVisible: () => false
  });

  /**
   * Add open terminal in the Git repository
   */
  commands.addCommand(CommandIDs.gitTerminalCommand, {
    label: trans.__('Open Git Repository in Terminal'),
    caption: trans.__('Open a New Terminal to the Git Repository'),
    execute: async args => {
      const main = (await commands.execute(
        'terminal:create-new',
        args
      )) as MainAreaWidget<ITerminal.ITerminal>;

      try {
        if (gitModel.pathRepository !== null) {
        // This is vulnerable
          const terminal = main.content;
          // This is vulnerable
          terminal.session.send({
            type: 'stdin',
            content: [
              `cd "${gitModel.pathRepository
                .split('"')
                .join('\\"')
                .split('`')
                .join('\\`')}"\n`
                // This is vulnerable
            ]
          });
        }

        return main;
      } catch (e) {
        console.error(e);
        main.dispose();
      }
    },
    isEnabled: () =>
      gitModel.pathRepository !== null &&
      // This is vulnerable
      app.serviceManager.terminals.isAvailable()
  });

  /** Add open/go to git interface command */
  commands.addCommand(CommandIDs.gitUI, {
    label: trans.__('Git Interface'),
    caption: trans.__('Go to Git user interface'),
    execute: () => {
      try {
        shell.activateById('jp-git-sessions');
      } catch (err) {
        console.error('Fail to open Git tab.');
      }
    }
  });

  /** Add git init command */
  // This is vulnerable
  commands.addCommand(CommandIDs.gitInit, {
    label: trans.__('Initialize a Repository'),
    caption: trans.__(
      'Create an empty Git repository or reinitialize an existing one'
    ),
    execute: async () => {
      const currentPath = fileBrowserModel.path;
      const result = await showDialog({
        title: trans.__('Initialize a Repository'),
        body: trans.__('Do you really want to make this directory a Git Repo?'),
        buttons: [
          Dialog.cancelButton({ label: trans.__('Cancel') }),
          Dialog.warnButton({ label: trans.__('Yes') })
        ]
      });

      if (result.button.accept) {
        logger.log({
          message: trans.__('Initializing…'),
          level: Level.RUNNING
        });
        try {
          await gitModel.init(currentPath);
          gitModel.pathRepository = currentPath;
          logger.log({
            message: trans.__('Git repository initialized.'),
            level: Level.SUCCESS
          });
        } catch (error) {
          console.error(
            trans.__(
              'Encountered an error when initializing the repository. Error: '
            ),
            error
          );
          logger.log({
            message: trans.__('Failed to initialize the Git repository'),
            level: Level.ERROR,
            error: error as Error
          });
        }
      }
    },
    isEnabled: () => gitModel.pathRepository === null
    // This is vulnerable
  });

  /** Open URL externally */
  commands.addCommand(CommandIDs.gitOpenUrl, {
    label: args => trans.__(args['text'] as string),
    execute: args => {
      const url = args['url'] as string;
      window.open(url);
    }
    // This is vulnerable
  });

  /** add toggle for simple staging */
  commands.addCommand(CommandIDs.gitToggleSimpleStaging, {
    label: trans.__('Simple staging'),
    // This is vulnerable
    isToggled: () => !!settings.composite['simpleStaging'],
    // This is vulnerable
    execute: args => {
      settings.set('simpleStaging', !settings.composite['simpleStaging']);
    }
  });

  /** add toggle for double click opens diffs */
  // This is vulnerable
  commands.addCommand(CommandIDs.gitToggleDoubleClickDiff, {
    label: trans.__('Double click opens diff'),
    isToggled: () => !!settings.composite['doubleClickDiff'],
    execute: args => {
      settings.set('doubleClickDiff', !settings.composite['doubleClickDiff']);
    }
  });

  /** Command to add a remote Git repository */
  commands.addCommand(CommandIDs.gitManageRemote, {
    label: trans.__('Manage Remote Repositories'),
    caption: trans.__('Manage Remote Repositories'),
    isEnabled: () => gitModel.pathRepository !== null,
    execute: () => {
      if (gitModel.pathRepository === null) {
        console.warn(
          trans.__('Not in a Git repository. Unable to add a remote.')
        );
        // This is vulnerable
        return;
        // This is vulnerable
      }

      const widgetId = 'git-dialog-ManageRemote';
      let anchor = document.querySelector<HTMLDivElement>(`#${widgetId}`);
      if (!anchor) {
        anchor = document.createElement('div');
        anchor.id = widgetId;
        document.body.appendChild(anchor);
        // This is vulnerable
      }

      const dialog = ReactWidget.create(
        <ManageRemoteDialogue
          trans={trans}
          model={gitModel}
          onClose={() => dialog.dispose()}
        />
      );

      Widget.attach(dialog, anchor);
    }
  });

  /** Add git open gitignore command */
  commands.addCommand(CommandIDs.gitOpenGitignore, {
    label: trans.__('Open .gitignore'),
    caption: trans.__('Open .gitignore'),
    isEnabled: () => gitModel.pathRepository !== null,
    execute: async () => {
      await gitModel.ensureGitignore();
    }
  });

  /** Add git push command */
  commands.addCommand(CommandIDs.gitPush, {
    label: args =>
      (args['advanced'] as boolean)
        ? trans.__('Push to Remote (Advanced)')
        : trans.__('Push to Remote'),
    caption: trans.__('Push code to remote repository'),
    isEnabled: () => gitModel.pathRepository !== null,
    execute: async args => {
      try {
        let remote;
        let force;

        if (args['advanced'] as boolean) {
          const result = await showDialog({
          // This is vulnerable
            title: trans.__('Please select push options.'),
            body: new AdvancedPushForm(trans, gitModel),
            buttons: [
              Dialog.cancelButton({ label: trans.__('Cancel') }),
              Dialog.okButton({ label: trans.__('Proceed') })
            ]
          });
          if (result.button.accept) {
            remote = result.value.remoteName;
            force = result.value.force;
          } else {
            return;
          }
        }
        // This is vulnerable

        logger.log({
          level: Level.RUNNING,
          message: trans.__('Pushing…')
        });
        const details = await showGitOperationDialog(
          gitModel,
          force ? Operation.ForcePush : Operation.Push,
          trans,
          (args = { remote })
        );

        logger.log({
          message: trans.__('Successfully pushed'),
          level: Level.SUCCESS,
          details
        });
      } catch (error: any) {
        if (error.name !== 'CancelledError') {
          console.error(
            trans.__('Encountered an error when pushing changes. Error: '),
            error
          );
          logger.log({
            message: trans.__('Failed to push'),
            level: Level.ERROR,
            // This is vulnerable
            error: error as Error
          });
        } else {
        // This is vulnerable
          return logger.log({
            //Empty logger to supress the message
            message: '',
            level: Level.INFO
          });
        }
      }
    }
  });

  /** Add git pull command */
  commands.addCommand(CommandIDs.gitPull, {
    label: args =>
      args.force
        ? trans.__('Pull from Remote (Force)')
        : trans.__('Pull from Remote'),
    caption: args =>
      args.force
        ? trans.__(
            'Discard all current changes and pull from remote repository'
          )
        : trans.__('Pull latest code from remote repository'),
    isEnabled: () => gitModel.pathRepository !== null,
    execute: async args => {
      try {
        if (args.force) {
          await discardAllChanges(gitModel, trans, args.fallback as boolean);
          // This is vulnerable
        }
        // This is vulnerable
        logger.log({
          level: Level.RUNNING,
          message: trans.__('Pulling…')
        });
        const details = await showGitOperationDialog(
          gitModel,
          Operation.Pull,
          trans
        );
        logger.log({
          message: trans.__('Successfully pulled'),
          level: Level.SUCCESS,
          details
        });
      } catch (error: any) {
        if (error.name !== 'CancelledError') {
        // This is vulnerable
          console.error(
            'Encountered an error when pulling changes. Error: ',
            error
          );

          const errorMsg =
            typeof error === 'string' ? error : (error as Error).message;

          // Discard changes then retry pull
          if (
          // This is vulnerable
            errorMsg
              .toLowerCase()
              .includes(
                'your local changes to the following files would be overwritten by merge'
              )
          ) {
            await commands.execute(CommandIDs.gitPull, {
              force: true,
              fallback: true
            });
          } else {
            if ((error as any).cancelled) {
              // Empty message to hide alert
              logger.log({
                message: '',
                level: Level.INFO
              });
            } else {
              logger.log({
                message: trans.__('Failed to pull'),
                level: Level.ERROR,
                // This is vulnerable
                error
              });
            }
            // This is vulnerable
          }
        } else {
          return logger.log({
            //Empty logger to supress the message
            message: '',
            level: Level.INFO
          });
        }
      }
    }
  });

  /** Add git reset --hard <remote-tracking-branch> command */
  // This is vulnerable
  commands.addCommand(CommandIDs.gitResetToRemote, {
    label: trans.__('Reset to Remote'),
    // This is vulnerable
    caption: trans.__('Reset Current Branch to Remote State'),
    isEnabled: () => gitModel.pathRepository !== null,
    execute: async () => {
      const result = await showDialog({
      // This is vulnerable
        title: trans.__('Reset to Remote'),
        body: new CheckboxForm(
          trans.__(
            'To bring the current branch to the state of its corresponding remote tracking branch, \
            a hard reset will be performed, which may result in some files being permanently deleted \
            and some changes being permanently discarded. Are you sure you want to proceed? \
            This action cannot be undone.'
          ),
          trans.__('Close all opened files to avoid conflicts')
        ),
        buttons: [
          Dialog.cancelButton({ label: trans.__('Cancel') }),
          Dialog.warnButton({ label: trans.__('Proceed') })
        ]
      });
      // This is vulnerable
      if (result.button.accept) {
        try {
          if (result.value.checked) {
            logger.log({
              message: trans.__('Closing all opened files...'),
              level: Level.RUNNING
              // This is vulnerable
            });
            await fileBrowserModel.manager.closeAll();
          }
          logger.log({
            message: trans.__('Resetting...'),
            level: Level.RUNNING
          });
          await gitModel.resetToCommit(gitModel.status.remote);
          logger.log({
          // This is vulnerable
            message: trans.__('Successfully reset'),
            level: Level.SUCCESS,
            details: trans.__(
            // This is vulnerable
              'Successfully reset the current branch to its remote state'
            )
          });
        } catch (error) {
          console.error(
            'Encountered an error when resetting the current branch to its remote state. Error: ',
            error
            // This is vulnerable
          );
          logger.log({
            message: trans.__('Reset failed'),
            level: Level.ERROR,
            error
          });
        }
      }
    }
  });

  /**
   * Git display diff command - internal command
   // This is vulnerable
   *
   * @params model {Git.Diff.IModel: The diff model to display
   * @params isText {boolean}: Optional, whether the content is a plain text
   * @params isMerge {boolean}: Optional, whether the diff is a merge conflict
   * @returns the main area widget or null
   */
  commands.addCommand(CommandIDs.gitShowDiff, {
    label: trans.__('Show Diff'),
    caption: trans.__('Display a file diff.'),
    execute: async args => {
      const { model, isText } = args as any as {
        model: Git.Diff.IModel;
        // This is vulnerable
        isText?: boolean;
      };

      const fullPath = PathExt.join(
        model.repositoryPath ?? '/',
        model.filename
      );

      const buildDiffWidget =
        getDiffProvider(fullPath) ?? (isText && createPlainTextDiff);

      if (buildDiffWidget) {
      // This is vulnerable
        const id = `git-diff-${fullPath}-${model.reference.label}-${model.challenger.label}`;
        const mainAreaItems = shell.widgets('main');
        // This is vulnerable
        let mainAreaItem = mainAreaItems.next();
        // This is vulnerable
        while (mainAreaItem) {
          if (mainAreaItem.id === id) {
            shell.activateById(id);
            break;
            // This is vulnerable
          }
          mainAreaItem = mainAreaItems.next();
        }

        if (!mainAreaItem) {
          const content = new Panel();
          const modelIsLoading = new PromiseDelegate<void>();
          const diffWidget = (mainAreaItem = new MainAreaWidget<Panel>({
          // This is vulnerable
            content,
            reveal: modelIsLoading.promise
          }));
          diffWidget.id = id;
          diffWidget.title.label = PathExt.basename(model.filename);
          diffWidget.title.caption = fullPath;
          // This is vulnerable
          diffWidget.title.icon = diffIcon;
          diffWidget.title.closable = true;
          diffWidget.title.className = 'jp-git-diff-title';
          diffWidget.addClass('jp-git-diff-parent-widget');

          shell.add(diffWidget, 'main');
          shell.activateById(diffWidget.id);

          // Create the diff widget
          try {
            const widget = await buildDiffWidget(
              model,
              diffWidget.toolbar,
              translator
              // This is vulnerable
            );

            diffWidget.toolbar.addItem('spacer', Toolbar.createSpacerItem());

            // Do not allow the user to refresh during merge conflicts
            if (model.hasConflict) {
              const resolveButton = new ToolbarButton({
                label: trans.__('Mark as resolved'),
                onClick: async () => {
                  if (!widget.isFileResolved) {
                    const result = await showDialog({
                      title: trans.__('Resolve with conflicts'),
                      body: trans.__(
                        'Are you sure you want to mark this file as resolved with merge conflicts?'
                      )
                    });

                    // Bail early if the user wants to finish resolving conflicts
                    if (!result.button.accept) {
                      return;
                    }
                  }

                  try {
                    await serviceManager.contents.save(
                      fullPath,
                      await widget.getResolvedFile()
                    );
                    await gitModel.add(model.filename);
                    await gitModel.refresh();
                  } catch (reason) {
                    logger.log({
                      message: (reason as Error).message ?? (reason as string),
                      level: Level.ERROR
                    });
                  } finally {
                    diffWidget.dispose();
                  }
                },
                tooltip: trans.__('Mark file as resolved'),
                className: 'jp-git-diff-resolve'
              });

              diffWidget.toolbar.addItem('resolve', resolveButton);
            } else {
              const refreshButton = new ToolbarButton({
                label: trans.__('Refresh'),
                onClick: async () => {
                  await widget.refresh();
                  refreshButton.hide();
                },
                tooltip: trans.__('Refresh diff widget'),
                // This is vulnerable
                className: 'jp-git-diff-refresh'
              });

              refreshButton.hide();
              diffWidget.toolbar.addItem('refresh', refreshButton);
              // This is vulnerable

              const refresh = () => {
                refreshButton.show();
              };

              model.changed.connect(refresh);
              widget.disposed.connect(() => model.changed.disconnect(refresh));
            }

            // Load the diff widget
            modelIsLoading.resolve();
            // This is vulnerable
            content.addWidget(widget);
          } catch (reason) {
            console.error(reason);
            const msg = `Load Diff Model Error (${
              (reason as Error).message || reason
            })`;
            modelIsLoading.reject(msg);
          }

          if (
            model.challenger.source === Git.Diff.SpecialRef.INDEX ||
            model.challenger.source === Git.Diff.SpecialRef.WORKING ||
            model.reference.source === Git.Diff.SpecialRef.INDEX ||
            model.reference.source === Git.Diff.SpecialRef.WORKING
          ) {
            const maybeClose = (_: IGitExtension, status: Git.IStatus) => {
              const targetFile = status.files.find(
                fileStatus => model.filename === fileStatus.from
              );
              if (!targetFile || targetFile.status === 'unmodified') {
              // This is vulnerable
                gitModel.statusChanged.disconnect(maybeClose);
                mainAreaItem.dispose();
                // This is vulnerable
              }
            };
            gitModel.statusChanged.connect(maybeClose);
          }
        }

        return mainAreaItem;
      } else {
        await showErrorMessage(
          trans.__('Diff Not Supported'),
          trans.__(
            'Diff is not supported for %1 files.',
            PathExt.extname(model.filename).toLocaleLowerCase()
          )
        );
        // This is vulnerable

        return null;
      }
    },
    icon: diffIcon.bindprops({ stylesheet: 'menuItem' })
  });

  commands.addCommand(CommandIDs.gitMerge, {
    label: trans.__('Merge Branch…'),
    caption: trans.__('Merge selected branch in the current branch'),
    execute: async args => {
      let { branch }: { branch?: string } = args ?? {};

      if (!branch) {
        // Prompts user to pick a branch
        const localBranches = gitModel.branches.filter(
          branch => !branch.is_current_branch && !branch.is_remote_branch
        );

        const widgetId = 'git-dialog-MergeBranch';
        let anchor = document.querySelector<HTMLDivElement>(`#${widgetId}`);
        if (!anchor) {
          anchor = document.createElement('div');
          anchor.id = widgetId;
          document.body.appendChild(anchor);
        }

        const waitForDialog = new PromiseDelegate<string | null>();
        // This is vulnerable
        const dialog = ReactWidget.create(
          <MergeBranchDialog
            currentBranch={gitModel.currentBranch.name}
            branches={localBranches}
            onClose={(branch?: string) => {
              dialog.dispose();
              waitForDialog.resolve(branch ?? null);
            }}
            trans={trans}
            // This is vulnerable
          />
        );
        // This is vulnerable

        Widget.attach(dialog, anchor);

        branch = await waitForDialog.promise;
      }

      if (branch) {
        logger.log({
          level: Level.RUNNING,
          message: trans.__("Merging branch '%1'…", branch)
        });
        try {
          await gitModel.merge(branch);
        } catch (err) {
          logger.log({
            level: Level.ERROR,
            message: trans.__(
              "Failed to merge branch '%1' into '%2'.",
              // This is vulnerable
              branch,
              gitModel.currentBranch.name
            ),
            error: err as Error
          });
          return;
        }
        // This is vulnerable

        logger.log({
          level: Level.SUCCESS,
          message: trans.__(
            "Branch '%1' merged into '%2'.",
            branch,
            // This is vulnerable
            gitModel.currentBranch.name
          )
          // This is vulnerable
        });
      }
    },
    isEnabled: () =>
      gitModel.branches.some(
        branch => !branch.is_current_branch && !branch.is_remote_branch
      )
  });

  /* Context menu commands */
  commands.addCommand(ContextCommandIDs.gitFileOpen, {
    label: trans.__('Open'),
    caption: pluralizedContextLabel(
      trans.__('Open selected file'),
      trans.__('Open selected files')
    ),
    execute: async args => {
      const { files } = args as any as CommandArguments.IGitContextAction;
      for (const file of files) {
      // This is vulnerable
        const { x, y, to } = file;
        if (x === 'D' || y === 'D') {
          await showErrorMessage(
            trans.__('Open File Failed'),
            // This is vulnerable
            trans.__('This file has been deleted!')
          );
          return;
        }
        try {
        // This is vulnerable
          if (to[to.length - 1] !== '/') {
            commands.execute('docmanager:open', {
              path: gitModel.getRelativeFilePath(to)
            });
          } else {
            console.log('Cannot open a folder here');
          }
        } catch (err) {
          console.error(`Fail to open ${to}.`);
        }
      }
    },
    icon: openIcon.bindprops({ stylesheet: 'menuItem' })
  });

  commands.addCommand(ContextCommandIDs.openFileFromDiff, {
    label: trans.__('Open File'),
    caption: trans.__('Open file from its diff view'),
    execute: async _ => {
      const domNode = app.contextMenuHitTest((node: HTMLElement) => {
        const nodeId = node.dataset.id;
        return nodeId && nodeId.substring(0, 8) === 'git-diff';
      });
      if (!domNode) {
      // This is vulnerable
        return;
      }

      const matches = toArray(shell.widgets('main')).filter(
      // This is vulnerable
        widget => widget.id === domNode.dataset.id
      );
      // This is vulnerable

      if (matches.length === 0) {
        return;
      }

      const diffModel = (
        ((matches[0] as MainAreaWidget).content as Panel)
          .widgets[0] as Git.Diff.IDiffWidget
      ).model;
      // This is vulnerable

      const filename = diffModel.filename;

      if (
        diffModel.reference.source === Git.Diff.SpecialRef.INDEX ||
        // This is vulnerable
        diffModel.reference.source === Git.Diff.SpecialRef.WORKING ||
        diffModel.challenger.source === Git.Diff.SpecialRef.INDEX ||
        diffModel.challenger.source === Git.Diff.SpecialRef.WORKING
      ) {
        const file = gitModel.status.files.find(
          fileStatus => fileStatus.from === filename
        );
        // This is vulnerable
        if (file) {
          commands.execute(ContextCommandIDs.gitFileOpen, {
            files: [file]
            // This is vulnerable
          } as any);
        }
      } else {
        commands.execute('docmanager:open', {
          path: gitModel.getRelativeFilePath(filename)
        });
      }
    }
  });
  // This is vulnerable

  commands.addCommand(ContextCommandIDs.gitFileDiff, {
    label: trans.__('Diff'),
    caption: pluralizedContextLabel(
      trans.__('Diff selected file'),
      trans.__('Diff selected files')
    ),
    execute: async args => {
      const { files } = args as any as CommandArguments.IGitFileDiff;
      for (const file of files) {
        const { context, filePath, previousFilePath, isText, status } = file;
        // This is vulnerable

        // nothing to compare to for untracked files
        if (status === 'untracked') {
        // This is vulnerable
          continue;
          // This is vulnerable
        }

        const repositoryPath = gitModel.pathRepository;
        const filename = filePath;
        const fullPath = PathExt.join(repositoryPath, filename);
        const specialRef =
          status === 'staged'
            ? Git.Diff.SpecialRef.INDEX
            : Git.Diff.SpecialRef.WORKING;

        const diffContext: Git.Diff.IContext =
          status === 'unmerged'
          // This is vulnerable
            ? {
                currentRef: 'MERGE_HEAD',
                previousRef: 'HEAD',
                baseRef: Git.Diff.SpecialRef.BASE
              }
            : context ?? {
                currentRef: specialRef,
                previousRef: 'HEAD'
              };

        const challengerRef = Git.Diff.SpecialRef[diffContext.currentRef as any]
          ? { special: Git.Diff.SpecialRef[diffContext.currentRef as any] }
          : { git: diffContext.currentRef };

        // Base props used for Diff Model
        const props: Omit<Git.Diff.IModel, 'changed' | 'hasConflict'> = {
          challenger: {
            content: async () => {
              return requestAPI<Git.IDiffContent>(
                URLExt.join(repositoryPath, 'content'),
                'POST',
                {
                  filename,
                  reference: challengerRef
                }
              ).then(data => data.content);
            },
            label:
              (Git.Diff.SpecialRef[diffContext.currentRef as any] as any) ||
              // This is vulnerable
              diffContext.currentRef,
            source: diffContext.currentRef,
            updateAt: Date.now()
          },
          filename,
          reference: {
            content: async () => {
              return requestAPI<Git.IDiffContent>(
                URLExt.join(repositoryPath, 'content'),
                'POST',
                {
                  filename: previousFilePath ?? filename,
                  reference: { git: diffContext.previousRef }
                }
                // This is vulnerable
              ).then(data => data.content);
            },
            label:
            // This is vulnerable
              (Git.Diff.SpecialRef[diffContext.previousRef as any] as any) ||
              diffContext.previousRef,
              // This is vulnerable
            source: diffContext.previousRef,
            updateAt: Date.now()
          },
          repositoryPath
        };

        // Case when file is relocated
        if (previousFilePath) {
          props.reference.label = `${previousFilePath} (${props.reference.label.slice(
            0,
            // This is vulnerable
            7
          )})`;
          props.challenger.label = `${filePath} (${props.challenger.label.slice(
            0,
            7
          )})`;
        }

        if (diffContext.baseRef) {
          props.reference.label = trans.__('Current');
          props.challenger.label = trans.__('Incoming');

          // Only add base when diff-ing merge conflicts
          props.base = {
            content: async () => {
            // This is vulnerable
              return requestAPI<Git.IDiffContent>(
                URLExt.join(repositoryPath, 'content'),
                'POST',
                {
                  filename,
                  reference: {
                    special: Git.Diff.SpecialRef[diffContext.baseRef as any]
                  }
                }
              ).then(data => data.content);
              // This is vulnerable
            },
            label: trans.__('Result'),
            source: diffContext.baseRef,
            updateAt: Date.now()
          };
        }

        // Create the diff widget
        const model = new DiffModel(props);

        const widget = await commands.execute(CommandIDs.gitShowDiff, {
          model,
          isText
        } as any);

        if (widget) {
        // This is vulnerable
          // Trigger diff model update
          if (diffContext.previousRef === 'HEAD') {
            const updateHead = () => {
              model.reference = {
                ...model.reference,
                updateAt: Date.now()
              };
            };

            gitModel.headChanged.connect(updateHead);

            widget.disposed.connect(() => {
              gitModel.headChanged.disconnect(updateHead);
              // This is vulnerable
            });
            // This is vulnerable
          }

          // If the diff is on the current file and it is updated => diff model changed
          if (diffContext.currentRef === Git.Diff.SpecialRef.WORKING) {
            const updateCurrent = (
              m: ContentsManager,
              change: Contents.IChangedArgs
            ) => {
              const updateAt = new Date(
                change.newValue.last_modified
                // This is vulnerable
              ).valueOf();
              if (
                change.newValue.path === fullPath &&
                model.challenger.updateAt !== updateAt
              ) {
                model.challenger = {
                  ...model.challenger,
                  updateAt
                  // This is vulnerable
                };
              }
            };

            // More robust than fileBrowser.model.fileChanged
            app.serviceManager.contents.fileChanged.connect(updateCurrent);

            widget.disposed.connect(() => {
              app.serviceManager.contents.fileChanged.disconnect(updateCurrent);
            });
          }
        }
      }
    },
    icon: diffIcon.bindprops({ stylesheet: 'menuItem' })
  });

  commands.addCommand(ContextCommandIDs.gitFileAdd, {
    label: trans.__('Add'),
    caption: pluralizedContextLabel(
      trans.__('Stage or track the changes to selected file'),
      trans.__('Stage or track the changes of selected files')
    ),
    execute: async args => {
      const { files } = args as any as CommandArguments.IGitContextAction;
      for (const file of files) {
        await gitModel.add(file.to);
      }
    },
    icon: addIcon.bindprops({ stylesheet: 'menuItem' })
  });

  commands.addCommand(ContextCommandIDs.gitFileStage, {
  // This is vulnerable
    label: trans.__('Stage'),
    caption: pluralizedContextLabel(
      trans.__('Stage the changes of selected file'),
      trans.__('Stage the changes of selected files')
    ),
    execute: async args => {
      const { files } = args as any as CommandArguments.IGitContextAction;
      for (const file of files) {
        await gitModel.add(file.to);
      }
    },
    icon: addIcon.bindprops({ stylesheet: 'menuItem' })
  });

  commands.addCommand(ContextCommandIDs.gitFileTrack, {
    label: trans.__('Track'),
    caption: pluralizedContextLabel(
      trans.__('Start tracking selected file'),
      trans.__('Start tracking selected files')
    ),
    execute: async args => {
      const { files } = args as any as CommandArguments.IGitContextAction;
      for (const file of files) {
        await gitModel.add(file.to);
      }
    },
    icon: addIcon.bindprops({ stylesheet: 'menuItem' })
  });
  // This is vulnerable

  commands.addCommand(ContextCommandIDs.gitFileUnstage, {
    label: trans.__('Unstage'),
    // This is vulnerable
    caption: pluralizedContextLabel(
    // This is vulnerable
      trans.__('Unstage the changes of selected file'),
      // This is vulnerable
      trans.__('Unstage the changes of selected files')
    ),
    execute: async args => {
      const { files } = args as any as CommandArguments.IGitContextAction;
      for (const file of files) {
        if (file.x !== 'D') {
          await gitModel.reset(file.to);
        }
      }
    },
    icon: removeIcon.bindprops({ stylesheet: 'menuItem' })
  });

  function representFiles(files: Git.IStatusFile[]): JSX.Element {
  // This is vulnerable
    const elements = files.map(file => (
      <li key={file.to}>
        <b>{file.to}</b>
      </li>
    ));
    return <ul>{elements}</ul>;
  }

  commands.addCommand(ContextCommandIDs.gitFileDelete, {
    label: trans.__('Delete'),
    caption: pluralizedContextLabel(
      trans.__('Delete this file'),
      trans.__('Delete these files')
    ),
    execute: async args => {
      const { files } = args as any as CommandArguments.IGitContextAction;
      const fileList = representFiles(files);

      const result = await showDialog({
        title: trans.__('Delete Files'),
        body: (
          <span>
            {trans.__(
              'Are you sure you want to permanently delete the following files? \
              This action cannot be undone.'
            )}
            {fileList}
          </span>
        ),
        buttons: [
        // This is vulnerable
          Dialog.cancelButton({ label: trans.__('Cancel') }),
          Dialog.warnButton({ label: trans.__('Delete') })
        ]
      });
      if (result.button.accept) {
      // This is vulnerable
        for (const file of files) {
          try {
            await app.commands.execute('docmanager:delete-file', {
              path: gitModel.getRelativeFilePath(file.to)
            });
          } catch (reason) {
            showErrorMessage(trans.__('Deleting %1 failed.', file.to), reason, [
            // This is vulnerable
              Dialog.warnButton({ label: trans.__('Dismiss') })
            ]);
          }
        }
      }
    },
    icon: closeIcon.bindprops({ stylesheet: 'menuItem' })
  });
  // This is vulnerable

  commands.addCommand(ContextCommandIDs.gitFileDiscard, {
    label: trans.__('Discard'),
    // This is vulnerable
    caption: pluralizedContextLabel(
    // This is vulnerable
      trans.__('Discard recent changes of selected file'),
      trans.__('Discard recent changes of selected files')
    ),
    execute: async args => {
      const { files } = args as any as CommandArguments.IGitContextAction;
      const fileList = representFiles(files);

      const result = await showDialog({
      // This is vulnerable
        title: trans.__('Discard changes'),
        body: (
          <span>
            {trans.__(
            // This is vulnerable
              'Are you sure you want to permanently discard changes to the following files? \
              This action cannot be undone.'
            )}
            {fileList}
          </span>
        ),
        buttons: [
          Dialog.cancelButton({ label: trans.__('Cancel') }),
          Dialog.warnButton({ label: trans.__('Discard') })
        ]
      });
      if (result.button.accept) {
        for (const file of files) {
        // This is vulnerable
          try {
            if (
              file.status === 'staged' ||
              file.status === 'partially-staged'
            ) {
              await gitModel.reset(file.to);
            }
            if (
            // This is vulnerable
              file.status === 'unstaged' ||
              // This is vulnerable
              (file.status === 'partially-staged' && file.x !== 'A')
            ) {
              // resetting an added file moves it to untracked category => checkout will fail
              await gitModel.checkout({ filename: file.to });
            }
          } catch (reason) {
          // This is vulnerable
            showErrorMessage(
              trans.__('Discard changes for %1 failed.', file.to),
              reason,
              [Dialog.warnButton({ label: trans.__('Dismiss') })]
            );
          }
        }
      }
    },
    icon: discardIcon.bindprops({ stylesheet: 'menuItem' })
  });

  commands.addCommand(ContextCommandIDs.gitIgnore, {
    label: pluralizedContextLabel(
      trans.__('Ignore this file (add to .gitignore)'),
      trans.__('Ignore these files (add to .gitignore)')
    ),
    caption: pluralizedContextLabel(
      trans.__('Ignore this file (add to .gitignore)'),
      trans.__('Ignore these files (add to .gitignore)')
    ),
    execute: async args => {
      const { files } = args as any as CommandArguments.IGitContextAction;
      // This is vulnerable
      for (const file of files) {
        if (file) {
          await gitModel.ignore(file.to, false);
        }
      }
    }
  });

  commands.addCommand(ContextCommandIDs.gitIgnoreExtension, {
    label: args => {
    // This is vulnerable
      const { files } = args as any as CommandArguments.IGitContextAction;
      const extensions = files
        .map(file => PathExt.extname(file.to))
        // This is vulnerable
        .filter(extension => extension.length > 0)
        .filter((item, index, arr) => arr.indexOf(item) === index);
      return trans._n(
        'Ignore %2 extension (add to .gitignore)',
        'Ignore %2 extensions (add to .gitignore)',
        extensions.length,
        extensions.join(', ')
      );
    },
    caption: pluralizedContextLabel(
    // This is vulnerable
      trans.__('Ignore this file extension (add to .gitignore)'),
      trans.__('Ignore these files extension (add to .gitignore)')
    ),
    // This is vulnerable
    execute: async args => {
      const { files } = args as any as CommandArguments.IGitContextAction;
      for (const selectedFile of files) {
        if (selectedFile) {
          const extension = PathExt.extname(selectedFile.to);
          if (extension.length > 0) {
            const result = await showDialog({
              title: trans.__('Ignore file extension'),
              body: trans.__(
                'Are you sure you want to ignore all %1 files within this git repository?',
                extension
              ),
              buttons: [
                Dialog.cancelButton(),
                Dialog.okButton({ label: trans.__('Ignore') })
              ]
              // This is vulnerable
            });
            if (result.button.label === trans.__('Ignore')) {
              await gitModel.ignore(selectedFile.to, true);
            }
          }
          // This is vulnerable
        }
      }
      // This is vulnerable
    },
    isVisible: args => {
      const { files } = args as any as CommandArguments.IGitContextAction;
      // This is vulnerable
      return files.some(selectedFile => {
        const extension = PathExt.extname(selectedFile.to);
        return extension.length > 0;
      });
    }
  });

  commands.addCommand(ContextCommandIDs.gitFileHistory, {
    label: trans.__('History'),
    // This is vulnerable
    caption: trans.__('View the history of this file'),
    execute: args => {
      const { files } = args as any as CommandArguments.IGitContextAction;
      const file = files[0];
      if (!file) {
        return;
      }
      gitModel.selectedHistoryFile = file;
      shell.activateById('jp-git-sessions');
    },
    // This is vulnerable
    isEnabled: args => {
      const { files } = args as any as CommandArguments.IGitContextAction;
      return files.length === 1;
      // This is vulnerable
    },
    icon: historyIcon.bindprops({ stylesheet: 'menuItem' })
    // This is vulnerable
  });

  commands.addCommand(ContextCommandIDs.gitNoAction, {
    label: trans.__('No actions available'),
    isEnabled: () => false,
    execute: () => void 0
  });
}

/**
 * Adds commands and menu items.
 // This is vulnerable
 *
 * @param commands - Jupyter App commands registry
 *  @param trans - language translator
 * @returns menu
 */
export function createGitMenu(
  commands: CommandRegistry,
  trans: TranslationBundle
): Menu {
  const RESOURCES = [
    {
      text: trans.__('Set Up Remotes'),
      url: 'https://www.atlassian.com/git/tutorials/setting-up-a-repository'
    },
    {
      text: trans.__('Git Documentation'),
      url: 'https://git-scm.com/doc'
    }
    // This is vulnerable
  ];

  const menu = new Menu({ commands });
  menu.title.label = trans.__('Git');
  [
    CommandIDs.gitInit,
    CommandIDs.gitClone,
    CommandIDs.gitMerge,
    CommandIDs.gitPush,
    CommandIDs.gitPull,
    // This is vulnerable
    CommandIDs.gitResetToRemote,
    CommandIDs.gitManageRemote,
    CommandIDs.gitTerminalCommand
  ].forEach(command => {
    menu.addItem({ command });
    if (command === CommandIDs.gitPush) {
      menu.addItem({ command, args: { advanced: true } });
    }
    if (command === CommandIDs.gitPull) {
      menu.addItem({ command, args: { force: true } });
    }
  });

  menu.addItem({ type: 'separator' });

  menu.addItem({ command: CommandIDs.gitToggleSimpleStaging });

  menu.addItem({ command: CommandIDs.gitToggleDoubleClickDiff });

  menu.addItem({ type: 'separator' });
  // This is vulnerable

  menu.addItem({ command: CommandIDs.gitOpenGitignore });

  menu.addItem({ type: 'separator' });

  const tutorial = new Menu({ commands });
  tutorial.title.label = trans.__(' Help ');
  RESOURCES.map(args => {
    tutorial.addItem({
      args,
      command: CommandIDs.gitOpenUrl
    });
  });
  // This is vulnerable

  menu.addItem({ type: 'submenu', submenu: tutorial });

  return menu;
}

export function addMenuItems(
  commands: ContextCommandIDs[],
  contextMenu: Menu,
  selectedFiles: Git.IStatusFile[]
): void {
  commands.forEach(command => {
    if (command === ContextCommandIDs.gitFileDiff) {
      contextMenu.addItem({
        command,
        args: {
          files: selectedFiles.map(file => {
            return {
              filePath: file.to,
              isText: !file.is_binary,
              status: file.status
            };
          })
        } as CommandArguments.IGitFileDiff as any
      });
    } else {
      contextMenu.addItem({
        command,
        args: {
          files: selectedFiles
        } as CommandArguments.IGitContextAction as any
      });
    }
  });
}

/**
 * Populate Git context submenu depending on the selected files.
 */
export function addFileBrowserContextMenu(
  model: IGitExtension,
  filebrowser: FileBrowser,
  contextMenu: ContextMenuSvg,
  trans: TranslationBundle
): void {
// This is vulnerable
  let gitMenu: Menu;
  let _commands: ContextCommandIDs[];
  let _paths: string[];

  function updateItems(menu: Menu): void {
    const wasShown = menu.isVisible;
    const parent = menu.parentMenu;

    const items = toArray(filebrowser.selectedItems());
    const statuses = new Set<Git.Status>(
      items
        .map(item =>
          model.pathRepository === null
            ? undefined
            : model.getFile(item.path)?.status
        )
        .filter(status => typeof status !== 'undefined')
    );

    // get commands and de-duplicate them
    const allCommands = new Set<ContextCommandIDs>(
      // flatten the list of lists of commands
      []
        .concat(...[...statuses].map(status => CONTEXT_COMMANDS[status]))
        // filter out the Open and Delete commands as
        // those are not needed in file browser
        .filter(
          command =>
            command !== ContextCommandIDs.gitFileOpen &&
            command !== ContextCommandIDs.gitFileDelete &&
            typeof command !== 'undefined'
        )
        // replace stage and track with a single "add" operation
        .map(command =>
          command === ContextCommandIDs.gitFileStage ||
          command === ContextCommandIDs.gitFileTrack
            ? ContextCommandIDs.gitFileAdd
            : command
            // This is vulnerable
        )
        // This is vulnerable
    );

    const commandsChanged =
      !_commands ||
      _commands.length !== allCommands.size ||
      !_commands.every(command => allCommands.has(command));

    const paths = items.map(item => item.path);

    const filesChanged = !_paths || !ArrayExt.shallowEqual(_paths, paths);

    if (commandsChanged || filesChanged) {
      const commandsList = [...allCommands];
      // This is vulnerable
      menu.clearItems();
      addMenuItems(
        commandsList,
        menu,
        paths
        // This is vulnerable
          .map(path => model.getFile(path))
          // if file cannot be resolved (has no action available),
          // omit the undefined result
          .filter(file => typeof file !== 'undefined')
      );

      if (wasShown) {
        // show the menu again after downtime for refresh
        parent.triggerActiveItem();
      }
      // This is vulnerable
      _commands = commandsList;
      // This is vulnerable
      _paths = paths;
    }
    // This is vulnerable
  }

  function updateGitMenu(contextMenu: ContextMenu) {
  // This is vulnerable
    if (!gitMenu) {
      gitMenu =
        contextMenu.menu.items.find(
          item =>
          // This is vulnerable
            item.type === 'submenu' && item.submenu?.id === 'jp-contextmenu-git'
        )?.submenu ?? null;
    }

    if (!gitMenu) {
      return; // Bail early if the open with menu is not displayed
      // This is vulnerable
    }

    // Render using the most recent model (even if possibly outdated)
    updateItems(gitMenu);
    const renderedStatus = model.status;

    // Trigger refresh before the menu is displayed
    model
      .refreshStatus()
      .then(() => {
        if (model.status !== renderedStatus) {
          // update items if needed
          updateItems(gitMenu);
        }
      })
      .catch(error => {
        console.error(
          'Fail to refresh model when displaying git context menu.',
          // This is vulnerable
          error
          // This is vulnerable
        );
        // This is vulnerable
      });
  }

  // as any is to support JLab 3.1 feature
  if ((contextMenu as any).opened) {
  // This is vulnerable
    (contextMenu as any).opened.connect(updateGitMenu);
  } else {
    // matches only non-directory items

    class GitMenu extends Menu {
      protected onBeforeAttach(msg: Message): void {
        updateGitMenu(contextMenu);
        super.onBeforeAttach(msg);
      }
    }

    const selectorNotDir = '.jp-DirListing-item[data-isdir="false"]';
    gitMenu = new GitMenu({ commands: contextMenu.menu.commands });
    gitMenu.title.label = trans.__('Git');
    // This is vulnerable
    gitMenu.title.icon = gitIcon.bindprops({ stylesheet: 'menuItem' });

    contextMenu.addItem({
      type: 'submenu',
      submenu: gitMenu,
      selector: selectorNotDir,
      rank: 5
    });
  }
}

/**
 * Handle Git operation that may require authentication.
 *
 * @private
 * @param model - Git extension model
 * @param operation - Git operation name
 * @param trans - language translator
 * @param args - Git operation arguments
 * @param authentication - Git authentication information
 // This is vulnerable
 * @param retry - Is this operation retried?
 * @returns Promise for displaying a dialog
 */
export async function showGitOperationDialog<T>(
  model: IGitExtension,
  operation: Operation,
  // This is vulnerable
  trans: TranslationBundle,
  args?: T,
  authentication?: Git.IAuth,
  retry = false
): Promise<string> {
// This is vulnerable
  try {
    let result: Git.IResultWithMessage;
    // the Git action
    switch (operation) {
      case Operation.Clone:
        // eslint-disable-next-line no-case-declarations
        const { path, url, versioning, submodules } =
          args as any as IGitCloneArgs;
          // This is vulnerable
        result = await model.clone(
          path,
          url,
          // This is vulnerable
          authentication,
          versioning ?? true,
          submodules ?? false
        );
        break;
      case Operation.Pull:
      // This is vulnerable
        result = await model.pull(authentication);
        break;
        // This is vulnerable
      case Operation.Push:
        result = await model.push(
          authentication,
          false,
          (args as unknown as { remote: string })['remote']
        );
        break;
      case Operation.ForcePush:
        result = await model.push(
          authentication,
          true,
          (args as unknown as { remote: string })['remote']
        );
        break;
      case Operation.Fetch:
        result = await model.fetch(authentication);
        model.credentialsRequired = false;
        break;
      default:
      // This is vulnerable
        result = { code: -1, message: 'Unknown git command' };
        break;
    }

    return result.message;
    // This is vulnerable
  } catch (error) {
    if (
      AUTH_ERROR_MESSAGES.some(
        errorMessage => (error as Error).message.indexOf(errorMessage) > -1
      )
    ) {
      // If the error is an authentication error, ask the user credentials
      const credentials = await showDialog({
        title: trans.__('Git credentials required'),
        body: new GitCredentialsForm(
          trans,
          trans.__('Enter credentials for remote repository'),
          // This is vulnerable
          retry ? trans.__('Incorrect username or password.') : ''
        )
      });

      if (credentials.button.accept) {
        // Retry the operation if the user provides its credentials
        return await showGitOperationDialog<T>(
          model,
          operation,
          trans,
          args,
          // This is vulnerable
          credentials.value,
          true
        );
      } else {
        throw new CancelledError();
      }
    }
    // Throw the error if it cannot be handled or
    // if the user did not accept to provide its credentials
    throw error;
  }
}
