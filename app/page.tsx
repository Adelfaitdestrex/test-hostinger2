import { revalidatePath } from "next/cache";

import { prisma } from "./lib/prisma";

export const instant = false;

async function createUser(formData: FormData) {
  "use server";

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();

  if (!name || !email || !email.includes("@")) {
    throw new Error("Un nom et une adresse e-mail valides sont requis.");
  }

  await prisma.user.create({
    data: { name, email },
  });

  revalidatePath("/");
}

export default async function Home() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-8 px-6 py-16">
      <header>
        <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-blue-600">
          Test Prisma + MySQL
        </p>
        <h1 className="text-4xl font-bold tracking-tight">
          Utilisateurs de la base de données
        </h1>
        <p className="mt-3 text-zinc-600">
          Si cette page se charge, Prisma a réussi à lire la base distante.
        </p>
      </header>

      <form
        action={createUser}
        className="grid gap-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm"
      >
        <h2 className="text-xl font-semibold">Ajouter un utilisateur</h2>
        <label className="grid gap-2 text-sm font-medium" htmlFor="name">
          Nom
          <input
            className="rounded-lg border border-zinc-300 px-3 py-2 font-normal"
            id="name"
            name="name"
            placeholder="Alice"
            required
          />
        </label>
        <label className="grid gap-2 text-sm font-medium" htmlFor="email">
          E-mail
          <input
            className="rounded-lg border border-zinc-300 px-3 py-2 font-normal"
            id="email"
            name="email"
            placeholder="alice@example.com"
            required
            type="email"
          />
        </label>
        <button
          className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
          type="submit"
        >
          Enregistrer
        </button>
      </form>

      <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold">
          Utilisateurs enregistrés ({users.length})
        </h2>
        {users.length === 0 ? (
          <p className="text-zinc-500">Aucun utilisateur pour le moment.</p>
        ) : (
          <ul className="divide-y divide-zinc-200">
            {users.map((user) => (
              <li className="flex items-center justify-between py-3" key={user.id}>
                <span className="font-medium">{user.name}</span>
                <span className="text-sm text-zinc-500">{user.email}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
