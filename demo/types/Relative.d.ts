/* eslint-disable */
/**
 * This file was automatically generated by api-handler. DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema
 * file or OPEN API YML, and run generate-types to regenerate this file.
 */

export type Relative = Relative1 & Relative2;
export type Relative1 = RelativeBase;

export interface RelativeBase {
  firstName: string;
  lastName: string;
  fathersName: string;
  address: string;
  nickName: string;
  phoneNumber: number;
  details: string;
  assignTo: string;
}
export interface Relative2 {
  _id: string;
  pariwarId: string;
}
