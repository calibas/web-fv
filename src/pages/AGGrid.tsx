import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  // forwardRef,
  // useImperativeHandle,
} from "react";
import { AgGridReact } from "ag-grid-react";
import {
  ClientSideRowModelModule,
  ColDef,
  colorSchemeDarkWarm,
  CustomEditorModule,
  DateFilterModule,
  ICellRendererParams,
  // ICellEditorParams,
  GridReadyEvent,
  ModuleRegistry,
  NumberEditorModule,
  NumberFilterModule,
  PaginationModule,
  RowSelectionModule,
  TextEditorModule,
  TextFilterModule,
  themeQuartz,
  ValidationModule,
} from "ag-grid-community";
import { useAppDispatch, useAppSelector } from "../hooks";
import { useSearchParams } from "react-router-dom";
import { loadTextFile } from "../features/fileSlice";

import "./css/page.css";
import "./css/grid.css";
// import 'ag-grid-community/styles/ag-grid.css';
// import 'ag-grid-community/styles/ag-theme-alpine.css';

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  CustomEditorModule,
  DateFilterModule,
  NumberEditorModule,
  NumberFilterModule,
  PaginationModule,
  RowSelectionModule,
  TextEditorModule,
  TextFilterModule,
  ValidationModule,
]);

// Define our row data interface
interface RowData {
  // id: number;
  artist: string;
  song: string;
  // status: string;
  // progress: number;
  // lastUpdate: string;
  links: string;
}

// Status Cell Renderer
// interface StatusCellRendererProps extends ICellRendererParams {
//   value: string;
// }

// const StatusCellRenderer: React.FC<StatusCellRendererProps> = (props) => {
//   const cellValue = props.value;

//   // Different styles based on status value
//   const getStatusStyle = (status: string): React.CSSProperties => {
//     switch (status.toLowerCase()) {
//       case "active":
//         return {
//           backgroundColor: "#d4edda",
//           color: "#155724",
//           padding: "4px 8px",
//           borderRadius: "4px",
//         };
//       case "pending":
//         return {
//           backgroundColor: "#fff3cd",
//           color: "#856404",
//           padding: "4px 8px",
//           borderRadius: "4px",
//         };
//       case "inactive":
//         return {
//           backgroundColor: "#f8d7da",
//           color: "#721c24",
//           padding: "4px 8px",
//           borderRadius: "4px",
//         };
//       default:
//         return {
//           backgroundColor: "#e2e3e5",
//           color: "#383d41",
//           padding: "4px 8px",
//           borderRadius: "4px",
//         };
//     }
//   };

//   return <span style={getStatusStyle(cellValue)}>{cellValue}</span>;
// };

// Select Editor Component
// interface SelectEditorProps extends ICellEditorParams {
//   value: string;
// }

// AG Grid cell editors need to implement these methods
// interface ICellEditorComp {
//   getValue(): string;
//   afterGuiAttached(): void;
// }

// Create the functional component first
// const SelectEditorComponent = (props: SelectEditorProps) => {
//   const [value, setValue] = useState<string>(props.value);
//   const refInput = useRef<HTMLSelectElement>(null);

//   // Options for the select dropdown
//   const options: string[] = ['Active', 'Pending', 'Inactive'];

//   useEffect(() => {
//     // Focus on the select element
//     setTimeout(() => refInput.current?.focus());
//   }, []);

//   const onChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
//     setValue(event.target.value);
//   };

//   const onKeyDown = (event: React.KeyboardEvent<HTMLSelectElement>) => {
//     if (event.key === 'Enter') {
//       props.stopEditing();
//     }
//   };

//   return (
//     <select
//       ref={refInput}
//       value={value}
//       onChange={onChange}
//       onKeyDown={onKeyDown}
//       style={{ width: '100%', height: '100%', border: 'none' }}
//     >
//       {options.map(option => (
//         <option key={option} value={option}>{option}</option>
//       ))}
//     </select>
//   );
// };

// Then create the cell editor with the required methods
// const SelectEditor = forwardRef<ICellEditorComp, SelectEditorProps>(
//   (props, ref) => {
//     // Keep internal state
//     const [value, setValue] = useState<string>(props.value);
//     const refInput = useRef<HTMLSelectElement>(null);

//     // Options for the select dropdown
//     const options: string[] = ["Active", "Pending", "Inactive"];

//     // Implement the ICellEditorComp interface methods
//     useImperativeHandle(
//       ref,
//       () => {
//         return {
//           getValue: () => {
//             return value;
//           },
//           afterGuiAttached: () => {
//             refInput.current?.focus();
//           },
//         };
//       },
//       [value]
//     );

//     useEffect(() => {
//       // Focus on the select element
//       setTimeout(() => refInput.current?.focus());
//     }, []);

