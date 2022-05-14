import React from "react";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { Button } from "@mui/material";

export default function DeleteModal(props) {
  const { setOpen, header, content, deleteHandler, deleteLoading, relations } =
    props;
  const handleClose = () => setOpen(false);

  return (
    <div className="modal-content">
      <div className="modal-header">
        <h5 className="modal-title">{header}</h5>
        <CloseRoundedIcon className="cursor-pointer" onClick={handleClose} />
      </div>
      <div className="modal-body">
        {content}
        {Array.isArray(relations) && relations.length > 0 && (
          <div className="bg-warning p-2 mt-4">
            <h3> retations : </h3>
            {relations.map((relation) => (
              <p className="ps-2">{relation}</p>
            ))}
          </div>
        )}
      </div>
      <div className="modal-footer">
        <Button variant="contained" onClick={handleClose} type="button">
          Close
        </Button>
        <Button
          disabled={deleteLoading}
          onClick={deleteHandler}
          variant="contained"
          color="error"
          type="button"
          sx={{ marginLeft: "0.5rem" }}
        >
          Delete!
        </Button>
      </div>
    </div>
  );
}
