import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { WritableDraft } from 'immer';
import { ColumnDefinition } from "tabulator-tables";
import * as XLSX from "xlsx";

// Async thunk #1: Load text file via fetch
export const loadTextFile = createAsyncThunk(
  "file/loadTextFile",
  async (filePath: string) => {
    const response = await fetch(filePath);
    if (!response.ok) {
      throw new Error("Failed to fetch file");
    }
    const text = await response.text();
    return parseCSV(text);
  }
);

// Async thunk #2: Read local file via FileReader
export const readSelectedFile = createAsyncThunk(
  "file/readSelectedFile",
  async (file: File) => {
    return new Promise<TableInfo | undefined>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          const parsedResult = parseCSV(reader.result);
          resolve(parsedResult);
        } else {
          reject(new Error("File content was not read as text"));
        }
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsText(file);
    });
  }
);

interface FileState {
  content: Record<string, string>[];
  headers: ColumnDefinition[];
  metadata: Record<string, string>;
  loading: boolean;
  error: string | null;
}

interface TableInfo {
  data: Record<string, string>[]; 
  headers: ColumnDefinition[];
  metadata: Record<string, string>;
}

const initialState: FileState = {
  content: [],
  headers: [],
  metadata: {},
  loading: false,
  error: null,
};

const parseCSV = (textString: string) => {
  console.log(textString);
  let workbook;
  try {
    workbook = XLSX.read(textString, { type: "string" });
  } catch (err) {
    console.error("Error parsing CSV as UTF-8 text:", err);
    return;
  }

  // Access the first sheet, convert to JSON, etc.
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const jsonData = XLSX.utils.sheet_to_json<(string | number | null)[]>(
    worksheet,
    { header: 1 }
  );
  // const jsonData = XLSX.utils.sheet_to_json(worksheet);
  console.log(jsonData);

  // If you want the first row to be your column headers, remove it from data
  // and let Tabulator use it:
  // e.g.:
  //    let headers = jsonData.shift(); // remove first row
  //    Then build columns from headers, or let autoColumns parse it
  //

  let headers = jsonData.shift();
  const metadata: Record<string, string> = {};
  if (!headers) {
    // handle the case of an empty file or no rows
    return;
  }

  // Check for comments at top
  while (
    headers[0] !== null &&
    typeof headers[0] === "string" &&
    headers[0].startsWith("#")
  ) {
    const tempMeta = headers[0].substring(1).split(";");
    tempMeta.forEach((metaValue) => {
      const metaKVPair = metaValue.split(":");
      if (metaKVPair.length === 2) metadata[metaKVPair[0]] = metaKVPair[1];
    });
    headers = jsonData.shift();
    if (!headers) {
      break;
    }
  }
  // TODO: Set header
  // table.setColumns(createHeader(headers));
  // if (headers) setColumns(createHeader(headers));
  let columnHeaders: ColumnDefinition[] = [];
  if (headers) columnHeaders = createHeader(headers);
  console.log(metadata);

  // Rebuild the data to map row arrays to objects, with keys matching header values
  const tabData = jsonData.map((rowArr) => {
    const rowObj: Record<string, string> = {};
    if (!headers) {
      return {};
    }
    rowArr.forEach((cellValue, i) => {
      const header = headers?.[i];
      if (typeof header === "string") {
        rowObj[header] = String(cellValue);
      }
    });
    return rowObj;
  });
  console.log(tabData);

  // setGridData(tabData);
  return ({data: tabData, headers: columnHeaders, metadata})
};

const createHeader = (headers: (string | number | null)[]) => {
  const columnHeaders: ColumnDefinition[] = [];
  for (const column of headers) {
    if (typeof column === "string") {
      if (column.toLowerCase() === "links") {
        columnHeaders.push({ title: column, field: column, maxWidth: 95 }); //, formatter:linkFormatter});//, editor:"input"});
      } else {
        columnHeaders.push({ title: column, field: column }); //, editor:"input"});
      }
    }
  }
  return columnHeaders;
};

const fileSlice = createSlice({
  name: "file",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // loadTextFile (remote fetch)
      .addCase(loadTextFile.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.content = [];
        state.headers = [];
        state.metadata = {};
      })
      .addCase(loadTextFile.fulfilled, (state, action) => {
        state.loading = false;
        state.content = action.payload?.data || [];
        state.headers = action.payload?.headers as WritableDraft<ColumnDefinition>[] || [];
        state.metadata = action.payload?.metadata || {};
      })
      .addCase(loadTextFile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Error loading file";
        console.log("Error loading file");
      })

      // readSelectedFile (local FileReader)
      .addCase(readSelectedFile.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.content = [];
        state.headers = [];
        state.metadata = {};
      })
      .addCase(readSelectedFile.fulfilled, (state, action) => {
        state.loading = false;
        state.content = action.payload?.data || [];
        state.headers = action.payload?.headers as WritableDraft<ColumnDefinition>[] || [];
        state.metadata = action.payload?.metadata || {};
      })
      .addCase(readSelectedFile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Error reading file";
        console.log("Error reading file");
      });
  },
});

export default fileSlice.reducer;
