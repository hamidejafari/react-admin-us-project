import React, { useEffect, useState } from "react";
import { Button, Pagination, Grid, CircularProgress } from "@mui/material";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import qs from "qs";
import Select from "react-select";
import { useSelector, shallowEqual } from "react-redux";
import RestorePageRoundedIcon from "@mui/icons-material/RestorePageRounded";

import useGetData from "../../../hooks/useGetData";
import useRestoreRow from "../../../hooks/useRestoreRow";
import SkeletonTableLoading from "../../../components/UI/SkeletonTableLoading/SkeletonTableLoading";
import AppModal from "../../../components/UI/AppModal/AppModal";
import useQueryParam from "../../../hooks/useQueryParam";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import axiosInstance from "../../../utiles/axiosInstance";
import RestoreModal from "../../../components/UI/RestoreModal/RestoreModal";

const ProductGet = () => {
  const {
    loading,
    data: products,
    setData: setproducts,
    getData,
  } = useGetData();

  const [pageCount, setPageCount] = useState();
  const [currentPage, setCurrentPage] = useState(null);
  const [params, setParams] = useQueryParam("page");
  const [title, setTitle] = useState();
  const [slug, setSlug] = useState();
  const [myQuery, setMyQuery] = useState();

  const [fetchParentLoading, setFetchParentLoading] = useState(null);

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryOptions, setCategoryOptions] = useState([]);

  const [selectedBrand, setSelectedBrand] = useState(null);
  const [brandOptions, setBrandOptions] = useState([]);

  const parents = async () => {
    setFetchParentLoading(true);
    const { data } = await axiosInstance.get("/admin/product-parents");
    setFetchParentLoading(false);
    const opt = [];
    for (const e of data.categories) {
      opt.push({
        label: e.title,
        value: e._id,
      });
    }
    setCategoryOptions(opt);
    const opt2 = [];
    for (const e of data.brands) {
      opt2.push({
        label: e.title,
        value: e._id,
      });
    }
    setBrandOptions(opt2);
  };

  useEffect(() => {
    parents();
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

    getData("/admin/products/trash?page=" + currentPage + "&" + myQuery);
  }, [getData, currentPage, myQuery]);

  useEffect(() => {
    if (!products) {
      return;
    }
    setPageCount(products.meta?.lastPage || 0);
  }, [products]);

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
  } = useRestoreRow("/admin/products/restore/", setproducts);

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
    if (selectedBrand) {
      let brandIds = "";
      selectedBrand.forEach((cat, index) => {
        if (index !== 0) {
          brandIds = brandIds + "," + cat.value;
        } else {
          brandIds = brandIds + cat.value;
        }
      });
      myQuerySearch.brandIds = brandIds;
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
        <div className="d-flex w-100 justify-content-space-between">
          <div>
            <Button
              variant="contained"
              style={{ marginLeft: 10 }}
              onClick={() => {
                openSearchModalHandler();
              }}
            >
              <ManageSearchIcon style={{ fontSize: 18, marginRight: "5px" }} />
              Search
            </Button>
          </div>
        </div>

        <AppModal setOpen={setModalOpen} open={modalOpen} width="width-normal">
          <RestoreModal
            deleteLoading={deleteLoading}
            setOpen={setModalOpen}
            header={"restore product"}
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
                        Category
                      </label>
                      <Select
                        id="category"
                        isLoading={fetchParentLoading}
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

                  <Grid item xs={12} md={6}>
                    <div className="mb-3">
                      <label className="form-label" htmlFor="title">
                        Brand
                      </label>
                      <Select
                        id="brand"
                        isLoading={fetchParentLoading}
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

        <div className="scroll-x mt-4">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th scope="col" className={"text-center"}>
                  #
                </th>
                <th scope="col" className={"text-center"}>
                  Name
                </th>
                <th scope="col" className={"text-center"}>
                  Category
                </th>
                <th scope="col" className={"text-center"}>
                  Brand
                </th>
                <th scope="col" className={"text-center"}>
                  Star
                </th>
                <th scope="col" className={"text-center"}>
                  Site Url
                </th>
                <th scope="col" className={"text-center"}>
                  Click Site Count
                </th>
                <th scope="col" className={"text-center"}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <SkeletonTableLoading column={8} />
              ) : products?.data?.length > 0 ? (
                products?.data.map((product, index) => (
                  <tr key={product._id}>
                    <th scope="row" className={"text-center"}>
                      {index + 1}
                    </th>
                    <td className={"text-center"}>{product.title}</td>
                    <td className={"text-center"}>
                      {product.categoryId?.title}
                    </td>
                    <td className={"text-center"}>{product.brandId?.title}</td>
                    <td className={"text-center"}>{product.star}</td>
                    <td className={"text-center"}>{product.siteUrl}</td>
                    <td className={"text-center"}>{product.clickSiteCount}</td>
                    <td className={"text-center white-space-nowrap"}>
                      {userRoutes.includes("/brands/delete") && (
                        <span
                          onClick={() => {
                            openModalHandler(product._id);
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
                  <th className="text-center" colSpan="8">
                    Not Found
                  </th>
                </tr>
              )}
            </tbody>
          </table>

          {products?.data.length > 0 ? (
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

export default ProductGet;
