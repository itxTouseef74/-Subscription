import { createRouter, createWebHistory } from 'vue-router';
import Navbar from '../components/Navbar.vue';
import Home from '../components/Home.vue';
import Login from '../components/Login.vue';
import Signup from '../components/Signup.vue';
import Games from '../components/Games.vue';
import Notifications from '../components/Notifications.vue';
import Subscription from '../components/Subscription.vue';

const routes = [
  {
    path: '/',
    component: Navbar,
    children: [
      { path: '', name: 'home', component: Home },
      { path: 'login', name: 'login', component: Login },
      { path: 'signup', name: 'signup', component: Signup },
      { path: 'games', name: 'games', component: Games, meta: { requiresAuth: true } },
      { path: 'subscription', name: 'subscription', component: Subscription, meta: { requiresAuth: true } },
      { path: 'notifications', name: 'notifications', component: Notifications, meta: { requiresAuth: true } },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token'); 
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!token) {
      next({ name: 'login' }); 
    } else {
  
      next(); 
    }
  } else {
    next(); 
  }
});

export function login(username, password) {
  
  if (username === 'user' && password === 'password') {
    const token = 'generated_jwt_token'; 
    localStorage.setItem('token', token); 
    router.push('/'); 
    return true; 
  }
  return false; 
}

export function logout() {
  localStorage.removeItem('token');
  router.push('/login'); 
}

export default router;
