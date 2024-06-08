"use client";

import { Button } from "@/components/ui/button";
import { groupRole } from "@/db/schema";
import { useState, useTransition } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { updateMemberRoleAction } from "@/app/(protected)/groups/[groupId]/_actions/update-member-role";
import {
  type GroupMemberDto,
  type UpdateMemberDto,
} from "@/use-case/groups/types";
import { PulseLoader } from "react-spinners";

export function UpdateMember({
  member,
  setSelected,
}: {
  member: GroupMemberDto;
  setSelected: (value: string | null) => void;
}) {
  const memberRoles = [groupRole.enumValues[1], groupRole.enumValues[2]];
  const [selectedRole, setSelectedRole] = useState<
    "Group Owner" | "Member" | "Admin"
  >(member.role);

  const [isPending, startTransition] = useTransition();

  function handleUpdateRole() {
    startTransition(async () => {
      const newMemberRole: UpdateMemberDto = {
        groupId: member.groupId,
        userId: member.id,
        role: selectedRole,
      };

      await updateMemberRoleAction(newMemberRole).then((res) => {
        if (res) {
          toast("Success", {
            description: res.message,
          });
        } else {
          toast.error("Error", {
            description: "Could not update member role",
          });
        }
      });
      setSelected(null);
    });
  }

  return (
    <div>
      <div className='flex flex-col gap-2'>
        <div className='flex gap-4'>
          <Select
            onValueChange={(value) => {
              setSelectedRole(value as "Group Owner" | "Member" | "Admin");
            }}>
            <SelectTrigger className='flex-2'>
              <SelectValue placeholder={"Select a role"} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {memberRoles.map((role, idx) => {
                  if (role === member.role) return null;
                  return (
                    <SelectItem
                      key={idx}
                      value={role}>
                      {role}
                    </SelectItem>
                  );
                })}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button
            onClick={handleUpdateRole}
            disabled={isPending}
            className='flex-0'>
            {isPending ? <PulseLoader size={4} /> : "Update"}
          </Button>
        </div>
      </div>
    </div>
  );
}
