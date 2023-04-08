import React from "react";
import sad from "./images/sad.png";
const Error = () => {
  return (
    <>
      <img className="sad" src={sad} alt="" />
      <p className="p1">No Definitions Found</p>
      <p className="p2">
        Sorry pal, we couldn't find definitions for the word you were looking
        for. You can try the search again at later time or head to the web
        instead.
      </p>
    </>
  );
};
export default React.memo(Error);
