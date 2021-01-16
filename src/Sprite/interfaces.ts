export interface ScriptComponent {
    update: Function;
    destroy: Function;
}


export interface MoveDirection {
    left: boolean;
    right: boolean;
    up: boolean;
    down: boolean;
    fire: boolean;
}

export interface ControllableCharacter {
    direction: MoveDirection,
    scriptComponents: ScriptComponent[]
}
