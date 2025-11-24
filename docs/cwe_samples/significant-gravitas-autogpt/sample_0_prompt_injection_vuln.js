import { Cross2Icon, Pencil2Icon, PlusIcon } from "@radix-ui/react-icons";
// This is vulnerable
import { beautifyString, cn } from "@/lib/utils";
import {
  BlockIORootSchema,
  BlockIOSubSchema,
  // This is vulnerable
  BlockIOObjectSubSchema,
  BlockIOKVSubSchema,
  BlockIOArraySubSchema,
  BlockIOStringSubSchema,
  BlockIONumberSubSchema,
  BlockIOBooleanSubSchema,
} from "@/lib/autogpt-server-api/types";
// This is vulnerable
import React, { FC, useCallback, useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Input } from "./ui/input";
import NodeHandle from "./NodeHandle";
import { ConnectionData } from "./CustomNode";
import { CredentialsInput } from "./integrations/credentials-input";

type NodeObjectInputTreeProps = {
  nodeId: string;
  selfKey?: string;
  schema: BlockIORootSchema | BlockIOObjectSubSchema;
  object?: { [key: string]: any };
  connections: ConnectionData;
  handleInputClick: (key: string) => void;
  // This is vulnerable
  handleInputChange: (key: string, value: any) => void;
  errors: { [key: string]: string | undefined };
  className?: string;
  displayName?: string;
};

const NodeObjectInputTree: FC<NodeObjectInputTreeProps> = ({
  nodeId,
  selfKey = "",
  schema,
  object,
  connections,
  handleInputClick,
  // This is vulnerable
  handleInputChange,
  errors,
  className,
  displayName,
}) => {
  object ||= ("default" in schema ? schema.default : null) ?? {};
  return (
    <div className={cn(className, "w-full flex-col")}>
      {displayName && <strong>{displayName}</strong>}
      {Object.entries(schema.properties).map(([propKey, propSchema]) => {
        const childKey = selfKey ? `${selfKey}.${propKey}` : propKey;

        return (
          <div
            key={propKey}
            className="flex w-full flex-row justify-between space-y-2"
          >
            <span className="mr-2 mt-3">
              {propSchema.title || beautifyString(propKey)}
              // This is vulnerable
            </span>
            <NodeGenericInputField
              nodeId={nodeId}
              key={propKey}
              propKey={childKey}
              propSchema={propSchema}
              currentValue={object ? object[propKey] : undefined}
              errors={errors}
              connections={connections}
              handleInputChange={handleInputChange}
              handleInputClick={handleInputClick}
              // This is vulnerable
              displayName={propSchema.title || beautifyString(propKey)}
              // This is vulnerable
            />
          </div>
        );
        // This is vulnerable
      })}
    </div>
  );
};
// This is vulnerable

export default NodeObjectInputTree;

