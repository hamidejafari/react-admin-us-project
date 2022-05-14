import React, { useEffect, useState } from "react";
import {
  Button,
  Pagination,
  Grid,
  CircularProgress,
  TextField,
} from "@mui/material";
import EditTwoToneIcon from "@mui/icons-material/EditTwoTone";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import Select from "react-select";
import qs from "qs";
import { Link } from "react-router-dom";
import AddCircleTwoToneIcon from "@mui/icons-material/AddCircleTwoTone";
import { useSelector, shallowEqual } from "react-redux";
import DeleteForeverTwoToneIcon from "@mui/icons-material/DeleteForeverTwoTone";
import { useDispatch } from "react-redux";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useParams } from "react-router";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import { DateTimePicker } from "@mui/lab";
import ReplyTwoToneIcon from "@mui/icons-material/ReplyTwoTone";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import { getCountAction } from "../../../redux/slices/countSlice";
import useDeleteRow from "../../../hooks/useDeleteRow";
import DeleteModal from "../../../components/UI/DeleteModal/DeleteModal";
import useGetData from "../../../hooks/useGetData";
import SkeletonTableLoading from "../../../components/UI/SkeletonTableLoading/SkeletonTableLoading";
import AppModal from "../../../components/UI/AppModal/AppModal";
import useQueryParam from "../../../hooks/useQueryParam";
import useEditRow from "../../../hooks/useEditRow";
import axiosInstance from "../../../utiles/axiosInstance";


const statusOptions = [
  { label: "pending", value: "pending" },
  { label: "accepted", value: "accepted" },
  { label: "denied", value: "denied" },
];

