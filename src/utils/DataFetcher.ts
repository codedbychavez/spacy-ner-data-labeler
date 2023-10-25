import sentences from "../data/sentences.json";
import labels from "../data/labels.json";
import type { Sentence } from "../types/Sentence";
import { Label } from "../types/Label";

export const dataFetcher = {

    fetchSentences: async (): Promise<Sentence[]> => {
        const theSentences = sentences as Sentence[];
        return theSentences;
    },
    fetchLabels: async (): Promise<Label[]> => {
        const theLabels = labels as Label[];
        return theLabels;
    },
}