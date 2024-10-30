const NBT = require("parsenbt-js");

class MCStructure {
  constructor(buf) {
    this.snbt = NBT.Reader(buf, true, true);
  }
}

module.exports = MCStructure;