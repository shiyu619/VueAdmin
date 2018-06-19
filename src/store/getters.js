const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  resources: state => state.user.resources,
  permission_routers: state => state.permission.routers,
  addRouters: state => state.permission.addRouters,
  userId: state => state.user.id
};
export default getters;
