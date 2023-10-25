import { StateManager } from "../utils/StateManager";

export const home = {
  // State is a global object that can be used to store data
  state: {
    counter: 0,
    slots: [
      {
        name: "Feature Flag Name",
        color: "green",
      },
      {
        name: "Action",
        color: "purple",
      }
    ]
  },

  init() {
    // Tell the StateManager to use the state object from this file
    StateManager.init(home.state);
    // Listen for state changes and the state object from this file
    document.addEventListener("stateChange", home.syncState);

    // Setup the increment and decrement buttons
    home.setupTextContainerEvents();
    home.setupDecrementButton();
  },

  syncState() {
    this.state = StateManager.getState();
  },

  methods: {

    mouseSelectionTextHighLight: (parentElement: HTMLElement) => {
      const selection = window.getSelection();

      if (selection && selection.toString()) {
        const text = selection.toString();

        // Get all the spans in the parent element
        // const spans = parentElement.getElementsByTagName("span");

        const sentence = parentElement.innerText;
        const { startIndex, endIndex } = home.methods.findStartAndEndIndex(
          sentence,
          text
        );

        // Create a range object for the selected text
        const range = selection.getRangeAt(0);

        // Create a new span element
        const span = document.createElement("span");

        // Pick a random color from the colors array
        const randomColor = home.state.slots[0].color;

        // Set the background color of the span element to the random color
        span.classList.add(randomColor);

        // Surround the selected text with the span element
        range.surroundContents(span);

        console.log(startIndex, endIndex);
      }

      // Pick a random color from the colors array
      
      // Set the background color of the child element to the random color
      // childElement.classList.add(randomColor);

      // Get the text content of the parent element
      // const sentence = parentElement.innerText;

      // Get the text content of the child element
      // const text = childElement.innerText;

      // Find the start and end index of the child text in the sentence
      // const { startIndex, endIndex } = home.methods.findStartAndEndIndex(
      //   sentence,
      //   text
      // );
      // console.log(startIndex, endIndex);
    },

    findStartAndEndIndex: (sentence: string, text: string) => {
      // Trim the text
      const childTextContent = text.trim();
      // Find the start index of the text
      const startIndex = sentence.indexOf(childTextContent!);
      // Find the end index of the text
      const endIndex = startIndex! + childTextContent!.length;
      return { startIndex, endIndex };
    },
  },

  setupTextContainerEvents: () => {
    const textContainer = document.getElementById("text-container");
    // Add a double click event listener to all child elements of the text container

    textContainer?.addEventListener("mouseup", () =>
      home.methods.mouseSelectionTextHighLight(textContainer!)
    );

    // textContainer?.addEventListener("dblclick", () => home.methods.highlightText(textContainer));
  },

  setupDecrementButton: () => {
    const button = document.getElementById("counter-button-decrement");
    // button?.addEventListener("click", home.methods.decrementCounter);
  },
};
