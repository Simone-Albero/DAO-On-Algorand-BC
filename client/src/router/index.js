import { createRouter, createWebHistory } from 'vue-router'
import store from '../store/store'

import Home from '../views/Home.vue'
import About from '../views/About.vue'
import Login from '../views/Login.vue'
import NotFound from '../views/NotFound.vue'

import DaoCreate from '../views/dao/Create.vue'
import DaoDetails from '../views/dao/Details.vue'
import DaoHome from '../views/dao/Home.vue'
import DaoUpdate from '../views/dao/Update.vue'
import DaoAll from '../views/dao/All.vue'

import ProposalCreate from '../views/proposal/Create.vue'
import ProposalDetails from '../views/proposal/Details.vue'
import ProposalHome from '../views/proposal/Home.vue'
import ProposalVote from '../views/proposal/Vote.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/about',
    name: 'about',
    component: About
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },

  {
    path: '/dao/create',
    name: 'daoCreate',
    component: DaoCreate
  },
  {
    path: '/dao/:id',
    name: 'daoDetails',
    component: DaoDetails,
    props: true
  },
  {
    path: '/dao/all',
    name: 'daoAll',
    component: DaoAll
  },
  {
    path: '/dao',
    name: 'daoHome',
    component: DaoHome
  },
  {
    path: '/dao/:field/:id',
    name: 'daoUpdate',
    component: DaoUpdate,
    props: true
  },

  {
    path: '/proposal/create/:daoAppId',
    name: 'proposalCreate',
    component: ProposalCreate,
    props: true
  },
  {
    path: '/proposal',
    name: 'proposalHome',
    component: ProposalHome,
  },
  {
    path: '/proposal/vote/:id',
    name: 'proposalVote',
    component: ProposalVote,
    props: true
  },
  {
    path: '/proposal/:id',
    name: 'proposalDetails',
    component: ProposalDetails,
    props: true
  },

  //catch 404
  {
    path: '/:pathMatch(.*)*',
    name: 'notFound',
    component: NotFound
  }

]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})


router.beforeEach((to, from, next) => {
  store.commit('storeInit');
  //redirect user to log in page if not logged in 
  if (store.state.walletAddr == 0 && to.name !== 'login' && to.name !== 'about') {
    next({ name: 'login' });
  }
  else {
      next();
  }

})

export default router
