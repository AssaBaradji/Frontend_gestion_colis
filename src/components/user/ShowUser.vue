<template>
    <div>
      <h2>Détails de l'Utilisateur</h2>
      <div v-if="user">
        <p><strong>Nom:</strong> {{ user.nom }}</p>
        <p><strong>Email:</strong> {{ user.email }}</p>
        <p><strong>Rôle:</strong> {{ user.role }}</p>
        <p><strong>Statut:</strong> {{ user.statut ? 'Actif' : 'Bloqué' }}</p>
        <router-link :to="'/users/edit/' + user.id">Modifier</router-link>
        <button @click="deleteUser(user.id)">Supprimer</button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue';
  import { useUserStore } from '@/store/userStore';
  import { useRouter, useRoute } from 'vue-router';
  
  const store = useUserStore();
  const router = useRouter();
  const route = useRoute();
  
  const user = computed(() => store.userById(route.params.id));
  
  const deleteUser = async (id) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      await store.deleteUser(id);
      alert('Utilisateur supprimé avec succès !');
      router.push('/users');
    }
  };
  </script>
  