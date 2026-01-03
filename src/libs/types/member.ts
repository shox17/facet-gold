import { MemberType, MemberStatus } from "../enums/member.enum";
import { ObjectId } from "mongoose";
import { Request } from "express";
import { Session } from "express-session";

export interface Member {
  _id: ObjectId;
  memberType: MemberType;
  memberStatus: MemberStatus;
  memberNick: string;
  memberPhone: string;
  memberPassword?: string;
  memberDesc?: string;
  memberAddress?: string;
  memberImage?: string;
  memberPoints: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface MemberInput {
  memberType?: MemberType;
  memberStatus?: MemberStatus;
  memberNick: string;
  memberPhone: string;
  memberPassword: string;
  memberDesc?: string;
  memberAddress?: string;
  memberImage?: string;
  memberPoints?: number;
}

export interface LoginInput {
  memberNick: string;
  memberPassword: string;
}

export interface MemberUpdateInput {
  _id: ObjectId;
  memberStatus?: MemberStatus;
  memberNick?: string;
  memberPhone?: string;
  memberPassword?: string;
  memberDesc?: string;
  memberAddress?: string;
  memberImage?: string;
  memberPoint?: number;
}

export interface ExtendedRequest extends Request {
  member: Member; // Authenticated member information
  file: Express.Multer.File; // Single uploaded file
  files: Express.Multer.File[]; // Multiple uploaded files
}

export interface AdminRequest extends Request {
  member: Member; // Logged-in member information
  session: Session & { member: Member }; // Session with member info
  file: Express.Multer.File; // Single uploaded file
  files: Express.Multer.File[]; // Multiple uploaded files
}
