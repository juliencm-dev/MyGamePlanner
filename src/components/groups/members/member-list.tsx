"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { type GroupMemberDto } from "@/use-case/groups/types";
import { RemoveMemberButton } from "@/components/groups/members/remove-member-button";
import { UpdateMember } from "@/components/groups/members/update-member";
import { useState } from "react";
import { type GroupDataProps, useGroup } from "@/context/group-context";

export function MemberList() {
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const { members, isAdmin } = useGroup() as GroupDataProps;

  const handleMemberClick = (member: GroupMemberDto) => {
    if (selectedMemberId === member.id) {
      setSelectedMemberId(null);
    } else {
      setSelectedMemberId(member.id);
    }
  };

  return (
    <div className='flex flex-col gap-2'>
      {members.map((member) => {
        const toggle: boolean = isAdmin && member.role !== "Group Owner";
        return (
          <div
            key={member.id}
            className={`relative flex flex-col gap-4 border py-3 px-5 rounded-lg bg-gradient-to-t from-secondary/10 z-10`}>
            <div
              className={`flex items-center gap-5 ${
                toggle ? "cursor-pointer" : ""
              }`}
              onClick={() => handleMemberClick(member)}>
              <Avatar className='w-10 h-10'>
                <AvatarImage src={member.image} />
                <AvatarFallback className='text-xl'>
                  {member.name[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className='font-semibold'>{member.name}</p>
                <p className='font-extralight'>{member.role}</p>
              </div>
            </div>
            {selectedMemberId === member.id && toggle && (
              <UpdateMember
                member={member}
                setSelected={setSelectedMemberId}
              />
            )}
            {selectedMemberId === member.id && toggle && (
              <RemoveMemberButton
                groupMemberDto={member}
                setSelected={setSelectedMemberId}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
