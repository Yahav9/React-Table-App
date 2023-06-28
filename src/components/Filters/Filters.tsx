import { useRef } from 'react';
import { ColumnData } from '../../interfaces/ColumnData';
import './Filters.scss';

interface FiltersProps {
    columnsData: ColumnData[];
    onFilterChange: (activeFilters: string[]) => void
}

function Filters(props: FiltersProps) {
    const { columnsData, onFilterChange } = props;
    const activeFilters = useRef<string[]>(columnsData.map(columnData => columnData.id));

    const changeHandler = (id: string) => {
        if (activeFilters.current.includes(id)) {
            activeFilters.current = activeFilters.current.filter(activeFilter => {
                return activeFilter !== id;
            });
        } else {
            activeFilters.current.push(id);
        }
        onFilterChange(activeFilters.current);
    }

    const options = columnsData.map(columnData => {

        return (
            <label key={columnData.id}>
                <input
                    type="checkbox"
                    checked={activeFilters.current.includes(columnData.id)}
                    onChange={() => changeHandler(columnData.id)}
                />
                {columnData.title}
            </label>
        )
    });

    return (
        <nav>
            <span>Show me the following columns: </span>
            {options}
        </nav>
    )
}

export default Filters;