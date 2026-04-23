import { Patient } from '../models/patient';

export class ResponseMessage {
    code: number;
    message: string;
    constructor(code: number = 0, message: string = "") {
        this.code = code;
        this.message = message;
    }
}
export interface LoginResponse {
  success: boolean;
  message: string;
  patient: Patient;
}