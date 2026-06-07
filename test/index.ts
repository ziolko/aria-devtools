import "mocha";
import "mocha/mocha.css";

mocha.setup("bdd");

require('./aria-mapping.test')
require("./dynamic-html.test");
require("./shadow-dom.test");
require("./accessible-name.test");
require("./relations.test");
require("./tables.test");
require("./visibility.test");

mocha.run();
