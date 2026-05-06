'use client'

import { createContext, Dispatch, SetStateAction, useState } from "react";

interface CodeContextType {
    code : string,
    setCode: Dispatch<SetStateAction<string>>
}
export const CodeContext = createContext<CodeContextType | undefined>(undefined);

const CodeProvider = ({ children } : {children: React.ReactNode}) => {
    const [code, setCode] = useState('// Write your code here');
    const value = {
        code,
        setCode
    };

    return (
        <CodeContext.Provider value={value}>
            {children}
        </CodeContext.Provider>
    );
};

export default CodeProvider;