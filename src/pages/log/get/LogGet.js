import React, { useEffect, useState } from "react";
import { Button, CircularProgress, Pagination } from "@mui/material";
import MobileDatePicker from "@mui/lab/MobileDatePicker";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import qs from "qs";
import { Grid } from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { encode } from "js-base64";
import ImportContactsTwoToneIcon from "@mui/icons-material/ImportContactsTwoTone";
import FilterAltTwoToneIcon from "@mui/icons-material/FilterAltTwoTone";

import useGetData from "../../../hooks/useGetData";
import SkeletonTableLoading from "../../../components/UI/SkeletonTableLoading/SkeletonTableLoading";
import useQueryParam from "../../../hooks/useQueryParam";
import AppModal from "../../../components/UI/AppModal/AppModal";
import { useRef } from "react";
import axiosInstance from "../../../utiles/axiosInstance";
import Select from "react-select";

const modelOptions = [
  { label: "category", value: "category" },
  { label: "brand", value: "brand" },
  { label: "review", value: "review" },
  { label: "user", value: "user" },
  { label: "product", value: "product" },
  { label: "blog", value: "blog" },
];

const LogsGet = () => {
  const [pageCount, setPageCount] = useState();
  const [currentPage, setCurrentPage] = useState(null);
  const [confirmedPassword, setConfirmedPassword] = useState(false);
  const [confirmedPasswordLoading, setConfirmedPasswordLoading] =
    useState(false);
  const [myQuery, setMyQuery] = useState();
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [detailedLog, setDetailedLog] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);
  const [selectedModel, setSelectedModel] = useState([]);
  const [selectedAdmins, setSelectedAdmins] = useState([]);
  const [adminOptions, setAdminOptions] = useState([]);
  const [title, setTitle] = useState();

  const isFirst = useRef(true);

  const passwordRef = useRef(null);

  const [params, setParams] = useQueryParam("page");

  const {
    loading,
    data: logs,
    getData,
    setData: setLogs,
    setLoading,
  } = useGetData();

  useEffect(() => {
    if (!currentPage) {
      return;
    }

    if (!confirmedPassword) {
      return;
    } else {
      if (isFirst.current) {
        isFirst.current = false;
        return;
      }
    }

    if (myQuery) {
      getData(
        "/admin/logs?password=" +
          confirmedPassword +
          "&page=" +
          currentPage +
          "&" +
          myQuery
      );
    } else {
      getData(
        "/admin/logs?password=" + confirmedPassword + "&page=" + currentPage
      );
    }
  }, [getData, currentPage, myQuery, confirmedPassword]);

  useEffect(() => {
    if (!logs) {
      return;
    }
    setPageCount(logs.meta?.lastPage || 0);
  }, [logs]);

  const handleChangePage = (_, page) => {
    if (currentPage && +page === currentPage) {
      return;
    }

    setParams(+page);
  };

  useEffect(() => {
    if (!logs) {
      return;
    }
    setPageCount(logs.meta?.lastPage || 0);
  }, [logs]);

  useEffect(() => {
    if (!params) {
      setCurrentPage(1);
      return;
    }
    setCurrentPage(+params);
  }, [params]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let myQuerySearch = {};
    if (startDate) {
      myQuerySearch.startDate = new Date(startDate).setHours(0, 0, 0);
    }
    if (endDate) {
      myQuerySearch.endDate = new Date(endDate).setHours(23, 59, 59);
    }
    if (selectedAdmins) {
      let adminIds = "";
      selectedAdmins.forEach((admin, index) => {
        if (index !== 0) {
          adminIds = adminIds + "," + admin.value;
        } else {
          adminIds = adminIds + admin.value;
        }
      });
      myQuerySearch.adminIds = adminIds;
    }
    if (selectedModel) {
      myQuerySearch.model = selectedModel.value;
    }
    if (title) {
      myQuerySearch.title = title;
    }
    myQuerySearch = qs.stringify(myQuerySearch);
    setMyQuery(myQuerySearch);
    setCurrentPage(1);
    setParams(1);
  };

  const detailModalOpenHandler = (log) => {
    setDetailModalOpen(true);

    setDetailedLog(JSON.parse(JSON.parse(log)));
  };

  const closeDetailModalOpenHandler = () => {
    setDetailModalOpen(false);
    setDetailedLog(false);
  };

  const submitFormPasswordHandler = async (e) => {
    e.preventDefault();
    const confirmationPassword = passwordRef?.current?.value;
    setConfirmedPasswordLoading(true);

    try {
      const res = await axiosInstance.get(
        "/admin/logs?password=" +
          encode(confirmationPassword) +
          "&page=" +
          currentPage
      );

      const admins = await axiosInstance.get("/admin/all-admins");

      const opt = [];
      for (const admin of admins.data) {
        opt.push({
          label: admin.name + " " + admin.family,
          value: admin._id,
        });
      }
      setAdminOptions(opt);

      setConfirmedPasswordLoading(false);
      setLogs(res.data);
      setLoading(false);
      setConfirmedPassword(encode(confirmationPassword));
    } catch (err) {
      setConfirmedPasswordLoading(false);
      setErrorMessage(err?.response?.data?.error);
    }
  };

  return (
    <React.Fragment>
      <AppModal
        setOpen={setDetailModalOpen}
        open={detailModalOpen}
        width="width-normal"
      >
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Log Details</h5>
            <CloseRoundedIcon
              className="cursor-pointer"
              onClick={closeDetailModalOpenHandler}
            />
          </div>
          <div className="modal-body overflow-auto">
            {detailedLog &&
              Object.entries(detailedLog).map((element, index) => {
                return (
                  <div className="mb-2" key={index}>
                    {element[0]} :{" "}
                    {typeof element[1] === "string" ||
                    element[1] instanceof String
                      ? element[1]
                      : JSON.stringify(element[1])}
                  </div>
                );
              })}
          </div>
        </div>
      </AppModal>

      <div className="card mb-12rem">
        {confirmedPassword ? (
          <div className="scroll-x mt-4">
            <Grid className="mb-5" container spacing={2}>
              <Grid item xs={12} md={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <MobileDatePicker
                    clearable
                    value={startDate}
                    onChange={(newValue) => {
                      setStartDate(newValue);
                    }}
                    renderInput={({ inputRef, inputProps, InputProps }) => (
                      <div>
                        <label className="form-label" htmlFor="title">
                          From:
                        </label>
                        <input
                          className={`form-input`}
                          ref={inputRef}
                          {...inputProps}
                        />
                        {InputProps?.endAdornment}
                      </div>
                    )}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} md={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <MobileDatePicker
                    clearable
                    value={endDate}
                    onChange={(newValue) => {
                      setEndDate(newValue);
                    }}
                    renderInput={({ inputRef, inputProps, InputProps }) => (
                      <div>
                        <label className="form-label" htmlFor="title">
                          To:
                        </label>
                        <input
                          className={`form-input`}
                          ref={inputRef}
                          {...inputProps}
                        />
                        {InputProps?.endAdornment}
                      </div>
                    )}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} md={6}>
                <label className="form-label" htmlFor="admin">
                  admin
                </label>
                <Select
                  id="admin"
                  value={selectedAdmins}
                  onChange={(selected) => {
                    setSelectedAdmins(selected);
                  }}
                  options={adminOptions}
                  isMulti
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <label className="form-label" htmlFor="model">
                  model
                </label>
                <Select
                  id="model"
                  value={selectedModel}
                  onChange={(selected) => {
                    setSelectedModel(selected);
                  }}
                  options={modelOptions}
                />
              </Grid>



              <Grid item xs={12} md={12}>
                <div className="mb-3">
                  <label className="form-label" htmlFor="title">
                    Name
                  </label>
                  <input
                    className="form-input"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value, "")}
                  />
                </div>
              </Grid>

              <Grid item xs={12} className="mt-2">
                <Button variant="contained" onClick={handleSubmit}>
                  <FilterAltTwoToneIcon
                    style={{ fontSize: 18, marginRight: "5px" }}
                  />
                  filter
                </Button>
              </Grid>
            </Grid>

            <table className="table">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">User</th>
                  <th scope="col">URL</th>
                  <th scope="col">Method</th>
                  <th scope="col">Model Title</th>
                  <th scope="col">Time</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <SkeletonTableLoading column={7} />
                ) : logs?.data?.length > 0 ? (
                  logs.data.map((log, index) => (
                    <tr key={log._id}>
                      <th scope="row">
                        {(currentPage - 1) * 100 + (index + 1)}
                      </th>
                      <td>
                        {log.userId?.name} {log.userId?.family}
                      </td>
                      <td>{log.url}</td>
                      <td>
                        {log.method === "POST"
                          ? "CREATE"
                          : log.method === "PUT"
                          ? "EDIT"
                          : log.method}
                      </td>
                      <td>{log.modelId?.title}</td>
                      <td>{new Date(log.createdAt).toString()}</td>
                      <td>
                        <ImportContactsTwoToneIcon
                          onClick={() => detailModalOpenHandler(log.data)}
                          className="action-icons color-blue-500 cursor-pointer"
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <th className="text-center" colSpan="7">
                      Not Found
                    </th>
                  </tr>
                )}
              </tbody>
            </table>
            {logs?.data.length > 0 ? (
              <div className="d-flex justify-content-center mt-5">
                <Pagination
                  page={currentPage || 0}
                  onChange={handleChangePage}
                  count={pageCount || 0}
                  color="primary"
                />
              </div>
            ) : null}
          </div>
        ) : (
          <form onSubmit={submitFormPasswordHandler}>
            <Grid className="mb-5" container spacing={2}>
              <Grid item xs={12} md={6}>
                <div className="mb-3">
                  <label className="form-label" htmlFor="password">
                    Password
                  </label>
                  <input
                    type="password"
                    className={`form-input`}
                    id="password"
                    ref={passwordRef}
                  />
                  <div className="text-danger">
                    {Array.isArray(errorMessage?.confirmationPassword) &&
                      errorMessage?.confirmationPassword.map((error, index) => (
                        <p key={index}>{error}</p>
                      ))}
                  </div>
                </div>
              </Grid>
              <Grid item xs={12}>
                <div className="mb-3">
                  <div className="d-flex">
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={confirmedPasswordLoading}
                    >
                      submit
                    </Button>
                    {confirmedPasswordLoading ? (
                      <CircularProgress className="ms-3" color="inherit" />
                    ) : null}
                  </div>
                </div>
              </Grid>
            </Grid>
          </form>
        )}
      </div>
    </React.Fragment>
  );
};

export default LogsGet;
