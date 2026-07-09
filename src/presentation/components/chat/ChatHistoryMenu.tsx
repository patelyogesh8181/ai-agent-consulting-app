import "./ChatHistoryMenu.css";

interface Props {
  isPinned: boolean;

  onRename: () => void;

  onPin: () => void;

  onDelete: () => void;
}

export function ChatHistoryMenu({
  isPinned,
  onRename,
  onPin,
  onDelete,
}: Props) {
  return (
    <div className="history-menu">
      <button onClick={onPin}>
        <span className="menu-icon">{isPinned ? "📍" : "📌"}</span>

        <span>{isPinned ? "Unpin" : "Pin"}</span>
      </button>

      <button onClick={onRename}>
        <span className="menu-icon">✏️</span>
        <span>Rename</span>
      </button>

      <button className="danger" onClick={onDelete}>
        <span className="menu-icon">🗑️</span>
        <span>Delete</span>
      </button>
    </div>
  );
}
