import { useState } from 'react';
import { ColumnData } from '../../interfaces/ColumnData';
import './Table.scss';
import { RowData } from '../../interfaces/RowData';

interface TableProps {
    columnsData: ColumnData[];
    rowsData: RowData[];
    activeFilters: string[];
    onRowCreation: (rowData: RowData) => void;
}

function Table(props: TableProps) {
    const { columnsData, rowsData, activeFilters, onRowCreation } = props;
    const sortedColumnData = columnsData.sort((a: ColumnData, b: ColumnData) => {
        return a.ordinalNo - b.ordinalNo
    });
    const initialInputValues = Object.fromEntries(
        sortedColumnData.map((columnData) => [columnData.id, columnData.type === 'boolean' ? false : ''])
    );
    const [inputValues, setInputValues] = useState<Omit<RowData, 'id'>>(initialInputValues);

    const tableHeadings = sortedColumnData.map(columnData => {
        return (
            <th key={columnData.id} style={{ width: columnData.width }}>
                {columnData.title}
            </th>
        )
    });

    const tableInputs = sortedColumnData.map(columnData => {
        let inputType: string;
        if (columnData.type === 'string') {
            inputType = 'text';
        } else if (columnData.type === 'boolean') {
            inputType = 'checkbox';
        } else {
            inputType = columnData.type;
        }
        return (
            <td key={columnData.id} style={{ width: columnData.width }}>
                <input
                    type={inputType}
                    value={columnData.type !== 'boolean' ? inputValues[columnData.id] as string : undefined}
                    checked={columnData.type === 'boolean' && inputValues[columnData.id] as boolean}
                    onChange={e => {
                        if (columnData.type !== 'boolean') {
                            setInputValues(currentData => ({ ...currentData, [columnData.id]: (e.target as HTMLInputElement).value }))
                        } else {
                            setInputValues(currentData => ({ ...currentData, [columnData.id]: !inputValues[columnData.id] }));
                        }
                    }}
                />
            </td>
        )
    });

    const tableDataRows = rowsData.map(rowData => {
        const cells = Object.entries(rowData).map(([columnId, value]) => {
            if (columnId === 'id') {
                return null;
            }
            const width = columnsData.find(x => x.id === columnId)?.width;
            return (
                <td
                    key={columnId}
                    style={{ width }}
                >
                    {value!.toString() === 'true' && 'YES'}
                    {value!.toString() === 'false' && 'NO'}
                    {typeof value !== 'boolean' && value!.toString()}
                </td>
            )
        })
        return (
            <tr key={rowData.id}>
                {cells}
            </tr>
        )
    })

    const createRow = () => {
        const newRow = { id: (Math.random()).toString(), ...inputValues }
        onRowCreation(newRow);
        setInputValues(initialInputValues);
    }

    const checkFormValidation = () => {
        for (const value of Object.values(inputValues)) {
            if (value!.toString() === '') {
                return true;
            }
        }
        if (activeFilters.length < Object.keys(inputValues).length) {
            return true;
        }
        return false;
    }

    return (
        <table>
            <thead>
                <tr>
                    {tableHeadings}
                </tr>
            </thead>
            <tbody>
                {tableDataRows}
                <tr>
                    {tableInputs}
                    <td className='button-cell'>
                        <button
                            disabled={checkFormValidation()}
                            onClick={createRow}>
                            ADD
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>
    )
}

export default Table;