//     const onChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
//       setValue(event.target.value);
//     };

//     const onKeyDown = (event: React.KeyboardEvent<HTMLSelectElement>) => {
//       if (event.key === "Enter") {
//         props.stopEditing();
//       }
//     };

//     return (
//       <select
//         ref={refInput}
//         value={value}
//         onChange={onChange}
//         onKeyDown={onKeyDown}
//         style={{ width: "100%", height: "100%", border: "none" }}
//       >
//         {options.map((option) => (
//           <option key={option} value={option}>
//             {option}
//           </option>
//         ))}
//       </select>
//     );
//   }
// );

// Action Cell Renderer
// interface ActionCellRendererProps extends ICellRendererParams {
//   data: RowData;
// }

// const ActionCellRenderer: React.FC<ActionCellRendererProps> = (props) => {
//   const onButtonClick = (): void => {
//     alert(`Row clicked: ${JSON.stringify(props.data)}`);
//   };

//   return (
//     <button
//       onClick={onButtonClick}
//       style={{
//         backgroundColor: "#007bff",
//         color: "white",
//         border: "none",
//         borderRadius: "4px",
//         padding: "4px 10px",
//       }}
//     >
//       View Details
//     </button>
//   );
// };

interface LinkCellRendererProps extends ICellRendererParams {
  data: RowData;
}

// const LinkCellRenderer: React.FC<LinkCellRendererProps> = (props) => {
//   const onButtonClick = (): void => {
//     alert(`Row clicked: ${JSON.stringify(props.data)}`);
//   };

//   return (
//     <button
//       onClick={onButtonClick}
//       style={{
//         backgroundColor: "#007bff",
//         color: "white",
//         border: "none",
//         borderRadius: "4px",
//         padding: "4px 10px",
//       }}
//     >
//       View Details
//     </button>
//   );
// };

