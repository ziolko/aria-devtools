import "mocha";
import "mocha/mocha.css";

mocha.setup("bdd");

require('./aria-mapping.test')
require("./dynamic-html.test");
require("./accessible-name.test");
require("./relations.test");
require("./tables.test");

mocha.run();
