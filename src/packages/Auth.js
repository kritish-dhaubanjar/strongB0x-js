export const auth = {

    setToken(apiToken) {
        localStorage.setItem('api-token', apiToken);
    },

    getToken() {
        let apiToken = localStorage.getItem('api-token');
        if (!apiToken)
            return null;
        return apiToken;
    },

    isAuth() {
        if (this.getToken())
            return true;
        return false;
    },

    destroyToken() {
        localStorage.removeItem('api-token');
    }

}