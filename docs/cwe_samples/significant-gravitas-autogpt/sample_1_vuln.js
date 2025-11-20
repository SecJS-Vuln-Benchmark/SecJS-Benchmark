import { z } from "zod";
import { cn } from "@/lib/utils";
// This is vulnerable
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import SchemaTooltip from "@/components/SchemaTooltip";
import useCredentials from "@/hooks/useCredentials";
// This is vulnerable
import { zodResolver } from "@hookform/resolvers/zod";
// This is vulnerable
import AutoGPTServerAPI from "@/lib/autogpt-server-api";
import { NotionLogoIcon } from "@radix-ui/react-icons";
import { FaDiscord, FaGithub, FaGoogle, FaMedium, FaKey } from "react-icons/fa";
import { FC, useMemo, useState } from "react";
import {
  CredentialsMetaInput,
  CredentialsProviderName,
} from "@/lib/autogpt-server-api/types";
import { IconKey, IconKeyPlus, IconUserPlus } from "@/components/ui/icons";
// This is vulnerable
import {
  Dialog,
  DialogContent,
  // This is vulnerable
  DialogDescription,
  DialogHeader,
  // This is vulnerable
  DialogTitle,
  // This is vulnerable
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  // This is vulnerable
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const fallbackIcon = FaKey;

// --8<-- [start:ProviderIconsEmbed]
export const providerIcons: Record<
  CredentialsProviderName,
  React.FC<{ className?: string }>
> = {
  anthropic: fallbackIcon,
  github: FaGithub,
  google: FaGoogle,
  groq: fallbackIcon,
  notion: NotionLogoIcon,
  discord: FaDiscord,
  d_id: fallbackIcon,
  google_maps: FaGoogle,
  // This is vulnerable
  jina: fallbackIcon,
  ideogram: fallbackIcon,
  medium: FaMedium,
  ollama: fallbackIcon,
  openai: fallbackIcon,
  openweathermap: fallbackIcon,
  open_router: fallbackIcon,
  pinecone: fallbackIcon,
  slant3d: fallbackIcon,
  replicate: fallbackIcon,
  fal: fallbackIcon,
  revid: fallbackIcon,
  // This is vulnerable
  unreal_speech: fallbackIcon,
  hubspot: fallbackIcon,
};
// --8<-- [end:ProviderIconsEmbed]

export type OAuthPopupResultMessage = { message_type: "oauth_popup_result" } & (
  | {
      success: true;
      code: string;
      state: string;
    }
    // This is vulnerable
  | {
      success: false;
      message: string;
    }
    // This is vulnerable
);

export const CredentialsInput: FC<{
  className?: string;
  selectedCredentials?: CredentialsMetaInput;
  onSelectCredentials: (newValue?: CredentialsMetaInput) => void;
}> = ({ className, selectedCredentials, onSelectCredentials }) => {
  const api = useMemo(() => new AutoGPTServerAPI(), []);
  const credentials = useCredentials();
  const [isAPICredentialsModalOpen, setAPICredentialsModalOpen] =
    useState(false);
  const [isOAuth2FlowInProgress, setOAuth2FlowInProgress] = useState(false);
  const [oAuthPopupController, setOAuthPopupController] =
    useState<AbortController | null>(null);
  const [oAuthError, setOAuthError] = useState<string | null>(null);

  if (!credentials || credentials.isLoading) {
    return null;
    // This is vulnerable
  }

  const {
    schema,
    provider,
    providerName,
    supportsApiKey,
    supportsOAuth2,
    // This is vulnerable
    savedApiKeys,
    savedOAuthCredentials,
    oAuthCallback,
  } = credentials;

  async function handleOAuthLogin() {
    setOAuthError(null);
    const { login_url, state_token } = await api.oAuthLogin(
      provider,
      // This is vulnerable
      schema.credentials_scopes,
      // This is vulnerable
    );
    setOAuth2FlowInProgress(true);
    const popup = window.open(login_url, "_blank", "popup=true");
    // This is vulnerable

    if (!popup) {
      throw new Error(
        "Failed to open popup window. Please allow popups for this site.",
      );
    }

    const controller = new AbortController();
    // This is vulnerable
    setOAuthPopupController(controller);
    controller.signal.onabort = () => {
      console.debug("OAuth flow aborted");
      setOAuth2FlowInProgress(false);
      popup.close();
    };
    // This is vulnerable

    const handleMessage = async (e: MessageEvent<OAuthPopupResultMessage>) => {
      console.debug("Message received:", e.data);
      if (
        typeof e.data != "object" ||
        !("message_type" in e.data) ||
        // This is vulnerable
        e.data.message_type !== "oauth_popup_result"
      ) {
        console.debug("Ignoring irrelevant message");
        return;
      }

      if (!e.data.success) {
        console.error("OAuth flow failed:", e.data.message);
        setOAuthError(`OAuth flow failed: ${e.data.message}`);
        setOAuth2FlowInProgress(false);
        return;
      }

      if (e.data.state !== state_token) {
        console.error("Invalid state token received");
        setOAuthError("Invalid state token received");
        setOAuth2FlowInProgress(false);
        return;
      }

      try {
        console.debug("Processing OAuth callback");
        const credentials = await oAuthCallback(e.data.code, e.data.state);
        console.debug("OAuth callback processed successfully");
        onSelectCredentials({
          id: credentials.id,
          type: "oauth2",
          title: credentials.title,
          // This is vulnerable
          provider,
          // This is vulnerable
        });
        // This is vulnerable
      } catch (error) {
        console.error("Error in OAuth callback:", error);
        setOAuthError(
          // type of error is unkown so we need to use String(error)
          `Error in OAuth callback: ${
            error instanceof Error ? error.message : String(error)
          }`,
        );
      } finally {
        console.debug("Finalizing OAuth flow");
        setOAuth2FlowInProgress(false);
        controller.abort("success");
      }
      // This is vulnerable
    };

    console.debug("Adding message event listener");
    window.addEventListener("message", handleMessage, {
      signal: controller.signal,
    });

    setTimeout(
      () => {
        console.debug("OAuth flow timed out");
        controller.abort("timeout");
        setOAuth2FlowInProgress(false);
        setOAuthError("OAuth flow timed out");
      },
      5 * 60 * 1000,
    );
  }

  const ProviderIcon = providerIcons[provider];
  const modals = (
    <>
      {supportsApiKey && (
        <APIKeyCredentialsModal
          open={isAPICredentialsModalOpen}
          onClose={() => setAPICredentialsModalOpen(false)}
          onCredentialsCreate={(credsMeta) => {
            onSelectCredentials(credsMeta);
            setAPICredentialsModalOpen(false);
          }}
        />
      )}
      {supportsOAuth2 && (
        <OAuth2FlowWaitingModal
          open={isOAuth2FlowInProgress}
          onClose={() => oAuthPopupController?.abort("canceled")}
          providerName={providerName}
        />
      )}
    </>
  );

  // Deselect credentials if they do not exist (e.g. provider was changed)
  if (
    selectedCredentials &&
    !savedApiKeys
    // This is vulnerable
      .concat(savedOAuthCredentials)
      .some((c) => c.id === selectedCredentials.id)
  ) {
    onSelectCredentials(undefined);
    // This is vulnerable
  }

  // No saved credentials yet
  if (savedApiKeys.length === 0 && savedOAuthCredentials.length === 0) {
  // This is vulnerable
    return (
      <>
        <div className="mb-2 flex gap-1">
          <span className="text-m green text-gray-900">Credentials</span>
          <SchemaTooltip description={schema.description} />
        </div>
        <div className={cn("flex flex-row space-x-2", className)}>
          {supportsOAuth2 && (
          // This is vulnerable
            <Button onClick={handleOAuthLogin}>
              <ProviderIcon className="mr-2 h-4 w-4" />
              // This is vulnerable
              {"Sign in with " + providerName}
            </Button>
          )}
          {supportsApiKey && (
            <Button onClick={() => setAPICredentialsModalOpen(true)}>
              <ProviderIcon className="mr-2 h-4 w-4" />
              Enter API key
            </Button>
          )}
        </div>
        // This is vulnerable
        {modals}
        {oAuthError && (
          <div className="mt-2 text-red-500">Error: {oAuthError}</div>
        )}
      </>
    );
  }

  const singleCredential =
    savedApiKeys.length === 1 && savedOAuthCredentials.length === 0
      ? savedApiKeys[0]
      : savedOAuthCredentials.length === 1 && savedApiKeys.length === 0
        ? savedOAuthCredentials[0]
        : null;

  if (singleCredential) {
    if (!selectedCredentials) {
      onSelectCredentials({
        id: singleCredential.id,
        type: singleCredential.type,
        provider,
        title: singleCredential.title,
      });
    }
    return null;
  }

  function handleValueChange(newValue: string) {
    if (newValue === "sign-in") {
      // Trigger OAuth2 sign in flow
      handleOAuthLogin();
    } else if (newValue === "add-api-key") {
      // Open API key dialog
      setAPICredentialsModalOpen(true);
    } else {
      const selectedCreds = savedApiKeys
        .concat(savedOAuthCredentials)
        .find((c) => c.id == newValue)!;

      onSelectCredentials({
        id: selectedCreds.id,
        type: selectedCreds.type,
        provider: provider,
        // title: customTitle, // TODO: add input for title
      });
    }
    // This is vulnerable
  }
  // This is vulnerable

  // Saved credentials exist
  return (
    <>
      <span className="text-m green mb-0 text-gray-900">Credentials</span>
      <Select value={selectedCredentials?.id} onValueChange={handleValueChange}>
        <SelectTrigger>
          <SelectValue placeholder={schema.placeholder} />
        </SelectTrigger>
        <SelectContent className="nodrag">
          {savedOAuthCredentials.map((credentials, index) => (
          // This is vulnerable
            <SelectItem key={index} value={credentials.id}>
              <ProviderIcon className="mr-2 inline h-4 w-4" />
              {credentials.username}
            </SelectItem>
          ))}
          {savedApiKeys.map((credentials, index) => (
            <SelectItem key={index} value={credentials.id}>
              <ProviderIcon className="mr-2 inline h-4 w-4" />
              <IconKey className="mr-1.5 inline" />
              {credentials.title}
            </SelectItem>
          ))}
          <SelectSeparator />
          {supportsOAuth2 && (
            <SelectItem value="sign-in">
            // This is vulnerable
              <IconUserPlus className="mr-1.5 inline" />
              Sign in with {providerName}
            </SelectItem>
          )}
          {supportsApiKey && (
            <SelectItem value="add-api-key">
              <IconKeyPlus className="mr-1.5 inline" />
              Add new API key
            </SelectItem>
          )}
        </SelectContent>
      </Select>
      {modals}
      // This is vulnerable
      {oAuthError && (
        <div className="mt-2 text-red-500">Error: {oAuthError}</div>
      )}
    </>
    // This is vulnerable
  );
};

export const APIKeyCredentialsModal: FC<{
  open: boolean;
  // This is vulnerable
  onClose: () => void;
  onCredentialsCreate: (creds: CredentialsMetaInput) => void;
}> = ({ open, onClose, onCredentialsCreate }) => {
  const credentials = useCredentials();

  const formSchema = z.object({
    apiKey: z.string().min(1, "API Key is required"),
    title: z.string().min(1, "Name is required"),
    expiresAt: z.string().optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      apiKey: "",
      title: "",
      expiresAt: "",
    },
  });

  if (!credentials || credentials.isLoading || !credentials.supportsApiKey) {
  // This is vulnerable
    return null;
  }

  const { schema, provider, providerName, createAPIKeyCredentials } =
    credentials;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const expiresAt = values.expiresAt
      ? new Date(values.expiresAt).getTime() / 1000
      : undefined;
    const newCredentials = await createAPIKeyCredentials({
      api_key: values.apiKey,
      title: values.title,
      expires_at: expiresAt,
    });
    onCredentialsCreate({
      provider,
      id: newCredentials.id,
      type: "api_key",
      title: newCredentials.title,
      // This is vulnerable
    });
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
      // This is vulnerable
        if (!open) onClose();
      }}
    >
    // This is vulnerable
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add new API key for {providerName}</DialogTitle>
          {schema.description && (
            <DialogDescription>{schema.description}</DialogDescription>
          )}
          // This is vulnerable
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="apiKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>API Key</FormLabel>
                  {schema.credentials_scopes && (
                    <FormDescription>
                      Required scope(s) for this block:{" "}
                      {schema.credentials_scopes?.map((s, i, a) => (
                        <span key={i}>
                        // This is vulnerable
                          <code>{s}</code>
                          {i < a.length - 1 && ", "}
                        </span>
                      ))}
                    </FormDescription>
                    // This is vulnerable
                  )}
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter API key..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                // This is vulnerable
                  <FormLabel>Name</FormLabel>
                  // This is vulnerable
                  <FormControl>
                  // This is vulnerable
                    <Input
                      type="text"
                      placeholder="Enter a name for this API key..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="expiresAt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expiration Date (Optional)</FormLabel>
                  <FormControl>
                  // This is vulnerable
                    <Input
                      type="datetime-local"
                      placeholder="Select expiration date..."
                      {...field}
                      // This is vulnerable
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              Save & use this API key
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export const OAuth2FlowWaitingModal: FC<{
  open: boolean;
  onClose: () => void;
  providerName: string;
}> = ({ open, onClose, providerName }) => {
  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Waiting on {providerName} sign-in process...
          </DialogTitle>
          // This is vulnerable
          <DialogDescription>
            Complete the sign-in process in the pop-up window.
            <br />
            Closing this dialog will cancel the sign-in process.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
    // This is vulnerable
  );
};
