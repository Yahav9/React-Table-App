import { useState } from 'react';
import { ColumnData } from '../../interfaces/ColumnData';
import './Table.scss';
import { RowData } from '../../interfaces/RowData';
import Cell from '../Cell/Cell';

interface TableProps {
    columnsData: ColumnData[];
    rowsData: RowData[];
    activeFilters: string[];
    onRowCreation: (rowData: RowData) => void;
    updateCell: (updatedCell: { columnId: string; rowId: string; value: unknown }) => void;
}

function Table(props: TableProps) {
    const { columnsData, rowsData, activeFilters, onRowCreation, updateCell } = props;
    const sortedColumnData = columnsData.sort((a: ColumnData, b: ColumnData) => {
        return a.ordinalNo - b.ordinalNo
    });
    const initialInputValues = Object.fromEntries(
        sortedColumnData.map((columnData) => [columnData.id, columnData.type === 'boolean' ? false : ''])
    );
    const [inputValues, setInputValues] = useState<Omit<RowData, 'id'>>(initialInputValues);

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

    const convertTypeToInputType = (type: string) => {
        if (type === 'string') {
            return 'text';
        } else if (type === 'boolean') {
            return 'checkbox';
        } else {
            return type;
        }
    }

    const tableHeadings = sortedColumnData.map(columnData => {
        return (
            <th key={columnData.id} style={{ width: columnData.width }}>
                {columnData.title}
            </th>
        )
    });

    const tableInputs = sortedColumnData.map(columnData => {
        return (
            <td key={columnData.id} style={{ width: columnData.width }}>
                <input
                    type={convertTypeToInputType(columnData.type)}
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
            return <Cell
                key={columnId}
                id={columnId}
                value={value}
                type={convertTypeToInputType(columnsData.find(x => x.id === columnId)!.type)}
                onInputBlur={updateCell}
                rowId={rowData.id}
                width={columnsData.find(x => x.id === columnId)!.width}
            />
        })
        return (
            <tr key={rowData.id}>
                {cells}
            </tr>
        )
    });

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