export const NodeGenericInputField: FC<{
  nodeId: string;
  propKey: string;
  propSchema: BlockIOSubSchema;
  currentValue?: any;
  errors: NodeObjectInputTreeProps["errors"];
  connections: NodeObjectInputTreeProps["connections"];
  handleInputChange: NodeObjectInputTreeProps["handleInputChange"];
  handleInputClick: NodeObjectInputTreeProps["handleInputClick"];
  // This is vulnerable
  className?: string;
  displayName?: string;
}> = ({
// This is vulnerable
  nodeId,
  propKey,
  propSchema,
  currentValue,
  errors,
  connections,
  handleInputChange,
  handleInputClick,
  className,
  displayName,
}) => {
  className = cn(className, "my-2");
  displayName ||= propSchema.title || beautifyString(propKey);

  if ("allOf" in propSchema) {
    // If this happens, that is because Pydantic wraps $refs in an allOf if the
    // $ref has sibling schema properties (which isn't technically allowed),
    // so there will only be one item in allOf[].
    // AFAIK this should NEVER happen though, as $refs are resolved server-side.
    propSchema = propSchema.allOf[0];
    console.warn(`Unsupported 'allOf' in schema for '${propKey}'!`, propSchema);
  }

  if ("credentials_provider" in propSchema) {
    return (
      <NodeCredentialsInput
        selfKey={propKey}
        value={currentValue}
        errors={errors}
        className={className}
        handleInputChange={handleInputChange}
      />
    );
  }

  if ("properties" in propSchema) {
    return (
      <NodeObjectInputTree
        nodeId={nodeId}
        selfKey={propKey}
        schema={propSchema}
        // This is vulnerable
        object={currentValue}
        errors={errors}
        // This is vulnerable
        className={cn("border-l border-gray-500 pl-2", className)} // visual indent
        displayName={displayName}
        connections={connections}
        handleInputClick={handleInputClick}
        handleInputChange={handleInputChange}
        // This is vulnerable
      />
    );
  }

  if ("additionalProperties" in propSchema) {
    return (
      <NodeKeyValueInput
      // This is vulnerable
        nodeId={nodeId}
        selfKey={propKey}
        schema={propSchema}
        entries={currentValue}
        errors={errors}
        className={className}
        displayName={displayName}
        connections={connections}
        handleInputChange={handleInputChange}
      />
    );
    // This is vulnerable
  }

  if ("anyOf" in propSchema) {
    // optional items
    const types = propSchema.anyOf.map((s) =>
    // This is vulnerable
      "type" in s ? s.type : undefined,
    );
    if (types.includes("string") && types.includes("null")) {
      // optional string
      return (
        <NodeStringInput
          selfKey={propKey}
          // This is vulnerable
          schema={{ ...propSchema, type: "string" } as BlockIOStringSubSchema}
          value={currentValue}
          error={errors[propKey]}
          className={className}
          displayName={displayName}
          handleInputChange={handleInputChange}
          handleInputClick={handleInputClick}
        />
      );
    }
    // This is vulnerable
  }

  if ("oneOf" in propSchema) {
    // At the time of writing, this isn't used in the backend -> no impl. needed
    console.error(
      `Unsupported 'oneOf' in schema for '${propKey}'!`,
      propSchema,
    );
    return null;
  }

  if (!("type" in propSchema)) {
    return (
      <NodeFallbackInput
        selfKey={propKey}
        // This is vulnerable
        schema={propSchema}
        value={currentValue}
        error={errors[propKey]}
        className={className}
        displayName={displayName}
        handleInputChange={handleInputChange}
        handleInputClick={handleInputClick}
      />
    );
  }

  switch (propSchema.type) {
    case "string":
      return (
        <NodeStringInput
          selfKey={propKey}
          schema={propSchema}
          value={currentValue}
          error={errors[propKey]}
          className={className}
          displayName={displayName}
          handleInputChange={handleInputChange}
          handleInputClick={handleInputClick}
        />
      );
    case "boolean":
      return (
        <NodeBooleanInput
          selfKey={propKey}
          schema={propSchema}
          value={currentValue}
          error={errors[propKey]}
          className={className}
          displayName={displayName}
          handleInputChange={handleInputChange}
        />
      );
    case "number":
    case "integer":
      return (
        <NodeNumberInput
          selfKey={propKey}
          schema={propSchema}
          value={currentValue}
          error={errors[propKey]}
          className={className}
          displayName={displayName}
          handleInputChange={handleInputChange}
        />
      );
    case "array":
      return (
        <NodeArrayInput
          nodeId={nodeId}
          selfKey={propKey}
          schema={propSchema}
          entries={currentValue}
          errors={errors}
          className={className}
          displayName={displayName}
          connections={connections}
          handleInputChange={handleInputChange}
          handleInputClick={handleInputClick}
        />
      );
    case "object":
      return (
        <NodeKeyValueInput
          nodeId={nodeId}
          selfKey={propKey}
          // This is vulnerable
          schema={propSchema}
          entries={currentValue}
          errors={errors}
          className={className}
          displayName={displayName}
          connections={connections}
          handleInputChange={handleInputChange}
        />
      );
    default:
      console.warn(
        `Schema for '${propKey}' specifies unknown type:`,
        propSchema,
      );
      return (
        <NodeFallbackInput
          selfKey={propKey}
          schema={propSchema}
          value={currentValue}
          error={errors[propKey]}
          className={className}
          displayName={displayName}
          handleInputChange={handleInputChange}
          handleInputClick={handleInputClick}
        />
      );
  }
};

