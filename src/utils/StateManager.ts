const event = new Event("stateChange");

export const StateManager = {
  state: {},
  init(state: Object) {
    this.setupAppState(state);
    this.initAppState();
  },

  triggerAppStateChange() {
    document.dispatchEvent(event);
  },

  setupAppState(state: Object) {
    this.state = state;
  },

  initAppState() {
    const elementsUsingState = document.querySelectorAll("[state]");
    elementsUsingState.forEach((element) => {
      const stateKey = element.getAttribute("state");
      if (stateKey) {
        element.innerHTML = this.state[stateKey];
      }
    });
  },
  updateAppState(state: Object) {
    const elementsUsingState = document.querySelectorAll("[state]");
    const previousState = this.getPreviousState(); // Make a copy of the previous state
    elementsUsingState.forEach((element) => {
      const stateKey = element.getAttribute("state");
      if (stateKey) {
        const currentValue = state[stateKey];
        const previousValue = previousState[stateKey];
        if (currentValue !== previousValue) {
          element.innerHTML = state[stateKey];
        }
      }
    });
    localStorage.setItem("state", JSON.stringify(state));
    this.triggerAppStateChange();
  },

  getPreviousState() {
    const previousState = localStorage.getItem("state");
    if (previousState) {
      return (this.state = JSON.parse(previousState));
    }

    return this.state;
  },
  getState() {
    const state = localStorage.getItem("state");
    if (state) {
      return JSON.parse(state);
    }
    return this.state;
  },

  clearAppState() {
    localStorage.removeItem("state");
  },
};
