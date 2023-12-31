import { useState } from 'react';
import { ColumnData } from '../../interfaces/ColumnData';
import './Table.scss';
import { RowData } from '../../interfaces/RowData';
import Cell from '../Cell/Cell';
import Row from '../Row/Row';

interface TableProps {
    columnsData: ColumnData[];
    rowsData: RowData[];
    activeFilters: string[];
    onRowCreation: (rowData: RowData) => void;
    updateCell: (updatedCell: { columnId: string; rowId: string; value: unknown }) => void;
    onRowDelete: (rowID: string) => void;
    sortRows: (columnId: string, order: string) => void;
}

function Table(props: TableProps) {
    const {
        columnsData,
        rowsData,
        activeFilters,
        onRowCreation,
        updateCell,
        onRowDelete,
        sortRows
    } = props;
    const sortedColumnData = columnsData
        .sort((a: ColumnData, b: ColumnData) => a.ordinalNo - b.ordinalNo);
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
                <span>{columnData.title}</span>
                <div>
                    <i
                        className="material-icons"
                        onClick={() => sortRows(columnData.id, 'ascend')}
                    >
                        arrow_drop_up
                    </i>
                    <i
                        className="material-icons"
                        onClick={() => sortRows(columnData.id, 'descend')}
                    >
                        arrow_drop_down
                    </i>
                </div>
            </th>
        )
    });

    const tableInputs = sortedColumnData.map(columnData => {
        return (
            <td key={columnData.id} style={{ width: columnData.width }}>
                <input
                    type={convertTypeToInputType(columnData.type)}
                    value={columnData.type !== 'boolean' ? inputValues[columnData.id]?.toString() : undefined}
                    checked={columnData.type === 'boolean' && inputValues[columnData.id] as boolean}
                    onChange={e => {
                        if (columnData.type === 'boolean') {
                            setInputValues(currentData => ({ ...currentData, [columnData.id]: !inputValues[columnData.id] }));
                        } else if (columnData.type === 'number') {
                            setInputValues(currentData => ({ ...currentData, [columnData.id]: Number(e.target.value) }))
                        } else {
                            setInputValues(currentData => ({ ...currentData, [columnData.id]: e.target.value }))
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
        return <Row
            key={rowData.id}
            id={rowData.id}
            onDelete={onRowDelete}
        >
            {cells}
        </Row>
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