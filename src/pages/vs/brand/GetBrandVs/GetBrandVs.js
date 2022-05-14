import React, { useEffect, useState } from "react";
import { Button, Pagination } from "@mui/material";
import { Link } from "react-router-dom";
import EditTwoToneIcon from "@mui/icons-material/EditTwoTone";
import AddCircleTwoToneIcon from "@mui/icons-material/AddCircleTwoTone";

import useGetData from "../../../../hooks/useGetData";
import SkeletonTableLoading from "../../../../components/UI/SkeletonTableLoading/SkeletonTableLoading";
import useQueryParam from "../../../../hooks/useQueryParam";

const GetBrandVs = () => {
  const [myQuery] = useState();

  const [pageCount, setPageCount] = useState();
  const [currentPage, setCurrentPage] = useState(null);
  const [params, setParams] = useQueryParam("page");

  const { loading, data: comparisons, getData } = useGetData();

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
      getData(
        "/admin/comparisons/brand/grouped?page=" + currentPage + "&" + myQuery
      );
    } else {
      getData("/admin/comparisons/brand/grouped?page=" + currentPage);
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
      <div className="card mb-12rem">
        <Button variant="contained" component={Link} to="/vs/brand/create">
          <AddCircleTwoToneIcon style={{ fontSize: 18, marginRight: "5px" }} />
          New VS
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

export default GetBrandVs;
