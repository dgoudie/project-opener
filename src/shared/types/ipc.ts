import { Settings } from './settings';
import { v4 as uuidv4 } from 'uuid';

export class IpcRequestResponseOutgoingPayload<T> {
    responseChannel = uuidv4();
    constructor(public payload: T) {}
}
