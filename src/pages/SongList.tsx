import { ChangeEvent, useEffect } from "react";
// import { ReactTabulator } from "react-tabulator";
// import * as XLSX from "xlsx";
import Table from "../components/Table";
import { useAppDispatch, useAppSelector } from "../hooks";
import { useSearchParams } from "react-router-dom";
import { readSelectedFile, loadTextFile } from "../features/fileSlice";
import "./css/page.css"

function SongList() {
  const dispatch = useAppDispatch();
  const { content, headers, metadata, loading, error } = useAppSelector(
    (state) => state.file
  );
  const [searchParams] = useSearchParams();
  const loadUrl = searchParams.get("url");

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      dispatch(readSelectedFile(file));
    }
  };

  useEffect(() => {
    console.log(loadUrl);
    if (loadUrl) dispatch(loadTextFile(loadUrl));
  }, [dispatch, loadUrl]);

  return (
    <div className="song-list">
      {metadata.title && <h1 id="page-title">{metadata.title}</h1>}
      {loadUrl ? (
        <></>
      ) : (
        <input
          type="file"
          accept=".csv,.xlsx,.xls,.txt"
          onChange={handleFileChange}
          style={{ marginBottom: "20px" }}
        />
      )}
      {loading && <p>Loading file...</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
      {/* <ReactTabulator
        data={content.map((row) => ({ ...row }))}
        columns={headers}
        // Optional props:
        tooltips
        layout="fitColumns"
        width="900px"
      /> */}
      <Table data={content.map((row) => ({ ...row }))} columns={headers} />
    </div>
  );
}

export default SongList;
