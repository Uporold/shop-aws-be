import { handlerPath } from "@libs/handlerResolver";

export default {
  handler: `${handlerPath(__dirname)}/handler.getProductList`,
  events: [
    {
      http: {
        method: "get",
        path: "products",
        cors: true,
      },
    },
  ],
};
