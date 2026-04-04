declare class MCStructure {
  /**
   * Deserialize mcstructure from given blob.
   * 
   * @param buf - Input buffer
   * @returns s
   */
  static deserialize(buf: ArrayBuffer): MCStructure;

  /**
   * Remove unused blocks in structure.
   * 
   * Changes original object.
   * 
   * @param a - INput object.
   * @returns
   */
  static makePruned(a: MCStructure): MCStructure;

  /**
   * Create a mcstructure with given size.
   * 
   * @param xL - X side length.
   * @param yL - Y side length.
   * @param zL - Z side length.
   */
  constructor(xL: number, yL: number, zL: number);

  /**
   * Get volume of of the structure.
   * 
   * @returns 
   */
  getVolume(): number;

  /**
   * Get the size of of the structure.
   * 
   * @returns 
   */
  getSize(): { x: number, y: number, z: number };

  /**
   * Get a block in the structure.
   * 
   * @param pos - Position in the structure.
   * @param pos.x - Pos X.
   * @param pos.y - Pos Y.
   * @param pos.z - Pos Z.
   * @returns
   */
  getBlock(pos: { x: number, y: number, z: number }): object;

  /**
   * Get block entity at given position.
   * 
   * @param pos - Position in the structure.
   * @param pos.x - Pos X.
   * @param pos.y - Pos Y.
   * @param pos.z - Pos Z.
   * @returns
   */
  getBlockData(pos: { x: number, y: number, z: number }): object;

  /**
   * Get specified entity.
   * 
   * @param uniqueID - Entity ID.
   * @returns The specified entity or null.
   */
  getEntity(uniqueID: number | bigint): object;

  /**
   * Place a block, and put given NBT data into block indices.
   * 
   * @param pos - Position in the structure.
   * @param pos.x - Pos X.
   * @param pos.y - Pos Y.
   * @param pos.z - Pos Z.
   * @param block - Data of the block.
   * @returns
   */
  setBlock(pos: { x: number, y: number, z: number }, block: object): boolean;

  /**
   * Set the block entity of a block.
   * 
   * @param pos - Position in the structure.
   * @param pos.x - Pos X.
   * @param pos.y - Pos Y.
   * @param pos.z - Pos Z.
   * @param nbt - Block entity data.
   * @returns
   */
  setBlockData(pos: { x: number, y: number, z: number }, nbt: object): boolean;

  /**
   * Fill specified area with given block.
   * 
   * @param from - Position in the structure.
   * @param from.x
   * @param from.y
   * @param from.z
   * @param to - Position in the structure.
   * @param to.x
   * @param to.y
   * @param to.z
   * @param block - Data of the block.
   * @returns
   */
  fill(from: { x: number, y: number, z: number }, to: { x: number, y: number, z: number }, block: object): boolean;

  /**
   * Place an entity.
   * 
   * @param entity - Entity data.
   * @param pos - Position in the structure.
   * @param pos.x - Pos X.
   * @param pos.y - Pos Y.
   * @param pos.z - Pos Z.
   * @returns Entity ID.
   */
  summon(entity: object, pos: { x: number, y: number, z: number }): bigint;

  /**
   * Remove specified entity.
   * 
   * @param uniqueID - Entity ID.
   * @returns The entity removed or null.
   */
  kill(uniqueID: number | bigint): object;

  /**
   * Serialize MCStructure object to NBT.
   * 
   * @returns
   */
  serialize(): object;
}

export = MCStructure;
