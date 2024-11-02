import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import AddUser from '@/components/user/AddUser.vue'
import EditUser from '@/components/user/EditUser.vue'
import ShowUser from '@/components/user/ShowUser.vue'
import UserList from '@/components/user/UserList.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },,
  { path: '/users', name: 'ListUser', component: UserList },
  { path: '/users/add', name: 'AddUser', component: AddUser },
  {
    path: '/users/edit/:id',
    name: 'EditUser',
    component: EditUser,
    props: true,
  },
  {
    path: '/users/show/:id',
    name: 'ShowUser',
    component: ShowUser,
    props: true,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
