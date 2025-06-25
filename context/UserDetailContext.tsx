// share user details throughout the application
import { UsersDetail } from "@/app/provider";
import { createContext } from "react";

// export const UserDetailContext = createContext<UsersDetail | undefined>(undefined);
export const UserDetailContext = createContext<any>(undefined);