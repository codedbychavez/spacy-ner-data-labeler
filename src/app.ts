import * as classes from "./css/index.scss";

import { home } from "./scripts/home";

const app = {
  init() {
    home.init();
  },
};

app.init();

document.body.className = classes.body;
