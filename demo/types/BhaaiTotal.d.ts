/* eslint-disable */
/**
 * This file was automatically generated by api-handler. DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema
 * file or OPEN API YML, and run generate-types to regenerate this file.
 */

export type BhaaiTotal = BhaaiTotal1 & BhaaiTotal2;
export type BhaaiTotal1 = Bhaai;
export type Bhaai = Bhaai1 & Bhaai2;
export type Bhaai1 = BhaaiBase;

export interface BhaaiBase {
  marriage: string;
  date: string;
}
export interface Bhaai2 {
  _id: string;
}
export interface BhaaiTotal2 {
  total?: number;
}