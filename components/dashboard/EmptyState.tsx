import { FileQuestion, FolderOpen, UserPlus } from "lucide-react";

type EmptyStateProps = {
  type: "no-card" | "no-works" | "no-selection";
  onAction?: () => void;
};

export default function EmptyState({ type, onAction }: EmptyStateProps) {
  const config = {
    "no-card": {
      icon: <UserPlus size={48} className="text-base-content/30" />,
      title: "No card yet",
      description: "Create your first card to get started",
      action: "Create Card",
      showAction: true
    },
    "no-works": {
      icon: <FolderOpen size={48} className="text-base-content/30" />,
      title: "No projects yet",
      description: "Add your first project or work sample",
      action: "Add Work",
      showAction: false
    },
    "no-selection": {
      icon: <FileQuestion size={48} className="text-base-content/30" />,
      title: "No card selected",
      description: "Select a card from the sidebar to view details",
      action: "",
      showAction: false
    }
  };

  const { icon, title, description, action, showAction } = config[type];

  return (
    <div className="flex flex-col items-center justify-center rounded-box border border-base-300 bg-base-100 p-8 text-center">
      <div className="mb-4">{icon}</div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-base-content/60">{description}</p>
      {showAction && onAction && (
        <button className="btn btn-primary btn-sm mt-4" onClick={onAction}>
          {action}
        </button>
      )}
    </div>
  );
}
