import { Patient } from '../models/patient';
import { user } from "../models/user";

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
  user: user;
}