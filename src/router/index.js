import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/store/authStore.js'
import Home from '@/views/Home.vue'
import Login from '@/views/Login.vue'
import AddUser from '@/components/user/AddUser.vue'
import EditUser from '@/components/user/EditUser.vue'
import ShowUser from '@/components/user/ShowUser.vue'
import UserList from '@/components/user/UserList.vue'

import ParcelList from '@/components/parcel/ParcelList.vue'
import AddParcel from '@/components/parcel/AddParcel.vue'
import EditParcel from '@/components/parcel/EditParcel.vue'
import ShowParcel from '@/components/parcel/ShowParcel.vue'

import ParcelTypeList from '@/components/parceltype/ParcelTypeList.vue'
import AddParcelType from '@/components/parceltype/AddParcelType.vue'
import EditParcelType from '@/components/parceltype/EditParcelType.vue'
import ShowParcelType from '@/components/parceltype/ShowParcelType.vue'

import ShipmentList from '@/components/shipment/ShipmentList.vue'
import AddShipment from '@/components/shipment/AddShipment.vue'
import EditShipment from '@/components/shipment/EditShipment.vue'
import ShowShipment from '@/components/shipment/ShowShipment.vue'

import PaymentMethodList from '@/components/paymentmethod/PaymentMethodList.vue'
import AddPaymentMethod from '@/components/paymentmethod/AddPaymentMethod.vue'
import EditPaymentMethod from '@/components/paymentmethod/EditPaymentMethod.vue'
import ShowPaymentMethod from '@/components/paymentmethod/ShowPaymentMethod.vue'

import PaymentList from '@/components/payment/paymentList.vue'
import AddPayment from '@/components/payment/AddPayment.vue'
import EditPayment from '@/components/payment/EditPayment.vue'
import ShowPayment from '@/components/payment/ShowPayment.vue'

import DeliveryList from '@/components/delivery/DeliveryList.vue'
import AddDelivery from '@/components/delivery/AddDelivery.vue'
import EditDelivery from '@/components/delivery/EditDelivery.vue'
import ShowDelivery from '@/components/delivery/ShowDelivery.vue'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', name: 'Login', component: Login },

  {
    path: '/home',
    name: 'Home',
    component: Home,
    meta: { requiresAuth: true },
  },
  {
    path: '/users',
    name: 'ListUser',
    component: UserList,
    meta: { requiresAuth: true },
  },

  {
    path: '/users',
    name: 'ListUser',
    component: UserList,
    meta: { requiresAuth: true },
  },
  {
    path: '/users/add',
    name: 'AddUser',
    component: AddUser,
    meta: { requiresAuth: true },
  },
  {
    path: '/users/edit/:id',
    name: 'EditUser',
    component: EditUser,
    props: true,
    meta: { requiresAuth: true },
  },
  {
    path: '/users/show/:id',
    name: 'ShowUser',
    component: ShowUser,
    props: true,
    meta: { requiresAuth: true },
  },

  {
    path: '/parcels',
    name: 'ParcelList',
    component: ParcelList,
    meta: { requiresAuth: true },
  },
  { path: '/parcels/add', name: 'AddParcel', component: AddParcel },
  {
    path: '/parcels/edit/:id',
    name: 'EditParcel',
    component: EditParcel,
    props: true,
    meta: { requiresAuth: true },
  },
  {
    path: '/parcels/show/:id',
    name: 'ShowParcel',
    component: ShowParcel,
    props: true,
    meta: { requiresAuth: true },
  },

  {
    path: '/parcel-types',
    name: 'ParcelTypeList',
    component: ParcelTypeList,
    meta: { requiresAuth: true },
  },
  {
    path: '/parcel-types/add',
    name: 'AddParcelType',
    component: AddParcelType,
    meta: { requiresAuth: true },
  },
  {
    path: '/parcel-types/edit/:id',
    name: 'EditParcelType',
    component: EditParcelType,
    props: true,
    meta: { requiresAuth: true },
  },
  {
    path: '/parcel-types/show/:id',
    name: 'ShowParcelType',
    component: ShowParcelType,
    props: true,
    meta: { requiresAuth: true },
  },

  {
    path: '/shipments',
    name: 'ShipmentList',
    component: ShipmentList,
    meta: { requiresAuth: true },
  },
  {
    path: '/shipments/add',
    name: 'AddShipment',
    component: AddShipment,
    meta: { requiresAuth: true },
  },
  {
    path: '/shipments/edit/:id',
    name: 'EditShipment',
    component: EditShipment,
    props: true,
    meta: { requiresAuth: true },
  },
  {
    path: '/shipments/show/:id',
    name: 'ShowShipment',
    component: ShowShipment,
    props: true,
    meta: { requiresAuth: true },
  },

  {
    path: '/payment-methods',
    name: 'PaymentMethodList',
    component: PaymentMethodList,
    meta: { requiresAuth: true },
  },
  {
    path: '/payment-methods/add',
    name: 'AddPaymentMethod',
    component: AddPaymentMethod,
    meta: { requiresAuth: true },
  },
  {
    path: '/payment-methods/edit/:id',
    name: 'EditPaymentMethod',
    component: EditPaymentMethod,
    props: true,
    meta: { requiresAuth: true },
  },
  {
    path: '/payment-methods/show/:id',
    name: 'ShowPaymentMethod',
    component: ShowPaymentMethod,
    props: true,
    meta: { requiresAuth: true },
  },

  {
    path: '/payments',
    name: 'PaymentList',
    component: PaymentList,
    meta: { requiresAuth: true },
  },
  {
    path: '/payments/add',
    name: 'AddPayment',
    component: AddPayment,
    meta: { requiresAuth: true },
  },
  {
    path: '/payments/edit/:id',
    name: 'EditPayment',
    component: EditPayment,
    props: true,
    meta: { requiresAuth: true },
  },
  {
    path: '/payments/show/:id',
    name: 'ShowPayment',
    component: ShowPayment,
    props: true,
    meta: { requiresAuth: true },
  },

  {
    path: '/delivery',
    name: 'DeliveryList',
    component: DeliveryList,
    meta: { requiresAuth: true },
  },
  {
    path: '/delivery/add',
    name: 'AddDelivery',
    component: AddDelivery,
    meta: { requiresAuth: true },
  },
  {
    path: '/delivery/edit/:id',
    name: 'EditDelivery',
    component: EditDelivery,
    props: true,
    meta: { requiresAuth: true },
  },
  {
    path: '/delivery/show/:id',
    name: 'ShowDelivery',
    component: ShowDelivery,
    props: true,
    meta: { requiresAuth: true },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'Login' })
  } else if (to.name === 'Login' && authStore.isAuthenticated) {
    next({ name: 'Home' })
  } else {
    next()
  }
})
export default router
