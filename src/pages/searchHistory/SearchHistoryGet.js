import React, { useEffect, useState } from "react";
import { Pagination } from "@mui/material";
import useGetData from "../../hooks/useGetData";
import SkeletonTableLoading from "../../components/UI/SkeletonTableLoading/SkeletonTableLoading";
import useQueryParam from "../../hooks/useQueryParam";

const SearchHistoryGet = () => {
  const [pageCount, setPageCount] = useState();
  const [currentPage, setCurrentPage] = useState(null);
  const [params, setParams] = useQueryParam("page");

  const { loading, data: searchHistory, getData } = useGetData();

  useEffect(() => {
    if (!currentPage) {
      return;
    }

    let pageQuery = "page=" + currentPage;

    getData("/admin/search-history?" + pageQuery);
  }, [getData, currentPage]);

  useEffect(() => {
    if (!params) {
      setCurrentPage(1);
      return;
    }
    setCurrentPage(+params);
  }, [params]);

  const handleChangePage = (_, page) => {
    if (currentPage && +page === currentPage) {
      return;
    }
    setParams(+page);
  };

  useEffect(() => {
    if (!searchHistory) {
      return;
    }
    setPageCount(searchHistory.meta?.lastPage || 0);
  }, [searchHistory]);

  return (
    <React.Fragment>
      <div className="card mb-12rem">
        <div className="scroll-x mt-4">
          <table className="table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">term</th>
                <th scope="col">userAgent</th>
                <th scope="col">createdAt</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <SkeletonTableLoading column={9} />
              ) : searchHistory?.data?.length > 0 ? (
                searchHistory?.data.map((review, index) => (
                  <tr key={review._id}>
                    <th scope="row">{index + 1}</th>
                    <td>{review._source.term}</td>
                    <td>{review._source.userAgent}</td>
                    <td>{review._source.createdAt}</td>
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
          {searchHistory?.data.length > 0 ? (
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

export default SearchHistoryGet;
