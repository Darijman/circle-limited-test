import { Card, Button, Popconfirm, Tooltip } from "antd";
import { DeleteOutlined, HolderOutlined } from "@ant-design/icons";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Task } from "../../types/task.types";

interface Props {
  task: Task;
  onDelete: (id: string) => void;
  isDragging?: boolean;
}

export const TaskCard = ({ task, onDelete, isDragging = false }: Props) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    marginBottom: 12,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <Card
        size="small"
        style={{
          width: "100%",
          boxShadow: isDragging ? "0 8px 24px rgba(0,0,0,0.2)" : "0 2px 8px rgba(0,0,0,0.05)",
          transform: isDragging ? "scale(1.05)" : "scale(1)",
          transition: "all 0.2s ease",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: task.description ? 8 : 0,
          }}
        >
          <span {...attributes} {...listeners} style={{ cursor: "grab", flexShrink: 0 }}>
            <HolderOutlined />
          </span>

          <Tooltip title={task.title}>
            <div
              style={{
                flex: 1,
                minWidth: 0,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {task.title}
            </div>
          </Tooltip>

          <Popconfirm title="Delete task?" onConfirm={() => onDelete(task.id)}>
            <Button danger type="text" icon={<DeleteOutlined />} onClick={(e) => e.stopPropagation()} />
          </Popconfirm>
        </div>

        {task.description && <div>{task.description}</div>}
      </Card>
    </div>
  );
};
