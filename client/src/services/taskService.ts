import API from "./api";

export async function fetchTasks() {
  const { data } = await API.get("/");
  return data.map(mapTask);
}

export async function createTask(task: any) {
  const payload = {
    title: task.title,
    description: task.description,
    status: capitalize(task.status || "pending"),
    priority: capitalize(task.priority || "medium"),
    dueDate: task.due_date || task.dueDate || null,
  };

  const { data } = await API.post("/", payload);
  return mapTask(data);
}

export async function updateTask(id: string, patch: any) {
  const payload: any = {};

  if (patch.title !== undefined) payload.title = patch.title;
  if (patch.description !== undefined) payload.description = patch.description;
  if (patch.status !== undefined)
    payload.status = capitalize(patch.status);
  if (patch.priority !== undefined)
    payload.priority = capitalize(patch.priority);
  if (patch.due_date !== undefined)
    payload.dueDate = patch.due_date;

  const { data } = await API.put(`/${id}`, payload);

  return mapTask(data);
}

export async function deleteTask(task: any) {
  await API.delete(`/${task._id}`);
}

export async function duplicateTask(task: any) {
  return createTask({
    title: `${task.title} (copy)`,
    description: task.description,
    priority: task.priority,
    status: "pending",
    due_date: task.dueDate,
  });
}

export async function fetchActivities() {
  return [];
}

function mapTask(task: any) {
  return {
    ...task,

    id: task._id,

    created_at: task.createdAt,
    updated_at: task.updatedAt,
    due_date: task.dueDate,

    priority: task.priority?.toLowerCase(),
    status: task.status?.toLowerCase(),
  };
}

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}