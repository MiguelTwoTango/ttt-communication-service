export function LogicException(message: string, type: number) {
    this.message = message;
    this.type = type;
}

export enum Errors {
    NOT_FOUND,
    PRECONDITION_FAILED,
    BAD_REQUEST
}