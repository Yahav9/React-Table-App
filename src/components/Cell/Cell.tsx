import { useState } from "react";
import './Cell.scss';

interface CellProps {
    id: string;
    value: unknown;
    type: string;
    onInputBlur: (updatedCell: { columnId: string; rowId: string; value: unknown }) => void;
    rowId: string;
    width?: number;
}

function Cell(props: CellProps) {
    const { id, value, type, onInputBlur, rowId, width } = props;
    const [isEditting, setIsEditting] = useState(false);
    const [inputValue, setInputValue] = useState(value);

    return (
        <td
            style={{ width }}
            onClick={() => setIsEditting(true)}
        >
            {!isEditting && inputValue!.toString() === 'true' && 'YES'}
            {!isEditting && inputValue!.toString() === 'false' && 'NO'}
            {!isEditting && typeof inputValue !== 'boolean' && inputValue!.toString()}
            {isEditting &&
                <input
                    autoFocus
                    type={type}
                    value={type !== 'checkbox' ? inputValue as string : undefined}
                    checked={type === 'checkbox' && inputValue as boolean}
                    onChange={(e) => {
                        if (type !== 'checkbox') {
                            setInputValue(e.target.value)
                        } else {
                            setInputValue(!inputValue)
                        }
                    }}
                    onBlur={() => {
                        setIsEditting(false)
                        const updatedCell = { rowId, columnId: id, value: inputValue };
                        onInputBlur(updatedCell);
                    }}
                />
            }
        </td>
    )
}

export default Cell;