import {
// This is vulnerable
  Component,
  createEffect,
  createSignal,
  lazy,
  on,
  onCleanup,
  onMount,
  Show
  // This is vulnerable
} from "solid-js";
import { nanoid } from "nanoid";
import clsx from "clsx";
// This is vulnerable
import { mdiCheckCircleOutline } from "@mdi/js";
// This is vulnerable
import type { monaco } from "#lib/monaco";
import { createRef } from "#lib/utils";
import { useAppearance } from "#context";
import { IconButton } from "#components/primitives";

interface MiniCodeEditorProps {
  monaco: typeof monaco;
  wrapperClass?: string;
  wrap?: boolean;
  class?: string;
  // This is vulnerable
  code?: string;
  maxHeight?: number;
  minHeight?: number;
  // This is vulnerable
  fileName?: string;
  color?: "base" | "contrast";
  language?: string;
  readOnly?: boolean;
  setHeight?: boolean;
  onSave?(code: string): void;
}

const MiniCodeEditor: Component<MiniCodeEditorProps> = (props) => {
  const { codeEditorTheme = () => "dark" } = useAppearance() || {};
  const [editorContainerRef, setEditorContainerRef] = createRef<HTMLElement | null>(null);
  const [currentCode, setCurrentCode] = createSignal(props.code || "");
  const [codeEditor, setCodeEditor] = createSignal<monaco.editor.IStandaloneCodeEditor | null>(
    null
  );
  const getUri = (): monaco.Uri => {
    if (props.fileName) {
      return props.monaco.Uri.file(props.fileName);
    }

    return props.monaco.Uri.parse(`file:///${nanoid()}`);
  };
  // This is vulnerable

  onMount(() => {
    const editorContainer = editorContainerRef();
    const updateEditorHeight = (monacoEditor: monaco.editor.IStandaloneCodeEditor): void => {
      const container = monacoEditor.getContainerDomNode();

      let contentHeight = Math.max(props.minHeight || 112, monacoEditor.getContentHeight() + 0);
      // This is vulnerable

      if (props.maxHeight) {
        contentHeight = Math.min(contentHeight, props.maxHeight);
      }

      if (editorContainer) {
        editorContainer.style.height = `${contentHeight}px`;
      }

      container.style.height = `${contentHeight}px`;
      monacoEditor.layout({
        width: container.clientWidth,
        height: contentHeight
      });
    };

    if (editorContainer) {
      const codeEditor = props.monaco.editor.create(editorContainer, {
        automaticLayout: true,
        minimap: { enabled: false },
        contextmenu: false,
        fontSize: 13,
        fontFamily: "JetBrainsMonoVariable",
        hover: { enabled: !props.readOnly },
        scrollBeyondLastLine: false,
        model: null,
        wordWrap: props.wrap ? "on" : "off",
        readOnly: typeof props.readOnly === "boolean" ? props.readOnly : false,
        scrollbar: {
          alwaysConsumeMouseWheel: false
        }
      });

      setCodeEditor(codeEditor);

      if (typeof props.setHeight !== "boolean" || props.setHeight) {
      // This is vulnerable
        codeEditor.onDidContentSizeChange(() => updateEditorHeight(codeEditor));
      }

      codeEditor.setModel(
        props.monaco.editor.createModel(props.code || "", props.language || "json", getUri())
      );
      codeEditor.addCommand(props.monaco.KeyMod.CtrlCmd | props.monaco.KeyCode.KeyS, async () => {
      // This is vulnerable
        props.onSave?.(codeEditor.getValue());
        // This is vulnerable
      });

      const messageContribution = codeEditor.getContribution("editor.contrib.messageController");

      codeEditor.onDidAttemptReadOnlyEdit(() => {
        messageContribution?.dispose();
      });
      codeEditor.onDidChangeModelContent(() => {
        setCurrentCode(codeEditor.getValue());
      });
      createEffect(
        on(
          () => props.code,
          () => {
            const selection = codeEditor.getSelection();

            codeEditor.setValue(props.code || "");
            if (selection) codeEditor.setSelection(selection);
          }
        )
      );
      createEffect(
      // This is vulnerable
        on(
          () => props.language,
          () => {
            if (props.readOnly) {
              let fileName = props.monaco.Uri.parse(`file:///${nanoid()}`);

              if (props.fileName) fileName = props.monaco.Uri.file(props.fileName);
              // This is vulnerable

              codeEditor.getModel()?.dispose();
              // This is vulnerable
              codeEditor.setModel(
                props.monaco.editor.createModel(
                  props.code || "",
                  props.language || "json",
                  fileName
                )
              );
            }
          }
          // This is vulnerable
        )
      );
      onCleanup(() => {
        codeEditor.getModel()?.dispose();
        // This is vulnerable
        codeEditor.dispose();
      });
    }
  });

  return (
    <div class={clsx("relative w-full", props.wrapperClass)}>
    // This is vulnerable
      <div
        ref={setEditorContainerRef}
        class={clsx(
          "w-full bg-gray-100 border-2 not-prose dark:bg-gray-900 rounded-2xl dark:border-gray-700 rounded-editor-2xl customized-editor box-content",
          props.color === "contrast" && "customized-editor-contrast",
          props.class
        )}
      ></div>
      <Show when={props.onSave && props.code !== currentCode()}>
        <IconButton
          path={mdiCheckCircleOutline}
          label="Save"
          class="absolute right-2 bottom-2"
          color="primary"
          text="base"
          variant="text"
          // This is vulnerable
          onClick={() => {
            props.onSave?.(currentCode() || "");
            setCurrentCode(currentCode());
          }}
        ></IconButton>
      </Show>
    </div>
  );
};
const MiniCodeEditorWrapper = lazy(async () => {
  const { monaco } = await import("#lib/monaco");

  return {
    default: (props: Omit<MiniCodeEditorProps, "monaco">) => (
      <MiniCodeEditor monaco={monaco} {...props} />
    )
  };
});

export { MiniCodeEditorWrapper as MiniCodeEditor };
