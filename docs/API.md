# MCStructure.s v1.2.0 documentation

<a name="MCS"></a>

- Table of Contents
  * [Class: MCStructure](#MCS)
    * [new MCStructure(xL, yL, zL)](#new_MCS_new)
    * _instance_
      * [mcs.getVolume()](#MCS+getVolume) ⇒ [``<Number>``](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#number_type)
      * [mcs.getBlock(pos)](#MCS+getBlock) ⇒ [``<Object>``](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
      * [mcs.getBlockData(pos)](#MCS+getBlockData) ⇒ [``<Object>``](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
      * [mcs.getEntity(uniqueID)](#MCS+getEntity) ⇒ [``<Object>``](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
      * [mcs.setBlock(pos, block)](#MCS+setBlock) ⇒ [``<Boolean>``](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
      * [mcs.setBlockData(pos, data)](#MCS+setBlockData) ⇒ [``<Boolean>``](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
      * [mcs.fill(from, to, block)](#MCS+fill) ⇒ [``<Boolean>``](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
      * [mcs.summon(entity, pos)](#MCS+summon) ⇒ [``<BigInt>``](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)
      * [mcs.kill(uniqueID)](#MCS+kill) ⇒ [``<Object>``](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
      * [mcs.serialize()](#MCS+serialize) ⇒ [``<ArrayBuffer>``](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)
    * _static_
      * [MCStructure.deserialize(buf)](#MCS+deserialize)

<a name="new_MCS_new"></a>

## new MCStructure(xL, yL, zL)

* ``xL`` [``<Number>``](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#number_type) X side length.
* ``yL`` [``<Number>``](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#number_type) Y side length.
* ``zL`` [``<Number>``](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#number_type) Z side length.

Create a mcstructure with given size.

<a name="MCS+getVolume"></a>

## mcs.getVolume()

* Returns: [``<Number>``](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#number_type)

Get volume of of the structure.

<a name="MCS+getBlock"></a>

## mcs.getBlock(pos)

* ``pos`` [``<Object>``](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Position in the structure.
  * ``x`` [``<Number>``](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#number_type) Pos X.
  * ``y`` [``<Number>``](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#number_type) Pos Y.
  * ``z`` [``<Number>``](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#number_type) Pos Z.
* Returns: [``<Object>``](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Get a block in the structure. Returns a [general tag of block](https://minecraft.wiki/w/Bedrock_Edition_level_format/Other_data_format#Block) in normal.

<a name="MCS+getBlockData"></a>

## mcs.getBlockData(pos)

* ``pos`` [``<Object>``](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Position in the structure.
  * ``x`` [``<Number>``](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#number_type) Pos X.
  * ``y`` [``<Number>``](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#number_type) Pos Y.
  * ``z`` [``<Number>``](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#number_type) Pos Z.
* Returns: [``<Object>``](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Get the block entity of a block.

<a name="MCS+getEntity"></a>

## mcs.getEntity(uniqueID)

* ``uniqueID`` [``<BigInt>``](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) Entity ID.
* Returns: [``<Object>``](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)|[``null``](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/null) The specified entity or null.

Get the block entity of a block.

<a name="MCS+setBlock"></a>

## mcs.setBlock(pos, block)

* ``pos`` [``<Object>``](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Position in the structure.
  * ``x`` [``<Number>``](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#number_type) Pos X.
  * ``y`` [``<Number>``](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#number_type) Pos Y.
  * ``z`` [``<Number>``](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#number_type) Pos Z.
* ``block`` [``<Object>``](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Data of the block. 
* Returns: [``<Boolean>``](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Place a block, and put given NBT data into block indices. Accepts a [general tag of block](https://minecraft.wiki/w/Bedrock_Edition_level_format/Other_data_format#Block) in ParseNBT.js object.

Example:
```js
const PMR = require("project-mirror-registry")
    , MCS = require("mcstructure-js");

var mcs = new MCS(1, 1, 1);

mcs.setBlock(
  { x: 0, y: 0, z: 0 },
  PMR.createUniversalTag("block", "minecraft:bedrock")
);
```

<a name="MCS+setBlockData"></a>

## mcs.setBlockData(pos, data)

* ``pos`` [``<Object>``](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Position in the structure.
  * ``x`` [``<Number>``](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#number_type) Pos X.
  * ``y`` [``<Number>``](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#number_type) Pos Y.
  * ``z`` [``<Number>``](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#number_type) Pos Z.
* ``data`` [``<Object>``](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Data of the block entity. 
* Returns: [``<Boolean>``](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Set the block entity of a block.

Example:
```js
const PMR = require("project-mirror-registry")
    , MCS = require("mcstructure-js");

var mcs = new MCS(1, 1, 1);

mcs.setBlock(
  { x: 0, y: 0, z: 0 },
  PMR.createUniversalTag("block", "minecraft:command_block")
);

var be = PMR.createBlockEntity("command_block");
be["str>Command"] = "say Hello Minecraft!";

mcs.setBlockData(
  { x: 0, y: 0, z: 0 },
  be
);
```

<a name="MCS+fill"></a>

## mcs.fill(from, to, block)

* ``from`` [``<Object>``](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Position in the structure.
  * ``x`` [``<Number>``](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#number_type)
  * ``y`` [``<Number>``](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#number_type)
  * ``z`` [``<Number>``](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#number_type)
* ``to`` [``<Object>``](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Position in the structure.
  * ``x`` [``<Number>``](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#number_type)
  * ``y`` [``<Number>``](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#number_type)
  * ``z`` [``<Number>``](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#number_type)
* ``block`` [``<Object>``](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Block data. 
* Returns: [``<Boolean>``](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Fill an area with given block.

<a name="MCS+summon"></a>

## mcs.summon(entity, pos)

* ``entity`` [``<Object>``](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Block data. 
* ``pos`` [``<Object>``](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Position in the structure.
  * ``x`` [``<Number>``](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#number_type) Pos X.
  * ``y`` [``<Number>``](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#number_type) Pos Y.
  * ``z`` [``<Number>``](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#number_type) Pos Z.
* Returns: [``<BigInt>``](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) Entity ID.

Place an entity.

Example:
```js
const PMR = require("project-mirror-registry")
    , MCS = require("mcstructure-js");

var mcs = new MCS(1, 1, 1);

var entity = PMR.createUniversalTag("entity");
entity["str>identifier"] = "minecraft:creeper";
entity["list>definitions"].push("+minecraft:creeper");
entity["list>definitions"].push("+");

mcs.summon(
  entity,
  { x: 0, y: 0, z: 0 }
);
```

<a name="MCS+kill"></a>

## mcs.kill(uniqueID)

* ``uniqueID`` [``<BigInt>``](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) Entity ID.
* ``pos`` [``<Object>``](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Position in the structure.
  * ``x`` [``<Number>``](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#number_type) Pos X.
  * ``y`` [``<Number>``](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#number_type) Pos Y.
  * ``z`` [``<Number>``](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#number_type) Pos Z.
* Returns: [``<Object>``](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)|[``null``](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/null) The entity removed or null.

Remove specified entity.

<a name="MCS+serialize"></a>

## mcs.serialize()

* Returns: [``<ArrayBuffer>``](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)

Serialize a MCStructure to NBT.

Example:
```js
const PMR = require("project-mirror-registry")
    , MCS = require("mcstructure-js")
    , fs = require("fs");

var mcs = new MCS(1, 1, 1);

var entity = PMR.createUniversalTag("entity");
entity["str>identifier"] = "minecraft:creeper";
entity["list>definitions"].push("+minecraft:creeper");
entity["list>definitions"].push("+");

mcs.summon(
  entity,
  { x: 0, y: 0, z: 0 }
);

var buffer = Buffer.from(mcs.serialize());

fs.writeFileSync("./creeper.mcstructure", buffer);
// Then you can import it into MCBE.
```

<a name="MCS+deserialize"></a>

## MCStructure.deserialize(buf)

* ``buf`` [``<ArrayBuffer>``](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) Input buffer.
* Returns: [``<MCStrucure>``](#MCS)

Deserialize mcstructure from blob.
