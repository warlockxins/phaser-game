export interface IStateMachineState {
    enter(): void;
    update(deltaTime: number): void;
    exit(): void;
}

export interface IStateMachineTransition {
    name: string;
    fromState: number;
    toState: number;
    predicate(): boolean;
}
