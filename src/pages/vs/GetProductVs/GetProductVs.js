import React, { useEffect, useState } from "react";
import { Button, Pagination, Grid, CircularProgress } from "@mui/material";
import { Link } from "react-router-dom";
import EditTwoToneIcon from "@mui/icons-material/EditTwoTone";
import AddCircleTwoToneIcon from "@mui/icons-material/AddCircleTwoTone";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import qs from "qs";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";

import useGetData from "../../../hooks/useGetData";
import SkeletonTableLoading from "../../../components/UI/SkeletonTableLoading/SkeletonTableLoading";
import useQueryParam from "../../../hooks/useQueryParam";
import AppModal from "../../../components/UI/AppModal/AppModal";

const GetProductVs = () => {
  const [pageCount, setPageCount] = useState();
  const [currentPage, setCurrentPage] = useState(null);
  const [params, setParams] = useQueryParam("page");

  const { loading, data: comparisons, getData } = useGetData();
  const [showHomePage, setShowHomePage] = useState(false);
  const [myQuery, setMyQuery] = useState();
  const [modalSearchOpen, setModalSearchOpen] = useState(false);
  const openSearchModalHandler = (id) => {
    setModalSearchOpen(true);
  };
  const handleClose = () => setModalSearchOpen(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let myQuerySearch = {};
    if (showHomePage) {
      myQuerySearch.showHomePage = true;
    }
    myQuerySearch = qs.stringify(myQuerySearch);
    setMyQuery(myQuerySearch);
    setCurrentPage(1);
    setParams(1);

    setModalSearchOpen(false);
  };

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

    if (myQuery) {
      getData("/admin/comparisons-grouped?page=" + currentPage + "&" + myQuery);
    } else {
      getData("/admin/comparisons-grouped?page=" + currentPage);
    }
  }, [getData, currentPage, myQuery]);

  useEffect(() => {
    if (!comparisons) {
      return;
    }
    setPageCount(comparisons.meta?.lastPage || 0);
  }, [comparisons]);

  const handleChangePage = (_, page) => {
    if (currentPage && +page === currentPage) {
      return;
    }

    setParams(+page);
  };

  return (
    <React.Fragment>
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
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <div className="my-2 form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={showHomePage}
                      onChange={(e) => setShowHomePage(e.target.checked)}
                      id="showHomePage"
                    />
                    <label className="form-check-label" htmlFor="showHomePage">
                      Show Home Page
                    </label>
                  </div>
                </Grid>

                <Grid item xs={12}>
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
              </Grid>
            </form>
          </div>
          <div className="modal-footer"></div>
        </div>
      </AppModal>

      <div className="card mb-12rem">
        <Button variant="contained" component={Link} to="/vs/products/create">
          <AddCircleTwoToneIcon style={{ fontSize: 18, marginRight: "5px" }} />
          New VS
        </Button>

        <Button
          onClick={() => {
            openSearchModalHandler();
          }}
          className="cursor-pointer me-3"
          style={{ marginLeft: "10px" }}
          variant="contained"
        >
          <ManageSearchIcon style={{ fontSize: 18, marginRight: "5px" }} />
          Search
        </Button>
        <div className="scroll-x mt-4">
          <table className="table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Category</th>
                <th scope="col">Product 1</th>
                <th scope="col"></th>
                <th scope="col">Product 2</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <SkeletonTableLoading column={6} />
              ) : comparisons?.data?.length > 0 &&
                !comparisons?.data[0].compares ? (
                comparisons.data.map((comparison, index) => (
                  <tr key={comparison._id}>
                    <th scope="row">{index + 1}</th>
                    <td>{comparison.categoryId?.title}</td>
                    <td>{comparison.compare1Id?.title}</td>
                    <td>vs</td>
                    <td>{comparison.compare2Id?.title}</td>
                    <td>
                      <Link to={"/vs/" + comparison._id}>
                        <EditTwoToneIcon className="action-icons" />
                      </Link>
                    </td>
                  </tr>
                ))
              ) : comparisons?.data?.length > 0 ? (
                comparisons.data.map((comparison, index) => (
                  <tr key={comparison._id}>
                    <th scope="row">{index + 1}</th>
                    <td>{comparison.compares[0].category.title}</td>
                    <td>
                      {comparison.compares.map((comp) => (
                        <p key={comp._id} className="compare-table-td-p">
                          {comp.compare1Id.title}
                        </p>
                      ))}
                    </td>
                    <td>
                      {" "}
                      {comparison.compares.map((comp) => (
                        <p key={comp._id} className="compare-table-td-p">
                          vs
                        </p>
                      ))}
                    </td>
                    <td>
                      {comparison.compares.map((comp) => (
                        <p key={comp._id} className="compare-table-td-p">
                          {comp.compare2Id.title}
                        </p>
                      ))}
                    </td>
                    <td>
                      {comparison.compares.map((comp) => (
                        <p
                          key={comp._id}
                          className="compare-table-td-p-svg-wrapper"
                        >
                          <Link to={"/vs/" + comp._id}>
                            <EditTwoToneIcon className="action-icons" />
                          </Link>
                        </p>
                      ))}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <th className="text-center" colSpan="6">
                    Not Found
                  </th>
                </tr>
              )}
            </tbody>
          </table>
          {comparisons?.data.length > 0 ? (
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
      </div>
    </React.Fragment>
  );
};

export default GetProductVs;
