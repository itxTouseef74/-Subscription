import { createRouter, createWebHistory } from 'vue-router';
import Navbar from '../components/Navbar.vue';
import Home from '../components/Home.vue';
import Login from '../components/Login.vue';
import Signup from '../components/Signup.vue';
import Games from '../components/Games.vue';
import Notifications from '../components/Notifications.vue';

const routes = [
  {
    path: '/',
    component: Navbar,
    children: [
      { path: '', name: 'home', component: Home },
      { path: '/login', name: 'login', component: Login },
      { path: '/signup', name: 'signup', component: Signup },
      { path: '/games', name: 'games', component: Games },
      { path: '/notifications', name: 'notifications', component: Notifications },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
