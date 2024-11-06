import { createRouter, createWebHistory } from 'vue-router'
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

// Import des composants pour la gestion des livraisons
import DeliveryList from '@/components/delivery/DeliveryList.vue'
import AddDelivery from '@/components/delivery/AddDelivery.vue'
import EditDelivery from '@/components/delivery/EditDelivery.vue'
import ShowDelivery from '@/components/delivery/ShowDelivery.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/login', name: 'Login', component: Login },

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

  { path: '/parcels', name: 'ParcelList', component: ParcelList },
  { path: '/parcels/add', name: 'AddParcel', component: AddParcel },
  {
    path: '/parcels/edit/:id',
    name: 'EditParcel',
    component: EditParcel,
    props: true,
  },
  {
    path: '/parcels/show/:id',
    name: 'ShowParcel',
    component: ShowParcel,
    props: true,
  },

  { path: '/parcel-types', name: 'ParcelTypeList', component: ParcelTypeList },
  {
    path: '/parcel-types/add',
    name: 'AddParcelType',
    component: AddParcelType,
  },
  {
    path: '/parcel-types/edit/:id',
    name: 'EditParcelType',
    component: EditParcelType,
    props: true,
  },
  {
    path: '/parcel-types/show/:id',
    name: 'ShowParcelType',
    component: ShowParcelType,
    props: true,
  },

  { path: '/shipments', name: 'ShipmentList', component: ShipmentList },
  { path: '/shipments/add', name: 'AddShipment', component: AddShipment },
  {
    path: '/shipments/edit/:id',
    name: 'EditShipment',
    component: EditShipment,
    props: true,
  },
  {
    path: '/shipments/show/:id',
    name: 'ShowShipment',
    component: ShowShipment,
    props: true,
  },

  {
    path: '/payment-methods',
    name: 'PaymentMethodList',
    component: PaymentMethodList,
  },
  {
    path: '/payment-methods/add',
    name: 'AddPaymentMethod',
    component: AddPaymentMethod,
  },
  {
    path: '/payment-methods/edit/:id',
    name: 'EditPaymentMethod',
    component: EditPaymentMethod,
    props: true,
  },
  {
    path: '/payment-methods/show/:id',
    name: 'ShowPaymentMethod',
    component: ShowPaymentMethod,
    props: true,
  },

  { path: '/payments', name: 'PaymentList', component: PaymentList },
  { path: '/payments/add', name: 'AddPayment', component: AddPayment },
  {
    path: '/payments/edit/:id',
    name: 'EditPayment',
    component: EditPayment,
    props: true,
  },
  {
    path: '/payments/show/:id',
    name: 'ShowPayment',
    component: ShowPayment,
    props: true,
  },

  // Routes pour les livraisons
  { path: '/delivery', name: 'DeliveryList', component: DeliveryList },
  { path: '/delivery/add', name: 'AddDelivery', component: AddDelivery },
  {
    path: '/delivery/edit/:id',
    name: 'EditDelivery',
    component: EditDelivery,
    props: true,
  },
  {
    path: '/delivery/show/:id',
    name: 'ShowDelivery',
    component: ShowDelivery,
    props: true,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
