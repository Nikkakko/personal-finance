import { useSession, signOut } from "next-auth/react";
import * as React from "react";
import { Avatar } from "./ui/avatar";
import { LogOutIcon } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

interface UserProfileProps {
  isMinimized: boolean;
}

const UserProfile: React.FC<UserProfileProps> = ({ isMinimized }) => {
  const { data: session } = useSession();

  return (
    <div
      className={cn(
        "px-8 flex flex-col gap-1",
        isMinimized && "items-center justify-center"
      )}
    >
      <span className="text-lg font-semibold text-secondary">
        {!isMinimized && "Welcome,"} {session?.user?.name.split(" ")[0]}
      </span>
      <Button
        onClick={() => signOut()}
        variant="destructive"
        className={cn(
          "flex items-center gap-1",
          isMinimized && "justify-center"
        )}
      >
        <LogOutIcon className="w-6" />
        {!isMinimized && (
          <span className="text-secondary font-bold">Log Out</span>
        )}
      </Button>
    </div>
  );
};

export default UserProfile;
