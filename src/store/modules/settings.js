import defaultSettings from '@/settings'

const {showSettings, fixedHeader, sidebarLogo} = defaultSettings

const state = {
  showSettings: showSettings,
  fixedHeader: fixedHeader,
  sidebarLogo: sidebarLogo,
  redirect: undefined,
  count:0
}

const mutations = {
  CHANGE_SETTING: (state, {key, value}) => {
    // eslint-disable-next-line no-prototype-builtins
    if (state.hasOwnProperty(key)) {
      state[key] = value
    }
  },

  STORE_REDIRECT: (state, payload) => {
    state.redirect = payload.redirect
    console.log("payload.redirect:", payload.redirect)
    console.log("state.redirect:", state.redirect)
    window.localStorage.setItem("redirect",state.redirect)
    console.log("store:",window.localStorage.getItem("redirect") )
  }

}


const getters = {
  getRedirect: state => {
    return state.redirect
  },
  getCount: state => {
    return state.count
  }
}

const actions = {
  changeSetting({commit}, data) {
    commit('CHANGE_SETTING', data)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

