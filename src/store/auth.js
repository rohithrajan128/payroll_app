export default {
    namespaced: true,

    state: {
        userData: null
    },

    getters: {
        user: state => state.userData
    },

    mutations: {
        setUserData(state, user) {
            state.userData = user;
        },
        storeImageUrl(state, url) {
            state.ImageFullUrl = url;
        },
    },

    actions: {
        getUserData({ commit }) {
            axios
                .get(process.env.VUE_APP_API_URL_ADMIN + "user")
                .then(response => {
                    commit("setUserData", response.data);
                    /* Temporary Fix */
                    localStorage.setItem("user", JSON.stringify(response.data));
                })
                .catch(() => {
                    localStorage.removeItem("authToken");
                });
        },
        sendLoginRequest({ commit }, data) {

            commit("setErrors", {}, { root: true });
            return axios
                .post(process.env.VUE_APP_API_URL_ADMIN + "login", data)
                .then(response => {

                    commit("setUserData", response.data.userdata);
                    localStorage.setItem("authToken", response.data.access_token);
                    localStorage.setItem("user", JSON.stringify(response.data.userdata));
                    // localStorage.setItem("userrole", JSON.stringify(response.data.userdata.role.rolename));

                });
        },

        sendLogoutRequest({ commit }) {
            axios.post(process.env.VUE_APP_API_URL_ADMIN + "logout").then(() => {
                commit("setUserData", null);
                localStorage.removeItem("authToken");
                localStorage.removeItem("date_format");
            });
        },

    }
};