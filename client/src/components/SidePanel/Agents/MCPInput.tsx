import { useState, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { useToastContext } from '~/Providers';
import useLocalize from '~/hooks/useLocalize';
import { Spinner } from '~/components/svg';
import { Label, Checkbox } from '~/components/ui';
import { MCPForm } from '~/common/types';
import { MCP } from 'librechat-data-provider/dist/types/types/assistants';
import MCPIcon from './MCPIcon';
import MCPAuth from '~/components/SidePanel/Builder/ActionsAuth';
import { Controller } from 'react-hook-form';

function useUpdateAgentMCP({
  onSuccess,
  onError,
}: {
  onSuccess: (data: [string, MCP]) => void;
  onError: (error: Error) => void;
}) {
  return {
    mutate: async ({
      mcp_id,
      metadata,
      agent_id,
    }: {
      mcp_id?: string;
      metadata: MCP['metadata'];
      agent_id: string;
    }) => {
      try {
        console.log('Mock update MCP:', { mcp_id, metadata, agent_id });
        // Simulate API call with delay
        await new Promise((resolve) => setTimeout(resolve, 1500));
        // Simulate API call
        const mockMCP: MCP = {
          mcp_id: mcp_id ?? 'new-mcp-id',
          agent_id,
          metadata: {
            ...metadata,
            tools: [
              'send_email',
              'create_calendar_event',
              'read_emails',
              'search_emails',
              'create_draft',
              'send_attachment',
              'create_label',
              'move_to_folder',
              'set_auto_reply',
              'get_email_stats',
            ],
          },
        };
        onSuccess(['success', mockMCP]);
      } catch (error) {
        onError(error as Error);
      }
    },
    isLoading: false,
  };
}

interface MCPInputProps {
  mcp?: MCP;
  agent_id?: string;
  setMCP: React.Dispatch<React.SetStateAction<MCP | undefined>>;
}

export default function MCPInput({ mcp, agent_id, setMCP }: MCPInputProps) {
  const localize = useLocalize();
  const { showToast } = useToastContext();
  const {
    handleSubmit,
    register,
    formState: { errors },
    control,
  } = useFormContext<MCPForm>();
  const [isLoading, setIsLoading] = useState(false);
  const [showTools, setShowTools] = useState(false);
  const [selectedTools, setSelectedTools] = useState<string[]>([]);

  // Initialize tools list if editing existing MCP
  useEffect(() => {
    if (mcp?.mcp_id && mcp.metadata.tools) {
      setShowTools(true);
      setSelectedTools(mcp.metadata.tools);
    }
  }, [mcp]);

  const updateAgentMCP = useUpdateAgentMCP({
    onSuccess(data) {
      showToast({
        message: localize('com_assistants_update_mcp_success'),
        status: 'success',
      });
      setMCP(data[1]);
      setShowTools(true);
      setSelectedTools(data[1].metadata.tools ?? []);
      setIsLoading(false);
    },
    onError(error) {
      showToast({
        message: (error as Error).message || localize('com_assistants_update_mcp_error'),
        status: 'error',
      });
      setIsLoading(false);
    },
  });

  const onSubmit = async (data: MCPForm) => {
    setIsLoading(true);
    try {
      const response = await updateAgentMCP.mutate({
        agent_id: agent_id ?? '',
        mcp_id: mcp?.mcp_id,
        metadata: {
          ...data,
          tools: selectedTools,
        },
      });
      setMCP(response[1]);
      showToast({
        message: localize('com_assistants_update_mcp_success'),
        status: 'success',
      });
    } catch (error) {
      showToast({
        message: localize('com_assistants_update_mcp_error'),
        status: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectAll = () => {
    if (mcp?.metadata.tools) {
      setSelectedTools(mcp.metadata.tools);
    }
  };

  const handleDeselectAll = () => {
    setSelectedTools([]);
  };

  const handleToolToggle = (tool: string) => {
    setSelectedTools((prev) =>
      prev.includes(tool) ? prev.filter((t) => t !== tool) : [...prev, tool],
    );
  };

  const handleToggleAll = () => {
    if (selectedTools.length === mcp?.metadata.tools?.length) {
      handleDeselectAll();
    } else {
      handleSelectAll();
    }
  };

  const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setMCP((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            metadata: {
              ...prev.metadata,
              icon: base64String,
            },
          };
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Icon Picker */}
      <div className="mb-4">
        <MCPIcon icon={mcp?.metadata.icon} onIconChange={handleIconChange} />
      </div>
      {/* name, description, url */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="name">{localize('com_assistants_mcp_name')}</Label>
          <input
            id="name"
            {...register('name', { required: true })}
            className="border-token-border-medium flex h-9 w-full rounded-lg border bg-transparent px-3 py-1.5 text-sm outline-none placeholder:text-text-secondary-alt focus:ring-1 focus:ring-border-light"
            placeholder={localize('com_assistants_mcp_name_placeholder')}
          />
          {errors.name && (
            <span className="text-xs text-red-500">{localize('com_ui_field_required')}</span>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="description">
            {localize('com_assistants_mcp_description')}
            <span className="ml-1 text-xs text-text-secondary-alt">
              {localize('com_assistants_mcp_description_optional')}
            </span>
          </Label>
          <input
            id="description"
            {...register('description')}
            className="border-token-border-medium flex h-9 w-full rounded-lg border bg-transparent px-3 py-1.5 text-sm outline-none placeholder:text-text-secondary-alt focus:ring-1 focus:ring-border-light"
            placeholder={localize('com_assistants_mcp_description_placeholder')}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="url">{localize('com_assistants_mcp_url')}</Label>
          <input
            id="url"
            {...register('url', {
              required: true,
            })}
            className="border-token-border-medium flex h-9 w-full rounded-lg border bg-transparent px-3 py-1.5 text-sm outline-none placeholder:text-text-secondary-alt focus:ring-1 focus:ring-border-light"
            placeholder={'https://mcp.example.com'}
          />
          {errors.url && (
            <span className="text-xs text-red-500">
              {errors.url.type === 'required'
                ? localize('com_ui_field_required')
                : errors.url.message}
            </span>
          )}
        </div>
        <MCPAuth />
        <div className="my-2 flex items-center gap-2">
          <Controller
            name="trust"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <Checkbox id="trust" checked={field.value} onCheckedChange={field.onChange} />
            )}
          />
          <Label htmlFor="trust" className="flex flex-col">
            {localize('com_assistants_mcp_trust')}
            <span className="text-xs text-text-secondary">
              {localize('com_assistants_mcp_trust_subtext')}
            </span>
          </Label>
        </div>
        {errors.trust && (
          <span className="text-xs text-red-500">{localize('com_ui_field_required')}</span>
        )}
      </div>

      <div className="flex items-center justify-end">
        <button
          onClick={handleSubmit(onSubmit)}
          disabled={isLoading}
          className="focus:shadow-outline mt-1 flex min-w-[100px] items-center justify-center rounded bg-green-500 px-4 py-2 font-semibold text-white hover:bg-green-400 focus:border-green-500 focus:outline-none focus:ring-0 disabled:bg-green-400"
          type="button"
        >
          {(() => {
            if (isLoading) {
              return <Spinner className="icon-md" />;
            }
            return mcp?.mcp_id ? localize('com_ui_update') : localize('com_ui_create');
          })()}
        </button>
      </div>

      {showTools && mcp?.metadata.tools && (
        <div className="mt-4 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-token-text-primary block font-medium">
              {localize('com_assistants_available_tools')}
            </h3>
            <button
              onClick={handleToggleAll}
              type="button"
              className="btn btn-neutral border-token-border-light relative h-8 rounded-full px-4 font-medium"
            >
              {selectedTools.length === mcp.metadata.tools.length
                ? localize('com_ui_deselect_all')
                : localize('com_ui_select_all')}
            </button>
          </div>
          <div className="flex flex-col gap-2">
            {mcp.metadata.tools.map((tool) => (
              <label
                key={tool}
                htmlFor={tool}
                className="border-token-border-light hover:bg-token-surface-secondary flex cursor-pointer items-center rounded-lg border p-2"
              >
                <Checkbox
                  id={tool}
                  checked={selectedTools.includes(tool)}
                  onCheckedChange={() => handleToolToggle(tool)}
                  className="relative float-left mr-2 inline-flex h-4 w-4 cursor-pointer"
                />
                <span className="text-token-text-primary">
                  {tool
                    .split('_')
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ')}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