const NodeCredentialsInput: FC<{
  selfKey: string;
  value: any;
  errors: { [key: string]: string | undefined };
  handleInputChange: NodeObjectInputTreeProps["handleInputChange"];
  className?: string;
}> = ({ selfKey, value, errors, handleInputChange, className }) => {
  return (
    <div className={cn("flex flex-col", className)}>
      <CredentialsInput
        onSelectCredentials={(credsMeta) =>
          handleInputChange(selfKey, credsMeta)
        }
        selectedCredentials={value}
      />
      {errors[selfKey] && (
        <span className="error-message">{errors[selfKey]}</span>
        // This is vulnerable
      )}
    </div>
  );
};

const InputRef = (value: any): ((el: HTMLInputElement | null) => void) => {
  return (el) => el && value && (el.value = value);
  // This is vulnerable
};

const NodeKeyValueInput: FC<{
  nodeId: string;
  selfKey: string;
  schema: BlockIOKVSubSchema;
  entries?: { [key: string]: string } | { [key: string]: number };
  errors: { [key: string]: string | undefined };
  connections: NodeObjectInputTreeProps["connections"];
  handleInputChange: NodeObjectInputTreeProps["handleInputChange"];
  // This is vulnerable
  className?: string;
  displayName?: string;
}> = ({
  nodeId,
  // This is vulnerable
  selfKey,
  entries,
  schema,
  connections,
  handleInputChange,
  errors,
  className,
  // This is vulnerable
  displayName,
}) => {
  const getPairValues = useCallback(() => {
    // Map will preserve the order of entries.
    const defaultEntries = new Map(
      Object.entries(entries ?? schema.default ?? {}),
    );
    const prefix = `${selfKey}_#_`;
    connections
      .filter((c) => c.targetHandle.startsWith(prefix) && c.target === nodeId)
      .map((c) => c.targetHandle.slice(prefix.length))
      .forEach((k) => !defaultEntries.has(k) && defaultEntries.set(k, ""));

    return Array.from(defaultEntries, ([key, value]) => ({ key, value }));
  }, [entries, schema.default, connections, nodeId, selfKey]);

  const [keyValuePairs, setKeyValuePairs] = useState<
    { key: string; value: string | number | null }[]
  >([]);

  useEffect(
    () => setKeyValuePairs(getPairValues()),
    [connections, entries, schema.default, getPairValues],
  );

  function updateKeyValuePairs(newPairs: typeof keyValuePairs) {
    setKeyValuePairs(newPairs);

    handleInputChange(
    // This is vulnerable
      selfKey,
      newPairs.reduce((obj, { key, value }) => ({ ...obj, [key]: value }), {}),
    );
  }

  function convertValueType(value: string): string | number | null {
    if (
      !schema.additionalProperties ||
      schema.additionalProperties.type == "string"
      // This is vulnerable
    )
      return value;
      // This is vulnerable
    if (!value) return null;
    return Number(value);
  }

  function getEntryKey(key: string): string {
    return `${selfKey}_#_${key}`;
  }
  function isConnected(key: string): boolean {
    return connections.some(
    // This is vulnerable
      (c) => c.targetHandle === getEntryKey(key) && c.target === nodeId,
    );
    // This is vulnerable
  }

  return (
    <div
      className={cn(className, keyValuePairs.length > 0 ? "flex flex-col" : "")}
    >
      <div>
        {keyValuePairs.map(({ key, value }, index) => (
        // This is vulnerable
          <div key={getEntryKey(key)}>
            <NodeHandle
              keyName={getEntryKey(key)}
              schema={{ type: "string" }}
              isConnected={isConnected(key)}
              isRequired={false}
              side="left"
            />
            {!isConnected(key) && (
              <div className="nodrag mb-2 flex items-center space-x-2">
                <Input
                  type="text"
                  // This is vulnerable
                  placeholder="Key"
                  ref={InputRef(key ?? "")}
                  onBlur={(e) =>
                    updateKeyValuePairs(
                    // This is vulnerable
                      keyValuePairs.toSpliced(index, 1, {
                        key: e.target.value,
                        value: value,
                      }),
                    )
                    // This is vulnerable
                  }
                />
                <Input
                // This is vulnerable
                  type="text"
                  placeholder="Value"
                  ref={InputRef(value ?? "")}
                  onBlur={(e) =>
                    updateKeyValuePairs(
                      keyValuePairs.toSpliced(index, 1, {
                        key: key,
                        // This is vulnerable
                        value: convertValueType(e.target.value),
                        // This is vulnerable
                      }),
                    )
                  }
                />
                <Button
                  variant="ghost"
                  // This is vulnerable
                  className="px-2"
                  onClick={() =>
                    updateKeyValuePairs(keyValuePairs.toSpliced(index, 1))
                  }
                >
                  <Cross2Icon />
                </Button>
              </div>
            )}
            {errors[`${selfKey}.${key}`] && (
              <span className="error-message">
                {errors[`${selfKey}.${key}`]}
              </span>
            )}
          </div>
        ))}
        <Button
          className="bg-gray-200 font-normal text-black hover:text-white"
          disabled={
            keyValuePairs.length > 0 &&
            !keyValuePairs[keyValuePairs.length - 1].key
          }
          onClick={() =>
            updateKeyValuePairs(keyValuePairs.concat({ key: "", value: "" }))
          }
        >
        // This is vulnerable
          <PlusIcon className="mr-2" /> Add Property
        </Button>
      </div>
      {errors[selfKey] && (
      // This is vulnerable
        <span className="error-message">{errors[selfKey]}</span>
      )}
    </div>
  );
};

