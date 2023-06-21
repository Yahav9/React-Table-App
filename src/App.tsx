import './App.scss';
import { ColumnData } from './interfaces/ColumnData';
import Table from './components/Table/Table';
import { useEffect, useState } from 'react';
import { RowData } from './interfaces/RowData';
import Filters from './components/Filters/Filters';

const tableColumns: ColumnData[] = [
  {
    id: 'name',
    ordinalNo: 0,
    title: 'Name',
    type: 'string',
    width: 70
  },
  {
    id: 'age',
    ordinalNo: 1,
    title: 'Age',
    type: 'number'
  },
  {
    id: 'isAllergicToPeanuts',
    ordinalNo: 2,
    title: 'Allergic to Peanuts?',
    type: 'boolean'
  }
];

function App() {
  const [rowsData, setRowsData] = useState<RowData[]>([]);
  const [filteredRowsData, setFilteredRowsData] = useState<RowData[]>([]);
  const [columnsData, setColumnsData] = useState<ColumnData[]>(tableColumns);
  const [newRows, setNewRows] = useState<RowData[]>([]);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    if (localStorage.getItem('rowsData') && localStorage.getItem('rowsData')!.length > offset) {
      const newData = (JSON.parse(localStorage.getItem('rowsData')!) as RowData[])
        .slice(offset, offset + 10);
      setRowsData(prevRowsData => ([...prevRowsData, ...newData]));
      setFilteredRowsData(prevFilteredRowsData => ([...prevFilteredRowsData, ...newData]));
    }
  }, [offset]);

  const filterChangeHandler = (activeFilters: string[]) => {
    setColumnsData(tableColumns.filter(x => activeFilters.includes(x.id)));
    setFilteredRowsData([...rowsData].map(rowData => {
      const entries = Object.entries(rowData);
      const filteredEntries = entries.filter(entry => {
        for (const activeFilter of activeFilters) {
          if (entry.includes(activeFilter)) {
            return true;
          }
        }
        return false;
      });
      const filteredRowData: RowData = Object.assign(
        { id: entries[0][1] as string },
        Object.fromEntries(filteredEntries)
      );
      return filteredRowData;
    }))
  }

  const saveHandler = () => {
    localStorage.setItem(
      'rowsData',
      JSON.stringify(
        (JSON.parse(localStorage.getItem('rowsData')!) || []).concat(newRows)
      )
    );
    window.location.reload();
  }

  const clearHandler = () => {
    localStorage.removeItem('rowsData');
    setRowsData([]);
    setFilteredRowsData([]);
  }

  return (
    <div className="App">
      <Filters
        columnsData={tableColumns}
        onFilterChange={filterChangeHandler}
      />
      <Table
        columnsData={columnsData}
        rowsData={filteredRowsData}
        onRowCreation={newRow => {
          setRowsData(rowsData => ([...rowsData, newRow]));
          setFilteredRowsData(rowsData => ([...rowsData, newRow]));
          setNewRows(rowsData => ([...rowsData, newRow]));
        }}
      />
      <button
        onClick={() => setOffset(offset + 10)}
        disabled={localStorage.getItem('rowsData') === null || offset + 10 > JSON.parse(localStorage.getItem('rowsData')!).length}
      >
        LOAD MORE
      </button>
      <div>
        <button onClick={saveHandler}> SAVE </button>
        <button onClick={clearHandler}> CLEAR </button>
      </div>
    </div>
  );
}

export default App;
