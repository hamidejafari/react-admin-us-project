import React, { useEffect, useState } from "react";
import { Button, Pagination, CircularProgress, Grid } from "@mui/material";

import useGetData from "../../../hooks/useGetData";
import SkeletonTableLoading from "../../../components/UI/SkeletonTableLoading/SkeletonTableLoading";
import useQueryParam from "../../../hooks/useQueryParam";
import AppModal from "../../../components/UI/AppModal/AppModal";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import qs from "qs";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import axiosInstance from "../../../utiles/axiosInstance";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import EditTwoToneIcon from "@mui/icons-material/EditTwoTone";

const BrandControlGet = () => {
  const [pageCount, setPageCount] = useState();
  const [currentPage, setCurrentPage] = useState(null);
  const [params, setParams] = useQueryParam("page");
  const { loading, data: controls, getData } = useGetData();
  const [myQuery, setMyQuery] = useState();

  const [title, setTitle] = useState();
  const [changePage, setChangePage] = useState(1);

  useEffect(() => {
    if (!params) {
      setCurrentPage(1);
      return;
    }
    setCurrentPage(+params);
  }, [params]);

  useEffect(() => {
    if (!currentPage) {
      return;
    }

    // getData("/admin/control-brands?page=" + currentPage);

    if (myQuery) {
      getData("/admin/control-brands?page=" + currentPage + "&" + myQuery);
    } else {
      getData("/admin/control-brands?page=" + currentPage);
    }
  }, [getData, currentPage, myQuery, changePage]);

  useEffect(() => {
    if (!controls) {
      return;
    }
    setPageCount(controls.meta?.lastPage || 0);
  }, [controls]);

  const handleChangePage = (_, page) => {
    if (currentPage && +page === currentPage) {
      return;
    }
    setParams(+page);
  };

  const [modalSearchOpen, setModalSearchOpen] = useState(false);
  const openSearchModalHandler = (id) => {
    setModalSearchOpen(true);
  };
  const handleClose = () => setModalSearchOpen(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let myQuerySearch = {};

    if (title) {
      myQuerySearch.title = title;
    }

    myQuerySearch = qs.stringify(myQuerySearch);
    setMyQuery(myQuerySearch);
    setCurrentPage(1);
    setParams(1);
    setModalSearchOpen(false);
  };

  const stylesTr = {
    hasNew: {
      background: "#d8f6d8",
    },
    dontHasNew: {
      background: "#ffd5d5",
    },
    hasNotEq: {
      background: "#d8ce97",
    },
  };

  const redirectHandler = async (controlId) => {
    await axiosInstance
      .get("/admin/control-brands/redirect/" + controlId)
      .then((res) => {
        toast.success("redirected successfully.");
      })
      .catch((err) => {
        if (err?.response?.status === 400) {
          toast.warning(err?.response?.data?.message);
        }
      });

    setChangePage(changePage + 1);
  };

  const checkHandler = async (controlId) => {
    await axiosInstance
      .get("/admin/control-brands/check/" + controlId)
      .then((res) => {
        toast.success("checked successfully.");
      })
      .catch((err) => {
        if (err?.response?.status === 400) {
          toast.warning(err?.response?.data?.message);
        }
      });

    setChangePage(changePage + 1);
  };

  return (
    <React.Fragment>
      <div className="card mb-12rem">
        <AppModal setOpen={setModalSearchOpen} open={modalSearchOpen}>
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Search</h5>
              <CloseRoundedIcon
                className="cursor-pointer"
                onClick={handleClose}
              />
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <Grid container spacing={2} justifyContent="center">
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

                  <div className="d-flex">
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={loading}
                    >
                      Search
                    </Button>
                    {loading ? (
                      <CircularProgress className="me-3" color="inherit" />
                    ) : null}
                  </div>
                </Grid>
              </form>
            </div>
            <div className="modal-footer"></div>
          </div>
        </AppModal>

        <div className="d-flex w-100 justify-content-space-between">
          <div>
            <span
              onClick={() => {
                openSearchModalHandler();
              }}
              className="cursor-pointer me-3"
              style={{ marginLeft: "10px" }}
            >
              <Button variant="contained">
                <ManageSearchIcon
                  style={{ fontSize: 18, marginRight: "5px" }}
                />
                Search
              </Button>
            </span>
          </div>
        </div>

        <div className="scroll-x mt-4">
          <p> red rows count : {controls?.data?.redControlsCount} | green rows count : {controls?.data?.greenControlsCount} | brown rows count : {controls?.data?.brownControlsCount}</p>

          <table className="table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Old Brand Title</th>
                <th scope="col">Old Brand Slug</th>
                <th scope="col">New Brand Title</th>
                <th scope="col">New Brand Slug</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <SkeletonTableLoading column={7} />
              ) : controls?.data?.controls?.length > 0 ? (
                controls?.data?.controls.map((control, index) => (
                  <tr
                    key={control._id}
                    style={
                      control.newTitle
                        ? control.newSlug === control.oldSlug
                          ? stylesTr.hasNew
                          : stylesTr.hasNotEq
                        : stylesTr.dontHasNew
                    }
                  >
                    <th scope="row">{index + 1}</th>
                    <td>{control.oldTitle}</td>
                    <td>{control.oldSlug}</td>
                    <td>{control.newTitle ? control.newTitle : "-"}</td>
                    <td>{control.newSlug ? control.newSlug : "-"}</td>
                    <td className="white-space-nowrap">
                      {control.newSlug !== control.oldSlug &&
                      control.newSlug ? (
                        <>
                          {control.redirected !== true ? (
                            <span
                              onClick={() => {
                                redirectHandler(control._id);
                              }}
                              className="cursor-pointer me-3"
                            >
                              <Button variant="contained">Reidrect</Button>
                            </span>
                          ) : (
                            " "
                          )}

                          <Link
                            className="me-3"
                            to={"/control-brands/" + control._id}
                          >
                            <EditTwoToneIcon className="action-icons" />
                          </Link>
                        </>
                      ) : (
                        ""
                      )}

                      {control.newTitle ? (
                        ""
                      ) : (
                        <>
                          <span
                            onClick={() => {
                              checkHandler(control._id);
                            }}
                            className="cursor-pointer me-3"
                          >
                            <Button variant="contained">Check Again</Button>
                          </span>

                          <Link
                            className="me-3"
                            to={"/control-brands/" + control._id}
                          >
                            <EditTwoToneIcon className="action-icons" />
                          </Link>
                        </>
                      )}
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

          {controls?.data?.controls.length > 0 ? (
            <div className="d-flex justify-content-center mt-5">
              <Pagination
                page={currentPage}
                onChange={handleChangePage}
                count={pageCount}
                color="primary"
              />
            </div>
          ) : null}
        </div>
      </div>
    </React.Fragment>
  );
};

export default BrandControlGet;
