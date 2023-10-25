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
      },
    ],
    startIndex: 0,
    endIndex: 0,
    currentSpan: null as HTMLElement | null,
  },

  init() {
    // Tell the StateManager to use the state object from this file
    StateManager.init(home.state);
    // Listen for state changes and the state object from this file
    document.addEventListener("stateChange", home.syncState);

    // Setup the increment and decrement buttons
    home.methods.setupTextContainerEvents();
    home.methods.setupPopupMenu();
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

        // Surround the selected text with the span element
        range.surroundContents(span);

        // Set the current span
        home.state.currentSpan = span;

        home.state.startIndex = startIndex;
        home.state.endIndex = endIndex;

        // Get the bounding rectangle of the range
        const rect = range?.getBoundingClientRect();

        // Get the popup menu element
        const popupMenu = document.getElementById("popup-menu");

        // Set the position of the popup menu
        if (rect && popupMenu) {
          popupMenu.style.top = `${rect.bottom}px`;
          popupMenu.style.left = `${rect.left}px`;
          popupMenu.style.display = "flex";
        }
      }
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

    setupTextContainerEvents: () => {
      const textContainer = document.getElementById("text-container");
      // Add a double click event listener to all child elements of the text container

      textContainer?.addEventListener("mouseup", () =>
        home.methods.mouseSelectionTextHighLight(textContainer!)
      );

      // textContainer?.addEventListener("dblclick", () => home.methods.highlightText(textContainer));
    },

    clearIndex: () => {
      home.state.startIndex = 0;
      home.state.endIndex = 0;
    },

    selectSlot: (slot: string) => {
      console.log(slot, home.state.startIndex, home.state.endIndex);
      const theSlot = home.state.slots.find((s) => s.name === slot);
      if (theSlot) {
        home.state.currentSpan?.classList.add(theSlot.color);
      }
      home.methods.hidePopupMenu();
      home.methods.clearIndex();
    },

    hidePopupMenu: () => {
      const popupMenu = document.getElementById("popup-menu");
      popupMenu!.style.display = "none";
    },

    setupPopupMenu: () => {
      const popupMenu = document.getElementById("popup-menu");
      // loop through the slots array and create a button for each slot
      const buttons = home.state.slots.map((slot) => {
        const button = document.createElement("button");
        button.addEventListener("click", () =>
          home.methods.selectSlot(slot.name)
        );
        button.classList.add("popup-menu-button");
        button.classList.add(slot.color);
        button.innerText = slot.name;
        return button;
      });

      // Add the buttons to the popup menu
      buttons.forEach((button) => {
        popupMenu?.appendChild(button);
      });
    },
  },
};
