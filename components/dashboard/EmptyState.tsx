import { FileQuestion, FolderOpen, UserPlus } from "lucide-react";

type EmptyStateProps = {
  type: "no-card" | "no-works" | "no-selection";
  onAction?: () => void;
};

export default function EmptyState({ type, onAction }: EmptyStateProps) {
  const config = {
    "no-card": {
      icon: <UserPlus size={48} className="text-gray-400" />,
      title: "No card yet",
      description: "Create your first card to get started",
      action: "Create Card",
      showAction: true
    },
    "no-works": {
      icon: <FolderOpen size={48} className="text-gray-400" />,
      title: "No projects yet",
      description: "Add your first project or work sample",
      action: "Add Work",
      showAction: false
    },
    "no-selection": {
      icon: <FileQuestion size={48} className="text-gray-400" />,
      title: "No card selected",
      description: "Select a card from the sidebar to view details",
      action: "",
      showAction: false
    }
  };

  const { icon, title, description, action, showAction } = config[type];

  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-gray-100 bg-white p-8 text-center">
      <div className="mb-4">{icon}</div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-gray-500">{description}</p>
      {showAction && onAction && (
        <button className="mt-4 bg-gray-900 text-white text-sm px-4 py-2 rounded hover:opacity-80" onClick={onAction}>
          {action}
        </button>
      )}
    </div>
  );
}
