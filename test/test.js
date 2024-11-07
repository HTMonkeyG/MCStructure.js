const fs = require("fs")
  , MCS = require("../main.js")
  , NBT = require("parsenbt-js")
  , PMR = require("project-mirror-registry")

function buf2arr(buf) {
  var r = new Uint8Array(buf.length)
  r.set(buf)
  return r.buffer
}

var r, s;

console.log(r = MCS.deserialize(buf2arr(fs.readFileSync("./test/test.mcstructure"))))

var b = PMR.createUniversalTag("block");
b.name = "minecraft:air"

console.log(s = r.palette.blockEntity[NBT.PROXIED_NBT])

r.setBlock({ x: 0, y: 0, z: 0 }, b)

1;