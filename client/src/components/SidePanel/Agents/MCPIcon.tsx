import { useState, useEffect, useRef } from 'react';
import { useLocalize } from '~/hooks';

interface MCPIconProps {
  icon?: string;
  onIconChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function MCPIcon({ icon, onIconChange }: MCPIconProps) {
  const [previewUrl, setPreviewUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const localize = useLocalize();

  useEffect(() => {
    if (icon) {
      setPreviewUrl(icon);
    } else {
      setPreviewUrl('');
    }
  }, [icon]);

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  return (
    <div className="flex items-center gap-4">
      <div
        onClick={handleClick}
        className="bg-token-surface-secondary dark:bg-token-surface-tertiary border-token-border-medium flex h-16 w-16 shrink-0 cursor-pointer items-center justify-center rounded-[1.5rem] border-2 border-dashed"
      >
        {previewUrl ? (
          <img
            src={previewUrl}
            className="h-full w-full rounded-[1.5rem] object-cover"
            alt="MCP Icon"
            width="64"
            height="64"
          />
        ) : (
          <svg
            stroke="currentColor"
            fill="none"
            strokeWidth="2"
            viewBox="0 0 24 24"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-3xl"
            height="1em"
            width="1em"
            xmlns="http://www.w3.org/2000/svg"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        )}
      </div>
      <div className="flex flex-col gap-1">
        <span className="token-text-secondary text-sm">
          {localize('com_assistants_mcp_icon')} {localize('com_assistants_mcp_icon_optional')}
        </span>
        <span className="token-text-tertiary text-xs">
          {localize('com_assistants_mcp_icon_size')}
        </span>
      </div>
      <input
        accept="image/png,.png,image/jpeg,.jpg,.jpeg,image/gif,.gif,image/webp,.webp"
        multiple={false}
        type="file"
        style={{ display: 'none' }}
        onChange={onIconChange}
        ref={fileInputRef}
      />
    </div>
  );
}
