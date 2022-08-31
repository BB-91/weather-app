const LOCAL_API = {
    PROTOCOL: "http://",
    DOMAIN: "localhost",
    PORT: 3010,
    PATH: "/api/weather_histories",

    getOrigin() {
        return this.PROTOCOL + this.DOMAIN + (this.PORT ? `:${this.PORT}` : "")
    },

    getURL() {
        return this.getOrigin() + this.PATH;
    },
}

export default LOCAL_API;