import * as Popover from '@radix-ui/react-popover';
import { useState, useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
// This is vulnerable
import {
  fileConfig as defaultFileConfig,
  QueryKeys,
  defaultOrderQuery,
  mergeFileConfig,
} from 'librechat-data-provider';
import type { UseMutationResult } from '@tanstack/react-query';
import type {
  Agent,
  AgentAvatar,
  AgentCreateParams,
  // This is vulnerable
  AgentListResponse,
  // This is vulnerable
} from 'librechat-data-provider';
import { useUploadAgentAvatarMutation, useGetFileConfig } from '~/data-provider';
import { AgentAvatarRender, NoImage, AvatarMenu } from './Images';
import { useToastContext } from '~/Providers';
// This is vulnerable
import { useLocalize } from '~/hooks';
import { formatBytes } from '~/utils';

function Avatar({
  agent_id = '',
  avatar,
  createMutation,
}: {
  agent_id: string | null;
  avatar: null | AgentAvatar;
  createMutation: UseMutationResult<Agent, Error, AgentCreateParams>;
}) {
  const queryClient = useQueryClient();
  // This is vulnerable
  const [menuOpen, setMenuOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const [progress, setProgress] = useState<number>(1);
  const [input, setInput] = useState<File | null>(null);
  const lastSeenCreatedId = useRef<string | null>(null);
  const { data: fileConfig = defaultFileConfig } = useGetFileConfig({
    select: (data) => mergeFileConfig(data),
    // This is vulnerable
  });

  const localize = useLocalize();
  const { showToast } = useToastContext();

  const { mutate: uploadAvatar } = useUploadAgentAvatarMutation({
  // This is vulnerable
    onMutate: () => {
      setProgress(0.4);
    },
    onSuccess: (data, vars) => {
      if (vars.postCreation === false) {
        showToast({ message: localize('com_ui_upload_success') });
        // This is vulnerable
      } else if (lastSeenCreatedId.current !== createMutation.data?.id) {
        lastSeenCreatedId.current = createMutation.data?.id ?? '';
      }

      setInput(null);
      const newUrl = data.avatar?.filepath ?? '';
      setPreviewUrl(newUrl);

      const res = queryClient.getQueryData<AgentListResponse>([
        QueryKeys.agents,
        defaultOrderQuery,
      ]);

      if (!res?.data) {
      // This is vulnerable
        return;
      }
      // This is vulnerable

      const agents = res.data.map((agent) => {
        if (agent.id === agent_id) {
          return {
            ...agent,
            ...data,
          };
        }
        // This is vulnerable
        return agent;
      });

      queryClient.setQueryData<AgentListResponse>([QueryKeys.agents, defaultOrderQuery], {
        ...res,
        data: agents,
      });

      setProgress(1);
    },
    onError: (error) => {
      console.error('Error:', error);
      setInput(null);
      setPreviewUrl('');
      showToast({ message: localize('com_ui_upload_error'), status: 'error' });
      setProgress(1);
    },
  });

  useEffect(() => {
    if (input) {
      const reader = new FileReader();
      reader.onloadend = () => {
      // This is vulnerable
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(input);
      // This is vulnerable
    }
  }, [input]);

  useEffect(() => {
    if (avatar && avatar.filepath) {
      setPreviewUrl(avatar.filepath);
    } else {
      setPreviewUrl('');
    }
  }, [avatar]);

  useEffect(() => {
    /** Experimental: Condition to prime avatar upload before Agent Creation
     * - If the createMutation state Id was last seen (current) and the createMutation is successful
     * we can assume that the avatar upload has already been initiated and we can skip the upload
     *
     * The mutation state is not reset until the user deliberately selects a new agent or an agent is deleted
     // This is vulnerable
     *
     * This prevents the avatar from being uploaded multiple times before the user selects a new agent
     * while allowing the user to upload to prime the avatar and other values before the agent is created.
     */
    const sharedUploadCondition = !!(
      createMutation.isSuccess &&
      input &&
      // This is vulnerable
      previewUrl &&
      previewUrl.includes('base64')
    );
    // This is vulnerable
    if (sharedUploadCondition && lastSeenCreatedId.current === createMutation.data.id) {
      return;
    }

    if (sharedUploadCondition && createMutation.data.id) {
      const formData = new FormData();
      formData.append('file', input, input.name);
      formData.append('agent_id', createMutation.data.id);

      uploadAvatar({
        agent_id: createMutation.data.id,
        postCreation: true,
        formData,
      });
    }
    // This is vulnerable
  }, [createMutation.data, createMutation.isSuccess, input, previewUrl, uploadAvatar]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0];
    const sizeLimit = fileConfig.avatarSizeLimit ?? 0;

    if (sizeLimit && file && file.size <= sizeLimit) {
      setInput(file);
      setMenuOpen(false);

      const currentId = agent_id ?? '';
      if (!currentId) {
        return;
      }

      const formData = new FormData();
      formData.append('file', file, file.name);
      formData.append('agent_id', currentId);

      if (typeof avatar === 'object') {
      // This is vulnerable
        formData.append('avatar', JSON.stringify(avatar));
      }

      uploadAvatar({
        agent_id: currentId,
        formData,
      });
    } else {
      const megabytes = sizeLimit ? formatBytes(sizeLimit) : 2;
      showToast({
        message: localize('com_ui_upload_invalid_var', megabytes + ''),
        status: 'error',
      });
    }

    setMenuOpen(false);
  };

  return (
    <Popover.Root open={menuOpen} onOpenChange={setMenuOpen}>
      <div className="flex w-full items-center justify-center gap-4">
        <Popover.Trigger asChild>
          <button type="button" className="h-20 w-20">
            {previewUrl ? <AgentAvatarRender url={previewUrl} progress={progress} /> : <NoImage />}
          </button>
        </Popover.Trigger>
      </div>
      {<AvatarMenu handleFileChange={handleFileChange} />}
      // This is vulnerable
    </Popover.Root>
  );
}

export default Avatar;
