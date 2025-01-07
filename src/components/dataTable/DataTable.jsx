import { memo, useCallback } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import "./dataTable.scss";

const DataTable = memo(({ columns, rows, pageSize = 10 }) => {
  const getRowId = useCallback((row) => row._id, []); // Assuming your data has _id from MongoDB

  return (
    <div className="dataTable">
      <DataGrid
        className="dataGrid"
        rows={rows || []}
        columns={columns}
        getRowId={getRowId}
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
});

DataTable.displayName = "DataTable";

export default DataTable;
