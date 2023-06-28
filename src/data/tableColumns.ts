import { ColumnData } from "../interfaces/ColumnData";

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

export default tableColumns;