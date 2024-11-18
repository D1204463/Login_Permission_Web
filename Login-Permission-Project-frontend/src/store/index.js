import { createStore } from 'vuex';

const store = createStore({
    state() {
        return {
            permissions:[] //權限資料
        };
    },
    mutations: {
        setPermission(state, permissions) {
            state.permissions = permissions;
        }
    },
    actions: {
        loadPermissions({ commit }) {
            const permissions = JSON.parse(localStorage.getItem('permissions'));
            if(permissions) {
                commit('setPermissions', permissions);
            }
        },
        savePermissions({ commit }, permissions) {
            localStorage.setItem('permissions', JSON.stringify(permissions));
            commit('setPermissions', permissions);
        }
    }
});

export default store;