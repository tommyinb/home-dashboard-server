import { onRequest } from "firebase-functions/v2/https";

export const hello = onRequest({ cors: true }, (_request, response) => {
  response.json({
    message: "Hello from Firebase!",
    time: new Date(),
  });
});
