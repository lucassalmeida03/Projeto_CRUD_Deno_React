export const AuthConfig = {
    jwt: {
        secret: Deno.env.get("JWT_SECRET"),
        expiresIn: "1d"
    }
}