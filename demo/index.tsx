import * as React from "react";
import ReactDOM from "react-dom";
import { hot } from "react-hot-loader";
import Demo from "./Demo";

const Index = hot(module)(() => {
  return (
    <React.Fragment>
      <Demo />
    </React.Fragment>
  );
});

ReactDOM.render(<Index />, document.getElementById("app"));
