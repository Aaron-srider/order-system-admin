import {login, logout, getInfo} from '@/api/user'
import {getToken, setToken, removeToken} from '@/utils/auth'
import {resetRouter} from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: ''
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  }
}

const actions = {
  // // user login
  // login({commit}, userInfo) {
  //   const {username, password} = userInfo
  //   return new Promise((resolve, reject) => {
  //     login({username: username.trim(), password: password}).then(response => {
  //       const {data} = response
  //       commit('SET_TOKEN', data.token)
  //       setToken(data.token)
  //       resolve()
  //     }).catch(error => {
  //       reject(error)
  //     })
  //   })
  // },


  // async login ({commit}, code) {
  //
  //   const response = await login(code)
  //
  //   if (response.code === 104) {
  //     return Promise.reject(response)
  //   } else if (response.code === 200) {
  //     const token = response.data.detailInfo.token
  //
  //     console.log(token)
  //
  //     commit('SET_TOKEN', token)
  //     setToken(token)
  //
  //     console.log("token set")
  //     return Promise.resolve(response)
  //   }
  // },

  login({commit}, code) {


    return new Promise((resolve, reject) => {
      login(code)
        .then(response => {

          if (response.code === 200) {
            const token = response.data.token

            commit('SET_TOKEN', token)
            setToken(token)
            resolve(response)
          } else {
            reject(response)
          }


        }).catch(error => {
        reject(error)
      })
    })
  },


  // get user info
  getInfo({commit, state}) {
    return new Promise((resolve, reject) => {
      getInfo(state.token)
        .then(response => {
          const {data} = response

          if (!data) {
            return reject('Verification failed, please Login again.')
          }

          const {name, avatar} = data

          commit('SET_NAME', name)
          commit('SET_AVATAR', avatar)
          resolve(data)
        }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({commit, state}) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({commit}) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

