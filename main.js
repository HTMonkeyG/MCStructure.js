const NBT = require("parsenbt-js");

class MCStructure {
  /**
   * Deserialize mcstructure from blob.
   * @param {ArrayBuffer} buf 
   * @returns {MCStructure}
   */
  static deserialize(buf) {
    var snbt = NBT.Reader(buf, true, true)["comp>"]
      , stru = snbt["comp>structure"]
      , result = new MCStructure(
        snbt["list>size"][1],
        snbt["list>size"][2],
        snbt["list>size"][3]
      );
    result.origin = {
      x: snbt["list>structure_world_origin"][1],
      y: snbt["list>structure_world_origin"][2],
      z: snbt["list>structure_world_origin"][3]
    };
    result.version = snbt["i32>format_version"];
    result.blockIndices.extron = Int32Array.from(stru["list>block_indices"][1].slice(1));
    result.blockIndices.intron = Int32Array.from(stru["list>block_indices"][2].slice(1));
    result.entities = stru["list>entities"].slice(1);
    result.palette.block = stru["comp>palette"]["comp>default"]["list>block_palette"].slice(1);
    result.palette.blockEntity = stru["comp>palette"]["comp>default"]["comp>block_position_data"];

    return result
  }

  /**
   * Remove unused blocks in structure.
   * 
   * Changes original object.
   * @param {MCStructure} a 
   * @returns {MCStructure}
   */
  static makePruned(a) {
    var bitset = new Uint8Array(Math.ceil(a.palette.block.length / 8))
      , map = new Int32Array(a.palette.block.length);

    for (var d of a.blockIndices.intron)
      if (d >= 0)
        bitset[d >> 8] |= 1 << d & 7;
    for (var d of a.blockIndices.extron)
      if (d >= 0)
        bitset[d >> 8] |= 1 << d & 7;

    for (var i = 0, j = 0; i < a.palette.block.length; i++)
      if (bitset[i >> 8] & (1 << i & 7)) {
        map[i] = j;
        j++;
      } else
        a.palette.block.splice(i), delete a.palette.blockEntity["comp>" + i];

    for (var i = 0, j = a.getVolume(); i < j; i++) {
      if (a.blockIndices.extron[i] >= 0)
        a.blockIndices.extron[i] = map[a.blockIndices.extron[i]];
      if (a.blockIndices.intron[i] >= 0)
        a.blockIndices.intron[i] = map[a.blockIndices.intron[i]];
    }

    return a
  }

  /**
   * Create a mcstructure with given size.
   * @param {Number} xL - X side length
   * @param {Number} yL - Y side length
   * @param {Number} zL - Z side length
   */
  constructor(xL, yL, zL) {
    if (xL < 0 || yL < 0 || zL < 0 || xL * yL * zL > 1073741824)
      throw new Error("Invalid structure size");

    this.version = 1;
    this.size = {
      xL: xL,
      yL: yL,
      zL: zL
    };
    this.origin = {
      x: 0,
      y: 0,
      z: 0
    };
    this.blockIndices = {
      extron: new Int32Array(xL * yL * zL),
      intron: new Int32Array(xL * yL * zL)
    };
    this.palette = {
      block: [],
      blockEntity: {}
    }
    this.entities = [];

    // Specify the layer where the operation is performed.
    this.operationOnLayer = "extron";
  }

  /**
   * Get volume of of the structure.
   * @returns {Number}
   */
  getVolume() {
    return this.size.xL * this.size.yL * this.size.zL
  }

  /**
   * Get block.
   * @param {Object} pos 
   * @param {Number} pos.x
   * @param {Number} pos.y
   * @param {Number} pos.z
   */
  getBlock(pos) {
    var x = pos.x % this.size.xL
      , y = pos.y % this.size.yL
      , z = pos.z % this.size.zL
      , index = z + this.size.zL * (y + this.size.yL * x)
      , block = this.blockIndices[this.operationOnLayer][index];

    return this.palette.block[block];
  }

  /**
   * Get block entity.
   * @param {Object} pos 
   * @param {Number} pos.x
   * @param {Number} pos.y
   * @param {Number} pos.z
   * @returns 
   */
  getBlockData(pos) {
    var x = pos.x % this.size.xL
      , y = pos.y % this.size.yL
      , z = pos.z % this.size.zL
      , index = z + this.size.zL * (y + this.size.yL * x)

    return this.palette.blockEntity["comp>" + index]["comp>block_entity_data"];
  }

  /**
   * Place a block.
   * @param {Object} pos 
   * @param {Number} pos.x
   * @param {Number} pos.y
   * @param {Number} pos.z
   * @param {*} block 
   * @returns {Boolean}
   */
  setBlock(pos, block) {
    var x = pos.x % this.size.xL
      , y = pos.y % this.size.yL
      , z = pos.z % this.size.zL
      , index = z + this.size.zL * (y + this.size.yL * x);

    for (var i = 0; i < this.palette.block.length; i++)
      if (NBT.equal(this.palette.block[i], block)) {
        this.blockIndices[this.operationOnLayer][index] = i;
        return true
      }

    this.palette.block.push(block);
    this.blockIndices[this.operationOnLayer][index] = this.palette.block.length - 1;
    return true
  }

  /**
   * Set the block entity of a block.
   * @param {Object} pos 
   * @param {Number} pos.x
   * @param {Number} pos.y
   * @param {Number} pos.z
   * @param {*} nbt 
   * @returns {Boolean}
   */
  setBlockData(pos, nbt) {
    var x = pos.x % this.size.xL
      , y = pos.y % this.size.yL
      , z = pos.z % this.size.zL
      , index = z + this.size.zL * (y + this.size.yL * x);

    this.palette.blockEntity["comp>" + index]["comp>block_entity_data"] = nbt;
    nbt["i32>x"] = x - this.origin.x;
    nbt["i32>y"] = y - this.origin.y;
    nbt["i32>z"] = z - this.origin.z;

    return true
  }

  fill(from, to, block) {

  }

  summon(pos, entity) {

  }

  /**
   * Serialize MCStructure object to ArrayBuffer.
   * @returns {ArrayBuffer}
   */
  serialze() {
    var result = NBT.create()
      , stru = NBT.create();

    result["list>size"] = ["i32", this.size.xL, this.size.yL, this.size.zL];
    result["list>structure_world_origin"] = ["i32", this.origin.x, this.origin.y, this.origin.z];
    result["i32>format_version"] = this.version;
    result["comp>structure"] = stru;
    stru["list>block_indices"] = [
      "list",
      ['i32', ...this.blockIndices.extron],
      ['i32', ...this.blockIndices.intron]
    ];
    stru["list>entities"] = ["comp", ...this.entities];
    stru["comp>palette"] = NBT.create();
    stru["comp>palette"]["comp>default"] = NBT.create();
    stru["comp>palette"]["comp>default"]["list>block_palette"] = [
      "comp",
      ...this.palette.block
    ];
    stru["comp>palette"]["comp>default"]["comp>block_position_data"] = this.palette.blockEntity;

    return NBT.Writer(result, true, true)
  }
}

module.exports = MCStructure;