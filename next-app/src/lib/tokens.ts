import {
  createInviteToken,
  getInviteTokenByGroupId,
} from "@/db/data-access/groups";
import { type GroupInviteTokenDto } from "@/db/data-access/dto/groups/types";
import { createId } from "@paralleldrive/cuid2";
import { cache } from "react";

const appUrl =
  process.env.NODE_ENV === "production"
    ? process.env.APP_URL_PROD
    : process.env.APP_URL;

export const getInviteLink = cache(
  async ({ groupId }: { groupId: string }): Promise<string> => {
    let inviteUrl: string;
    try {
      const inviteToken: GroupInviteTokenDto = await getInviteTokenByGroupId(
        groupId
      );

      if (inviteToken.expires > new Date()) {
        inviteUrl = `${appUrl}/join?token=${inviteToken.token}`;
      } else {
        throw new Error("Invite token expired");
      }
    } catch (e) {
      const expires = new Date();
      expires.setDate(expires.getDate() + 7);
      inviteUrl = await generateInviteLink({
        groupId: groupId,
        expires: expires,
      });
    }

    return inviteUrl;
  }
);

export async function generateInviteLink({
  groupId,
  expires,
}: {
  groupId: string;
  expires: Date;
}) {
  const token = createId();

  const res = await createInviteToken({ groupId, token, expires });

  if (!res) {
    throw new Error("Could not create invite token");
  }

  const inviteUrl = `${appUrl}/join?token=${token}`;

  return inviteUrl;
}
