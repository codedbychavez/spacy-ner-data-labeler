import { Entity } from "./Entity";

export interface Sentence {
  id: number;
  text: string;
  entities: Entity[];
}
