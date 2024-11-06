import { defineStore } from 'pinia';
import axios from 'axios';
import { ref } from 'vue';
import { useToast } from 'vue-toastification';

const toast = useToast();

export const useDeliveryStore = defineStore('deliveryStore', () => {
  const deliveries = ref([]);
  const loading = ref(false);

  const fetchDeliveries = async () => {
    loading.value = true;
    try {
      const response = await axios.get('http://localhost:3000/livraisons');
      deliveries.value = response.data;
    } catch (error) {
      console.error('Erreur lors du chargement des livraisons :', error);
      toast.error('Erreur lors du chargement des livraisons.');
    } finally {
      loading.value = false;
    }
  };

  const addDelivery = async (delivery) => {
    try {
      const response = await axios.post('http://localhost:3000/livraisons', delivery);
      deliveries.value.push(response.data);
      toast.success('Livraison ajoutée avec succès !'); 
    } catch (error) {
      console.error("Erreur lors de l'ajout de la livraison :", error);
      toast.error("Erreur lors de l'ajout de la livraison.");
    }
  };

  const updateDelivery = async (updatedDelivery) => {
    try {
      const response = await axios.put(
        `http://localhost:3000/livraisons/${updatedDelivery.id}`,
        updatedDelivery
      );
      const index = deliveries.value.findIndex(delivery => delivery.id === updatedDelivery.id);
      if (index !== -1) deliveries.value[index] = response.data;
      toast.success('Livraison modifiée avec succès !');
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la livraison :", error);
      toast.error("Erreur lors de la mise à jour de la livraison.");
    }
  };

  const deleteDelivery = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/livraisons/${id}`);
      deliveries.value = deliveries.value.filter(delivery => delivery.id !== id);
      toast.success('Livraison supprimée avec succès !');
    } catch (error) {
      console.error("Erreur lors de la suppression de la livraison :", error);
      toast.error("Erreur lors de la suppression de la livraison.");
    }
  };

  const deliveryById = (id) => {
    return deliveries.value.find(delivery => delivery.id === parseInt(id));
  };

  return {
    deliveries,
    loading,
    fetchDeliveries,
    addDelivery,
    updateDelivery,
    deleteDelivery,
    deliveryById,
  };
});
