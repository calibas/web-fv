import React, { useRef, useEffect } from "react";
import {
  ColumnDefinition,
  CellComponent,
  TabulatorFull,
} from "tabulator-tables";
import "tabulator-tables/dist/css/tabulator_site_dark.min.css";
import "./table.css";

interface MyTabulatorProps {
  data: Record<string, string>[];
  columns: ColumnDefinition[];
}

// Tabulator recommends waiting on the "tableBuilt" event, but I was getting bugs
// when combining that with useState() to track initialization. Instead, I'm
// checking the initialized property directly, the code below is to prevent TS errors
declare module "tabulator-tables" {
  interface TabulatorFull {
    initialized?: boolean;
  }
}

// Needs testing, should be able to display React components inside table cells:

// const reactFormatter = (cell, formatterParams, onRendered) => {
//   const cellValue = cell.getValue();
//   // Create a container element for your React component
//   const container = document.createElement('div');
//   // Mount your component into that container
//   createRoot(container).render(<MyCustomComponent value={cellValue} />);
//   return container; // return the container so Tabulator renders it in the cell
// };

const addFormatter = (columnDefs: ColumnDefinition[]) => {
  columnDefs.map((columnDef: ColumnDefinition) => {
    const colDef: ColumnDefinition = columnDef;
    if (columnDef.title.toLowerCase() === "links") {
      colDef.formatter = linkFormatter;
    }
    return colDef;
  });
};

const linkFormatter = (cell: CellComponent) => {
  const value = cell.getValue();
  let result = "";
  if (value) {
    const linkArr = value.split("|");
    for (const link of linkArr) {
      if (linkArr.length >= 2) {
        console.log(link);
      }
      const valArr = link.split(":");
      if (valArr[0].startsWith("http")) {
        result += `<a target="_blank" href='${link}'><img class="link-icon" src="images/link.svg" /></a> `;
        // result += `<a target="_blank" href='${link}'><svg class="link-icon"><use href="images/link.svg"></use></svg></a> `;
      } else if (valArr[0] === "youtube") {
        result += `<a target="_blank" href='https://www.youtube.com/watch?v=${valArr[1]}'><img class="link-icon" src="images/youtube.svg" /></a> `;
        // <a class="add-icon" onclick="addToPlaylist('${valArr[1]}')">+</a>`;
      } else {
        console.log(`Unrecognized link type (${valArr[0]})`);
      }
    }
  } //else {
  const row = cell.getRow();
  // console.log(row._row.data);
  const rowData = row.getData();
  const artist = rowData.artist
    ? rowData.artist.replace(/"/g, "").replace(/ /g, "+")
    : "";
  const song = rowData.song
    ? rowData.song.replace(/"/g, "").replace(/ /g, "+")
    : "";
  result += `<a target="_blank" href="https://www.youtube.com/results?search_query=${artist}+${song}"><img class="link-icon" src="images/search.svg" /></a>`;
  // result += `<a target="_blank" href="https://www.youtube.com/results?search_query=${artist}+${song}"><svg class="link-icon" ><use width="100%" height="100%" href="images/search.svg#svg4162"></use></svg></a>`;
  //}
  return result;
};

const MyTabulator: React.FC<MyTabulatorProps> = ({ data, columns }) => {
  const tableRef = useRef<HTMLDivElement>(null);
  const tabulatorInstance = useRef<TabulatorFull | null>(null);
  // const [isTableBuilt, setIsTableBuilt] = useState(false);
  const dataRef = useRef(data);
  const columnsRef = useRef(columns);

  useEffect(() => {
    console.log("init!");
    if (tableRef.current) {
      const columnsCopy = columnsRef.current.map((row) => ({ ...row }));
      addFormatter(columnsCopy);
      console.log(columnsCopy);
      // Initialize Tabulator with initial data and columns.
      tabulatorInstance.current = new TabulatorFull(tableRef.current, {
        data: dataRef.current,
        columns: columnsCopy,
        layout: "fitColumns",
        height:"100%",
        rowHeight:33,
      });
      // Listen for the "tableBuilt" event.
      tabulatorInstance.current.on("tableBuilt", () => {
        // setIsTableBuilt(true);
      });
    }
    return () => {
      tabulatorInstance.current?.destroy();
    };
  }, []);

  // Only update data once the table is built.
  useEffect(() => {
    console.log("[data, isTableBuilt]");
    // console.log(isTableBuilt);
    if (data.length > 0) {
      const checkAndReplaceData = () => {
        if (tabulatorInstance.current?.initialized) {
          tabulatorInstance.current.replaceData(data);
        } else {
          setTimeout(checkAndReplaceData, 100);
        }
      };
      
      checkAndReplaceData();
    }
  }, [data]);

  // Only update columns once the table is built.
  useEffect(() => {
    console.log("[columns, isTableBuilt]");
    // console.log(isTableBuilt);
    if (columns.length > 0) {
      const checkAndReplaceData = () => {
        if (tabulatorInstance.current?.initialized) {
          const columnsCopy = columns.map((row) => ({ ...row }));
          addFormatter(columnsCopy);
          console.log(columns);
          tabulatorInstance.current.setColumns(columnsCopy);
        } else {
          setTimeout(checkAndReplaceData, 100);
        }
      };
      
      checkAndReplaceData();
    }
    // if (tabulatorInstance.current?.initialized && columns.length > 0) {
    //   const columnsCopy = columns.map((row) => ({ ...row }));
    //   addFormatter(columnsCopy);
    //   console.log(columns);
    //   tabulatorInstance.current.setColumns(columnsCopy);
    // }
  }, [columns]);

  return <div ref={tableRef} />;
};

export default MyTabulator;
