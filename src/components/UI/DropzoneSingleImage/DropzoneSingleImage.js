import React, { useEffect, useMemo } from "react";
import { useDropzone } from "react-dropzone";
import ClearTwoToneIcon from "@mui/icons-material/ClearTwoTone";

const baseStyle = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "20px",
  borderWidth: 2,
  borderRadius: 2,
  borderColor: "#eeeeee",
  borderStyle: "dashed",
  backgroundColor: "#fafafa",
  color: "#bdbdbd",
  outline: "none",
  transition: "border .24s ease-in-out",
};

const activeStyle = {
  borderColor: "#2196f3",
};

const acceptStyle = {
  borderColor: "#00e676",
};

const rejectStyle = {
  borderColor: "#ff1744",
};

const thumbsContainer = {
  marginTop: 16,
};

const thumb = {
  display: "flex",
  borderRadius: 2,
  border: "1px solid #eaeaea",
  marginBottom: 8,
  marginRight: 8,
  padding: 15,
  boxSizing: "border-box",
};

const thumbInner = {
  display: "flex",
  minWidth: 0,
};

const img = {
  display: "block",
  width: "100%",
  height: "100%",
};

function DropzoneSingleImage(props) {
  const { files, setFiles } = props;

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    onDrop: (acceptedFiles) => {
      setFiles([
        ...files,
        ...acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
            old: false,
          })
        ),
      ]);
    },
    multiple: true,
  });

  const deleteFile = (fileName) => {
    setFiles(files.filter((word) => word.name !== fileName));
  };

  const thumbs = files.map((file, indexMe) => (
    <div style={thumb} key={file.name}>
      <div style={thumbInner}>
        <div>
          <img src={file.preview} alt="preview" style={img} />
        </div>
        <div className="ms-4" style={{ width: "100%" }}>
          <div className="d-flex justify-content-space-between">
            <label className="form-label">alt :</label>
            <ClearTwoToneIcon
              className="cursor-pointer"
              color="error"
              onClick={() => {
                deleteFile(file.name);
              }}
            />
          </div>
          <input
            className="form-input "
            type="text"
            value={file.alt || ""}
            onChange={(event) => {
              const f = [...files];
              if (f[indexMe]) {
                f[indexMe].alt = event.target.value;
              }
              setFiles(f);
              console.log(files);
            }}
          />
        </div>
      </div>
    </div>
  ));

  useEffect(
    () => () => {
      // Make sure to revoke the data uris to avoid memory leaks
      files.forEach((file) => URL.revokeObjectURL(file.preview));
    },
    [files]
  );

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isDragActive ? activeStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isDragActive, isDragReject, isDragAccept]
  );

  return (
    <section className="container">
      <div {...getRootProps({ className: "dropzone", style: style })}>
        <input {...getInputProps()} />
        <p>Drag 'n' drop some files here, or click to select files</p>
      </div>
      <aside style={thumbsContainer}>{thumbs}</aside>
    </section>
  );
}

export default DropzoneSingleImage;
