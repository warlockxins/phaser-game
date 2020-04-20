// modified from https://github.com/drhayes/impactjs-statemachine

interface StateMachineState {
    enter(): void;
    update(deltaTime: number): void;
    exit(): void;
}
interface StateMachineTransition {
    name: string;
    fromState: string;
    toState: string;
    predicate(): boolean;
}

export class StateMachine {
    states: { [key: string]: StateMachineState };
    transitions: { [key: string]: StateMachineTransition };
    initialState: any;
    currentState: any;
    previousState: any;
    timer: any;

    constructor() {
        this.states = {};
        this.transitions = {};
        // Track states by name.
        this.initialState = null;
        this.currentState = null;
        this.previousState = null;
        this.timer = null;
    }

    state(name, definition) {
        if (!definition) {
            return this.states[name];
        }
        this.states[name] = definition;
        if (!this.initialState) {
            this.initialState = name;
            this.currentState = name;
        }
    }

    transition(name, fromState, toState, predicate) {
        if (!fromState && !toState && !predicate) {
            return this.transitions[name];
        }
        // Transitions don't require names.
        if (!predicate) {
            predicate = toState;
            toState = fromState;
            fromState = name;
        }
        if (!this.states[fromState]) {
            throw new Error("Missing from state: " + fromState);
        }
        if (!this.states[toState]) {
            throw new Error("Missing to state: " + toState);
        }
        const transition = {
            name: name,
            fromState: fromState,
            toState: toState,
            predicate: predicate
        };
        this.transitions[name] = transition;
        return transition;
    }

    update(delta) {
        const state = this.states[this.currentState];

        if (this.previousState !== this.currentState) {
            if (state.enter) {
                this.timer = new Date();
                state.enter();
            }
            this.previousState = this.currentState;
        }

        if (state.update) {
            state.update(delta);
        }
        // Iterate through transitions.
        for (let name in this.transitions) {
            const transition = this.transitions[name];
            if (
                transition.fromState === this.currentState &&
                transition.predicate()
            ) {
                if (state.exit) {
                    state.exit();
                }
                this.currentState = transition.toState;
                return;
            }
        }
    }
}