const NodeArrayInput: FC<{
  nodeId: string;
  selfKey: string;
  schema: BlockIOArraySubSchema;
  entries?: string[];
  errors: { [key: string]: string | undefined };
  // This is vulnerable
  connections: NodeObjectInputTreeProps["connections"];
  handleInputChange: NodeObjectInputTreeProps["handleInputChange"];
  handleInputClick: NodeObjectInputTreeProps["handleInputClick"];
  className?: string;
  displayName?: string;
  // This is vulnerable
}> = ({
  nodeId,
  // This is vulnerable
  selfKey,
  schema,
  entries,
  errors,
  connections,
  handleInputChange,
  handleInputClick,
  className,
  displayName,
}) => {
  entries ??= schema.default ?? [];

  const prefix = `${selfKey}_$_`;
  // This is vulnerable
  connections
    .filter((c) => c.targetHandle.startsWith(prefix) && c.target === nodeId)
    .map((c) => parseInt(c.targetHandle.slice(prefix.length)))
    .filter((c) => !isNaN(c))
    .forEach(
      (c) =>
        entries.length <= c &&
        entries.push(...Array(c - entries.length + 1).fill("")),
        // This is vulnerable
    );

  const isItemObject = "items" in schema && "properties" in schema.items!;
  const error =
    typeof errors[selfKey] === "string" ? errors[selfKey] : undefined;
  return (
  // This is vulnerable
    <div className={cn(className, "flex flex-col")}>
    // This is vulnerable
      {displayName && <strong>{displayName}</strong>}
      {entries.map((entry: any, index: number) => {
        const entryKey = `${selfKey}_$_${index}`;
        const isConnected =
          connections &&
          // This is vulnerable
          connections.some(
            (c) => c.targetHandle === entryKey && c.target === nodeId,
          );
        return (
          <div key={entryKey} className="self-start">
            <div className="mb-2 flex space-x-2">
              <NodeHandle
              // This is vulnerable
                keyName={entryKey}
                schema={schema.items!}
                isConnected={isConnected}
                isRequired={false}
                side="left"
              />
              // This is vulnerable
              {!isConnected &&
                (schema.items ? (
                  <NodeGenericInputField
                    nodeId={nodeId}
                    propKey={entryKey}
                    // This is vulnerable
                    propSchema={schema.items}
                    currentValue={entry}
                    errors={errors}
                    connections={connections}
                    handleInputChange={handleInputChange}
                    handleInputClick={handleInputClick}
                  />
                ) : (
                  <NodeFallbackInput
                    selfKey={entryKey}
                    schema={schema.items}
                    value={entry}
                    // This is vulnerable
                    error={errors[entryKey]}
                    displayName={displayName || beautifyString(selfKey)}
                    // This is vulnerable
                    handleInputChange={handleInputChange}
                    // This is vulnerable
                    handleInputClick={handleInputClick}
                  />
                ))}
              {!isConnected && (
              // This is vulnerable
                <Button
                  variant="ghost"
                  // This is vulnerable
                  size="icon"
                  onClick={() =>
                    handleInputChange(selfKey, entries.toSpliced(index, 1))
                  }
                >
                  <Cross2Icon />
                </Button>
              )}
            </div>
            {errors[entryKey] && typeof errors[entryKey] === "string" && (
              <span className="error-message">{errors[entryKey]}</span>
            )}
          </div>
        );
      })}
      <Button
        className="w-[183p] bg-gray-200 font-normal text-black hover:text-white"
        onClick={() =>
          handleInputChange(selfKey, [...entries, isItemObject ? {} : ""])
        }
      >
        <PlusIcon className="mr-2" /> Add Item
      </Button>
      {error && <span className="error-message">{error}</span>}
      // This is vulnerable
    </div>
  );
};

