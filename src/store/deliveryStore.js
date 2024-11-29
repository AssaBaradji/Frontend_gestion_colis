import { defineStore } from 'pinia';
import axios from 'axios';
import { ref } from 'vue';
import { useAuthStore } from './authStore';
import { useUserStore } from './userStore';
import { useShipmentStore } from './shipmentStore';

export const useDeliveryStore = defineStore('deliveryStore', () => {
  const deliveries = ref([]);
  const loading = ref(false);
  const auth = useAuthStore();
  const authToken = `Bearer ${auth.token}`;

  const userStore = useUserStore();
  const shipmentStore = useShipmentStore();

  const fetchDeliveries = async () => {
    loading.value = true;
    try {
      await Promise.all([
        userStore.fetchUsers(),
        shipmentStore.fetchShipments()
      ]);

      const response = await axios.get('http://localhost:3000/livraisons', {
        headers: {
          Authorization: authToken
        }
      });

      deliveries.value = response.data.map(delivery => ({
        ...delivery,
        utilisateur: userStore.users.find(
          user => user.id === delivery.utilisateurId
        ) || { nom: 'Non attribué' },
        expedition: shipmentStore.shipments.find(
          shipment => shipment.id === delivery.expeditionId
        ) || { nom_destinataire: 'Non attribué' }
      }));
      return { success: true };
    } catch (error) {
      console.error('Erreur lors du chargement des livraisons :', error);
      return { success: false, error };
    } finally {
      loading.value = false;
    }
  };

  const addDelivery = async (delivery) => {
    try {
      const response = await axios.post('http://localhost:3000/livraisons', delivery, {
        headers: {
          Authorization: authToken
        }
      });

      deliveries.value.push({
        ...response.data,
        utilisateur: userStore.users.find(
          user => user.id === response.data.utilisateurId
        ) || { nom: 'Non attribué' },
        expedition: shipmentStore.shipments.find(
          shipment => shipment.id === response.data.expeditionId
        ) || { code_colis: 'Non attribué' }
      });

      await fetchDeliveries();
      return { success: true };
    } catch (error) {
      console.error("Erreur lors de l'ajout de la livraison :", error);
      return { success: false, error };
    }
  };

  const updateDelivery = async (updatedDelivery) => {
    try {
      const response = await axios.put(
        `http://localhost:3000/livraisons/${updatedDelivery.id}`,
        updatedDelivery, {
          headers: {
            Authorization: authToken
          }
        }
      );

      const index = deliveries.value.findIndex(delivery => delivery.id === updatedDelivery.id);
      if (index !== -1) {
        deliveries.value[index] = {
          ...response.data,
          utilisateur: userStore.users.find(
            user => user.id === response.data.utilisateurId
          ) || { nom: 'Non attribué' },
          expedition: shipmentStore.shipments.find(
            shipment => shipment.id === response.data.expeditionId
          ) || { code_colis: 'Non attribué' }
        };
        return { success: true };
      }
      return { success: false, error: 'Livraison non trouvée' };
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la livraison :", error);
      return { success: false, error };
    }
  };

  const deleteDelivery = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/livraisons/${id}`, {
        headers: {
          Authorization: authToken
        }
      });
      deliveries.value = deliveries.value.filter(delivery => delivery.id !== id);
      return { success: true };
    } catch (error) {
      console.error("Erreur lors de la suppression de la livraison :", error);
      return { success: false, error };
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
