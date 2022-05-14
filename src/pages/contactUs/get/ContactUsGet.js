import React, { useEffect, useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { Button, Pagination, Grid, CircularProgress } from "@mui/material";
import { Link } from "react-router-dom";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import qs from "qs";
import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import DeleteForeverTwoToneIcon from "@mui/icons-material/DeleteForeverTwoTone";

import useGetData from "../../../hooks/useGetData";
import SkeletonTableLoading from "../../../components/UI/SkeletonTableLoading/SkeletonTableLoading";
import AppModal from "../../../components/UI/AppModal/AppModal";
import useQueryParam from "../../../hooks/useQueryParam";
import axiosInstance from "../../../utiles/axiosInstance";
import { getCountAction } from "../../../redux/slices/countSlice";
import { useDispatch } from "react-redux";
import useDeleteRow from "../../../hooks/useDeleteRow";
import DeleteModal from "../../../components/UI/DeleteModal/DeleteModal";

const ContactUsGet = () => {
  const [pageCount, setPageCount] = useState();
  const [currentPage, setCurrentPage] = useState(null);
  const [params, setParams] = useQueryParam("page");
  const [title, setTitle] = useState();
  const [slug, setSlug] = useState();
  const [myQuery, setMyQuery] = useState();
  const [content, setContent] = useState("");
  const [modalDetailOpen, setModalDetailOpen] = useState(false);

  const {
    loading,
    data: contactUs,
    setData: setContactUs,
    getData,
  } = useGetData();

  const {
    modalOpen,
    deleteLoading,
    deleteHandler,
    openModalHandler,
    setModalOpen,
  } = useDeleteRow("/admin/contactUs/", setContactUs);

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

    getData("/admin/contactUs?page=" + currentPage + "&" + myQuery);
  }, [getData, currentPage, myQuery]);

  useEffect(() => {
    if (!contactUs) {
      return;
    }
    setPageCount(contactUs.meta?.lastPage || 0);
  }, [contactUs]);

  const handleChangePage = (_, page) => {
    if (currentPage && +page === currentPage) {
      return;
    }

    setParams(+page);
  };
  const dispatch = useDispatch();

  const [modalSearchOpen, setModalSearchOpen] = useState(false);
  const openSearchModalHandler = (id) => {
    setModalSearchOpen(true);
  };
  const handleClose = () => setModalSearchOpen(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let myQuerySearch = {};
    if (slug) {
      myQuerySearch.slug = slug;
    }
    if (title) {
      myQuerySearch.title = title;
    }
    myQuerySearch = qs.stringify(myQuerySearch);
    setMyQuery(myQuerySearch);
    setCurrentPage(1);
    setParams(1);

    setModalSearchOpen(false);
  };

  const userRoutes = useSelector(
    (state) => state.user?.user?.routes,
    shallowEqual
  );

  return (
    <React.Fragment>
      <div className="card mb-12rem">
        <AppModal setOpen={setModalOpen} open={modalOpen}>
          <DeleteModal
            deleteLoading={deleteLoading}
            setOpen={setModalOpen}
            header={"delete category"}
            deleteHandler={() => {
              deleteHandler();
            }}
            content={"Are You Sure?"}
          />
        </AppModal>

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
                  <Grid item xs={12} md={6}>
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

                  <Grid item xs={12} md={6}>
                    <div className="mb-3">
                      <label className="form-label" htmlFor="slug">
                        Slug
                      </label>
                      <input
                        className="form-input"
                        id="slug"
                        value={slug}
                        onChange={(e) => setSlug(e.target.value, "")}
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

        <AppModal setOpen={setModalDetailOpen} open={modalDetailOpen}>
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Detail</h5>
              <CloseRoundedIcon
                className="cursor-pointer"
                onClick={handleClose}
              />
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <Grid container spacing={2} justifyContent="center">
                  <Grid item xs={12} md={6}>
                    {content}
                  </Grid>
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
              style={{ marginLeft: 10 }}
            >
              <Button variant="contained">
                <ManageSearchIcon
                  style={{ fontSize: 18, marginRight: "5px" }}
                />
                Search
              </Button>
            </span>
          </div>

          {userRoutes.includes("/contactUs/delete") && (
            <Button
              variant="contained"
              style={{ marginLeft: "10px" }}
              component={Link}
              color={"error"}
              to="/contactUs/trash"
            >
              <DeleteForeverRoundedIcon
                style={{ fontSize: 18, marginRight: "5px" }}
              />
              Trash
            </Button>
          )}
        </div>

        <div className="scroll-x mt-4">
          <table className="table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">first name</th>
                <th scope="col">last name</th>
                <th scope="col">phone number</th>
                <th scope="col">email</th>
                <th scope="col">title</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <SkeletonTableLoading column={7} />
              ) : contactUs?.data?.length > 0 ? (
                contactUs?.data?.map((contact, index) => (
                  <tr
                    className={contact.hasRead ? "bg-success" : ""}
                    key={contact._id}
                  >
                    <th scope="row">{index + 1}</th>
                    <td>{contact.firstName}</td>
                    <td>{contact.lastName}</td>
                    <td>{contact.phoneNumber}</td>
                    <td>{contact.email}</td>
                    <td>{contact.title}</td>
                    <td className="white-space-nowrap">
                      <span
                        onClick={async () => {
                          setContent(contact.messageText);
                          setModalDetailOpen(true);
                          if (!contact.hasRead) {
                            setContactUs((con) => {
                              const i = con.data.findIndex(
                                (c) => c._id === contact._id
                              );
                              con.data[i].hasRead = true;
                              console.log(con);
                              return {...con};
                            });
                            await axiosInstance.patch(
                              "/admin/contactUs/" +
                                contact._id +
                                "/mark-as-read"
                            );
                            dispatch(getCountAction);
                          }
                        }}
                        className="me-3 cursor-pointer"
                      >
                        <VisibilityIcon className="action-icons" />
                      </span>
                      <span
                        onClick={async () => {
                          if (contact.hasRead) {
                            setContactUs((con) => {
                              const i = con.data.findIndex(
                                (c) => c._id === contact._id
                              );
                              con.data[i].hasRead = false;
                              return {...con};
                            });
                            await axiosInstance.patch(
                              "/admin/contactUs/" +
                                contact._id +
                                "/mark-as-unread"
                            );
                            dispatch(getCountAction);
                          }
                        }}
                        className="me-3 cursor-pointer"
                      >
                        <VisibilityOffIcon className="action-icons" />
                      </span>

                      <span
                        onClick={() => {
                          openModalHandler(contact._id);
                        }}
                        className="cursor-pointer me-3"
                      >
                        <DeleteForeverTwoToneIcon className="action-icons color-red-500" />
                      </span>
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
          {contactUs?.length > 0 ? (
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

export default ContactUsGet;
