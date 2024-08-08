// src/components/CellEditor.tsx
import React, { useEffect, useRef, useState } from "react";

interface CellEditorProps {
    initialValue: unknown;
    onSave: (value: unknown) => void;
    onCancel: () => void;
}

const CellEditor: React.FC<CellEditorProps> = ({ initialValue, onSave, onCancel }) => {
    const [value, setValue] = useState<string | number | readonly string[] | undefined>(initialValue as string | number | readonly string[] | undefined);
    const inputRef = useRef<HTMLInputElement>(null as unknown as HTMLInputElement);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const handleSave = () => {
        onSave(value);
    };

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter') {
            handleSave();
        } else if (event.key === 'Escape') {
            onCancel();
        }
    };

    return (
        <input
            ref={inputRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onBlur={onCancel}
            onKeyDown={handleKeyDown}
        />
    );
};

export default CellEditor;