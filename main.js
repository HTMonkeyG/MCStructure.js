const NBT = require("parsenbt-js");

function clamp(x, a, b) {
  return x < a ? a : x > b ? b : x
}

class MCStructure {
  /**
   * Deserialize mcstructure from blob.
   * @param {ArrayBuffer} buf - Input buffer
   * @returns {MCStructure}
   */
  static deserialize(buf) {
    var snbt = NBT.Reader(buf, { littleEndian: true, asProxy: true })["obj>"]
      , stru = snbt["obj>structure"]
      , result = new MCStructure(
        snbt["lst>size"][1],
        snbt["lst>size"][2],
        snbt["lst>size"][3]
      );
    result.origin = {
      x: snbt["lst>structure_world_origin"][1],
      y: snbt["lst>structure_world_origin"][2],
      z: snbt["lst>structure_world_origin"][3]
    };
    result.version = snbt["i32>format_version"];
    result.blockIndices.extron = Int32Array.from(stru["lst>block_indices"][1].slice(1));
    result.blockIndices.intron = Int32Array.from(stru["lst>block_indices"][2].slice(1));
    result.entities = stru["lst>entities"].slice(1);
    result.palette.block = stru["obj>palette"]["obj>default"]["lst>block_palette"].slice(1);
    result.palette.blockEntity = stru["obj>palette"]["obj>default"]["obj>block_position_data"];

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
        a.palette.block.splice(i);

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
   * @param {number} xL - X side length.
   * @param {number} yL - Y side length.
   * @param {number} zL - Z side length.
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
      extron: new Int32Array(xL * yL * zL).fill(-1),
      intron: new Int32Array(xL * yL * zL).fill(-1)
    };
    this.palette = {
      block: [],
      blockEntity: {}
    }
    this.entities = [];

    // Entity ID
    this.uniqueID = 0n;

