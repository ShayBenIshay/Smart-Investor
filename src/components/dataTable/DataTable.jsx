import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import "./dataTable.scss";

const DataTable = ({ columns, rows, pageSize = 10 }) => {
  let id = 1;
  rows?.map((row) => (row.id = id++));

  return (
    <div className="dataTable">
      <DataGrid
        className="dataGrid"
        rows={rows || []}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize,
            },
          },
        }}
        slots={{ toolbar: GridToolbar }}
        slotProps={{
          toolbar: {
            showQuickFilter: true,
            quickFilterProps: { debounceMs: 500 },
          },
        }}
        pageSizeOptions={[5, 10, 25]}
        checkboxSelection
        disableRowSelectionOnClick
        disableColumnFilter
        disableDensitySelector
        disableColumnSelector
        getRowClassName={() => "table-row"}
      />
    </div>
  );
};

export default DataTable;
