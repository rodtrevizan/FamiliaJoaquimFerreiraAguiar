import { serve } from "bun";
import index from "./index.html";
import { GET as getFamilia, POST as postFamilia } from "./api/familia";
import { GET as getTarefas, POST as postTarefas } from "./api/tarefas-pendentes";

const server = serve({
  routes: {
    // Serve index.html for all unmatched routes.
    "/*": index,

    "/api/familia": {
      GET: getFamilia,
      POST: postFamilia,
    },

    "/api/tarefas-pendentes": {
      GET: getTarefas,
      POST: postTarefas,
    },

    "/api/hello": {
      async GET(req) {
        return Response.json({
          message: "Hello, world!",
          method: "GET",
        });
      },
      async PUT(req) {
        return Response.json({
          message: "Hello, world!",
          method: "PUT",
        });
      },
    },

    "/api/hello/:name": async (req) => {
      const name = req.params.name;
      return Response.json({
        message: `Hello, ${name}!`,
      });
    },
  },

  development: process.env.NODE_ENV !== "production",
});

console.log(`🚀 Server running at ${server.url}`);
