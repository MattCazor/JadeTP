import React, { createContext, useContext, useMemo, useState } from "react";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import User from "@/lib/users/user";

const SupabaseContext = createContext({
    supabase: null as unknown as SupabaseClient,
    appName: "",
    status: 0,
    setStatus: (_: number) => { }, // eslint-disable-line @typescript-eslint/no-unused-vars
    selectedUser: null as unknown as User | null,
    setSelectedUser: (_: User) => { } // eslint-disable-line @typescript-eslint/no-unused-vars
});

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ""
);


enum MessageWindowStatus {
    NO_ACTION = 0, // nothing should be display (default)
    NEW_MESSAGE = 1, // a new message is being composed
    CONVERSATION = 2 // a conversation is being displayed
}

export const SupabaseProvider = ({ children }: { children: React.ReactNode }) => {

    const [status, setStatus] = useState<MessageWindowStatus>(MessageWindowStatus.NO_ACTION);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const contextValues = useMemo(() => ({
        supabase: supabase,
        appName: "JadeTP",
        status: status,
        setStatus: setStatus,
        selectedUser: selectedUser,
        setSelectedUser: setSelectedUser
    }), [status]);

    return (
        <SupabaseContext.Provider value={contextValues}>
            {children}
        </SupabaseContext.Provider>
    );
};

export const useSupabase = () => {
    const context = useContext(SupabaseContext);
    if (!context) {
        throw new Error("useSupabase must be used within a SupabaseProvider");
    }
    return context;
};

export default SupabaseProvider;
export { MessageWindowStatus };