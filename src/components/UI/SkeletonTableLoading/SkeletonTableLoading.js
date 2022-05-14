import { Skeleton } from "@mui/material";
import React from "react";

const SkeletonTableLoading = (props) => {
  const { column } = props;

  const row = (
    <tr>
      {new Array(column).fill(undefined).map((_, index) => (
        <td key={index}>
          <Skeleton />
        </td>
      ))}
    </tr>
  );

  return (
    <React.Fragment>
      {row}
      {row}
      {row}
      {row}
      {row}
      {row}
    </React.Fragment>
  );
};

export default SkeletonTableLoading;
