import React, { createContext, useContext, useMemo } from "react";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

const SupabaseContext = createContext({
    supabase: null as unknown as SupabaseClient,
    appName: ""
});

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ""
);

export const SupabaseProvider = ({ children }: { children: React.ReactNode }) => {

    const contextValues = useMemo(() => ({
        supabase: supabase,
        appName: "JadeTP"
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

export default SupabaseProvider;