    // Specify the layer where the operation is performed.
    this.operationOnLayer = "extron";
  }

  /**
   * Get volume of of the structure.
   * @returns {number}
   */
  getVolume() {
    return this.size.xL * this.size.yL * this.size.zL
  }

  /**
   * Get the size of of the structure.
   * @returns {{x:number, y:number, z:number}}
   */
  getSize() {
    return {
      x: this.size.xL,
      y: this.size.yL,
      z: this.size.zL
    };
  }

  /**
   * Get a block in the structure.
   * @param {object} pos - Position in the structure.
   * @param {number} pos.x - Pos X.
   * @param {number} pos.y - Pos Y.
   * @param {number} pos.z - Pos Z.
   * @returns {object}
   */
  getBlock(pos) {
    var x = clamp(pos.x, 0, this.size.xL)
      , y = clamp(pos.y, 0, this.size.yL)
      , z = clamp(pos.z, 0, this.size.zL)
      , index = z + this.size.zL * (y + this.size.yL * x)
      , block = this.blockIndices[this.operationOnLayer][index];

    return this.palette.block[block];
  }

  /**
   * Get block entity.
   * @param {object} pos - Position in the structure.
   * @param {number} pos.x - Pos X.
   * @param {number} pos.y - Pos Y.
   * @param {number} pos.z - Pos Z.
   * @returns {object}
   */
  getBlockData(pos) {
    var x = clamp(pos.x, 0, this.size.xL)
      , y = clamp(pos.y, 0, this.size.yL)
      , z = clamp(pos.z, 0, this.size.zL)
      , index = z + this.size.zL * (y + this.size.yL * x)

    return this.palette.blockEntity["obj>" + index]["obj>block_entity_data"];
  }

  /**
   * Get specified entity.
   * @param {BigInt|number} uniqueID - Entity ID.
   * @returns {object|null} The specified entity or null.
   */
  getEntity(uniqueID) {
    for (var e of this.entities)
      if (e["i64>UniqueID"] == BigInt(uniqueID))
        return e;
    return null
  }

  /**
   * Place a block, and put given NBT data into block indices.
   * @param {object} pos - Position in the structure.
   * @param {number} pos.x - Pos X.
   * @param {number} pos.y - Pos Y.
   * @param {number} pos.z - Pos Z.
   * @param {object} block - Data of the block.
   * @returns {boolean}
   */
  setBlock(pos, block) {
    var x = clamp(pos.x, 0, this.size.xL)
      , y = clamp(pos.y, 0, this.size.yL)
      , z = clamp(pos.z, 0, this.size.zL)
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
   * @param {object} pos - Position in the structure.
   * @param {number} pos.x - Pos X.
   * @param {number} pos.y - Pos Y.
   * @param {number} pos.z - Pos Z.
   * @param {object} nbt - Block entity data.
   * @returns {boolean}
   */
  setBlockData(pos, nbt) {
    var x = clamp(pos.x, 0, this.size.xL)
      , y = clamp(pos.y, 0, this.size.yL)
      , z = clamp(pos.z, 0, this.size.zL)
      , index = z + this.size.zL * (y + this.size.yL * x)
      , be = NBT.create(true)
      , bd;

    bd = be["obj>block_entity_data"] = NBT.assign(NBT.create(true), nbt);

    bd["i32>x"] = x - this.origin.x;
    bd["i32>y"] = y - this.origin.y;
    bd["i32>z"] = z - this.origin.z;

    this.palette.blockEntity["obj>" + index] = be;
    return true
  }

  /**
   * Fill specified area with given block.
   * @param {object} from - Position in the structure.
   * @param {number} from.x
   * @param {number} from.y
   * @param {number} from.z
   * @param {object} to - Position in the structure.
   * @param {number} to.x
   * @param {number} to.y
   * @param {number} to.z
   * @param {object} block - Data of the block.
   * @returns {boolean}
   */
  fill(from, to, block) {
    var pb = this.palette.block
      , pos = [
        clamp(from.x, 0, this.size.xL),
        clamp(from.y, 0, this.size.yL),
        clamp(from.z, 0, this.size.zL),
        clamp(to.x, 0, this.size.xL),
        clamp(to.y, 0, this.size.yL),
        clamp(to.z, 0, this.size.zL)
      ]
      , bi, index;

    for (var i = 0; i < 3; i++) {
      pos[i] = Math.floor(pos[i]);
      pos[i + 3] = Math.floor(pos[i + 3]);
      if (pos[i] > pos[i + 3])
        [pos[i], pos[i + 3]] = [pos[i + 3], pos[i]];
    }

    for (var i = 0; i < pb.length; i++)
      if (NBT.equal(pb[i], block)) {
        bi = i;
        break
      } else if (i == pb.length - 1) {
        bi = pb.length;
        pb.push(block);
      }

    for (var xC = pos[0]; xC <= pos[3]; xC++)
      for (var yC = pos[1]; yC <= pos[4]; yC++)
        for (var zC = pos[2]; zC <= pos[5]; zC++) {
          index = zC + this.size.zL * (yC + this.size.yL * xC);
          this.blockIndices[this.operationOnLayer][index] = bi;
        }
    return true
  }

  /**
   * Place an entity.
   * @param {object} entity - Entity data.
   * @param {object} pos - Position in the structure.
   * @param {number} pos.x - Pos X.
   * @param {number} pos.y - Pos Y.
   * @param {number} pos.z - Pos Z.
   * @returns {BigInt} Entity ID.
   */
  summon(entity, pos) {
    if (pos) {
      var x = clamp(pos.x, 0, this.size.xL)
        , y = clamp(pos.y, 0, this.size.yL)
        , z = clamp(pos.z, 0, this.size.zL);
      entity["lst>Pos"] = ["f32", x, y, z];
    }
    entity["i64>UniqueID"] = this.uniqueID;
    this.entities.push(entity);
    return this.uniqueID++
  }

  /**
   * Remove specified entity.
   * @param {BigInt|number} uniqueID - Entity ID.
   * @returns {object|null} The entity removed or null.
   */
  kill(uniqueID) {
    for (var i = 0; i < this.entities.length; i++)
      if (this.entities[i]["i64>UniqueID"] == BigInt(uniqueID))
        return this.entities.splice(i, 1);
    return null
  }

  /**
   * Serialize MCStructure object to NBT.
   * @returns {ArrayBuffer}
   */
  serialize() {
    var result = NBT.create()
      , stru = NBT.create();

    result["lst>size"] = ["i32", this.size.xL, this.size.yL, this.size.zL];
    result["lst>structure_world_origin"] = ["i32", this.origin.x, this.origin.y, this.origin.z];
    result["i32>format_version"] = this.version;
    result["obj>structure"] = stru;
    stru["lst>block_indices"] = [
      "lst",
      this.blockIndices.extron,
      this.blockIndices.intron
    ];
    stru["lst>entities"] = ["obj", ...this.entities];
    stru["obj>palette"] = NBT.create();
    stru["obj>palette"]["obj>default"] = NBT.create();
    stru["obj>palette"]["obj>default"]["lst>block_palette"] = [
      "obj",
      ...this.palette.block
    ];
    stru["obj>palette"]["obj>default"]["obj>block_position_data"] = this.palette.blockEntity;

    return NBT.Writer(result, { littleEndian: true, allowBigInt: true, allowTypedArray: true })
  }
}

module.exports = MCStructure;