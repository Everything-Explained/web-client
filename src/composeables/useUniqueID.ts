
let id = 0;
export default function useUniqueID() {
  return { getID: () => ++id };
}