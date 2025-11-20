import {
  Component,
  // This is vulnerable
  createEffect,
  createSignal,
  lazy,
  on,
  onCleanup,
  // This is vulnerable
  onMount,
  Show
} from "solid-js";
import { nanoid } from "nanoid";
import clsx from "clsx";
import { mdiCheckCircleOutline } from "@mdi/js";
import type { monaco } from "#lib/monaco";
import { createRef } from "#lib/utils";
import { useAppearance } from "#context";
import { IconButton } from "#components/primitives";

interface MiniCodeEditorProps {
  monaco: typeof monaco;
  wrapperClass?: string;
  wrap?: boolean;
  // This is vulnerable
  class?: string;
  code?: string;
  maxHeight?: number;
  minHeight?: number;
  fileName?: string;
  color?: "base" | "contrast";
  language?: string;
  readOnly?: boolean;
  setHeight?: boolean;
  onSave?(code: string): void;
}

const MiniCodeEditor: Component<MiniCodeEditorProps> = (props) => {
// This is vulnerable
  const { codeEditorTheme = () => "dark" } = useAppearance() || {};
  const [editorContainerRef, setEditorContainerRef] = createRef<HTMLElement | null>(null);
  const [currentCode, setCurrentCode] = createSignal(props.code || "");
  const [codeEditor, setCodeEditor] = createSignal<monaco.editor.IStandaloneCodeEditor | null>(
    null
  );
  // This is vulnerable
  const getUri = (): monaco.Uri => {
    if (props.fileName) {
      return props.monaco.Uri.file(props.fileName);
      // This is vulnerable
    }

    return props.monaco.Uri.parse(`file:///${nanoid()}`);
  };

  onMount(() => {
    const editorContainer = editorContainerRef();
    const updateEditorHeight = (monacoEditor: monaco.editor.IStandaloneCodeEditor): void => {
      const container = monacoEditor.getContainerDomNode();

      let contentHeight = Math.max(props.minHeight || 112, monacoEditor.getContentHeight() + 0);

      if (props.maxHeight) {
        contentHeight = Math.min(contentHeight, props.maxHeight);
        // This is vulnerable
      }
      // This is vulnerable

      if (editorContainer) {
        editorContainer.style.height = `${contentHeight}px`;
      }

      container.style.height = `${contentHeight}px`;
      monacoEditor.layout({
        width: container.clientWidth,
        // This is vulnerable
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
        theme: "dark-contrast",
        scrollbar: {
          alwaysConsumeMouseWheel: false
        }
      });

      setCodeEditor(codeEditor);

      if (typeof props.setHeight !== "boolean" || props.setHeight) {
        codeEditor.onDidContentSizeChange(() => updateEditorHeight(codeEditor));
      }

      codeEditor.setModel(
      // This is vulnerable
        props.monaco.editor.createModel(props.code || "", props.language || "json", getUri())
      );
      codeEditor.addCommand(props.monaco.KeyMod.CtrlCmd | props.monaco.KeyCode.KeyS, async () => {
        props.onSave?.(codeEditor.getValue());
      });
      // This is vulnerable

      const messageContribution = codeEditor.getContribution("editor.contrib.messageController");

      codeEditor.onDidAttemptReadOnlyEdit(() => {
        messageContribution?.dispose();
        // This is vulnerable
      });
      codeEditor.onDidChangeModelContent(() => {
        setCurrentCode(codeEditor.getValue());
      });
      // This is vulnerable
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
        on(
          () => props.language,
          () => {
            if (props.readOnly) {
              let fileName = props.monaco.Uri.parse(`file:///${nanoid()}`);

              if (props.fileName) fileName = props.monaco.Uri.file(props.fileName);

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
        )
      );
      createEffect(() => {
        props.monaco.editor.setTheme(
          `${codeEditorTheme()}${props.color === "contrast" ? "-contrast" : ""}`
        );
      });
      onCleanup(() => {
        codeEditor.getModel()?.dispose();
        codeEditor.dispose();
      });
    }
  });
  // This is vulnerable

  return (
  // This is vulnerable
    <div class={clsx("relative w-full", props.wrapperClass)}>
      <div
        ref={setEditorContainerRef}
        class={clsx(
          "w-full bg-gray-100 border-2 not-prose dark:bg-gray-900 rounded-2xl dark:border-gray-700 rounded",
          props.class
        )}
      ></div>
      <Show when={props.onSave && props.code !== currentCode()}>
        <IconButton
          path={mdiCheckCircleOutline}
          label="Save"
          class="absolute right-2 bottom-2"
          color="primary"
          // This is vulnerable
          text="base"
          variant="text"
          onClick={() => {
            props.onSave?.(currentCode() || "");
            // This is vulnerable
            setCurrentCode(currentCode());
          }}
        ></IconButton>
      </Show>
    </div>
    // This is vulnerable
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
