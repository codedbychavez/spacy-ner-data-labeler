import { StateManager } from "../utils/StateManager";

export const home = {
  // State is a global object that can be used to store data
  state: {
    counter: 0,
  },

  init() {
    // Tell the StateManager to use the state object from this file
    StateManager.init(home.state);
    // Listen for state changes and the state object from this file
    document.addEventListener("stateChange", home.syncState);

    // Setup the increment and decrement buttons
    home.setupIncrementButton();
    home.setupDecrementButton();
  },

  syncState() {
    this.state = StateManager.getState();
  },

  methods: {
    incrementCounter: () => {
      home.state.counter++;
      StateManager.updateAppState(home.state);
    },

    decrementCounter: () => {
      home.state.counter--;
      StateManager.updateAppState(home.state);
    },
  },

  setupIncrementButton: () => {
    const button = document.getElementById("counter-button-increment");
    button?.addEventListener("click", home.methods.incrementCounter);
  },

  setupDecrementButton: () => {
    const button = document.getElementById("counter-button-decrement");
    button?.addEventListener("click", home.methods.decrementCounter);
  },
};