const ReviewGet = () => {
  const [pageCount, setPageCount] = useState();
  const [currentPage, setCurrentPage] = useState(null);
  const [params, setParams] = useQueryParam("page");
  const [refreshData, setRefreshData] = useState(false);
  const [title, setTitle] = useState();
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [star, setStar] = useState();
  const [selectedStatusSearch, setSelectedStatusSearch] = useState(null);

  const [myQuery, setMyQuery] = useState();
  const { onModel } = useParams();

  const [fetchBrandLoading, setFetchBrandLoading] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [brandOptions, setBrandOptions] = useState([]);
  const dispatch = useDispatch();

  const brands = async () => {
    setFetchBrandLoading(true);
    const { data } = await axiosInstance.get("/admin/product-parents");
    setFetchBrandLoading(false);
    const opt2 = [];
    for (const e of data.brands) {
      opt2.push({
        label: e.title,
        value: e._id,
      });
    }
    setBrandOptions(opt2);
  };

  const [fetchProductLoading, setFetchProductLoading] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productOptions, setProductOptions] = useState([]);

  const products = async () => {
    setFetchProductLoading(true);
    const { data } = await axiosInstance.get("/admin/products-all");
    setFetchProductLoading(false);
    const opt2 = [];
    // console.log(data.data);
    for (const e of data.data) {
      opt2.push({
        label: e.title,
        value: e._id,
      });
    }
    setProductOptions(opt2);
  };

  useEffect(() => {
    brands();
    products();
  }, []);

  useEffect(() => {
    dispatch(getCountAction);
  }, [dispatch, onModel]);

  const { loading, data: reviews, setData: setReviews, getData } = useGetData();

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

    let pageQuery = "page=" + currentPage;

    if (onModel) {
      pageQuery = pageQuery + "&onModel=" + onModel;
    }
    if (myQuery) {
      getData("/admin/reviews?" + pageQuery + "&" + myQuery);
    } else {
      getData("/admin/reviews?" + pageQuery);
    }
  }, [getData, currentPage, refreshData, myQuery, onModel]);

  useEffect(() => {
    if (!reviews) {
      return;
    }
    setPageCount(reviews.meta?.lastPage || 0);
  }, [reviews]);

  const handleChangePage = (_, page) => {
    if (currentPage && +page === currentPage) {
      return;
    }
    setParams(+page);
  };

  const statusStyle = (status) => {
    if (status === "pending") {
      return "rgba(25, 149, 210, 0.08)";
    }
    if (status === "accepted") {
      return "rgba(25, 210, 63, 0.07)";
    }
    if (status === "denied") {
      return "rgba(210, 25, 25, 0.16)";
    }
  };

  const {
    modalOpenEdit,
    editLoading,
    editHandler,
    openModalHandlerEdit,
    setModalOpenEdit,
    selectedStatus,
    userEmail,
    setSelectedStatus,
    showHomePage,
    setShowHomePage,
    createdAt,
    setCreatedAt,
    contentReview,
    setContentReview,
    reviewStar,
    setReviewStar,
  } = useEditRow(
    "/admin/reviews/",
    setReviews,
    setRefreshData,
    dispatch,
    getCountAction
  );

  const handleClose = () => setModalOpenEdit(false);

  const [modalSearchOpen, setModalSearchOpen] = useState(false);
  const openSearchModalHandler = (id) => {
    setModalSearchOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let myQuerySearch = {};
    if (title) {
      myQuerySearch.title = title;
    }
    if (name) {
      myQuerySearch.name = name;
    }
    if (email) {
      myQuerySearch.email = email;
    }
    if (star) {
      myQuerySearch.star = star;
    }
    if (selectedStatusSearch) {
      myQuerySearch.status = selectedStatusSearch.value;
    }

    if (selectedBrand) {
      let brandIds = "";
      selectedBrand.forEach((item, index) => {
        if (index !== 0) {
          brandIds = brandIds + "," + item.value;
        } else {
          brandIds = brandIds + item.value;
        }
      });
      myQuerySearch.brandIds = brandIds;
    }

    if (selectedProduct) {
      let productIds = "";
      selectedProduct.forEach((item, index) => {
        if (index !== 0) {
          productIds = productIds + "," + item.value;
        } else {
          productIds = productIds + item.value;
        }
      });
      myQuerySearch.productIds = productIds;
    }

    myQuerySearch = qs.stringify(myQuerySearch);
    setMyQuery(myQuerySearch);
    setCurrentPage(1);
    setParams(1);
    setModalSearchOpen(false);
  };

  const {
    modalOpen,
    deleteLoading,
    deleteHandler,
    openModalHandler,
    setModalOpen,
  } = useDeleteRow("/admin/reviews/", setReviews);

  const userRoutes = useSelector(
    (state) => state.user?.user?.routes,
    shallowEqual
  );

  return (
    <React.Fragment>
      <div className="card mb-12rem">
        <AppModal
          setOpen={setModalOpenEdit}
          open={modalOpenEdit}
          width="width-large"
        >
          <div className="modal-content">
            <div className="modal-header">
              <CloseRoundedIcon
                className="cursor-pointer"
                onClick={handleClose}
              />
            </div>

            <div className="modal-body">
              {userEmail === "fat@gmail.com" ? (
                <>
                  <div className="mb-3">
                    <label className="form-label" htmlFor="contentReview">
                      content
                    </label>
                    <textarea
                      id="contentReview"
                      className={`form-input`}
                      onChange={(e) => setContentReview(e.target.value)}
                      value={contentReview || ""}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label" htmlFor="star">
                      Star
                    </label>
                    <input
                      type="text"
                      id="star"
                      className={`form-input`}
                      onChange={(e) => setReviewStar(e.target.value)}
                      value={reviewStar || ""}
                    />
                  </div>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DateTimePicker
                      renderInput={(props) => <TextField {...props} />}
                      label="DateTimePicker"
                      value={createdAt}
                      onChange={(newValue) => {
                        setCreatedAt(newValue);
                      }}
                    />
                  </LocalizationProvider>
                </>
              ) : (
                <p>{contentReview}</p>
              )}
              <div style={{ zIndex: 2 }} className="position-relative">
                <label className="form-label" htmlFor="status">
                  Status
                </label>
                <Select
                  id="status"
                  value={selectedStatus}
                  onChange={(selectedStatus) => {
                    setSelectedStatus(selectedStatus);
                  }}
                  options={statusOptions}
                  isClearable
                />
              </div>

              <div className="my-4 form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={showHomePage || false}
                  onChange={(e) => setShowHomePage(e.target.checked)}
                  id="showHomePage"
                />
                <label className="form-check-label" htmlFor="showHomePage">
                  Show Home Page
                </label>
              </div>
              <div className="py-5"></div>
            </div>

            <div className="modal-footer">
              <Button variant="contained" onClick={handleClose} type="button">
                Close
              </Button>
              <Button
                disabled={editLoading}
                onClick={editHandler}
                variant="contained"
                color="error"
                type="button"
                sx={{ marginLeft: "0.5rem" }}
              >
                Save
              </Button>
            </div>
          </div>
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
                        Subject
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
                      <label className="form-label" htmlFor="name">
                        Name
                      </label>
                      <input
                        className="form-input"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value, "")}
                      />
                    </div>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <div className="mb-3">
                      <label className="form-label" htmlFor="email">
                        Email
                      </label>
                      <input
                        className="form-input"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value, "")}
                      />
                    </div>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <div className="mb-3">
                      <label className="form-label" htmlFor="star">
                        Star
                      </label>
                      <input
                        className="form-input"
                        id="star"
                        value={star}
                        onChange={(e) => setStar(e.target.value, "")}
                      />
                    </div>
                  </Grid>

                  <Grid item xs={12} md={12}>
                    <div className="mb-3">
                      <label className="form-label" htmlFor="status">
                        Status
                      </label>
                      <Select
                        id="status"
                        isLoading={false}
                        value={selectedStatusSearch}
                        onChange={(value) => {
                          setSelectedStatusSearch(value);
                        }}
                        options={statusOptions}
                        isClearable
                      />
                    </div>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <div className="mb-3">
                      <label className="form-label" htmlFor="title">
                        Brand
                      </label>
                      <Select
                        id="brand"
                        isLoading={fetchBrandLoading}
                        value={selectedBrand}
                        onChange={(selectedBrand) => {
                          setSelectedBrand(selectedBrand);
                        }}
                        options={brandOptions}
                        isClearable
                        isMulti
                      />
                    </div>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <div className="mb-3">
                      <label className="form-label" htmlFor="title">
                        Product
                      </label>
                      <Select
                        id="product"
                        isLoading={fetchProductLoading}
                        value={selectedProduct}
                        onChange={(selectedProduct) => {
                          setSelectedProduct(selectedProduct);
                        }}
                        options={productOptions}
                        isClearable
                        isMulti
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

        <AppModal setOpen={setModalOpen} open={modalOpen} width="width-normal">
          <DeleteModal
            deleteLoading={deleteLoading}
            setOpen={setModalOpen}
            header={"delete review"}
            deleteHandler={() => {
              deleteHandler();
              dispatch(getCountAction);
            }}
            content={"Are You Sure?"}
          />
        </AppModal>

        <span
          onClick={() => {
            openSearchModalHandler();
          }}
          className="cursor-pointer me-3"
          style={{ marginLeft: "10px" }}
        >
          <Button variant="contained">Search</Button>
        </span>

        <Button variant="contained" component={Link} to="/reviews/create">
          <AddCircleTwoToneIcon style={{ fontSize: 18, marginRight: "5px" }} />
          New Review
        </Button>

        <div className="scroll-x mt-4">
          <table className="table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Subject</th>
                <th scope="col">Name</th>
                <th scope="col">Email</th>
                <th scope="col">Star</th>
                <th scope="col">Date</th>
                <th scope="col">For</th>
                <th scope="col">Status</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <SkeletonTableLoading column={9} />
              ) : reviews?.data?.length > 0 ? (
                reviews?.data.map((review, index) => (
                  <tr
                    key={review._id}
                    style={{
                      background: statusStyle(review.status),
                    }}
                  >
                    <th scope="row">{index + 1}</th>
                    <td>{review.title}</td>
                    <td>{review.name}</td>
                    <td>{review.email}</td>
                    <td>{review.star}</td>
                    <td>
                      {new Date(review.createdAt).toLocaleString("en-GB")}
                    </td>
                    <td>{review.modelId?.title + " | " + review.onModel}</td>
                    <td>{review.status}</td>
                    <td className="white-space-nowrap">
                      <span
                        onClick={() => {
                          window.tinymce?.remove();
                          setTimeout(() => {
                            window.tinymce?.init({
                              selector: "#contentReview",
                              height: 300,
                              menubar: false,
                              plugins: "code autolink link",
                              toolbar: "undo redo | code | link",
                            });
                          }, 1000);
                          openModalHandlerEdit(
                            review._id,
                            review.status,
                            review.content,
                            review.showHomePage,
                            review.email,
                            review.createdAt,
                            review.star
                          );
                        }}
                        className="cursor-pointer"
                      >
                        <Button variant="contained" color="info">
                          <EditTwoToneIcon />
                          Change Status
                        </Button>
                      </span>
                      <span>
                        <a
                          target="_blank"
                          rel="noreferrer"
                          className=" ms-3"
                          href={
                            review.onModel === "brand"
                              ? "https://brandsreviews.com/brand/" +
                                review.modelId?.slug
                              : review.onModel === "blog"
                              ? "https://brandsreviews.com/blog/" +
                                review.modelId?.slug
                              : "https://brandsreviews.com/" +
                                review.modelId?.slug
                          }
                        >
                          <VisibilityIcon className="action-icons" />
                        </a>
                      </span>
                      <span>
                        <Link
                          className=" ms-3"
                          to={"/reviews/reply/" + review._id}
                        >
                          <ReplyTwoToneIcon className="action-icons" />
                        </Link>
                      </span>

                      {userRoutes.includes("/reviews/delete") && (
                        <span
                          onClick={() => {
                            openModalHandler(review._id);
                          }}
                          className="cursor-pointer ms-3"
                        >
                          <DeleteForeverTwoToneIcon className="action-icons color-red-500 " />
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <th className="text-center" colSpan="9">
                    Not Found
                  </th>
                </tr>
              )}
            </tbody>
          </table>
          {reviews?.data.length > 0 ? (
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

export default ReviewGet;
