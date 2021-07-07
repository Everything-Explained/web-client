
let id = 0;
export default function useUniqueIDGen() {
  return {
    genID: () => `uid${++id}`,
    readID: () => id,
  };
}