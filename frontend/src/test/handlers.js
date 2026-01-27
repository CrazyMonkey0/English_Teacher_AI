import { http, HttpResponse } from "msw"

export const handlers = [
    http.post("/login", () => {
        return HttpResponse.json({ token: "fake-jwt-token" })
    })
]