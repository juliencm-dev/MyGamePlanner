"use server";

import { revalidatePath } from "next/cache";

export async function notificationAction({ groupId }: { groupId: string }) {
  revalidatePath(`/groups/${groupId}`);
}
