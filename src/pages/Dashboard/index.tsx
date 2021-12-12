import {Header} from '../../components/Header';
import api from '../../services/api';
import {Food} from '../../components/Food';
import {ModalAddFood} from '../../components/ModalAddFood';
import { ModalEditFood } from '../../components/ModalEditFood';
import { FoodsContainer } from './styles';
import { useEffect, useState } from 'react';

interface Foods{
  id: number;
  name: string;
  description: string;
  price: string;
  available: boolean;
  image: string;
}
type NewFood = Omit<Foods, 'id'| 'available'>

export function Dashboard (){

  

  const [foods, setFoods] = useState<Foods[]>([]);
  const [editingFood, setEditingFood] = useState<Foods>();
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
 
  useEffect(()=>{
    api.get('/foods').then(response => setFoods(response.data));
    
  }, [])
  
  async function handleAddFood (newFood: NewFood){

    try {
      const response = await api.post('/foods', {
        ...newFood,
        available: true,
      });

      setFoods([...foods, response.data])

    } catch (err) {
      console.log(err);
    }
  }

   async function handleUpdateFood (food: NewFood) {
    //const { foods, editingFood } = this.state;

      try {
        const foodUpdated = await api.put(
          `/foods/${editingFood?.id}`, 
          { ...editingFood, ...food }, 
        );
  

      const foodsUpdated = foods.map(f =>
        f.id !== foodUpdated.data.id ? f : foodUpdated.data,
      );

      setFoods(foodsUpdated)
      } catch (err) {
        console.log(err);
      } 
  }

    async function handleDeleteFood (id:number) {
  
    await api.delete(`/foods/${id}`);

    const foodsFiltered = foods.filter(food => food.id !== id);

    setFoods(foodsFiltered);
  }

   function toggleModal() {
    setModalOpen(!modalOpen);
  }

  async function toggleEditModal (){
    setEditModalOpen(false);
  }

  function handleEditFood (editFood: Foods) {
      setEditingFood(editFood);
      setEditModalOpen(true);
  }
    return (
      <>
        <Header openModal={toggleModal} />
        <ModalAddFood
          isOpen={modalOpen}
          setIsOpen={toggleModal}
          handleAddFood={handleAddFood}
        />
        <ModalEditFood
          isOpen={editModalOpen}
          setIsOpen={toggleEditModal}
          editingFood={editingFood}
          handleUpdateFood={handleUpdateFood}
        />

        <FoodsContainer data-testid="foods-list">
          {foods &&
            foods.map(food => (
              <Food
                food={food}
                
                key={food.id}
                handleDeleteFood={handleDeleteFood}
                handleEditFood={handleEditFood}
              />
              
            ))}
        </FoodsContainer>
      </>
    );
};

export default Dashboard;