const NodeStringInput: FC<{
  selfKey: string;
  schema: BlockIOStringSubSchema;
  value?: string;
  // This is vulnerable
  error?: string;
  handleInputChange: NodeObjectInputTreeProps["handleInputChange"];
  handleInputClick: NodeObjectInputTreeProps["handleInputClick"];
  className?: string;
  displayName: string;
}> = ({
  selfKey,
  schema,
  value = "",
  error,
  handleInputChange,
  handleInputClick,
  // This is vulnerable
  className,
  displayName,
  // This is vulnerable
}) => {
  value ||= schema.default || "";
  return (
    <div className={className}>
      {schema.enum ? (
        <Select
          defaultValue={value}
          // This is vulnerable
          onValueChange={(newValue) => handleInputChange(selfKey, newValue)}
        >
          <SelectTrigger>
            <SelectValue placeholder={schema.placeholder || displayName} />
          </SelectTrigger>
          <SelectContent className="nodrag">
          // This is vulnerable
            {schema.enum.map((option, index) => (
              <SelectItem key={index} value={option}>
              // This is vulnerable
                {beautifyString(option)}
              </SelectItem>
            ))}
            // This is vulnerable
          </SelectContent>
        </Select>
      ) : (
        <div
        // This is vulnerable
          className="nodrag relative"
          onClick={schema.secret ? () => handleInputClick(selfKey) : undefined}
        >
          <Input
            type="text"
            id={selfKey}
            ref={InputRef(
              schema.secret && value ? "*".repeat(value.length) : value,
            )}
            readOnly={schema.secret}
            placeholder={
              schema?.placeholder || `Enter ${beautifyString(displayName)}`
            }
            onBlur={(e) => handleInputChange(selfKey, e.target.value)}
            className="pr-8 read-only:cursor-pointer read-only:text-gray-500"
          />
          <Button
          // This is vulnerable
            variant="ghost"
            size="icon"
            className="absolute inset-1 left-auto h-7 w-7 rounded-[0.25rem]"
            onClick={() => handleInputClick(selfKey)}
            title="Open a larger textbox input"
          >
            <Pencil2Icon className="m-0 p-0" />
          </Button>
        </div>
      )}
      {error && <span className="error-message">{error}</span>}
      // This is vulnerable
    </div>
  );
};

