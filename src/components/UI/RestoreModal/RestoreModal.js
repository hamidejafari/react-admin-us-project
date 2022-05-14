import React from "react";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { Button } from "@mui/material";

export default function RestoreModal(props) {
  const { setOpen, header, content, deleteHandler, deleteLoading } = props;
  const handleClose = () => setOpen(false);

  return (
    <div className="modal-content">
      <div className="modal-header">
        <h5 className="modal-title">{header}</h5>
        <CloseRoundedIcon className="cursor-pointer" onClick={handleClose} />
      </div>
      <div className="modal-body">{content}</div>
      <div className="modal-footer">
        <Button variant="contained" onClick={handleClose} type="button">
          Close
        </Button>
        <Button
          disabled={deleteLoading}
          onClick={deleteHandler}
          variant="contained"
          type="button"
          color="secondary"
          sx={{ marginLeft: "0.5rem" }}
        >
          Restore!
        </Button>
      </div>
    </div>
  );
}
