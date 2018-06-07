const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  org: state => state.user.org,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  addRouters: state => state.permission.addRouters,
  routers: state => state.permission.routers,
  roleA: state => state.permission.roleA
}
export default getters
