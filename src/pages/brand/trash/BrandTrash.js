import React, { useEffect, useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { Button, Pagination, Grid, CircularProgress } from "@mui/material";
import RestorePageRoundedIcon from "@mui/icons-material/RestorePageRounded";
import Select from "react-select";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import qs from "qs";

import useGetData from "../../../hooks/useGetData";
import SkeletonTableLoading from "../../../components/UI/SkeletonTableLoading/SkeletonTableLoading";
import AppModal from "../../../components/UI/AppModal/AppModal";
import RestoreModal from "../../../components/UI/RestoreModal/RestoreModal";
import useQueryParam from "../../../hooks/useQueryParam";
import axiosInstance from "../../../utiles/axiosInstance";
import useRestoreRow from "../../../hooks/useRestoreRow";

const specialOptions = [
  { label: "Normal", value: "normal" },
  { label: "Friend", value: "friend" },
  { label: "Our Brand", value: "ourBrand" },
  { label: "Enemy", value: "enemy" },
];

const BrandTrash = () => {
  const [pageCount, setPageCount] = useState();
  const [currentPage, setCurrentPage] = useState(null);
  const [params, setParams] = useQueryParam("page");
  const [title, setTitle] = useState();
  const [slug, setSlug] = useState();
  const [myQuery, setMyQuery] = useState();
  const [selectedSpecial, setSelectedSpecial] = useState(null);

  const { loading, data: brands, setData: setbrands, getData } = useGetData();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [fethcCategotyLoading, setFethcCategotyLoading] = useState(null);
  const [categoryOptions, setCategoryOptions] = useState([]);

  const categories = async () => {
    setFethcCategotyLoading(true);
    const { data } = await axiosInstance.get("/admin/category-level-two");
    setFethcCategotyLoading(false);
    const opt = [];
    for (const e of data) {
      opt.push({
        label: e.title,
        value: e._id,
      });
    }
    setCategoryOptions(opt);
  };

  useEffect(() => {
    categories();
  }, []);

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

    getData("/admin/brands/trash?page=" + currentPage + "&" + myQuery);
  }, [getData, currentPage, myQuery]);

  useEffect(() => {
    if (!brands) {
      return;
    }
    setPageCount(brands.meta?.lastPage || 0);
  }, [brands]);

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
  } = useRestoreRow("/admin/brands/restore/", setbrands);

  const [modalSearchOpen, setModalSearchOpen] = useState(false);
  const openSearchModalHandler = (id) => {
    setModalSearchOpen(true);
  };
  const handleClose = () => setModalSearchOpen(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let myQuerySearch = {};
    if (selectedSpecial) {
      myQuerySearch.special = selectedSpecial.value;
    }
    if (slug) {
      myQuerySearch.slug = slug;
    }
    if (title) {
      myQuerySearch.title = title;
    }
    if (selectedCategory) {
      let categoryIds = "";
      selectedCategory.forEach((cat, index) => {
        if (index !== 0) {
          categoryIds = categoryIds + "," + cat.value;
        } else {
          categoryIds = categoryIds + cat.value;
        }
      });
      myQuerySearch.categoryIds = categoryIds;
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
        <AppModal setOpen={setModalOpen} open={modalOpen} width="width-normal">
          <RestoreModal
            deleteLoading={deleteLoading}
            setOpen={setModalOpen}
            header={"restore brand"}
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

                  <Grid item xs={12} md={6}>
                    <div className="mb-3">
                      <label className="form-label" htmlFor="title">
                        Special
                      </label>
                      <Select
                        id="level"
                        isLoading={false}
                        value={selectedSpecial}
                        onChange={(selectedSpecial) => {
                          setSelectedSpecial(selectedSpecial);
                        }}
                        options={specialOptions}
                        isClearable
                      />
                    </div>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <div className="mb-3">
                      <label className="form-label" htmlFor="title">
                        Category
                      </label>
                      <Select
                        id="category"
                        isLoading={fethcCategotyLoading}
                        value={selectedCategory}
                        onChange={(selectedCategory) => {
                          setSelectedCategory(selectedCategory);
                        }}
                        options={categoryOptions}
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

        <span
          onClick={() => {
            openSearchModalHandler();
          }}
          className="cursor-pointer me-3"
          style={{ marginLeft: 10 }}
        >
          <Button variant="contained">
            <ManageSearchIcon style={{ fontSize: 18, marginRight: "5px" }} />
            Search
          </Button>
        </span>

        <div className="scroll-x mt-4">
          <table className="table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Name</th>
                <th scope="col">Slug</th>
                <th scope="col">Image</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <SkeletonTableLoading column={5} />
              ) : brands?.data?.length > 0 ? (
                brands?.data.map((brand, index) => (
                  <tr key={brand._id}>
                    <th scope="row">{index + 1}</th>
                    <td>{brand.title}</td>
                    <td>{brand.slug}</td>
                    <td>
                      <img
                        className="table-img"
                        src={
                          brand.image
                            ? process.env.REACT_APP_BACKEND_API_URL +
                              "/" +
                              brand.image
                            : process.env.REACT_APP_BACKEND_API_URL +
                              "/files/images/placeholder/160x90.webp"
                        }
                        alt="brand"
                      />
                    </td>
                    <td className="white-space-nowrap">
                      {userRoutes.includes("/brands/delete") && (
                        <span
                          onClick={() => {
                            openModalHandler(brand._id);
                          }}
                          className="cursor-pointer me-3"
                        >
                          <RestorePageRoundedIcon className="action-icons" />
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <th className="text-center" colSpan="5">
                    Not Found
                  </th>
                </tr>
              )}
            </tbody>
          </table>
          {brands?.data.length > 0 ? (
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

export default BrandTrash;
