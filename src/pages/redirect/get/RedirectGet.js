import React, { useEffect, useState } from "react";
import { Button, Pagination,Grid ,CircularProgress} from "@mui/material";
import { Link } from "react-router-dom";
import EditTwoToneIcon from "@mui/icons-material/EditTwoTone";
import DeleteForeverTwoToneIcon from "@mui/icons-material/DeleteForeverTwoTone";
import AddCircleTwoToneIcon from "@mui/icons-material/AddCircleTwoTone";
import qs from "qs";

import useGetData from "../../../hooks/useGetData";
import useDeleteRow from "../../../hooks/useDeleteRow";
import SkeletonTableLoading from "../../../components/UI/SkeletonTableLoading/SkeletonTableLoading";
import AppModal from "../../../components/UI/AppModal/AppModal";
import DeleteModal from "../../../components/UI/DeleteModal/DeleteModal";
import useQueryParam from "../../../hooks/useQueryParam";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

const RedirectGet = () => {
  const [pageCount, setPageCount] = useState();
  const [currentPage, setCurrentPage] = useState(null);
  const [address, setAddress] = useState("");
  const [params, setParams] = useQueryParam("page");
  const [myQuery, setMyQuery] = useState();

  const {
    loading,
    data: redirects,
    setData: setRedirects,
    getData,
  } = useGetData();

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
      getData("/admin/redirects?page=" + currentPage + "&" + myQuery);
    } else {
      getData("/admin/redirects?page=" + currentPage);
    }

  }, [getData, currentPage,myQuery]);

  useEffect(() => {
    if (!redirects) {
      return;
    }
    setPageCount(redirects.meta?.lastPage || 0);
  }, [redirects]);

  const handleChangePage = (_, page) => {
    if (currentPage && +page === currentPage) {
      return;
    }
    setParams(+page);
  };

  const {
    modalOpen,
    deleteLoading,
    deleteHandler,
    openModalHandler,
    setModalOpen,
  } = useDeleteRow("/admin/redirects/", setRedirects);


  const [modalSearchOpen, setModalSearchOpen] = useState(false);
  const openSearchModalHandler = (id) => {
    setModalSearchOpen(true);
  };
  const handleClose = () => setModalSearchOpen(false);


  const handleSubmit = async (e) => {
    e.preventDefault();
    let myQuerySearch = {};

    if (address) {
      myQuerySearch.address = address;
    }

    myQuerySearch = qs.stringify(myQuerySearch);
    setMyQuery(myQuerySearch);
    setCurrentPage(1);
    setParams(1);
    setModalSearchOpen(false);
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
                      <label className="form-label" htmlFor="address">
                        Address
                      </label>
                      <input
                        className="form-input"
                        id="address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value, "")}
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
            <Button
              variant="contained"
              component={Link}
              to="/redirects/create"
            >
              <AddCircleTwoToneIcon
                style={{ fontSize: 18, marginRight: "5px" }}
              />
              New Redirect
            </Button>
          </div>

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

        <AppModal setOpen={setModalOpen} open={modalOpen} width="width-normal">
          <DeleteModal
            deleteLoading={deleteLoading}
            setOpen={setModalOpen}
            header={"Delete Redirect"}
            deleteHandler={() => {
              deleteHandler();
            }}
            content={"Are You Sure?"}
          />
        </AppModal>




        <div className="scroll-x mt-4">
          <table className="table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Old Address</th>
                <th scope="col">New Address</th>
                <th scope="col">Redirect Type</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <SkeletonTableLoading column={5} />
              ) : redirects?.data?.length > 0 ? (
                redirects?.data.map((redirect, index) => (
                  <tr key={redirect._id}>
                    <th scope="row">{index + 1}</th>
                    <td>{redirect.oldAddress}</td>
                    <td>{redirect.newAddress}</td>
                    <td>{redirect.status}</td>

                    <td className="white-space-nowrap">
                      <Link
                        className="me-3"
                        to={"/redirects/" + redirect._id}
                      >
                        <EditTwoToneIcon className="action-icons" />
                      </Link>
                      <span
                        onClick={() => {
                          openModalHandler(redirect._id);
                        }}
                        className="cursor-pointer me-3"
                      >
                        <DeleteForeverTwoToneIcon className="action-icons color-red-500 " />
                      </span>
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
          {redirects?.data.length > 0 ? (
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

export default RedirectGet;
