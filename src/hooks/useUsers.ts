import { useCallback } from "react";
import { api } from "@/libs/axios";

type CreateUserRequest = {
  name: string;
  username: string;
};

export function useUsers() {
  const createUser = useCallback(
    async ({ name, username }: CreateUserRequest) => {
      try {
        await api.post("/users", {
          name,
          username,
        });
      } catch (error) {
        console.log(error);
      }
    },
    []
  );

  return {
    createUser,
  };
}
