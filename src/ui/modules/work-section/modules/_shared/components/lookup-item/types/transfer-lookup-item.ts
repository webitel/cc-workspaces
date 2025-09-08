export interface transferItem {
  id: string;
  name?: string;
  username?: string;
  extension?: string;
  presence?: string;
  status?: string;
  queue?: {
    id: string;
    name: string;
  };
  team?: {
    name?: string;
  };
}
