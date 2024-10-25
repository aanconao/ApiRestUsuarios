import { MongoClient } from "mongodb";
import { BookModel, UserModel } from "./types.ts";
//coche y reservas
const url = Deno.env.get("MONGO_URL"); //En el deno.json debo poner  "deno run --env -A --watch main.ts" el --env
if (!url) {
  console.error("Necesitas MONGO_URL env variable");
  Deno.exit(-1);
}
const client = new MongoClient(url); //conexión con la base de datos
await client.connect();
console.info("MongoDB connected");

const db = client.db("Nebrija.DB"); //Nombre de la base de datos

const UsersCollection = db.collection<UserModel>("users");
const BooksCollection = db.collection<BookModel>("books");

type User = {
  name: string;

  email: string;
};

const users: User[] = [
  {
    name: "Alberto",
    email: "hola@gmail.com",
  },
  {
    name: "Jose Huerga",
    email: "aaa@gmail.com",
  },
];

const handler = async (req: Request): Promise<Response> => {
  const method = req.method;

  const url = new URL(req.url);

  const path = url.pathname;

  const searchParams = url.searchParams;

  if (method === "GET") {
    if (path === "/users") {
      return new Response(JSON.stringify(users), { status: 200 });
    } else if (path === "/user" && searchParams.has("name")) {
      const name = searchParams.get("name");

      const filteredUsers = users.filter((user) => user.name === name);

      return new Response(JSON.stringify(filteredUsers), { status: 200 });
    } else if (path === "/user" && searchParams.has("email")) {
      const email = searchParams.get("email");

      const usuarios = users.filter((user) => user.email === email);

      return new Response(JSON.stringify(usuarios), { status: 200 });
    }
  } else if (method === "POST") {
    if (path === "/user") {
      const payload: User = await req.json();

      if (payload.name && payload.email) {
        users.push(payload);

        return new Response(`Usuario ${payload.name} añadido.`, {
          status: 201,
        });
      } else {
        return new Response("Error añadir usuario", { status: 400 });
      }
    }
  } else if (method === "PUT") {
    if (path === "/user") {
      const payload: User = await req.json();

      if (payload.name) {
        const index = users.findIndex((user) => user.name === payload.name);

        if (index !== -1) {
          users[index] = payload;

          return new Response(`User ${payload.name} updated.`, { status: 200 });
        } else {
          return new Response("Usuario no encontrado", { status: 404 });
        }
      } else {
        return new Response("Error al usuario", { status: 400 });
      }
    }
  } else if (method === "DELETE") {
    if (path === "/user") {
      const payload: { name?: string; email?: string } = await req.json();

      if (payload.name || payload.email) {
        const index = users.findIndex(
          (user) => user.name === payload.name || user.email === payload.email
        );
        if (index !== -1) {
          const deletedUser = users.splice(index, 1);

          return new Response(`User ${deletedUser[0].name} deleted.`, {
            status: 200,
          });
        } else {
          return new Response("Usuario no encontrado", { status: 404 });
        }
      } else {
        return new Response("Invalid user data.", { status: 400 });
      }
    }
  }

  return new Response("Endpoint no encontrado", { status: 404 });
};

Deno.serve({ port: 3000 }, handler);
/*
const handler = async (req: Request): Promise<Response> => {
  const method = req.method;
  const url = new URL(req.url);
  const path = url.pathname;

  if (method === "GET") {
    if (path === "/test") return new Response(`He recibido un GET /test`);
  } else if (method === "POST") {
    if (path === "/test") {
      const payload = await req.json();
      if (payload.name) return new Response(`Hola ${payload.name}`);
      return new Response("He recibido un POST /test");
    }
  }
  return new Response("Endpoint not found", { status: 404 });
};

Deno.serve({ port: 3000 }, handler);
*/
