// modified from https://github.com/drhayes/impactjs-statemachine
import { IStateMachineState, IStateMachineTransition } from "./interfaces";

export class StateMachine {
    states: IStateMachineState[];
    transitions: IStateMachineTransition[];
    initialState: number;
    currentState: number;
    previousState: number;
    timer: any;
    context: { [key: string]: any };

    constructor() {
        this.states = [];
        this.transitions = [];
        // Track states by index.
        this.initialState = 0;
        this.currentState = 0;
        this.previousState = 0;
        this.timer = null;
        this.context = {};
    }

    state(index, smState: IStateMachineState) {
        if (!smState) {
            throw new Error("Missing State body: ");
        }
        this.states[index] = smState;
        if (!this.initialState) {
            this.initialState = index;
            this.currentState = index;
        }
    }

    transition(name: string, fromState: number, toState: number, predicate) {
        if (!fromState && !toState && !predicate) {
            return this.transitions[name];
        }
        if (!this.states[fromState]) {
            throw new Error("Missing from state: " + fromState);
        }
        if (!this.states[toState]) {
            throw new Error("Missing to state: " + toState);
        }
        const transition: IStateMachineTransition = {
            name: name,
            fromState: fromState,
            toState: toState,
            predicate: predicate,
        };
        this.transitions.push(transition);
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
        for (const transition of this.transitions) {
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
