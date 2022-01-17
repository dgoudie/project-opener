type AppExceptionType = 'ERROR' | 'WARNING';

export class AppException {
    message: string;
    type: AppExceptionType;
    stack? = Error().stack;
    constructor(message = '', stack = '', type: AppExceptionType = 'ERROR') {
        this.message = message;
        this.type = type;
        this.stack = !!stack ? stack : Error().stack;
    }
}
