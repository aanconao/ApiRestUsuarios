import { ObjectId } from "mongodb";

export type UserModel = {
  _id: ObjectId;
  name: string;
  age: number;
  books: ObjectId[];
};
export type BookModel = {
  _id: ObjectId;
  title: string;
  pages: number;
};
export type Book = {
  id: string;
  title: string;
  pages: number;
};
export type User = {
  id: string;
  name: string;
  age: number;
  books: Book[];
};
