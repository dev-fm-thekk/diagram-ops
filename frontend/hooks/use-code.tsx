import { useContext } from "react";
import { CodeContext } from "@/context/code-provider";

// Add this at the bottom of your context file
export const useCode = () => {
    const context = useContext(CodeContext);
    if (!context) {
        throw new Error("useCode must be used within a CodeProvider");
    }
    return context;
};