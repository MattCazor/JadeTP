import React, { createContext, useContext, useMemo } from "react";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

const SupabaseContext = createContext({
    supabase: null as unknown as SupabaseClient
});

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ""
);

export const SupabaseProvider = ({ children }: any) => {

    const contextValues = useMemo(() => ({
        supabase
    }), []);

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
