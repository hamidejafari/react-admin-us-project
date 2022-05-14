import React, { useState, useEffect } from "react";
import { Button, CircularProgress, Grid } from "@mui/material";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import CheckCircleTwoToneIcon from "@mui/icons-material/CheckCircleTwoTone";
import axiosInstance from "../../../utiles/axiosInstance";
import Select from "react-select";

const statusOptions = [
  { label: "301", value: 301 },
  { label: "302", value: 302 }
];

const RedirectCreate = () => {
  const [newAddress, setNewAddress] = useState("");
  const [oldAddress, setOldAddress] = useState("");
  const [selectedStatus, setSelectedStatus] = useState([]);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState({});

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    console.log("hi im in ");
    e.preventDefault();
    setLoading(true);
    setErrorMessage({});
    try {
      const formData = new FormData();
      formData.append("newAddress", newAddress);
      formData.append("oldAddress", oldAddress);
      if(selectedStatus?.value){
        formData.append("status", selectedStatus.value);
      }

      await axiosInstance.post("/admin/redirects", formData);
      setLoading(false);

      toast.success("Created Successfully.");
      navigate("/redirects");
    } catch (error) {
      console.log(error);
      if (error.response?.data?.error) {
        setErrorMessage(error.response?.data?.error);
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "/tinymce/tinymce.min.js";
    document.body.appendChild(script);
    script.onload = () => {
      window.tinymce?.init({
        selector: "#description",
        height: 300,
        menubar: false,
        plugins: "code autolink link ",
        toolbar: "undo redo | code | link | Bold",
      });
    };
  }, []);

  return (
    <React.Fragment>
      <Grid container justifyContent="center">
        <Grid item xs={12}>
          <div className="card mb-12rem  ">
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>

                <Grid item xs={12} md={6}>
                  <div>
                    <label className="form-label" htmlFor="oldAddress">
                      Old Address
                    </label>
                    <input
                      className={`form-input ${
                        Array.isArray(errorMessage?.oldAddress) ? "is-invalid" : ""
                      }`}
                      id="oldAddress"
                      value={oldAddress}
                      onChange={(e) =>
                        setOldAddress(e.target.value)
                      }
                    />
                    <div className="text-danger">
                      {Array.isArray(errorMessage?.oldAddress) &&
                        errorMessage?.oldAddress.map((error, index) => (
                          <p key={index}>{error}</p>
                        ))}
                    </div>
                  </div>
                </Grid>

                <Grid item xs={12} md={6}>
                  <div>
                    <label className="form-label" htmlFor="newAddress">
                      New Address
                    </label>
                    <input
                      className={`form-input ${
                        Array.isArray(errorMessage?.newAddress) ? "is-invalid" : ""
                      }`}
                      id="newAddress"
                      value={newAddress}
                      onChange={(e) =>
                        setNewAddress(e.target.value)
                      }
                    />
                    <div className="text-danger">
                      {Array.isArray(errorMessage?.newAddress) &&
                        errorMessage?.newAddress.map((error, index) => (
                          <p key={index}>{error}</p>
                        ))}
                    </div>
                  </div>
                </Grid>


                <Grid item xs={12} md={12}>
                  <div style={{ zIndex: 2 }} className=" position-relative">
                    <label className="form-label" htmlFor="selectedStatus">
                      Redirect Type
                    </label>
                    <Select
                      id="selectedStatus"
                      value={selectedStatus}
                      onChange={(selectedStatus) => {
                        setSelectedStatus(selectedStatus);
                      }}
                      placeholder="Select Type"
                      options={statusOptions}
                      isClearable
                    />
                    <div className="text-danger">
                        {Array.isArray(errorMessage?.selectedStatus) &&
                        errorMessage?.selectedStatus.map((error, index) => (
                            <p key={index}>{error}</p>
                        ))}
                    </div>
                  </div>
                </Grid>

                <Grid item xs={12} md={12}>
                  <Button type="submit" variant="contained" disabled={loading}>
                    <CheckCircleTwoToneIcon style={{ marginRight: "5px" }} />
                    Submit
                  </Button>
                  {loading ? (
                    <CircularProgress className="me-3" color="inherit" />
                  ) : null}
                </Grid>
              </Grid>
            </form>
          </div>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default RedirectCreate;
