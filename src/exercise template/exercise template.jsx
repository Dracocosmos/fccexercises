import ReactDOM from "react-dom";
import React from "react";
import { Provider } from "react-redux";

import $ from "jquery";

// for hot loading css
import "../../Public/exercise template/exercise template.css"
// for resetting to the exercise menu
import Reset from "../Reset";

ReactDOM.render(
  <Provider store={""}>
    <Reset></Reset>
    template
  </Provider>,
  $("root")[0]);
