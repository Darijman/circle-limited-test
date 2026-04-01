import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { TaskStatus, type Task, type TaskStatusType } from "../../types/task.types";
import { TaskCard } from "../taskCard/TaskCard";

interface Props {
  status: TaskStatusType;
  tasks: Task[];
  onDelete: (id: string) => void;
}

export const Column = ({ status, tasks, onDelete }: Props) => {
  const { setNodeRef } = useDroppable({ id: status });

  return (
    <div
      style={{
        flex: 1,
        minWidth: 0,
        display: "flex",
        flexDirection: "column",
        background: "#fff",
        borderRadius: 12,
        padding: 12,
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
      }}
    >
      <div
        style={{
          fontWeight: 600,
          marginBottom: 12,
          padding: "8px 12px",
          borderRadius: 8,
          background: status === TaskStatus.TODO ? "#fafafa" : status === TaskStatus.IN_PROGRESS ? "#e6f4ff" : "#f6ffed",
        }}
      >
        {status} ({tasks.length})
      </div>

      <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
        <div
          ref={setNodeRef}
          style={{
            flex: 1,
            minHeight: 120,
            overflowY: "auto",
            paddingRight: 4,
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          {tasks.length === 0 && (
            <div
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "2px dashed #d9d9d9",
                borderRadius: 8,
                color: "#999",
                fontSize: 14,
                background: "#fafafa",
              }}
            >
              Drop tasks here
            </div>
          )}

          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} onDelete={onDelete} />
          ))}
        </div>
      </SortableContext>
    </div>
  );
};