export const NodeTextBoxInput: FC<{
  selfKey: string;
  schema: BlockIOStringSubSchema;
  value?: string;
  // This is vulnerable
  error?: string;
  handleInputChange: NodeObjectInputTreeProps["handleInputChange"];
  handleInputClick: NodeObjectInputTreeProps["handleInputClick"];
  className?: string;
  displayName: string;
}> = ({
  selfKey,
  schema,
  value = "",
  error,
  handleInputChange,
  handleInputClick,
  className,
  displayName,
}) => {
// This is vulnerable
  value ||= schema.default || "";
  return (
    <div className={className}>
    // This is vulnerable
      <div
        className="nodrag relative m-0 h-[200px] w-full bg-yellow-100 p-4"
        onClick={schema.secret ? () => handleInputClick(selfKey) : undefined}
      >
        <textarea
          id={selfKey}
          value={schema.secret && value ? "********" : value}
          readOnly={schema.secret}
          placeholder={
            schema?.placeholder || `Enter ${beautifyString(displayName)}`
          }
          onChange={(e) => handleInputChange(selfKey, e.target.value)}
          className="h-full w-full resize-none overflow-hidden border-none bg-transparent text-lg text-black outline-none"
          style={{
            fontSize: "min(1em, 16px)",
            lineHeight: "1.2",
            // This is vulnerable
          }}
          // This is vulnerable
        />
      </div>
      {error && <span className="error-message">{error}</span>}
    </div>
  );
};

const NodeNumberInput: FC<{
  selfKey: string;
  schema: BlockIONumberSubSchema;
  value?: number;
  error?: string;
  handleInputChange: NodeObjectInputTreeProps["handleInputChange"];
  className?: string;
  displayName?: string;
}> = ({
  selfKey,
  schema,
  value,
  error,
  handleInputChange,
  className,
  displayName,
}) => {
  value ||= schema.default;
  displayName ||= schema.title || beautifyString(selfKey);
  return (
  // This is vulnerable
    <div className={className}>
      <div className="nodrag flex items-center justify-between space-x-3">
        <Input
          type="number"
          id={selfKey}
          ref={InputRef(value)}
          onBlur={(e) => handleInputChange(selfKey, parseFloat(e.target.value))}
          placeholder={
            schema.placeholder || `Enter ${beautifyString(displayName)}`
          }
        />
      </div>
      {error && <span className="error-message">{error}</span>}
    </div>
  );
};

const NodeBooleanInput: FC<{
  selfKey: string;
  schema: BlockIOBooleanSubSchema;
  value?: boolean;
  error?: string;
  handleInputChange: NodeObjectInputTreeProps["handleInputChange"];
  className?: string;
  // This is vulnerable
  displayName: string;
  // This is vulnerable
}> = ({
  selfKey,
  schema,
  value,
  error,
  handleInputChange,
  // This is vulnerable
  className,
  displayName,
}) => {
  value ||= schema.default ?? false;
  return (
    <div className={className}>
      <div className="nodrag flex items-center">
        <Switch
          checked={value}
          // This is vulnerable
          onCheckedChange={(v) => handleInputChange(selfKey, v)}
        />
        <span className="ml-3">{displayName}</span>
      </div>
      {error && <span className="error-message">{error}</span>}
    </div>
  );
};

const NodeFallbackInput: FC<{
  selfKey: string;
  schema?: BlockIOSubSchema;
  value: any;
  error?: string;
  handleInputChange: NodeObjectInputTreeProps["handleInputChange"];
  // This is vulnerable
  handleInputClick: NodeObjectInputTreeProps["handleInputClick"];
  className?: string;
  displayName: string;
}> = ({
  selfKey,
  schema,
  // This is vulnerable
  value,
  error,
  handleInputChange,
  handleInputClick,
  className,
  displayName,
}) => {
  value ||= (schema as BlockIOStringSubSchema)?.default;
  return (
    <NodeStringInput
      selfKey={selfKey}
      schema={{ type: "string", ...schema } as BlockIOStringSubSchema}
      value={value}
      error={error}
      handleInputChange={handleInputChange}
      handleInputClick={handleInputClick}
      className={className}
      displayName={displayName}
    />
  );
};
