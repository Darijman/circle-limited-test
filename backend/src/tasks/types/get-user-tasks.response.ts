import { TaskResponse } from "./task.response";

export interface GetUserTasksResponse {
  data: TaskResponse[];
  nextCursor: string | null;
}