const LinkCellRenderer: React.FC<LinkCellRendererProps> = (props) => {
  const renderLinks = () => {
    const links = [];
    
    if (props.data.links) {
      const linkArr = props.data.links.split("|");
      
      linkArr.forEach((link, index) => {
        const valArr = link.split(":");
        
        if (link.startsWith("http")) {
          links.push(
            <a key={`link-${index}`} target="_blank" href={link} rel="noopener noreferrer">
              <img className="link-icon" src="images/link.svg" alt="External link" />
            </a>
          );
        } else if (valArr[0] === "youtube") {
          links.push(
            <a 
              key={`youtube-${index}`} 
              target="_blank" 
              href={`https://www.youtube.com/watch?v=${valArr[1]}`} 
              rel="noopener noreferrer"
            >
              <img className="link-icon" src="images/youtube.svg" alt="YouTube link" />
            </a>
          );
        } else {
          console.log(`Unrecognized link type (${valArr[0]})`);
        }
      });
    }
    
    // Add search link
    const artist = props.data.artist
      ? props.data.artist.replace(/"/g, "").replace(/ /g, "+")
      : "";
    const song = props.data.song
      ? props.data.song.replace(/"/g, "").replace(/ /g, "+")
      : "";
    
    links.push(
      <a 
        key="search-link" 
        target="_blank" 
        href={`https://www.youtube.com/results?search_query=${artist}+${song}`} 
        rel="noopener noreferrer"
      >
        <img className="link-icon" src="images/search.svg" alt="Search YouTube" />
      </a>
    );
    
    return links;
  };

  return (
    <div className="link-cell">
      {renderLinks()}
    </div>
  );
};

// Progress Bar Renderer
// interface ProgressBarRendererProps extends ICellRendererParams {
//   value: number;
// }

// const ProgressBarRenderer: React.FC<ProgressBarRendererProps> = (props) => {
//   const value = props.value || 0;

//   const getBarColor = (value: number): string => {
//     if (value < 30) return "#f8d7da";
//     if (value < 70) return "#fff3cd";
//     return "#d4edda";
//   };

//   return (
//     <div
//       style={{
//         width: "100%",
//         height: "80%",
//         margin: "auto",
//         position: "relative",
//       }}
//     >
//       <div
//         style={{
//           height: "100%",
//           width: `${value}%`,
//           backgroundColor: getBarColor(value),
//           borderRadius: "3px",
//           transition: "width 0.5s",
//         }}
//       />
//       <div
//         style={{
//           position: "absolute",
//           top: 0,
//           left: 0,
//           right: 0,
//           bottom: 0,
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           fontWeight: "bold",
//           fontSize: "0.8rem",
//           color: "#333",
//         }}
//       >
//         {value}%
//       </div>
//     </div>
//   );
// };

const convertToRowData = (records: Record<string, string>[]): RowData[] => {
  return records.map((record) => ({
    id: parseInt(record.id || "0", 10),
    artist: record.artist || "",
    song: record.song || "",
    status: record.status || "Inactive",
    progress: parseInt(record.progress || "0", 10),
    lastUpdate: record.lastUpdate || new Date().toISOString().split("T")[0],
    links: record.links,
  }));
};

// Main App Component
const AGGrid: React.FC = () => {
  // Row data state
  const [rowData, setRowData] = useState<RowData[]>([]);
  const dispatch = useAppDispatch();
  const { content, headers, metadata, loading, error } = useAppSelector(
    (state) => state.file
  );
  const [searchParams] = useSearchParams();
  const loadUrl = searchParams.get("url");

  useEffect(() => {
    console.log(loadUrl);
    if (loadUrl) dispatch(loadTextFile(loadUrl));
  }, [dispatch, loadUrl]);

  useEffect(() => {
    setRowData(convertToRowData(content));
  }, [content, headers]);

  // Grid API reference
  const gridRef = useRef<AgGridReact>(null);

  // Generate some sample data
  // useEffect(() => {
  //   const fakeData: RowData[] = Array.from({ length: 1000 }, (_, i) => ({
  //     id: i + 1,
  //     name: `Name ${i + 1}`,
  //     email: `user${i + 1}@example.com`,
  //     status: ["Active", "Pending", "Inactive"][Math.floor(Math.random() * 3)],
  //     progress: Math.floor(Math.random() * 100),
  //     lastUpdate: new Date(
  //       Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000
  //     )
  //       .toISOString()
  //       .split("T")[0],
  //     score: Math.floor(Math.random() * 100),
  //   }));

  //   setRowData(fakeData);
  // }, []);

  // Column definitions with custom cell renderers
  const columnDefs = useMemo<ColDef[]>(
    () => [
      // {
      //   field: "id",
      //   headerName: "ID",
      //   width: 70,
      //   filter: "agNumberColumnFilter",
      //   sortable: true,
      // },
      {
        field: "artist",
        headerName: "Artist",
        filter: "agTextColumnFilter",
        sortable: true,
        editable: true,
      },
      {
        field: "song",
        headerName: "Song",
        filter: "agTextColumnFilter",
        sortable: true,
        editable: true,
      },
      // {
      //   field: "status",
      //   headerName: "Status",
      //   width: 120,
      //   filter: "agTextColumnFilter",
      //   sortable: true,
      //   editable: true,
      //   cellRenderer: StatusCellRenderer,
      //   cellEditor: SelectEditor,
      // },
      // {
      //   field: "progress",
      //   headerName: "Progress",
      //   width: 150,
      //   filter: "agNumberColumnFilter",
      //   sortable: true,
      //   editable: true,
      //   cellRenderer: ProgressBarRenderer,
      // },
      // {
      //   field: "lastUpdate",
      //   headerName: "Last Update",
      //   filter: "agDateColumnFilter",
      //   sortable: true,
      // },
      {
        field: "links",
        headerName: "Links",
        filter: "agTextColumnFilter",
        sortable: true,
        editable: true,
        cellRenderer: LinkCellRenderer,
      },
      // {
      //   headerName: "Actions",
      //   width: 120,
      //   cellRenderer: ActionCellRenderer,
      //   sortable: false,
      //   filter: false,
      //   editable: false,
      // },
    ],
    []
  );

  // Default column definitions - applied to all columns
  const defaultColDef = useMemo<ColDef>(
    () => ({
      sortable: true,
      filter: true,
      resizable: true,
      flex: 1,
    }),
    []
  );

  // Example of using Grid API
  // const onExportClick = (): void => {
  //   if (!gridRef.current?.api) return;

  //   const params = {
  //     fileName: "ag-grid-export.csv",
  //   };
  //   gridRef.current.api.exportDataAsCsv(params);
  // };

  // Optional Grid Ready handler
  const onGridReady = (params: GridReadyEvent): void => {
    console.log("Grid is ready");
    console.log(params);
    // You can access gridApi and columnApi here if needed
  };

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <h1>{metadata.title}</h1>

      {/* <div style={{ marginBottom: "10px" }}>
        <button onClick={onExportClick} style={{ padding: "5px 10px" }}>
          Export to CSV
        </button>
      </div> */}
      {loading && <p>Loading file...</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
      {!loading && !error && (
        <div
          className="ag-theme-alpine"
          style={{ height: "calc(100vh - 150px)", width: "100%" }}
        >
          <AgGridReact
            ref={gridRef}
            rowData={rowData}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            animateRows={true}
            rowSelection="multiple"
            enableCellTextSelection={true}
            pagination={true}
            paginationPageSize={1000}
            paginationAutoPageSize={false}
            onGridReady={onGridReady}
            theme={themeQuartz.withPart(colorSchemeDarkWarm)}
          />
        </div>
      )}
    </div>
  );
};

export default AGGrid;
