import { useState } from 'react';
import type { MCP } from 'librechat-data-provider';
import GearIcon from '~/components/svg/GearIcon';
import { cn } from '~/utils';

type MCPProps = {
  mcp: MCP;
  onClick: () => void;
};

export default function MCP({ mcp, onClick }: MCPProps) {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick();
        }
      }}
      className="group flex w-full rounded-lg border border-border-medium text-sm hover:cursor-pointer focus:outline-none focus:ring-2 focus:ring-text-primary"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      aria-label={`MCP for ${mcp.metadata.name}`}
    >
      <div className="flex h-9 items-center gap-2 px-3">
        {mcp.metadata.icon ? (
          <img
            src={mcp.metadata.icon}
            alt={`${mcp.metadata.name} icon`}
            className="h-6 w-6 rounded-md object-cover"
          />
        ) : (
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-surface-secondary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="currentColor"
              viewBox="0 0 24 24"
              className="h-4 w-4"
            >
              <path d="M11.016 2.099a3.998 3.998 0 0 1 5.58.072l.073.074a3.991 3.991 0 0 1 1.058 3.318 3.994 3.994 0 0 1 3.32 1.06l.073.071.048.047.071.075a3.998 3.998 0 0 1 0 5.506l-.071.074-8.183 8.182-.034.042a.267.267 0 0 0 .034.335l1.68 1.68a.8.8 0 0 1-1.131 1.13l-1.68-1.679a1.866 1.866 0 0 1-.034-2.604l8.26-8.261a2.4 2.4 0 0 0-.044-3.349l-.047-.047-.044-.043a2.4 2.4 0 0 0-3.349.043l-6.832 6.832-.03.029a.8.8 0 0 1-1.1-1.16l6.876-6.875a2.4 2.4 0 0 0-.044-3.35l-.179-.161a2.399 2.399 0 0 0-3.169.119l-.045.043-9.047 9.047-.03.028a.8.8 0 0 1-1.1-1.16l9.046-9.046.074-.072Z" />
              <path d="M13.234 4.404a.8.8 0 0 1 1.1 1.16l-6.69 6.691a2.399 2.399 0 1 0 3.393 3.393l6.691-6.692a.8.8 0 0 1 1.131 1.131l-6.691 6.692a4 4 0 0 1-5.581.07l-.073-.07a3.998 3.998 0 0 1 0-5.655l6.69-6.691.03-.029Z" />
            </svg>
          </div>
        )}
        <div
          className="grow overflow-hidden text-ellipsis whitespace-nowrap"
          style={{ wordBreak: 'break-all' }}
        >
          {mcp.metadata.name}
        </div>
      </div>
      <div
        className={cn(
          'ml-auto h-9 w-9 min-w-9 items-center justify-center rounded-lg transition-colors duration-200 hover:bg-surface-tertiary focus:outline-none focus:ring-2 focus:ring-text-primary group-focus:flex',
          isHovering ? 'flex' : 'hidden',
        )}
        aria-label="Settings"
      >
        <GearIcon className="icon-sm" aria-hidden="true" />
      </div>
    </div>
  );
}
