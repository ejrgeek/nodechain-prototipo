/**
 * Validation class
 */
export default class Validation {
    success: boolean;
    message: string;

    /**
     * Create Validation
     * @param success Validation successful
     * @param message if validation fail, set message
     */
    constructor(success: boolean = true, message: string = "") {
        this.success = success;
        this.message = message;
    }
}