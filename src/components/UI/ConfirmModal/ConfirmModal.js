import React from "react";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { Button } from "@mui/material";

export default function ConfirmModal(props) {
  const { setOpen, header, content, accept, loading } = props;
  const handleClose = () => setOpen(false);

  return (
    <div className="modal-content">
      <div className="modal-header">
        <h5 className="modal-title">{header}</h5>
        <CloseRoundedIcon className="cursor-pointer" onClick={handleClose} />
      </div>
      <div className="modal-body">{content}</div>
      <div className="modal-footer">
        <Button
          variant="contained"
          className="btn-secondary"
          onClick={handleClose}
          type="button"
        >
          Close
        </Button>
        <Button
          disabled={loading}
          onClick={accept}
          variant="contained"
          type="button"
          sx={{ marginLeft: "0.5rem" }}
        >
          Confirm !
        </Button>
      </div>
    </div>
  );
}
