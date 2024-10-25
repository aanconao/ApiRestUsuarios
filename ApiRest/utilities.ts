import type { Collection } from "mongodb";
import type { Book, BookModel, User, UserModel } from "./types.ts";

//pasa de userModel a user
export const getUserFromModel = async (
  userIn: UserModel,
  booksCollection: Collection<BookModel>
): Promise<User> => {
  const booksIDs = userIn.books;
  const books: BookModel[] = await booksCollection
    .find({ _id: { $in: booksIDs } })
    .toArray();

  return {
    name: userIn.name,
    age: userIn.age,
    id: userIn._id.toString(),
    books: books.map((b) => getBookFromModel(b)),
  };
};

export const getBookFromModel = (bookIn: BookModel): Book => ({
  id: bookIn._id.toString(),
  title: bookIn.title,
  pages: bookIn.pages,
});
