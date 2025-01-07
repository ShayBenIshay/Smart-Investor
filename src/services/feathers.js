import { useRef } from "react";
import feathers from "@feathersjs/feathers";
import rest from "@feathersjs/rest-client";
import axios from "axios";
import authentication from "@feathersjs/authentication-client";

export function useFeathers() {
  const appRef = useRef(null);

  if (!appRef.current) {
    const app = feathers();
    const restClient = rest(process.env.NEXT_PUBLIC_REST_SERVICES_CLIENT_URL);
    app.configure(restClient.axios(axios));
    app.configure(
      authentication({
        storage: typeof window !== "undefined" ? window.localStorage : null,
      })
    );
    appRef.current = app;
  }

  return appRef.current;
}
