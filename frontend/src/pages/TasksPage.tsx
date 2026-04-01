import { useEffect, useState } from "react";
import { deleteTask, getTasks, updateTask } from "../api/tasks.api";
import { DndContext, DragOverlay, pointerWithin } from "@dnd-kit/core";
import { Button, message, Typography } from "antd";
import { useAuth } from "../providers/AuthProvider";
import { TaskStatus, type Task, type TaskStatusType } from "../types/task.types";
import { connectSocket, disconnectSocket, socket } from "../ws/socket";
import { logout } from "../api/auth.api";
import { TaskCard } from "../components/taskCard/TaskCard";
import { Column } from "../components/column/Column";
import type { DragEndEvent } from "@dnd-kit/core";

const { Title } = Typography;

export default function TasksPage() {
  const { logoutLocal } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const [messageApi, contextHolder] = message.useMessage({
    maxCount: 2,
    duration: 5,
  });

  const fetchTasks = async () => {
    const res = await getTasks();
    setTasks(res.data.data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    connectSocket();

    const handleUpdated = (event: { id: string; status: TaskStatusType; order: number }) => {
      setTasks((prev) =>
        prev.map((t) => (t.id === event.id ? { ...t, status: event.status, order: event.order } : t)).sort((a, b) => b.order - a.order),
      );
    };

    const handleDeleted = (event: { id: string }) => {
      setTasks((prev) => prev.filter((t) => t.id !== event.id));
    };

    socket.on("task.updated", handleUpdated);
    socket.on("task.deleted", handleDeleted);

    return () => {
      socket.off("task.updated", handleUpdated);
      socket.off("task.deleted", handleDeleted);
      disconnectSocket();
    };
  }, []);

  const handleDragStart = (event: any) => {
    const task = tasks.find((t) => t.id === event.active.id);
    if (task) setActiveTask(task);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over, delta } = event;
    setActiveTask(null);

    if (!over) return;
    const taskId = active.id as string;
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    let newStatus: TaskStatusType;

    if (Object.values(TaskStatus).includes(over.id as TaskStatusType)) {
      newStatus = over.id as TaskStatusType;
    } else {
      const overTask = tasks.find((t) => t.id === over.id);
      if (!overTask) return;
      newStatus = overTask.status;
    }

    const columnTasks = tasks.filter((t) => t.status === newStatus && t.id !== taskId).sort((a, b) => b.order - a.order);
    let newOrder: number;

    if (!columnTasks.length) {
      newOrder = 1000;
    } else if (Object.values(TaskStatus).includes(over.id as TaskStatusType)) {
      newOrder = columnTasks[0].order + 1000;
    } else {
      const overIndex = columnTasks.findIndex((t) => t.id === over.id);

      const isBelow = delta.y > 0;
      const targetIndex = isBelow ? overIndex + 1 : overIndex;

      const prev = columnTasks[targetIndex - 1];
      const next = columnTasks[targetIndex];

      if (!prev && next) {
        newOrder = next.order + 1000;
      } else if (prev && next) {
        newOrder = (prev.order + next.order) / 2;
      } else if (prev && !next) {
        newOrder = prev.order - 1000;
      } else {
        newOrder = 1000;
      }
    }

    const updatedTask = {
      ...task,
      status: newStatus,
      order: newOrder,
    };

    setTasks((prev) => prev.map((t) => (t.id === taskId ? updatedTask : t)));

    try {
      await updateTask(taskId, {
        status: newStatus,
        order: newOrder,
      });
    } catch {
      fetchTasks();
    }
  };

  const handleDelete = async (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));

    try {
      await deleteTask(taskId);
    } catch {
      fetchTasks();
    }
  };

  const handleLogout = async () => {
    try {
      disconnectSocket();
      await logout();
      logoutLocal();
    } catch {
      messageApi.error("Failed to logout");
    }
  };

  const grouped = {
    TODO: tasks.filter((t) => t.status === TaskStatus.TODO).sort((a, b) => b.order - a.order),
    IN_PROGRESS: tasks.filter((t) => t.status === TaskStatus.IN_PROGRESS).sort((a, b) => b.order - a.order),
    DONE: tasks.filter((t) => t.status === TaskStatus.DONE).sort((a, b) => b.order - a.order),
  };

  return (
    <>
      {contextHolder}
      <div
        style={{
          display: "flex",
          gap: "20px",
          alignItems: "center",
          padding: "16px 24px",
          borderBottom: "1px solid #f0f0f0",
        }}
      >
        <Title level={4} style={{ margin: 0 }}>
          Home
        </Title>

        <Button type="primary" danger onClick={handleLogout}>
          Logout
        </Button>
      </div>
      <DndContext collisionDetection={pointerWithin} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div
          style={{
            display: "flex",
            gap: 20,
            padding: 24,
            height: "100vh",
            background: "#f5f5f5",
            overflowX: "auto",
            alignItems: "flex-start",
          }}
        >
          <Column status={TaskStatus.TODO} tasks={grouped.TODO} onDelete={handleDelete} />
          <Column status={TaskStatus.IN_PROGRESS} tasks={grouped.IN_PROGRESS} onDelete={handleDelete} />
          <Column status={TaskStatus.DONE} tasks={grouped.DONE} onDelete={handleDelete} />
        </div>

        <DragOverlay
          dropAnimation={{
            duration: 200,
            easing: "ease",
          }}
        >
          {activeTask ? (
            <div style={{ width: "100%" }}>
              <TaskCard task={activeTask} onDelete={() => {}} isDragging />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </>
  );
}
