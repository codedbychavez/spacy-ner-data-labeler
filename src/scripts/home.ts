import { StateManager } from "../utils/StateManager";
import type { Entity } from "../types/Entity";

export const home = {
  // State is a global object that can be used to store data
  state: {
    counter: 0,
    labels: [
      {
        name: "Subject",
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
    popUpMenu: (document.getElementById("popup-menu") as HTMLElement) || null,
    nerDataContainer:
      (document.getElementById("ner-data-container") as HTMLElement) || null,
    nerData: [
      {
        id: 1,
        sentence: "can you please turn off the lights",
        data: [] as Entity[],
      },
      {
        id: 2,
        sentence: "switch on the garage lights",
        data: [] as Entity[],
      },
    ],
  },

  init() {
    // Tell the StateManager to use the state object from this file
    StateManager.init(home.state);
    // Listen for state changes and the state object from this file
    document.addEventListener("stateChange", home.syncState);

    // Setup the increment and decrement buttons
    home.methods.setupEventListeners();
    home.methods.setupPopupMenu();
    home.methods.initNerData();
  },

  syncState() {
    this.state = StateManager.getState();
  },

  methods: {
    // Event listeners
    setupEventListeners: () => {
      const textContainer = document.getElementById("text-container");

      textContainer?.addEventListener("mouseup", () =>
        home.methods.mouseSelectionTextHighLight(textContainer!)
      );

      textContainer?.addEventListener("dblclick", () => {
        home.methods.mouseSelectionTextHighLight(textContainer!);
      });
    },

    updateTheState: (
      currentSpan: HTMLSpanElement,
      startIndex: number,
      endIndex: number
    ) => {
      home.state.currentSpan = currentSpan;
      home.state.startIndex = startIndex;
      home.state.endIndex = endIndex;
    },

    mouseSelectionTextHighLight: (parentElement: HTMLElement) => {
      const selection = window.getSelection();

      if (selection && selection.toString()) {
        const text = selection.toString();

        const sentence = parentElement.innerText;
        const { startIndex, endIndex } = home.methods.findStartAndEndIndex(
          sentence,
          text
        );

        // Create a range object for the selected text
        const range = selection.getRangeAt(0);

        // Create a new span element
        const span = document.createElement("span");

        // Span the highlighted text
        home.methods.spanHighlightedText(range, span);

        // Update the state
        home.methods.updateTheState(span, startIndex, endIndex);

        // Get the popup menu element
        const popupMenu = home.state.popUpMenu;

        // Show the popup menu
        home.methods.showPopupMenu(range, popupMenu!);
      }
    },

    spanHighlightedText: (range: Range, span: HTMLSpanElement) => {
      try {
        range.surroundContents(span);
      } catch (e) {
        console.log(e);
      }
    },

    showPopupMenu: (range: Range, popUpMenu: HTMLElement) => {
      const rect = range?.getBoundingClientRect();
      if (rect && popUpMenu) {
        popUpMenu.style.top = `${rect.bottom}px`;
        popUpMenu.style.left = `${rect.left}px`;
        popUpMenu.style.display = "flex";
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

    clearIndexState: () => {
      home.state.startIndex = 0;
      home.state.endIndex = 0;
    },

    selectLabel: (label: string) => {
      // 1. Get parent element of the span
      const parentElement = home.state.currentSpan?.parentElement;

      // 2. Get the id of the parent element
      const parentId = parentElement?.getAttribute("id");

      console.log(parentId, "parentId");

      const idNumber = parseInt(parentId!);

      const entityData = {
        text: home.state.currentSpan!.innerText,
        label: label,
        startIndex: home.state.startIndex,
        endIndex: home.state.endIndex,
      };

      home.state.nerData[idNumber - 1].data.push(entityData as Entity);
      const theLabel = home.state.labels.find((s) => s.name === label);
      if (theLabel) {
        home.state.currentSpan?.classList.add(theLabel.color, "span-label");
      }
      home.methods.hidePopupMenu();
      home.methods.clearIndexState();

      // 4. Add the entity data to the entity data wrapper
      home.methods.addEntityData();
    },

    hidePopupMenu: () => {
      const popupMenu = home.state.popUpMenu;
      popupMenu!.style.display = "none";
    },

    setupPopupMenu: () => {
      const popupMenu = home.state.popUpMenu;
      // loop through the labels array and create a button for each label
      const buttons = home.state.labels.map((label) => {
        const button = document.createElement("button");
        button.addEventListener("click", () =>
          home.methods.selectLabel(label.name)
        );
        button.classList.add("popup-menu-button");
        button.classList.add(label.color);
        button.innerText = label.name;
        return button;
      });

      // Add the buttons to the popup menu
      buttons.forEach((button) => {
        popupMenu?.appendChild(button);
      });
    },

    initNerData: () => {
      home.state.nerData.forEach((ner) => {
        const textContainer = document.getElementById("text-container");
        const paragraph = document.createElement("p");
        const nerDataId = `${ner.id}`;
        paragraph.setAttribute("id", nerDataId);
        paragraph.classList.add("sentence");
        paragraph.innerText = ner.sentence;
        textContainer?.appendChild(paragraph);
      });
    },

    // Add the entity data to col-2
    addEntityData: () => {
      const nerDataContainer = home.state.nerDataContainer;
      const nerData = home.state.nerData;

      // 1. Clear the col-2 element
      nerDataContainer!.innerHTML = "";

      // 2. Create a pre tag
      const pre = document.createElement("pre");
      pre.classList.add("ner-data");

      // 2. Add the nerData to the pre tag
      pre.innerText = JSON.stringify(nerData, null, 2);

      nerDataContainer?.appendChild(pre);
    },
  },
};
